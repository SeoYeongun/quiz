from django.db import models

class Quiz(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quizzes"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions",
    )
    text = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "quiz_questions"
        ordering = ["quiz_id", "order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["quiz", "order"],
                name="unique_question_order_per_quiz",
            )
        ]

    def __str__(self):
        return f"[{self.quiz_id}] {self.text}"


class Choice(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="choices",
    )
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "question_choices"
        ordering = ["question_id", "order", "id"]
        constraints = [
            models.UniqueConstraint(
                fields=["question", "order"],
                name="unique_choice_order_per_question",
            )
        ]

    def __str__(self):
        return f"[{self.question_id}] {self.text}"