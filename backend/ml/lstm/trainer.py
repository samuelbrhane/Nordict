# ml/lstm/trainer.py

"""
Train LSTM model with tuned hyperparameters.

Usage:
    python -m ml.lstm.trainer
    python -m ml.lstm.trainer --coin BTC-USD --horizon 24H
"""

import os
import sys
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
from datetime import datetime
from django.utils import timezone

import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

from markets.models import Market
from forecasts.models import MLModel
from ml.lstm.config import TRAINING_TODAY, DEFAULT_PARAMS, HORIZON_CONFIG
from ml.lstm.dataset import prepare_lstm_dataset
from ml.lstm.tuner import build_lstm_model, add_lagged_features
from ml.storage.model_store import save_model as save_model_to_storage


# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIGS_DIR = os.path.join(BASE_DIR, 'configs')


def load_best_params(coin: str, horizon: str) -> dict:
    """Load tuned hyperparameters."""
    config_path = os.path.join(CONFIGS_DIR, f'best_params_{coin}_{horizon}.json')
    
    if not os.path.exists(config_path):
        raise FileNotFoundError(
            f"No params found for {coin} {horizon}. Run tuner first:\n"
            f"  python -m ml.lstm.tuner --coin {coin} --horizon {horizon}"
        )
    
    with open(config_path, 'r') as f:
        data = json.load(f)
    
    # Remove metrics from params
    params = {k: v for k, v in data['best_params'].items() if k != 'metrics'}
    return params


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculate model performance metrics."""
    
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))
    
    mask = y_true != 0
    if mask.sum() > 0:
        mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    else:
        mape = 0
    
    pred_direction = (y_pred > 0).astype(int)
    actual_direction = (y_true > 0).astype(int)
    directional_accuracy = np.mean(pred_direction == actual_direction) * 100
    
    # R-squared
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
    
    # Correlation
    correlation = np.corrcoef(y_true, y_pred)[0, 1] if len(y_true) > 1 else 0
    
    return {
        'mse': float(mse),
        'rmse': float(rmse),
        'mae': float(mae),
        'mape': float(mape),
        'directional_accuracy': float(directional_accuracy),
        'r2': float(r2),
        'correlation': float(correlation),
    }


def train_lstm(
    coin: str = None,
    horizon: str = None,
    use_tuned_params: bool = True,
    epochs: int = 100,
    save_model: bool = True,
) -> tuple:
    """
    Train LSTM model for a coin/horizon.
    
    Args:
        coin: Coin symbol (default from TRAINING_TODAY)
        horizon: Horizon (default from TRAINING_TODAY)
        use_tuned_params: Use tuned hyperparameters
        epochs: Max training epochs
        save_model: Save model to storage and DB
    
    Returns:
        (model, metrics, model_path, db_model)
    """
    coin = coin or TRAINING_TODAY['coin']
    horizon = horizon or TRAINING_TODAY['horizon']
    
    print(f"\n{'='*60}")
    print(f"TRAINING LSTM: {coin} {horizon}")
    print(f"{'='*60}")
    
    # Load hyperparameters
    if use_tuned_params:
        try:
            params = load_best_params(coin, horizon)
            print("Using tuned hyperparameters")
        except FileNotFoundError as e:
            print(f"Warning: {e}")
            print("Using default hyperparameters")
            params = DEFAULT_PARAMS.copy()
    else:
        params = DEFAULT_PARAMS.copy()
        print("Using default hyperparameters")
    
    print(f"\nParameters:")
    for key, value in params.items():
        print(f"  {key}: {value}")
    
    # Load market
    market = Market.objects.filter(symbol=coin).first()
    if not market:
        raise ValueError(f"Market not found: {coin}")
    
    # Prepare dataset with params
    print("\nPreparing dataset...")
    sequence_length = params.get('sequence_length', 72)
    scaler_type = params.get('normalize_method', 'standard')
    use_returns_only = params.get('use_returns_only', False)
    feature_lag = params.get('feature_lag', 0)
    
    data = prepare_lstm_dataset(
        market=market,
        horizon=horizon,
        sequence_length=sequence_length,
        train_ratio=0.8,
        scaler_type=scaler_type,
        use_returns_only=use_returns_only,
        feature_lag=feature_lag,
    )
    
    X_train = data['X_train']
    X_test = data['X_test']
    y_train = data['y_train_return']
    y_test = data['y_test_return']
    scaler = data['scaler']
    feature_names = data['feature_names']
    
    input_shape = (X_train.shape[1], X_train.shape[2])
    
    # Build model
    print("\nBuilding model...")
    model = build_lstm_model(
        input_shape=input_shape,
        params=params,
    )
    
    model.summary()
    
    # Callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=params.get('early_stopping_patience', 10),
            restore_best_weights=True,
            verbose=1,
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-6,
            verbose=1,
        ),
    ]
    
    # Train
    print("\nTraining...")
    training_started = timezone.now()
    
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=epochs,
        batch_size=params.get('batch_size', 64),
        callbacks=callbacks,
        verbose=1,
    )
    
    training_completed = timezone.now()
    training_duration = (training_completed - training_started).total_seconds()
    
    print(f"\nTraining completed in {training_duration:.1f} seconds")
    print(f"Epochs trained: {len(history.history['loss'])}")
    
    # Evaluate
    print("\nEvaluating...")
    train_pred = model.predict(X_train, verbose=0).flatten()
    test_pred = model.predict(X_test, verbose=0).flatten()
    
    train_metrics = calculate_metrics(y_train, train_pred)
    test_metrics = calculate_metrics(y_test, test_pred)
    
    print(f"\nTraining Metrics:")
    print(f"  RMSE: {train_metrics['rmse']:.6f}")
    print(f"  MAE: {train_metrics['mae']:.6f}")
    print(f"  Direction Accuracy: {train_metrics['directional_accuracy']:.2f}%")
    
    print(f"\nTest Metrics:")
    print(f"  RMSE: {test_metrics['rmse']:.6f}")
    print(f"  MAE: {test_metrics['mae']:.6f}")
    print(f"  MAPE: {test_metrics['mape']:.2f}%")
    print(f"  Direction Accuracy: {test_metrics['directional_accuracy']:.2f}%")
    print(f"  R²: {test_metrics['r2']:.4f}")
    print(f"  Correlation: {test_metrics['correlation']:.4f}")
    
    model_path = None
    db_model = None
    
    if save_model:
        version = timezone.now().strftime('%Y%m%d_%H%M%S')
        model_filename = f'lstm_{coin}_{horizon}_{version}.pkl'
        
        # Save model data
        model_data = {
            'model': model,
            'scaler': scaler,
            'scaler_type': scaler_type,
            'feature_names': feature_names,
            'sequence_length': sequence_length,
            'use_returns_only': use_returns_only,
            'feature_lag': feature_lag,
            'coin': coin,
            'horizon': horizon,
            'params': params,
            'metrics': test_metrics,
            'trained_at': training_completed.isoformat(),
            'model_type': 'lstm',
        }
        
        model_path = save_model_to_storage(model_data, model_filename)
        
        print(f"\nModel saved to: {model_path}")
        
        # Save to database
        config = HORIZON_CONFIG[horizon]
        
        db_model = MLModel.objects.create(
            name='LSTM',
            version=version,
            model_type=MLModel.ModelType.LSTM,
            horizon=horizon,
            market=market,
            status=MLModel.Status.CANDIDATE,
            training_started_at=training_started,
            training_completed_at=training_completed,
            artifact_path=model_path,
            mae=test_metrics['mae'],
            rmse=test_metrics['rmse'],
            mape=test_metrics['mape'],
            directional_accuracy=test_metrics['directional_accuracy'],
            r2=test_metrics['r2'],
            correlation=test_metrics['correlation'],
            config={
                'hyperparameters': params,
                'train_metrics': train_metrics,
                'test_metrics': test_metrics,
                'sequence_length': sequence_length,
                'scaler_type': scaler_type,
                'use_returns_only': use_returns_only,
                'feature_lag': feature_lag,
                'input_shape': list(input_shape),
                'n_features': len(feature_names),
                'epochs_trained': len(history.history['loss']),
                'training_duration_seconds': training_duration,
                'final_train_loss': float(history.history['loss'][-1]),
                'final_val_loss': float(history.history['val_loss'][-1]),
            },
            description=f"LSTM model for {coin} {horizon}. "
                        f"Seq={sequence_length}, Features={len(feature_names)}, "
                        f"Layers={params.get('lstm_layers', 2)}, Units={params.get('lstm_units', 128)}.",
        )
        
        print(f"Model registered in database: ID={db_model.id}")
        print(f"\nTo promote to production:")
        print(f"  python -m ml.training.trainer --promote {db_model.id}")
    
    return model, test_metrics, model_path, db_model


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Train LSTM model')
    parser.add_argument('--coin', type=str, help='Coin symbol (e.g., BTC-USD)')
    parser.add_argument('--horizon', type=str, help='Horizon (24H, 30D, 12W, 12M)')
    parser.add_argument('--epochs', type=int, default=100, help='Max epochs')
    parser.add_argument('--no-tuned', action='store_true', help='Use default params')
    args = parser.parse_args()
    
    train_lstm(
        coin=args.coin,
        horizon=args.horizon,
        use_tuned_params=not args.no_tuned,
        epochs=args.epochs,
    )