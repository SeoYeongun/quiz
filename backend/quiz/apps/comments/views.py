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
    
    def perform_create(self, serializer):
        # Set the author to the current user and quiz to the specified quiz
        quiz_id = self.request.data.get('quiz')
        serializer.save(author=self.request.user, quiz_id=quiz_id)

    def perform_update(self, serializer):
        # Ensure that the author cannot be changed on update
        serializer.save(author=self.get_object().author)

    def perform_destroy(self, instance):
        # Ensure that only the author can delete their comment
        if instance.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this comment.")
        instance.delete()