from rest_framework import serializers
from .models import MLModel, Forecast, ForecastPoint, BacktestRun


class MLModelSerializer(serializers.ModelSerializer):
    """Serializer for MLModel."""
    
    class Meta:
        model = MLModel
        fields = [
            'id',
            'name',
            'version',
            'status',
            'training_completed_at',
            'training_data_start',
            'training_data_end',
            'supports_hourly',
            'supports_daily',
            'supports_weekly',
            'supports_monthly',
            'mae',
            'rmse',
            'mape',
            'directional_accuracy',
            'description',
            'created_at',
        ]


class ForecastPointSerializer(serializers.ModelSerializer):
    """Serializer for ForecastPoint."""
    
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


class ForecastSerializer(serializers.ModelSerializer):
    """Serializer for Forecast."""
    
    points = ForecastPointSerializer(many=True, read_only=True)
    market_symbol = serializers.CharField(source='market.symbol', read_only=True)
    model_version = serializers.CharField(source='model.version', read_only=True)
    
    class Meta:
        model = Forecast
        fields = [
            'id',
            'market_symbol',
            'model_version',
            'horizon',
            'generated_at',
            'valid_from',
            'valid_until',
            'direction',
            'confidence_score',
            'probability_up',
            'probability_down',
            'current_price',
            'predicted_low',
            'predicted_mid',
            'predicted_high',
            'is_latest',
            'points',
        ]


class ForecastSummarySerializer(serializers.ModelSerializer):
    """Lightweight forecast serializer without points."""
    
    market_symbol = serializers.CharField(source='market.symbol', read_only=True)
    
    class Meta:
        model = Forecast
        fields = [
            'id',
            'market_symbol',
            'horizon',
            'generated_at',
            'direction',
            'confidence_score',
            'probability_up',
            'probability_down',
            'current_price',
            'predicted_mid',
            'is_latest',
        ]


class BacktestRunSerializer(serializers.ModelSerializer):
    """Serializer for BacktestRun."""
    
    market_symbol = serializers.CharField(source='market.symbol', read_only=True)
    model_version = serializers.CharField(source='model.version', read_only=True)
    
    class Meta:
        model = BacktestRun
        fields = [
            'id',
            'market_symbol',
            'model_version',
            'horizon',
            'test_start',
            'test_end',
            'mae',
            'rmse',
            'mape',
            'directional_accuracy',
            'calibration_score',
            'regime_metrics',
            'run_at',
        ]