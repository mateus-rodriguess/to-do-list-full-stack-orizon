from apps.tasks.domain.services.task_rules import validate_task_title
from apps.tasks.repository.category_repository import CategoryRepository


class CategoryService:
    def __init__(self):
        self.repository = CategoryRepository()

    def create(self, data: dict):
        validate_task_title(data["name"])

        return self.repository.create(data)
