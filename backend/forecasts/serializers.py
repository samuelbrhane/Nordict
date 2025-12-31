# forecasts/serializers.py

from rest_framework import serializers
from .models import Forecast, ForecastPoint


class ForecastPointSerializer(serializers.ModelSerializer):
    """Individual forecast point for chart."""
    
    class Meta:
        model = ForecastPoint
        fields = [
            'step',
            'timestamp',
            'predicted_price',
            'confidence_low',
            'confidence_high',
            'confidence_score',
            'actual_price',
        ]


class ForecastChartSerializer(serializers.ModelSerializer):
    """Full forecast data for chart display."""
    
    market_symbol = serializers.CharField(source='market.symbol')
    market_name = serializers.CharField(source='market.name')
    points = ForecastPointSerializer(many=True, read_only=True)
    
    # Calculate range for display
    price_range = serializers.SerializerMethodField()
    change_percent = serializers.SerializerMethodField()
    
    class Meta:
        model = Forecast
        fields = [
            'id',
            'market_symbol',
            'market_name',
            'horizon',
            'direction',
            'confidence_score',
            'current_price',
            'predicted_low',
            'predicted_mid',
            'predicted_high',
            'price_range',
            'change_percent',
            'generated_at',
            'valid_from',
            'valid_until',
            'points',
        ]
    
    def get_price_range(self, obj):
        """Format price range as string."""
        return f"${obj.predicted_low:,.0f} - ${obj.predicted_high:,.0f}"
    
    def get_change_percent(self, obj):
        """Calculate predicted change percentage."""
        if obj.current_price and obj.predicted_mid:
            change = ((obj.predicted_mid - obj.current_price) / obj.current_price) * 100
            return round(change, 2)
        return 0


class ForecastSummarySerializer(serializers.ModelSerializer):
    """Forecast summary for list views."""
    
    market_symbol = serializers.CharField(source='market.symbol')
    market_name = serializers.CharField(source='market.name')
    
    class Meta:
        model = Forecast
        fields = [
            'id',
            'market_symbol',
            'market_name',
            'horizon',
            'direction',
            'confidence_score',
            'current_price',
            'predicted_mid',
            'predicted_low',
            'predicted_high',
            'generated_at',
            'valid_until',
        ]


class DashboardKpiSerializer(serializers.Serializer):
    """KPI tiles data for dashboard."""
    
    total_markets = serializers.IntegerField()
    avg_confidence = serializers.FloatField()
    up_count = serializers.IntegerField()
    down_count = serializers.IntegerField()
    neutral_count = serializers.IntegerField()
    last_updated = serializers.DateTimeField()
    last_updated_ago = serializers.CharField()
    next_update = serializers.DateTimeField()
    next_update_in = serializers.CharField()