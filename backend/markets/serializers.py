from rest_framework import serializers
from .models import Market, MarketData, UserMarket


class MarketSerializer(serializers.ModelSerializer):
    """Serializer for Market model."""
    
    class Meta:
        model = Market
        fields = [
            'id',
            'symbol',
            'name',
            'category',
            'status',
            'description',
            'is_featured',
            'last_data_fetch',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'last_data_fetch']


class MarketDataSerializer(serializers.ModelSerializer):
    """Serializer for MarketData model."""
    
    class Meta:
        model = MarketData
        fields = [
            'timestamp',
            'open',
            'high',
            'low',
            'close',
            'volume',
            'timeframe',
        ]


class UserMarketSerializer(serializers.ModelSerializer):
    """Serializer for UserMarket (tracked markets)."""
    
    market = MarketSerializer(read_only=True)
    symbol = serializers.CharField(write_only=True)
    
    class Meta:
        model = UserMarket
        fields = [
            'id',
            'market',
            'symbol',
            'is_favorite',
            'notes',
            'added_at',
        ]
        read_only_fields = ['id', 'market', 'added_at']
    
    def create(self, validated_data):
        symbol = validated_data.pop('symbol')
        user = self.context['request'].user
        
        try:
            market = Market.objects.get(symbol=symbol)
        except Market.DoesNotExist:
            raise serializers.ValidationError({
                'symbol': f"Market '{symbol}' not found."
            })
        
        # Check user's plan limit
        if user.max_markets is not None:
            current_count = UserMarket.objects.filter(user=user).count()
            if current_count >= user.max_markets:
                raise serializers.ValidationError({
                    'limit': f"You can only track {user.max_markets} markets on your plan."
                })
        
        user_market, created = UserMarket.objects.get_or_create(
            user=user,
            market=market,
            defaults=validated_data,
        )
        
        if not created:
            raise serializers.ValidationError({
                'symbol': "You are already tracking this market."
            })
        
        return user_market