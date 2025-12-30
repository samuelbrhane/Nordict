from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Password reset
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
     path('password-change/', PasswordChangeView.as_view(), name='password-change'),
    
    # User profile
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('me/preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('me/delete/', DeleteAccountView.as_view(), name='delete-account'),
    path('me/notifications/', NotificationSettingsView.as_view(), name='notification-settings'),

    
    # API keys
    path('api-keys/', APIKeyView.as_view(), name='api-keys'),
    
    # Sessions
    path('sessions/', SessionListView.as_view(), name='session-list'),
    path('sessions/<int:session_id>/', SessionRevokeView.as_view(), name='session-revoke'),
    path('sessions/revoke-all/', SessionRevokeAllView.as_view(), name='session-revoke-all'),
]