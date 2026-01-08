# ml/lstm/dataset.py

"""
Dataset preparation for LSTM.
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
from ml.lstm.config import HORIZON_CONFIG, TRAINING_YEARS


def get_scaler(scaler_type: str):
    """Get scaler by type name."""
    if scaler_type == 'minmax':
        return MinMaxScaler()
    elif scaler_type == 'robust':
        return RobustScaler()
    else:
        return StandardScaler()


def create_sequences(X: np.ndarray, y: np.ndarray, sequence_length: int = 72) -> Tuple[np.ndarray, np.ndarray]:
    """Create sequences for LSTM input."""
    X_seq = []
    y_seq = []
    
    for i in range(sequence_length, len(X)):
        X_seq.append(X[i - sequence_length:i])
        y_seq.append(y[i])
    
    return np.array(X_seq), np.array(y_seq)


def add_lagged_features(df: pd.DataFrame, feature_cols: list, lag: int) -> Tuple[pd.DataFrame, list]:
    """Add lagged versions of features."""
    if lag <= 0:
        return df, feature_cols
    
    df = df.copy()
    new_cols = []
    
    lagged_data = {}
    for col in feature_cols:
        for l in range(1, lag + 1):
            new_col_name = f'{col}_lag{l}'
            lagged_data[new_col_name] = df[col].shift(l)
            new_cols.append(new_col_name)
    
    lagged_df = pd.DataFrame(lagged_data, index=df.index)
    df = pd.concat([df, lagged_df], axis=1)
    
    return df, feature_cols + new_cols


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
    """Prepare dataset for LSTM training."""
    config = HORIZON_CONFIG.get(horizon)
    if not config:
        raise ValueError(f"Invalid horizon: {horizon}")
    
    timeframe = config['timeframe']
    horizon_steps = config['horizon']
    years = TRAINING_YEARS.get(horizon, 5)
    
    df = load_market_data(market, timeframe, years=years)
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    df = create_lstm_features(df)
    df = create_targets(df, horizon_steps)
    
    feature_cols = get_feature_columns(use_returns_only=use_returns_only)
    
    if feature_lag > 0:
        df, feature_cols = add_lagged_features(df, feature_cols, feature_lag)
    
    df = clean_features(df)
    
    for col in feature_cols:
        if col not in df.columns:
            raise ValueError(f"Missing feature: {col}")
    
    X = df[feature_cols].values
    y_return = df['target_return'].values
    y_direction = df['target_direction'].values
    
    split_idx = int(len(X) * train_ratio)
    
    X_train_raw = X[:split_idx]
    X_test_raw = X[split_idx:]
    y_train_return = y_return[:split_idx]
    y_test_return = y_return[split_idx:]
    y_train_direction = y_direction[:split_idx]
    y_test_direction = y_direction[split_idx:]
    
    scaler = None
    if scale_features:
        scaler = get_scaler(scaler_type)
        X_train_raw = scaler.fit_transform(X_train_raw)
        X_test_raw = scaler.transform(X_test_raw)
    
    X_train, y_train_ret = create_sequences(X_train_raw, y_train_return, sequence_length)
    X_test, y_test_ret = create_sequences(X_test_raw, y_test_return, sequence_length)
    
    _, y_train_dir = create_sequences(X_train_raw, y_train_direction, sequence_length)
    _, y_test_dir = create_sequences(X_test_raw, y_test_direction, sequence_length)
    
    print(f"\nDataset for {market.symbol} ({horizon}):")
    print(f"  Years of data: {years}")
    print(f"  Raw samples: {len(df)}")
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