from rest_framework import serializers
from .models import Task
from favourites.models import Favourite


class TaskSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')
    favourite_id = serializers.SerializerMethodField()
    notes_count = serializers.ReadOnlyField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    def get_favourite_id(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            favourite = Favourite.objects.filter(
                owner=user, task=obj
            ).first()
            return favourite.id if favourite else None
        return None

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
            'favourite_id', 'notes_count',
        ]
