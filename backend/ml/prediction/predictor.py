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

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

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
    
    if not os.path.exists(db_model.artifact_path):
        raise FileNotFoundError(f"Model file not found: {db_model.artifact_path}")
    
    with open(db_model.artifact_path, 'rb') as f:
        model_data = pickle.load(f)
    
    return model_data['model'], model_data['feature_names'], db_model


def get_latest_features(market: Market, timeframe: str, feature_names: list) -> pd.DataFrame:
    """
    Get latest features for prediction.
    
    Returns:
        DataFrame with one row of features
    """
    # Load enough data to calculate all features
    df = load_market_data(market, timeframe, limit=500)
    
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
    
    if change_pct > 0.02:
        return Forecast.Direction.UP
    elif change_pct < -0.02:
        return Forecast.Direction.DOWN
    else:
        return Forecast.Direction.NEUTRAL


def generate_forecast(
    market: Market,
    horizon: str,
    model,
    feature_names: list,
    db_model: MLModel,
) -> Forecast:
    """
    Generate forecast for a single market.
    
    Returns:
        Created Forecast object
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
    
    # Generate predictions for each step
    predicted_returns = []
    predicted_prices = []
    
    # For simplicity, predict same return for all steps
    # (In production, you might want iterative prediction)
    predicted_return = model.predict(features)[0]
    
    # Generate price path
    price = current_price
    for i in range(config['horizon']):
        # Add some variation based on step
        step_variation = np.random.normal(0, 0.005)  # Small random variation
        step_return = predicted_return / config['horizon'] + step_variation
        price = price * (1 + step_return)
        predicted_prices.append(price)
        predicted_returns.append(step_return)
    
    # Calculate confidence scores
    base_confidence = 0.85 if horizon == '24H' else 0.70 if horizon == '30D' else 0.55 if horizon == '12W' else 0.45
    decay_rate = 0.015 if horizon == '24H' else 0.012 if horizon == '30D' else 0.025 if horizon == '12W' else 0.02
    confidences = calculate_confidence(predicted_prices, base_confidence, decay_rate)
    
    # Determine direction
    direction = determine_direction(current_price, predicted_prices)
    
    # Calculate overall confidence
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
            confidence_score=overall_confidence,
            current_price=Decimal(str(current_price)),
            predicted_low=Decimal(str(min(predicted_prices))),
            predicted_mid=Decimal(str(np.mean(predicted_prices))),
            predicted_high=Decimal(str(max(predicted_prices))),
            is_latest=True,
        )
        
        # Create forecast points
        points = []
        for i, (price, conf) in enumerate(zip(predicted_prices, confidences)):
            timestamp = now + config['step_timedelta'] * (i + 1)
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