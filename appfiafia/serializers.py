from rest_framework import serializers
from appfiafia.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'username', 'first_name', 'last_name')


class FriendSerializer(serializers.Serializer):
    username = serializers.CharField()

    def create(self, validated_data):
        # get rid of pylint error
        pass

    def update(self, instance, validated_data):
        # get rid of pylint error
        pass

    def validate(self, attrs):
        username = attrs.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
                attrs['user2'] = user
            except User.DoesNotExist:
                raise serializers.ValidationError('No such user')
        else:
            raise serializers.ValidationError('Must include "username".')
        return attrs


class FriendshipSerializer(serializers.ModelSerializer):
    """
    Serializer for friends in user profile
    """
    user2 = FriendSerializer()

    class Meta:
        model = Friendship
        fields = ['user2', 'accepted', 'initiator']


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'group_name', 'group_color', 'group_img_url', 'description', 'founder')


class UserGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGroup
        fields = ('id', 'group', 'user', 'date')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'uploader', 'group', 'date_time', 'message')


class GroupNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ('id', 'group', 'uploader', 'notification')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'profile_img_url', 'cover_color', 'status_msg', 'groups')
#
#     # username = serializers.CharField(max_length=100, required=False)
#     # friends = FriendshipSerializer(many=True, read_only=True)
#     #
#     # class Meta:
#     #     model = Profile