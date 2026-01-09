from django.db import models

class MLModel(models.Model):
    """Machine learning model registry."""
    
    class Status(models.TextChoices):
        TRAINING = 'training', 'Training'
        CANDIDATE = 'candidate', 'Candidate'
        PRODUCTION = 'production', 'Production'
        DEPRECATED = 'deprecated', 'Deprecated'
    
    class Horizon(models.TextChoices):
        H24 = '24H', '24 Hours'
        D30 = '30D', '30 Days'
        W12 = '12W', '12 Weeks'
        M12 = '12M', '12 Months'
    
    class ModelType(models.TextChoices):
        XGBOOST = 'xgboost', 'XGBoost'
        LSTM = 'lstm', 'LSTM'
    
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=20)
    model_type = models.CharField(
        max_length=20,
        choices=ModelType.choices,
        default=ModelType.XGBOOST,
    )
    horizon = models.CharField(
        max_length=10,
        choices=Horizon.choices,
    )
    # Null for XGBoost (general model), set for LSTM (coin-specific)
    market = models.ForeignKey(
        'markets.Market',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='ml_models',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CANDIDATE,
    )
    
    training_started_at = models.DateTimeField(null=True, blank=True)
    training_completed_at = models.DateTimeField(null=True, blank=True)
    training_data_start = models.DateField(null=True, blank=True)
    training_data_end = models.DateField(null=True, blank=True)
    
    artifact_path = models.CharField(max_length=500, blank=True)
    
    mae = models.FloatField(null=True, blank=True)
    rmse = models.FloatField(null=True, blank=True)
    mape = models.FloatField(null=True, blank=True)
    directional_accuracy = models.FloatField(null=True, blank=True)
    
    r2 = models.FloatField(null=True, blank=True)
    median_ae = models.FloatField(null=True, blank=True)
    max_error = models.FloatField(null=True, blank=True)
    bias = models.FloatField(null=True, blank=True)
    correlation = models.FloatField(null=True, blank=True)
    
    config = models.JSONField(default=dict)
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'ml_models'
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['model_type', 'horizon', 'market', 'version'],
                name='unique_model_version'
            )
        ]
    
    def __str__(self):
        if self.market:
            return f"{self.name} {self.market.symbol} v{self.version} ({self.horizon}) - {self.status}"
        return f"{self.name} v{self.version} ({self.horizon}) - {self.status}"
    
    

class Forecast(models.Model):
    """Generated forecast for a market."""
    
    class Horizon(models.TextChoices):
        H24 = '24H', '24 Hours'
        D30 = '30D', '30 Days'
        W12 = '12W', '12 Weeks'
        M12 = '12M', '12 Months'
    
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
    
    horizon = models.CharField(
        max_length=10,
        choices=Horizon.choices,
    )
    
    # When forecast was generated and its validity
    generated_at = models.DateTimeField()
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Summary
    direction = models.CharField(
        max_length=10,
        choices=Direction.choices,
    )
    confidence_score = models.FloatField()  # 0.0 to 1.0
    
    # Price at generation time
    current_price = models.DecimalField(max_digits=20, decimal_places=8)
    
    # Predicted range
    predicted_low = models.DecimalField(max_digits=20, decimal_places=8)
    predicted_mid = models.DecimalField(max_digits=20, decimal_places=8)
    predicted_high = models.DecimalField(max_digits=20, decimal_places=8)
    
    # Is this the latest forecast for this market/horizon?
    is_latest = models.BooleanField(default=True)
    
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
    
    step = models.IntegerField()  # 0, 1, 2, ... (position in forecast)
    timestamp = models.DateTimeField()  # Target time for this prediction
    
    # Predictions
    predicted_price = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_low = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_high = models.DecimalField(max_digits=20, decimal_places=8)
    confidence_score = models.FloatField()  # 0.0 to 1.0
    
    # Actual outcome (filled later when time passes)
    actual_price = models.DecimalField(
        max_digits=20, 
        decimal_places=8, 
        null=True, 
        blank=True
    )
    
    class Meta:
        db_table = 'forecast_points'
        unique_together = ['forecast', 'timestamp']
        ordering = ['timestamp']
    
    def __str__(self):
        return f"{self.forecast} - Step {self.step}"
    
    @property
    def error(self):
        """Calculate prediction error if actual price exists."""
        if self.actual_price is None:
            return None
        return float(self.actual_price - self.predicted_price)
    
    @property
    def error_percent(self):
        """Calculate percentage error if actual price exists."""
        if self.actual_price is None or self.predicted_price == 0:
            return None
        return (float(self.actual_price - self.predicted_price) / float(self.predicted_price)) * 100
    
    
    
class BacktestRun(models.Model):
    """Backtesting results for model evaluation."""
    
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
    horizon = models.CharField(max_length=10)
    
    # Test period
    test_start = models.DateField()
    test_end = models.DateField()
    
    # Performance metrics
    mae = models.FloatField()  # Mean Absolute Error
    rmse = models.FloatField()  # Root Mean Square Error
    mape = models.FloatField()  # Mean Absolute Percentage Error
    directional_accuracy = models.FloatField()  # % correct direction
    
    # Optional detailed metrics
    total_predictions = models.IntegerField(default=0)
    correct_directions = models.IntegerField(default=0)
    
    run_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'backtest_runs'
        ordering = ['-run_at']
    
    def __str__(self):
        return f"{self.model} on {self.market.symbol} ({self.test_start} to {self.test_end})"