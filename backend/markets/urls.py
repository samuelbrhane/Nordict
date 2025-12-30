from django.urls import path
from . import views

urlpatterns = [
    # Markets
    path('', views.MarketListView.as_view(), name='market-list'),
    path('<str:symbol>/', views.MarketDetailView.as_view(), name='market-detail'),
    path('<str:symbol>/data/', views.MarketDataView.as_view(), name='market-data'),
    
    # User's tracked markets
    path('user/tracked/', views.UserMarketListView.as_view(), name='user-markets'),
    path('user/tracked/<str:symbol>/', views.UserMarketDetailView.as_view(), name='user-market-detail'),
]