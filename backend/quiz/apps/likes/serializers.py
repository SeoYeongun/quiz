from rest_framework import serializers
from quiz.apps.likes.models import Like
class LikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Like
        fields = ('id', 'user', 'quiz', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def create(self, validated_data):
        user = self.context['request'].user
        like = Like.objects.get(user=user, **validated_data)
        return like