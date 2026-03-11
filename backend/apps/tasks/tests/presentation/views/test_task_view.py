import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from apps.tasks.model.task_model import Task

data_task = {
    "title": "Test task 1",
    "description": "Task description 1",
    "is_active": True,
    "is_completed": True,
    "priority": "MEDIUM",
    "due_date": "2025-12-31T23:59:59Z",
}


@pytest.fixture
def task_data_fixture(category_fixture):
    return {
        **data_task,
        "category": category_fixture.id,
    }


@pytest.fixture
def task_fixture(user_fixture, category_fixture):
    return Task.objects.create(
        title="Test task 1",
        description="Task description 1",
        is_active=True,
        is_completed=True,
        priority="MEDIUM",
        due_date="2025-12-31T23:59:59Z",
        category=category_fixture,
        owner=user_fixture,
    )


@pytest.mark.django_db
class TestTaskViewSet:
    def test_create_task(self, api_client: APIClient, user_fixture, task_data_fixture):
        api_client.force_authenticate(user=user_fixture)

        url = reverse("tasks-list")
        task_data = task_data_fixture
        response = api_client.post(url, data=task_data_fixture, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == task_data["title"]
        assert response.data["description"] == task_data["description"]
        assert response.data["is_active"] == task_data["is_active"]
        assert response.data["is_completed"] == task_data["is_completed"]
        assert response.data["priority"] == task_data["priority"]
        assert response.data["category"] == task_data["category"]
        assert response.data["collaborators"] == []

    def test_get_task_list(self, api_client: APIClient, user_fixture, task_fixture):
        url = reverse("tasks-list")

        api_client.force_authenticate(user=user_fixture)
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["result"]) >= 1

    def test_get_task_detail(self, api_client: APIClient, user_fixture, task_fixture):
        url = reverse("tasks-detail", kwargs={"pk": task_fixture.pk})

        api_client.force_authenticate(user=user_fixture)
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == task_fixture.title
        assert response.data["description"] == task_fixture.description
        assert response.data["is_completed"] == task_fixture.is_completed
        assert response.data["priority"] == task_fixture.priority
        assert response.data["is_active"] == task_fixture.is_active

    def test_update_task(
        self,
        api_client: APIClient,
        user_fixture,
        task_fixture,
        category_fixture,
    ):
        url = reverse("tasks-detail", kwargs={"pk": task_fixture.pk})

        api_client.force_authenticate(user=user_fixture)

        data = {
            "title": "Updated task",
            "description": "Updated description",
            "is_active": False,
            "is_completed": False,
            "priority": "LOW",
            "category": category_fixture.id,
        }

        response = api_client.patch(url, data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == data["title"]
        assert response.data["description"] == data["description"]
        assert response.data["is_active"] == data["is_active"]
        assert response.data["is_completed"] == data["is_completed"]
        assert response.data["priority"] == data["priority"]

    def test_delete_task(self, api_client: APIClient, user_fixture, task_fixture):
        url = reverse("tasks-detail", kwargs={"pk": task_fixture.pk})

        api_client.force_authenticate(user=user_fixture)
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Task.objects.count() == 0

    def test_filter_and_search(
        self, api_client: APIClient, user_fixture, category_fixture
    ):
        Task.objects.create(
            title="teste",
            description="desc",
            owner=user_fixture,
            category=category_fixture,
        )

        Task.objects.create(
            title="Home",
            description="desc",
            owner=user_fixture,
            category=category_fixture,
        )

        api_client.force_authenticate(user=user_fixture)

        url = reverse("tasks-list") + "?title=teste"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
