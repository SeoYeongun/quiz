from rest_framework import serializers
from .models import Quiz, Question, Choice


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ["id", "text", "is_correct", "order"]


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = [
            "id",
            "text",
            "answer_type",
            "correct_answer",
            "order",
            "choices",
        ]


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, required=False)

    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "description",
            "is_published",
            "questions",
        ]

    def create(self, validated_data):
        questions_data = validated_data.pop("questions", [])

        quiz = Quiz.objects.create(**validated_data)

        for q_index, q_data in enumerate(questions_data):
            choices_data = q_data.pop("choices", [])

            question = Question.objects.create(
                quiz=quiz,
                order=q_index,
                **q_data
            )

            for c_index, c_data in enumerate(choices_data):
                Choice.objects.create(
                    question=question,
                    order=c_index,
                    **c_data
                )

        return quiz