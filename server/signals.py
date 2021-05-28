from django.db.models.signals import post_save
from django.contrib.auth.models import User

from .models import MemberUser

def  member_profile(sender, instance, created, **kwargs):
  if created:
    MemberUser.objects.create(
      user=instance,
      userID = instance.userID,
      userPassword = instance.userPassword,
      userNUSEmail = instance.userNUSEmail,
      faculty = instance.faculty,
      major = instance.major,
      yearOfStudy = instance.yearOfStudy,
      creationDate = instance.creationDate
      )
    member = MemberUser.objects.get(userID = instance.userID)
    print('Profile created!')

post_save.connect(member_profile, sender=User)
