from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Count, Q

from quiz.apps.quizzes.models import QuestionAttempt


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



        result = []


        sorted_users = sorted(
            users.values(),
            key=lambda x: x["correct_count"],
            reverse=True
        )


        for index, user in enumerate(sorted_users, start=1):

            accuracy = round(
                user["correct_count"]
                /
                user["solved_count"]
                *
                100,
                1
            )


            result.append(
                {
                    "rank": index,
                    "username": user["username"],
                    "solved_count": user["solved_count"],
                    "correct_count": user["correct_count"],
                    "accuracy": accuracy,
                }
            )


        return Response(result)