# ml/data/update_fetch.py

"""
Run this script daily to fetch new candles and remove old ones.

Usage:
    python -m ml.data.update_fetch
"""

import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from datetime import datetime, timedelta
from django.utils import timezone

from markets.models import Market, MarketData
from ml.data.fetcher import fetch_klines, parse_kline
from ml.data.config import YEARS_OF_DATA


def update_market_data(market: Market):
    """Fetch new candles since last fetch."""
    
    binance_symbol = market.data_source_symbol
    
    # Get last candle timestamp
    last_candle = MarketData.objects.filter(
        market=market,
        timeframe='1h'
    ).order_by('-timestamp').first()
    
    if last_candle:
        start_time = int(last_candle.timestamp.timestamp() * 1000) + 1
    else:
        start_time = int((datetime.utcnow() - timedelta(hours=24)).timestamp() * 1000)
    
    end_time = int(datetime.utcnow().timestamp() * 1000)
    
    print(f"  {market.symbol}: Fetching from {datetime.utcfromtimestamp(start_time/1000)}")
    
    try:
        klines = fetch_klines(
            symbol=binance_symbol,
            interval='1h',
            start_time=start_time,
            end_time=end_time,
            limit=1000,
        )
        
        if not klines:
            print(f"  {market.symbol}: No new candles")
            return 0
        
        # Parse and save
        objects = []
        for kline in klines:
            parsed = parse_kline(kline)
            objects.append(MarketData(
                market=market,
                timestamp=parsed['timestamp'],
                timeframe='1h',
                open=parsed['open'],
                high=parsed['high'],
                low=parsed['low'],
                close=parsed['close'],
                volume=parsed['volume'],
            ))
        
        MarketData.objects.bulk_create(objects, ignore_conflicts=True)
        
        # Update last fetch time
        market.last_data_fetch = timezone.now()
        market.save(update_fields=['last_data_fetch'])
        
        print(f"  {market.symbol}: Added {len(objects)} candles")
        return len(objects)
        
    except Exception as e:
        print(f"  {market.symbol}: Error - {e}")
        return 0


def cleanup_old_data(market: Market):
    """Remove data older than YEARS_OF_DATA."""
    
    cutoff_date = timezone.now() - timedelta(days=YEARS_OF_DATA * 365)
    
    deleted_count, _ = MarketData.objects.filter(
        market=market,
        timestamp__lt=cutoff_date
    ).delete()
    
    if deleted_count > 0:
        print(f"  {market.symbol}: Deleted {deleted_count} old candles")
    
    return deleted_count


def update_all_markets():
    """Update all active markets."""
    
    markets = Market.objects.filter(status='active')
    total_added = 0
    total_deleted = 0
    
    print(f"Updating {markets.count()} markets...\n")
    
    for market in markets:
        added = update_market_data(market)
        deleted = cleanup_old_data(market)
        total_added += added
        total_deleted += deleted
    
    print(f"\nTotal added: {total_added}")
    print(f"Total deleted: {total_deleted}")


if __name__ == '__main__':
    print("=" * 50)
    print("UPDATING MARKET DATA")
    print("=" * 50)
    update_all_markets()
    print("=" * 50)
    print("COMPLETE!")
    print("=" * 50)
