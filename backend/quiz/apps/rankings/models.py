from django.db import models
from quiz.apps.quizzes.models import Quiz
from quiz.apps.likes.models import Like
from quiz.apps.users.models import User
# Create your models here.

class Ranking(models.Model):
    quiz = models.ForeignKey(Quiz, related_name='rankings', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='rankings', on_delete=models.CASCADE)
    score = models.ForeignKey(Like, related_name='rankings', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('quiz', 'user') 