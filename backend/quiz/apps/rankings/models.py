from django.db import models
from quiz.apps.likes.models import Like
from quiz.apps.users.models import User
# Create your models here.

class Ranking(models.Model):
    user = models.ForeignKey(User, related_name='rankings', on_delete=models.CASCADE)
    score = models.ForeignKey(Like, related_name='rankings', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', 'created_at']