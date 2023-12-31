from django.contrib import admin
from .models import Notes


class NotesAdmin(admin.ModelAdmin):
    list_display = (
        'owner',
        'created_at',
        'content',
    )


admin.site.register(Notes, NotesAdmin)
