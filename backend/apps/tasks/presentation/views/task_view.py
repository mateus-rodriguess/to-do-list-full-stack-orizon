from apps.tasks.presentation.serializers.task_serializer import (
    TaskFilter,
    TaskSerializer,
)
from apps.tasks.services.task_service import TaskService
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet


class TaskViewSet(ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ["title", "description"]
    ordering_fields = ["id", "created_at", "due_date"]
    ordering = ["id"]

    def get_queryset(self):
        return TaskService().list()

    def create(self, request, *args, **kwargs):
        validated_data = request.data.copy()
        validated_data.pop("owner", None)

        serializer = self.get_serializer(data=validated_data)
        serializer.is_valid(raise_exception=True)

        task = TaskService().create(
            {**serializer.validated_data, "owner": request.user}
        )

        output_serializer = self.get_serializer(task)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)
