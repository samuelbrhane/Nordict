# ml/lstm/dataset.py

"""
Dataset preparation for LSTM.
Creates sequences for time series prediction.
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
import pandas as pd
from typing import Tuple
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler

from markets.models import Market
from ml.features.engineer import load_market_data
from ml.lstm.features import create_lstm_features, create_targets, clean_features, get_feature_columns
from ml.lstm.config import HORIZON_CONFIG


def get_scaler(scaler_type: str):
    """Get scaler by type name."""
    if scaler_type == 'minmax':
        return MinMaxScaler()
    elif scaler_type == 'robust':
        return RobustScaler()
    else:
        return StandardScaler()


def create_sequences(
    X: np.ndarray,
    y: np.ndarray,
    sequence_length: int = 72,
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Create sequences for LSTM input.
    
    Args:
        X: Feature array (n_samples, n_features)
        y: Target array (n_samples,)
        sequence_length: Number of time steps per sequence
    
    Returns:
        (X_sequences, y_sequences)
        X_sequences shape: (n_sequences, sequence_length, n_features)
        y_sequences shape: (n_sequences,)
    """
    X_seq = []
    y_seq = []
    
    for i in range(sequence_length, len(X)):
        X_seq.append(X[i - sequence_length:i])
        y_seq.append(y[i])
    
    return np.array(X_seq), np.array(y_seq)


def add_lagged_features(df: pd.DataFrame, feature_cols: list, lag: int) -> Tuple[pd.DataFrame, list]:
    """
    Add lagged versions of features to DataFrame.
    
    Args:
        df: DataFrame with features
        feature_cols: List of feature column names
        lag: Number of lag periods to add
    
    Returns:
        (DataFrame with lagged features, updated feature column list)
    """
    if lag <= 0:
        return df, feature_cols
    
    df = df.copy()
    new_cols = []
    
    for col in feature_cols:
        for l in range(1, lag + 1):
            new_col_name = f'{col}_lag{l}'
            df[new_col_name] = df[col].shift(l)
            new_cols.append(new_col_name)
    
    updated_cols = feature_cols + new_cols
    
    return df, updated_cols


def prepare_lstm_dataset(
    market: Market,
    horizon: str = '24H',
    sequence_length: int = 72,
    train_ratio: float = 0.8,
    scale_features: bool = True,
    scaler_type: str = 'standard',
    use_returns_only: bool = False,
    feature_lag: int = 0,
) -> dict:
    """
    Prepare dataset for LSTM training.
    
    Args:
        market: Market to prepare data for
        horizon: Prediction horizon ('24H', '30D', '12W', '12M')
        sequence_length: Number of time steps per sequence
        train_ratio: Ratio of data for training
        scale_features: Whether to scale features
        scaler_type: 'standard', 'minmax', or 'robust'
        use_returns_only: Use only return-based features
        feature_lag: Number of lag periods to add
    
    Returns:
        Dict with X_train, X_test, y_train, y_test, scaler, feature_names
    """
    config = HORIZON_CONFIG.get(horizon)
    if not config:
        raise ValueError(f"Invalid horizon: {horizon}")
    
    timeframe = config['timeframe']
    horizon_steps = config['horizon']
    
    # Load data
    df = load_market_data(market, timeframe, years=5)
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    # Create features and targets
    df = create_lstm_features(df)
    df = create_targets(df, horizon_steps)
    
    # Get feature columns
    feature_cols = get_feature_columns(use_returns_only=use_returns_only)
    
    # Add lagged features
    if feature_lag > 0:
        df, feature_cols = add_lagged_features(df, feature_cols, feature_lag)
    
    # Clean after adding lags (will have NaN from shifts)
    df = clean_features(df)
    
    # Ensure all features exist
    for col in feature_cols:
        if col not in df.columns:
            raise ValueError(f"Missing feature: {col}")
    
    # Extract features and target
    X = df[feature_cols].values
    y_return = df['target_return'].values
    y_direction = df['target_direction'].values
    
    # Split BEFORE creating sequences (time-based)
    split_idx = int(len(X) * train_ratio)
    
    X_train_raw = X[:split_idx]
    X_test_raw = X[split_idx:]
    y_train_return = y_return[:split_idx]
    y_test_return = y_return[split_idx:]
    y_train_direction = y_direction[:split_idx]
    y_test_direction = y_direction[split_idx:]
    
    # Scale features
    scaler = None
    if scale_features:
        scaler = get_scaler(scaler_type)
        X_train_raw = scaler.fit_transform(X_train_raw)
        X_test_raw = scaler.transform(X_test_raw)
    
    # Create sequences
    X_train, y_train_ret = create_sequences(X_train_raw, y_train_return, sequence_length)
    X_test, y_test_ret = create_sequences(X_test_raw, y_test_return, sequence_length)
    
    _, y_train_dir = create_sequences(X_train_raw, y_train_direction, sequence_length)
    _, y_test_dir = create_sequences(X_test_raw, y_test_direction, sequence_length)
    
    print(f"\nDataset for {market.symbol} ({horizon}):")
    print(f"  Features: {len(feature_cols)} ({'returns only' if use_returns_only else 'full'})")
    print(f"  Feature lag: {feature_lag}")
    print(f"  Sequence length: {sequence_length}")
    print(f"  Scaler: {scaler_type}")
    print(f"  Train sequences: {len(X_train)}")
    print(f"  Test sequences: {len(X_test)}")
    print(f"  X_train shape: {X_train.shape}")
    print(f"  X_test shape: {X_test.shape}")
    
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train_return': y_train_ret,
        'y_test_return': y_test_ret,
        'y_train_direction': y_train_dir,
        'y_test_direction': y_test_dir,
        'scaler': scaler,
        'scaler_type': scaler_type,
        'feature_names': feature_cols,
        'use_returns_only': use_returns_only,
        'feature_lag': feature_lag,
    }


if __name__ == '__main__':
    # Test
    print("=" * 50)
    print("TESTING LSTM DATASET")
    print("=" * 50)
    
    market = Market.objects.filter(symbol='BTC-USD').first()
    
    if market:
        # Test full features
        data = prepare_lstm_dataset(market, horizon='24H', sequence_length=72)
        
        # Test returns only
        data_returns = prepare_lstm_dataset(
            market, horizon='24H', sequence_length=72, 
            use_returns_only=True
        )
        
        # Test with lag
        data_lag = prepare_lstm_dataset(
            market, horizon='24H', sequence_length=72,
            feature_lag=2
        )
        
        print(f"\nTest complete!")
    else:
        print("No BTC-USD market found.")