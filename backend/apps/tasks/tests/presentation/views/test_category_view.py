import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.tasks.model.category_model import Category


@pytest.fixture
def category_fixture(user_fixture):
    return Category.objects.create(name="Test Category", user=user_fixture)


@pytest.mark.django_db
class TestCategoryViewSet:
    def test_create_category(self, api_client: APIClient, user_fixture):
        api_client.force_authenticate(user=user_fixture)
        data = {"name": "Test Category", "is_active": True}
        response = api_client.post("/api/categories", data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["name"] == "Test Category"
        assert response.data["is_active"]

    def test_create_category_duplicate_name(
        self,
        api_client: APIClient,
        user_fixture,
        category_fixture,
    ):
        url = reverse("categories-list")
        api_client.force_authenticate(user=user_fixture)
        data = {"name": category_fixture.name}
        response = api_client.post(url, data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_category_list(self, api_client: APIClient, user_fixture):
        url = reverse("categories-list")
        api_client.force_authenticate(user=user_fixture)
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

    def test_get_category_detail(
        self,
        api_client: APIClient,
        user_fixture,
        category_fixture,
    ):
        url = reverse("categories-detail", kwargs={"pk": category_fixture.pk})
        api_client.force_authenticate(user=user_fixture)
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == category_fixture.name

    def test_update_category(
        self, api_client: APIClient, user_fixture, category_fixture
    ):
        url = reverse("categories-detail", kwargs={"pk": category_fixture.pk})
        api_client.force_authenticate(user=user_fixture)
        data = {"name": "Updated Category"}
        response = api_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "Updated Category"

    def test_delete_category(
        self,
        api_client: APIClient,
        user_fixture,
        category_fixture,
    ):
        url = reverse("categories-detail", kwargs={"pk": category_fixture.pk})
        api_client.force_authenticate(user=user_fixture)
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT

    def test_filter_and_search(self, api_client: APIClient, user_fixture):
        Category.objects.create(name="teste", user=user_fixture)
        Category.objects.create(name="Home", user=user_fixture)
        api_client.force_authenticate(user=user_fixture)
        url = reverse("categories-list") + "?name=teste"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
