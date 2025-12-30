from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from .models import Alert, AlertHistory
from .serializers import AlertSerializer, AlertHistorySerializer


class AlertListCreateView(generics.ListCreateAPIView):
    """List and create alerts."""
    
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user).select_related('market')
    
    @extend_schema(tags=['Alerts'], summary="List user alerts")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Alerts'], summary="Create new alert")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class AlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete an alert."""
    
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Alert.objects.filter(user=self.request.user)
    
    @extend_schema(tags=['Alerts'], summary="Get alert details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Alerts'], summary="Update alert")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)
    
    @extend_schema(tags=['Alerts'], summary="Partial update alert")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @extend_schema(tags=['Alerts'], summary="Delete alert")
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class AlertHistoryView(generics.ListAPIView):
    """Get alert trigger history."""
    
    serializer_class = AlertHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        alert_id = self.kwargs['pk']
        alert = get_object_or_404(Alert, pk=alert_id, user=self.request.user)
        return AlertHistory.objects.filter(alert=alert)[:50]
    
    @extend_schema(tags=['Alerts'], summary="Get alert history")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)