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
        # self.context['request']에서 데이터를 직접 꺼내는 대신, 
        # DRF가 검증을 마친 validated_data에서 꺼내는 것이 표준입니다.
        quiz = validated_data.get('quiz')
        score = validated_data.get('score')
        
        # 뷰(View)에서 serializer.save(user=request.user)로 넘겨준 유저 정보를 꺼냅니다.
        user = self.context['request'].user
        
        # update_or_create는 (객체, 생성여부[True/False]) 튜플을 반환하므로 
        # DRF에서는 객체(instance)만 리턴해야 에러가 나지 않습니다.
        ranking= Ranking.objects.all(
            quiz=quiz,
            user=user,
            defaults={'score': score},
        )
        return ranking