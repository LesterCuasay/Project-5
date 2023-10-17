from django.db.models import Count
from rest_framework import generics, permissions, filters
from .models import Task
from .serializers import TaskSerializer
from taskmaster_api.permissions import IsOwner


class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Task.objects.annotate(
            notes_count=Count('notes', distinct=True)
        )
        return queryset.filter(owner=self.request.user).order_by('-created_at')

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
    ]
    search_fields = [
        'owner__username',
        'task_name'
    ]
    ordering_fields = [
        'notes_count',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsOwner]
    queryset = Task.objects.all()
