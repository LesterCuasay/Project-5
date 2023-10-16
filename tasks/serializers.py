from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile_id')
    profile_image = serializers.ReadOnlyField(source='owner.profile_image.url')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Task
        fields = [
            'id', 'owner', 'task_name', 'task_description',
            'due_date', 'created_at', 'updated_at', 'status',
            'profile_id', 'profile_image', 'is_owner', 'is_overdue',
        ]