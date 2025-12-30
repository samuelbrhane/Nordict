from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile
    path('me/', views.UserProfileView.as_view(), name='user-profile'),
    path('me/preferences/', views.UserPreferencesView.as_view(), name='user-preferences'),
    
    # API keys
    path('api-keys/', views.APIKeyView.as_view(), name='api-keys'),
]