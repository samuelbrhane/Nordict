from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Market, MarketData, UserMarket
from .serializers import MarketSerializer, MarketDataSerializer, UserMarketSerializer


class MarketListView(generics.ListAPIView):
    """List all available markets."""
    
    serializer_class = MarketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Market.objects.filter(status='active')
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        featured = self.request.query_params.get('featured')
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(symbol__icontains=search) | queryset.filter(name__icontains=search)
        
        return queryset
    
    @extend_schema(
        tags=['Markets'],
        summary="List markets",
        parameters=[
            OpenApiParameter(name='category', description='Filter by category'),
            OpenApiParameter(name='featured', description='Only featured markets'),
            OpenApiParameter(name='search', description='Search by symbol or name'),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MarketDetailView(generics.RetrieveAPIView):
    """Get details for a specific market."""
    
    serializer_class = MarketSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'symbol'
    
    def get_queryset(self):
        return Market.objects.all()
    
    @extend_schema(tags=['Markets'], summary="Get market details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class MarketDataView(generics.ListAPIView):
    """Get historical price data for a market."""
    
    serializer_class = MarketDataSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        symbol = self.kwargs['symbol']
        market = get_object_or_404(Market, symbol=symbol)
        
        queryset = MarketData.objects.filter(market=market)
        
        timeframe = self.request.query_params.get('timeframe', '1h')
        queryset = queryset.filter(timeframe=timeframe)
        
        limit = int(self.request.query_params.get('limit', 100))
        limit = min(limit, 1000)
        
        return queryset[:limit]
    
    @extend_schema(
        tags=['Markets'],
        summary="Get market price data",
        parameters=[
            OpenApiParameter(name='timeframe', description='Timeframe (1h, 1d)', default='1h'),
            OpenApiParameter(name='limit', description='Number of data points (max 1000)', default=100),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)


class UserMarketListView(generics.ListCreateAPIView):
    """List and add tracked markets for the current user."""
    
    serializer_class = UserMarketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserMarket.objects.filter(user=self.request.user)
    
    @extend_schema(tags=['Markets'], summary="List user's tracked markets")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Markets'], summary="Add market to tracking")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserMarketDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or remove a tracked market."""
    
    serializer_class = UserMarketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        symbol = self.kwargs['symbol']
        return get_object_or_404(UserMarket, user=self.request.user, market__symbol=symbol)
    
    @extend_schema(tags=['Markets'], summary="Get tracked market details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Markets'], summary="Update tracked market")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(tags=['Markets'], summary="Partial update tracked market")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @extend_schema(tags=['Markets'], summary="Remove market from tracking")
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)