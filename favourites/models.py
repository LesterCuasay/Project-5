from django.db import models
from django.contrib.auth.models import User
from tasks.models import Task


class Favourite(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(
        Task, related_name='favourites', on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['owner', 'task']

    def __str__(self):
        return f'{self.owner} {self.task}'
