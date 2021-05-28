from server.models import Comment, Major, MemberUser, Post, Tag, Vote
from django.contrib import admin

# Register your models here.

admin.site.register(MemberUser)
admin.site.register(Post)
admin.site.register(Comment)
admin.site.register(Vote)
admin.site.register(Tag)

admin.site.register(Major)