from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q

from .models import Market
from .serializers import *


# =============================================================================
# Helper Functions
# =============================================================================

def get_user_limits(user):
    """Get subscription limits for user."""
    subscription = getattr(user, 'subscription_data', None)
    if subscription:
        return {
            'max_markets': subscription.max_markets,
            'horizons': subscription.available_horizons,
            'plan': subscription.effective_plan,
        }
    return {
        'max_markets': 0,
        'horizons': [],
        'plan': 'free',
    }


def get_allowed_market_ids(user, limits):
    """Get list of market IDs user can access."""
    max_markets = limits['max_markets']
    
    if max_markets is None:
        return None
    
    if max_markets == 0:
        return []
    
    return list(
        Market.objects.filter(status='active')
        .order_by('-is_featured', 'id')[:max_markets]
        .values_list('id', flat=True)
    )


# =============================================================================
# Endpoints
# =============================================================================

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_markets(request):
    """Get paginated list of markets."""
    from forecasts.models import Forecast
    
    search = request.query_params.get("search", "").strip()
    page = int(request.query_params.get("page", 1))
    page_size = min(int(request.query_params.get("page_size", 10)), 50)
    with_forecasts = request.query_params.get("with_forecasts", "").lower() == "true"
    
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    queryset = Market.objects.filter(status="active")
    
    if allowed_market_ids is not None:
        if len(allowed_market_ids) == 0:
            return Response({
                "results": [],
                "pagination": {
                    "page": 1,
                    "page_size": page_size,
                    "total_count": 0,
                    "total_pages": 0,
                    "has_next": False,
                    "has_previous": False,
                },
            })
        queryset = queryset.filter(id__in=allowed_market_ids)
    
    if with_forecasts:
        markets_with_forecasts = Forecast.objects.filter(
            is_latest=True
        ).values_list("market_id", flat=True).distinct()
        queryset = queryset.filter(id__in=markets_with_forecasts)
    
    if search:
        queryset = queryset.filter(
            Q(symbol__icontains=search) | Q(name__icontains=search)
        )
    
    queryset = queryset.order_by("-is_featured", "symbol")
    
    total_count = queryset.count()
    
    start = (page - 1) * page_size
    end = start + page_size
    markets = queryset[start:end]
    
    serializer = MarketListSerializer(markets, many=True)
    
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


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_market(request, symbol: str):
    """Get single market by symbol."""
    try:
        market = Market.objects.get(symbol=symbol, status="active")
    except Market.DoesNotExist:
        return Response({"error": f"Market {symbol} not found"}, status=404)
    
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    if allowed_market_ids is not None and market.id not in allowed_market_ids:
        return Response(
            {"error": "Upgrade to access this market", "upgrade_required": True},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = MarketListSerializer(market)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_featured_markets(request):
    """Get all featured markets."""
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    queryset = Market.objects.filter(
        status="active",
        is_featured=True,
    )
    
    if allowed_market_ids is not None:
        if len(allowed_market_ids) == 0:
            return Response([])
        queryset = queryset.filter(id__in=allowed_market_ids)
    
    queryset = queryset.order_by("symbol")
    
    serializer = MarketListSerializer(queryset, many=True)
    return Response(serializer.data)