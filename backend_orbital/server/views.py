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


# READ FUNCTIONALITIES
@api_view(['GET'])
def viewPost(request, postPK):
    post = Post.objects.get(postID = postPK)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewComment(request, commentPK):
    comment = Comment.objects.get(commentID = commentPK)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewReply(request, replyPK):
    reply = Reply.objects.get(replyID = replyPK)
    serializer = ReplySerializer(reply, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewUser(request, userPK):
    user = MemberUser.objects.get(user_id = userPK)
    serializer = MemberUserSerializer(user, many = False)
    return Response(serializer.data)


# DELETE FUNCTIONALITIES
@api_view(['DELETE'])
def deletePost(request, postPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)     
        post = Post.objects.filter(postID = postPK, userID = user)
        post.delete()
        return Response({'res' : 'Post deleted successfully.'}, status = status.HTTP_200_OK)
    except: 
        return Response({'res' : 'User did not make this post.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def deleteComment(request, commentPK, userPK,):
    try:
        user = MemberUser.objects.get(user_id = userPK)       
        comment = Comment.objects.filter(commentID = commentPK, userID = user)
        comment.delete()
        return Response({'res' : 'Comment deleted successfully.'}, status = status.HTTP_200_OK)
    except:
        return Response({'res' : 'User did not make this comment in the post.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def deleteReply(request, replyPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)    
        reply = Reply.objects.filter(replyID = replyPK, userID = user)
        reply.delete()
        return Response({'res' : 'Reply deleted successfully.'}, status = status.HTTP_200_OK)
    except:
        return Response({'res' : 'User did not reply to this comment in the post.'}, status = status.HTTP_404_NOT_FOUND)


# VOTE FUNCTIONALITIES
def getVoteInstance(request):
    data = request.data
    votePK = data['voteID']
    voteInstance = Vote.objects.get(voteID = votePK)
    return voteInstance

def getVoteType(request):
    data = request.data
    voteType = data['type']
    return voteType

@api_view(['POST'])
def upvotePost(request):
    voteType = getVoteType(request)
    vote = getVoteInstance(request)
    if voteType == 'Upvote': 
        if vote.type == 'Upvote':
            return Response({'res' : 'User cannot upvote this post. User has already upvoted this post.'}, status = status.HTTP_403_FORBIDDEN)
        elif vote.type == 'Downvote':
            return Response({'res' : 'User cannot upvote this post. Please unvote this post.'}, status = status.HTTP_403_FORBIDDEN)
        else:
            vote.type = 'Upvote'
            vote.save()
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
    else:
        return Response({'res' : 'Invalid data.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def downvotePost(request):
    voteType = getVoteType(request)
    vote = getVoteInstance(request)
    if voteType == 'Downvote':
        if vote.type == 'Downvote':
            return Response({'res' : 'User cannot downvote this post. User has already downvoted this post.'}, status = status.HTTP_403_FORBIDDEN)
        elif vote.type == 'Upvote':
            return Response({'res' : 'User cannot downvote this post. Please unvote this post.'}, status = status.HTTP_403_FORBIDDEN)
        else:
            vote.type = 'Downvote'
            vote.save()
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
    else:
        return Response({'res' : 'Invalid data.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def unvotePost(request):
    voteType = getVoteType(request)
    vote = getVoteInstance(request)
    if voteType == 'None':
        if vote.type == 'None':
            return Response({'res' : 'User cannot unvote this post. User did not vote for this post.'}, status = status.HTTP_403_FORBIDDEN)
        else:
            vote.type = 'None'
            vote.save()
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
    else:
        return Response({'res' : 'Invalid data.'}, status = status.HTTP_404_NOT_FOUND)


class MemberUserCreateView(CreateView):
    model = MemberUser
    fields = "__all__"
    #success_url = 