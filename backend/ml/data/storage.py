# ml/data/storage.py

from django.utils import timezone
from markets.models import Market, MarketData
from ml.data.config import COINS, binance_to_symbol


def create_markets():
    """Create Market records for all coins."""
    
    coin_names = {
        'BTC-USD': 'Bitcoin',
        'ETH-USD': 'Ethereum',
        'BNB-USD': 'BNB',
        'SOL-USD': 'Solana',
        'XRP-USD': 'Ripple',
        'ADA-USD': 'Cardano',
        'DOGE-USD': 'Dogecoin',
        'AVAX-USD': 'Avalanche',
        'DOT-USD': 'Polkadot',
        'LINK-USD': 'Chainlink',
        'MATIC-USD': 'Polygon',
        'SHIB-USD': 'Shiba Inu',
        'LTC-USD': 'Litecoin',
        'UNI-USD': 'Uniswap',
        'ATOM-USD': 'Cosmos',
        'XLM-USD': 'Stellar',
        'ETC-USD': 'Ethereum Classic',
        'FIL-USD': 'Filecoin',
        'NEAR-USD': 'NEAR Protocol',
        'APT-USD': 'Aptos',
        'ARB-USD': 'Arbitrum',
        'OP-USD': 'Optimism',
        'INJ-USD': 'Injective',
        'SUI-USD': 'Sui',
        'SEI-USD': 'Sei',
        'TIA-USD': 'Celestia',
        'RENDER-USD': 'Render',
        'FET-USD': 'Fetch.ai',
        'TAO-USD': 'Bittensor',
        'WIF-USD': 'dogwifhat',
        'PEPE-USD': 'Pepe',
        'IMX-USD': 'Immutable',
        'STX-USD': 'Stacks',
        'MKR-USD': 'Maker',
        'AAVE-USD': 'Aave',
        'GRT-USD': 'The Graph',
        'SNX-USD': 'Synthetix',
        'LDO-USD': 'Lido DAO',
        'CRV-USD': 'Curve',
        'RUNE-USD': 'THORChain',
        'ENS-USD': 'Ethereum Name Service',
        'SAND-USD': 'The Sandbox',
        'MANA-USD': 'Decentraland',
        'AXS-USD': 'Axie Infinity',
        'GALA-USD': 'Gala',
        'FLOW-USD': 'Flow',
        'CHZ-USD': 'Chiliz',
        'ENJ-USD': 'Enjin Coin',
        'GMT-USD': 'STEPN',
        'APE-USD': 'ApeCoin',
    }
    
    created_count = 0
    
    for binance_symbol in COINS:
        symbol = binance_to_symbol(binance_symbol)
        name = coin_names.get(symbol, symbol.replace('-USD', ''))
        
        market, created = Market.objects.get_or_create(
            symbol=symbol,
            defaults={
                'name': name,
                'category': 'crypto',
                'status': 'active',
                'data_source': 'binance',
                'data_source_symbol': binance_symbol,
                'is_featured': symbol in ['BTC-USD', 'ETH-USD', 'SOL-USD', 'AVAX-USD', 'LINK-USD'],
            }
        )
        
        if created:
            created_count += 1
            print(f"Created: {symbol} ({name})")
        else:
            print(f"Exists: {symbol}")
    
    print(f"\nTotal created: {created_count}")


def save_market_data(symbol: str, data: list, timeframe: str = '1h'):
    """
    Save kline data to database.
    
    Args:
        symbol: Our symbol format (e.g., 'BTC-USD')
        data: List of parsed klines
        timeframe: Timeframe ('1h', '1d', etc.)
    """
    try:
        market = Market.objects.get(symbol=symbol)
    except Market.DoesNotExist:
        print(f"Market {symbol} not found. Run create_markets() first.")
        return
    
    batch_size = 1000
    created_count = 0
    
    for i in range(0, len(data), batch_size):
        batch = data[i:i + batch_size]
        
        objects = []
        for candle in batch:
            objects.append(MarketData(
                market=market,
                timestamp=candle['timestamp'],
                timeframe=timeframe,
                open=candle['open'],
                high=candle['high'],
                low=candle['low'],
                close=candle['close'],
                volume=candle['volume'],
            ))
        
        # Bulk create, ignore duplicates
        MarketData.objects.bulk_create(objects, ignore_conflicts=True)
        created_count += len(batch)
        print(f"  {symbol}: Saved {created_count}/{len(data)} candles")
    
    # Update last_data_fetch
    market.last_data_fetch = timezone.now()
    market.save(update_fields=['last_data_fetch'])
    
    print(f"  {symbol}: Complete")


def save_all_data(all_coin_data: dict, timeframe: str = '1h'):
    """Save all fetched data to database."""
    
    for symbol, data in all_coin_data.items():
        print(f"\nSaving {symbol}...")
        save_market_data(symbol, data, timeframe)