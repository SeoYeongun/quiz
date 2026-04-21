from django.urls import path

from .views import (
    LoginView,
    LogoutView,
    MeView,
    PasswordChangeView,
    UserCreateView,
    UserDeleteView,
)

urlpatterns = [
    path("signup/", UserCreateView.as_view(), name="user-signup"),
    path("login/", LoginView.as_view(), name="user-login"),
    path("logout/", LogoutView.as_view(), name="user-logout"),
    path("password-change", PasswordChangeView.as_view(), name="user-password-change"),
    path("withdraw/", UserDeleteView.as_view(), name="user-withdraw"),
    path("me/", MeView.as_view(), name="user-me"),
]
