from django.db import models
from quiz.apps.users.models import User
from quiz.apps.quizzes.models import Question
from django.core.validators import MinValueValidator, MaxValueValidator
# Create your models here.

class Ranking(models.Model):
    quiz = models.ForeignKey(Question, related_name='rankings', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User, related_name='rankings', on_delete=models.CASCADE)
    score = models.IntegerField(
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(5),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', 'created_at']