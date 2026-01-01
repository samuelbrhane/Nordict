from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import Alert, AlertHistory
from .serializers import AlertSerializer, AlertCreateSerializer, AlertHistorySerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def alerts_list(request):
    """List user's alerts or create a new one."""
    
    if request.method == 'GET':
        alerts = Alert.objects.filter(user=request.user).select_related('market')
        
        # Optional filters
        market = request.query_params.get('market')
        status_filter = request.query_params.get('status')
        horizon = request.query_params.get('horizon')
        
        if market:
            alerts = alerts.filter(market__symbol=market)
        if status_filter:
            alerts = alerts.filter(status=status_filter)
        if horizon:
            alerts = alerts.filter(horizon=horizon)
        
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = AlertCreateSerializer(data=request.data)
        if serializer.is_valid():
            alert = serializer.save(user=request.user)
            return Response(
                AlertSerializer(alert).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def alert_detail(request, alert_id):
    """Get, update, or delete a specific alert."""
    
    try:
        alert = Alert.objects.select_related('market').get(
            id=alert_id,
            user=request.user
        )
    except Alert.DoesNotExist:
        return Response(
            {'error': 'Alert not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = AlertSerializer(alert)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        serializer = AlertSerializer(alert, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        alert.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_alert_status(request, alert_id):
    """Toggle alert between active and paused."""
    
    try:
        alert = Alert.objects.get(id=alert_id, user=request.user)
    except Alert.DoesNotExist:
        return Response(
            {'error': 'Alert not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    alert.status = Alert.Status.PAUSED if alert.status == Alert.Status.ACTIVE else Alert.Status.ACTIVE
    alert.save(update_fields=['status', 'updated_at'])
    
    return Response(AlertSerializer(alert).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def alert_history(request):
    """Get alert trigger history for current user."""
    
    history = AlertHistory.objects.filter(
        alert__user=request.user
    ).select_related('alert__market')
    
    # Optional filters
    alert_id = request.query_params.get('alert')
    limit = int(request.query_params.get('limit', 20))
    
    if alert_id:
        history = history.filter(alert_id=alert_id)
    
    history = history[:limit]
    
    serializer = AlertHistorySerializer(history, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_alert_count(request):
    """Get count of unread triggered alerts."""
    
    # Get alerts triggered after user last viewed (or last 24 hours if never viewed)
    last_viewed = request.user.last_alerts_viewed_at if hasattr(request.user, 'last_alerts_viewed_at') else None
    
    if last_viewed:
        count = AlertHistory.objects.filter(
            alert__user=request.user,
            triggered_at__gt=last_viewed
        ).count()
    else:
        # Show all from last 7 days as unread
        from datetime import timedelta
        week_ago = timezone.now() - timedelta(days=7)
        count = AlertHistory.objects.filter(
            alert__user=request.user,
            triggered_at__gt=week_ago
        ).count()
    
    return Response({'unread_count': count})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_alerts_viewed(request):
    """Mark all alerts as viewed."""
    
    # Update user's last viewed timestamp
    request.user.last_alerts_viewed_at = timezone.now()
    request.user.save(update_fields=['last_alerts_viewed_at'])
    
    return Response({'success': True})