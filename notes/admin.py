from django.contrib import admin
from .models import Notes


class NotesAdmin(admin.ModelAdmin):
    list_display = (
        'owner',
        'created_at',
        'task_description',
    )


admin.site.register(Notes, NotesAdmin)
