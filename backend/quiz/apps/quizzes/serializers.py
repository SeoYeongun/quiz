from rest_framework import serializers
from .models import Question, QuestionAttempt, Report, ShortQuestion
from quiz.apps.likes.models import Like



class QuestionSerializer(serializers.ModelSerializer):
    author = serializers.CharField(
        source="user.username",
        read_only=True
    )
    like_count = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
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
            "video_url",

            "choice1",
            "choice2",
            "choice3",
            "choice4",

            "correct_answer",

            "author",
            "comment_count",
            "like_count",
            "liked",
            "is_owner",
            "created_at",
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
    
    def get_comment_count(self, obj):
        return obj.comments.count()

class ShortQuestionSerializer(serializers.ModelSerializer):

    title = serializers.CharField(source="question.title")
    question_text = serializers.CharField(source="question.question_text")

    image = serializers.ImageField(source="question.image")

    choice1 = serializers.CharField(source="question.choice1")
    choice2 = serializers.CharField(source="question.choice2")
    choice3 = serializers.CharField(source="question.choice3")
    choice4 = serializers.CharField(source="question.choice4")

    author = serializers.CharField(source="question.author.username")

    class Meta:
        model = ShortQuestion
        fields = [
            "id",
            "title",
            "question_text",
            "image",
            "choice1",
            "choice2",
            "choice3",
            "choice4",
            "author",
        ]

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