from apps.tasks.model.task_model import Task
from apps.tasks.presentation.serializers.task_serializer import (
    TaskFilter,
    TaskSerializer,
)
from apps.tasks.services.task_service import TaskService
from django.db.models import Q
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
        if getattr(self, "swagger_fake_view", False):
            return Task.objects.none()

        user = self.request.user
        return (
            Task.objects.filter(Q(owner=user) | Q(collaborators=user))
            .select_related("owner")
            .prefetch_related("collaborators")
            .distinct()
        )

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
