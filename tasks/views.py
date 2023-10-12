from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer


class TaskList(APIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tasks = Task.objects.filter(owner=request.user)
        serializer = TaskSerializer(
            tasks, many=True, context={'request': request}
            )
        return Response(serializer.data)

    def post(self, request):
        serializer = TaskSerializer(
            data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)