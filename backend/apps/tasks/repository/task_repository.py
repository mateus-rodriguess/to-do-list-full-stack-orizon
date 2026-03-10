from apps.tasks.model.task_model import Task


class TaskRepository:
    @staticmethod
    def create(data):
        return Task.objects.create(**data)

    @staticmethod
    def list():
        return Task.objects.prefetch_related("collaborators").all()
