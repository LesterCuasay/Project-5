from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from cloudinary_storage.storage import RawMediaCloudinaryStorage


class Task(models.Model):

    STATUS_CHOICES = (
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('COMPLETED', 'Completed'),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=255)
    task_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TODO',
    )
    attachment = models.FileField(
        upload_to='task_attachments/',
        blank=True,
        null=True,
        storage=RawMediaCloudinaryStorage(),
    )

    @property
    def is_overdue(self):
        return self.due_date < timezone.now().date()

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.task_name
