from rest_framework import serializers
from .models import Market


class MarketListSerializer(serializers.ModelSerializer):
    """Market list for selector."""
    
    class Meta:
        model = Market
        fields = ['id', 'symbol', 'name', 'category', 'is_featured']