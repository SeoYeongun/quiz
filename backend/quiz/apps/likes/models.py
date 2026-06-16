from django.db import models
from quiz.apps.users.models import User

# Create your models here.
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    

    class Meta:
        unique_together = ('user',)  # 한 유저는 하나의 좋아요만 가질 수 있도록 설정