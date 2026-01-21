from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Avg, Count, Q
from datetime import timedelta
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import *
from .serializers import (
    ForecastSummarySerializer,
    ForecastChartSerializer,
)


# =============================================================================
# Helper Functions
# =============================================================================

def get_user_limits(user):
    """Get subscription limits for user."""
    subscription = getattr(user, 'subscription_data', None)
    if subscription:
        return {
            'max_markets': subscription.max_markets,
            'max_alerts': subscription.plan_limits.get('max_alerts'),
            'horizons': subscription.available_horizons,
            'plan': subscription.effective_plan,
        }
    return {
        'max_markets': 0,
        'max_alerts': 0,
        'horizons': [],
        'plan': 'free',
    }


def check_horizon_access(user, horizon):
    """Check if user has access to a horizon."""
    limits = get_user_limits(user)
    if horizon not in limits['horizons']:
        return False, Response(
            {'error': f'Upgrade to access {horizon} forecasts', 'upgrade_required': True},
            status=status.HTTP_403_FORBIDDEN
        )
    return True, None


def get_allowed_market_ids(user, limits):
    """Get list of market IDs user can access."""
    from markets.models import Market
    
    max_markets = limits['max_markets']
    
    if max_markets is None:
        # Unlimited
        return None
    
    if max_markets == 0:
        return []
    
    # Get top markets by featured first, then by id
    return list(
        Market.objects.filter(status='active')
        .order_by('-is_featured', 'id')[:max_markets]
        .values_list('id', flat=True)
    )
    
def get_time_ago(dt):
    """Convert datetime to human readable 'X ago' format."""
    if not dt:
        return "Never"
    
    now = timezone.now()
    diff = now - dt
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "Just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes}m ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours}h ago"
    else:
        days = int(seconds / 86400)
        return f"{days}d ago"


def get_time_until(dt):
    """Convert datetime to human readable 'in X' format."""
    if not dt:
        return "Unknown"
    
    now = timezone.now()
    diff = dt - now
    seconds = diff.total_seconds()
    
    if seconds <= 0:
        return "Soon"
    elif seconds < 60:
        return "< 1m"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"in {minutes}m"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"in {hours}h"
    else:
        days = int(seconds / 86400)
        return f"in {days}d"


def get_next_update_time(horizon: str):
    """Calculate next scheduled update time based on horizon."""
    now = timezone.now()
    
    if horizon == '24H':
        # Updates every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC
        current_hour = now.hour
        next_slot = ((current_hour // 6) + 1) * 6
        
        if next_slot >= 24:
            next_update = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        else:
            next_update = now.replace(hour=next_slot, minute=0, second=0, microsecond=0)
    
    elif horizon in ['30D', '12W', '12M']:
        # Updates daily at 00:10 UTC
        next_update = now.replace(hour=0, minute=10, second=0, microsecond=0)
        if now.hour > 0 or (now.hour == 0 and now.minute >= 10):
            next_update += timedelta(days=1)
    
    else:
        next_update = now + timedelta(hours=6)
    
    return next_update


def calculate_24h_change(market):
    """Calculate 24h price change percentage."""
    from markets.models import MarketData
    
    now = timezone.now()
    yesterday = now - timedelta(hours=24)
    
    current = MarketData.objects.filter(
        market=market,
        timeframe="1h",
    ).order_by("-timestamp").first()
    
    past = MarketData.objects.filter(
        market=market,
        timeframe="1h",
        timestamp__lte=yesterday,
    ).order_by("-timestamp").first()
    
    if current and past and past.close > 0:
        change = ((current.close - past.close) / past.close) * 100
        return round(float(change), 2)
    
    return 0.0


# =============================================================================
# Dashboard KPI Endpoint
# =============================================================================

@extend_schema(
    summary="Dashboard KPI",
    description="Get KPI data for dashboard tiles",
    parameters=[
        OpenApiParameter(
            name="horizon",
            description="Forecast horizon: 24H, 30D, 12W, 12M",
            required=False,
            type=str,
            default="24H",
        ),
    ],
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_kpi(request):
    """Get KPI data for dashboard tiles."""
    horizon = request.query_params.get("horizon", "24H")
    
    # Check horizon access
    allowed, error_response = check_horizon_access(request.user, horizon)
    if not allowed:
        return error_response
    
    # Get user limits
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    # Base query
    forecasts = Forecast.objects.filter(
        horizon=horizon,
        is_latest=True,
    )
    
    # Apply market limit
    if allowed_market_ids is not None:
        if len(allowed_market_ids) == 0:
            return Response({
                "total_markets": 0,
                "avg_confidence": 0,
                "up_count": 0,
                "down_count": 0,
                "neutral_count": 0,
                "last_updated": None,
                "last_updated_ago": "Never",
                "next_update": None,
                "next_update_in": "Unknown",
            })
        forecasts = forecasts.filter(market_id__in=allowed_market_ids)
    
    total_markets = forecasts.count()
    
    if total_markets == 0:
        return Response({
            "total_markets": 0,
            "avg_confidence": 0,
            "up_count": 0,
            "down_count": 0,
            "neutral_count": 0,
            "last_updated": None,
            "last_updated_ago": "Never",
            "next_update": None,
            "next_update_in": "Unknown",
        })
    
    stats = forecasts.aggregate(
        avg_confidence=Avg("confidence_score"),
        up_count=Count("id", filter=Q(direction="up")),
        down_count=Count("id", filter=Q(direction="down")),
        neutral_count=Count("id", filter=Q(direction="neutral")),
    )
    
    last_forecast = forecasts.order_by("-generated_at").first()
    last_updated = last_forecast.generated_at if last_forecast else None
    
    next_update = get_next_update_time(horizon)
    
    return Response({
        "total_markets": total_markets,
        "avg_confidence": round(stats["avg_confidence"] * 100, 1) if stats["avg_confidence"] else 0,
        "up_count": stats["up_count"] or 0,
        "down_count": stats["down_count"] or 0,
        "neutral_count": stats["neutral_count"] or 0,
        "last_updated": last_updated,
        "last_updated_ago": get_time_ago(last_updated),
        "next_update": next_update,
        "next_update_in": get_time_until(next_update),
    })
    
# =============================================================================
# Chart Endpoint
# =============================================================================

@extend_schema(
    summary="Forecast chart data",
    description="Get forecast data for chart display with all points",
    parameters=[
        OpenApiParameter(
            name="market",
            description="Market symbol (default: BTC-USD)",
            required=False,
            type=str,
            default="BTC-USD",
        ),
        OpenApiParameter(
            name="horizon",
            description="Forecast horizon: 24H, 30D, 12W, 12M",
            required=False,
            type=str,
            default="24H",
        ),
    ],
    responses={200: ForecastChartSerializer},
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def forecast_chart(request):
    """Get forecast data for chart display."""
    market_symbol = request.query_params.get("market", "BTC-USD")
    horizon = request.query_params.get("horizon", "24H")
    
    # Check horizon access
    allowed, error_response = check_horizon_access(request.user, horizon)
    if not allowed:
        return error_response
    
    # Check market access
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    forecast = Forecast.objects.filter(
        market__symbol=market_symbol,
        horizon=horizon,
        is_latest=True,
    ).select_related("market").prefetch_related("points").first()
    
    if not forecast:
        return Response(
            {"error": f"No forecast found for {market_symbol} {horizon}"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Check if market is allowed
    if allowed_market_ids is not None and forecast.market_id not in allowed_market_ids:
        return Response(
            {"error": "Upgrade to access this market", "upgrade_required": True},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = ForecastChartSerializer(forecast)
    return Response(serializer.data)


# =============================================================================
# Markets with Forecasts Endpoint (Grid/Table View)
# =============================================================================

@extend_schema(
    summary="List markets with forecasts",
    description="Get paginated list of markets with their forecast data for grid/table view",
    parameters=[
        OpenApiParameter(
            name="horizon",
            description="Forecast horizon: 24H, 30D, 12W, 12M",
            required=False,
            type=str,
            default="24H",
        ),
        OpenApiParameter(
            name="search",
            description="Search by symbol or name",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="category",
            description="Filter by category: all, favorites",
            required=False,
            type=str,
            default="all",
        ),
        OpenApiParameter(
            name="direction",
            description="Filter by signal direction: up, down, neutral",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="page",
            description="Page number",
            required=False,
            type=int,
            default=1,
        ),
        OpenApiParameter(
            name="page_size",
            description="Items per page (max 50)",
            required=False,
            type=int,
            default=12,
        ),
    ],
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_markets_with_forecasts(request):
    """Get paginated list of markets with their forecast data."""
    from markets.models import UserMarket
    
    horizon = request.query_params.get("horizon", "24H")
    search = request.query_params.get("search", "").strip()
    category = request.query_params.get("category", "all")
    direction = request.query_params.get("direction", "")
    page = int(request.query_params.get("page", 1))
    page_size = min(int(request.query_params.get("page_size", 12)), 50)
    
    # Check horizon access
    allowed, error_response = check_horizon_access(request.user, horizon)
    if not allowed:
        return error_response
    
    # Get user limits
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    # Base queryset
    forecasts = Forecast.objects.filter(
        horizon=horizon,
        is_latest=True,
        market__status="active",
    ).select_related("market")
    
    # Apply market limit
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
        forecasts = forecasts.filter(market_id__in=allowed_market_ids)
    
    # Search filter
    if search:
        forecasts = forecasts.filter(
            Q(market__symbol__icontains=search) | 
            Q(market__name__icontains=search)
        )
    
    # Category filter (favorites)
    if category == "favorites":
        favorite_market_ids = UserMarket.objects.filter(
            user=request.user,
            is_favorite=True,
        ).values_list("market_id", flat=True)
        forecasts = forecasts.filter(market_id__in=favorite_market_ids)
    
    # Direction filter
    if direction:
        forecasts = forecasts.filter(direction=direction)
    
    # Order by featured first, then confidence
    forecasts = forecasts.order_by("-market__is_featured", "-confidence_score")
    
    # Get total count
    total_count = forecasts.count()
    
    # Paginate
    start = (page - 1) * page_size
    end = start + page_size
    paginated_forecasts = forecasts[start:end]
    
    # Get user's favorites
    user_favorites = set(
        UserMarket.objects.filter(
            user=request.user,
            is_favorite=True,
        ).values_list("market__symbol", flat=True)
    )
    
    # Build response data
    results = []
    for forecast in paginated_forecasts:
        market = forecast.market
        change_24h = calculate_24h_change(market)
        
        results.append({
            "symbol": market.symbol,
            "name": market.name,
            "is_featured": market.is_featured,
            "is_favorite": market.symbol in user_favorites,
            "current_price": float(forecast.current_price),
            "price_formatted": f"${forecast.current_price:,.2f}",
            "change_24h": change_24h,
            "change_direction": "up" if change_24h >= 0 else "down",
            "forecast": {
                "direction": forecast.direction,
                "confidence": round(forecast.confidence_score * 100, 1),
                "predicted_low": float(forecast.predicted_low),
                "predicted_mid": float(forecast.predicted_mid),
                "predicted_high": float(forecast.predicted_high),
            },
        })
    
    # Calculate pagination info
    total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 0
    
    return Response({
        "results": results,
        "pagination": {
            "page": page,
            "page_size": page_size,
            "total_count": total_count,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_previous": page > 1,
        },
    })


# =============================================================================
# Toggle Favorite Endpoint
# =============================================================================

@extend_schema(
    summary="Toggle market favorite",
    description="Add or remove a market from user's favorites",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "symbol": {"type": "string", "example": "BTC-USD"},
            },
            "required": ["symbol"],
        }
    },
    tags=["Forecasts"],
)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    """Toggle a market as favorite for the current user."""
    from markets.models import Market, UserMarket
    
    symbol = request.data.get("symbol")
    
    if not symbol:
        return Response({"error": "symbol is required"}, status=400)
    
    try:
        market = Market.objects.get(symbol=symbol)
    except Market.DoesNotExist:
        return Response({"error": f"Market {symbol} not found"}, status=404)
    
    user_market, created = UserMarket.objects.get_or_create(
        user=request.user,
        market=market,
        defaults={"is_favorite": True},
    )
    
    if not created:
        user_market.is_favorite = not user_market.is_favorite
        user_market.save(update_fields=["is_favorite"])
    
    return Response({
        "symbol": symbol,
        "is_favorite": user_market.is_favorite,
    })


# =============================================================================
# Forecast by Market Endpoint
# =============================================================================

@extend_schema(
    summary="Get forecasts by market",
    description="Get all horizon forecasts for a specific market",
    parameters=[
        OpenApiParameter(
            name="market",
            description="Market symbol (required)",
            required=True,
            type=str,
        ),
    ],
    responses={200: ForecastSummarySerializer(many=True)},
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def forecast_by_market(request):
    """Get all horizon forecasts for a specific market."""
    market_symbol = request.query_params.get("market")
    
    if not market_symbol:
        return Response(
            {"error": "market parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get user limits
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    available_horizons = limits['horizons']
    
    # Check market access
    from markets.models import Market
    try:
        market = Market.objects.get(symbol=market_symbol)
    except Market.DoesNotExist:
        return Response(
            {"error": f"Market {market_symbol} not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if allowed_market_ids is not None and market.id not in allowed_market_ids:
        return Response(
            {"error": "Upgrade to access this market", "upgrade_required": True},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get forecasts only for allowed horizons
    forecasts = Forecast.objects.filter(
        market__symbol=market_symbol,
        is_latest=True,
        horizon__in=available_horizons,
    ).select_related("market").order_by("horizon")
    
    serializer = ForecastSummarySerializer(forecasts, many=True)
    return Response(serializer.data)

# =============================================================================
# List Forecasts Endpoint
# =============================================================================

@extend_schema(
    summary="List forecasts",
    description="Get paginated list of forecasts with optional filters",
    parameters=[
        OpenApiParameter(
            name="horizon",
            description="Filter by horizon: 24H, 30D, 12W, 12M",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="market",
            description="Filter by market symbol",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="direction",
            description="Filter by direction: up, down, neutral",
            required=False,
            type=str,
        ),
        OpenApiParameter(
            name="page",
            description="Page number",
            required=False,
            type=int,
            default=1,
        ),
        OpenApiParameter(
            name="page_size",
            description="Items per page (max 50)",
            required=False,
            type=int,
            default=20,
        ),
    ],
    responses={200: ForecastSummarySerializer(many=True)},
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_forecasts(request):
    """Get paginated list of forecasts with optional filters."""
    horizon = request.query_params.get("horizon")
    market = request.query_params.get("market")
    direction = request.query_params.get("direction")
    page = int(request.query_params.get("page", 1))
    page_size = min(int(request.query_params.get("page_size", 20)), 50)
    
    # Get user limits
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    available_horizons = limits['horizons']
    
    # Base queryset
    queryset = Forecast.objects.filter(is_latest=True)
    
    # Apply horizon filter
    if horizon:
        if horizon not in available_horizons:
            return Response(
                {"error": f"Upgrade to access {horizon} forecasts", "upgrade_required": True},
                status=status.HTTP_403_FORBIDDEN
            )
        queryset = queryset.filter(horizon=horizon)
    else:
        queryset = queryset.filter(horizon__in=available_horizons)
    
    # Apply market limit
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
        queryset = queryset.filter(market_id__in=allowed_market_ids)
    
    # Apply market filter
    if market:
        queryset = queryset.filter(market__symbol=market)
    
    if direction:
        queryset = queryset.filter(direction=direction)
    
    # Order by confidence
    queryset = queryset.select_related("market").order_by("-confidence_score")
    
    # Get total count
    total_count = queryset.count()
    
    # Paginate
    start = (page - 1) * page_size
    end = start + page_size
    forecasts = queryset[start:end]
    
    # Serialize
    serializer = ForecastSummarySerializer(forecasts, many=True)
    
    # Calculate pagination
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
    summary="Forecast performance data",
    description="Get predicted vs actual data for performance chart",
    parameters=[
        OpenApiParameter(name="market", description="Market symbol", required=False, type=str, default="BTC-USD"),
        OpenApiParameter(name="horizon", description="Forecast horizon: 24H, 30D, 12W, 12M", required=False, type=str, default="24H"),
    ],
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def forecast_performance(request):
    """Get predicted vs actual data for performance chart."""
    market_symbol = request.query_params.get("market", "BTC-USD")
    horizon = request.query_params.get("horizon", "24H")
    
    # Check horizon access
    allowed, error_response = check_horizon_access(request.user, horizon)
    if not allowed:
        return error_response
    
    # Check market access
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    from markets.models import Market
    try:
        market = Market.objects.get(symbol=market_symbol)
    except Market.DoesNotExist:
        return Response(
            {"error": f"Market {market_symbol} not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if allowed_market_ids is not None and market.id not in allowed_market_ids:
        return Response(
            {"error": "Upgrade to access this market", "upgrade_required": True},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Time range and max points per horizon
    # 24H (hourly): 2 days = 48 points
    # 30D (daily): 30 days = 30 points
    # 12W (weekly): 6 months = ~26 points
    # 12M (monthly): 2 years = 24 points
    horizon_config = {
        "24H": {"days": 2, "max_points": 96},
        "30D": {"days": 30, "max_points": 60},
        "12W": {"days": 180, "max_points": 52},
        "12M": {"days": 730, "max_points": 48},  # 2 years
    }
    
    config = horizon_config.get(horizon, {"days": 2, "max_points": 96})
    cutoff = timezone.now() - timedelta(days=config["days"])
    
    points = ForecastPoint.objects.filter(
        forecast__market__symbol=market_symbol,
        forecast__horizon=horizon,
        timestamp__gte=cutoff,
        timestamp__lte=timezone.now(),
        actual_price__isnull=False,
    ).select_related("forecast").order_by("-timestamp")[:config["max_points"]]
    
    # Reverse to get chronological order after slicing
    points = list(points)[::-1]
    
    results = []
    for i, point in enumerate(points):
        predicted = float(point.predicted_price)
        actual = float(point.actual_price)
        error = actual - predicted
        error_percent = round((error / predicted) * 100, 2) if predicted > 0 else 0
        
        if horizon == "24H":
            label = point.timestamp.strftime("%H:%M")
        elif horizon == "30D":
            label = point.timestamp.strftime("%b %d")
        elif horizon == "12W":
            label = point.timestamp.strftime("W%W")
        else:
            label = point.timestamp.strftime("%b %y")
        
        results.append({
            "index": i,
            "timestamp": point.timestamp,
            "label": label,
            "predicted": predicted,
            "actual": actual,
            "error": round(error, 2),
            "errorPercent": error_percent,
        })
    
    # Calculate stats
    if results:
        errors = [abs(r["errorPercent"]) for r in results]
        avg_error = round(sum(errors) / len(errors), 2)
        
        correct_direction = 0
        for i in range(1, len(results)):
            actual_dir = results[i]["actual"] > results[i-1]["actual"]
            predicted_dir = results[i]["predicted"] > results[i-1]["predicted"]
            if actual_dir == predicted_dir:
                correct_direction += 1
        
        direction_accuracy = round((correct_direction / max(len(results) - 1, 1)) * 100)
    else:
        avg_error = 0
        direction_accuracy = 0
    
    return Response({
        "market": market_symbol,
        "horizon": horizon,
        "points": results,
        "stats": {
            "avgError": avg_error,
            "directionAccuracy": direction_accuracy,
            "totalPoints": len(results),
        },
    })
    

@extend_schema(
    summary="Top forecast signals",
    description="Get top forecasts ranked by confidence for dashboard",
    parameters=[
        OpenApiParameter(name="horizon", description="Forecast horizon: 24H, 30D, 12W, 12M", required=False, type=str, default="24H"),
        OpenApiParameter(name="limit", description="Number of signals to return (max 20)", required=False, type=int, default=5),
    ],
    tags=["Forecasts"],
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def top_signals(request):
    """Get top forecast signals ranked by confidence."""
    horizon = request.query_params.get("horizon", "24H")
    limit = min(int(request.query_params.get("limit", 5)), 20)
    
    # Check horizon access
    allowed, error_response = check_horizon_access(request.user, horizon)
    if not allowed:
        return error_response
    
    # Get user limits
    limits = get_user_limits(request.user)
    allowed_market_ids = get_allowed_market_ids(request.user, limits)
    
    # Base query
    forecasts = Forecast.objects.filter(
        horizon=horizon,
        is_latest=True,
        market__status="active",
    ).select_related("market")
    
    # Apply market limit
    if allowed_market_ids is not None:
        if len(allowed_market_ids) == 0:
            return Response({
                "horizon": horizon,
                "signals": [],
            })
        forecasts = forecasts.filter(market_id__in=allowed_market_ids)
    
    forecasts = forecasts.order_by("-confidence_score")[:limit]
    
    results = []
    for forecast in forecasts:
        current = float(forecast.current_price)
        predicted = float(forecast.predicted_mid)
        expected_move = ((predicted - current) / current) * 100 if current > 0 else 0
        
        if expected_move >= 0:
            expected_move_str = f"+{expected_move:.1f}%"
        else:
            expected_move_str = f"{expected_move:.1f}%"
        
        updated_ago = get_time_ago(forecast.generated_at)
        
        results.append({
            "symbol": forecast.market.symbol,
            "name": forecast.market.name,
            "horizon": horizon,
            "signal": forecast.direction,
            "confidence": round(forecast.confidence_score * 100, 1),
            "expected_move": expected_move_str,
            "expected_move_value": round(expected_move, 2),
            "updated_at": forecast.generated_at,
            "updated_ago": updated_ago,
        })
    
    return Response({
        "horizon": horizon,
        "signals": results,
    })
    
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def model_info(request):
    """Get production model info for a horizon."""
    horizon = request.query_params.get('horizon', '24H')
    
    model = MLModel.objects.filter(
        horizon=horizon,
        status=MLModel.Status.PRODUCTION
    ).first()
    
    if not model:
        return Response({'error': 'No production model found'}, status=404)
    
    return Response({
        'id': model.id,
        'name': model.name,
        'version': model.version,
        'horizon': model.horizon,
        'status': model.status,
        'mae': model.mae,
        'rmse': model.rmse,
        'mape': model.mape,
        'r2': model.r2,
        'median_ae': model.median_ae,
        'max_error': model.max_error,
        'bias': model.bias,
        'correlation': model.correlation,
        'directional_accuracy': model.directional_accuracy,
        'training_data_start': model.training_data_start.isoformat() if model.training_data_start else None,
        'training_data_end': model.training_data_end.isoformat() if model.training_data_end else None,
        'created_at': model.created_at.isoformat(),
        'artifact_path': model.artifact_path,
    })
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def backtest_runs(request):
    """Get recent backtest runs for a horizon with pagination."""
    horizon = request.query_params.get('horizon', '24H')
    page = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    
    queryset = BacktestRun.objects.filter(
        horizon=horizon
    ).select_related('model', 'market').order_by('-run_at')
    
    total = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    runs = queryset[start:end]
    
    return Response({
        'total': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size,
        'results': [{
            'id': run.id,
            'market': run.market.symbol,
            'horizon': run.horizon,
            'model_version': run.model.version,
            'test_start': run.test_start.isoformat(),
            'test_end': run.test_end.isoformat(),
            'mae': run.mae,
            'rmse': run.rmse,
            'mape': run.mape,
            'directional_accuracy': run.directional_accuracy,
            'total_predictions': run.total_predictions,
            'correct_directions': run.correct_directions,
            'run_at': run.run_at.isoformat(),
        } for run in runs]
    })