# export_data.py
import pandas as pd
import os
import sys

sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from markets.models import Market, MarketData

markets = Market.objects.filter(status='active')

all_data = []

for market in markets:
    print(f'Exporting {market.symbol}...')
    
    for timeframe in ['1h', '1d', '1w', '1M']:
        data = MarketData.objects.filter(
            market=market,
            timeframe=timeframe
        ).order_by('timestamp').values('timestamp', 'open', 'high', 'low', 'close', 'volume')
        
        for row in data:
            all_data.append({
                'symbol': market.symbol,
                'timeframe': timeframe,
                'timestamp': row['timestamp'],
                'open': float(row['open']),
                'high': float(row['high']),
                'low': float(row['low']),
                'close': float(row['close']),
                'volume': float(row['volume']),
            })

df = pd.DataFrame(all_data)
df.to_csv('all_market_data.csv', index=False)
print(f'Exported {len(df)} total rows')
print(f'Markets: {df["symbol"].nunique()}')