from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Count, Q

from quiz.apps.quizzes.models import QuestionAttempt
from quiz.apps.quizzes.models import Question
from quiz.apps.likes.models import Like
from quiz.apps.comments.models import Comment

class RankingAPIView(APIView):

    def get(self, request):

        rankings = (
            QuestionAttempt.objects
            .values(
                "user__username",
                "question_id"
            )
            .annotate(
                is_correct_count=Count(
                    "id",
                    filter=Q(is_correct=True)
                )
            )
        )

        users = {}

        for item in rankings:

            username = item["user__username"]

            if username not in users:
                users[username] = {
                    "username": username,
                    "solved_count": 0,
                    "correct_count": 0,
                }

            users[username]["solved_count"] += 1

            if item["is_correct_count"] > 0:
                users[username]["correct_count"] += 1

        # 사용자별 정답률 계산
        for user in users.values():
            user["accuracy"] = round(
                user["correct_count"] / user["solved_count"] * 100,
                1
            )

        # 정답 수 → 정답률 → 사용자명 순으로 정렬
        sorted_users = sorted(
            users.values(),
            key=lambda x: (
                -x["correct_count"],
                -x["accuracy"],
                x["username"]
            )
        )[:100]

        result = []

        for index, user in enumerate(sorted_users, start=1):

            result.append(
                {
                    "rank": index,
                    "username": user["username"],
                    "solved_count": user["solved_count"],
                    "correct_count": user["correct_count"],
                    "accuracy": user["accuracy"],
                }
            )

        return Response(result)
    
class PostRankingAPIView(APIView):

    def get(self, request):

        questions = (
            Question.objects
            .annotate(
                like_count=Count(
                    "likes",
                    distinct=True
                ),
                comment_count=Count(
                    "comments",
                    distinct=True
                )
            )
            .order_by(
                "-like_count",
                "-comment_count",
                "-created_at"
            )[:100]
        )


        result = []

        for index, question in enumerate(
            questions,
            start=1
        ):

            result.append(
                {
                    "rank": index,
                    "id": question.id,
                    "title": question.title,
                    "author": question.user.username,
                    "like_count": question.like_count,
                    "comment_count": question.comment_count,
                    "created_at": question.created_at,
                }
            )


        return Response(result)