from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']

    def get_queryset(self):
        # Filter comments by quiz if specified in query parameters
        quiz_id = self.request.query_params.get('quiz')
        if quiz_id:
            return Comment.objects.filter(quiz_id=quiz_id)
        return super().get_queryset()
