# ml/xgboost_coin/kaggle_notebook.py

"""
Kaggle Notebook code for training coin-specific XGBoost.
Copy this to a Kaggle notebook and run.

Steps:
1. Upload your data CSV to Kaggle
2. Copy this code to notebook
3. Run training
4. Download model file
5. Upload to S3
6. Create DB record on EC2
"""

# ============================================================
# CELL 1: Setup
# ============================================================
import numpy as np
import pandas as pd
import json
import pickle
from datetime import datetime
from sklearn.model_selection import RandomizedSearchCV, TimeSeriesSplit
from xgboost import XGBRegressor

# Configuration - CHANGE THESE
COIN = 'BTC-USD'
HORIZON = '24H'
DATA_FILE = '/kaggle/input/your-dataset/btc_usd_hourly.csv'  # Change this

HORIZON_CONFIG = {
    '24H': {'horizon': 24},
    '30D': {'horizon': 30},
    '12W': {'horizon': 12},
    '12M': {'horizon': 12},
}

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
}

FEATURE_LAG = 12  # Lag features for memory

# ============================================================
# CELL 2: Feature Engineering
# ============================================================
def create_features(df):
    """Create extended features."""
    df = df.copy()
    
    # Returns
    for period in [1, 3, 6, 12, 24, 48, 72, 168]:
        df[f'return_{period}'] = df['close'].pct_change(period)
    
    # Volatility
    df['volatility_12'] = df['return_1'].rolling(12).std()
    df['volatility_24'] = df['return_1'].rolling(24).std()
    df['volatility_72'] = df['return_1'].rolling(72).std()
    
    # MA ratios
    for period in [12, 24, 50]:
        sma = df['close'].rolling(period).mean()
        df[f'price_to_sma_{period}'] = df['close'] / sma
    
    # RSI
    delta = df['close'].diff()
    for period in [7, 14]:
        gain = delta.where(delta > 0, 0).rolling(period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
        rs = gain / loss.replace(0, np.nan)
        df[f'rsi_{period}'] = 100 - (100 / (1 + rs))
    
    # MACD
    ema_12 = df['close'].ewm(span=12).mean()
    ema_26 = df['close'].ewm(span=26).mean()
    df['macd'] = ema_12 - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9).mean()
    
    # Volume
    df['volume_sma_24'] = df['volume'].rolling(24).mean()
    df['volume_ratio'] = df['volume'] / df['volume_sma_24']
    df['volume_change'] = df['volume'].pct_change(1)
    
    # ATR
    tr = np.maximum(
        df['high'] - df['low'],
        np.maximum(
            abs(df['high'] - df['close'].shift(1)),
            abs(df['low'] - df['close'].shift(1))
        )
    )
    df['atr_14'] = tr.rolling(14).mean()
    
    # Bollinger
    bb_mid = df['close'].rolling(20).mean()
    bb_std = df['close'].rolling(20).std()
    df['bb_position'] = (df['close'] - (bb_mid - 2*bb_std)) / (4*bb_std)
    df['bb_width'] = (4*bb_std) / bb_mid
    
    # Time
    if hasattr(df.index, 'hour'):
        df['hour_sin'] = np.sin(2 * np.pi * df.index.hour / 24)
        df['hour_cos'] = np.cos(2 * np.pi * df.index.hour / 24)
        df['dow_sin'] = np.sin(2 * np.pi * df.index.dayofweek / 7)
        df['dow_cos'] = np.cos(2 * np.pi * df.index.dayofweek / 7)
    
    return df


def add_lag_features(df, lag=12):
    """Add lag features for memory."""
    lag_cols = ['return_1', 'return_6', 'return_24', 'volatility_24', 'rsi_14', 'macd', 'volume_ratio']
    for col in lag_cols:
        if col in df.columns:
            for l in range(1, lag + 1):
                df[f'{col}_lag{l}'] = df[col].shift(l)
    return df


def create_target(df, horizon):
    """Create target."""
    df['target_return'] = df['close'].shift(-horizon) / df['close'] - 1
    return df

# ============================================================
# CELL 3: Load and Prepare Data
# ============================================================
print(f"Loading data for {COIN} {HORIZON}...")

# Load data
df = pd.read_csv(DATA_FILE, parse_dates=['timestamp'], index_col='timestamp')
print(f"Raw data: {len(df)} rows")

# Create features
df = create_features(df)
df = add_lag_features(df, FEATURE_LAG)
df = create_target(df, HORIZON_CONFIG[HORIZON]['horizon'])

# Clean
df = df.replace([np.inf, -np.inf], np.nan).dropna()
print(f"Clean data: {len(df)} rows")

# Feature columns
base_features = [
    'return_1', 'return_3', 'return_6', 'return_12', 'return_24', 'return_48', 'return_72', 'return_168',
    'volatility_12', 'volatility_24', 'volatility_72',
    'price_to_sma_12', 'price_to_sma_24', 'price_to_sma_50',
    'rsi_7', 'rsi_14', 'macd', 'macd_signal',
    'volume_ratio', 'volume_change', 'atr_14',
    'bb_position', 'bb_width',
    'hour_sin', 'hour_cos', 'dow_sin', 'dow_cos',
]

lag_features = []
for col in ['return_1', 'return_6', 'return_24', 'volatility_24', 'rsi_14', 'macd', 'volume_ratio']:
    for l in range(1, FEATURE_LAG + 1):
        lag_features.append(f'{col}_lag{l}')

feature_cols = [c for c in base_features + lag_features if c in df.columns]
print(f"Features: {len(feature_cols)}")

# Split
split_idx = int(len(df) * 0.8)
X_train = df.iloc[:split_idx][feature_cols].values
X_test = df.iloc[split_idx:][feature_cols].values
y_train = df.iloc[:split_idx]['target_return'].values
y_test = df.iloc[split_idx:]['target_return'].values

print(f"Train: {len(X_train)}, Test: {len(X_test)}")

# ============================================================
# CELL 4: Hyperparameter Tuning
# ============================================================
print("\nTuning hyperparameters...")

base_model = XGBRegressor(
    objective='reg:squarederror',
    random_state=42,
    n_jobs=-1,
    tree_method='hist',  # GPU: use 'gpu_hist'
)

tscv = TimeSeriesSplit(n_splits=5)

search = RandomizedSearchCV(
    estimator=base_model,
    param_distributions=PARAM_SPACE,
    n_iter=100,  # More iterations for better results
    cv=tscv,
    scoring='neg_mean_squared_error',
    verbose=2,
    random_state=42,
    n_jobs=-1,
)

search.fit(X_train, y_train)

best_params = search.best_params_
print(f"\nBest params: {best_params}")
print(f"Best CV RMSE: {np.sqrt(-search.best_score_):.6f}")

# ============================================================
# CELL 5: Train Final Model
# ============================================================
print("\nTraining final model...")

model = XGBRegressor(
    objective='reg:squarederror',
    random_state=42,
    n_jobs=-1,
    **best_params
)

model.fit(
    X_train, y_train,
    eval_set=[(X_test, y_test)],
    verbose=False,
)

# Evaluate
train_pred = model.predict(X_train)
test_pred = model.predict(X_test)

# Metrics
def calc_metrics(y_true, y_pred):
    mse = np.mean((y_true - y_pred) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_true - y_pred))
    
    mask = y_true != 0
    mape = np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100
    
    dir_acc = np.mean((y_true > 0) == (y_pred > 0)) * 100
    
    ss_res = np.sum((y_true - y_pred) ** 2)
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    r2 = 1 - (ss_res / ss_tot)
    
    corr = np.corrcoef(y_true, y_pred)[0, 1]
    
    return {'rmse': rmse, 'mae': mae, 'mape': mape, 'directional_accuracy': dir_acc, 'r2': r2, 'correlation': corr}

train_metrics = calc_metrics(y_train, train_pred)
test_metrics = calc_metrics(y_test, test_pred)

print(f"\nTrain - RMSE: {train_metrics['rmse']:.6f}, Dir: {train_metrics['directional_accuracy']:.2f}%")
print(f"Test  - RMSE: {test_metrics['rmse']:.6f}, Dir: {test_metrics['directional_accuracy']:.2f}%")

# ============================================================
# CELL 6: Save Model
# ============================================================
version = datetime.utcnow().strftime('%Y%m%d_%H%M%S')
model_filename = f'xgboost_coin_{COIN.replace("-", "_")}_{HORIZON}_{version}.pkl'

model_data = {
    'model': model,
    'feature_names': feature_cols,
    'feature_lag': FEATURE_LAG,
    'coin': COIN,
    'horizon': HORIZON,
    'params': best_params,
    'metrics': test_metrics,
    'trained_at': datetime.utcnow().isoformat(),
    'model_type': 'xgboost_coin',
}

with open(model_filename, 'wb') as f:
    pickle.dump(model_data, f)

print(f"\nModel saved: {model_filename}")

# ============================================================
# CELL 7: Print EC2 Commands
# ============================================================
S3_BUCKET = 'nordict-ml-models-xxxxx'  # Your bucket

print("\n" + "="*60)
print("1. DOWNLOAD model file from Kaggle Output")
print("="*60)

print("\n" + "="*60)
print("2. UPLOAD TO S3:")
print("="*60)
print(f"aws s3 cp {model_filename} s3://{S3_BUCKET}/models/")

print("\n" + "="*60)
print("3. RUN ON EC2 TO CREATE DB RECORD:")
print("="*60)
print(f'''
python manage.py shell -c "
from markets.models import Market
from forecasts.models import MLModel

market = Market.objects.get(symbol='{COIN}')

# Demote existing production model for this coin/horizon
MLModel.objects.filter(
    model_type='xgboost',
    market=market,
    horizon='{HORIZON}',
    status='production'
).update(status='deprecated')

# Create new production model
model = MLModel.objects.create(
    name='XGBoost-Coin',
    version='{version}',
    model_type='xgboost',
    horizon='{HORIZON}',
    market=market,
    status='production',
    artifact_path='s3://{S3_BUCKET}/models/{model_filename}',
    mae={test_metrics['mae']},
    rmse={test_metrics['rmse']},
    mape={test_metrics['mape']},
    directional_accuracy={test_metrics['directional_accuracy']},
    r2={test_metrics['r2']},
    correlation={test_metrics['correlation']},
    config={json.dumps({'params': best_params, 'feature_lag': FEATURE_LAG, 'n_features': len(feature_cols)})},
    description='Coin-specific XGBoost for {COIN} {HORIZON} with {FEATURE_LAG} lag features',
)

print(f'Created: {{model}}')
print(f'ID: {{model.id}}')
"
''')
print("="*60)