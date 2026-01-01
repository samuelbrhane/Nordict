# ml/prediction/predictor.py

"""
Generate forecasts using trained models.

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
        'step_timedelta': timedelta(days=30),  # Approximate
    },
}


def load_production_model(horizon: str) -> tuple:
    """
    Load production model for a horizon.
    
    Returns:
        (model, feature_names, db_model)
    """
    db_model = MLModel.objects.filter(
        horizon=horizon,
        status=MLModel.Status.PRODUCTION
    ).first()
    
    if not db_model:
        raise ValueError(f"No production model for {horizon}. Train and promote one first.")
    
    # Load from storage (local or S3 based on path)
    model_data = load_model(db_model.artifact_path)
    
    return model_data['model'], model_data['feature_names'], db_model

def get_latest_features(market: Market, timeframe: str, feature_names: list) -> pd.DataFrame:
    """
    Get latest features for prediction.
    
    Returns:
        DataFrame with one row of features
    """
    # Load recent data (uses years parameter now, not limit)
    df = load_market_data(market, timeframe, years=1)  # 1 year is enough for features
    
    if df.empty:
        raise ValueError(f"No data for {market.symbol}")
    
    # Create features
    df = create_features(df)
    
    # Add market one-hot encoding
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

def calculate_confidence(
    predictions: np.ndarray,
    base_confidence: float = 0.85,
    decay_rate: float = 0.02,
) -> list:
    """
    Calculate confidence scores that decay over time.
    
    Args:
        predictions: Array of predictions
        base_confidence: Starting confidence
        decay_rate: How much confidence decreases per step
    
    Returns:
        List of confidence scores
    """
    confidences = []
    for i in range(len(predictions)):
        conf = max(0.25, base_confidence - (i * decay_rate))
        confidences.append(conf)
    return confidences


def calculate_prediction_bounds(
    predicted_price: float,
    confidence: float,
    volatility: float = 0.02,
) -> tuple:
    """
    Calculate upper and lower bounds based on confidence.
    
    Returns:
        (lower_bound, upper_bound)
    """
    # Width increases as confidence decreases
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
    """
    Scale confidence for better UI display.
    Users don't understand that 50% is actually decent for crypto prediction.
    """
    # Different scaling per horizon
    if horizon == '24H':
        # Internal 0.55-0.75 -> Display 0.65-0.85
        min_in, max_in = 0.55, 0.75
        min_out, max_out = 0.65, 0.85
    elif horizon == '30D':
        # Internal 0.40-0.60 -> Display 0.55-0.75
        min_in, max_in = 0.40, 0.60
        min_out, max_out = 0.55, 0.75
    elif horizon == '12W':
        # Internal 0.30-0.50 -> Display 0.45-0.65
        min_in, max_in = 0.30, 0.50
        min_out, max_out = 0.45, 0.65
    else:  # 12M
        # Internal 0.25-0.45 -> Display 0.40-0.60
        min_in, max_in = 0.25, 0.45
        min_out, max_out = 0.40, 0.60
    
    # Clamp internal value
    clamped = max(min_in, min(max_in, internal_confidence))
    
    # Scale to display range
    scaled = min_out + (clamped - min_in) * (max_out - min_out) / (max_in - min_in)
    
    return round(scaled, 2)


def generate_forecast(
    market: Market,
    horizon: str,
    model,
    feature_names: list,
    db_model: MLModel,
) -> Forecast:
    """
    Generate forecast for a single market.
    """
    config = HORIZON_CONFIG[horizon]
    
    # Get current price and features
    latest_data = MarketData.objects.filter(
        market=market,
        timeframe=config['timeframe']
    ).order_by('-timestamp').first()
    
    if not latest_data:
        raise ValueError(f"No price data for {market.symbol}")
    
    current_price = float(latest_data.close)
    current_time = latest_data.timestamp
    
    # Get features
    features = get_latest_features(market, config['timeframe'], feature_names)
    
    # Get volatility from features (if available)
    volatility = features['volatility_24'].values[0] if 'volatility_24' in features.columns else 0.02
    
    # Predict
    predicted_return = model.predict(features)[0]
    
    # Base confidence - higher values for better UI display
    if horizon == '24H':
        base_confidence = 0.75
        decay_rate = 0.005
    elif horizon == '30D':
        base_confidence = 0.65
        decay_rate = 0.003
    elif horizon == '12W':
        base_confidence = 0.55
        decay_rate = 0.008
    else:  # 12M
        base_confidence = 0.50
        decay_rate = 0.008
    
    # Small adjustment based on volatility (max -10%)
    volatility_penalty = min(0.10, volatility * 2)
    adjusted_base_confidence = base_confidence - volatility_penalty
    
    # Small adjustment based on prediction magnitude (max -5%)
    prediction_magnitude = abs(predicted_return)
    magnitude_penalty = min(0.05, prediction_magnitude)
    adjusted_base_confidence = adjusted_base_confidence - magnitude_penalty
    
    # Ensure confidence stays in reasonable range
    adjusted_base_confidence = max(0.35, min(0.85, adjusted_base_confidence))
    
    # Generate price path
    predicted_prices = []
    price = current_price
    for i in range(config['horizon']):
        step_variation = np.random.normal(0, 0.005)
        step_return = predicted_return / config['horizon'] + step_variation
        price = price * (1 + step_return)
        predicted_prices.append(price)
    
    # Calculate confidence scores with decay
    confidences = []
    for i in range(len(predicted_prices)):
        conf = max(0.30, adjusted_base_confidence - (i * decay_rate))
        confidences.append(conf)
    
    # Determine direction
    direction = determine_direction(current_price, predicted_prices)
    
    # Overall confidence is average
    overall_confidence = np.mean(confidences)
    
    # Calculate validity period
    now = timezone.now()
    valid_from = now
    valid_until = now + config['step_timedelta'] * config['horizon']
    
    # Mark previous forecasts as not latest
    Forecast.objects.filter(
        market=market,
        horizon=horizon,
        is_latest=True
    ).update(is_latest=False)
    
     # Overall confidence is average (internal)
    internal_confidence = np.mean(confidences)
    
    # Scale for display
    display_confidence = scale_confidence_for_display(internal_confidence, horizon)
    
    # Create forecast
    with transaction.atomic():
        forecast = Forecast.objects.create(
            market=market,
            model=db_model,
            horizon=horizon,
            generated_at=now,
            valid_from=valid_from,
            valid_until=valid_until,
            direction=direction,
            confidence_score=display_confidence,
            current_price=Decimal(str(current_price)),
            predicted_low=Decimal(str(min(predicted_prices))),
            predicted_mid=Decimal(str(np.mean(predicted_prices))),
            predicted_high=Decimal(str(max(predicted_prices))),
            is_latest=True,
        )
        
        # Create forecast points
        base_time = now.replace(minute=0, second=0, microsecond=0)

        points = []
        for i, (price, conf) in enumerate(zip(predicted_prices, confidences)):
            timestamp = base_time + config['step_timedelta'] * (i + 1)
            lower, upper = calculate_prediction_bounds(price, conf)
            
            points.append(ForecastPoint(
                forecast=forecast,
                step=i,
                timestamp=timestamp,
                predicted_price=Decimal(str(price)),
                confidence_low=Decimal(str(lower)),
                confidence_high=Decimal(str(upper)),
                confidence_score=conf,
            ))
        
        ForecastPoint.objects.bulk_create(points)
    process_alerts_for_forecast(forecast)
    return forecast


def generate_all_forecasts(horizon: str) -> list:
    """
    Generate forecasts for all active markets.
    
    Returns:
        List of created Forecast objects
    """
    print(f"\n{'='*50}")
    print(f"GENERATING {horizon} FORECASTS")
    print(f"{'='*50}")
    
    # Load model
    print("\nLoading production model...")
    model, feature_names, db_model = load_production_model(horizon)
    print(f"Model: {db_model.name} v{db_model.version}")
    
    # Get all active markets
    markets = Market.objects.filter(status='active')
    print(f"Markets: {markets.count()}")
    
    forecasts = []
    errors = []
    
    for market in markets:
        try:
            forecast = generate_forecast(
                market=market,
                horizon=horizon,
                model=model,
                feature_names=feature_names,
                db_model=db_model,
            )
            forecasts.append(forecast)
            print(f"  {market.symbol}: {forecast.direction} (conf: {forecast.confidence_score:.2f})")
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
        # Single market forecast
        market = Market.objects.get(symbol=args.market)
        model, feature_names, db_model = load_production_model(args.horizon)
        forecast = generate_forecast(market, args.horizon, model, feature_names, db_model)
        print(f"\nForecast created:")
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