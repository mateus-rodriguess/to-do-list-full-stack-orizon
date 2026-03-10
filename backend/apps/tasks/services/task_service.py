from apps.tasks.domain.services.task_rules import validate_task_title
from apps.tasks.repository.task_repository import TaskRepository
from django.db import transaction


class TaskService:
    def __init__(self):
        self.repository = TaskRepository()

    @transaction.atomic
    def create(self, data: dict):

        validate_task_title(data["title"])

        collaborators = data.pop("collaborators", [])
        print("collaborators", data["owner"])
        task = self.repository.create(data)

        if collaborators:
            task.collaborators.set(collaborators)

        return task

    def list(self):
        return self.repository.list()
