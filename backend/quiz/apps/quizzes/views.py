from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Question, QuestionAttempt
from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    QuestionAttemptSerializer,
)
from quiz.apps.comments.models import Comment
from quiz.apps.comments.serializers import CommentSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by("-id")
    serializer_class = QuestionSerializer
    permission_classes = [AllowAny]

    # -----------------------------
    # 정답 제출
    # POST /api/quizzes/questions/<id>/answer/
    # -----------------------------
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def answer(self, request, pk=None):

        print("🔥 ANSWER API HIT")  # 디버깅용

        question = self.get_object()

        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        selected = serializer.validated_data["selected_answer"]

        print("SELECTED:", selected)
        print("CORRECT:", question.correct_answer)

        is_correct = question.correct_answer == selected

        attempt = QuestionAttempt.objects.create(
            user=request.user,
            question=question,
            selected_answer=selected,
            is_correct=is_correct,
        )

        return Response(
            QuestionAttemptSerializer(attempt).data,
            status=status.HTTP_200_OK,
        )

    # -----------------------------
    # 댓글 조회 / 작성
    # GET / POST /api/quizzes/questions/<id>/comments/
    # -----------------------------
    @action(detail=True, methods=["get", "post"], permission_classes=[AllowAny])
    def comments(self, request, pk=None):

        question = self.get_object()

        # GET
        if request.method == "GET":
            comments = Comment.objects.filter(question=question).order_by("-created_at")
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        # POST
        if not request.user.is_authenticated:
            return Response(
                {"detail": "로그인이 필요합니다."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(
            author=request.user,
            question=question,
        )

        return Response(
            CommentSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )