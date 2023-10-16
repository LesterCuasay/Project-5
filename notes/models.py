from django.db import models
from django.contrib.auth.models import User
from tasks.models import Task


class Notes(models.Model):

    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    task_description = models.TextField()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.task_description
