from rest_framework import serializers
from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    author_name = serializers.CharField(
        required=False, allow_blank=True, max_length=50, write_only=True
    )
    like_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "text", "author", "author_name", "created_at", "like_count", "liked"]
        read_only_fields = ["author", "created_at"]

    def get_author(self, obj):
        if obj.author_id:
            return obj.author.username
        return obj.author_name or "익명"
    
    def get_liked(self, obj):
        request = self.context.get("request")

        if request is None or request.user.is_anonymous:
            return False

        return obj.likes.filter(id=request.user.id).exists()
    
    def get_like_count(self, obj):
        return obj.likes.count()