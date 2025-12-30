from django.db import models
from django.conf import settings


class Alert(models.Model):
    """User-configured alert."""
    
    class TriggerType(models.TextChoices):
        CONFIDENCE_ABOVE = 'confidence_above', 'Confidence Above'
        CONFIDENCE_BELOW = 'confidence_below', 'Confidence Below'
        PROBABILITY_UP_ABOVE = 'prob_up_above', 'Probability Up Above'
        PROBABILITY_DOWN_ABOVE = 'prob_down_above', 'Probability Down Above'
        PREDICTED_MOVE_ABOVE = 'move_above', 'Predicted Move Above'
        DIRECTION_CHANGE = 'direction_change', 'Direction Change'
    
    class Channel(models.TextChoices):
        EMAIL = 'email', 'Email'
        WEBHOOK = 'webhook', 'Webhook'
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAUSED = 'paused', 'Paused'
        DISABLED = 'disabled', 'Disabled'
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='alerts',
    )
    market = models.ForeignKey(
        'markets.Market',
        on_delete=models.CASCADE,
        related_name='alerts',
    )
    
    # Alert configuration
    name = models.CharField(max_length=100)
    horizon = models.CharField(max_length=20, default='daily')
    trigger_type = models.CharField(
        max_length=30,
        choices=TriggerType.choices,
    )
    trigger_value = models.FloatField()  # Threshold value
    
    # Delivery
    channel = models.CharField(
        max_length=20,
        choices=Channel.choices,
        default=Channel.EMAIL,
    )
    webhook_url = models.URLField(blank=True)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    
    # Noise controls
    cooldown_hours = models.IntegerField(default=24)  # Min hours between alerts
    max_alerts_per_day = models.IntegerField(default=3)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_triggered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'alerts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.market.symbol})"


class AlertHistory(models.Model):
    """Log of triggered alerts."""
    
    alert = models.ForeignKey(
        Alert,
        on_delete=models.CASCADE,
        related_name='history',
    )
    forecast = models.ForeignKey(
        'forecasts.Forecast',
        on_delete=models.SET_NULL,
        null=True,
        related_name='triggered_alerts',
    )
    
    # Trigger details
    triggered_at = models.DateTimeField(auto_now_add=True)
    trigger_value_at_time = models.FloatField()  # The value that triggered it
    
    # Delivery status
    delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True, blank=True)
    delivery_error = models.TextField(blank=True)
    
    # Message content
    message = models.TextField()
    
    class Meta:
        db_table = 'alert_history'
        ordering = ['-triggered_at']
    
    def __str__(self):
        return f"{self.alert.name} triggered @ {self.triggered_at}"