from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import *

User = get_user_model()


class UserSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for subscription data."""
    
    is_trial_active = serializers.BooleanField(read_only=True)
    trial_days_remaining = serializers.IntegerField(read_only=True)
    is_subscription_active = serializers.BooleanField(read_only=True)
    effective_plan = serializers.CharField(read_only=True)
    plan_limits = serializers.DictField(read_only=True)
    next_billing_date = serializers.DateTimeField(read_only=True)
    is_cancelled = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = UserSubscription
        fields = [
            'plan',
            'billing_cycle',
            'is_trial_active',
            'trial_days_remaining',
            'is_subscription_active',
            'effective_plan',
            'plan_limits',
            'next_billing_date',
            'cancelled_at',
            'is_cancelled',
            'stripe_customer_id',
            'stripe_card_last4',
            'stripe_card_brand',
            'stripe_card_exp_month',
            'stripe_card_exp_year',
        ]
    
    def get_is_cancelled(self, obj):
        """Check if subscription is cancelled but still active."""
        return obj.cancelled_at is not None and obj.is_subscription_active
    
    
class UserPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for user preferences."""
    
    class Meta:
        model = UserPreferences
        fields = [
            'default_market',
            'default_horizon',
            'notify_alerts_email',
            'notify_alerts_push',
            'notify_forecast_daily',
            'notify_forecast_significant',
        ]


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    full_name = serializers.CharField(read_only=True)
    subscription = UserSubscriptionSerializer(source='subscription_data', read_only=True)
    preferences = UserPreferencesSerializer(source='preferences_data', read_only=True)
    
    # Shortcuts for easy access
    effective_plan = serializers.CharField(read_only=True)
    is_trial_active = serializers.BooleanField(read_only=True)
    is_subscription_active = serializers.BooleanField(read_only=True)
    trial_days_remaining = serializers.IntegerField(read_only=True)
    plan_limits = serializers.DictField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'company',
            'timezone',
            # Nested objects
            'subscription',
            'preferences',
            # Shortcuts
            'effective_plan',
            'is_trial_active',
            'is_subscription_active',
            'trial_days_remaining',
            'plan_limits',
        ]

class RegisterSerializer(serializers.Serializer):
    """Serializer for user registration - validation only."""
    
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True, min_length=2)
    password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(required=True, write_only=True)
    timezone = serializers.CharField(required=False, default='UTC')
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value.lower()
    
    def validate_full_name(self, value):
        return value.strip()
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs


class LoginSerializer(serializers.Serializer):
    """Serializer for user login - validation only."""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    timezone = serializers.CharField(required=False, default='UTC')




class APIKeySerializer(serializers.Serializer):
    """Serializer for API key response."""
    
    api_key = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for password reset request - validation only."""
    
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for password reset confirmation - validation only."""
    
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, validators=[validate_password])
    password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs
    
    
class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile."""
    
    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'company',
            'timezone',
        ]
        
        
class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change - validation only."""
    
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "Passwords don't match."
            })
        return attrs
    
    
class SessionSerializer(serializers.ModelSerializer):
    """Serializer for user sessions."""
    
    is_current = serializers.SerializerMethodField()
    last_active_display = serializers.SerializerMethodField()
    
    class Meta:
        model = UserSession
        fields = [
            'id',
            'device',
            'browser',
            'os',
            'ip_address',
            'location',
            'created_at',
            'last_active',
            'last_active_display',
            'is_current',
        ]
    
    def get_is_current(self, obj):
        request = self.context.get('request')
        if not request:
            return False
        current_jti = request.auth.get('jti') if request.auth else None
        # Compare with stored refresh token jti
        return False  # We'll handle this differently
    
    def get_last_active_display(self, obj):
        from django.utils import timezone
        from django.utils.timesince import timesince
        
        now = timezone.now()
        diff = now - obj.last_active
        
        if diff.total_seconds() < 60:
            return "Now"
        elif diff.total_seconds() < 3600:
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif diff.total_seconds() < 86400:
            hours = int(diff.total_seconds() / 3600)
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        else:
            return timesince(obj.last_active) + " ago"
        
        
class DeleteAccountSerializer(serializers.Serializer):
    """Serializer for account deletion - requires password confirmation."""
    
    password = serializers.CharField(required=True, write_only=True)
    confirmation = serializers.CharField(required=True)
    
    def validate_confirmation(self, value):
        if value != "DELETE":
            raise serializers.ValidationError("Please type DELETE to confirm.")
        return value
    
    
class NotificationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for notification settings."""
    
    class Meta:
        model = UserPreferences  
        fields = [
            'notify_alerts_email',
            'notify_alerts_push',
            'notify_forecast_daily',
            'notify_forecast_significant',
        ]