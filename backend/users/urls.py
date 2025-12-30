from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('me/', UserProfileView.as_view(), name='user-profile'),
    path('me/preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    
    # API keys
    path('api-keys/', APIKeyView.as_view(), name='api-keys'),
]