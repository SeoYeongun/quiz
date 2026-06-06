from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from quiz.apps.quizzes.models import Question, Choice
from quiz.apps.quizzes.serializers import (
    QuestionSerializer,
    ChoiceSerializer,
)


class QuestionViewSet(viewsets.ModelViewSet):

    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ChoiceViewSet(viewsets.ModelViewSet):

    queryset = Choice.objects.all()
    serializer_class = ChoiceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()