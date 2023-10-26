from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from taskmaster_api.permissions import IsOwnerOrReadOnly
from .models import Notes
from .serializers import NotesSerializer, NotesDetailSerializer


class NotesList(generics.ListCreateAPIView):
    serializer_class = NotesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Notes.objects.all()

    filter_backends = [
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'task',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class NotesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NotesDetailSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Notes.objects.all()
