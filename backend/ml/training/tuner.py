# ml/training/tuner.py

"""
Hyperparameter tuning for XGBoost model.
Skips coins that already have LSTM models for the horizon.

Usage:
    python -m ml.training.tuner --horizon 24H
"""

import os
import sys
import json

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
from datetime import datetime
from sklearn.model_selection import RandomizedSearchCV, TimeSeriesSplit
from xgboost import XGBRegressor

from markets.models import Market
from forecasts.models import MLModel
from ml.features.engineer import prepare_multi_market_dataset


# Hyperparameter search space
PARAM_SPACE = {
    'n_estimators': [100, 200, 300, 500],
    'max_depth': [3, 4, 5, 6, 7, 8],
    'learning_rate': [0.01, 0.02, 0.05, 0.1],
    'subsample': [0.6, 0.7, 0.8, 0.9],
    'colsample_bytree': [0.6, 0.7, 0.8, 0.9],
    'min_child_weight': [1, 3, 5, 7],
    'gamma': [0, 0.1, 0.2, 0.3],
    'reg_alpha': [0, 0.01, 0.1, 1],
    'reg_lambda': [1, 1.5, 2, 3],
}

# Horizon configurations
HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'horizon': 24},
    '30D': {'timeframe': '1d', 'horizon': 30},
    '12W': {'timeframe': '1w', 'horizon': 12},
    '12M': {'timeframe': '1M', 'horizon': 12},
}


def get_xgboost_markets(horizon: str) -> list:
    """
    Get markets that should use XGBoost (no LSTM model exists).
    
    Args:
        horizon: Prediction horizon
    
    Returns:
        List of Market objects without LSTM models for this horizon
    """
    # Get all active markets
    all_markets = Market.objects.filter(status='active')
    
    # Get markets that have LSTM production models for this horizon
    lstm_market_ids = MLModel.objects.filter(
        model_type=MLModel.ModelType.LSTM,
        horizon=horizon,
        status=MLModel.Status.PRODUCTION
    ).values_list('market_id', flat=True)
    
    # Exclude markets with LSTM models
    xgboost_markets = all_markets.exclude(id__in=lstm_market_ids)
    
    return list(xgboost_markets)


def tune_hyperparameters(
    horizon: str,
    n_iter: int = 50,
    cv_splits: int = 5,
    save_results: bool = True,
) -> dict:
    """
    Find best hyperparameters for a horizon.
    Only uses markets without LSTM models.
    
    Args:
        horizon: '24H', '30D', '12W', '12M'
        n_iter: Number of random combinations to try
        cv_splits: Number of cross-validation splits
        save_results: Save results to file
    
    Returns:
        Best parameters dict
    """
    config = HORIZON_CONFIG.get(horizon)
    if not config:
        raise ValueError(f"Invalid horizon: {horizon}")
    
    print(f"\n{'='*50}")
    print(f"TUNING HYPERPARAMETERS FOR {horizon} (XGBoost)")
    print(f"{'='*50}")
    print(f"Timeframe: {config['timeframe']}")
    print(f"Horizon: {config['horizon']} steps")
    
    # Get markets without LSTM models
    markets = get_xgboost_markets(horizon)
    
    # Count LSTM markets for info
    all_markets_count = Market.objects.filter(status='active').count()
    lstm_markets_count = all_markets_count - len(markets)
    
    print(f"Total markets: {all_markets_count}")
    print(f"LSTM markets (skipped): {lstm_markets_count}")
    print(f"XGBoost markets (training): {len(markets)}")
    
    if not markets:
        print("\nNo markets need XGBoost - all have LSTM models!")
        return {}
    
    # Prepare dataset
    print("\nPreparing dataset...")
    X_train, X_test, y_train, y_test = prepare_multi_market_dataset(
        markets=markets,
        timeframe=config['timeframe'],
        horizon=config['horizon'],
        train_ratio=0.8,
    )
    
    # Base model
    base_model = XGBRegressor(
        objective='reg:squarederror',
        random_state=42,
        n_jobs=-1,
    )
    
    # Time series cross-validation
    tscv = TimeSeriesSplit(n_splits=cv_splits)
    
    # Randomized search
    print(f"\nRunning RandomizedSearchCV with {n_iter} iterations...")
    search = RandomizedSearchCV(
        estimator=base_model,
        param_distributions=PARAM_SPACE,
        n_iter=n_iter,
        cv=tscv,
        scoring='neg_mean_squared_error',
        verbose=1,
        random_state=42,
        n_jobs=-1,
    )
    
    search.fit(X_train, y_train)
    
    # Results
    best_params = search.best_params_
    best_score = search.best_score_
    
    print(f"\n{'='*50}")
    print("BEST PARAMETERS:")
    print(f"{'='*50}")
    for param, value in best_params.items():
        print(f"  {param}: {value}")
    print(f"\nBest CV Score (neg MSE): {best_score:.6f}")
    print(f"Best CV Score (RMSE): {np.sqrt(-best_score):.6f}")
    
    # Test on held-out data
    best_model = search.best_estimator_
    test_predictions = best_model.predict(X_test)
    test_mse = np.mean((y_test - test_predictions) ** 2)
    test_rmse = np.sqrt(test_mse)
    test_mae = np.mean(np.abs(y_test - test_predictions))
    
    print(f"\nTest Set Performance:")
    print(f"  RMSE: {test_rmse:.6f}")
    print(f"  MAE: {test_mae:.6f}")
    
    # Save results
    if save_results:
        results = {
            'horizon': horizon,
            'timeframe': config['timeframe'],
            'horizon_steps': config['horizon'],
            'best_params': best_params,
            'cv_score_mse': float(-best_score),
            'cv_score_rmse': float(np.sqrt(-best_score)),
            'test_rmse': float(test_rmse),
            'test_mae': float(test_mae),
            'n_iter': n_iter,
            'cv_splits': cv_splits,
            'train_samples': len(X_train),
            'test_samples': len(X_test),
            'n_features': len(X_train.columns),
            'n_markets': len(markets),
            'lstm_markets_skipped': lstm_markets_count,
            'tuned_at': datetime.utcnow().isoformat(),
        }
        
        # Save to file
        output_dir = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            'configs'
        )
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(output_dir, f'best_params_{horizon}.json')
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nResults saved to: {output_file}")
    
    return best_params


def tune_all_horizons(n_iter: int = 50):
    """Tune hyperparameters for all horizons."""
    
    all_results = {}
    
    for horizon in ['24H', '30D', '12W', '12M']:
        try:
            best_params = tune_hyperparameters(horizon, n_iter=n_iter)
            all_results[horizon] = best_params
        except Exception as e:
            print(f"\nError tuning {horizon}: {e}")
            continue
    
    print(f"\n{'='*50}")
    print("ALL HORIZONS COMPLETE")
    print(f"{'='*50}")
    
    return all_results


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Tune XGBoost hyperparameters')
    parser.add_argument('--horizon', type=str, default=None, help='Horizon to tune (24H, 30D, 12W, 12M)')
    parser.add_argument('--n_iter', type=int, default=50, help='Number of iterations')
    parser.add_argument('--all', action='store_true', help='Tune all horizons')
    args = parser.parse_args()
    
    if args.all:
        tune_all_horizons(n_iter=args.n_iter)
    elif args.horizon:
        tune_hyperparameters(args.horizon, n_iter=args.n_iter)
    else:
        print("Usage:")
        print("  python -m ml.training.tuner --horizon 24H")
        print("  python -m ml.training.tuner --all")
        print("  python -m ml.training.tuner --horizon 24H --n_iter 100")