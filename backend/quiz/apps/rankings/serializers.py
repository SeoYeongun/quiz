from rest_framework import serializers
from quiz.apps.rankings.models import Ranking

# 1. ModelSerializer로 변경합니다.
class RankingSerializer(serializers.ModelSerializer):
    
    # quiz 필드를 PrimaryKeyRelatedField로 설정하면 웹 폼에 퀴즈 목록이 드롭다운으로 뜹니다.
    score = serializers.IntegerField(min_value=0)

    class Meta:
        model = Ranking
        fields = (
            'id',
            'quiz',
            'user',
            'score',
            'created_at',
        )
        # user는 views.py나 save() 시점에 주입하므로 읽기 전용으로 둡니다.
        read_only_fields = (
            'id',
            'user',
            'created_at',
        )

    def create(self, validated_data):
        quiz = validated_data.get('quiz')
        score = validated_data.get('score')
        user = self.context['request'].user

        ranking, created = Ranking.objects.update_or_create(
            quiz=quiz,
            user=user,
            defaults={
                'score': score,
            }
        )

        return ranking