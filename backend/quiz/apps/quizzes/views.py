from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.permissions import AllowAny


from quiz.apps.quizzes.models import Question, Choice, Quiz
from quiz.apps.quizzes.serializers import (
    QuestionSerializer,
    ChoiceSerializer,
    QuizSerializer
)

class QuizViewSet(viewsets.ModelViewSet):

    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class QuestionViewSet(viewsets.ModelViewSet):

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChoiceViewSet(viewsets.ModelViewSet):

    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        serializer.save()