from django.db import models

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView

from drf_spectacular.utils import extend_schema

from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer, ContactSubmissionAdminSerializer


def get_client_ip(request):
    """Extract client IP from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')


class ContactSubmitView(APIView):
    """Submit a contact form (public endpoint)."""
    
    permission_classes = [AllowAny]
    serializer_class = ContactSubmissionSerializer
    
    @extend_schema(
        tags=['Contact'],
        summary="Submit contact form",
        description="Public endpoint to submit a contact form message.",
        request=ContactSubmissionSerializer,
        responses={201: ContactSubmissionSerializer}
    )
    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Build extra fields
        extra_fields = {
            'ip_address': get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', '')[:500],
        }
        
        # Link to user if authenticated
        if request.user.is_authenticated:
            extra_fields['user'] = request.user
        
        # Save submission
        submission = serializer.save(**extra_fields)
        
        # TODO: Send notification email to admin
        # send_contact_notification_email(submission)
        
        # TODO: Send confirmation email to user
        # send_contact_confirmation_email(submission)
        
        return Response(
            {
                'message': 'Thank you for your message. We\'ll get back to you within 24 hours.',
                'submission': ContactSubmissionSerializer(submission).data
            },
            status=status.HTTP_201_CREATED
        )


# Admin views (optional - for managing submissions)

class ContactSubmissionListView(ListAPIView):
    """List all contact submissions (admin only)."""
    
    permission_classes = [IsAdminUser]
    serializer_class = ContactSubmissionAdminSerializer
    
    @extend_schema(tags=['Contact Admin'], summary="List all contact submissions")
    def get_queryset(self):
        queryset = ContactSubmission.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by topic
        topic = self.request.query_params.get('topic')
        if topic:
            queryset = queryset.filter(topic=topic)
        
        # Search by email or name
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(email__icontains=search) |
                models.Q(name__icontains=search)
            )
        
        return queryset


class ContactSubmissionDetailView(RetrieveUpdateAPIView):
    """View/update a contact submission (admin only)."""
    
    permission_classes = [IsAdminUser]
    serializer_class = ContactSubmissionAdminSerializer
    queryset = ContactSubmission.objects.all()
    
    @extend_schema(tags=['Contact Admin'], summary="Get contact submission details")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)
    
    @extend_schema(tags=['Contact Admin'], summary="Update contact submission status/notes")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)
    
    @extend_schema(tags=['Contact Admin'], summary="Update contact submission")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)