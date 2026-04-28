from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from quiz.apps.quizzes.models import Quiz

from .models import Ranking
from .serializer import RankingSerializer


class RankingListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        rankings = Ranking.objects.select_related("quiz", "user").all()
        serializer = RankingSerializer(rankings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class QuizRankingListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        rankings = Ranking.objects.select_related("quiz", "user").filter(quiz=quiz)
        serializer = RankingSerializer(rankings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
