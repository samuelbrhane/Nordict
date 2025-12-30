from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import uuid

class CustomUserManager(BaseUserManager):
    """Custom manager for User model with email as identifier."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
class User(AbstractUser):
    """Custom user model with subscription and preferences."""
    
    class SubscriptionPlan(models.TextChoices):
        FREE = 'free', 'Free'
        PRO = 'pro', 'Pro'
        PREMIUM = 'premium', 'Premium'
        TEAMS = 'teams', 'Teams'
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    
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
    company = models.CharField(max_length=100, blank=True, null=True)
    
    # Notification preferences (add after timezone field)
    notify_alerts_email = models.BooleanField(default=True)
    notify_alerts_push = models.BooleanField(default=False)
    notify_forecast_daily = models.BooleanField(default=True)
    notify_forecast_significant = models.BooleanField(default=True)
    
    # API access
    api_key = models.CharField(max_length=64, null=True, blank=True, unique=True)
    api_key_created_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  
    
    class Meta:
        db_table = 'users'
        verbose_name = 'user'
        verbose_name_plural = 'users'
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Auto-generate username if not provided
        if not self.username:
            self.username = str(uuid.uuid4())[:8]
        
        # Auto-start trial for new users
        if not self.pk and not self.trial_used:
            self.start_trial()
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        """Get user's full name."""
        name = f"{self.first_name} {self.last_name}".strip()
        return name or self.email
    
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
        if self.is_subscription_active:
            return self.subscription_plan
        
        if self.is_trial_active:
            return self.SubscriptionPlan.PREMIUM
        
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
        
    @property
    def max_sessions(self):
        """Get max sessions for user's plan."""
        return self.plan_limits.get('max_sessions')
    
        
        
class UserSession(models.Model):
    """Track user login sessions."""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    refresh_token_jti = models.CharField(max_length=255, unique=True)
    access_token_jti = models.CharField(max_length=255, blank=True, null=True)  # Add this
    device = models.CharField(max_length=255, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    os = models.CharField(max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'user_sessions'
        ordering = ['-last_active']
        
    def __str__(self):
        return f"{self.user.email} - {self.device}"