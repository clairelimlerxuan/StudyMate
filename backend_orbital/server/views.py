from django.shortcuts import render

from rest_framework import viewsets

from .serializers import *
from .models import *
from .forms import *

from django.views.generic import CreateView
from django.contrib.auth.models import User
from rest_framework import filters, generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
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

@permission_classes([IsAdminUser])
class FacultyViewSet(viewsets.ModelViewSet):
    queryset = Faculty.objects.all().order_by('facultyID')
    serializer_class = FacultySerializer

@permission_classes([IsAdminUser])
class MajorViewSet(viewsets.ModelViewSet):
    queryset = Major.objects.all().order_by('majorID')
    serializer_class = MajorSerializer

@permission_classes([IsAdminUser])
class AdminUserViewSet(viewsets.ModelViewSet):
    queryset = AdminUser.objects.all().order_by('user')
    serializer_class = AdminUserSerializer

@permission_classes([IsAdminUser])
class MemberUserViewSet(viewsets.ModelViewSet):
    queryset = MemberUser.objects.all().order_by('user')
    serializer_class = MemberUserSerializer

@permission_classes([IsAdminUser])
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('categoryID')
    serializer_class = CategorySerializer

@permission_classes([IsAdminUser])
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all().order_by('tagID')
    serializer_class = TagSerializer

@permission_classes([IsAdminUser])
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


# check if user can modify one's post/commment/reply
def userHasPermission(request, userPK):
    return request.user.id == userPK or request.user.is_staff


# DELETE FUNCTIONALITIES
@api_view(['DELETE'])
def deletePost(request, postPK, userPK):
    user = MemberUser.objects.get(user_id = userPK)     
    post = Post.objects.filter(postID = postPK, userID = user)
    if userHasPermission(request, userPK): 
        post.delete()
        return Response({'res' : 'Post deleted successfully.'}, status = status.HTTP_200_OK)
    else: 
        return Response({'res' : 'User does not have permission to delete this post.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def deleteComment(request, commentPK, userPK,):
    user = MemberUser.objects.get(user_id = userPK)       
    comment = Comment.objects.filter(commentID = commentPK, userID = user)
    if userHasPermission(request, userPK):
        comment.delete()
        return Response({'res' : 'Comment deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this comment.'}, status = status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def deleteReply(request, replyPK, userPK):
    user = MemberUser.objects.get(user_id = userPK)    
    reply = Reply.objects.filter(replyID = replyPK, userID = user)
    if userHasPermission(request, userPK):    
        reply.delete()
        return Response({'res' : 'Reply deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this reply.'}, status = status.HTTP_404_NOT_FOUND)


# UPDATE FUNCTIONALITIES
@api_view(['POST'])
def editPost(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    title = data['title']
    textContent = data['textContent']

    if request.user.is_authenticated:
        post = Post.objects.get(postID = postPK)
        if userHasPermission(request, userPK):
            post.title = title
            post.textContent = textContent
            post.save()
            serializer = PostSerializer(post)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this post.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def editComment(request):
    data = request.data
    userPK = data['userID']
    commentPK  = data['commentID']
    textContent = data['textContent']

    if request.user.is_authenticated:
        comment = Comment.objects.get(commentID = commentPK)
        if userHasPermission(request, userPK):
            comment.textContent = textContent
            comment.save()
            serializer = CommentSerializer(comment)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this comment.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def editReply(request):
    data = request.data
    userPK = request['userID']
    replyPK  = data['replyID']
    textContent = data['textContent']

    if request.user.is_authenticated:
        reply = Reply.objects.get(replyID = replyPK)
        if userHasPermission(request, userPK):
            reply.textContent = textContent
            reply.save()
            serializer = ReplySerializer(reply)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


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

def getUserPK(request):
    data = request.data
    userPK = data['userID']
    return userPK

@api_view(['POST'])
def upvotePost(request):
    if request.user.is_authenticated:
        voteType = getVoteType(request)
        vote = getVoteInstance(request)
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
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
        else:
            return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def downvotePost(request):
    if request.user.is_authenticated:
        voteType = getVoteType(request)
        vote = getVoteInstance(request)
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
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
        else:
            return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def unvotePost(request):
    if request.user.is_authenticated:
        voteType = getVoteType(request)
        vote = getVoteInstance(request)
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
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
        else:
                return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)
    

# FILTER FUNCTIONS
class FilterPost(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter]

class FilterUser(generics.ListAPIView):
    queryset = MemberUser.objects.all()
    serializer_class = MemberUserSerializer
    filter_backends = [filters.SearchFilter]

class FilterByCategory(FilterPost):
    search_fields = ['=categoryID__categoryID'] # filter via foreign key

class FilterByTag(FilterPost):
    search_fields = ['$tagID__tagID']   # = not working if search contains whitespace

class FilterByModule(FilterPost):
    search_fields = ['=moduleID__moduleCode']   # filter via foreign key

class FilterByFaculty(FilterUser):
    search_fields = ['=facultyID__facultyID']  # filter via foreign key

class FilterByMajor(FilterUser):
    search_fields = ['=majorID__majorID']  # filter via foreign key

# '^' Starts-with search.
# '=' Exact matches.
# '@' Full-text search. (Currently only supported Django's PostgreSQL backend.)
# '$' Regex search.    


class MemberUserCreateView(CreateView):
    model = MemberUser
    fields = "__all__"
    #success_url = 

# CreateAPIView - for create-only endpoints.
# ListAPIView - for read-only endpoints to represent a collection of model instances.
# RetrieveAPIView - for read-only endpoints to represent a single model instance.
# DestroyAPIView - for delete-only endpoints for a single model instance.
# UpdateAPIView - for update-only endpoints for a single model instance.
# ListCreateAPIView - for read-write endpoints to represent a collection of model instances.
# RetrieveUpdateAPIView - for read or update endpoints to represent a single model instance.
# RetrieveDestroyAPIView - for read or delete endpoints to represent a single model instance.
# RetrieveUpdateDestroyAPIView- for read-write-delete endpoints to represent a single model instance.