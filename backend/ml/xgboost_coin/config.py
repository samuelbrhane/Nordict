# ml/xgboost_coin/config.py

"""
Coin-specific XGBoost configuration.
"""

# Training data years per horizon (more than general model)
TRAINING_YEARS = {
    '24H': 3,   # 3 years for 24H
    '30D': 4,   # 4 years for 30D
    '12W': 5,   # 5 years for 12W
    '12M': 5,   # 5 years for 12M
}

# Horizon configurations
HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'horizon': 24},
    '30D': {'timeframe': '1d', 'horizon': 30},
    '12W': {'timeframe': '1w', 'horizon': 12},
    '12M': {'timeframe': '1M', 'horizon': 12},
}

# Extended hyperparameter search space
PARAM_SPACE = {
    'n_estimators': [200, 300, 500, 800],
    'max_depth': [3, 4, 5, 6, 7, 8, 10],
    'learning_rate': [0.01, 0.02, 0.03, 0.05, 0.1],
    'subsample': [0.6, 0.7, 0.8, 0.9],
    'colsample_bytree': [0.6, 0.7, 0.8, 0.9],
    'min_child_weight': [1, 3, 5, 7, 10],
    'gamma': [0, 0.1, 0.2, 0.3, 0.5],
    'reg_alpha': [0, 0.01, 0.1, 0.5, 1],
    'reg_lambda': [1, 1.5, 2, 3, 5],
    'feature_lag': [0, 3, 6, 12, 24],  # Lag features for memory
}

# Default params
DEFAULT_PARAMS = {
    'n_estimators': 300,
    'max_depth': 6,
    'learning_rate': 0.05,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'min_child_weight': 3,
    'gamma': 0.1,
    'reg_alpha': 0.01,
    'reg_lambda': 1.5,
    'feature_lag': 12,
}

# Training queue - same as LSTM but for XGBoost
TRAINING_QUEUE = {
    # Priority 1: Top coins (full 5 years data)
    'BTC-USD': ['24H', '30D', '12W', '12M'],
    'ETH-USD': ['24H', '30D', '12W', '12M'],
    'SOL-USD': ['24H', '30D', '12W', '12M'],
    'BNB-USD': ['24H', '30D', '12W', '12M'],
    'XRP-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 2: Major alts
    'ADA-USD': ['24H', '30D', '12W', '12M'],
    'AVAX-USD': ['24H', '30D', '12W', '12M'],
    'DOGE-USD': ['24H', '30D', '12W', '12M'],
    'DOT-USD': ['24H', '30D', '12W', '12M'],
    'LINK-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 3: DeFi & Layer 2
    'UNI-USD': ['24H', '30D', '12W', '12M'],
    'AAVE-USD': ['24H', '30D', '12W', '12M'],
    'ARB-USD': ['24H', '30D'],
    'OP-USD': ['24H', '30D', '12W'],
    
    # Priority 4: Other major
    'ATOM-USD': ['24H', '30D', '12W', '12M'],
    'LTC-USD': ['24H', '30D', '12W', '12M'],
    'ETC-USD': ['24H', '30D', '12W', '12M'],
    'XLM-USD': ['24H', '30D', '12W', '12M'],
    'NEAR-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 5: Emerging
    'APT-USD': ['24H', '30D', '12W'],
    'SUI-USD': ['24H', '30D'],
    'SEI-USD': ['24H', '30D'],
    'INJ-USD': ['24H', '30D', '12W', '12M'],
    'TIA-USD': ['24H', '30D'],
    
    # Priority 6: AI & Gaming
    'FET-USD': ['24H', '30D', '12W', '12M'],
    'RENDER-USD': ['24H'],
    'TAO-USD': ['24H'],
    'IMX-USD': ['24H', '30D', '12W'],
    'GALA-USD': ['24H', '30D', '12W'],
    
    # Priority 7: Meme
    'SHIB-USD': ['24H', '30D', '12W', '12M'],
    'PEPE-USD': ['24H', '30D'],
    'WIF-USD': ['24H'],
    
    # Priority 8: DeFi protocols
    'MKR-USD': ['24H', '30D', '12W', '12M'],
    'SNX-USD': ['24H', '30D', '12W', '12M'],
    'CRV-USD': ['24H', '30D', '12W', '12M'],
    'LDO-USD': ['24H', '30D', '12W'],
    'GRT-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 9: Infrastructure
    'FIL-USD': ['24H', '30D', '12W', '12M'],
    'STX-USD': ['24H', '30D', '12W', '12M'],
    'RUNE-USD': ['24H', '30D', '12W', '12M'],
    'ENS-USD': ['24H', '30D', '12W'],
    
    # Priority 10: Metaverse & Gaming
    'SAND-USD': ['24H', '30D', '12W', '12M'],
    'MANA-USD': ['24H', '30D', '12W', '12M'],
    'AXS-USD': ['24H', '30D', '12W', '12M'],
    'FLOW-USD': ['24H', '30D', '12W'],
    'CHZ-USD': ['24H', '30D', '12W', '12M'],
    'ENJ-USD': ['24H', '30D', '12W', '12M'],
    'GMT-USD': ['24H', '30D', '12W'],
    'APE-USD': ['24H', '30D', '12W'],
    'ALGO-USD': ['24H', '30D', '12W', '12M'],
}