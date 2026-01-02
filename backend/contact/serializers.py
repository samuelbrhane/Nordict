from rest_framework import serializers
from .models import ContactSubmission


class ContactSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for creating contact submissions."""
    
    class Meta:
        model = ContactSubmission
        fields = [
            'id',
            'name',
            'email',
            'topic',
            'message',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
    
    def validate_name(self, value):
        return value.strip()
    
    def validate_email(self, value):
        return value.lower().strip()
    
    def validate_message(self, value):
        value = value.strip()
        if len(value) < 10:
            raise serializers.ValidationError(
                "Message must be at least 10 characters long."
            )
        return value
    
    def validate_topic(self, value):
        valid_topics = [choice[0] for choice in ContactSubmission.Topic.choices]
        if value not in valid_topics:
            raise serializers.ValidationError(
                f"Invalid topic. Must be one of: {', '.join(valid_topics)}"
            )
        return value


class ContactSubmissionAdminSerializer(serializers.ModelSerializer):
    """Serializer for admin viewing/updating contact submissions."""
    
    topic_display = serializers.CharField(source='get_topic_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ContactSubmission
        fields = [
            'id',
            'name',
            'email',
            'user',
            'user_email',
            'topic',
            'topic_display',
            'message',
            'status',
            'status_display',
            'admin_notes',
            'ip_address',
            'user_agent',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id', 'name', 'email', 'user', 'user_email',
            'topic', 'topic_display', 'message',
            'ip_address', 'user_agent', 'created_at', 'updated_at'
        ]