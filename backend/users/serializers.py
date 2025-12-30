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

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    full_name = serializers.CharField(write_only=True, required=True)
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
            'full_name',
            'password',
            'password_confirm',
        ]
    
    def validate_full_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value.strip()
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        full_name = validated_data.pop('full_name')
        
        # Split full name into first and last name
        name_parts = full_name.split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
        )
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