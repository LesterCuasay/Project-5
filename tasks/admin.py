from django.contrib import admin
from .models import Task


class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'owner',
        'task_name',
        'created_at',
        'due_date',
        'status',
    )


admin.site.register(Task, TaskAdmin)
