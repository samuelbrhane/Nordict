import secrets
from django.contrib.auth import get_user_model
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
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register a new user."""
    
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    @extend_schema(tags=['Auth'], summary="Register new user")
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
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
    
    @extend_schema(tags=['Auth'], summary="User login", request=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.check_password(password):
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        if not user.is_active:
            return Response(
                {'error': 'Account is disabled'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
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
        
        if not user.api_key:
            return Response({'api_key': None, 'created_at': None})
        
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