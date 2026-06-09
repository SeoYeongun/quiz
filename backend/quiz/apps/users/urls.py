from django.urls import include, path
from rest_framework.routers import DefaultRouter

from quiz.apps.users.views import LoginView, RegisterView, UserView, LogoutView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='user-register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('me/', UserView.as_view(), name='user-me'),
    path('logout/', LogoutView.as_view(), name='user-logout'),
]
