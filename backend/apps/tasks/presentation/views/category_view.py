from apps.tasks.model.category_model import Category
from apps.tasks.presentation.serializers.category_serializer import (
    CategoryFilter,
    CategorySerializer,
)
from apps.tasks.services.category_service import CategoryService
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.all().order_by("id")
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CategoryFilter
    search_fields = ["name"]
    ordering_fields = ["id", "date_joined"]
    ordering = ["id"]

    def create(self, request: Request, *args, **kwargs):
        serializer = self.get_serializer(data={**request.data, "user": request.user.id})
        serializer.is_valid(raise_exception=True)

        user = CategoryService().create(serializer.validated_data)

        output_serializer = self.get_serializer(user)

        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
