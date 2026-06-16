from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserView,
    RegisterView,
    LoginView,
    LogoutView
)
from django.urls import path
urlpatterns = [
    path("login/", LoginView.as_view()),
    path("me/", UserView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("register/", RegisterView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
]