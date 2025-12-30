from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    effective_plan = serializers.CharField(read_only=True)
    is_trial_active = serializers.BooleanField(read_only=True)
    trial_days_remaining = serializers.IntegerField(read_only=True)
    is_subscription_active = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'subscription_plan',
            'subscription_expires_at',
            'effective_plan',
            'is_trial_active',
            'trial_days_remaining',
            'trial_ends_at',
            'is_subscription_active',
            'default_market',
            'default_horizon',
            'timezone',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'email',
            'subscription_plan',
            'subscription_expires_at',
            'effective_plan',
            'is_trial_active',
            'trial_days_remaining',
            'trial_ends_at',
            'is_subscription_active',
            'created_at',
        ]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'password',
            'password_confirm',
            'first_name',
            'last_name',
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Trial starts automatically in model save()
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class UserPreferencesSerializer(serializers.ModelSerializer):
    """Serializer for user preferences."""
    
    class Meta:
        model = User
        fields = [
            'default_market',
            'default_horizon',
            'timezone',
        ]


class APIKeySerializer(serializers.Serializer):
    """Serializer for API key response."""
    
    api_key = serializers.CharField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)