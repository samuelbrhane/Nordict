# ml/lstm/features.py

"""
Extended feature engineering for LSTM models.
~40-50 features for better prediction.
"""

import numpy as np
import pandas as pd


def create_lstm_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create extended features for LSTM.
    ~40-50 features total.
    
    Args:
        df: DataFrame with OHLCV data
    
    Returns:
        DataFrame with all features added
    """
    df = df.copy()
    
    # ==========================================
    # 1. PRICE RETURNS (6 features)
    # ==========================================
    df['return_1'] = df['close'].pct_change(1)
    df['return_6'] = df['close'].pct_change(6)
    df['return_12'] = df['close'].pct_change(12)
    df['return_24'] = df['close'].pct_change(24)
    df['return_48'] = df['close'].pct_change(48)
    df['return_168'] = df['close'].pct_change(168)  # 7 days
    
    # ==========================================
    # 2. MOVING AVERAGES (8 features)
    # ==========================================
    df['sma_12'] = df['close'].rolling(window=12).mean()
    df['sma_24'] = df['close'].rolling(window=24).mean()
    df['sma_50'] = df['close'].rolling(window=50).mean()
    df['sma_200'] = df['close'].rolling(window=200).mean()
    
    df['ema_12'] = df['close'].ewm(span=12).mean()
    df['ema_26'] = df['close'].ewm(span=26).mean()
    df['ema_50'] = df['close'].ewm(span=50).mean()
    
    # Price relative to MAs
    df['price_to_sma_24'] = df['close'] / df['sma_24'].replace(0, np.nan)
    df['price_to_sma_50'] = df['close'] / df['sma_50'].replace(0, np.nan)
    df['price_to_sma_200'] = df['close'] / df['sma_200'].replace(0, np.nan)
    
    # ==========================================
    # 3. VOLATILITY (4 features)
    # ==========================================
    df['volatility_12'] = df['return_1'].rolling(window=12).std()
    df['volatility_24'] = df['return_1'].rolling(window=24).std()
    df['volatility_168'] = df['return_1'].rolling(window=168).std()
    
    # ATR (Average True Range)
    df['tr'] = np.maximum(
        df['high'] - df['low'],
        np.maximum(
            abs(df['high'] - df['close'].shift(1)),
            abs(df['low'] - df['close'].shift(1))
        )
    )
    df['atr_14'] = df['tr'].rolling(window=14).mean()
    
    # ==========================================
    # 4. RSI (3 features)
    # ==========================================
    for period in [7, 14, 21]:
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        rs = gain / loss.replace(0, np.nan)
        df[f'rsi_{period}'] = 100 - (100 / (1 + rs))
    
    # ==========================================
    # 5. MACD (3 features)
    # ==========================================
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    df['macd_histogram'] = df['macd'] - df['macd_signal']
    
    # ==========================================
    # 6. BOLLINGER BANDS (3 features)
    # ==========================================
    bb_sma = df['close'].rolling(window=20).mean()
    bb_std = df['close'].rolling(window=20).std()
    df['bb_upper'] = bb_sma + (bb_std * 2)
    df['bb_lower'] = bb_sma - (bb_std * 2)
    df['bb_width'] = (df['bb_upper'] - df['bb_lower']) / bb_sma
    df['bb_position'] = (df['close'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower']).replace(0, np.nan)
    
    # ==========================================
    # 7. STOCHASTIC OSCILLATOR (2 features)
    # ==========================================
    low_14 = df['low'].rolling(window=14).min()
    high_14 = df['high'].rolling(window=14).max()
    df['stoch_k'] = 100 * (df['close'] - low_14) / (high_14 - low_14).replace(0, np.nan)
    df['stoch_d'] = df['stoch_k'].rolling(window=3).mean()
    
    # ==========================================
    # 8. WILLIAMS %R (1 feature)
    # ==========================================
    df['williams_r'] = -100 * (high_14 - df['close']) / (high_14 - low_14).replace(0, np.nan)
    
    # ==========================================
    # 9. VOLUME INDICATORS (5 features)
    # ==========================================
    df['volume_sma_24'] = df['volume'].rolling(window=24).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_24'].replace(0, np.nan)
    
    # OBV (On Balance Volume)
    df['obv'] = (np.sign(df['close'].diff()) * df['volume']).fillna(0).cumsum()
    df['obv_sma'] = df['obv'].rolling(window=24).mean()
    df['obv_ratio'] = df['obv'] / df['obv_sma'].replace(0, np.nan)
    
    # VWAP (Volume Weighted Average Price) - simplified daily
    df['vwap'] = (df['volume'] * (df['high'] + df['low'] + df['close']) / 3).rolling(window=24).sum() / df['volume'].rolling(window=24).sum().replace(0, np.nan)
    df['price_to_vwap'] = df['close'] / df['vwap'].replace(0, np.nan)
    
    # ==========================================
    # 10. TIME FEATURES (4 features)
    # ==========================================
    df['hour_sin'] = np.sin(2 * np.pi * df.index.hour / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df.index.hour / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df.index.dayofweek / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df.index.dayofweek / 7)
    
    # ==========================================
    # 11. MOMENTUM (2 features)
    # ==========================================
    df['momentum_12'] = df['close'] - df['close'].shift(12)
    df['momentum_24'] = df['close'] - df['close'].shift(24)
    
    # ==========================================
    # 12. RATE OF CHANGE (2 features)
    # ==========================================
    df['roc_12'] = (df['close'] - df['close'].shift(12)) / df['close'].shift(12).replace(0, np.nan) * 100
    df['roc_24'] = (df['close'] - df['close'].shift(24)) / df['close'].shift(24).replace(0, np.nan) * 100
    
    return df


def get_feature_columns(use_returns_only: bool = False) -> list:
    """
    Get list of feature columns for LSTM.
    
    Args:
        use_returns_only: If True, return only return-based features (smaller set)
    
    Returns:
        List of feature column names
    """
    if use_returns_only:
        return [
            # Returns only
            'return_1', 'return_6', 'return_12', 'return_24', 'return_48', 'return_168',
            # Volatility
            'volatility_12', 'volatility_24',
            # Time
            'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
        ]
    
    return [
        # Returns
        'return_1', 'return_6', 'return_12', 'return_24', 'return_48', 'return_168',
        # MA ratios
        'price_to_sma_24', 'price_to_sma_50', 'price_to_sma_200',
        # Volatility
        'volatility_12', 'volatility_24', 'volatility_168', 'atr_14',
        # RSI
        'rsi_7', 'rsi_14', 'rsi_21',
        # MACD
        'macd', 'macd_signal', 'macd_histogram',
        # Bollinger
        'bb_width', 'bb_position',
        # Stochastic
        'stoch_k', 'stoch_d',
        # Williams
        'williams_r',
        # Volume
        'volume_ratio', 'obv_ratio', 'price_to_vwap',
        # Time
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
        # Momentum
        'momentum_12', 'momentum_24', 'roc_12', 'roc_24',
    ]


def create_targets(df: pd.DataFrame, horizon: int = 24) -> pd.DataFrame:
    """
    Create target variables.
    
    Args:
        df: DataFrame with features
        horizon: Prediction horizon in steps
    
    Returns:
        DataFrame with targets added
    """
    df = df.copy()
    
    # Return target (for regression)
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    
    # Direction target (for classification)
    df['target_direction'] = (df['target_return'] > 0).astype(int)
    
    # Price target (for reference)
    df['target_price'] = df['close'].shift(-horizon)
    
    return df


def clean_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean features by removing inf values and NaN.
    """
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    return df