from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    퀴즈 플랫폼 사용자.
    - 로그인: username, password (AbstractUser)
    - 표시명: nickname (랭킹·댓글 등에 사용)

    비밀번호는 평문 저장 금지. user.set_password('raw') 사용.
    """

    password = models.CharField('비밀번호', max_length=128)
    email = models.EmailField('이메일', unique=True, blank=True, null=True)

    nickname = models.CharField('닉네임', max_length=30, unique=True)
    profile_image = models.ImageField(
        '프로필 이미지',
        upload_to='profiles/%Y/%m/',
        blank=True,
        null=True,
    )
    bio = models.CharField('소개', max_length=200, blank=True)

    class Meta:
        verbose_name = '사용자'
        verbose_name_plural = '사용자'
        ordering = ['-date_joined']

    def __str__(self):
        return self.nickname

    def save(self, *args, **kwargs):
        if not self.nickname:
            self.nickname = self.username
        super().save(*args, **kwargs)

