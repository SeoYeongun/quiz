from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Question, QuestionAttempt
from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    QuestionAttemptSerializer
)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('-id')
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]
    authentication_classes = []


class SubmitAnswerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        question = Question.objects.get(pk=pk)

        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        selected = serializer.validated_data['selected_answer']
        is_correct = (question.correct_answer == selected)

        attempt = QuestionAttempt.objects.create(
            user=request.user if request.user.is_authenticated else None,
            question=question,
            selected_answer=selected,
            is_correct=is_correct
        )

        return Response(QuestionAttemptSerializer(attempt).data)