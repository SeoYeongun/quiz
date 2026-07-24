from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .permissions import IsOwnerOrReadOnly
from .models import Question, QuestionAttempt, Report
from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    QuestionAttemptSerializer,
    ReportSerializer,
)
from quiz.apps.comments.models import Comment
from quiz.apps.comments.serializers import CommentSerializer
from quiz.apps.likes.models import Like


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by("-id")
    serializer_class = QuestionSerializer

    @action(detail=False, methods=["get"])
    def shorts(self, request):
        queryset = Question.objects.all().order_by("-created_at")

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        return Response(serializer.data)
    
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

    #-----------------------------
    # 게시글 생성 시 요청 데이터 출력
    #-----------------------------
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        print(request.data)

        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data)

    #-----------------------------
    # Serializer Context
    #-----------------------------
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    
    #-----------------------------
    # 좋아요 기능
    #-----------------------------
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
    # 정답 제출
    # -----------------------------
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated]
    )
    def answer(self, request, pk=None):

        question = self.get_object()

        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        selected = serializer.validated_data["selected_answer"]

        is_correct = (
            question.correct_answer == selected
        )


        # 본인이 만든 문제인지 확인
        is_owner = (
            question.user == request.user
        )


        # 본인 문제는 랭킹 기록 제외
        if is_owner:

            return Response(
                {
                    "question": question.id,
                    "selected_answer": selected,
                    "is_correct": is_correct,
                    "ranking_saved": False,
                    "message": "본인이 만든 문제는 랭킹에 반영되지 않습니다."
                },
                status=status.HTTP_200_OK
            )


        # 이미 푼 문제인지 확인
        existing_attempt = QuestionAttempt.objects.filter(
            user=request.user,
            question=question
        ).first()


        # 최초 풀이만 저장
        if existing_attempt is None:

            attempt = QuestionAttempt.objects.create(
                user=request.user,
                question=question,
                selected_answer=selected,
                is_correct=is_correct,
            )

        else:
            attempt = existing_attempt


        # 현재 제출 결과 반환
        return Response(
            {
                "id": attempt.id,
                "question": question.id,
                "selected_answer": selected,
                "is_correct": is_correct,
                "ranking_saved": existing_attempt is None,
            },
            status=status.HTTP_200_OK
        )

    # -----------------------------
    # 댓글 조회 / 작성
    # -----------------------------
    @action(detail=True, methods=["get", "post", "delete"])
    def comments(self, request, pk=None):

        question = self.get_object()

        # 댓글 목록
        if request.method == "GET":
            comments = Comment.objects.filter(question=question).order_by("-created_at")
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)

        # 댓글 작성
        if request.method == "POST":
            serializer = CommentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            comment = serializer.save(author=request.user, question=question)

            return Response(CommentSerializer(comment).data, status=201)

        # 댓글 삭제
        if request.method == "DELETE":
            comment_id = request.data.get("comment_id")

            try:
                comment = Comment.objects.get(id=comment_id, question=question)

                # 본인만 삭제 가능
                if comment.author != request.user:
                    return Response({"error": "권한 없음"}, status=403)

                comment.delete()
                return Response({"success": True})

            except Comment.DoesNotExist:
                return Response({"error": "댓글 없음"}, status=404)
            

    # -----------------------------
    # 신고 기능
    # -----------------------------
    @action(detail=True, methods=["POST"])
    def report(self, request, pk=None):

        question = self.get_object()

        if Report.objects.filter(
            user=request.user,
            question=question
        ).exists():

            return Response(
                {"detail": "이미 신고한 게시글입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ReportSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(
                user=request.user,
                question=question
            )

            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    
    #-----------------------------
    # 내가 작성한 문제 조회
    #-----------------------------
    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def my_questions(self, request):
        questions = Question.objects.filter(
            user=request.user
        ).order_by("-created_at")

        serializer = self.get_serializer(questions, many=True)
        return Response(serializer.data)

