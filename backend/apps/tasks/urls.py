from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.tasks.presentation.views.category_view import CategoryViewSet
from apps.tasks.presentation.views.task_view import TaskViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"tasks", TaskViewSet, basename="tasks")
router.register(r"categories", CategoryViewSet, basename="categories")

urlpatterns = [
    path("api/", include(router.urls)),
]
