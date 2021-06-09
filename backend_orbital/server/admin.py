#from server.models import Comment, Major, MemberUser, Post, Tag, Vote
from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(Faculty)
admin.site.register(Major)
admin.site.register(AdminUser)
admin.site.register(MemberUser)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Module)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Vote)