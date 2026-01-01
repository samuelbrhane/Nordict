from django.urls import path
from . import views

urlpatterns = [
    path("dashboard_kpi/", views.dashboard_kpi, name="dashboard-kpi"),
    path("chart/", views.forecast_chart, name="forecast-chart"),
    path("markets/", views.list_markets_with_forecasts, name="markets-with-forecasts"),
    path("toggle_favorite/", views.toggle_favorite, name="toggle-favorite"),
    path("by_market/", views.forecast_by_market, name="forecast-by-market"),
    path("", views.list_forecasts, name="forecast-list"),
    path("performance/", views.forecast_performance, name="forecast-performance"),
    path("top_signals/", views.top_signals, name="top-signals"),
    path("model_info/", views.model_info, name="model-info"),
    path("backtest_runs/", views.backtest_runs, name="backtest-runs"),
]