from rest_framework import serializers
from .models import Question, QuestionAttempt
from quiz.apps.likes.models import Like


class QuestionSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    class Meta:
        model = Question
        fields = [
            'id',
            'title',
            'question_text',
            'choice1',
            'choice2',
            'choice3',
            'choice4',
            'correct_answer',
            'created_at',
            "like_count",
        ]
    def get_like_count(self, obj):
        return Like.objects.filter(quiz=obj).count()

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
