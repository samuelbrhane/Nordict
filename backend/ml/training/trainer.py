# ml/training/trainer.py

"""
Train XGBoost model with tuned hyperparameters.
Skips coins that already have LSTM models for the horizon.

Usage:
    python -m ml.training.trainer --horizon 24H
    python -m ml.training.trainer --all
"""

import os
import sys
import json
import pickle
from ml.storage.model_store import save_model as save_model_to_storage
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
from datetime import datetime
from django.utils import timezone
from xgboost import XGBRegressor

from markets.models import Market
from forecasts.models import MLModel
from ml.features.engineer import prepare_multi_market_dataset


# Horizon configurations
HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'horizon': 24},
    '30D': {'timeframe': '1d', 'horizon': 30},
    '12W': {'timeframe': '1w', 'horizon': 12},
    '12M': {'timeframe': '1M', 'horizon': 12},
}

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIGS_DIR = os.path.join(BASE_DIR, 'configs')
MODELS_DIR = os.path.join(BASE_DIR, 'models')


def get_xgboost_markets(horizon: str) -> list:
    """
    Get markets that should use XGBoost (no LSTM model exists).
    
    Args:
        horizon: Prediction horizon
    
    Returns:
        List of Market objects without LSTM models for this horizon
    """
    all_markets = Market.objects.filter(status='active')
    
    lstm_market_ids = MLModel.objects.filter(
        model_type=MLModel.ModelType.LSTM,
        horizon=horizon,
        status=MLModel.Status.PRODUCTION
    ).values_list('market_id', flat=True)
    
    xgboost_markets = all_markets.exclude(id__in=lstm_market_ids)
    
    return list(xgboost_markets)


def load_best_params(horizon: str) -> dict:
    """Load saved hyperparameters for a horizon."""
    
    params_file = os.path.join(CONFIGS_DIR, f'best_params_{horizon}.json')
    
    if not os.path.exists(params_file):
        raise FileNotFoundError(
            f"No params file found for {horizon}. Run tuner first:\n"
            f"  python -m ml.training.tuner --horizon {horizon}"
        )
    
    with open(params_file, 'r') as f:
        data = json.load(f)
    
    return data['best_params']


def get_default_params() -> dict:
    """Default parameters if no tuning done."""
    
    return {
        'n_estimators': 200,
        'max_depth': 5,
        'learning_rate': 0.05,
        'subsample': 0.8,
        'colsample_bytree': 0.8,
        'min_child_weight': 3,
        'gamma': 0.1,
        'reg_alpha': 0.01,
        'reg_lambda': 1.5,
    }


def calculate_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """Calculate comprehensive model performance metrics."""
    
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))
    
    mask = y_true != 0
    if mask.sum() > 0:
        mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    else:
        mape = 0
    
    actual_direction = (y_true > 0).astype(int)
    predicted_direction = (y_pred > 0).astype(int)
    directional_accuracy = np.mean(actual_direction == predicted_direction) * 100
    
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    r2 = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
    
    median_ae = np.median(np.abs(y_true - y_pred))
    max_error = np.max(np.abs(y_true - y_pred))
    
    errors = np.abs(y_true - y_pred)
    p90_error = np.percentile(errors, 90)
    p95_error = np.percentile(errors, 95)
    
    bias = np.mean(y_pred - y_true)
    correlation = np.corrcoef(y_true, y_pred)[0, 1] if len(y_true) > 1 else 0
    
    return {
        'mse': float(mse),
        'rmse': float(rmse),
        'mae': float(mae),
        'mape': float(mape),
        'directional_accuracy': float(directional_accuracy),
        'r2': float(r2),
        'median_ae': float(median_ae),
        'max_error': float(max_error),
        'p90_error': float(p90_error),
        'p95_error': float(p95_error),
        'bias': float(bias),
        'correlation': float(correlation),
    }


def train_model(
    horizon: str,
    use_tuned_params: bool = True,
    save_model: bool = True,
) -> tuple:
    """
    Train XGBoost model for a horizon.
    Only uses markets without LSTM models.
    
    Args:
        horizon: '24H', '30D', '12W', '12M'
        use_tuned_params: Use saved hyperparameters
        save_model: Save model to file and database
    
    Returns:
        (model, metrics, model_path, db_model)
    """
    config = HORIZON_CONFIG.get(horizon)
    if not config:
        raise ValueError(f"Invalid horizon: {horizon}")
    
    print(f"\n{'='*50}")
    print(f"TRAINING XGBoost MODEL FOR {horizon}")
    print(f"{'='*50}")
    
    # Load hyperparameters
    if use_tuned_params:
        try:
            params = load_best_params(horizon)
            print("Using tuned hyperparameters")
        except FileNotFoundError as e:
            print(f"Warning: {e}")
            print("Using default hyperparameters")
            params = get_default_params()
    else:
        params = get_default_params()
        print("Using default hyperparameters")
    
    print(f"\nParameters:")
    for key, value in params.items():
        print(f"  {key}: {value}")
    
    # Get markets without LSTM models
    markets = get_xgboost_markets(horizon)
    
    all_markets_count = Market.objects.filter(status='active').count()
    lstm_markets_count = all_markets_count - len(markets)
    
    print(f"\nTotal markets: {all_markets_count}")
    print(f"LSTM markets (skipped): {lstm_markets_count}")
    print(f"XGBoost markets (training): {len(markets)}")
    
    if not markets:
        print("\nNo markets need XGBoost - all have LSTM models!")
        return None, None, None, None
    
    # Prepare dataset
    print("\nPreparing dataset...")
    X_train, X_test, y_train, y_test = prepare_multi_market_dataset(
        markets=markets,
        timeframe=config['timeframe'],
        horizon=config['horizon'],
        train_ratio=0.8,
    )
    
    feature_names = list(X_train.columns)
    
    # Create model
    print("\nTraining model...")
    training_started = timezone.now()
    
    model = XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1,
        **params
    )
    
    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=False,
    )
    
    training_completed = timezone.now()
    training_duration = (training_completed - training_started).total_seconds()
    
    print(f"Training completed in {training_duration:.1f} seconds")
    
    # Evaluate
    print("\nEvaluating model...")
    train_pred = model.predict(X_train)
    test_pred = model.predict(X_test)
    
    train_metrics = calculate_metrics(y_train.values, train_pred)
    test_metrics = calculate_metrics(y_test.values, test_pred)
    
    print(f"\nTraining Metrics:")
    print(f"  RMSE: {train_metrics['rmse']:.6f}")
    print(f"  MAE: {train_metrics['mae']:.6f}")
    print(f"  Direction Accuracy: {train_metrics['directional_accuracy']:.2f}%")
    
    print(f"\nTest Metrics:")
    print(f"  RMSE: {test_metrics['rmse']:.6f}")
    print(f"  MAE: {test_metrics['mae']:.6f}")
    print(f"  MAPE: {test_metrics['mape']:.2f}%")
    print(f"  Direction Accuracy: {test_metrics['directional_accuracy']:.2f}%")
    
    # Feature importance
    importance = model.feature_importances_
    importance_dict = dict(zip(feature_names, importance))
    top_features = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)[:10]
    
    print(f"\nTop 10 Features:")
    for feat, imp in top_features:
        print(f"  {feat}: {imp:.4f}")
    
    model_path = None
    db_model = None
    
    if save_model:
        version = timezone.now().strftime('%Y%m%d_%H%M%S')
        model_filename = f'xgboost_{horizon}_{version}.pkl'
        
        model_data = {
            'model': model,
            'feature_names': feature_names,
            'horizon': horizon,
            'config': config,
            'params': params,
            'metrics': test_metrics,
            'trained_at': training_completed.isoformat(),
            'model_type': 'xgboost',
        }
        
        model_path = save_model_to_storage(model_data, model_filename)
        
        print(f"\nModel saved to: {model_path}")
        
        # Save to database with model_type
        db_model = MLModel.objects.create(
            name='XGBoost',
            version=version,
            model_type=MLModel.ModelType.XGBOOST,
            horizon=horizon,
            market=None,  # XGBoost is general, not coin-specific
            status=MLModel.Status.CANDIDATE,
            training_started_at=training_started,
            training_completed_at=training_completed,
            training_data_start=min(X_train.index.min(), X_test.index.min()).date(),
            training_data_end=max(X_train.index.max(), X_test.index.max()).date(),
            artifact_path=model_path,
            mae=test_metrics['mae'],
            rmse=test_metrics['rmse'],
            mape=test_metrics['mape'],
            directional_accuracy=test_metrics['directional_accuracy'],
            config={
                'hyperparameters': params,
                'train_metrics': train_metrics,
                'test_metrics': test_metrics,
                'feature_importance': dict(zip(feature_names, model.feature_importances_.tolist())),
                'dataset_info': {
                    'train_samples': len(X_train),
                    'test_samples': len(X_test),
                    'n_features': len(feature_names),
                    'n_markets': len(markets),
                    'lstm_markets_skipped': lstm_markets_count,
                },
            },
            description=f"XGBoost model for {horizon} horizon. {len(markets)} markets, {len(feature_names)} features.",
        )
        
        print(f"Model registered in database: ID={db_model.id}")
    
    return model, test_metrics, model_path, db_model


def promote_model(model_id: int):
    """Promote a candidate model to production."""
    
    model = MLModel.objects.get(id=model_id)
    
    # Demote current production model (same type, same horizon, same market if LSTM)
    demote_filter = {
        'model_type': model.model_type,
        'horizon': model.horizon,
        'status': MLModel.Status.PRODUCTION,
    }
    
    # For LSTM, also filter by market (coin-specific)
    if model.model_type == MLModel.ModelType.LSTM:
        demote_filter['market'] = model.market
    
    MLModel.objects.filter(**demote_filter).update(status=MLModel.Status.DEPRECATED)
    
    # Promote new model
    model.status = MLModel.Status.PRODUCTION
    model.save(update_fields=['status'])
    
    market_info = f" for {model.market.symbol}" if model.market else ""
    print(f"Model {model_id} ({model.model_type}{market_info}) promoted to PRODUCTION")
    print(f"Previous production models deprecated")


def train_all_horizons(use_tuned_params: bool = True):
    """Train models for all horizons."""
    
    results = {}
    
    for horizon in ['24H', '30D', '12W', '12M']:
        try:
            model, metrics, path, db_model = train_model(
                horizon,
                use_tuned_params=use_tuned_params
            )
            if db_model:
                results[horizon] = {
                    'metrics': metrics,
                    'path': path,
                    'db_id': db_model.id,
                }
        except Exception as e:
            print(f"\nError training {horizon}: {e}")
            continue
    
    print(f"\n{'='*50}")
    print("ALL HORIZONS COMPLETE")
    print(f"{'='*50}")
    
    for horizon, result in results.items():
        print(f"\n{horizon}:")
        print(f"  RMSE: {result['metrics']['rmse']:.6f}")
        print(f"  Direction Accuracy: {result['metrics']['directional_accuracy']:.2f}%")
        print(f"  Model ID: {result['db_id']}")
    
    return results


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Train XGBoost model')
    parser.add_argument('--horizon', type=str, help='Horizon to train (24H, 30D, 12W, 12M)')
    parser.add_argument('--all', action='store_true', help='Train all horizons')
    parser.add_argument('--no-tuned', action='store_true', help='Use default params instead of tuned')
    parser.add_argument('--promote', type=int, help='Promote model ID to production')
    args = parser.parse_args()
    
    if args.promote:
        promote_model(args.promote)
    elif args.all:
        train_all_horizons(use_tuned_params=not args.no_tuned)
    elif args.horizon:
        train_model(args.horizon, use_tuned_params=not args.no_tuned)
    else:
        print("Usage:")
        print("  python -m ml.training.trainer --horizon 24H")
        print("  python -m ml.training.trainer --all")
        print("  python -m ml.training.trainer --horizon 24H --no-tuned")
        print("  python -m ml.training.trainer --promote 5")