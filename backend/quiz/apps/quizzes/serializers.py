from rest_framework import serializers
from quiz.apps.quizzes.models import Quiz, Question, Choice


class QuizSerializer(serializers.ModelSerializer):

    class Meta:
        model = Quiz
        fields = (
            'id',
            'author',
            'title',
            'description',
            'is_published',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'author', 'created_at', 'updated_at')


    def create(self, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['author'] = request.user
        else:
            validated_data['author'] = None

        return Quiz.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.is_published = validated_data.get('is_published', instance.is_published)
        instance.save()
        return instance
    
    def delete(self, instance):
        instance.delete()

class ChoiceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Choice
        fields = (
            'id',
            'question',
            'text',
            'is_correct',
            'order',
        )
        read_only_fields = ('id',)


class QuestionSerializer(serializers.ModelSerializer):

    choices = ChoiceSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Question
        fields = (
            'id',
            'quiz',
            'text',
            'answer_type',
            'correct_answer',
            'order',
            'choices',
        )
        read_only_fields = ('id',)

    # CREATE
    def create(self, validated_data):

        choices_data = validated_data.pop('choices', [])

        question = Question.objects.create(**validated_data)

        for choice_data in choices_data:
            Choice.objects.create(
                question=question,
                **choice_data
            )

        return question

    # UPDATE
    def update(self, instance, validated_data):

        choices_data = validated_data.pop('choices', None)

        instance.text = validated_data.get(
            'text',
            instance.text
        )

        instance.answer_type = validated_data.get(
            'answer_type',
            instance.answer_type
        )

        instance.correct_answer = validated_data.get(
            'correct_answer',
            instance.correct_answer
        )

        instance.order = validated_data.get(
            'order',
            instance.order
        )

        instance.save()

        # 선택지 수정
        if choices_data is not None:

            # 기존 선택지 삭제
            instance.choices.all().delete()

            # 새 선택지 생성
            for choice_data in choices_data:
                Choice.objects.create(
                    question=instance,
                    **choice_data
                )

        return instance