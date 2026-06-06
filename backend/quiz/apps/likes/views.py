from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from quiz.apps.likes.models import Like
from quiz.apps.likes.serializers import LikeSerializer
# Create your views here.

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
