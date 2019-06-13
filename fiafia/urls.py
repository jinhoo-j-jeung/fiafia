"""fiafia URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.urls import path, include
from rest_framework import routers
from appfiafia.views import *

router = routers.DefaultRouter()
router.register(r'user', UserViewSet, base_name='user')
router.register(r'profile', ProfileViewSet, base_name='profile')
router.register(r'group', GroupViewSet, base_name='group')
router.register(r'notification', NotificationViewSet, base_name='notification')

urlpatterns = [
    path('user_register', UserRegister.as_view(), name='user_register'),
    path('user_login', UserLogin.as_view(), name='user_login'),
    path('user_logout', UserLogout.as_view(), name='user_logout'),
    path('user_delete', UserDelete.as_view(), name='user_delete'),
    path('user_profile', UserProfile.as_view(), name='user_profile'),
    path('user_group', UserGroup.as_view(), name='user_group'),
    path('group_delete', GroupDelete.as_view(), name='group_delete'),
    path('user/friend_user', UserFriendUser.as_view(), name='user_friends'),
    path('user/profile/<str:username>', UserProfile.as_view(), name='user_profile_other'),
    path('user_search', SearchUser.as_view(), name='user_search'),
    url(r'^', include(router.urls)),
]
