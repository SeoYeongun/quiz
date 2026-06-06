from django.conf import settings
from django.db import models


class Quiz(models.Model):
    """퀴즈 게시글 (포스트)."""

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='quizzes',
        verbose_name='작성자',
    )
    title = models.CharField('제목', max_length=200)
    description = models.TextField('설명', blank=True)
    is_published = models.BooleanField('공개', default=True)
    created_at = models.DateTimeField('작성일', auto_now_add=True)
    updated_at = models.DateTimeField('수정일', auto_now=True)

    class Meta:
        verbose_name = '퀴즈'
        verbose_name_plural = '퀴즈'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    """퀴즈 문항 + 정답 입력."""

    class AnswerType(models.TextChoices):
        SHORT = 'short', '단답형'
        MULTIPLE = 'multiple', '객관식'

    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name='퀴즈',
    )
    text = models.CharField('문제', max_length=500)
    answer_type = models.CharField(
        '유형',
        max_length=10,
        choices=AnswerType.choices,
        default=AnswerType.SHORT,
    )
    correct_answer = models.CharField(
        '정답 (단답형)',
        max_length=200,
        blank=True,
        help_text='단답형일 때 작성자가 입력하는 정답',
    )
    order = models.PositiveIntegerField('순서', default=0)

    class Meta:
        verbose_name = '문항'
        verbose_name_plural = '문항'
        ordering = ['order', 'id']
        constraints = [
            models.UniqueConstraint(
                fields=['quiz', 'order'],
                name='unique_question_order_per_quiz',
            ),
        ]

    def __str__(self):
        return f'{self.quiz.title} - {self.text[:30]}'


class Choice(models.Model):
    """객관식 선택지 (정답 표시 포함)."""

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='choices',
        verbose_name='문항',
    )
    text = models.CharField('선택지', max_length=200)
    is_correct = models.BooleanField('정답', default=False)
    order = models.PositiveIntegerField('순서', default=0)

    class Meta:
        verbose_name = '선택지'
        verbose_name_plural = '선택지'
        ordering = ['order', 'id']
        constraints = [
            models.UniqueConstraint(
                fields=['question', 'order'],
                name='unique_choice_order_per_question',
            ),
        ]

    def __str__(self):
        mark = ' ✓' if self.is_correct else ''
        return f'{self.text[:40]}{mark}'
