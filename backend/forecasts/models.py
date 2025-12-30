from django.db import models
from django.conf import settings


class MLModel(models.Model):
    """Machine learning model registry."""
    
    class Status(models.TextChoices):
        TRAINING = 'training', 'Training'
        CANDIDATE = 'candidate', 'Candidate'
        PRODUCTION = 'production', 'Production'
        DEPRECATED = 'deprecated', 'Deprecated'
    
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CANDIDATE,
    )
    
    # Training info
    training_started_at = models.DateTimeField(null=True, blank=True)
    training_completed_at = models.DateTimeField(null=True, blank=True)
    training_data_start = models.DateField(null=True, blank=True)
    training_data_end = models.DateField(null=True, blank=True)
    
    # Supported horizons
    supports_hourly = models.BooleanField(default=True)
    supports_daily = models.BooleanField(default=True)
    supports_weekly = models.BooleanField(default=True)
    supports_monthly = models.BooleanField(default=True)
    
    # Storage
    artifact_path = models.CharField(max_length=500)  # S3 path
    
    # Performance metrics (validation)
    mae = models.FloatField(null=True, blank=True)
    rmse = models.FloatField(null=True, blank=True)
    mape = models.FloatField(null=True, blank=True)
    directional_accuracy = models.FloatField(null=True, blank=True)
    
    # Metadata
    description = models.TextField(blank=True)
    config = models.JSONField(default=dict)  # Model hyperparameters
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ml_models'
        unique_together = ['name', 'version']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} v{self.version} ({self.status})"


class Forecast(models.Model):
    """Generated forecast for a market."""
    
    class Horizon(models.TextChoices):
        HOURLY = 'hourly', 'Hourly (24H)'
        DAILY = 'daily', 'Daily (7D)'
        WEEKLY = 'weekly', 'Weekly (4W)'
        MONTHLY = 'monthly', 'Monthly (12M)'
    
    class Direction(models.TextChoices):
        UP = 'up', 'Up'
        DOWN = 'down', 'Down'
        NEUTRAL = 'neutral', 'Neutral'
    
    market = models.ForeignKey(
        'markets.Market',
        on_delete=models.CASCADE,
        related_name='forecasts',
    )
    model = models.ForeignKey(
        MLModel,
        on_delete=models.CASCADE,
        related_name='forecasts',
    )
    
    # Forecast metadata
    horizon = models.CharField(
        max_length=20,
        choices=Horizon.choices,
    )
    generated_at = models.DateTimeField()
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Summary metrics
    direction = models.CharField(
        max_length=10,
        choices=Direction.choices,
    )
    confidence_score = models.FloatField()  # 0-1
    probability_up = models.FloatField()
    probability_down = models.FloatField()
    
    # Current price at generation
    current_price = models.DecimalField(max_digits=20, decimal_places=8)
    
    # Predicted range
    predicted_low = models.DecimalField(max_digits=20, decimal_places=8)
    predicted_mid = models.DecimalField(max_digits=20, decimal_places=8)
    predicted_high = models.DecimalField(max_digits=20, decimal_places=8)
    
    # Is this the latest forecast for this market/horizon?
    is_latest = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'forecasts'
        ordering = ['-generated_at']
        indexes = [
            models.Index(fields=['market', 'horizon', 'is_latest']),
            models.Index(fields=['market', 'horizon', 'generated_at']),
        ]
    
    def __str__(self):
        return f"{self.market.symbol} {self.horizon} @ {self.generated_at}"


class ForecastPoint(models.Model):
    """Individual forecast data points (time series)."""
    
    forecast = models.ForeignKey(
        Forecast,
        on_delete=models.CASCADE,
        related_name='points',
    )
    
    # Point data
    step = models.IntegerField()  # 0, 1, 2, ... (step in the forecast)
    timestamp = models.DateTimeField()  # Target timestamp
    
    # Predictions
    predicted_price = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_low = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_high = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_score = models.FloatField()
    
    # Actual outcome (filled later for performance tracking)
    actual_price = models.DecimalField(
        max_digits=20, decimal_places=8, null=True, blank=True
    )
    
    class Meta:
        db_table = 'forecast_points'
        unique_together = ['forecast', 'step']
        ordering = ['step']
    
    def __str__(self):
        return f"{self.forecast} - Step {self.step}"


class BacktestRun(models.Model):
    """Backtesting run results."""
    
    model = models.ForeignKey(
        MLModel,
        on_delete=models.CASCADE,
        related_name='backtest_runs',
    )
    market = models.ForeignKey(
        'markets.Market',
        on_delete=models.CASCADE,
        related_name='backtest_runs',
    )
    horizon = models.CharField(max_length=20)
    
    # Time window
    test_start = models.DateField()
    test_end = models.DateField()
    
    # Metrics
    mae = models.FloatField()
    rmse = models.FloatField()
    mape = models.FloatField()
    directional_accuracy = models.FloatField()
    calibration_score = models.FloatField(null=True, blank=True)
    
    # Regime breakdown (optional)
    regime_metrics = models.JSONField(default=dict)
    
    # Timestamps
    run_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'backtest_runs'
        ordering = ['-run_at']
    
    def __str__(self):
        return f"Backtest {self.model} on {self.market.symbol} ({self.test_start} - {self.test_end})"