from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    full_name = serializers.CharField(read_only=True)
    effective_plan = serializers.CharField(read_only=True)
    is_trial_active = serializers.BooleanField(read_only=True)
    trial_days_remaining = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'full_name',
            'effective_plan',
            'is_trial_active',
            'trial_days_remaining',
            'default_market',
            'default_horizon',
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