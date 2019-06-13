from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from fiafia import settings


# Default Django User model for authentication
class User(AbstractUser):
    email = models.EmailField(unique=True)


class Friendship(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')
    accepted = models.BooleanField(default=False)
    initiator = models.BooleanField()

    class Meta:
        unique_together = ('user1', 'user2')


class Group(models.Model):
    group_name = models.CharField(max_length=50, blank=False, unique=True)
    group_color = models.CharField(default='#455a64', max_length=7, blank=True)
    group_img_url = models.URLField(default='https://noblehour.com/public/layouts/images/group-default-logo.png', max_length=255, blank=True)
    description = models.CharField(max_length=150, blank=True)
    founder = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # members = models.ManyToManyField(User, related_name="members", blank=True)


class UserGroup(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(max_length=128)


class Notification(models.Model):
    uploader = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date_time = models.DateTimeField(auto_created=True)
    message = models.CharField(max_length=300)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_img_url = models.URLField(default='https://i.stack.imgur.com/l60Hf.png', max_length=255, blank=True)
    cover_color = models.CharField(default='#455a64', max_length=7, blank=True)
    status_msg = models.CharField(max_length=100, blank=True)
    friends = models.ManyToManyField(Friendship)
    groups = models.ManyToManyField(Group)
    notifications = models.ManyToManyField(Notification)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
