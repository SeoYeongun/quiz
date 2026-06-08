from rest_framework.routers import DefaultRouter

from .views import RankingViewSet

router = DefaultRouter()
router.register(
    '',
    RankingViewSet,
    basename='ranking'
)

urlpatterns = router.urls
