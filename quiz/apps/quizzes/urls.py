from django.urls import path

from .views import CommentView, QuizDetailView, QuizListCreateView

urlpatterns = [
    path("", QuizListCreateView.as_view(), name="quiz-list-create"),
    path("<int:quiz_id>/", QuizDetailView.as_view(), name="quiz-detail"),
    path("<int:quiz_id>/comments/", CommentView.as_view(), name="quiz-comments"),
]
