# export_data.py
import pandas as pd
import os
import sys

sys.path.insert(0, '.')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from markets.models import Market, MarketData

# ============================================================
# CHANGE THIS WHEN YOU FINISH ALL 4 HORIZONS OF THIS COIN
# ============================================================
COIN = 'BTC-USD'
# ============================================================

all_data = []

market = Market.objects.get(symbol=COIN)
print(f'Exporting {COIN}...')

for timeframe in ['1h', '1d', '1w', '1M']:
    data = MarketData.objects.filter(
        market=market,
        timeframe=timeframe
    ).order_by('timestamp').values('timestamp', 'open', 'high', 'low', 'close', 'volume')
    
    count = 0
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
        count += 1
    print(f'  {timeframe}: {count} rows')

df = pd.DataFrame(all_data)
filename = f'{COIN.replace("-", "_").lower()}_data.csv'
df.to_csv(filename, index=False)
print(f'\nExported {len(df)} total rows')
print(f'Saved to: {filename}')