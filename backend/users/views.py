import secrets
import jwt
from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from drf_spectacular.utils import extend_schema

from .serializers import (
    UserSerializer,
    RegisterSerializer,
    LoginSerializer,
    UserPreferencesSerializer,
    APIKeySerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


class RegisterView(APIView):
    """Register a new user."""
    
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    
    @extend_schema(tags=['Auth'], summary="Register new user")
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # Split full name
        name_parts = data['full_name'].split(' ', 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else ''
        
        # Create user
        user = User.objects.create_user(
            email=data['email'],
            password=data['password'],
            first_name=first_name,
            last_name=last_name,
            timezone=data.get('timezone', 'UTC'),
        )
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Login and get JWT tokens."""
    
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    
    @extend_schema(tags=['Auth'], summary="User login")
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        
        # Find user
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(data['password']):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if active
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        # Update timezone if provided
        if data.get('timezone'):
            user.timezone = data['timezone']
            user.save(update_fields=['timezone'])
            
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class LogoutView(APIView):
    """Logout and blacklist refresh token."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Auth'], summary="User logout")
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'Successfully logged out'})
        except Exception:
            return Response(
                {'error': 'Invalid token'},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile."""
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(tags=['Auth'], summary="Get current user profile")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Auth'], summary="Update current user profile")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(tags=['Auth'], summary="Partial update current user profile")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class UserPreferencesView(generics.RetrieveUpdateAPIView):
    """Get or update user preferences."""
    
    serializer_class = UserPreferencesSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user
    
    @extend_schema(tags=['Auth'], summary="Get user preferences")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Auth'], summary="Update user preferences")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(tags=['Auth'], summary="Partial update user preferences")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class APIKeyView(APIView):
    """Manage API keys."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Auth'], summary="Get API key", responses={200: APIKeySerializer})
    def get(self, request):
        user = request.user
        
        if not user.can_access_api:
            return Response(
                {'error': 'API access not available on your plan'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return Response({
            'api_key': user.api_key,
            'created_at': user.api_key_created_at,
        })
    
    @extend_schema(tags=['Auth'], summary="Generate new API key", responses={201: APIKeySerializer})
    def post(self, request):
        user = request.user
        
        if not user.can_access_api:
            return Response(
                {'error': 'API access not available on your plan'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Generate new API key
        user.api_key = secrets.token_urlsafe(32)
        user.api_key_created_at = timezone.now()
        user.save(update_fields=['api_key', 'api_key_created_at'])
        
        return Response({
            'api_key': user.api_key,
            'created_at': user.api_key_created_at,
        }, status=status.HTTP_201_CREATED)
    
    @extend_schema(tags=['Auth'], summary="Revoke API key")
    def delete(self, request):
        user = request.user
        user.api_key = None
        user.api_key_created_at = None
        user.save(update_fields=['api_key', 'api_key_created_at'])
        
        return Response({'message': 'API key revoked'})


class PasswordResetRequestView(APIView):
    """Request a password reset link."""
    
    permission_classes = [AllowAny]
    serializer_class = PasswordResetRequestSerializer
    
    @extend_schema(tags=['Auth'], summary="Request password reset")
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        
        try:
            user = User.objects.get(email=email)
            
            # Generate JWT token
            payload = {
                'user_id': user.id,
                'email': user.email,
                'type': 'password_reset',
                'exp': datetime.utcnow() + timedelta(hours=1),
                'iat': datetime.utcnow(),
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            
            # TODO: Send email with reset link
            # reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            # send_password_reset_email(user.email, reset_url)
            
            # For development, print token to console
            print(f"Password reset token for {email}: {token}")
            
        except User.DoesNotExist:
            # Don't reveal if email exists
            pass
        
        return Response({
            'message': 'If an account exists with this email, a reset link has been sent.'
        })


class PasswordResetConfirmView(APIView):
    """Confirm password reset with token."""
    
    permission_classes = [AllowAny]
    serializer_class = PasswordResetConfirmSerializer
    
    @extend_schema(tags=['Auth'], summary="Confirm password reset")
    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        password = serializer.validated_data['password']
        
        try:
            # Decode JWT token
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Verify token type
            if payload.get('type') != 'password_reset':
                raise jwt.InvalidTokenError('Invalid token type')
            
            # Get user and update password
            user = User.objects.get(id=payload['user_id'])
            user.set_password(password)
            user.save()
            
            return Response({'message': 'Password has been reset successfully'})
            
        except jwt.ExpiredSignatureError:
            return Response(
                {'error': 'Reset link has expired. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.InvalidTokenError:
            return Response(
                {'error': 'Invalid reset link. Please request a new one.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_400_BAD_REQUEST
            )