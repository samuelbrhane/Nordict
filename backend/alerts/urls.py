from django.urls import path
from . import views

urlpatterns = [
    path('', views.AlertListCreateView.as_view(), name='alert-list'),
    path('<int:pk>/', views.AlertDetailView.as_view(), name='alert-detail'),
    path('<int:pk>/history/', views.AlertHistoryView.as_view(), name='alert-history'),
]