from django.urls import path
from .views import (
    ContactSubmitView,
    ContactSubmissionListView,
    ContactSubmissionDetailView,
)

urlpatterns = [
    # Public endpoint
    path('submit/', ContactSubmitView.as_view(), name='contact-submit'),
    
    # Admin endpoints
    path('admin/', ContactSubmissionListView.as_view(), name='contact-admin-list'),
    path('admin/<int:pk>/', ContactSubmissionDetailView.as_view(), name='contact-admin-detail'),
]