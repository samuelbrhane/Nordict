from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import MLModel, Forecast, BacktestRun
from .serializers import (
    MLModelSerializer,
    ForecastSerializer,
    ForecastSummarySerializer,
    BacktestRunSerializer,
)
from markets.models import Market


class ForecastListView(generics.ListAPIView):
    """List latest forecasts for tracked markets."""
    
    serializer_class = ForecastSummarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Forecast.objects.filter(is_latest=True)
        
        horizon = self.request.query_params.get('horizon', 'daily')
        if horizon not in user.available_horizons:
            horizon = 'daily'
        queryset = queryset.filter(horizon=horizon)
        
        symbol = self.request.query_params.get('symbol')
        if symbol:
            queryset = queryset.filter(market__symbol=symbol)
        
        return queryset.select_related('market')
    
    @extend_schema(
        tags=['Forecasts'],
        summary="List latest forecasts",
        parameters=[
            OpenApiParameter(name='horizon', description='Forecast horizon'),
            OpenApiParameter(name='symbol', description='Market symbol'),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ForecastDetailView(generics.RetrieveAPIView):
    """Get detailed forecast for a market."""
    
    serializer_class = ForecastSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        user = self.request.user
        symbol = self.kwargs['symbol']
        horizon = self.request.query_params.get('horizon', 'daily')
        
        if horizon not in user.available_horizons:
            horizon = 'daily'
        
        market = get_object_or_404(Market, symbol=symbol)
        forecast = get_object_or_404(Forecast, market=market, horizon=horizon, is_latest=True)
        return forecast
    
    @extend_schema(
        tags=['Forecasts'],
        summary="Get forecast for market",
        parameters=[
            OpenApiParameter(name='horizon', description='Forecast horizon', default='daily'),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class ForecastHistoryView(generics.ListAPIView):
    """Get historical forecasts for a market."""
    
    serializer_class = ForecastSummarySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        symbol = self.kwargs['symbol']
        horizon = self.request.query_params.get('horizon', 'daily')
        
        if horizon not in user.available_horizons:
            horizon = 'daily'
        
        market = get_object_or_404(Market, symbol=symbol)
        
        limit = 30
        if user.plan_limits.get('backtest_days') is None:
            limit = 365
        
        return Forecast.objects.filter(market=market, horizon=horizon).order_by('-generated_at')[:limit]
    
    @extend_schema(
        tags=['Forecasts'],
        summary="Get forecast history",
        parameters=[
            OpenApiParameter(name='horizon', description='Forecast horizon'),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MLModelListView(generics.ListAPIView):
    """List ML models."""
    
    serializer_class = MLModelSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MLModel.objects.exclude(status='deprecated')
    
    @extend_schema(tags=['Forecasts'], summary="List ML models")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MLModelDetailView(generics.RetrieveAPIView):
    """Get ML model details."""
    
    serializer_class = MLModelSerializer
    permission_classes = [IsAuthenticated]
    queryset = MLModel.objects.all()
    
    @extend_schema(tags=['Forecasts'], summary="Get ML model details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class BacktestListView(generics.ListAPIView):
    """List backtest runs."""
    
    serializer_class = BacktestRunSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = BacktestRun.objects.all()
        
        model_id = self.request.query_params.get('model')
        if model_id:
            queryset = queryset.filter(model_id=model_id)
        
        horizon = self.request.query_params.get('horizon')
        if horizon:
            queryset = queryset.filter(horizon=horizon)
        
        return queryset.select_related('market', 'model')[:50]
    
    @extend_schema(
        tags=['Forecasts'],
        summary="List backtest runs",
        parameters=[
            OpenApiParameter(name='model', description='Filter by model ID'),
            OpenApiParameter(name='horizon', description='Filter by horizon'),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class BacktestDetailView(generics.ListAPIView):
    """Get backtest results for a specific market."""
    
    serializer_class = BacktestRunSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        symbol = self.kwargs['symbol']
        market = get_object_or_404(Market, symbol=symbol)
        return BacktestRun.objects.filter(market=market).select_related('model')[:20]
    
    @extend_schema(tags=['Forecasts'], summary="Get backtest results for market")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)