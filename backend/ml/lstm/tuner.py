# ml/lstm/tuner.py

"""
Hyperparameter tuning for LSTM with checkpoint/resume support.

Usage:
    python -m ml.lstm.tuner
    python -m ml.lstm.tuner --resume
"""

import os
import sys
import json
import random
import math
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import (
    LSTM, Dense, Dropout, Bidirectional, 
    Input, Attention, Concatenate, LayerNormalization
)
from tensorflow.keras.optimizers import Adam, RMSprop, AdamW
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

from markets.models import Market
from ml.lstm.config import TRAINING_TODAY, PARAM_SPACE, HORIZON_CONFIG
from ml.lstm.dataset import prepare_lstm_dataset


# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHECKPOINTS_DIR = os.path.join(BASE_DIR, 'checkpoints')
CONFIGS_DIR = os.path.join(BASE_DIR, 'configs')


def get_checkpoint_path(coin: str, horizon: str) -> str:
    """Get checkpoint file path."""
    os.makedirs(CHECKPOINTS_DIR, exist_ok=True)
    return os.path.join(CHECKPOINTS_DIR, f'{coin}_{horizon}_tuning.json')


def load_checkpoint(coin: str, horizon: str) -> dict:
    """Load checkpoint if exists."""
    path = get_checkpoint_path(coin, horizon)
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return None


def save_checkpoint(coin: str, horizon: str, data: dict):
    """Save checkpoint."""
    path = get_checkpoint_path(coin, horizon)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)


def sample_param(key: str, space):
    """
    Sample a parameter from the search space.
    
    Handles:
    - List: random choice
    - Tuple (min, max): random uniform (log scale for learning_rate)
    """
    if isinstance(space, list):
        return random.choice(space)
    elif isinstance(space, tuple):
        min_val, max_val = space
        
        # Log scale for learning rate
        if key == 'learning_rate':
            log_min = math.log10(min_val)
            log_max = math.log10(max_val)
            return 10 ** random.uniform(log_min, log_max)
        
        # Integer for units
        if key in ['lstm_units', 'dense_units']:
            return random.randint(min_val, max_val)
        
        # Float for others
        return random.uniform(min_val, max_val)
    else:
        return space


def random_params() -> dict:
    """Generate random hyperparameters from search space."""
    params = {}
    for key, space in PARAM_SPACE.items():
        params[key] = sample_param(key, space)
    
    # Round certain values
    if 'learning_rate' in params:
        params['learning_rate'] = round(params['learning_rate'], 6)
    if 'dropout' in params:
        params['dropout'] = round(params['dropout'], 2)
    if 'recurrent_dropout' in params:
        params['recurrent_dropout'] = round(params['recurrent_dropout'], 2)
    if 'l2_reg' in params:
        params['l2_reg'] = round(params['l2_reg'], 5)
    
    return params


def get_optimizer(name: str, learning_rate: float):
    """Get optimizer by name."""
    if name == 'adam':
        return Adam(learning_rate=learning_rate)
    elif name == 'rmsprop':
        return RMSprop(learning_rate=learning_rate)
    elif name == 'adamw':
        return AdamW(learning_rate=learning_rate)
    else:
        return Adam(learning_rate=learning_rate)


def get_scaler(method: str):
    """Get scaler by method name."""
    if method == 'standard':
        return StandardScaler()
    elif method == 'minmax':
        return MinMaxScaler()
    elif method == 'robust':
        return RobustScaler()
    else:
        return StandardScaler()


def build_lstm_model(
    input_shape: tuple,
    params: dict,
) -> Model:
    """
    Build LSTM model with all hyperparameters.
    
    Args:
        input_shape: (sequence_length, n_features)
        params: Hyperparameter dict
    
    Returns:
        Compiled Keras model
    """
    lstm_layers = params.get('lstm_layers', 2)
    lstm_units = params.get('lstm_units', 128)
    dense_layers = params.get('dense_layers', 1)
    dense_units = params.get('dense_units', 64)
    dropout = params.get('dropout', 0.2)
    recurrent_dropout = params.get('recurrent_dropout', 0.1)
    l2_reg = params.get('l2_reg', 0.001)
    learning_rate = params.get('learning_rate', 0.001)
    optimizer_name = params.get('optimizer', 'adam')
    bidirectional = params.get('bidirectional', False)
    use_attention = params.get('use_attention', False)
    
    # Regularizer
    reg = l2(l2_reg) if l2_reg > 0 else None
    
    # Input
    inputs = Input(shape=input_shape)
    x = inputs
    
    # LSTM layers
    for i in range(lstm_layers):
        return_sequences = (i < lstm_layers - 1) or use_attention
        
        lstm_layer = LSTM(
            lstm_units,
            return_sequences=return_sequences,
            dropout=dropout,
            recurrent_dropout=recurrent_dropout,
            kernel_regularizer=reg,
        )
        
        if bidirectional:
            x = Bidirectional(lstm_layer)(x)
        else:
            x = lstm_layer(x)
    
    # Attention (if enabled and return_sequences was True)
    if use_attention:
        # Simple self-attention
        attention = Attention()([x, x])
        x = Concatenate()([x, attention])
        x = LayerNormalization()(x)
        # Take last timestep
        x = x[:, -1, :]
    
    # Dense layers
    for i in range(dense_layers):
        x = Dense(dense_units, activation='relu', kernel_regularizer=reg)(x)
        x = Dropout(dropout)(x)
    
    # Output layer (predict return)
    outputs = Dense(1)(x)
    
    model = Model(inputs, outputs)
    
    optimizer = get_optimizer(optimizer_name, learning_rate)
    
    model.compile(
        optimizer=optimizer,
        loss='mse',
        metrics=['mae']
    )
    
    return model


def add_lagged_features(X: np.ndarray, lag: int) -> np.ndarray:
    """Add lagged features to the sequence."""
    if lag <= 0:
        return X
    
    # X shape: (samples, sequence_length, features)
    n_samples, seq_len, n_features = X.shape
    
    # Create lagged versions
    lagged_features = []
    for l in range(1, lag + 1):
        # Shift features by l timesteps
        lagged = np.roll(X, l, axis=1)
        lagged[:, :l, :] = 0  # Zero out the rolled values
        lagged_features.append(lagged)
    
    # Concatenate along feature axis
    X_lagged = np.concatenate([X] + lagged_features, axis=2)
    
    return X_lagged


# In evaluate_params function, update the dataset preparation:

def evaluate_params(
    params: dict,
    market: Market,
    horizon: str,
    epochs: int = 50,
    verbose: int = 0,
) -> dict:
    """
    Evaluate a set of hyperparameters.
    
    Returns:
        Dict with metrics
    """
    # Prepare dataset with params
    seq_len = params.get('sequence_length', 72)
    scaler_type = params.get('normalize_method', 'standard')
    use_returns_only = params.get('use_returns_only', False)
    feature_lag = params.get('feature_lag', 0)
    
    data = prepare_lstm_dataset(
        market=market,
        horizon=horizon,
        sequence_length=seq_len,
        train_ratio=0.8,
        scaler_type=scaler_type,
        use_returns_only=use_returns_only,
        feature_lag=feature_lag,
    )
    
    X_train = data['X_train']
    X_test = data['X_test']
    y_train = data['y_train_return']
    y_test = data['y_test_return']
    
    input_shape = (X_train.shape[1], X_train.shape[2])
    
    try:
        model = build_lstm_model(
            input_shape=input_shape,
            params=params,
        )
        
        early_stop = EarlyStopping(
            monitor='val_loss',
            patience=5,
            restore_best_weights=True
        )
        
        history = model.fit(
            X_train, y_train,
            validation_data=(X_test, y_test),
            epochs=epochs,
            batch_size=params.get('batch_size', 64),
            callbacks=[early_stop],
            verbose=verbose,
        )
        
        # Evaluate
        test_loss, test_mae = model.evaluate(X_test, y_test, verbose=0)
        
        # Direction accuracy
        y_pred = model.predict(X_test, verbose=0).flatten()
        pred_direction = (y_pred > 0).astype(int)
        actual_direction = (y_test > 0).astype(int)
        direction_accuracy = np.mean(pred_direction == actual_direction) * 100
        
        # Clear memory
        del model
        tf.keras.backend.clear_session()
        
        return {
            'mse': float(test_loss),
            'rmse': float(np.sqrt(test_loss)),
            'mae': float(test_mae),
            'directional_accuracy': float(direction_accuracy),
            'epochs_trained': len(history.history['loss']),
            'n_features': input_shape[1],
        }
        
    except Exception as e:
        tf.keras.backend.clear_session()
        raise e


def tune_lstm(
    coin: str = None,
    horizon: str = None,
    n_trials: int = 150,
    epochs_per_trial: int = 50,
    resume: bool = True,
) -> dict:
    """
    Tune LSTM hyperparameters with checkpoint/resume.
    
    Args:
        coin: Coin symbol (default from TRAINING_TODAY)
        horizon: Horizon (default from TRAINING_TODAY)
        n_trials: Number of trials
        epochs_per_trial: Max epochs per trial
        resume: Resume from checkpoint if exists
    
    Returns:
        Best parameters
    """
    coin = coin or TRAINING_TODAY['coin']
    horizon = horizon or TRAINING_TODAY['horizon']
    
    print(f"\n{'='*60}")
    print(f"TUNING LSTM: {coin} {horizon}")
    print(f"{'='*60}")
    print(f"Trials: {n_trials}")
    print(f"Epochs per trial: {epochs_per_trial}")
    
    # Load checkpoint
    checkpoint = None
    if resume:
        checkpoint = load_checkpoint(coin, horizon)
        if checkpoint:
            print(f"\nResuming from trial {checkpoint['completed_trials']}/{n_trials}")
    
    if checkpoint:
        start_trial = checkpoint['completed_trials']
        best_params = checkpoint['best_params']
        best_score = checkpoint['best_score']
        all_trials = checkpoint['all_trials']
    else:
        start_trial = 0
        best_params = None
        best_score = float('inf')
        all_trials = []
    
    # Load market
    market = Market.objects.filter(symbol=coin).first()
    if not market:
        raise ValueError(f"Market not found: {coin}")
    
    # Prepare base dataset (will rebuild with different sequence_length per trial)
    print("\nPreparing base dataset...")
    config = HORIZON_CONFIG[horizon]
    
    # Cache datasets for different sequence lengths
    dataset_cache = {}
    
    # Run trials
    print(f"\nStarting trials from {start_trial}...")
    
    for trial in range(start_trial, n_trials):
        params = random_params()
        
        print(f"\n--- Trial {trial + 1}/{n_trials} ---")
        print(f"Key params: seq={params['sequence_length']}, layers={params['lstm_layers']}, "
              f"units={params['lstm_units']}, bi={params['bidirectional']}, "
              f"attn={params['use_attention']}, lr={params['learning_rate']:.6f}")
        
        try:
            # Get or build dataset for this sequence_length
            seq_len = params['sequence_length']
            norm_method = params['normalize_method']
            cache_key = f"{seq_len}_{norm_method}"
            
            if cache_key not in dataset_cache:
                data = prepare_lstm_dataset(
                    market=market,
                    horizon=horizon,
                    sequence_length=seq_len,
                    train_ratio=0.8,
                    scaler_type=norm_method,
                )
                dataset_cache[cache_key] = data
            
            data = dataset_cache[cache_key]
            
           # In tune_lstm, update the trial loop:

            metrics = evaluate_params(
                params=params,
                market=market,
                horizon=horizon,
                epochs=epochs_per_trial,
                verbose=0,
            )
            
            # Combined score: weight direction accuracy highly
            # Lower is better for RMSE, higher is better for direction
            combined_score = metrics['rmse'] - (metrics['directional_accuracy'] / 100 * 0.01)
            
            print(f"Results: RMSE={metrics['rmse']:.6f}, Dir={metrics['directional_accuracy']:.2f}%, "
                  f"Epochs={metrics['epochs_trained']}")
            
            # Track best (minimize combined score)
            if combined_score < best_score:
                best_score = combined_score
                best_params = params.copy()
                best_params['metrics'] = metrics
                print(f"*** NEW BEST ***")
            
            all_trials.append({
                'trial': trial + 1,
                'params': {k: v for k, v in params.items()},  # Make JSON serializable
                'metrics': metrics,
                'combined_score': combined_score,
            })
            
        except Exception as e:
            print(f"Trial failed: {e}")
            all_trials.append({
                'trial': trial + 1,
                'params': {k: v for k, v in params.items()},
                'error': str(e),
            })
        
        # Save checkpoint after each trial
        checkpoint_data = {
            'coin': coin,
            'horizon': horizon,
            'completed_trials': trial + 1,
            'total_trials': n_trials,
            'best_params': best_params,
            'best_score': float(best_score) if best_score != float('inf') else None,
            'all_trials': all_trials,
            'updated_at': datetime.utcnow().isoformat(),
        }
        save_checkpoint(coin, horizon, checkpoint_data)
    
    # Save final results
    print(f"\n{'='*60}")
    print("TUNING COMPLETE")
    print(f"{'='*60}")
    
    if best_params:
        print(f"\nBest Parameters:")
        for key, value in best_params.items():
            if key != 'metrics':
                print(f"  {key}: {value}")
        print(f"\nBest Metrics:")
        for key, value in best_params['metrics'].items():
            print(f"  {key}: {value}")
        
        # Save best params to config
        os.makedirs(CONFIGS_DIR, exist_ok=True)
        config_path = os.path.join(CONFIGS_DIR, f'best_params_{coin}_{horizon}.json')
        
        with open(config_path, 'w') as f:
            json.dump({
                'coin': coin,
                'horizon': horizon,
                'best_params': best_params,
                'best_score': float(best_score),
                'total_trials': n_trials,
                'tuned_at': datetime.utcnow().isoformat(),
            }, f, indent=2)
        
        print(f"\nConfig saved to: {config_path}")
    
    return best_params


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Tune LSTM hyperparameters')
    parser.add_argument('--coin', type=str, help='Coin symbol (e.g., BTC-USD)')
    parser.add_argument('--horizon', type=str, help='Horizon (24H, 30D, 12W, 12M)')
    parser.add_argument('--trials', type=int, default=150, help='Number of trials')
    parser.add_argument('--epochs', type=int, default=50, help='Epochs per trial')
    parser.add_argument('--no-resume', action='store_true', help='Start fresh (ignore checkpoint)')
    args = parser.parse_args()
    
    tune_lstm(
        coin=args.coin,
        horizon=args.horizon,
        n_trials=args.trials,
        epochs_per_trial=args.epochs,
        resume=not args.no_resume,
    )