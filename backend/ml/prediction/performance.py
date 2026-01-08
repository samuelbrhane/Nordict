# ml/prediction/performance.py

"""
Track prediction performance by filling actual prices.

Usage:
    python -m ml.prediction.performance
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

import numpy as np
from datetime import timedelta
from decimal import Decimal
from django.utils import timezone
from django.db.models import Avg, Count

from markets.models import Market, MarketData
from forecasts.models import MLModel, Forecast, ForecastPoint, BacktestRun


# Horizon configurations
HORIZON_CONFIG = {
    '24H': {'timeframe': '1h', 'tolerance': timedelta(hours=1)},
    '30D': {'timeframe': '1d', 'tolerance': timedelta(hours=12)},
    '12W': {'timeframe': '1w', 'tolerance': timedelta(days=3)},
    '12M': {'timeframe': '1M', 'tolerance': timedelta(days=15)},
}


def find_actual_price(market: Market, timestamp, timeframe: str, tolerance: timedelta) -> Decimal:
    """
    Find actual price closest to the target timestamp.
    
    Args:
        market: Market to find price for
        timestamp: Target timestamp
        timeframe: Data timeframe
        tolerance: How far to look for matching candle
    
    Returns:
        Actual close price or None
    """
    # Look for candle within tolerance
    candle = MarketData.objects.filter(
        market=market,
        timeframe=timeframe,
        timestamp__gte=timestamp - tolerance,
        timestamp__lte=timestamp + tolerance,
    ).order_by('timestamp').first()
    
    if candle:
        return candle.close
    
    return None


def update_forecast_actuals(forecast: Forecast) -> dict:
    """
    Update actual prices for a forecast's points.
    
    Returns:
        Dict with update stats
    """
    config = HORIZON_CONFIG.get(forecast.horizon)
    if not config:
        return {'error': f'Unknown horizon: {forecast.horizon}'}
    
    now = timezone.now()
    updated_count = 0
    skipped_count = 0
    
    points = ForecastPoint.objects.filter(
        forecast=forecast,
        actual_price__isnull=True,  # Only unfilled points
        timestamp__lt=now,  # Only past timestamps
    )
    
    for point in points:
        actual_price = find_actual_price(
            market=forecast.market,
            timestamp=point.timestamp,
            timeframe=config['timeframe'],
            tolerance=config['tolerance'],
        )
        
        if actual_price:
            point.actual_price = actual_price
            point.save(update_fields=['actual_price'])
            updated_count += 1
        else:
            skipped_count += 1
    
    return {
        'forecast_id': forecast.id,
        'market': forecast.market.symbol,
        'horizon': forecast.horizon,
        'updated': updated_count,
        'skipped': skipped_count,
    }


def update_all_actuals(horizon: str = None) -> list:
    """
    Update actual prices for all forecasts.
    
    Args:
        horizon: Specific horizon or None for all
    
    Returns:
        List of update results
    """
    print(f"\n{'='*50}")
    print("UPDATING ACTUAL PRICES")
    print(f"{'='*50}")
    
    # Find forecasts with unfilled points
    queryset = ForecastPoint.objects.filter(
        actual_price__isnull=True,
        timestamp__lt=timezone.now(),
    ).values('forecast_id').distinct()
    
    forecast_ids = [item['forecast_id'] for item in queryset]
    
    forecasts = Forecast.objects.filter(id__in=forecast_ids)
    
    if horizon:
        forecasts = forecasts.filter(horizon=horizon)
    
    print(f"Forecasts to update: {forecasts.count()}")
    
    results = []
    total_updated = 0
    
    for forecast in forecasts:
        result = update_forecast_actuals(forecast)
        results.append(result)
        total_updated += result.get('updated', 0)
        
        if result['updated'] > 0:
            print(f"  {result['market']} {result['horizon']}: +{result['updated']} actuals")
    
    print(f"\nTotal updated: {total_updated}")
    
    return results


def calculate_forecast_metrics(forecast: Forecast) -> dict:
    """
    Calculate performance metrics for a forecast.
    
    Returns:
        Dict with metrics
    """
    points = ForecastPoint.objects.filter(
        forecast=forecast,
        actual_price__isnull=False,
    )
    
    if not points.exists():
        return None
    
    errors = []
    abs_errors = []
    pct_errors = []
    directions_correct = 0
    total_directions = 0
    
    prev_actual = float(forecast.current_price)
    
    for point in points:
        predicted = float(point.predicted_price)
        actual = float(point.actual_price)
        
        # Error
        error = actual - predicted
        errors.append(error)
        abs_errors.append(abs(error))
        
        # Percentage error
        if predicted != 0:
            pct_error = abs(error / predicted) * 100
            pct_errors.append(pct_error)
        
        # Direction accuracy
        predicted_direction = predicted > prev_actual
        actual_direction = actual > prev_actual
        
        if predicted_direction == actual_direction:
            directions_correct += 1
        total_directions += 1
        
        prev_actual = actual
    
    metrics = {
        'mae': np.mean(abs_errors),
        'rmse': np.sqrt(np.mean([e**2 for e in errors])),
        'mape': np.mean(pct_errors) if pct_errors else 0,
        'directional_accuracy': (directions_correct / total_directions * 100) if total_directions > 0 else 0,
        'total_points': len(errors),
    }
    
    return metrics


def generate_backtest_run(
    model: MLModel,
    market: Market,
    horizon: str,
    days_back: int = 30,
) -> BacktestRun:
    """
    Generate backtest metrics for a model/market/horizon.
    
    Returns:
        Created BacktestRun object
    """
    now = timezone.now()
    test_start = (now - timedelta(days=days_back)).date()
    test_end = now.date()
    
    # Get all forecasts for this period
    forecasts = Forecast.objects.filter(
        model=model,
        market=market,
        horizon=horizon,
        generated_at__gte=test_start,
        generated_at__lte=test_end,
    )
    
    if not forecasts.exists():
        return None
    
    # Aggregate metrics across all forecasts
    all_errors = []
    all_abs_errors = []
    all_pct_errors = []
    total_correct = 0
    total_directions = 0
    
    for forecast in forecasts:
        points = ForecastPoint.objects.filter(
            forecast=forecast,
            actual_price__isnull=False,
        )
        
        prev_actual = float(forecast.current_price)
        
        for point in points:
            predicted = float(point.predicted_price)
            actual = float(point.actual_price)
            
            error = actual - predicted
            all_errors.append(error)
            all_abs_errors.append(abs(error))
            
            if predicted != 0:
                all_pct_errors.append(abs(error / predicted) * 100)
            
            # Direction
            predicted_dir = predicted > prev_actual
            actual_dir = actual > prev_actual
            if predicted_dir == actual_dir:
                total_correct += 1
            total_directions += 1
            
            prev_actual = actual
    
    if not all_errors:
        return None
    
    backtest = BacktestRun.objects.create(
        model=model,
        market=market,
        horizon=horizon,
        test_start=test_start,
        test_end=test_end,
        mae=np.mean(all_abs_errors),
        rmse=np.sqrt(np.mean([e**2 for e in all_errors])),
        mape=np.mean(all_pct_errors) if all_pct_errors else 0,
        directional_accuracy=(total_correct / total_directions * 100) if total_directions > 0 else 0,
        total_predictions=total_directions,
        correct_directions=total_correct,
    )
    
    return backtest


def generate_all_backtests(horizon: str = None, days_back: int = 30):
    """
    Generate backtest runs for all models/markets.
    """
    print(f"\n{'='*50}")
    print("GENERATING BACKTEST RUNS")
    print(f"{'='*50}")
    
    # Get production models
    models = MLModel.objects.filter(status=MLModel.Status.PRODUCTION)
    
    if horizon:
        models = models.filter(horizon=horizon)
    
    print(f"Models: {models.count()}")
    
    created_count = 0
    
    for model in models:
        print(f"\n{model.name} v{model.version} ({model.horizon}):")
        
        if model.model_type == MLModel.ModelType.LSTM:
            # LSTM: Only backtest for its specific market
            if model.market:
                backtest = generate_backtest_run(
                    model=model,
                    market=model.market,
                    horizon=model.horizon,
                    days_back=days_back,
                )
                
                if backtest:
                    print(f"  {model.market.symbol}: MAE={backtest.mae:.4f}, Dir={backtest.directional_accuracy:.1f}%")
                    created_count += 1
        else:
            # XGBoost: Backtest for all markets
            markets = Market.objects.filter(status='active')
            
            for market in markets:
                backtest = generate_backtest_run(
                    model=model,
                    market=market,
                    horizon=model.horizon,
                    days_back=days_back,
                )
                
                if backtest:
                    print(f"  {market.symbol}: MAE={backtest.mae:.4f}, Dir={backtest.directional_accuracy:.1f}%")
                    created_count += 1
    
    print(f"\nTotal backtest runs created: {created_count}")
    

def get_model_performance_summary(model: MLModel) -> dict:
    """
    Get aggregated performance for a model across all markets.
    """
    backtests = BacktestRun.objects.filter(model=model)
    
    if not backtests.exists():
        return None
    
    summary = backtests.aggregate(
        avg_mae=Avg('mae'),
        avg_rmse=Avg('rmse'),
        avg_mape=Avg('mape'),
        avg_directional=Avg('directional_accuracy'),
        total_markets=Count('market', distinct=True),
    )
    
    return summary


def print_performance_report():
    """Print performance report for all production models."""
    
    print(f"\n{'='*50}")
    print("MODEL PERFORMANCE REPORT")
    print(f"{'='*50}")
    
    models = MLModel.objects.filter(status=MLModel.Status.PRODUCTION)
    
    for model in models:
        summary = get_model_performance_summary(model)
        
        print(f"\n{model.name} v{model.version} ({model.horizon}):")
        
        if summary:
            print(f"  Markets tested: {summary['total_markets']}")
            print(f"  Avg MAE: {summary['avg_mae']:.6f}")
            print(f"  Avg RMSE: {summary['avg_rmse']:.6f}")
            print(f"  Avg MAPE: {summary['avg_mape']:.2f}%")
            print(f"  Avg Direction Accuracy: {summary['avg_directional']:.2f}%")
        else:
            print("  No backtest data available")


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Track prediction performance')
    parser.add_argument('--update', action='store_true', help='Update actual prices')
    parser.add_argument('--backtest', action='store_true', help='Generate backtest runs')
    parser.add_argument('--report', action='store_true', help='Print performance report')
    parser.add_argument('--horizon', type=str, help='Specific horizon')
    parser.add_argument('--days', type=int, default=30, help='Days back for backtest')
    parser.add_argument('--all', action='store_true', help='Run all tasks')
    args = parser.parse_args()
    
    if args.all:
        update_all_actuals(args.horizon)
        generate_all_backtests(args.horizon, args.days)
        print_performance_report()
    elif args.update:
        update_all_actuals(args.horizon)
    elif args.backtest:
        generate_all_backtests(args.horizon, args.days)
    elif args.report:
        print_performance_report()
    else:
        print("Usage:")
        print("  python -m ml.prediction.performance --update")
        print("  python -m ml.prediction.performance --backtest")
        print("  python -m ml.prediction.performance --report")
        print("  python -m ml.prediction.performance --all")
        print("  python -m ml.prediction.performance --update --horizon 24H")