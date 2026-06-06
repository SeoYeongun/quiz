from django.urls import include, path
from rest_framework.routers import DefaultRouter

from quiz.apps.users.views import LoginView, RegisterView, UserViewSet

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('', include(router.urls)),
]
