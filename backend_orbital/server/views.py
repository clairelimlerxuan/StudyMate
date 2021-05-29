from django.shortcuts import render

from rest_framework import viewsets

from .serializers import *
from .models import *

# Create your views here.

# note to self: 
'''
1. query the database for all models - using primary key (tbc?)
2. pass that database queryset into the serializer to be converted into JSON and rendered
ModelViewSet handles GET and POST for the models
'''

class MajorViewSet(viewsets.ModelViewSet):
    queryset = Major.objects.all().order_by('majorName')
    serializer_class = MajorSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all().order_by('user')
    serializer_class = AdminUserSerializer

class MemberUserViewSet(viewsets.ModelViewSet):
    queryset = MemberUser.objects.all().order_by('user')
    serializer_class = MemberUserSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('tagID')
    serializer_class = TagSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('postID')
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('commentID')
    serializer_class = CommentSerializer

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all().order_by('voteID')
    serializer_class = VoteSerializer