# ml/xgboost_coin/features.py

"""
Extended feature engineering for coin-specific XGBoost.
More features than general model + lag features for memory.
"""

import numpy as np
import pandas as pd


def create_coin_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create extended features for coin-specific model.
    ~25 features (more than general model's ~14).
    """
    df = df.copy()
    
    # === RETURNS (8 features) ===
    df['return_1'] = df['close'].pct_change(1)
    df['return_3'] = df['close'].pct_change(3)
    df['return_6'] = df['close'].pct_change(6)
    df['return_12'] = df['close'].pct_change(12)
    df['return_24'] = df['close'].pct_change(24)
    df['return_48'] = df['close'].pct_change(48)
    df['return_72'] = df['close'].pct_change(72)
    df['return_168'] = df['close'].pct_change(168)  # 1 week
    
    # === VOLATILITY (3 features) ===
    df['volatility_12'] = df['return_1'].rolling(window=12).std()
    df['volatility_24'] = df['return_1'].rolling(window=24).std()
    df['volatility_72'] = df['return_1'].rolling(window=72).std()
    
    # === MOVING AVERAGES (4 features) ===
    df['sma_12'] = df['close'].rolling(window=12).mean()
    df['sma_24'] = df['close'].rolling(window=24).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    df['ema_12'] = df['close'].ewm(span=12).mean()
    
    # Price relative to MAs
    df['price_to_sma_12'] = df['close'] / df['sma_12'].replace(0, np.nan)
    df['price_to_sma_24'] = df['close'] / df['sma_24'].replace(0, np.nan)
    df['price_to_sma_50'] = df['close'] / df['sma_50'].replace(0, np.nan)
    
    # === RSI (2 features) ===
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss.replace(0, np.nan)
    df['rsi_14'] = 100 - (100 / (1 + rs))
    
    # RSI 7
    gain_7 = (delta.where(delta > 0, 0)).rolling(window=7).mean()
    loss_7 = (-delta.where(delta < 0, 0)).rolling(window=7).mean()
    rs_7 = gain_7 / loss_7.replace(0, np.nan)
    df['rsi_7'] = 100 - (100 / (1 + rs_7))
    
    # === MACD (2 features) ===
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    
    # === VOLUME (2 features) ===
    df['volume_sma_24'] = df['volume'].rolling(window=24).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_24'].replace(0, np.nan)
    df['volume_change'] = df['volume'].pct_change(1)
    
    # === ATR (1 feature) ===
    df['tr'] = np.maximum(
        df['high'] - df['low'],
        np.maximum(
            abs(df['high'] - df['close'].shift(1)),
            abs(df['low'] - df['close'].shift(1))
        )
    )
    df['atr_14'] = df['tr'].rolling(window=14).mean()
    
    # === BOLLINGER BANDS (2 features) ===
    df['bb_middle'] = df['close'].rolling(window=20).mean()
    df['bb_std'] = df['close'].rolling(window=20).std()
    df['bb_upper'] = df['bb_middle'] + 2 * df['bb_std']
    df['bb_lower'] = df['bb_middle'] - 2 * df['bb_std']
    df['bb_position'] = (df['close'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower']).replace(0, np.nan)
    df['bb_width'] = (df['bb_upper'] - df['bb_lower']) / df['bb_middle'].replace(0, np.nan)
    
    # === TIME FEATURES (4 features) ===
    if hasattr(df.index, 'hour'):
        df['hour_sin'] = np.sin(2 * np.pi * df.index.hour / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df.index.hour / 24)
    else:
        df['hour_sin'] = 0
        df['hour_cos'] = 0
    
    if hasattr(df.index, 'dayofweek'):
        df['dow_sin'] = np.sin(2 * np.pi * df.index.dayofweek / 7)
        df['dow_cos'] = np.cos(2 * np.pi * df.index.dayofweek / 7)
    else:
        df['dow_sin'] = 0
        df['dow_cos'] = 0
    
    return df


def add_lag_features(df: pd.DataFrame, lag: int = 12) -> pd.DataFrame:
    """
    Add lagged versions of key features.
    This gives XGBoost "memory" like LSTM sequences.
    
    Args:
        df: DataFrame with features
        lag: Number of lag periods (e.g., 12 = look back 12 hours)
    
    Returns:
        DataFrame with lag features added
    """
    if lag <= 0:
        return df
    
    df = df.copy()
    
    # Key features to lag (most predictive)
    lag_features = [
        'return_1', 'return_6', 'return_24',
        'volatility_24',
        'rsi_14',
        'macd',
        'volume_ratio',
    ]
    
    for col in lag_features:
        if col in df.columns:
            for l in range(1, lag + 1):
                df[f'{col}_lag{l}'] = df[col].shift(l)
    
    return df


def get_feature_columns(include_lag: bool = True, lag: int = 12) -> list:
    """Get list of feature columns."""
    
    # Base features (~25)
    base_features = [
        # Returns
        'return_1', 'return_3', 'return_6', 'return_12', 
        'return_24', 'return_48', 'return_72', 'return_168',
        # Volatility
        'volatility_12', 'volatility_24', 'volatility_72',
        # MA ratios
        'price_to_sma_12', 'price_to_sma_24', 'price_to_sma_50',
        # RSI
        'rsi_7', 'rsi_14',
        # MACD
        'macd', 'macd_signal',
        # Volume
        'volume_ratio', 'volume_change',
        # ATR
        'atr_14',
        # Bollinger
        'bb_position', 'bb_width',
        # Time
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
    ]
    
    if not include_lag:
        return base_features
    
    # Add lag features
    lag_features = []
    lag_cols = ['return_1', 'return_6', 'return_24', 'volatility_24', 'rsi_14', 'macd', 'volume_ratio']
    
    for col in lag_cols:
        for l in range(1, lag + 1):
            lag_features.append(f'{col}_lag{l}')
    
    return base_features + lag_features


def create_target(df: pd.DataFrame, horizon: int = 24) -> pd.DataFrame:
    """Create target variable."""
    df = df.copy()
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    df['target_direction'] = (df['target_return'] > 0).astype(int)
    return df


def clean_features(df: pd.DataFrame) -> pd.DataFrame:
    """Clean features by removing inf and NaN."""
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    return df