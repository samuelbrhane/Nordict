from django.contrib import admin
from .models import ContactSubmission


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'email',
        'topic',
        'status',
        'created_at',
    ]
    list_filter = ['status', 'topic', 'created_at']
    search_fields = ['name', 'email', 'message']
    readonly_fields = [
        'name',
        'email',
        'user',
        'topic',
        'message',
        'ip_address',
        'user_agent',
        'created_at',
        'updated_at',
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        ('Submitter', {
            'fields': ('name', 'email', 'user')
        }),
        ('Message', {
            'fields': ('topic', 'message')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes')
        }),
        ('Metadata', {
            'fields': ('ip_address', 'user_agent', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        # Submissions should only come through the API
        return False