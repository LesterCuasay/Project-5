from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer
from taskmaster_api.permissions import IsOwnerOrReadOnly


class TaskList(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Task.objects.annotate(
            notes_count=Count('notes', distinct=True),
            favourites_count=Count('favourites', distinct=True)
        ).order_by('-created_at')

    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner__followed__owner__profile',
        'favourites__owner__profile',
        'owner__profile',
    ]
    search_fields = [
        'owner__username',
        'task_name'
    ]
    ordering_fields = [
        'favourites_count',
        'notes_count',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Task.objects.annotate(
            notes_count=Count('notes', distinct=True)
        ).order_by('-created_at')
