from django.urls import include, path
from rest_framework.authtoken import views
from rest_framework.routers import DefaultRouter

from apps.users.presentation.views.user_view import UserViewSet

router = DefaultRouter(trailing_slash=False)
router.register(r"users", UserViewSet, basename="users")

urlpatterns = [
    path("api/auth/token", views.obtain_auth_token),
    path("api/", include(router.urls)),
]
