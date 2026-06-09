from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout

from quiz.apps.users.models import User
from quiz.apps.users.serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserSerializer,
)


class UserView(APIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class RegisterView(APIView):
    """회원가입 → 토큰 발급 (가입 후 자동 로그인)."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """username + password 로그인 → 토큰 발급."""
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)  # Django 세션에 저장
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'token': token.key,
                'user': UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
    
class LogoutView(APIView):
    """로그아웃 → 토큰 삭제."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'detail': 'Logged out successfully'})