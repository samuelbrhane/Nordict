# ml/prediction/predictor.py

"""
Generate forecasts using trained models.
Supports XGBoost (coin-specific) and XGBoost (general).

Usage:
    python -m ml.prediction.predictor --horizon 24H
    python -m ml.prediction.predictor --all
"""

import os
import sys
import pickle
from ml.storage.model_store import load_model
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
from alerts.services import process_alerts_for_forecast
import django
django.setup()

import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from decimal import Decimal
from django.utils import timezone
from django.db import transaction

from markets.models import Market, MarketData
from forecasts.models import MLModel, Forecast, ForecastPoint
from ml.features.engineer import load_market_data, create_features


# Horizon configurations
HORIZON_CONFIG = {
    '24H': {
        'timeframe': '1h',
        'horizon': 24,
        'step_timedelta': timedelta(hours=1),
    },
    '30D': {
        'timeframe': '1d',
        'horizon': 30,
        'step_timedelta': timedelta(days=1),
    },
    '12W': {
        'timeframe': '1w',
        'horizon': 12,
        'step_timedelta': timedelta(weeks=1),
    },
    '12M': {
        'timeframe': '1M',
        'horizon': 12,
        'step_timedelta': timedelta(days=30),
    },
}


def load_production_model(horizon: str, market: Market = None) -> tuple:
    """
    Load production model for a horizon.
    Priority: XGBoost (coin-specific) > XGBoost (general)
    
    Args:
        horizon: Prediction horizon ('24H', '30D', '12W', '12M')
        market: Market object (required for coin-specific check)
    
    Returns:
        (model, feature_names, db_model, model_type)
    """
    db_model = None
    model_type = None
    
    if market:
        # 1. Check for XGBoost coin-specific model
        db_model = MLModel.objects.filter(
            model_type=MLModel.ModelType.XGBOOST,
            market=market,
            horizon=horizon,
            status=MLModel.Status.PRODUCTION
        ).first()
        
        if db_model:
            model_type = 'xgboost_coin'
    
    # 2. Fallback to XGBoost general model
    if not db_model:
        db_model = MLModel.objects.filter(
            model_type=MLModel.ModelType.XGBOOST,
            market__isnull=True,  # General model has no market
            horizon=horizon,
            status=MLModel.Status.PRODUCTION
        ).first()
        
        if db_model:
            model_type = 'xgboost_general'
    
    if not db_model:
        raise ValueError(f"No production model for {horizon}. Train and promote one first.")
    
    # Load from storage (local or S3)
    model_data = load_model(db_model.artifact_path)
    
    return model_data['model'], model_data['feature_names'], db_model, model_type


def get_latest_features(market: Market, timeframe: str, feature_names: list, model_type: str = 'xgboost_general', model_data: dict = None) -> pd.DataFrame:
    """
    Get latest features for prediction.
    
    Args:
        market: Market to get features for
        timeframe: Data timeframe
        feature_names: List of feature names to include
        model_type: 'xgboost_coin' or 'xgboost_general'
        model_data: Full model data dict (for coin-specific with scaler/lag)
    
    Returns:
        DataFrame with one row of features
    """
    df = load_market_data(market, timeframe, years=1)
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    if model_type == 'xgboost_coin' and model_data:
        # Use coin-specific features (may have more features + lag)
        from ml.xgboost_coin.features import create_coin_features, add_lag_features
        df = create_coin_features(df)
        
        # Add lag features if model was trained with them
        feature_lag = model_data.get('feature_lag', 0)
        if feature_lag > 0:
            df = add_lag_features(df, feature_lag)
    else:
        # Use general XGBoost features
        df = create_features(df)
        
        # Add market one-hot encoding (general XGBoost only)
        for col in feature_names:
            if col.startswith('market_'):
                market_symbol = col.replace('market_', '')
                df[col] = 1 if market.symbol == market_symbol else 0
    
    # Get latest row
    latest = df.iloc[[-1]]
    
    # Ensure all required features exist
    for col in feature_names:
        if col not in latest.columns:
            latest[col] = 0
    
    # Select only needed features in correct order
    latest = latest[feature_names]
    
    return latest


def calculate_prediction_bounds(
    predicted_price: float,
    confidence: float,
    volatility: float = 0.02,
) -> tuple:
    """Calculate upper and lower bounds based on confidence."""
    width = volatility * (1 - confidence) * 2
    lower = predicted_price * (1 - width)
    upper = predicted_price * (1 + width)
    return lower, upper


def determine_direction(current_price: float, predicted_prices: list) -> str:
    """Determine overall forecast direction."""
    avg_predicted = np.mean(predicted_prices)
    change_pct = (avg_predicted - current_price) / current_price
    
    if change_pct > 0:
        return Forecast.Direction.UP
    elif change_pct < 0:
        return Forecast.Direction.DOWN
    else:
        return Forecast.Direction.NEUTRAL
    
    
def scale_confidence_for_display(internal_confidence: float, horizon: str) -> float:
    """Scale confidence for better UI display (general XGBoost only)."""
    if horizon == '24H':
        min_in, max_in = 0.55, 0.75
        min_out, max_out = 0.65, 0.85
    elif horizon == '30D':
        min_in, max_in = 0.40, 0.60
        min_out, max_out = 0.55, 0.75
    elif horizon == '12W':
        min_in, max_in = 0.30, 0.50
        min_out, max_out = 0.45, 0.65
    else:  # 12M
        min_in, max_in = 0.25, 0.45
        min_out, max_out = 0.40, 0.60
    
    clamped = max(min_in, min(max_in, internal_confidence))
    scaled = min_out + (clamped - min_in) * (max_out - min_out) / (max_in - min_in)
    return round(scaled, 2)


def generate_forecast(
    market: Market,
    horizon: str,
    model=None,
    feature_names: list = None,
    db_model: MLModel = None,
    model_type: str = None,
    model_data: dict = None,
) -> Forecast:
    """
    Generate forecast for a single market.
    Preserves past predictions, only updates future timestamps.
    """
    config = HORIZON_CONFIG[horizon]
    
    # Load model if not provided
    if model is None:
        model, feature_names, db_model, model_type = load_production_model(horizon, market)
    
    # Get current price
    latest_data = MarketData.objects.filter(
        market=market,
        timeframe=config['timeframe']
    ).order_by('-timestamp').first()
    
    if not latest_data:
        raise ValueError(f"No price data for {market.symbol}")
    
    current_price = float(latest_data.close)
    
    # Get features
    features = get_latest_features(market, config['timeframe'], feature_names, model_type, model_data)
    
    # Predict
    predicted_return = model.predict(features)[0]
    
    # ==========================================
    # CONFIDENCE - Coin-specific vs General
    # ==========================================
    if model_type == 'xgboost_coin':
        # Coin-specific: Use real directional accuracy, no fake adjustments
        base_confidence = db_model.directional_accuracy / 100 if db_model.directional_accuracy else 0.55
        decay_rate = 0.001  # Minimal decay
        
    else:
        # General XGBoost: Keep artificial adjustments (temporary)
        volatility = features['volatility_24'].values[0] if 'volatility_24' in features.columns else 0.02
        
        if horizon == '24H':
            base_confidence = 0.75
            decay_rate = 0.005
        elif horizon == '30D':
            base_confidence = 0.65
            decay_rate = 0.003
        elif horizon == '12W':
            base_confidence = 0.55
            decay_rate = 0.008
        else:
            base_confidence = 0.50
            decay_rate = 0.008
        
        volatility_penalty = min(0.10, volatility * 2)
        base_confidence = base_confidence - volatility_penalty
        
        prediction_magnitude = abs(predicted_return)
        magnitude_penalty = min(0.05, prediction_magnitude)
        base_confidence = base_confidence - magnitude_penalty
        
        base_confidence = max(0.35, min(0.85, base_confidence))
    
    # Generate price path
    predicted_final_price = current_price * (1 + predicted_return)
    predicted_prices = []
    
    noise_scale = 0.005 if model_type == 'xgboost_coin' else 0.008

    price = current_price
    for i in range(config['horizon']):
        progress = (i + 1) / config['horizon']
        target_price = current_price + (predicted_final_price - current_price) * progress
        
        step_variation = np.random.normal(0, noise_scale)
        price = price * (1 + step_variation)
        price = price * 0.7 + target_price * 0.3
        
        predicted_prices.append(price)

    predicted_prices[-1] = predicted_final_price
    
    # Confidence scores
    confidences = []
    for i in range(len(predicted_prices)):
        conf = max(0.30, base_confidence - (i * decay_rate))
        confidences.append(conf)
    
    direction = determine_direction(current_price, predicted_prices)
    
    # Coin-specific: real confidence, General: scaled for display
    if model_type == 'xgboost_coin':
        display_confidence = round(np.mean(confidences), 2)
    else:
        display_confidence = scale_confidence_for_display(np.mean(confidences), horizon)
    
    now = timezone.now()
    valid_from = now
    valid_until = now + config['step_timedelta'] * config['horizon']
    base_time = now.replace(minute=0, second=0, microsecond=0)
    
    with transaction.atomic():
        forecast, created = Forecast.objects.update_or_create(
            market=market,
            horizon=horizon,
            is_latest=True,
            defaults={
                'model': db_model,
                'generated_at': now,
                'valid_from': valid_from,
                'valid_until': valid_until,
                'direction': direction,
                'confidence_score': display_confidence,
                'current_price': Decimal(str(current_price)),
                'predicted_low': Decimal(str(min(predicted_prices))),
                'predicted_mid': Decimal(str(np.mean(predicted_prices))),
                'predicted_high': Decimal(str(max(predicted_prices))),
            }
        )
        
        # Update or create forecast points for future timestamps only
        for i, (price, conf) in enumerate(zip(predicted_prices, confidences)):
            timestamp = base_time + config['step_timedelta'] * (i + 1)
            
            # Skip past timestamps - keep existing predictions with actual_price
            if timestamp <= now:
                continue
            
            lower, upper = calculate_prediction_bounds(price, conf)
            
            # Update if timestamp exists, create if not
            ForecastPoint.objects.update_or_create(
                forecast=forecast,
                timestamp=timestamp,
                defaults={
                    'step': i,
                    'predicted_price': Decimal(str(price)),
                    'confidence_low': Decimal(str(lower)),
                    'confidence_high': Decimal(str(upper)),
                    'confidence_score': conf,
                }
            )
    
    process_alerts_for_forecast(forecast)
    return forecast


def generate_all_forecasts(horizon: str) -> list:
    """Generate forecasts for all active markets."""
    print(f"\n{'='*50}")
    print(f"GENERATING {horizon} FORECASTS")
    print(f"{'='*50}")
    
    markets = Market.objects.filter(status='active')
    print(f"Markets: {markets.count()}")
    
    forecasts = []
    errors = []
    
    # Cache general XGBoost model (used as fallback)
    xgb_general_model, xgb_general_features, xgb_general_db_model = None, None, None
    try:
        xgb_general_db_model = MLModel.objects.filter(
            model_type=MLModel.ModelType.XGBOOST,
            market__isnull=True,  # General model
            horizon=horizon,
            status=MLModel.Status.PRODUCTION
        ).first()
        if xgb_general_db_model:
            xgb_general_data = load_model(xgb_general_db_model.artifact_path)
            xgb_general_model = xgb_general_data['model']
            xgb_general_features = xgb_general_data['feature_names']
            print(f"General XGBoost: {xgb_general_db_model.name} v{xgb_general_db_model.version}")
    except Exception as e:
        print(f"Warning: No general XGBoost model available - {e}")
    
    for market in markets:
        try:
            # 1. Check for coin-specific XGBoost model first
            coin_db_model = MLModel.objects.filter(
                model_type=MLModel.ModelType.XGBOOST,
                market=market,
                horizon=horizon,
                status=MLModel.Status.PRODUCTION
            ).first()
            
            if coin_db_model:
                # Use coin-specific XGBoost
                coin_data = load_model(coin_db_model.artifact_path)
                forecast = generate_forecast(
                    market=market,
                    horizon=horizon,
                    model=coin_data['model'],
                    feature_names=coin_data['feature_names'],
                    db_model=coin_db_model,
                    model_type='xgboost_coin',
                    model_data=coin_data,
                )
                print(f"  {market.symbol}: {forecast.direction} (XGB-Coin, conf: {forecast.confidence_score:.2f})")
            
            elif xgb_general_model:
                # Fallback to general XGBoost
                forecast = generate_forecast(
                    market=market,
                    horizon=horizon,
                    model=xgb_general_model,
                    feature_names=xgb_general_features,
                    db_model=xgb_general_db_model,
                    model_type='xgboost_general',
                )
                print(f"  {market.symbol}: {forecast.direction} (XGB-General, conf: {forecast.confidence_score:.2f})")
            else:
                raise ValueError("No model available")
            
            forecasts.append(forecast)
            
        except Exception as e:
            errors.append((market.symbol, str(e)))
            print(f"  {market.symbol}: ERROR - {e}")
    
    print(f"\nComplete: {len(forecasts)} forecasts, {len(errors)} errors")
    return forecasts


def generate_forecasts_for_all_horizons():
    """Generate forecasts for all horizons."""
    all_forecasts = {}
    
    for horizon in ['24H', '30D', '12W', '12M']:
        try:
            forecasts = generate_all_forecasts(horizon)
            all_forecasts[horizon] = forecasts
        except Exception as e:
            print(f"\nError generating {horizon} forecasts: {e}")
            continue
    
    print(f"\n{'='*50}")
    print("ALL HORIZONS COMPLETE")
    print(f"{'='*50}")
    
    for horizon, forecasts in all_forecasts.items():
        print(f"  {horizon}: {len(forecasts)} forecasts")
    
    return all_forecasts


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Generate forecasts')
    parser.add_argument('--horizon', type=str, help='Horizon (24H, 30D, 12W, 12M)')
    parser.add_argument('--all', action='store_true', help='All horizons')
    parser.add_argument('--market', type=str, help='Single market symbol')
    args = parser.parse_args()
    
    if args.market and args.horizon:
        market = Market.objects.get(symbol=args.market)
        model, feature_names, db_model, model_type = load_production_model(args.horizon, market)
        forecast = generate_forecast(market, args.horizon, model, feature_names, db_model, model_type)
        print(f"\nForecast created:")
        print(f"  Model: {model_type.upper()}")
        print(f"  Direction: {forecast.direction}")
        print(f"  Confidence: {forecast.confidence_score:.2f}")
        print(f"  Predicted: ${forecast.predicted_mid}")
    elif args.all:
        generate_forecasts_for_all_horizons()
    elif args.horizon:
        generate_all_forecasts(args.horizon)
    else:
        print("Usage:")
        print("  python -m ml.prediction.predictor --horizon 24H")
        print("  python -m ml.prediction.predictor --all")
        print("  python -m ml.prediction.predictor --horizon 24H --market BTC-USD")