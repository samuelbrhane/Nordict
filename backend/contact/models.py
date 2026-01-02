from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ContactSubmission(models.Model):
    """Store contact form submissions."""
    
    class Topic(models.TextChoices):
        GENERAL = 'general', 'General inquiry'
        SALES = 'sales', 'Pricing & plans'
        SUPPORT = 'support', 'Technical support'
        FEEDBACK = 'feedback', 'Feedback & suggestions'
        PARTNERSHIP = 'partnership', 'Partnership opportunity'
        OTHER = 'other', 'Other'
    
    class Status(models.TextChoices):
        NEW = 'new', 'New'
        IN_PROGRESS = 'in_progress', 'In Progress'
        RESOLVED = 'resolved', 'Resolved'
        CLOSED = 'closed', 'Closed'
    
    # Submitter info
    name = models.CharField(max_length=100)
    email = models.EmailField()
    
    # Optional link to registered user
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='contact_submissions'
    )
    
    # Message details
    topic = models.CharField(
        max_length=20,
        choices=Topic.choices,
        default=Topic.GENERAL
    )
    message = models.TextField()
    
    # Status tracking
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW
    )
    
    # Admin notes (internal use)
    admin_notes = models.TextField(blank=True, null=True)
    
    # Metadata
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'contact_submissions'
        verbose_name = 'contact submission'
        verbose_name_plural = 'contact submissions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.get_topic_display()} ({self.created_at.strftime('%Y-%m-%d')})"