from rest_framework.routers import DefaultRouter
from .views import (
    QuestionViewSet,
    ChoiceViewSet,
    QuizViewSet
)

router = DefaultRouter()

router.register(
    'quiz',
    QuizViewSet,
    basename='quiz'
)

router.register(
    'questions',
    QuestionViewSet,
    basename='question'
)

router.register(
    'choices',
    ChoiceViewSet,
    basename='choice'
)

urlpatterns = router.urls