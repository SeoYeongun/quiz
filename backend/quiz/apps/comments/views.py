from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import CommentSerializer
from quiz.apps.quizzes.models import Question
from .models import Comment
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

# ---------------------------------
# 댓글 리스트 + 생성
# /api/quizzes/questions/<pk>/comments/
# ---------------------------------
class CommentListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        question_id = self.kwargs.get("pk")
        return Comment.objects.filter(question_id=question_id).order_by("-created_at")

    def perform_create(self, serializer):
        question_id = self.kwargs.get("pk")
        question = Question.objects.get(pk=question_id)

        serializer.save(
            author=self.request.user,
            question=question
        )

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)

        except Exception as e:
            print("COMMENT CREATE ERROR:", str(e))
            return Response(
                {"error": "댓글 생성 실패"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class CommentLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk, comment_pk):
        comment = get_object_or_404(
            Comment,
            pk=comment_pk,
            question_id=pk
        )

        liked = comment.likes.filter(pk=request.user.pk).exists()
        like_count = comment.likes.count()

        return Response({
            "liked": liked,
            "like_count": like_count
        })

    def post(self, request, pk, comment_pk):

        comment = get_object_or_404(
            Comment,
            pk=comment_pk,
            question_id=pk
        )

        if comment.likes.filter(pk=request.user.pk).exists():
            comment.likes.remove(request.user)
            liked = False
        else:
            comment.likes.add(request.user)
            liked = True

        return Response({
            "liked": liked,
            "like_count": comment.likes.count()
        })