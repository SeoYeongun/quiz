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

    # -----------------------------
    # 권한 제어 (핵심)
    # -----------------------------
    def get_permissions(self):
        if self.action == "answer":
            return [AllowAny()]
        if self.action == "comments" and self.request.method == "POST":
            return [IsAuthenticated()]
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    # -----------------------------
    # 정답 제출 (비로그인 허용)
    # -----------------------------
    @action(detail=True, methods=["post"], permission_classes=[AllowAny])
    def answer(self, request, pk=None):

        question = self.get_object()

        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        selected = serializer.validated_data["selected_answer"]
        is_correct = question.correct_answer == selected

        user = request.user if request.user.is_authenticated else None

        attempt = QuestionAttempt.objects.create(
            user=user,
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
    # -----------------------------
    @action(detail=True, methods=["get", "post"])
    def comments(self, request, pk=None):

        question = self.get_object()

        if request.method == "GET":
            comments = Comment.objects.filter(question=question).order_by("-created_at")
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        comment = serializer.save(author=request.user, question=question)

        return Response(
            CommentSerializer(comment).data,
            status=status.HTTP_201_CREATED,
        )