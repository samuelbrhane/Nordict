# Top 50 coins (Binance symbols)
COINS = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT',
     'SHIBUSDT', 'LTCUSDT', 'UNIUSDT', 'ATOMUSDT',
    'XLMUSDT', 'ETCUSDT', 'FILUSDT', 'NEARUSDT', 'APTUSDT',
    'ARBUSDT', 'OPUSDT', 'INJUSDT', 'SUIUSDT', 'SEIUSDT',
    'TIAUSDT', 'RENDERUSDT', 'FETUSDT', 'TAOUSDT', 'WIFUSDT',
    'PEPEUSDT', 'IMXUSDT', 'STXUSDT', 'MKRUSDT', 'AAVEUSDT',
    'GRTUSDT', 'SNXUSDT', 'LDOUSDT', 'CRVUSDT', 'RUNEUSDT',
    'ENSUSDT', 'SANDUSDT', 'MANAUSDT', 'AXSUSDT', 'GALAUSDT',
    'FLOWUSDT', 'CHZUSDT', 'ENJUSDT', 'GMTUSDT', 'APEUSDT', 'ALGOUSDT'
]



# Convert Binance symbol to our format
def binance_to_symbol(binance_symbol: str) -> str:
    """BTCUSDT -> BTC-USD"""
    return binance_symbol.replace('USDT', '-USD')

# Convert our symbol to Binance format
def symbol_to_binance(symbol: str) -> str:
    """BTC-USD -> BTCUSDT"""
    return symbol.replace('-USD', 'USDT')

# Binance API settings
BINANCE_BASE_URL = 'https://api.binance.com'
BINANCE_KLINES_ENDPOINT = '/api/v3/klines'

# Data settings
YEARS_OF_DATA = 5
HOURLY_CANDLES_PER_REQUEST = 1000 