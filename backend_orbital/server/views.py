from django.shortcuts import render

from rest_framework import viewsets

from .serializers import *
from .models import *
from .forms import *

from django.views.generic import CreateView
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer, UserSerializerWithToken

# Create your views here.

# note to self: 
'''
1. query the database for all models - using primary key (tbc?)
2. pass that database queryset into the serializer to be converted into JSON and rendered ModelViewSet handles GET and POST for the models
'''

@api_view(['GET'])
def current_user(request):
    """
    Determine the current user by their token, and return their data
    """
    
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class UserList(APIView):
    """
    Create a new user. It's called 'UserList' because normally we'd have a get
    method here too, for retrieving a list of all User objects.
    """

    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all().order_by('facultyID')
    serializer_class = FacultySerializer

class MajorViewSet(viewsets.ModelViewSet):
    queryset = Major.objects.all().order_by('majorID')
    serializer_class = MajorSerializer

class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all().order_by('user')
    serializer_class = AdminUserSerializer

class MemberUserViewSet(viewsets.ModelViewSet):
    queryset = MemberUser.objects.all().order_by('user')
    serializer_class = MemberUserSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('categoryID')
    serializer_class = CategorySerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('tagID')
    serializer_class = TagSerializer

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all().order_by('moduleCode')
    serializer_class = ModuleSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('postID')
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('commentID')
    serializer_class = CommentSerializer

class ReplyViewSet(viewsets.ModelViewSet):
    queryset = Reply.objects.all().order_by('replyID')
    serializer_class = ReplySerializer

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all().order_by('voteID')
    serializer_class = VoteSerializer


# READ FUNCTIONALITY
@api_view(['GET'])
def viewPost(request, pk):
    post = Post.objects.get(postID = pk)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewComment(request, pk):
    comment = Comment.objects.get(commentID = pk)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewReply(request, pk):
    reply = Reply.objects.get(replyID = pk)
    serializer = ReplySerializer(reply, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewUser(request, pk):
    user = MemberUser.objects.get(user_id = pk)
    serializer = MemberUserSerializer(user, many = False)
    return Response(serializer.data)

class MemberUserCreateView(CreateView):
    model = MemberUser
    fields = "__all__"
    #success_url = 