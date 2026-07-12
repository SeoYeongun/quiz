from django.urls import path
from .views import RankingAPIView, PostRankingAPIView


urlpatterns = [
    
    path(
        "users/",
        RankingAPIView.as_view()
    ),
    path(
        "posts/",
        PostRankingAPIView.as_view()
    )
]
