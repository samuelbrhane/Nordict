from django.urls import path
from . import views

urlpatterns = [
    path('', views.alerts_list, name='alerts-list'),
    path('<int:alert_id>/', views.alert_detail, name='alert-detail'),
    path('<int:alert_id>/toggle/', views.toggle_alert_status, name='alert-toggle'),
    path('history/', views.alert_history, name='alert-history'),
    path('unread-count/', views.unread_alert_count, name='alert-unread-count'),
    path('mark-viewed/', views.mark_alerts_viewed, name='alert-mark-viewed'),
]