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
from .utils import get_client_info, get_location_from_ip
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from .serializers import *

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
        access_token = refresh.access_token
        
        # Create first session
        client_info = get_client_info(request)
        UserSession.objects.create(
            user=user,
            refresh_token_jti=str(refresh['jti']),
            access_token_jti=str(access_token['jti']),
            device=client_info['device'],
            browser=client_info['browser'],
            os=client_info['os'],
            ip_address=client_info['ip_address'],
            location=get_location_from_ip(client_info['ip_address']),
        )
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(access_token),
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
        
        # Get client info
        client_info = get_client_info(request)
        
        # Check for existing session from same device/browser/IP
        existing_session = UserSession.objects.filter(
            user=user,
            is_active=True,
            device=client_info['device'],
            browser=client_info['browser'],
            os=client_info['os'],
            ip_address=client_info['ip_address'],
        ).first()
        
        if existing_session:
            # Blacklist old refresh token
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
                outstanding = OutstandingToken.objects.get(jti=existing_session.refresh_token_jti)
                BlacklistedToken.objects.get_or_create(token=outstanding)
            except:
                pass
            
            # Generate new tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Update existing session with new tokens
            existing_session.refresh_token_jti = str(refresh['jti'])
            existing_session.access_token_jti = str(access_token['jti'])
            existing_session.last_active = timezone.now()
            existing_session.save()
        else:
            # Check session limit for new device
            max_sessions = user.max_sessions
            if max_sessions is not None:
                active_sessions = UserSession.objects.filter(user=user, is_active=True)
                active_count = active_sessions.count()
                
                if active_count >= max_sessions:
                    # Remove oldest session
                    sessions_to_remove = active_count - max_sessions + 1
                    oldest_sessions = active_sessions.order_by('last_active')[:sessions_to_remove]
                    
                    for session in oldest_sessions:
                        try:
                            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
                            outstanding = OutstandingToken.objects.get(jti=session.refresh_token_jti)
                            BlacklistedToken.objects.get_or_create(token=outstanding)
                        except:
                            pass
                        session.is_active = False
                        session.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Create new session
            UserSession.objects.create(
                user=user,
                refresh_token_jti=str(refresh['jti']),
                access_token_jti=str(access_token['jti']),
                device=client_info['device'],
                browser=client_info['browser'],
                os=client_info['os'],
                ip_address=client_info['ip_address'],
                location=get_location_from_ip(client_info['ip_address']),
            )
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(access_token),
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
            
            
class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update current user profile."""
    
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ProfileUpdateSerializer
        return UserSerializer
    
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
        response = super().patch(request, *args, **kwargs)
        # Return full user data after update
        return Response(UserSerializer(self.get_object()).data)
    
    
class PasswordChangeView(APIView):
    """Change password for authenticated user."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordChangeSerializer
    
    @extend_schema(tags=['Auth'], summary="Change password")
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Verify current password
        if not user.check_password(serializer.validated_data['current_password']):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({'message': 'Password changed successfully'})
    
    
class SessionListView(APIView):
    """List user's active sessions."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Auth'], summary="List active sessions")
    def get(self, request):
        sessions = UserSession.objects.filter(user=request.user, is_active=True)
        
        # Get current access token JTI
        current_jti = None
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if auth_header.startswith('Bearer '):
            try:
                token = auth_header.split(' ')[1]
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                current_jti = payload.get('jti')
                print(f"Current access token JTI: {current_jti}")
            except Exception as e:
                print(f"JWT decode error: {e}")
        
        session_data = []
        for session in sessions:
            data = SessionSerializer(session).data
            is_current = session.access_token_jti == current_jti
            data['is_current'] = is_current
            print(f"Session {session.id}: access_jti={session.access_token_jti}, current_jti={current_jti}, is_current={is_current}")
            session_data.append(data)
        
        return Response(session_data)


class SessionRevokeView(APIView):
    """Revoke a specific session."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Auth'], summary="Revoke session")
    def delete(self, request, session_id):
        try:
            session = UserSession.objects.get(
                id=session_id,
                user=request.user,
                is_active=True
            )
            
            # Blacklist the refresh token
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
                outstanding = OutstandingToken.objects.get(jti=session.refresh_token_jti)
                BlacklistedToken.objects.get_or_create(token=outstanding)
            except:
                pass
            
            # Mark session as inactive
            session.is_active = False
            session.save()
            
            return Response({'message': 'Session revoked'})
            
        except UserSession.DoesNotExist:
            return Response(
                {'error': 'Session not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class SessionRevokeAllView(APIView):
    """Revoke all sessions including current."""
    
    permission_classes = [IsAuthenticated]
    
    @extend_schema(tags=['Auth'], summary="Revoke all sessions")
    def post(self, request):
        # Get ALL active sessions (including current)
        sessions = UserSession.objects.filter(
            user=request.user,
            is_active=True
        )
        
        count = sessions.count()
        
        # Blacklist and deactivate all
        for session in sessions:
            try:
                from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
                outstanding = OutstandingToken.objects.get(jti=session.refresh_token_jti)
                BlacklistedToken.objects.get_or_create(token=outstanding)
            except:
                pass
            session.is_active = False
            session.save()
        
        return Response({'message': f'Revoked {count} sessions'})
    
    

class DeleteAccountView(APIView):
    """Permanently delete user account."""
    
    permission_classes = [IsAuthenticated]
    serializer_class = DeleteAccountSerializer
    
    @extend_schema(tags=['Auth'], summary="Delete account")
    def post(self, request):
        serializer = DeleteAccountSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Verify password
        if not user.check_password(serializer.validated_data['password']):
            return Response(
                {'error': 'Incorrect password'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Deactivate all sessions
        UserSession.objects.filter(user=user).update(is_active=False)
        
        # Option 1: Soft delete (recommended)
        user.is_active = False
        user.email = f"deleted_{user.id}_{user.email}"  # Prevent email reuse issues
        user.save()
        
        # Option 2: Hard delete (uncomment if you prefer)
        # user.delete()
        
        return Response({'message': 'Account deleted successfully'})