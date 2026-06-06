from django.contrib import admin

from quiz.apps.quizzes.models import Choice, Question, Quiz


class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 2
    fields = ('text', 'is_correct', 'order')


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 1
    fields = ('text', 'answer_type', 'correct_answer', 'order')
    show_change_link = True


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_published', 'created_at')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'description', 'author__username')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [QuestionInline]


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('quiz', 'text', 'answer_type', 'order')
    list_filter = ('answer_type',)
    inlines = [ChoiceInline]


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    list_display = ('question', 'text', 'is_correct', 'order')
