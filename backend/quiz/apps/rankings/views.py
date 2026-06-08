from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import viewsets
from quiz.apps.rankings.models import Ranking
from quiz.apps.rankings.serializers import RankingSerializer
from rest_framework.permissions import AllowAny
import requests

class RankingViewSet(viewsets.ModelViewSet):
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer

    permission_classes = [AllowAny] 