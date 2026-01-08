# ml/lstm/config.py

"""
LSTM configuration - OPTIMIZED FOR SPEED
Works for both local and Colab.
"""

# Training data years per horizon
TRAINING_YEARS = {
    '24H': 2,
    '30D': 3,
    '12W': 4,
    '12M': 5,
}

# Horizon configurations
HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'horizon': 24},
    '30D': {'timeframe': '1d', 'horizon': 30},
    '12W': {'timeframe': '1w', 'horizon': 12},
    '12M': {'timeframe': '1M', 'horizon': 12},
}

# Reduced search space for faster training
PARAM_SPACE = {
    'sequence_length': [24, 48],
    'lstm_layers': [1, 2],
    'lstm_units': (32, 96),
    'dense_layers': [0, 1],
    'dense_units': (16, 48),
    'dropout': (0.1, 0.3),
    'recurrent_dropout': (0.0, 0.15),
    'l2_reg': (0.0, 0.005),
    'learning_rate': (0.0005, 0.005),
    'batch_size': [64, 128],
    'optimizer': ['adam'],
    'bidirectional': [False],
    'use_attention': [False],
    'use_returns_only': [False],
    'feature_lag': [0],
    'normalize_method': ['standard'],
}

# Default params
DEFAULT_PARAMS = {
    'sequence_length': 48,
    'lstm_layers': 1,
    'lstm_units': 64,
    'dense_layers': 1,
    'dense_units': 32,
    'dropout': 0.2,
    'recurrent_dropout': 0.1,
    'l2_reg': 0.001,
    'learning_rate': 0.001,
    'batch_size': 64,
    'optimizer': 'adam',
    'bidirectional': False,
    'use_attention': False,
    'use_returns_only': False,
    'feature_lag': 0,
    'normalize_method': 'standard',
    'epochs': 100,
    'early_stopping_patience': 10,
}



TRAINING_QUEUE = {
    # Priority 1: Top coins (full 5 years data)
    'BTC-USD': ['24H', '30D', '12W', '12M'],
    'ETH-USD': ['24H', '30D', '12W', '12M'],
    'SOL-USD': ['24H', '30D', '12W', '12M'],
    'BNB-USD': ['24H', '30D', '12W', '12M'],
    'XRP-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 2: Major alts (full 5 years data)
    'ADA-USD': ['24H', '30D', '12W', '12M'],
    'AVAX-USD': ['24H', '30D', '12W', '12M'],
    'DOGE-USD': ['24H', '30D', '12W', '12M'],
    'DOT-USD': ['24H', '30D', '12W', '12M'],
    'LINK-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 3: DeFi & Layer 2
    'MATIC-USD': ['24H', '30D', '12W'],  # Data stops 2024-09-10
    'UNI-USD': ['24H', '30D', '12W', '12M'],
    'AAVE-USD': ['24H', '30D', '12W', '12M'],
    'ARB-USD': ['24H', '30D'],  # ~2.8 years
    'OP-USD': ['24H', '30D', '12W'],  # ~3.6 years
    
    # Priority 4: Other major (full 5 years data)
    'ATOM-USD': ['24H', '30D', '12W', '12M'],
    'LTC-USD': ['24H', '30D', '12W', '12M'],
    'ETC-USD': ['24H', '30D', '12W', '12M'],
    'XLM-USD': ['24H', '30D', '12W', '12M'],
    'NEAR-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 5: Emerging (limited data)
    'APT-USD': ['24H', '30D', '12W'],  # ~3.2 years
    'SUI-USD': ['24H', '30D'],  # ~2.7 years
    'SEI-USD': ['24H', '30D'],  # ~2.4 years
    'INJ-USD': ['24H', '30D', '12W', '12M'],  # full data
    'TIA-USD': ['24H', '30D'],  # ~2.2 years
    
    # Priority 6: AI & Gaming
    'FET-USD': ['24H', '30D', '12W', '12M'],  # full data
    'RENDER-USD': ['24H'],  # ~1.5 years only
    'TAO-USD': ['24H'],  # ~1.7 years only
    'IMX-USD': ['24H', '30D', '12W'],  # ~4 years
    'GALA-USD': ['24H', '30D', '12W'],  # ~4.3 years
    
    # Priority 7: Meme
    'SHIB-USD': ['24H', '30D', '12W', '12M'],  # ~4.7 years
    'PEPE-USD': ['24H', '30D'],  # ~2.7 years
    'WIF-USD': ['24H'],  # ~1.8 years only
    
    # Priority 8: DeFi protocols
    'MKR-USD': ['24H', '30D', '12W', '12M'],  # Data stops 2025-09-15 but still ~4.7 years
    'SNX-USD': ['24H', '30D', '12W', '12M'],
    'CRV-USD': ['24H', '30D', '12W', '12M'],
    'LDO-USD': ['24H', '30D', '12W'],  # ~3.7 years
    'GRT-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 9: Infrastructure
    'FIL-USD': ['24H', '30D', '12W', '12M'],
    'STX-USD': ['24H', '30D', '12W', '12M'],
    'RUNE-USD': ['24H', '30D', '12W', '12M'],
    'ENS-USD': ['24H', '30D', '12W'],  # ~4.2 years
    
    # Priority 10: Metaverse & Gaming
    'SAND-USD': ['24H', '30D', '12W', '12M'],
    'MANA-USD': ['24H', '30D', '12W', '12M'],
    'AXS-USD': ['24H', '30D', '12W', '12M'],
    'FLOW-USD': ['24H', '30D', '12W'],  # ~4.4 years
    'CHZ-USD': ['24H', '30D', '12W', '12M'],
    'ENJ-USD': ['24H', '30D', '12W', '12M'],
    'GMT-USD': ['24H', '30D', '12W'],  # ~3.8 years
    'APE-USD': ['24H', '30D', '12W'],  # ~3.8 years
    'ALGO-USD': ['24H', '30D', '12W', '12M'],
}
