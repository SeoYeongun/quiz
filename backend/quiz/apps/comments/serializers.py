from rest_framework import serializers
from .models import Comment
class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "text", "author", "created_at"]
        read_only_fields = ["author", "created_at"]