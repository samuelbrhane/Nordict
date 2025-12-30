from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    """Custom user model with subscription and preferences."""
    
    class SubscriptionPlan(models.TextChoices):
        FREE = 'free', 'Free'
        PRO = 'pro', 'Pro'
        PREMIUM = 'premium', 'Premium'
        TEAMS = 'teams', 'Teams'
    
    email = models.EmailField(unique=True)
    
    # Subscription
    subscription_plan = models.CharField(
        max_length=20,
        choices=SubscriptionPlan.choices,
        default=SubscriptionPlan.FREE,
    )
    subscription_started_at = models.DateTimeField(null=True, blank=True)
    subscription_expires_at = models.DateTimeField(null=True, blank=True)
    
    # Trial
    trial_started_at = models.DateTimeField(null=True, blank=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    trial_used = models.BooleanField(default=False)
    
    # Preferences
    default_market = models.CharField(max_length=20, default='BTC-USD')
    default_horizon = models.CharField(max_length=20, default='daily')
    timezone = models.CharField(max_length=50, default='UTC')
    
    # API access
    api_key = models.CharField(max_length=64, null=True, blank=True, unique=True)
    api_key_created_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Auto-start trial for new users
        if not self.pk and not self.trial_used:
            self.start_trial()
        super().save(*args, **kwargs)
    
    def start_trial(self, days=7):
        """Start the free trial period."""
        if self.trial_used:
            return False
        
        now = timezone.now()
        self.trial_started_at = now
        self.trial_ends_at = now + timedelta(days=days)
        return True
    
    @property
    def is_trial_active(self):
        """Check if user is in active trial period."""
        if self.trial_used:
            return False
        if not self.trial_ends_at:
            return False
        return timezone.now() < self.trial_ends_at
    
    @property
    def trial_days_remaining(self):
        """Get remaining trial days."""
        if not self.is_trial_active:
            return 0
        remaining = self.trial_ends_at - timezone.now()
        return max(0, remaining.days)
    
    @property
    def is_subscription_active(self):
        """Check if paid subscription is active."""
        if self.subscription_plan == self.SubscriptionPlan.FREE:
            return False
        if not self.subscription_expires_at:
            return False
        return timezone.now() < self.subscription_expires_at
    
    @property
    def effective_plan(self):
        """Get the effective plan (considering trial)."""
        # Paid subscription takes priority
        if self.is_subscription_active:
            return self.subscription_plan
        
        # Trial gives Pro access
        if self.is_trial_active:
            return self.SubscriptionPlan.PRO
        
        # Otherwise free
        return self.SubscriptionPlan.FREE
    
    @property
    def plan_limits(self):
        """Get the limits for the user's effective plan."""
        return settings.SUBSCRIPTION_PLANS.get(
            self.effective_plan,
            settings.SUBSCRIPTION_PLANS['free']
        )
    
    @property
    def can_access_api(self):
        """Check if user has API access."""
        return self.plan_limits.get('api_access', False)
    
    @property
    def max_markets(self):
        """Get max markets for user's plan."""
        return self.plan_limits.get('max_markets')
    
    @property
    def max_alerts(self):
        """Get max alerts for user's plan."""
        return self.plan_limits.get('max_alerts')
    
    @property
    def available_horizons(self):
        """Get available forecast horizons for user's plan."""
        return self.plan_limits.get('horizons', ['daily'])
    
    def end_trial(self):
        """End trial and mark as used."""
        self.trial_used = True
        self.save(update_fields=['trial_used'])