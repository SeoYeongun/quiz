from django.urls import path

from .views import QuizRankingListView, RankingListView

urlpatterns = [
    path("", RankingListView.as_view(), name="ranking-list"),
    path("quizzes/<int:quiz_id>/", QuizRankingListView.as_view(), name="quiz-ranking-list"),
]
