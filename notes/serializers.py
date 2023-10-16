from rest_framework import serializers
from notes.models import Notes


class NotesSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    is_owner = serializers.SerializerMethodField()

    def get_is_owner(self, obj):
        request = self.context['request']
        return request.user == obj.owner

    class Meta:
        model = Notes
        fields = [
            'owner', 'is_owner', 'task', 'created_at', 'updated_at',
            'task_requirements',
        ]
