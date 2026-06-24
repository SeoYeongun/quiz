from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [

    # admin
    path('admin/', admin.site.urls),

    # users
    path('api/users/', include('quiz.apps.users.urls')),

    # quizzes
    path('api/quizzes/', include('quiz.apps.quizzes.urls')),

    # submissions (폴더명: subimissions)
    path('api/submissions/', include('quiz.apps.subimissions.urls')),

    # comments

    # likes
    path('api/likes/', include('quiz.apps.likes.urls')),

    # rankings
    path('api/rankings/', include('quiz.apps.rankings.urls')),

    path("api/token/", TokenObtainPairView.as_view()),
    path("api/token/refresh/", TokenRefreshView.as_view()),
]

# media
urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)