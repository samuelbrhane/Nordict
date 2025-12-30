from rest_framework import serializers
from .models import Alert, AlertHistory


class AlertSerializer(serializers.ModelSerializer):
    """Serializer for Alert model."""
    
    market_symbol = serializers.CharField(source='market.symbol', read_only=True)
    symbol = serializers.CharField(write_only=True)
    
    class Meta:
        model = Alert
        fields = [
            'id',
            'name',
            'market_symbol',
            'symbol',
            'horizon',
            'trigger_type',
            'trigger_value',
            'channel',
            'webhook_url',
            'status',
            'cooldown_hours',
            'max_alerts_per_day',
            'last_triggered_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'market_symbol',
            'last_triggered_at',
            'created_at',
            'updated_at',
        ]
    
    def validate(self, attrs):
        user = self.context['request'].user
        
        # Check alert limit on create
        if not self.instance:  # Creating new alert
            if user.max_alerts is not None:
                current_count = Alert.objects.filter(user=user).count()
                if current_count >= user.max_alerts:
                    raise serializers.ValidationError({
                        'limit': f"You can only create {user.max_alerts} alerts on your plan."
                    })
        
        # Validate webhook URL if channel is webhook
        if attrs.get('channel') == 'webhook' and not attrs.get('webhook_url'):
            raise serializers.ValidationError({
                'webhook_url': "Webhook URL is required for webhook channel."
            })
        
        return attrs
    
    def create(self, validated_data):
        from markets.models import Market
        
        symbol = validated_data.pop('symbol')
        user = self.context['request'].user
        
        try:
            market = Market.objects.get(symbol=symbol)
        except Market.DoesNotExist:
            raise serializers.ValidationError({
                'symbol': f"Market '{symbol}' not found."
            })
        
        return Alert.objects.create(
            user=user,
            market=market,
            **validated_data
        )


class AlertHistorySerializer(serializers.ModelSerializer):
    """Serializer for AlertHistory."""
    
    class Meta:
        model = AlertHistory
        fields = [
            'id',
            'triggered_at',
            'trigger_value_at_time',
            'delivered',
            'delivered_at',
            'message',
        ]