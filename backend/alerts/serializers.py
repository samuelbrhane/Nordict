from rest_framework import serializers
from .models import Alert, AlertHistory


class AlertSerializer(serializers.ModelSerializer):
    market_symbol = serializers.CharField(source='market.symbol', read_only=True)
    market_name = serializers.CharField(source='market.name', read_only=True)
    
    class Meta:
        model = Alert
        fields = [
            'id',
            'market',
            'market_symbol',
            'market_name',
            'horizon',
            'condition_type',
            'condition_value',
            'status',
            'is_recurring',
            'last_triggered_at',
            'trigger_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'last_triggered_at', 'trigger_count', 'created_at', 'updated_at']


class AlertCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = [
            'market',
            'horizon',
            'condition_type',
            'condition_value',
            'is_recurring',
        ]


class AlertHistorySerializer(serializers.ModelSerializer):
    market_symbol = serializers.CharField(source='alert.market.symbol', read_only=True)
    
    class Meta:
        model = AlertHistory
        fields = [
            'id',
            'alert',
            'market_symbol',
            'triggered_at',
            'condition_met',
            'forecast_value',
            'email_sent',
            'push_sent',
        ]