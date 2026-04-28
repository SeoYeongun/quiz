from django.conf import settings
from django.db import models

from quiz.apps.quizzes.models import Quiz


class Ranking(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="rankings",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rankings",
    )
    score = models.PositiveIntegerField(default=0)
    correct_count = models.PositiveIntegerField(default=0)
    total_questions = models.PositiveIntegerField(default=0)
    submitted_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quiz_rankings"
        ordering = ["quiz_id", "-score", "-correct_count", "submitted_at", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["quiz", "user"],
                name="unique_ranking_per_quiz_user",
            )
        ]

    def __str__(self):
        return f"[{self.quiz_id}] {self.user_id}: {self.score}"
