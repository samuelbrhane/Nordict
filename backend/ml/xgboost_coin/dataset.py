# ml/xgboost_coin/dataset.py

"""
Dataset preparation for coin-specific XGBoost.
"""

import numpy as np
import pandas as pd
from typing import Tuple

from ml.xgboost_coin.config import HORIZON_CONFIG, TRAINING_YEARS
from ml.xgboost_coin.features import (
    create_coin_features, 
    add_lag_features, 
    create_target, 
    clean_features,
    get_feature_columns,
)


def prepare_coin_dataset(
    df: pd.DataFrame,
    horizon: str = '24H',
    feature_lag: int = 12,
    train_ratio: float = 0.8,
) -> dict:
    """
    Prepare dataset for coin-specific XGBoost training.
    
    Args:
        df: Raw OHLCV DataFrame
        horizon: Prediction horizon
        feature_lag: Number of lag periods for memory
        train_ratio: Train/test split ratio
    
    Returns:
        Dict with X_train, X_test, y_train, y_test, feature_names
    """
    config = HORIZON_CONFIG.get(horizon)
    if not config:
        raise ValueError(f"Invalid horizon: {horizon}")
    
    horizon_steps = config['horizon']
    
    # Create features
    df = create_coin_features(df)
    
    # Add lag features
    df = add_lag_features(df, lag=feature_lag)
    
    # Create target
    df = create_target(df, horizon_steps)
    
    # Clean
    df = clean_features(df)
    
    # Get feature columns
    feature_cols = get_feature_columns(include_lag=True, lag=feature_lag)
    
    # Filter to only existing columns
    feature_cols = [col for col in feature_cols if col in df.columns]
    
    # Split
    split_idx = int(len(df) * train_ratio)
    
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    X_train = train_df[feature_cols].values
    X_test = test_df[feature_cols].values
    y_train = train_df['target_return'].values
    y_test = test_df['target_return'].values
    
    print(f"\nDataset prepared:")
    print(f"  Features: {len(feature_cols)} (base + {feature_lag} lags)")
    print(f"  Train samples: {len(X_train)}")
    print(f"  Test samples: {len(X_test)}")
    
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test,
        'feature_names': feature_cols,
        'feature_lag': feature_lag,
    }