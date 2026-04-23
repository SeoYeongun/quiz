from rest_framework import serializers

from .models import Choice, Question, Quiz


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ("id", "text", "is_correct", "order", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ("id", "quiz", "text", "order", "choices", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = (
            "id",
            "title",
            "description",
            "is_published",
            "questions",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class ChoiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ("text", "is_correct", "order")


class QuestionWriteSerializer(serializers.ModelSerializer):
    choices = ChoiceWriteSerializer(many=True)

    class Meta:
        model = Question
        fields = ("text", "order", "choices")

    def validate_choices(self, choices):
        if not choices:
            raise serializers.ValidationError("선택지는 최소 1개 이상 필요합니다.")
        if not any(choice.get("is_correct") for choice in choices):
            raise serializers.ValidationError("정답 선택지는 최소 1개 이상 필요합니다.")
        return choices


class QuizWriteSerializer(serializers.ModelSerializer):
    questions = QuestionWriteSerializer(many=True)

    class Meta:
        model = Quiz
        fields = ("title", "description", "is_published", "questions")

    def validate_questions(self, questions):
        if not questions:
            raise serializers.ValidationError("문항은 최소 1개 이상 필요합니다.")
        return questions

    def create(self, validated_data):
        questions_data = validated_data.pop("questions")
        quiz = Quiz.objects.create(**validated_data)

        for question_data in questions_data:
            choices_data = question_data.pop("choices")
            question = Question.objects.create(quiz=quiz, **question_data)
            for choice_data in choices_data:
                Choice.objects.create(question=question, **choice_data)
        return quiz

    def update(self, instance, validated_data):
        questions_data = validated_data.pop("questions", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if questions_data is not None:
            instance.questions.all().delete()
            for question_data in questions_data:
                choices_data = question_data.pop("choices")
                question = Question.objects.create(quiz=instance, **question_data)
                for choice_data in choices_data:
                    Choice.objects.create(question=question, **choice_data)

        return instance

