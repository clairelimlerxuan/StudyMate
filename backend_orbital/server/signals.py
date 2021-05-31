from django.db.models.signals import post_save
from django.contrib.auth.models import User
from .models import MemberUser


def  member_profile(sender, instance, created, **kwargs):
  if created:
    MemberUser.objects.create(
      user=instance,
      user_id = instance.id,
      username = instance.username,
      userPassword = instance.password,
      userNUSEmail = instance.email,
      creationDate = instance.date_joined
      )
    member = MemberUser.objects.get(user_id = instance.id)
    print('Account created!')

post_save.connect(member_profile, sender=User)
