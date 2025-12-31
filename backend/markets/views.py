from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Market
from .serializers import *


@extend_schema(
    summary="List markets",
    description="Get paginated list of markets with optional search",
    parameters=[
        OpenApiParameter(
            name="search",
            description="Search by symbol or name",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="page",
            description="Page number (default: 1)",
            required=False,
            type=int,
        ),
        OpenApiParameter(
            name="page_size",
            description="Items per page (default: 10, max: 50)",
            required=False,
            type=int,
        ),
        OpenApiParameter(
            name="with_forecasts",
            description="Only return markets that have forecasts",
            required=False,
            type=bool,
        ),
    ],
    tags=["Markets"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_markets(request):
    """Get paginated list of markets."""
    from forecasts.models import Forecast
    
    # Get query params
    search = request.query_params.get("search", "").strip()
    page = int(request.query_params.get("page", 1))
    page_size = min(int(request.query_params.get("page_size", 10)), 50)
    with_forecasts = request.query_params.get("with_forecasts", "").lower() == "true"
    
    # Base queryset
    queryset = Market.objects.filter(status="active")
    
    # Filter to only markets with forecasts
    if with_forecasts:
        markets_with_forecasts = Forecast.objects.filter(
            is_latest=True
        ).values_list("market_id", flat=True).distinct()
        queryset = queryset.filter(id__in=markets_with_forecasts)
    
    # Search filter
    if search:
        queryset = queryset.filter(
            Q(symbol__icontains=search) | Q(name__icontains=search)
        )
    
    # Order by featured first, then by symbol
    queryset = queryset.order_by("-is_featured", "symbol")
    
    # Get total count
    total_count = queryset.count()
    
    # Paginate
    start = (page - 1) * page_size
    end = start + page_size
    markets = queryset[start:end]
    
    # Serialize
    serializer = MarketListSerializer(markets, many=True)
    
    # Calculate pagination info
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 0
    
    return Response({
        "results": serializer.data,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        },
    })

@extend_schema(
    summary="Get market detail",
    description="Get single market by symbol",
    responses={200: MarketListSerializer},
    tags=["Markets"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_market(request, symbol: str):
    """
    Get single market by symbol.
    """
    try:
        market = Market.objects.get(symbol=symbol, status="active")
    except Market.DoesNotExist:
        return Response({"error": f"Market {symbol} not found"}, status=404)
    
    serializer = MarketListSerializer(market)
    return Response(serializer.data)


@extend_schema(
    summary="Get featured markets",
    description="Get list of featured markets (no pagination)",
    responses={200: MarketListSerializer(many=True)},
    tags=["Markets"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_featured_markets(request):
    """
    Get all featured markets.
    Returns without pagination for quick access.
    """
    markets = Market.objects.filter(
        status="active",
        is_featured=True,
    ).order_by("symbol")
    
    serializer = MarketListSerializer(markets, many=True)
    return Response(serializer.data)