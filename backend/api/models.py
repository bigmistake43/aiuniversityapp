from django.db import models
from django.utils.timezone import now
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
import uuid


# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField(null=True, blank=True, default=18)
    location = models.CharField(null=True, blank=True, default="Los Angeles", max_length=200)
    preferred_location = models.CharField(null=True, blank=True, default="Los Angeles", max_length=200)

    def __str__(self):
        return f"{self.user.username}'s Profile"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


# SavedPrompt Model
class SavedPrompt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_prompts')
    messages = models.JSONField(default=list)
    tags = models.JSONField(default=list, blank=True)
    visibility = models.CharField(max_length=50, choices=[
        ('private', 'Private'),
        ('public', 'Public')
    ], default='private')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SavedPrompt for {self.user.username} at {self.created_at}"


# FileAttachment Model
class FileAttachment(models.Model):
    session = models.ForeignKey('ChatSession', on_delete=models.CASCADE, related_name='file_attachments')
    file = models.FileField(upload_to="chat_attachments/")
    file_type = models.CharField(max_length=50)
    file_size = models.PositiveIntegerField(null=True, blank=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"File Attachment ({self.file_type}) for Session {self.session.id}"

    def is_expired(self):
        return self.expires_at and now() > self.expires_at


# UniversityFactSheet Model
class UniversityFactSheet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='university_fact_sheets')
    university_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    priority = models.IntegerField(default=0)
    facts = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.university_name} Fact Sheet for {self.user.username}"


# ChatSession Model
class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    session_id = models.CharField(max_length=255, unique=True, default=uuid.uuid4)
    chat_type = models.CharField(max_length=100, choices=[
        ('university_finder', 'University Finder'),
        ('scholarship_finder', 'Scholarship Finder'),
        ('document_generator', 'Document Generator'),
        ('course_matching', 'Course Matching'),
        ('location_info', 'Location Info'),
        ('university_fac_sheet', 'University FactSheet'),
        ('general', 'General')
    ], default='general')
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('archived', 'Archived'),
        ('completed', 'Completed')
    ], default='active')
    metadata = models.JSONField(default=dict, blank=True)
    base_prompt = models.JSONField(default=list, blank=True)
    answered_questions = models.JSONField(default=list, blank=True)  # Store user answers
    current_question_index = models.IntegerField(default=0)  # Track current question
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session {self.session_id} ({self.chat_type}) for {self.user.username}"


# ChatMessage Model
class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    message = models.TextField()
    sender = models.CharField(max_length=50)
    message_type = models.CharField(max_length=50, choices=[
        ('text', 'Text'),
        ('image', 'Image'),
        ('video', 'Video'),
        ('file', 'File'),
        ('system', 'System'),
    ], default='text')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    file_attachments = models.ManyToManyField(FileAttachment, related_name='messages', blank=True)
    pre_generated_prompts = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"Message ({self.message_type}) from {self.sender} at {self.created_at}"
