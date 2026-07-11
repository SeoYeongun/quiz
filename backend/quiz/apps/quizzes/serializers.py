from rest_framework import serializers
from .models import Question, QuestionAttempt, Report
from quiz.apps.likes.models import Like



class QuestionSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    user = serializers.ReadOnlyField(source="user.id")
    class Meta:
        model = Question
        fields = [
            "id",
            "user",
            "title",
            "question_text",
            "image",
            "video",
            "choice1",
            "choice2",
            "choice3",
            "choice4",
            "correct_answer",
            "created_at",
            "like_count",
            "liked",
            "is_owner",
        ]

    def get_is_owner(self, obj):
        request = self.context.get("request")

        if request is None or request.user.is_anonymous:
            return False

        return obj.user == request.user 
    

    def get_like_count(self, obj):
        return Like.objects.filter(quiz=obj).count()


    def get_liked(self, obj):
        request = self.context.get("request")

        if request is None or request.user.is_anonymous:
            return False

        return Like.objects.filter(
            quiz=obj,
            user=request.user
        ).exists()

class AnswerSerializer(serializers.Serializer):
    selected_answer = serializers.IntegerField()


class QuestionAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionAttempt
        fields = [
            'id',
            'user',
            'question',
            'selected_answer',
            'is_correct',
            'created_at',
        ]
        read_only_fields = ['user', 'is_correct', 'created_at']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = "__all__"
        read_only_fields = ("user", "question")