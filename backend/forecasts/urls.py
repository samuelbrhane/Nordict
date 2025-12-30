from django.urls import path
from . import views

urlpatterns = [
    # Forecasts
    path('', views.ForecastListView.as_view(), name='forecast-list'),
    path('<str:symbol>/', views.ForecastDetailView.as_view(), name='forecast-detail'),
    path('<str:symbol>/history/', views.ForecastHistoryView.as_view(), name='forecast-history'),
    
    # Models
    path('models/', views.MLModelListView.as_view(), name='model-list'),
    path('models/<int:pk>/', views.MLModelDetailView.as_view(), name='model-detail'),
    
    # Backtesting
    path('performance/', views.BacktestListView.as_view(), name='backtest-list'),
    path('performance/<str:symbol>/', views.BacktestDetailView.as_view(), name='backtest-detail'),
]