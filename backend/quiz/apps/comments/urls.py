from django.urls import path
from .views import CommentListCreateAPIView, CommentLikeAPIView

urlpatterns = [
    path(
        "questions/<int:pk>/comments/",
        CommentListCreateAPIView.as_view(),
        name="comment-list-create",
    ),
    path(
        "questions/<int:pk>/comments/<int:comment_pk>/like/",
        CommentLikeAPIView.as_view(),
        name="comment-like",
    ),
]