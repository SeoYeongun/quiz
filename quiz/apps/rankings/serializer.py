from rest_framework import serializers

from .models import Ranking


class RankingSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source="quiz.title", read_only=True)
    user_email = serializers.CharField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = Ranking
        fields = (
            "id",
            "quiz",
            "quiz_title",
            "user",
            "user_email",
            "user_name",
            "score",
            "correct_count",
            "total_questions",
            "submitted_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "quiz_title",
            "user_email",
            "user_name",
            "created_at",
            "updated_at",
        )