# ml/features/engineer.py

"""
Feature engineering for price prediction.
Simplified version with essential features only.
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


# How many years of data to use for training
YEARS_OF_DATA = {
    '1h': 2,   # 24H - 2 years
    '1d': 3,   # 30D - 3 years  
    '1w': 4,   # 12W - 4 years
    '1M': 5,   # 12M - 5 years (all data)
}


def load_market_data(market: Market, timeframe: str = '1h', years: int = None) -> pd.DataFrame:
    """
    Load market data into pandas DataFrame.
    """
    from django.utils import timezone
    
    # Use timeframe-specific years if not provided
    if years is None:
        years = YEARS_OF_DATA.get(timeframe, 2)
    
    cutoff_date = timezone.now() - timedelta(days=years * 365)
    
    queryset = MarketData.objects.filter(
        market=market,
        timeframe=timeframe,
        timestamp__gte=cutoff_date
    ).order_by('timestamp')
    
    data = list(queryset.values(
        'timestamp', 'open', 'high', 'low', 'close', 'volume'
    ))
    
    if not data:
        return pd.DataFrame()
    
    df = pd.DataFrame(data)
    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df.set_index('timestamp', inplace=True)
    
    for col in ['open', 'high', 'low', 'close', 'volume']:
        df[col] = df[col].astype(float)
    
    return df


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create essential features only.
    ~20 features instead of ~60.
    """
    # === Price Returns ===
    df['return_1'] = df['close'].pct_change(1)
    df['return_6'] = df['close'].pct_change(6)
    df['return_24'] = df['close'].pct_change(24)
    
    # === Moving Averages ===
    df['sma_12'] = df['close'].rolling(window=12).mean()
    df['sma_24'] = df['close'].rolling(window=24).mean()
    df['ema_12'] = df['close'].ewm(span=12).mean()
    
    # Price relative to MA (safe division)
    df['price_to_sma_24'] = df['close'] / df['sma_24'].replace(0, np.nan)
    
    # === Volatility ===
    df['volatility_24'] = df['return_1'].rolling(window=24).std()
    
    # ATR
    df['tr'] = np.maximum(
        df['high'] - df['low'],
        np.maximum(
            abs(df['high'] - df['close'].shift(1)),
            abs(df['low'] - df['close'].shift(1))
        )
    )
    df['atr_14'] = df['tr'].rolling(window=14).mean()
    
    # === Volume ===
    df['volume_sma_24'] = df['volume'].rolling(window=24).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_24'].replace(0, np.nan)
    
    # === Technical Indicators ===
    # RSI
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss.replace(0, np.nan)
    df['rsi_14'] = 100 - (100 / (1 + rs))
    
    # MACD
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    
    # === Time Features ===
    df['hour_sin'] = np.sin(2 * np.pi * df.index.hour / 24)
    df['hour_cos'] = np.cos(2 * np.pi * df.index.hour / 24)
    df['dow_sin'] = np.sin(2 * np.pi * df.index.dayofweek / 7)
    df['dow_cos'] = np.cos(2 * np.pi * df.index.dayofweek / 7)
    
    return df


def create_target(df: pd.DataFrame, horizon: int = 24) -> pd.DataFrame:
    """
    Create target variable (future return).
    """
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    df['target_price'] = df['close'].shift(-horizon)
    df['target_direction'] = (df['target_return'] > 0).astype(int)
    
    return df


def clean_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Clean features by removing inf values and NaN.
    """
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.dropna()
    return df


def prepare_dataset(
    market: Market,
    timeframe: str = '1h',
    horizon: int = 24,
    train_ratio: float = 0.8,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Prepare dataset for a single market.
    """
    df = load_market_data(market, timeframe)
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    df = create_features(df)
    df = create_target(df, horizon)
    df = clean_features(df)
    
    # Feature columns
    feature_cols = [
        'return_1', 'return_6', 'return_24',
        'price_to_sma_24', 'volatility_24', 'atr_14',
        'volume_ratio', 'rsi_14', 'macd', 'macd_signal',
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
    ]
    
    # Split
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
    """
    all_dfs = []
    
    for market in markets:
        df = load_market_data(market, timeframe)
        
        if df.empty:
            print(f"  Skipping {market.symbol} - no data")
            continue
        
        df = create_features(df)
        df = create_target(df, horizon)
        df['market_symbol'] = market.symbol
        
        all_dfs.append(df)
        print(f"  {market.symbol}: {len(df)} rows")
    
    # Combine all markets
    combined_df = pd.concat(all_dfs, ignore_index=False)
    combined_df = clean_features(combined_df)
    
    # One-hot encode market symbol
    market_dummies = pd.get_dummies(combined_df['market_symbol'], prefix='market')
    combined_df = pd.concat([combined_df, market_dummies], axis=1)
    
    # Drop the original market_symbol column (string type)
    combined_df = combined_df.drop(columns=['market_symbol'])
    
    # Feature columns (base + market dummies)
    base_features = [
        'return_1', 'return_6', 'return_24',
        'price_to_sma_24', 'volatility_24', 'atr_14',
        'volume_ratio', 'rsi_14', 'macd', 'macd_signal',
        'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
    ]
    market_features = [col for col in combined_df.columns if col.startswith('market_')]
    feature_cols = base_features + market_features
    
    # Sort by time
    combined_df = combined_df.sort_index()
    
    # Split
    split_idx = int(len(combined_df) * train_ratio)
    
    train_df = combined_df.iloc[:split_idx]
    test_df = combined_df.iloc[split_idx:]
    
    X_train = train_df[feature_cols].fillna(0)
    X_test = test_df[feature_cols].fillna(0)
    y_train = train_df['target_return'].fillna(0)
    y_test = test_df['target_return'].fillna(0)
    
    # Ensure all columns are numeric
    X_train = X_train.astype(float)
    X_test = X_test.astype(float)
    
    print(f"\nDataset ready:")
    print(f"  Train: {len(X_train)} rows, {len(feature_cols)} features")
    print(f"  Test: {len(X_test)} rows")
    
    return X_train, X_test, y_train, y_test

if __name__ == '__main__':
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
        print("No BTC-USD market found.")