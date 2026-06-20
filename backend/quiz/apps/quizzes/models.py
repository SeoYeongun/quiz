from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Question(models.Model):
    title = models.CharField(max_length=200)

    question_text = models.TextField()

    choice1 = models.CharField(max_length=255)
    choice2 = models.CharField(max_length=255)
    choice3 = models.CharField(max_length=255)
    choice4 = models.CharField(max_length=255)

    correct_answer = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class QuestionAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_answer = models.IntegerField()
    is_correct = models.BooleanField()

    created_at = models.DateTimeField(auto_now_add=True)