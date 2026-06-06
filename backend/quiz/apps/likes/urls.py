from ntpath import basename
from rest_framework.routers import DefaultRouter
from .views import LikeViewSet

router = DefaultRouter()
router.register('like', LikeViewSet, basename='like')

urlpatterns = router.urls