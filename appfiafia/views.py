from django.db.models import Q
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
import operator
from functools import reduce

import passlib.hash as pl_hash


class UserRegister(APIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()

    def post(self, request, format=None):
        email = request.data['email']
        try:
            password = request.data['password']
        except KeyError:
            password = None
        username = request.data['username']
        first_name = request.data['first_name']
        last_name = request.data['last_name']

        if password is not None:
            return register(email, password, username, first_name, last_name)

        return register(email, None, username, first_name, last_name)


class UserLogout(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()

    def get(self, request, format=None):
        request.user.auth_token.delete()
        return Response("Success", status=status.HTTP_200_OK)


class UserLogin(APIView):
    permission_classes = (AllowAny,)
    queryset = User.objects.all()

    def post(self, request, pk=None):
        email = request.data['email']
        password = request.data['password']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response('No such user', status=status.HTTP_404_NOT_FOUND)

        valid = pl_hash.django_pbkdf2_sha256.verify(password, user.password)
        if not valid:
            return Response('Invalid password', status=status.HTTP_401_UNAUTHORIZED)

        return generate_token(user)


class UserDelete(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = User.objects.all()

    def get(self, request, format=None):
        request.user.delete()
        request.user.auth_token.delete()
        return Response("Success", status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        return Response("Cannot send create request", status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'])
    def reset_password(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            user.password = pl_hash.django_pbkdf2_sha256.hash(request.POST.get('new_pw'))
            user.save()
            return Response('Success', status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response('No such user', status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['put'])
    def change_username(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
            new_username = request.POST.get('new_username')
            if new_username is None or len(new_username) < 4:
                return Response("Empty Username", status=status.HTTP_400_BAD_REQUEST)
            user.username = new_username
            user.save()
            return Response(user.username, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response('No such user', status=status.HTTP_404_NOT_FOUND)


def register(email, password, username, first_name, last_name):
    if password is None:
        password = User.objects.make_random_password()
    hashed_password = pl_hash.django_pbkdf2_sha256.hash(password)
    data = {
        'username': username,
        'first_name': first_name,
        'last_name': last_name,
        'password': hashed_password,
        'email': email
    }
    user = UserSerializer(data=data)
    if not user.is_valid():
        return Response("Register Error.", status=status.HTTP_400_BAD_REQUEST)
    user.save()
    user_obj = User.objects.get(email=email)
    return generate_token(user_obj)


def generate_token(user):
    token, _ = Token.objects.get_or_create(user=user)

    response = {
        'token': token.key,
        'user_id': user.id,
        'email': user.email,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name
    }
    return Response(response)


class UserFriendUser(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        user1 = request.user
        user2_data = FriendSerializer(data=request.data)
        if user2_data.is_valid(raise_exception=True):
            user2 = user2_data.validated_data['user2']
            if user1 == user2:
                return Response('Username to friend is same as user', status=status.HTTP_400_BAD_REQUEST)

            try:
                friendship = Friendship.objects.get(user1=user1, user2=user2)
                if friendship.initiator or friendship.accepted:
                    return Response('User has already been friended', status=status.HTTP_400_BAD_REQUEST)
                else:
                    friendship.accepted = True
                    friendship.save()
                    other_friendship = Friendship.objects.get(user1=user2, user2=user1)
                    other_friendship.accepted = True
                    other_friendship.save()
                    return Response('Friendship accepted!', status=status.HTTP_200_OK)
            except Friendship.DoesNotExist:
                new_friendship1 = Friendship(user1=user1, user2=user2, initiator=True)
                new_friendship2 = Friendship(user1=user2, user2=user1, initiator=False)
                new_friendship1.save()
                new_friendship2.save()
                user1.profile.friends.add(new_friendship1)
                user2.profile.friends.add(new_friendship2)
            return Response('Requested friendship!', status=status.HTTP_200_OK)

        return Response('Invalid input', status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, format=None):
        user1 = request.user
        user2_data = FriendSerializer(data=request.data)
        if user2_data.is_valid(raise_exception=True):
            user2 = user2_data.validated_data['user2']
            if user1 == user2:
                return Response('Username to delete is same as user', status=status.HTTP_400_BAD_REQUEST)

            try:
                friendship1 = Friendship.objects.get(user1=user1, user2=user2)
                friendship1.delete()
                friendship2 = Friendship.objects.get(user1=user2, user2=user1)
                friendship2.delete()
            except Friendship.DoesNotExist:
                return Response('Friendship does not exist', status=status.HTTP_400_BAD_REQUEST)

        return Response('Deleted friendship', status=status.HTTP_200_OK)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer


class UserProfile(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Profile.objects.all()

    def get(self, request, format=None):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response('No such profile', status=status.HTTP_404_NOT_FOUND)
        response = {
            'email': request.user.email,
            'username': request.user.username,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'profile_img_url': profile.profile_img_url,
            'cover_color': profile.cover_color,
            'status_msg': profile.status_msg
        }
        return Response(response)

    def put(self, request, format=None):
        user = request.user
        profile_data = ProfileSerializer(instance=request.user.user, data=request.data)
        if profile_data.is_valid(raise_exception=True):
            profile = profile_data.save()

            return Response(ProfileSerializer(profile).data, status=status.HTTP_200_OK)
        # get rid of pylint error
        return Response('Invalid input', status=status.HTTP_400_BAD_REQUEST)


class SearchUser(APIView):

    def get(self, request, format=None):
        query_term = self.request.query_params.get('query_term')
        queries = query_term.split()
        users = User.objects.filter(
            reduce(operator.or_, (Q(last_name__icontains=name) for name in queries))).distinct()

        result = UserSerializer(users.all(), many=True)
        return Response(result.data, status=status.HTTP_200_OK)


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class UserGroup(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()

    def get(self, request, format=None):
        try:
            groups = UserGroup.objects.get(user=request.user)
        except UserGroup.DoesNotExist:
            return Response('Empty', status=status.HTTP_404_NOT_FOUND)
        response = {
            'hi': 'hi'
        }
        return Response(response)

    def post(self, request, format=None):
        data = {
            'founder': request.user.id,
            'group_name': request.data['group_name'],
        }
        group = GroupSerializer(data=data)
        if not group.is_valid():
            return Response("Group Creation Error.", status=status.HTTP_400_BAD_REQUEST)
        group.save()
        group_obj = Group.objects.get(founder=request.user, group_name=request.data['group_name'])

        return Response(group_obj.group_name)

    @action(detail=True, methods=['get'])
    def get_user_founded_groups(self, request, pk=None):
        user_groups = Group.objects.filter(founder=pk).select_related()
        list_objs = []
        for obj in user_groups:
            temp = {}
            temp['group_id'] = obj.id
            temp['group_name'] = obj.group_name
            list_objs.append(temp)
        return Response(list_objs, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'])
    def delete_group(self, request, pk=None):
        user_groups = Group.objects.filter(founder=pk).select_related()
        group_to_delete = request.POST.get('group_id')
        for group in user_groups:
            if group.id == int(group_to_delete):
                group.delete()
        return Response("Success", status=status.HTTP_200_OK)


class GroupDelete(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    queryset = Group.objects.all()

    def get(self, request, format=None):
        groups = Group.objects.filter(founder=request.user).select_related()
        for group in groups:
            group.delete()
        return Response("Success", status=status.HTTP_200_OK)


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer



