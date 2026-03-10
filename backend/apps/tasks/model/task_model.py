from django.contrib.auth import get_user_model
from django.db import models

from apps.tasks.model.category_model import Category

User = get_user_model()


class Task(models.Model):
    PRIORITY_CHOICES = [
        ("LOW", "LOW"),
        ("MEDIUM", "MEDIUM"),
        ("HIGH", "HIGH"),
    ]

    title = models.CharField(max_length=255, null=False, blank=False)
    description = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(null=True, blank=True)
    priority = models.CharField(max_length=15, choices=PRIORITY_CHOICES, default="LOW")
    is_active = models.BooleanField(default=True)

    category = models.ForeignKey(
        Category, on_delete=models.PROTECT, null=True, blank=True
    )

    owner = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="owned_tasks"
    )

    collaborators = models.ManyToManyField(
        User, related_name="shared_tasks", blank=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
