from rest_framework.routers import DefaultRouter
from .views import (
    QuestionViewSet,
    ChoiceViewSet,
)

router = DefaultRouter()

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