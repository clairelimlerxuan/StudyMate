from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render

from rest_framework import viewsets
<<<<<<< HEAD

from rest_framework import response
from rest_framework.serializers import Serializer
=======
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be

from .serializers import *
from .models import *

from django.views.generic import CreateView
from django.contrib.auth.models import User
from rest_framework import filters, generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
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

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('eventID')
    serializer_class = EventSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('taskID')
    serializer_class = TaskSerializer


# GET LIST OF POSTS/ COMMENTS/ REPLIES
@api_view(['GET'])
@permission_classes((AllowAny, ))
def postList(request):
    posts = Post.objects.all()[:100]
    serializer = PostSerializer(posts, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def commentList(request):
    comments = Comment.objects.all()[:100]
    serializer = CommentSerializer(comments, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def replyList(request):
    replies = Reply.objects.all()[:100]
    serializer = ReplySerializer(replies, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def tagList(request):
    tags = Tag.objects.all()[:100]
    serializer = TagSerializer(tags, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def categoryList(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def moduleList(request):
    modules = Module.objects.all()
    serializer = ModuleSerializer(modules, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def majorList(request):
    majors = Major.objects.all()
    serializer = MajorSerializer(majors, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def facultyList(request):
    faculties = Faculty.objects.all()
    serializer = FacultySerializer(faculties, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def getPostData(request, pk):
    post = Post.objects.get(postID = pk)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def getCommentData(request, pk):
    comment = Comment.objects.get(commentid = pk)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def getCommentData(request, pk):
    reply = Reply.objects.get(replyid = pk)
    serializer = ReplySerializer(reply, many = False)
    return Response(serializer.data)


# GET INDIVIDUAL POST/ COMMENT/ REPLY
@api_view(['GET'])
@permission_classes((AllowAny, ))
def viewPost(request, postPK):
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def viewComment(request, commentPK):
    try:
        comment = Comment.objects.get(commentID = commentPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such comment.'}, status = status.HTTP_404_NOT_FOUND)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def viewReply(request, replyPK):
    try:
        reply = Reply.objects.get(replyID = replyPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such reply.'}, status = status.HTTP_404_NOT_FOUND)
    reply = Reply.objects.get(replyID = replyPK)
    serializer = ReplySerializer(reply, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny, ))
def viewUser(request, userPK):
    user = MemberUser.objects.get(user_id = userPK)
    serializer = MemberUserSerializer(user, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewEvent(request, eventPK):
    try:
        event = Event.objects.get(eventID = eventPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such event.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.id != event.userID.user_id: 
        return Response({'res' : 'User does not have permission to view this event.'}, status = status.HTTP_403_FORBIDDEN)
    serializer = EventSerializer(event, many = False)
    return Response(serializer.data)

@api_view(['GET'])
def viewTask(request, taskPK):
    try:
        task = Task.objects.get(taskID = taskPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such task.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.id != task.userID.user_id: 
        return Response({'res' : 'User does not have permission to view this task.'}, status = status.HTTP_403_FORBIDDEN)
    serializer = EventSerializer(task, many = False)
    return Response(serializer.data)


# GET USER'S LIST OF POSTS/ COMMENTS/ REPLIES
# get user's posts
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersPost(request, userid):
    posts = Post.objects.filter(userID = userid)
    serializer = PostSerializer(posts, many = True)
    return Response(serializer.data)

# get user's comments
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersComment(request, userid):
    comments = Comment.objects.filter(userID = userid)
    serializer = CommentSerializer(comments, many = True)
    return Response(serializer.data)

# get user's replies
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersReply(request, userid):
    replies = Reply.objects.filter(userID = userid)
    serializer = ReplySerializer(replies, many = True)
    return Response(serializer.data)

# get user's events
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersEvent(request, userid):
    events = Event.objects.filter(userID = userid)
    if request.user.id != userid:
        return Response({'res' : 'User does not have permission to view this event.'}, status = status.HTTP_403_FORBIDDEN)
    serializer = EventSerializer(events, many = True)
    return Response(serializer.data)

# get user's tasks
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersTask(request, userid):
    tasks = Task.objects.filter(userID = userid)
    if request.user.id != userid:
        return Response({'res' : 'User does not have permission to view this task.'}, status = status.HTTP_403_FORBIDDEN)
    serializer = TaskSerializer(tasks, many = True)
    return Response(serializer.data)

# get comment's posts
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCommentParent(request, commentpk):
    comment = Comment.objects.get(commentID = commentpk)
    post = Post.objects.get(postID =  comment.postID.postID)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

<<<<<<< HEAD
#get replies'parent
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getReplyParent(request, replyID):
    reply = Reply.objects.get(replyID = replyID)
    comment = Comment.objects.get(commentID =  reply.commentID.commentID)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes((AllowAny,))
def getUser(request, postID) :
    post = Post.objects.get(postID = postID)
    user = MemberUser.objects.get(user_id = post.userID.user_id)
    serializer = MemberUserSerializer(user, many = False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny,))
def getPostComment(request, postpk):
    comments = Comment.objects.filter(postID = postpk)
    serializer = CommentSerializer(comments, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny,))
def getCommentAnswer(request, commentpk):
    replies = Reply.objects.filter(commentID = commentpk)
    serializer = ReplySerializer(replies, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserbyPK(request, userID) :
    user = User.objects.get(user_id = userID)
    serializer = UserSerializer(user, many= False)
    return Response(serializer.data)



#CREATE FUNCTIOANLITIES
@api_view(['POST'])
def createPost(request):
    data = request.data
    memberid = data['userID']
    member = MemberUser.objects.get(user_id = memberid)
    posttitle = data['title']
    content = data['textContent']
    categoryid= data['categoryID']
    category = Category.objects.get(categoryID = categoryid)
    tagid = data['tagID']
    tag= Tag.objects.get(tagID = tagid)
    try:
        modulecode = data['moduleCode']
        module = Module.objects.get(moduleCode = modulecode)
        post = Post(userID=member, title = posttitle, 
        textContent=content, categoryID=category, tagID = tag, moduleID =module)
        post.save()
        serializer = PostSerializer(post, many= False)
        return Response(serializer.data)
    except:
        post = Post(userID=member, title = posttitle, 
        textContent=content, categoryID=category, tagID = tag)
        post.save()
        serializer = PostSerializer(post, many= False)
        return Response(serializer.data)


@api_view(['POST'])
def createComment(request):
    data = request.data
    memberid = data['userID']
    member = MemberUser.objects.get(user_id = memberid)
    content = data['textContent']
    postid= data['postID']
    post = Post.objects.get(postID = postid)
    post.numOfComments += 1
    comment = Comment(userID=member,  
    textContent=content, postID = post)
    comment.save()
    post.save()
    serializer = CommentSerializer(comment, many= False)
    return Response(serializer.data)

@api_view(['POST'])
def createReply(request):
    data = request.data
    memberid = data['userID']
    member = MemberUser.objects.get(user_id = memberid)
    content = data['textContent']
    postid= data['postID']
    post = Post.objects.get(postID = postid)
    commentid = data["commentID"]
    comment = Comment.objects.get(commentID = commentid)
    comment.replyCount += 1
    reply = Reply.objects.create(userID = member,  
    textContent=content, postID = post, commentID = comment)
    comment.save()
    reply.save()
    serializer = ReplySerializer(reply, many= False)
    return Response(serializer.data)

# DELETE FUNCTIONALITIES
@api_view(['DELETE'])
def deletePost(request, postID, userID):
    user = MemberUser.objects.get(user_id = userID)     
    post = Post.objects.filter(postID = postID, userID = user)
    if userHasPermission(request, userID): 
=======

# check for permission - that user/ admin user
def userHasPermission(request, userPK): 
    return request.user.id == userPK or request.user.is_staff  


# DELETE USER'S INDIVIDUAL POST/ COMMENT/ REPLY
@api_view(['DELETE'])
def deletePost(request, postPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    userPost = Post.objects.filter(postID = postPK, userID = user)
    if userPost.exists() and userHasPermission(request, userPK): 
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
        post.delete()
        return Response({'res' : 'Post deleted successfully.'}, status = status.HTTP_200_OK)
    else: 
        return Response({'res' : 'User does not have permission to delete this post.'}, status = status.HTTP_403_FORBIDDEN)


@api_view(['DELETE'])
def deleteComment(request, commentPK, userPK,):
    try:
        user = MemberUser.objects.get(user_id = userPK)       
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        comment = Comment.objects.get(commentID = commentPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such comment.'}, status = status.HTTP_404_NOT_FOUND)
    userComment = Comment.objects.filter(commentID = commentPK, userID = user)
    if userComment.exists() and userHasPermission(request, userPK):
        comment.delete()
        return Response({'res' : 'Comment deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this comment.'}, status = status.HTTP_403_FORBIDDEN)


@api_view(['DELETE'])
<<<<<<< HEAD
def deleteReply(request, replyPK, userID):
    user = MemberUser.objects.get(user_id = userID)    
    reply = Reply.objects.filter(replyID = replyPK, userID = user)
    if userHasPermission(request, userID):    
=======
def deleteReply(request, replyPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)    
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        reply = Reply.objects.get(replyID = replyPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such reply.'}, status = status.HTTP_404_NOT_FOUND)       
    userReply = Reply.objects.filter(replyID = replyPK, userID = user)
    if userReply.exists() and userHasPermission(request, userPK):    
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
        reply.delete()
        return Response({'res' : 'Reply deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this reply.'}, status = status.HTTP_403_FORBIDDEN)

    
@api_view(['DELETE'])
def deleteEvent(request, eventPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        event = Event.objects.get(eventID = eventPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such event.'}, status = status.HTTP_404_NOT_FOUND)
    userEvent = Event.objects.filter(eventID = eventPK, userID = user)
    if userEvent.exists() and request.user.id == userPK:
        event.delete()
        return Response({'res' : 'Event deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this event.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['DELETE'])
def deleteTask(request, taskPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        task = Task.objects.get(taskID = taskPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such task.'}, status = status.HTTP_404_NOT_FOUND)
    userTask = Task.objects.filter(taskID = taskPK, userID = user)
    if userTask.exists() and request.user.id == userPK:
        task.delete()
        return Response({'res' : 'Task deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this task.'}, status = status.HTTP_403_FORBIDDEN)


# UPDATE USER'S INDIVIDUAL POST/ COMMENT/ REPLY
@api_view(['POST'])
def editProfile(request):
    data = request.data
    user = MemberUser.objects.get(user_id = data['userID'])
    major = Major.objects.get(majorID = data['majorID'])
    faculty = Faculty.objects.get(facultyID = data['facultyID'])
    year = data['year']
    user.yearOfStudy = year
    user.majorID = major
    user.facultyID = faculty
    user.save()
    serializer = MemberUserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def editPost(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    title = data['title']
    textContent = data['textContent']
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        userPost = Post.objects.filter(postID = postPK, userID = user)
        if userPost.exists() and userHasPermission(request, userPK):
            post.title = title
            post.textContent = textContent
            post.save()
            serializer = PostSerializer(post)
            return Response(serializer.data)
        else:
            return Response({'res' : 'User does not have permission to edit this post.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def editComment(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    commentPK  = data['commentID']
    textContent = data['textContent']
    try: 
        user = MemberUser.objects.get(user_id = userPK)   
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        comment = Comment.objects.get(commentID = commentPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such comment.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        userComment = Comment.objects.filter(commentID = commentPK, userID = user, postID = post)
        if userComment.exists() and userHasPermission(request, userPK):
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
    userPK = data['userID']
    postPK = data['postID']
    commentPK  = data['commentID']
    replyPK  = data['replyID']
    textContent = data['textContent']
    try:
        user = MemberUser.objects.get(user_id = userPK)  
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)    
    try:
        comment = Comment.objects.get(commentID = commentPK) 
    except ObjectDoesNotExist:
        return Response({'res' : 'No such comment.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        reply = Reply.objects.get(replyID = replyPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such reply.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        userReply = Reply.objects.filter(replyID = replyPK, userID = user, postID = post, commentID = comment)
        if userReply.exists() and userHasPermission(request, userPK):
            reply.textContent = textContent
            reply.save()
            serializer = ReplySerializer(reply)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


<<<<<<< HEAD
# VOTE FUNCTIONALITIES
@api_view(['GET'])
def getVote(request, votePK):
    voteInstance = Vote.objects.get(voteID = votePK)
    serializer = VoteSerializer(voteInstance, many=False)
    return Response(serializer.data)

def getVoteInstance(request):
    data = request.data
    votePK = data['voteID']
    voteInstance = Vote.objects.get(voteID = votePK)
    return voteInstance

def getVoteType(request):
=======
@api_view(['POST'])
def editEvent(request):
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
    data = request.data
    userPK = data['userID']
    eventPK = data['eventID']
    title = data['title']
    date = data['date']
    startTime = data['startTime']
    endTime = data['endTime']    
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        event = Event.objects.get(eventID = eventPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such event.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        userEvent = Event.objects.filter(eventID = eventPK, userID = user)
        if userEvent.exists() and request.user.id == userPK:
            event.title = title
            event.date = date
            event.startTime = datetime.strptime(startTime, '%H:%M:%S').time()
            event.endTime = datetime.strptime(endTime, '%H:%M:%S').time()
            try:
                event.full_clean()  
                event.save()
                serializer = EventSerializer(event)
                return Response(serializer.data)
            except ValidationError as err:
                return Response(err, status = status.HTTP_403_FORBIDDEN)
        else:
            return Response({'res': 'User does not have permission to edit this event.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def editTask(request):
    data = request.data
    userPK = data['userID']
    taskPK = data['taskID']
    title = data['title']
    isCompleted = data['isCompleted']
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        task = Task.objects.get(taskID = taskPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such task.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
        userTask = Task.objects.filter(taskID = taskPK, userID = user)
        if userTask.exists() and request.user.id == userPK:
            task.title = title
            task.isCompleted = isCompleted
            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this task.'}, status = status.HTTP_403_FORBIDDEN)

    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


<<<<<<< HEAD
@api_view(['GET'])
def getFaculty(request, userID) :
    member = MemberUser.objects.get(user_id = userID)
    faculty = member.facultyID
    serializer = FacultySerializer(faculty, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getMajor(request, userID) :
    member = MemberUser.objects.get(user_id = userID)
    major = member.majorID
    serializer = MajorSerializer(major, many=False)
    return Response(serializer.data)




=======
# VOTE FOR INDIVIDUAL POST
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
@api_view(['POST'])
def upvotePost(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    votePK = data['voteID']
    voteType = data['type']
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    try: 
        vote = Vote.objects.get(voteID = votePK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such vote.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
<<<<<<< HEAD
        data = request.data
        post = Post.objects.get(postID = data["postID"])
        member = MemberUser.objects.get(user_id = data["userID"])
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
            try:
                vote = Vote.objects.get(postID = data["postID"], userID = data['userID'])
                if vote.type == "Upvote" :
                    post.upvote -= 1
                    vote.delete()
                    post.save()
                    serializer = PostSerializer(post)

=======
        userVote = Vote.objects.filter(voteID = votePK, userID = user, postID = post)
        if userVote.exists() and request.user.id == userPK:
            if voteType == 'Upvote': 
                if vote.type == 'Upvote':
                    return Response({'res' : 'User cannot upvote this post. User has already upvoted this post.'}, status = status.HTTP_403_FORBIDDEN)
                elif vote.type == 'Downvote':
                    return Response({'res' : 'User cannot upvote this post. Please unvote this post.'}, status = status.HTTP_403_FORBIDDEN)
                else:
                    vote.type = 'Upvote'
                    vote.save()
                    serializer = VoteSerializer(vote)
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
                    return Response(serializer.data)

            except:
                vote = Vote(type="Upvote",postID= post, userID = member)
                post.upvote += 1
                vote.save()
                post.save()
                serializer = PostSerializer(post)
                return Response(serializer.data)
        else:
<<<<<<< HEAD
            return Response({'res': 'User does not have permission to vote this post.'}, status = status.HTTP_403_FORBIDDEN)
=======
            return Response({'res': 'User does not have permission to upvote this post.'}, status = status.HTTP_403_FORBIDDEN)
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
    else:
        return Response({'res' : 'Please sign in to vote this post'}, status = status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def downvotePost(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    votePK = data['voteID']
    voteType = data['type']
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    try: 
        vote = Vote.objects.get(voteID = votePK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such vote.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
<<<<<<< HEAD
        data = request.data
        post = Post.objects.get(postID = data["postID"])
        member = MemberUser.objects.get(user_id = data["userID"])
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
            try:
                vote = Vote.objects.get(postID = data["postID"], userID = data['userID'])
                if vote.type == "Downvote" :
                    post.downvote -= 1
                    vote.delete()
                    post.save()
=======
        userVote = Vote.objects.filter(voteID = votePK, userID = user, postID = post)
        if userVote.exists() and request.user.id == userPK:
            if voteType == 'Downvote':
                if vote.type == 'Downvote':
                    return Response({'res' : 'User cannot downvote this post. User has already downvoted this post.'}, status = status.HTTP_403_FORBIDDEN)
                elif vote.type == 'Upvote':
                    return Response({'res' : 'User cannot downvote this post. Please unvote this post.'}, status = status.HTTP_403_FORBIDDEN)
                else:
                    vote.type = 'Downvote'
                    vote.save()
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
                    serializer = VoteSerializer(vote)
                    return Response(serializer.data)
            except:
                vote = Vote(type="Downvote",postID= post, userID = member)
                post = Post.objects.get(postID = data["postID"])
                post.downvote += 1 
                post.save()
                vote.save()
                serializer = VoteSerializer(vote)
                return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to downvote this post.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


@api_view(['POST'])
def unvotePost(request):
    data = request.data
    userPK = data['userID']
    postPK = data['postID']
    votePK = data['voteID']
    voteType = data['type']
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        post = Post.objects.get(postID = postPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such post.'}, status = status.HTTP_404_NOT_FOUND)
    try: 
        vote = Vote.objects.get(voteID = votePK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such vote.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.is_authenticated:
<<<<<<< HEAD
        data = request.data
        userPK = getUserPK(request)
        if userHasPermission(request, userPK):
            vote = Vote.objects.get(postID = data["postID"], userID = data['userID'])
            post = Post.objects.get(postID = data["postID"])
            if (vote.type == "Upvote"):
                post.upvote -= 1
=======
        userVote = Vote.objects.filter(voteID = votePK, userID = user, postID = post)
        if userVote.exists() and request.user.id == userPK:
            if voteType == 'None':
                if vote.type == 'None':
                    return Response({'res' : 'User cannot unvote this post. User did not vote for this post.'}, status = status.HTTP_403_FORBIDDEN)
                else:
                    vote.type = 'None'
                    vote.save()
                    serializer = VoteSerializer(vote)
                    return Response(serializer.data)
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be
            else:
                post.downvote -=1
            vote.type = 'None'
            vote.delete()
            serializer = VoteSerializer(vote)
            return Response(serializer.data)
        else:
                return Response({'res': 'User does not have permission to unvote this post.'}, status = status.HTTP_403_FORBIDDEN)
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

@permission_classes((AllowAny,))
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

# SEARCH FUNCTION
class SearchPost(FilterPost):
    search_fields = ['$title']

from django.db.models import Q
class PostSearch(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny, ]

    def get_queryset(self):
        if self.request.method == 'GET':
            query = self.request.GET.get('q', None)

            if query is not None:
                lookups= Q(title__icontains=query)
                results= Post.objects.filter(lookups).distinct()
                queryset = results
            else:
                result = Post.objects.all()
                queryset = result
            return queryset

# '^' Starts-with search.
# '=' Exact matches.
# '@' Full-text search. (Currently only supported Django's PostgreSQL backend.)
# '$' Regex search.    

'''
class MemberUserCreateView(CreateView):
    model = MemberUser
    #fields = "__all__"
    form_class = MemberUserForm
    #success_url = 
'''

# CreateAPIView - for create-only endpoints.
# ListAPIView - for read-only endpoints to represent a collection of model instances.
# RetrieveAPIView - for read-only endpoints to represent a single model instance.
# DestroyAPIView - for delete-only endpoints for a single model instance.
# UpdateAPIView - for update-only endpoints for a single model instance.
# ListCreateAPIView - for read-write endpoints to represent a collection of model instances.
# RetrieveUpdateAPIView - for read or update endpoints to represent a single model instance.
# RetrieveDestroyAPIView - for read or delete endpoints to represent a single model instance.
# RetrieveUpdateDestroyAPIView- for read-write-delete endpoints to represent a single model instance.