import requests
import time
from datetime import datetime, timedelta, timezone as dt_timezone
from typing import Optional
from decimal import Decimal

from ml.data.config import (
    COINS,
    BINANCE_BASE_URL,
    BINANCE_KLINES_ENDPOINT,
    HOURLY_CANDLES_PER_REQUEST,
    YEARS_OF_DATA,
    binance_to_symbol,
)


def fetch_klines(
    symbol: str,
    interval: str = '1h',
    start_time: Optional[int] = None,
    end_time: Optional[int] = None,
    limit: int = 1000,
) -> list:
    """
    Fetch klines (candlestick data) from Binance.
    
    Args:
        symbol: Binance symbol (e.g., 'BTCUSDT')
        interval: Timeframe ('1h', '1d', etc.)
        start_time: Start timestamp in milliseconds
        end_time: End timestamp in milliseconds
        limit: Number of candles (max 1000)
    
    Returns:
        List of klines
    """
    url = f"{BINANCE_BASE_URL}{BINANCE_KLINES_ENDPOINT}"
    
    params = {
        'symbol': symbol,
        'interval': interval,
        'limit': limit,
    }
    
    if start_time:
        params['startTime'] = start_time
    if end_time:
        params['endTime'] = end_time
    
    response = requests.get(url, params=params)
    response.raise_for_status()
    
    return response.json()


def parse_kline(kline: list) -> dict:
    """
    Parse Binance kline to our format.
    """
    return {
        'timestamp': datetime.utcfromtimestamp(kline[0] / 1000).replace(tzinfo=dt_timezone.utc),  
        'open': Decimal(kline[1]),
        'high': Decimal(kline[2]),
        'low': Decimal(kline[3]),
        'close': Decimal(kline[4]),
        'volume': Decimal(kline[5]),
    }


def fetch_historical_data(
    symbol: str,
    years: int = YEARS_OF_DATA,
    interval: str = '1h',
) -> list:
    """
    Fetch all historical data for a symbol.
    
    Args:
        symbol: Binance symbol (e.g., 'BTCUSDT')
        years: How many years of data to fetch
        interval: Timeframe ('1h', '1d', etc.)
    
    Returns:
        List of parsed klines
    """
    all_data = []
    
    end_time = int(datetime.utcnow().timestamp() * 1000)
    start_time = int((datetime.utcnow() - timedelta(days=years * 365)).timestamp() * 1000)
    
    current_start = start_time
    
    print(f"Fetching {symbol} from {datetime.utcfromtimestamp(start_time/1000)} to {datetime.utcfromtimestamp(end_time/1000)}")
    
    while current_start < end_time:
        try:
            klines = fetch_klines(
                symbol=symbol,
                interval=interval,
                start_time=current_start,
                limit=HOURLY_CANDLES_PER_REQUEST,
            )
            
            if not klines:
                break
            
            for kline in klines:
                all_data.append(parse_kline(kline))
            
            # Move to next batch
            current_start = klines[-1][0] + 1
            
            # Progress
            progress = (current_start - start_time) / (end_time - start_time) * 100
            print(f"  {symbol}: {progress:.1f}% ({len(all_data)} candles)")
            
            # Rate limiting (Binance allows 1200 requests/min)
            time.sleep(0.1)
            
        except Exception as e:
            print(f"  Error fetching {symbol}: {e}")
            time.sleep(1)
            continue
    
    print(f"  {symbol}: Complete - {len(all_data)} candles")
    return all_data


def fetch_all_coins(years: int = YEARS_OF_DATA) -> dict:
    """
    Fetch historical data for all coins.
    
    Returns:
        Dict mapping symbol to list of klines
    """
    all_coin_data = {}
    
    for i, binance_symbol in enumerate(COINS):
        print(f"\n[{i+1}/{len(COINS)}] Fetching {binance_symbol}...")
        
        try:
            data = fetch_historical_data(binance_symbol, years=years)
            symbol = binance_to_symbol(binance_symbol)
            all_coin_data[symbol] = data
        except Exception as e:
            print(f"  Failed to fetch {binance_symbol}: {e}")
            continue
    
    return all_coin_data