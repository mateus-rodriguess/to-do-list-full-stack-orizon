from apps.users.presentation.serializers.user_serializer import (
    UserFilter,
    UserSerializer,
)
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated


class UserViewSet(viewsets.ModelViewSet):
    User = get_user_model()
    queryset = User.objects.all().order_by("id")
    serializer_class = UserSerializer

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = UserFilter
    search_fields = ["username", "email"]
    ordering_fields = ["id", "username", "date_joined"]
    ordering = ["id"]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return [IsAuthenticated()]
