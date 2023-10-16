from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def validate_attachment(self, value):
        if value:
            if value.size > 1024 * 1024 * 2:
                raise serializers.ValidationError(
                    'File size larger than 2MB!'
                )
        return value

    class Meta:
        model = Task
        fields = [
            'id', 'owner', 'task_name', 'task_description',
            'due_date', 'created_at', 'updated_at', 'status', 'attachment',
            'profile_id', 'profile_image', 'is_owner', 'is_overdue',
        ]
