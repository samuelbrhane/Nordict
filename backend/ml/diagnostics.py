# ml/diagnostics.py

"""
Diagnose data integrity issues.

Usage:
    python -m ml.diagnostics
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models import Min, Max, Count

from markets.models import Market, MarketData
from forecasts.models import Forecast, MLModel


def check_data_integrity():
    """Check for gaps and issues in market data."""
    
    print(f"\n{'='*60}")
    print("DATA INTEGRITY CHECK")
    print(f"{'='*60}")
    
    markets = Market.objects.filter(status='active')
    
    issues = []
    
    for market in markets[:5]:  # Check first 5 markets
        print(f"\n{market.symbol}:")
        
        for timeframe in ['1h', '1d', '1w', '1M']:
            data = MarketData.objects.filter(
                market=market,
                timeframe=timeframe
            ).aggregate(
                count=Count('id'),
                earliest=Min('timestamp'),
                latest=Max('timestamp'),
            )
            
            if data['count'] == 0:
                print(f"  {timeframe}: NO DATA")
                issues.append((market.symbol, timeframe, 'no_data'))
                continue
            
            print(f"  {timeframe}: {data['count']} candles, {data['earliest'].date()} to {data['latest'].date()}")
            
            # Check for gaps in hourly data
            if timeframe == '1h':
                # Get last 7 days of data
                recent = MarketData.objects.filter(
                    market=market,
                    timeframe='1h',
                    timestamp__gte=timezone.now() - timedelta(days=7)
                ).order_by('timestamp').values_list('timestamp', flat=True)
                
                recent_list = list(recent)
                gaps = 0
                
                for i in range(1, len(recent_list)):
                    diff = (recent_list[i] - recent_list[i-1]).total_seconds() / 3600
                    if diff > 1.5:  # More than 1.5 hours gap
                        gaps += 1
                
                if gaps > 0:
                    print(f"    ⚠️  {gaps} gaps in last 7 days")
                    issues.append((market.symbol, timeframe, f'{gaps}_gaps'))
    
    return issues


def check_forecasts():
    """Check forecast status."""
    
    print(f"\n{'='*60}")
    print("FORECAST STATUS")
    print(f"{'='*60}")
    
    for horizon in ['24H', '30D', '12W', '12M']:
        latest_forecasts = Forecast.objects.filter(
            horizon=horizon,
            is_latest=True
        ).count()
        
        recent_forecasts = Forecast.objects.filter(
            horizon=horizon,
            generated_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        print(f"\n{horizon}:")
        print(f"  Latest (is_latest=True): {latest_forecasts}")
        print(f"  Generated in last 7 days: {recent_forecasts}")


def check_models():
    """Check model status."""
    
    print(f"\n{'='*60}")
    print("MODEL STATUS")
    print(f"{'='*60}")
    
    for horizon in ['24H', '30D', '12W', '12M']:
        production = MLModel.objects.filter(
            horizon=horizon,
            status=MLModel.Status.PRODUCTION
        ).first()
        
        if production:
            print(f"\n{horizon}: {production.name} v{production.version}")
            print(f"  Path: {production.artifact_path}")
            
            # Try to load model
            try:
                from ml.storage.model_store import load_model
                model_data = load_model(production.artifact_path)
                print(f"  ✅ Model loadable")
            except Exception as e:
                print(f"  ❌ Cannot load: {e}")
        else:
            print(f"\n{horizon}: NO PRODUCTION MODEL")


def check_expected_candles():
    """Check if we have expected number of candles."""
    
    print(f"\n{'='*60}")
    print("EXPECTED VS ACTUAL CANDLES")
    print(f"{'='*60}")
    
    # Expected candles for 5 years of hourly data
    expected_hourly = 5 * 365 * 24  # ~43,800
    
    market = Market.objects.filter(symbol='BTC-USD').first()
    
    if market:
        actual = MarketData.objects.filter(
            market=market,
            timeframe='1h'
        ).count()
        
        print(f"\nBTC-USD hourly candles:")
        print(f"  Expected (5 years): ~{expected_hourly:,}")
        print(f"  Actual: {actual:,}")
        print(f"  Difference: {expected_hourly - actual:,}")
        
        if actual < expected_hourly * 0.9:  # Less than 90%
            print(f"  ⚠️  Missing significant data!")
            return False
    
    return True


def run_all_checks():
    """Run all diagnostic checks."""
    
    issues = check_data_integrity()
    check_forecasts()
    check_models()
    data_ok = check_expected_candles()
    
    print(f"\n{'='*60}")
    print("RECOMMENDATION")
    print(f"{'='*60}")
    
    if len(issues) > 5 or not data_ok:
        print("""
⚠️  SIGNIFICANT ISSUES DETECTED

Recommended action: Re-dump from local
1. Fix S3 configuration in production
2. Dump local DB to production RDS
3. Verify scheduler works with: python -m ml.scheduler --task 6hourly

This will restore your clean data and models.
        """)
    else:
        print("""
✅ DATA LOOKS MOSTLY OK

You can try:
1. Fix S3 configuration
2. Run a manual backfill for missing candles
3. Test prediction: python -m ml.prediction.predictor --horizon 24H --market BTC-USD
        """)


if __name__ == '__main__':
    run_all_checks()