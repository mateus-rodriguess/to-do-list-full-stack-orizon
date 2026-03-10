import django_filters
from apps.tasks.model.task_model import Task
from apps.users.presentation.serializers.user_serializer import UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class TaskSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    collaborators = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), required=False
    )

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ("owner",)


class TaskFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(lookup_expr="icontains")
    is_completed = django_filters.BooleanFilter()
    category = django_filters.NumberFilter(field_name="category_id")

    class Meta:
        model = Task
        fields = ["is_completed", "category"]
