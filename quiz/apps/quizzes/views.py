from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Quiz
from .serializer import QuizSerializer, QuizWriteSerializer


class QuizListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        quizzes = Quiz.objects.prefetch_related("questions__choices").all()
        serializer = QuizSerializer(quizzes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = QuizWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz = serializer.save()
        response_serializer = QuizSerializer(quiz)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class QuizDetailView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self, quiz_id):
        return get_object_or_404(
            Quiz.objects.prefetch_related("questions__choices"),
            id=quiz_id,
        )

    def get(self, request, quiz_id):
        quiz = self.get_object(quiz_id)
        serializer = QuizSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, quiz_id):
        quiz = self.get_object(quiz_id)
        serializer = QuizWriteSerializer(instance=quiz, data=request.data)
        serializer.is_valid(raise_exception=True)
        quiz = serializer.save()
        response_serializer = QuizSerializer(quiz)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, quiz_id):
        quiz = self.get_object(quiz_id)
        serializer = QuizWriteSerializer(instance=quiz, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        quiz = serializer.save()
        response_serializer = QuizSerializer(quiz)
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, quiz_id):
        quiz = self.get_object(quiz_id)
        quiz.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
