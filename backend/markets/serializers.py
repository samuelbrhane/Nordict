from rest_framework import serializers
from .models import Market


class MarketListSerializer(serializers.ModelSerializer):
    """Market list for selector."""
    
    class Meta:
        model = Market
        fields = ['symbol', 'name', 'is_featured']