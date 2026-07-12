from django.db import models
from quiz.apps.users.models import User
from quiz.apps.quizzes.models import Question

# Create your models here.
class Like(models.Model):
    quiz = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="likes"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = (
            "user",
            "quiz"
        )