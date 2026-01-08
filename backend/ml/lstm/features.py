# ml/lstm/features.py

"""
Feature engineering for LSTM - OPTIMIZED FOR SPEED
15 essential features only.
"""

import numpy as np
import pandas as pd


def create_lstm_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create essential features only."""
    df = df.copy()
    
    # RETURNS (6 features)
    df['return_1'] = df['close'].pct_change(1)
    df['return_6'] = df['close'].pct_change(6)
    df['return_12'] = df['close'].pct_change(12)
    df['return_24'] = df['close'].pct_change(24)
    df['return_48'] = df['close'].pct_change(48)
    df['return_168'] = df['close'].pct_change(168)
    
    # VOLATILITY (2 features)
    df['volatility_12'] = df['return_1'].rolling(window=12).std()
    df['volatility_24'] = df['return_1'].rolling(window=24).std()
    
    # RSI (1 feature)
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss.replace(0, np.nan)
    df['rsi_14'] = 100 - (100 / (1 + rs))
    
    # MOVING AVERAGE RATIO (2 features)
    df['sma_24'] = df['close'].rolling(window=24).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    df['price_to_sma_24'] = df['close'] / df['sma_24'].replace(0, np.nan)
    df['price_to_sma_50'] = df['close'] / df['sma_50'].replace(0, np.nan)
    
    # VOLUME (1 feature)
    df['volume_sma_24'] = df['volume'].rolling(window=24).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_24'].replace(0, np.nan)
    
    # MACD (1 feature)
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    
    # TIME (2 features)
    if hasattr(df.index, 'hour'):
        df['hour_sin'] = np.sin(2 * np.pi * df.index.hour / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df.index.hour / 24)
    else:
        df['hour_sin'] = 0
        df['hour_cos'] = 0
    
    return df


def get_feature_columns(use_returns_only: bool = False) -> list:
    """Get list of feature columns."""
    if use_returns_only:
        return [
            'return_1', 'return_6', 'return_12', 'return_24', 'return_48', 'return_168',
            'volatility_12', 'volatility_24',
        ]
    
    # 15 features total
    return [
        'return_1', 'return_6', 'return_12', 'return_24', 'return_48', 'return_168',
        'volatility_12', 'volatility_24',
        'rsi_14',
        'price_to_sma_24', 'price_to_sma_50',
        'volume_ratio',
        'macd',
        'hour_sin', 'hour_cos',
    ]


def create_targets(df: pd.DataFrame, horizon: int = 24) -> pd.DataFrame:
    """Create target variables."""
    df = df.copy()
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    df['target_direction'] = (df['target_return'] > 0).astype(int)
    df['target_price'] = df['close'].shift(-horizon)
    return df


def clean_features(df: pd.DataFrame) -> pd.DataFrame:
    """Clean features."""
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    return df