import django_filters
from apps.tasks.model.category_model import Category
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Category
        fields = "__all__"


class CategoryFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr="icontains")

    class Meta:
        model = Category
        fields = ["name"]
