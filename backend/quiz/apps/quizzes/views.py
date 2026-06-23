from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .permissions import IsOwnerOrReadOnly
from .models import Question, QuestionAttempt
from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    QuestionAttemptSerializer,
)
from quiz.apps.comments.models import Comment
from quiz.apps.comments.serializers import CommentSerializer
from quiz.apps.likes.models import Like


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by("-id")
    serializer_class = QuestionSerializer

    # -----------------------------
    # 권한 제어 (핵심)
    # -----------------------------
    # 권한 제어를 위해 get_permissions 메서드를 오버라이드합니다. 이 메서드는 요청된 액션에 따라 적절한 권한 클래스를 반환합니다.
    def get_permissions(self):

        if self.action == "answer":
            return [AllowAny()]

        if self.action == "comments" and self.request.method == "POST":
            return [IsAuthenticated()]

        # 게시글 작성
        if self.action == "create":
            return [IsAuthenticated()]

        # 게시글 수정/삭제
        if self.action in ["update", "partial_update", "destroy"]:
            return [IsOwnerOrReadOnly()]

        return [AllowAny()]
    # 게시글 작성 시 작성자를 자동으로 설정하기 위해 perform_create 메서드를 오버라이드합니다. 이 메서드는 게시글이 생성될 때 호출되며, 현재 요청한 사용자를 작성자로 설정합니다.
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=["get", "post"], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        question = self.get_object()
        user = request.user

        like = Like.objects.filter(user=user, quiz=question).first()

        # 이미 좋아요 있음 → 삭제 (취소)
        if like:
            like.delete()
            return Response({"liked": False})

        # 없으면 생성 (좋아요)
        Like.objects.create(user=user, quiz=question)
        return Response({"liked": True})
    
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