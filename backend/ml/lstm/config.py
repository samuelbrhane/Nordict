# ml/lstm/config.py

"""
LSTM configuration.
Tracks which coins use LSTM vs XGBoost.

Update manually as you train new LSTM models.
"""

# ==========================================
# TRAINING QUEUE
# ==========================================
# Remove coin/horizon once LSTM is trained and promoted to production
# Format: {coin: [horizons still needing LSTM]}

TRAINING_QUEUE = {
    # Priority 1: Top coins
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
    'MATIC-USD': ['24H', '30D', '12W', '12M'],
    'UNI-USD': ['24H', '30D', '12W', '12M'],
    'AAVE-USD': ['24H', '30D', '12W', '12M'],
    'ARB-USD': ['24H', '30D', '12W', '12M'],
    'OP-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 4: Other major
    'ATOM-USD': ['24H', '30D', '12W', '12M'],
    'LTC-USD': ['24H', '30D', '12W', '12M'],
    'ETC-USD': ['24H', '30D', '12W', '12M'],
    'XLM-USD': ['24H', '30D', '12W', '12M'],
    'NEAR-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 5: Emerging
    'APT-USD': ['24H', '30D', '12W', '12M'],
    'SUI-USD': ['24H', '30D', '12W', '12M'],
    'SEI-USD': ['24H', '30D', '12W', '12M'],
    'INJ-USD': ['24H', '30D', '12W', '12M'],
    'TIA-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 6: AI & Gaming
    'FET-USD': ['24H', '30D', '12W', '12M'],
    'RENDER-USD': ['24H', '30D', '12W', '12M'],
    'TAO-USD': ['24H', '30D', '12W', '12M'],
    'IMX-USD': ['24H', '30D', '12W', '12M'],
    'GALA-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 7: Meme
    'SHIB-USD': ['24H', '30D', '12W', '12M'],
    'PEPE-USD': ['24H', '30D', '12W', '12M'],
    'WIF-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 8: DeFi protocols
    'MKR-USD': ['24H', '30D', '12W', '12M'],
    'SNX-USD': ['24H', '30D', '12W', '12M'],
    'CRV-USD': ['24H', '30D', '12W', '12M'],
    'LDO-USD': ['24H', '30D', '12W', '12M'],
    'GRT-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 9: Infrastructure
    'FIL-USD': ['24H', '30D', '12W', '12M'],
    'STX-USD': ['24H', '30D', '12W', '12M'],
    'RUNE-USD': ['24H', '30D', '12W', '12M'],
    'ENS-USD': ['24H', '30D', '12W', '12M'],
    
    # Priority 10: Metaverse & Gaming
    'SAND-USD': ['24H', '30D', '12W', '12M'],
    'MANA-USD': ['24H', '30D', '12W', '12M'],
    'AXS-USD': ['24H', '30D', '12W', '12M'],
    'FLOW-USD': ['24H', '30D', '12W', '12M'],
    'CHZ-USD': ['24H', '30D', '12W', '12M'],
    'ENJ-USD': ['24H', '30D', '12W', '12M'],
    'GMT-USD': ['24H', '30D', '12W', '12M'],
    'APE-USD': ['24H', '30D', '12W', '12M'],
    'ALGO-USD': ['24H', '30D', '12W', '12M'],
}

# ==========================================
# CURRENT TRAINING TARGET
# ==========================================
# Change manually each day
# This coin/horizon stays on XGBoost until training completes

TRAINING_TODAY = {
    'coin': 'BTC-USD',
    'horizon': '24H',
}

# ==========================================
# HYPERPARAMETER SEARCH SPACE
# ==========================================

PARAM_SPACE = {
    # Sequence/Input
    'sequence_length': [24, 48, 72, 96, 120, 168],
    
    # Architecture
    'lstm_layers': [1, 2, 3],
    'lstm_units': (32, 256),
    'dense_layers': [0, 1, 2],
    'dense_units': (16, 128),
    
    # Regularization
    'dropout': (0.1, 0.4),
    'recurrent_dropout': (0.0, 0.3),
    'l2_reg': (0.0, 0.01),
    
    # Training
    'learning_rate': (0.0001, 0.01),
    'batch_size': [16, 32, 64, 128],
    'optimizer': ['adam', 'rmsprop', 'adamw'],
    
    # LSTM specific
    'bidirectional': [True, False],
    'use_attention': [True, False],
    
    # Feature engineering
    'use_returns_only': [True, False],
    'feature_lag': [0, 1, 2, 3],
    'normalize_method': ['standard', 'minmax', 'robust'],
}

# ==========================================
# DEFAULT PARAMS
# ==========================================

DEFAULT_PARAMS = {
    'sequence_length': 72,
    'lstm_layers': 2,
    'lstm_units': 128,
    'dense_layers': 1,
    'dense_units': 64,
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

# ==========================================
# HORIZON CONFIGURATIONS
# ==========================================

HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'horizon': 24},
    '30D': {'timeframe': '1d', 'horizon': 30},
    '12W': {'timeframe': '1w', 'horizon': 12},
    '12M': {'timeframe': '1M', 'horizon': 12},
}