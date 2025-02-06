from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, ChatSession, ChatMessage, FileAttachment
    
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['name', 'age', 'location', 'preferred_location']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class FileAttachmentSerializer(serializers.ModelSerializer):
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = FileAttachment
        fields = ['id', 'file', 'file_type', 'file_size', 'description', 'uploaded_at', 'expires_at', 'is_expired']

class ChatMessageSerializer(serializers.ModelSerializer):
    file_attachments = FileAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'session', 'message', 'sender', 'message_type', 'created_at', 'file_attachments', 'is_read']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'session_id', 'chat_type', 'messages', 'created_at', 'updated_at']
