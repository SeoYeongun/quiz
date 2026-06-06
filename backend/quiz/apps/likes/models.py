from django.db import models
from quiz.apps.users.models import User
from quiz.apps.quizzes.models import Quiz
# Create your models here.
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, related_name='likes',
on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'quiz')