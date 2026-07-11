from rest_framework import serializers


class RankingSerializer(serializers.Serializer):

    rank = serializers.IntegerField()

    username = serializers.CharField()

    solved_count = serializers.IntegerField()

    correct_count = serializers.IntegerField()

    accuracy = serializers.FloatField()