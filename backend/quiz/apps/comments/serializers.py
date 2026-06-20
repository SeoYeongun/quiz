from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    author_name = serializers.CharField(
        required=False, allow_blank=True, max_length=50, write_only=True
    )

    class Meta:
        model = Comment
        fields = ["id", "text", "author", "author_name", "created_at"]
        read_only_fields = ["author", "created_at"]

    def get_author(self, obj):
        if obj.author_id:
            return obj.author.username
        return obj.author_name or "익명"