# ml/data/aggregator.py

"""
Aggregate hourly data to daily, weekly, monthly.
Only processes new data since last aggregation.

Usage:
    python -m ml.data.aggregator
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from datetime import datetime, timedelta
from django.db.models import Min, Max, Sum
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth
from django.utils import timezone

from markets.models import Market, MarketData


def get_last_aggregated_timestamp(market: Market, timeframe: str):
    """Get the last aggregated candle timestamp."""
    last_candle = MarketData.objects.filter(
        market=market,
        timeframe=timeframe
    ).order_by('-timestamp').first()
    
    return last_candle.timestamp if last_candle else None


def aggregate_to_daily(market: Market, since: datetime = None):
    """Aggregate hourly candles to daily (only new data)."""
    
    queryset = MarketData.objects.filter(
        market=market,
        timeframe='1h'
    )
    
    # Only process data after last aggregation
    if since:
        queryset = queryset.filter(timestamp__gte=since)
    
    daily_data = queryset.annotate(
        date=TruncDate('timestamp')
    ).values('date').annotate(
        open_time=Min('timestamp'),
        close_time=Max('timestamp'),
        high=Max('high'),
        low=Min('low'),
        volume=Sum('volume'),
    ).order_by('date')
    
    created_count = 0
    updated_count = 0
    
    for day in daily_data:
        first_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=day['open_time']
        ).first()
        
        last_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=day['close_time']
        ).first()
        
        if not first_candle or not last_candle:
            continue
        
        obj, created = MarketData.objects.update_or_create(
            market=market,
            timestamp=day['date'],
            timeframe='1d',
            defaults={
                'open': first_candle.open,
                'high': day['high'],
                'low': day['low'],
                'close': last_candle.close,
                'volume': day['volume'],
            }
        )
        
        if created:
            created_count += 1
        else:
            updated_count += 1
    
    print(f"  {market.symbol} [1d]: +{created_count} new, ~{updated_count} updated")
    return created_count


def aggregate_to_weekly(market: Market, since: datetime = None):
    """Aggregate hourly candles to weekly (only new data)."""
    
    queryset = MarketData.objects.filter(
        market=market,
        timeframe='1h'
    )
    
    if since:
        # Go back to start of week to re-aggregate current week
        week_start = since - timedelta(days=since.weekday())
        queryset = queryset.filter(timestamp__gte=week_start)
    
    weekly_data = queryset.annotate(
        week=TruncWeek('timestamp')
    ).values('week').annotate(
        open_time=Min('timestamp'),
        close_time=Max('timestamp'),
        high=Max('high'),
        low=Min('low'),
        volume=Sum('volume'),
    ).order_by('week')
    
    created_count = 0
    updated_count = 0
    
    for week in weekly_data:
        first_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=week['open_time']
        ).first()
        
        last_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=week['close_time']
        ).first()
        
        if not first_candle or not last_candle:
            continue
        
        obj, created = MarketData.objects.update_or_create(
            market=market,
            timestamp=week['week'],
            timeframe='1w',
            defaults={
                'open': first_candle.open,
                'high': week['high'],
                'low': week['low'],
                'close': last_candle.close,
                'volume': week['volume'],
            }
        )
        
        if created:
            created_count += 1
        else:
            updated_count += 1
    
    print(f"  {market.symbol} [1w]: +{created_count} new, ~{updated_count} updated")
    return created_count


def aggregate_to_monthly(market: Market, since: datetime = None):
    """Aggregate hourly candles to monthly (only new data)."""
    
    queryset = MarketData.objects.filter(
        market=market,
        timeframe='1h'
    )
    
    if since:
        # Go back to start of month to re-aggregate current month
        month_start = since.replace(day=1)
        queryset = queryset.filter(timestamp__gte=month_start)
    
    monthly_data = queryset.annotate(
        month=TruncMonth('timestamp')
    ).values('month').annotate(
        open_time=Min('timestamp'),
        close_time=Max('timestamp'),
        high=Max('high'),
        low=Min('low'),
        volume=Sum('volume'),
    ).order_by('month')
    
    created_count = 0
    updated_count = 0
    
    for month in monthly_data:
        first_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=month['open_time']
        ).first()
        
        last_candle = MarketData.objects.filter(
            market=market,
            timeframe='1h',
            timestamp=month['close_time']
        ).first()
        
        if not first_candle or not last_candle:
            continue
        
        obj, created = MarketData.objects.update_or_create(
            market=market,
            timestamp=month['month'],
            timeframe='1M',
            defaults={
                'open': first_candle.open,
                'high': month['high'],
                'low': month['low'],
                'close': last_candle.close,
                'volume': month['volume'],
            }
        )
        
        if created:
            created_count += 1
        else:
            updated_count += 1
    
    print(f"  {market.symbol} [1M]: +{created_count} new, ~{updated_count} updated")
    return created_count


def aggregate_market(market: Market, full: bool = False):
    """
    Run all aggregations for a market.
    
    Args:
        market: Market to aggregate
        full: If True, re-aggregate all data. If False, only new data.
    """
    print(f"\n{market.symbol}:")
    
    if full:
        since = None
    else:
        # Find last daily candle to know where to start
        since = get_last_aggregated_timestamp(market, '1d')
        if since:
            # Go back 1 day to ensure current day is updated
            since = since - timedelta(days=1)
    
    aggregate_to_daily(market, since)
    aggregate_to_weekly(market, since)
    aggregate_to_monthly(market, since)


def aggregate_all_markets(full: bool = False):
    """
    Aggregate all active markets.
    
    Args:
        full: If True, re-aggregate all data. If False, only new data.
    """
    markets = Market.objects.filter(status='active')
    mode = "FULL" if full else "INCREMENTAL"
    print(f"Aggregating {markets.count()} markets ({mode})...")
    
    for market in markets:
        aggregate_market(market, full=full)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Aggregate market data')
    parser.add_argument('--full', action='store_true', help='Re-aggregate all data')
    args = parser.parse_args()
    
    print("=" * 50)
    print("AGGREGATING MARKET DATA")
    print("=" * 50)
    aggregate_all_markets(full=args.full)
    print("\n" + "=" * 50)
    print("COMPLETE!")
    print("=" * 50)


