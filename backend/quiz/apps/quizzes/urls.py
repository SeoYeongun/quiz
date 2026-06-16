from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuestionViewSet, SubmitAnswerAPIView

router = DefaultRouter()
router.register(r'questions', QuestionViewSet, basename='question')

urlpatterns = [
    path('', include(router.urls)),

    # ✔️ 문제 풀이 API
    path(
        'questions/<int:pk>/answer/',
        SubmitAnswerAPIView.as_view()
    ),
]