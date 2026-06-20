from django.db import models
from django.utils import timezone
from quiz.apps.users.models import User
from quiz.apps.quizzes.models import Question


class Comment(models.Model):
    question = models.ForeignKey(
    Question,
    on_delete=models.CASCADE,
    related_name="comments",
)
    text = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    author_name = models.CharField(max_length=50, blank=True, default="")
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.author.username} - {self.text[:20]}"

    class Meta:
        verbose_name = 'Comment'
        verbose_name_plural = 'Comments'
        ordering = ['-created_at']