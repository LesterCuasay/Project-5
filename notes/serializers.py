from rest_framework import serializers
from notes.models import Notes


class NotesSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_image = serializers.ReadOnlyField(source='owner.profile.image.url')

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Notes
        fields = [
            'owner', 'is_owner', 'profile_id', 'profile_image', 'task',
            'created_at', 'updated_at', 'task_requirements',
        ]


class NotesDetailSerializer(serializers.ModelSerializer):

    task = serializers.ReadOnlyField(source='task.id')
