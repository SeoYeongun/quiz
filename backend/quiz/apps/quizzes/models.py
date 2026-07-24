from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Question(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=200)

    question_text = models.TextField()
    image = models.ImageField(upload_to="question_images/", blank=True, null=True)
    video = models.FileField(upload_to="question_videos/", blank=True, null=True)
    video_url = models.URLField(
        blank=True,
        null=True
    )

    choice1 = models.CharField(max_length=255)
    choice2 = models.CharField(max_length=255)
    choice3 = models.CharField(max_length=255)
    choice4 = models.CharField(max_length=255)

    correct_answer = models.IntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ShortQuestion(models.Model):
    question = models.OneToOneField(
        "quizzes.Question",
        on_delete=models.CASCADE,
        related_name="short"
    )

    order = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "-created_at"]

    def __str__(self):
        return self.question.title

class QuestionAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)

    selected_answer = models.IntegerField()
    is_correct = models.BooleanField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "question"],
                name="unique_user_question_attempt"
            )
        ]

class Report(models.Model):
    REPORT_TYPES = [
        ("spam", "스팸"),
        ("abuse", "욕설"),
        ("adult", "음란물"),
        ("fake", "허위정보"),
        ("etc", "기타"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="reports"
    )

    reason = models.CharField(max_length=20, choices=REPORT_TYPES)
    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "question")

