from django.db import models
from django.conf import settings


class Market(models.Model):
    """Represents a tradeable market/instrument."""
    
    class Category(models.TextChoices):
        CRYPTO = 'crypto', 'Cryptocurrency'
        EQUITY = 'equity', 'Equity'
        FOREX = 'forex', 'Forex'
        COMMODITY = 'commodity', 'Commodity'
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        INACTIVE = 'inactive', 'Inactive'
        PENDING = 'pending', 'Pending'
    
    symbol = models.CharField(max_length=20, unique=True)  # e.g., BTC-USD
    name = models.CharField(max_length=100)  # e.g., Bitcoin
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.CRYPTO,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    
    # Data source info
    data_source = models.CharField(max_length=50, default='binance')
    data_source_symbol = models.CharField(max_length=50)  # External API symbol
    
    # Metadata
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_data_fetch = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'markets'
        ordering = ['symbol']
    
    def __str__(self):
        return f"{self.symbol} ({self.name})"


class MarketData(models.Model):
    """Historical price data for a market."""
    
    market = models.ForeignKey(
        Market,
        on_delete=models.CASCADE,
        related_name='price_data',
    )
    timestamp = models.DateTimeField()
    
    # OHLCV data
    open = models.DecimalField(max_digits=20, decimal_places=8)
    high = models.DecimalField(max_digits=20, decimal_places=8)
    low = models.DecimalField(max_digits=20, decimal_places=8)
    close = models.DecimalField(max_digits=20, decimal_places=8)
    volume = models.DecimalField(max_digits=30, decimal_places=8)
    
    # Timeframe
    timeframe = models.CharField(max_length=10, default='1h')  # 1h, 1d, etc.
    
    class Meta:
        db_table = 'market_data'
        unique_together = ['market', 'timestamp', 'timeframe']
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['market', 'timestamp']),
            models.Index(fields=['market', 'timeframe', 'timestamp']),
        ]
    
    def __str__(self):
        return f"{self.market.symbol} @ {self.timestamp}"


class UserMarket(models.Model):
    """User's tracked markets (watchlist)."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tracked_markets',
    )
    market = models.ForeignKey(
        Market,
        on_delete=models.CASCADE,
        related_name='tracked_by_users',
    )
    
    # User preferences for this market
    is_favorite = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    
    # Timestamps
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_markets'
        unique_together = ['user', 'market']
        ordering = ['-is_favorite', '-added_at']
    
    def __str__(self):
        return f"{self.user.email} -> {self.market.symbol}"