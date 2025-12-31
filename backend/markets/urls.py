from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_markets, name="market-list"),
    path("featured/", views.get_featured_markets, name="market-featured"),
    path("<str:symbol>/", views.get_market, name="market-detail"),
]