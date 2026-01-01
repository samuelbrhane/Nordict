import uuid
from datetime import timedelta
from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
import math


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
    """Core user model - keep it minimal."""
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    company = models.CharField(max_length=100, blank=True, null=True)
    timezone = models.CharField(max_length=50, default='UTC')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_alerts_viewed_at = models.DateTimeField(null=True, blank=True)
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
        if not self.username:
            self.username = str(uuid.uuid4())[:8]
        super().save(*args, **kwargs)
    
    @property
    def full_name(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return name or self.email
    
    # === Subscription shortcuts ===
    
    @property
    def subscription(self):
        """Get or create user subscription."""
        sub, _ = UserSubscription.objects.get_or_create(user=self)
        return sub
    
    @property
    def preferences(self):
        """Get or create user preferences."""
        prefs, _ = UserPreferences.objects.get_or_create(user=self)
        return prefs
    
    @property
    def is_trial_active(self):
        return self.subscription.is_trial_active
    
    @property
    def trial_days_remaining(self):
        return self.subscription.trial_days_remaining
    
    @property
    def is_subscription_active(self):
        return self.subscription.is_subscription_active
    
    @property
    def effective_plan(self):
        return self.subscription.effective_plan
    
    @property
    def plan_limits(self):
        return self.subscription.plan_limits
    
    @property
    def max_sessions(self):
        return self.subscription.max_sessions


class UserSubscription(models.Model):
    """Subscription and billing information."""
    
    class Plan(models.TextChoices):
        FREE = 'free', 'Free'
        PRO = 'pro', 'Pro'
        PREMIUM = 'premium', 'Premium'
        TEAMS = 'teams', 'Teams'
    
    class BillingCycle(models.TextChoices):
        MONTHLY = 'monthly', 'Monthly'
        YEARLY = 'yearly', 'Yearly'
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription_data'
    )
    
    # Plan
    plan = models.CharField(
        max_length=20,
        choices=Plan.choices,
        default=Plan.FREE,
    )
    billing_cycle = models.CharField(
        max_length=20,
        choices=BillingCycle.choices,
        default=BillingCycle.MONTHLY,
    )
    
    # Trial
    trial_started_at = models.DateTimeField(null=True, blank=True)
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    trial_used = models.BooleanField(default=False)
    
    # Subscription dates
    started_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    # Stripe
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_payment_method_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_card_last4 = models.CharField(max_length=4, blank=True, null=True)
    stripe_card_brand = models.CharField(max_length=20, blank=True, null=True)
    stripe_card_exp_month = models.IntegerField(blank=True, null=True)
    stripe_card_exp_year = models.IntegerField(blank=True, null=True)
    
    pending_plan = models.CharField(max_length=20, blank=True, null=True)
    pending_billing_cycle = models.CharField(max_length=20, blank=True, null=True)
    pending_stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    pending_expires_at = models.DateTimeField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_subscriptions'
        verbose_name = 'user subscription'
        verbose_name_plural = 'user subscriptions'
    
    def __str__(self):
        return f"{self.user.email} - {self.plan}"
    
    def start_trial(self, days=7):
        """Start the free trial period."""
        if self.trial_used:
            return False
        
        now = timezone.now()
        self.trial_started_at = now
        self.trial_ends_at = now + timedelta(days=days)
        self.save()
        return True
    
    def end_trial(self):
        """End trial and mark as used."""
        self.trial_used = True
        self.save(update_fields=['trial_used'])
    
    @property
    def is_trial_active(self):
        if self.trial_used:
            return False
        if not self.trial_ends_at:
            return False
        return timezone.now() < self.trial_ends_at
    
    @property
    def trial_days_remaining(self):
        if not self.is_trial_active:
            return 0
        remaining = (self.trial_ends_at - timezone.now()).total_seconds()
        return max(0, math.ceil(remaining / 86400))
    
    @property
    def is_subscription_active(self):
        if self.plan == self.Plan.FREE:
            return False
        if not self.expires_at:
            return False
        if self.cancelled_at:
            return timezone.now() < self.expires_at
        return timezone.now() < self.expires_at
    
    @property
    def effective_plan(self):
        if self.is_subscription_active:
            return self.plan
        if self.is_trial_active:
            return self.Plan.PREMIUM
        return self.Plan.FREE
    
    @property
    def plan_limits(self):
        return settings.SUBSCRIPTION_PLANS.get(
            self.effective_plan,
            settings.SUBSCRIPTION_PLANS['free']
        )
    
    @property
    def max_sessions(self):
        return self.plan_limits.get('max_sessions')
    
    @property
    def next_billing_date(self):
        if not self.is_subscription_active:
            return None
        return self.expires_at
    
    @property
    def available_horizons(self):
        return self.plan_limits.get('horizons', [])

    @property
    def max_markets(self):
        return self.plan_limits.get('max_markets')


class UserPreferences(models.Model):
    """User preferences and notification settings."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='preferences_data'
    )
    
    # Defaults
    default_market = models.CharField(max_length=20, default='BTC-USD')
    default_horizon = models.CharField(max_length=20, default='daily')
    
    # Notification preferences
    notify_alerts_email = models.BooleanField(default=True)
    notify_alerts_push = models.BooleanField(default=False)
    notify_forecast_daily = models.BooleanField(default=True)
    notify_forecast_significant = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_preferences'
        verbose_name = 'user preferences'
        verbose_name_plural = 'user preferences'
    
    def __str__(self):
        return f"{self.user.email} preferences"


class UserSession(models.Model):
    """Track user sessions for device management."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    
    refresh_token_jti = models.CharField(max_length=255, unique=True)
    access_token_jti = models.CharField(max_length=255, blank=True, null=True)
    
    device = models.CharField(max_length=255, blank=True, null=True)
    browser = models.CharField(max_length=100, blank=True, null=True)
    os = models.CharField(max_length=100, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_active = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_sessions'
        verbose_name = 'user session'
        verbose_name_plural = 'user sessions'
        ordering = ['-last_active']
    
    def __str__(self):
        return f"{self.user.email} - {self.device}"
    
    @property
    def last_active_display(self):
        """Human-readable last active time."""
        now = timezone.now()
        diff = now - self.last_active
        
        if diff.seconds < 60:
            return "Now"
        elif diff.seconds < 3600:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        elif diff.seconds < 86400:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        else:
            days = diff.days
            return f"{days} day{'s' if days != 1 else ''} ago"