from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from .models import Alert, AlertHistory


def check_alert_condition(alert, forecast) -> tuple[bool, str, str]:
    """
    Check if alert condition is met.
    Returns: (is_triggered, condition_met_description, forecast_value)
    """
    current_price = float(forecast.current_price)
    predicted_mid = float(forecast.predicted_mid)
    expected_move = ((predicted_mid - current_price) / current_price) * 100
    confidence = forecast.confidence_score * 100
    direction = forecast.direction
    
    condition_type = alert.condition_type
    condition_value = alert.condition_value
    
    if condition_type == 'direction_change':
        # Need to compare with previous forecast
        from forecasts.models import Forecast
        previous = Forecast.objects.filter(
            market=alert.market,
            horizon=forecast.horizon,
            is_latest=False
        ).order_by('-generated_at').first()
        
        if previous and previous.direction != direction:
            return True, f"Direction changed from {previous.direction} to {direction}", direction
        return False, "", ""
    
    elif condition_type == 'direction_up':
        if direction == 'up':
            return True, "Direction is Up", direction
        return False, "", ""
    
    elif condition_type == 'direction_down':
        if direction == 'down':
            return True, "Direction is Down", direction
        return False, "", ""
    
    elif condition_type == 'confidence_above':
        if confidence > condition_value:
            return True, f"Confidence {confidence:.1f}% > {condition_value}%", f"{confidence:.1f}%"
        return False, "", ""
    
    elif condition_type == 'confidence_below':
        if confidence < condition_value:
            return True, f"Confidence {confidence:.1f}% < {condition_value}%", f"{confidence:.1f}%"
        return False, "", ""
    
    elif condition_type == 'expected_move_above':
        if expected_move > condition_value:
            return True, f"Expected move {expected_move:.2f}% > {condition_value}%", f"{expected_move:.2f}%"
        return False, "", ""
    
    elif condition_type == 'expected_move_below':
        if expected_move < condition_value:
            return True, f"Expected move {expected_move:.2f}% < {condition_value}%", f"{expected_move:.2f}%"
        return False, "", ""
    
    return False, "", ""


def send_alert_email(alert, condition_met: str, forecast_value: str) -> bool:
    """Send alert email to user."""
    try:
        # Check if user has email notifications enabled
        if hasattr(alert.user, 'notification_settings'):
            if not alert.user.notification_settings.notify_alerts_email:
                return False
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000')
        
        subject = f"🔔 Alert: {alert.market.symbol} - {condition_met}"
        
        message = f"""
Your alert for {alert.market.symbol} ({alert.market.name}) has been triggered.

Condition: {condition_met}
Value: {forecast_value}
Horizon: {alert.horizon}

View details: {frontend_url}/app/market/{alert.market.symbol}

---
Manage your alerts: {frontend_url}/app/alerts
"""
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[alert.user.email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Failed to send alert email: {e}")
        return False


def process_alerts_for_forecast(forecast):
    """Check all active alerts for a forecast and trigger if conditions met."""
    
    # Get all active alerts for this market
    alerts = Alert.objects.filter(
        market=forecast.market,
        status=Alert.Status.ACTIVE,
    ).filter(
        # Match horizon or ANY
        horizon__in=[forecast.horizon, Alert.Horizon.ANY]
    ).select_related('user', 'market')
    
    for alert in alerts:
        is_triggered, condition_met, forecast_value = check_alert_condition(alert, forecast)
        
        if is_triggered:
            # Send email
            email_sent = send_alert_email(alert, condition_met, forecast_value)
            
            # Create history record
            AlertHistory.objects.create(
                alert=alert,
                condition_met=condition_met,
                forecast_value=forecast_value,
                email_sent=email_sent,
                push_sent=False,
            )
            
            # Update alert
            alert.last_triggered_at = timezone.now()
            alert.trigger_count += 1
            
            # If not recurring, pause the alert
            if not alert.is_recurring:
                alert.status = Alert.Status.PAUSED
            
            alert.save(update_fields=['last_triggered_at', 'trigger_count', 'status'])
            
            print(f"Alert triggered: {alert} - {condition_met}")