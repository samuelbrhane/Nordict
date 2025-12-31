# ml/features/engineer.py

"""
Feature engineering for price prediction.

Creates features from price data for XGBoost model.
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Tuple, List

from markets.models import Market, MarketData


def load_market_data(market: Market, timeframe: str = '1h', limit: int = None) -> pd.DataFrame:
    """
    Load market data into pandas DataFrame.
    
    Args:
        market: Market to load
        timeframe: '1h', '1d', '1w', '1M'
        limit: Max rows to load (None = all)
    
    Returns:
        DataFrame with OHLCV data
    """
    queryset = MarketData.objects.filter(
        market=market,
        timeframe=timeframe
    ).order_by('timestamp')
    
    if limit:
        queryset = queryset[:limit]
    
    data = list(queryset.values(
        'timestamp', 'open', 'high', 'low', 'close', 'volume'
    ))
    
    if not data:
        return pd.DataFrame()
    
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    
    # Convert Decimal to float
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = df[col].astype(float)
    
    return df


def add_price_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add basic price-based features."""
    
    # Returns
    df['return_1'] = df['close'].pct_change(1)
    df['return_3'] = df['close'].pct_change(3)
    df['return_6'] = df['close'].pct_change(6)
    df['return_12'] = df['close'].pct_change(12)
    df['return_24'] = df['close'].pct_change(24)
    
    # Log returns (better for ML)
    df['log_return_1'] = np.log(df['close'] / df['close'].shift(1))
    df['log_return_6'] = np.log(df['close'] / df['close'].shift(6))
    df['log_return_24'] = np.log(df['close'] / df['close'].shift(24))
    
    # Price momentum
    df['momentum_6'] = df['close'] - df['close'].shift(6)
    df['momentum_12'] = df['close'] - df['close'].shift(12)
    df['momentum_24'] = df['close'] - df['close'].shift(24)
    
    return df


def add_moving_averages(df: pd.DataFrame) -> pd.DataFrame:
    """Add moving average features."""
    
    # Simple Moving Averages
    df['sma_6'] = df['close'].rolling(window=6).mean()
    df['sma_12'] = df['close'].rolling(window=12).mean()
    df['sma_24'] = df['close'].rolling(window=24).mean()
    df['sma_48'] = df['close'].rolling(window=48).mean()
    df['sma_168'] = df['close'].rolling(window=168).mean()  # 1 week
    
    # Exponential Moving Averages
    df['ema_6'] = df['close'].ewm(span=6).mean()
    df['ema_12'] = df['close'].ewm(span=12).mean()
    df['ema_24'] = df['close'].ewm(span=24).mean()
    
    # Price relative to MAs
    df['price_to_sma_6'] = df['close'] / df['sma_6']
    df['price_to_sma_12'] = df['close'] / df['sma_12']
    df['price_to_sma_24'] = df['close'] / df['sma_24']
    df['price_to_sma_168'] = df['close'] / df['sma_168']
    
    # MA crossovers
    df['sma_6_12_cross'] = df['sma_6'] - df['sma_12']
    df['sma_12_24_cross'] = df['sma_12'] - df['sma_24']
    
    return df


def add_volatility_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add volatility-based features."""
    
    # Rolling standard deviation
    df['volatility_6'] = df['return_1'].rolling(window=6).std()
    df['volatility_12'] = df['return_1'].rolling(window=12).std()
    df['volatility_24'] = df['return_1'].rolling(window=24).std()
    df['volatility_168'] = df['return_1'].rolling(window=168).std()
    
    # True Range
    df['tr'] = np.maximum(
        df['high'] - df['low'],
        np.maximum(
            abs(df['high'] - df['close'].shift(1)),
            abs(df['low'] - df['close'].shift(1))
        )
    )
    
    # Average True Range
    df['atr_6'] = df['tr'].rolling(window=6).mean()
    df['atr_12'] = df['tr'].rolling(window=12).mean()
    df['atr_24'] = df['tr'].rolling(window=24).mean()
    
    # ATR as percentage of price
    df['atr_pct_6'] = df['atr_6'] / df['close']
    df['atr_pct_24'] = df['atr_24'] / df['close']
    
    # Bollinger Band width
    df['bb_upper'] = df['sma_24'] + 2 * df['volatility_24'] * df['close']
    df['bb_lower'] = df['sma_24'] - 2 * df['volatility_24'] * df['close']
    df['bb_width'] = (df['bb_upper'] - df['bb_lower']) / df['sma_24']
    df['bb_position'] = (df['close'] - df['bb_lower']) / (df['bb_upper'] - df['bb_lower'])
    
    return df


def add_volume_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add volume-based features."""
    
    # Volume moving averages
    df['volume_sma_6'] = df['volume'].rolling(window=6).mean()
    df['volume_sma_24'] = df['volume'].rolling(window=24).mean()
    
    # Volume relative to average
    df['volume_ratio_6'] = df['volume'] / df['volume_sma_6']
    df['volume_ratio_24'] = df['volume'] / df['volume_sma_24']
    
    # Volume change
    df['volume_change'] = df['volume'].pct_change(1)
    
    # Price-volume trend
    df['pv_trend'] = df['return_1'] * df['volume_ratio_24']
    
    return df


def add_time_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add time-based features (cyclical encoding)."""
    
    # Hour of day (for hourly data)
    df['hour'] = df.index.hour
    df['hour_sin'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df['hour'] / 24)
    
    # Day of week
    df['day_of_week'] = df.index.dayofweek
    df['dow_sin'] = np.sin(2 * np.pi * df['day_of_week'] / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df['day_of_week'] / 7)
    
    # Day of month
    df['day_of_month'] = df.index.day
    df['dom_sin'] = np.sin(2 * np.pi * df['day_of_month'] / 31)
    df['dom_cos'] = np.cos(2 * np.pi * df['day_of_month'] / 31)
    
    # Month of year
    df['month'] = df.index.month
    df['month_sin'] = np.sin(2 * np.pi * df['month'] / 12)
    df['month_cos'] = np.cos(2 * np.pi * df['month'] / 12)
    
    # Weekend flag
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)
    
    return df


def add_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Add technical analysis indicators."""
    
    # RSI (Relative Strength Index)
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df['rsi_14'] = 100 - (100 / (1 + rs))
    
    # MACD
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    df['macd_hist'] = df['macd'] - df['macd_signal']
    
    # Stochastic Oscillator
    low_14 = df['low'].rolling(window=14).min()
    high_14 = df['high'].rolling(window=14).max()
    df['stoch_k'] = 100 * (df['close'] - low_14) / (high_14 - low_14)
    df['stoch_d'] = df['stoch_k'].rolling(window=3).mean()
    
    # Rate of Change
    df['roc_6'] = (df['close'] - df['close'].shift(6)) / df['close'].shift(6) * 100
    df['roc_12'] = (df['close'] - df['close'].shift(12)) / df['close'].shift(12) * 100
    
    return df


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create all features from OHLCV data.
    
    Args:
        df: DataFrame with OHLCV data
    
    Returns:
        DataFrame with all features
    """
    df = add_price_features(df)
    df = add_moving_averages(df)
    df = add_volatility_features(df)
    df = add_volume_features(df)
    df = add_time_features(df)
    df = add_technical_indicators(df)
    
    return df


def create_target(df: pd.DataFrame, horizon: int = 24) -> pd.DataFrame:
    """
    Create target variable (future return).
    
    Args:
        df: DataFrame with features
        horizon: How many steps ahead to predict
    
    Returns:
        DataFrame with target column
    """
    # Future return
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    
    # Future price
    df['target_price'] = df['close'].shift(-horizon)
    
    # Direction (1 = up, 0 = down)
    df['target_direction'] = (df['target_return'] > 0).astype(int)
    
    return df


def prepare_dataset(
    market: Market,
    timeframe: str = '1h',
    horizon: int = 24,
    train_ratio: float = 0.8,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Prepare full dataset for training.
    
    Args:
        market: Market to prepare
        timeframe: Data timeframe
        horizon: Prediction horizon
        train_ratio: Train/test split ratio
    
    Returns:
        X_train, X_test, y_train, y_test
    """
    # Load data
    df = load_market_data(market, timeframe)
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    # Create features and target
    df = create_features(df)
    df = create_target(df, horizon)
    
    # Drop rows with NaN
    df = df.dropna()
    
    # Feature columns (exclude target and raw OHLCV)
    feature_cols = [col for col in df.columns if col not in [
        'open', 'high', 'low', 'close', 'volume',
        'target_return', 'target_price', 'target_direction',
        'hour', 'day_of_week', 'day_of_month', 'month',  # Keep only encoded versions
        'tr', 'bb_upper', 'bb_lower',  # Intermediate calculations
    ]]
    
    # Split (time-based, not random!)
    split_idx = int(len(df) * train_ratio)
    
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    X_train = train_df[feature_cols]
    X_test = test_df[feature_cols]
    y_train = train_df['target_return']
    y_test = test_df['target_return']
    
    return X_train, X_test, y_train, y_test


def prepare_multi_market_dataset(
    markets: List[Market],
    timeframe: str = '1h',
    horizon: int = 24,
    train_ratio: float = 0.8,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Prepare dataset with multiple markets (hot encoding).
    
    Args:
        markets: List of markets
        timeframe: Data timeframe
        horizon: Prediction horizon
        train_ratio: Train/test split ratio
    
    Returns:
        X_train, X_test, y_train, y_test
    """
    all_dfs = []
    
    for market in markets:
        df = load_market_data(market, timeframe)
        
        if df.empty:
            print(f"  Skipping {market.symbol} - no data")
            continue
        
        df = create_features(df)
        df = create_target(df, horizon)
        
        # Add market identifier
        df['market_symbol'] = market.symbol
        
        all_dfs.append(df)
        print(f"  {market.symbol}: {len(df)} rows")
    
    # Combine all markets
    combined_df = pd.concat(all_dfs, ignore_index=False)
    combined_df = combined_df.dropna()
    
    # One-hot encode market symbol
    market_dummies = pd.get_dummies(combined_df['market_symbol'], prefix='market')
    combined_df = pd.concat([combined_df, market_dummies], axis=1)
    
    # Feature columns
    feature_cols = [col for col in combined_df.columns if col not in [
        'open', 'high', 'low', 'close', 'volume',
        'target_return', 'target_price', 'target_direction',
        'market_symbol',
        'hour', 'day_of_week', 'day_of_month', 'month',
        'tr', 'bb_upper', 'bb_lower',
    ]]
    
    # Sort by time for proper split
    combined_df = combined_df.sort_index()
    
    # Split
    split_idx = int(len(combined_df) * train_ratio)
    
    train_df = combined_df.iloc[:split_idx]
    test_df = combined_df.iloc[split_idx:]
    
    X_train = train_df[feature_cols]
    X_test = test_df[feature_cols]
    y_train = train_df['target_return']
    y_test = test_df['target_return']
    
    print(f"\nDataset ready:")
    print(f"  Train: {len(X_train)} rows, {len(feature_cols)} features")
    print(f"  Test: {len(X_test)} rows")
    
    return X_train, X_test, y_train, y_test


if __name__ == '__main__':
    # Test with one market
    print("=" * 50)
    print("TESTING FEATURE ENGINEERING")
    print("=" * 50)
    
    market = Market.objects.filter(symbol='BTC-USD').first()
    
    if market:
        X_train, X_test, y_train, y_test = prepare_dataset(market, horizon=24)
        
        print(f"\nFeatures: {list(X_train.columns)}")
        print(f"\nTrain shape: {X_train.shape}")
        print(f"Test shape: {X_test.shape}")
    else:
        print("No BTC-USD market found. Run data fetch first.")