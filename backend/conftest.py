import pytest
from apps.tasks.model.category_model import Category
from apps.users.infrastructure.model.user_model import User
from faker import Faker
from rest_framework.test import APIClient

fake = Faker()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user_fixture(db):
    return User.objects.create_user(
        username=fake.user_name(),
        password=fake.password(),
        email=fake.email(),
        first_name=fake.first_name(),
        last_name=fake.last_name(),
    )


@pytest.fixture
def category_fixture(db, user_fixture) -> Category:
    return Category.objects.create(name="Test Category", user=user_fixture)
