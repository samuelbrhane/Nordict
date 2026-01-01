from django.db import models
from django.conf import settings


class Alert(models.Model):
    """User-defined forecast alerts."""
    
    class ConditionType(models.TextChoices):
        DIRECTION_CHANGE = 'direction_change', 'Direction Changes'
        DIRECTION_UP = 'direction_up', 'Direction is Up'
        DIRECTION_DOWN = 'direction_down', 'Direction is Down'
        CONFIDENCE_ABOVE = 'confidence_above', 'Confidence Above'
        CONFIDENCE_BELOW = 'confidence_below', 'Confidence Below'
        EXPECTED_MOVE_ABOVE = 'expected_move_above', 'Expected Move Above'
        EXPECTED_MOVE_BELOW = 'expected_move_below', 'Expected Move Below'
    
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAUSED = 'paused', 'Paused'
    
    class Horizon(models.TextChoices):
        H24 = '24H', '24 Hours'
        D30 = '30D', '30 Days'
        W12 = '12W', '12 Weeks'
        M12 = '12M', '12 Months'
        ANY = 'ANY', 'Any Horizon'
    
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
    
    horizon = models.CharField(
        max_length=10,
        choices=Horizon.choices,
        default=Horizon.ANY,
    )
    
    condition_type = models.CharField(
        max_length=30,
        choices=ConditionType.choices,
    )
    condition_value = models.FloatField(null=True, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    
    is_recurring = models.BooleanField(default=True)
    
    last_triggered_at = models.DateTimeField(null=True, blank=True)
    trigger_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'alerts'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.market.symbol} - {self.condition_type}"


class AlertHistory(models.Model):
    """History of triggered alerts."""
    
    alert = models.ForeignKey(
        Alert,
        on_delete=models.CASCADE,
        related_name='history',
    )
    
    triggered_at = models.DateTimeField(auto_now_add=True)
    condition_met = models.CharField(max_length=200)
    forecast_value = models.CharField(max_length=100)
    
    email_sent = models.BooleanField(default=False)
    push_sent = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'alert_history'
        ordering = ['-triggered_at']
    
    def __str__(self):
        return f"{self.alert} - {self.triggered_at}"