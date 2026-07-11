from django.urls import path
from .views import RankingAPIView


urlpatterns = [
    path(
        "",
        RankingAPIView.as_view()
    )
]
