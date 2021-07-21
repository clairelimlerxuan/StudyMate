from datetime import date, datetime, timedelta
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
import requests
from rest_framework import viewsets

from rest_framework import response
from rest_framework.serializers import Serializer

from .serializers import *
from .models import *

from django.views.generic import CreateView
from django.contrib.auth.models import User
from rest_framework import filters, generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
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



# check if user can modify one's post/commment/reply
def userHasPermission(request, userPK):
    return request.user.id == userPK or request.user.is_staff



# Read all instances of the item stored in the database.
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



# Read all instances of the lesson offered by the module.
@api_view(['GET'])
def getModuleLessons(request, modulePK):
    url = 'https://api.nusmods.com/v2/2021-2022/modules/{}.json'.format(modulePK)
    response = requests.get(url)
    data = response.json()

    semesterData = data['semesterData'][0]  # list to dict
    timetable = semesterData['timetable']

    module = Module.objects.get(moduleCode = modulePK)
    moduleTimetable = Lesson.objects.filter(moduleID = modulePK)
    if not moduleTimetable.exists():
        for lesson in timetable:
            startHHMM = lesson['startTime']
            startDatetime = startHHMM[0:2] + ':' + startHHMM[2:5] + ":00"
            endHHMM = lesson['endTime']
            endDatetime = endHHMM[0:2] + ':' + endHHMM[2:5] + ":00"
            lesson = Lesson(
                moduleID = module,  # instance of a module
                classNo = lesson['classNo'],
                startTime = startDatetime, 
                endTime = endDatetime,
                day = lesson['day'],
                lessonType = lesson['lessonType']
            )
            lesson.save()
    serializer = LessonSerializer(moduleTimetable, many = True)
    return Response(serializer.data)


   
# Read the instance of the item.
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
@permission_classes((AllowAny, ))
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

#get tag by categoryID
@api_view(['GET'])
def getTag(request, categoryid):
    if categoryid == 1:
        id = "ACAD"
    elif categoryid == 2 :
        id = "NON-ACAD"
    tags = Tag.objects.filter(categoryID = id)
    serializer = TagSerializer(tags, many = True)
    return Response(serializer.data)


# Read all instances of the item that are made by the user.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersPost(request, userid):
    posts = Post.objects.filter(userID = userid)
    serializer = PostSerializer(posts, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersComment(request, userid):
    comments = Comment.objects.filter(userID = userid)
    serializer = CommentSerializer(comments, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersReply(request, userid):
    replies = Reply.objects.filter(userID = userid)
    serializer = ReplySerializer(replies, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersEvent(request, userid):
    
    events = Event.objects.filter(userID = userid)
    serializer = EventSerializer(events, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersLesson(request, userid):
    if request.user.id != userid:
        return Response({'res' : 'User does not have permission to view this list of lesson.'}, status = status.HTTP_403_FORBIDDEN)
    scheduleLessons = ScheduleLesson.objects.filter(userID = userid)
    listOfLessonID = []
    for scheduleLesson in scheduleLessons:
        listOfLessonID.append(scheduleLesson.lessonID.lessonID)
    lessons = Lesson.objects.filter(lessonID__in = listOfLessonID)  # use of __in
    serializer = LessonSerializer(lessons, many = True)
    return Response(serializer.data)

def StrToInt(day):
    if day == 'Monday':
        return 1
    elif day == 'Tuesday':
        return 2
    elif day == 'Wednesday':
        return 3
    elif day == 'Thursday':
        return 4
    elif day == 'Friday':
        return 5
    elif day == 'Saturday':
        return 6
    else:
        return 7

def DayToDates(lessonPK, startDate, endDate):
    lesson = Lesson.objects.get(lessonID = lessonPK)
    dayStr = lesson.day
    dayInt = StrToInt(dayStr)
    listOfDates = []
    week = 0
    for i in range(int((endDate - startDate).days)):
        currDate = startDate + timedelta(i)
        if currDate.isoweekday() == dayInt:
            week += 1
            if week == 7:   # recess week
                continue
            listOfDates.append(currDate)
    return listOfDates

def LessonToTimetable(lessonPK, startDate, endDate):
    lesson = Lesson.objects.get(lessonID = lessonPK)
    listOfDates = DayToDates(lessonPK, startDate, endDate)
    response = []
    for date in listOfDates:
        dateStr = date.strftime('%Y-%m-%d')     # strftime - datetime obj to str, strptime - str to datetime obj
        startTime = lesson.startTime.strftime('%H:%M:%S')
        endTime = lesson.endTime.strftime('%H:%M:%S')
        data = {
            "title": lesson.moduleID.moduleCode,
            "description": lesson.lessonType, 
            "start": dateStr + ' ' + startTime,
            "end": dateStr + ' ' + endTime,
        }
        response.append(data)
    return response

@api_view(['GET'])
def getUsersClass(request, userid):
    scheduleLessons = ScheduleLesson.objects.filter(userID = userid)
    listOfLessonID = []
    for scheduleLesson in scheduleLessons:
        listOfLessonID.append(scheduleLesson.lessonID.lessonID)
    lessons = Lesson.objects.filter(lessonID__in = listOfLessonID)  # use of __in
    result = []
    startDate = date(2021, 8, 9)    # start of ay21/22 sem 1 week 1
    endDate = date(2021, 11, 12)    # end of ay21/22 sem 1 week 13
    for lesson in lessons:
        result.extend(LessonToTimetable(lesson.lessonID, startDate, endDate))
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsersTask(request, userid):
    if request.user.id != userid:
        return Response({'res' : 'User does not have permission to view this list of task.'}, status = status.HTTP_403_FORBIDDEN)
    tasks = Task.objects.filter(userID = userid)
    serializer = TaskSerializer(tasks, many = True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserTodayTask(request, userid) :
    if request.user.id != userid:
        return Response({'res' : 'User does not have permission to view this list of task.'}, status = status.HTTP_403_FORBIDDEN)
    tasks = Task.objects.filter(deadline = datetime(date.today().year, date.today().month, date.today().day))
    serializer = TaskSerializer(tasks, many = True)
    return Response(serializer.data)


# More Read functions
# get the post
@api_view(['GET'])
@permission_classes((AllowAny, ))
def getPostData(request, pk):
    post = Post.objects.get(postID = pk)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

# get the post of the comment
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCommentParent(request, commentpk):
    comment = Comment.objects.get(commentID = commentpk)
    post = Post.objects.get(postID =  comment.postID.postID)
    serializer = PostSerializer(post, many = False)
    return Response(serializer.data)

# get the comment of the reply
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getReplyParent(request, replyID):
    reply = Reply.objects.get(replyID = replyID)
    comment = Comment.objects.get(commentID =  reply.commentID.commentID)
    serializer = CommentSerializer(comment, many = False)
    return Response(serializer.data)

# get the user of the post
@api_view(['GET'])
@permission_classes((AllowAny,))
def getUser(request, postID) :
    post = Post.objects.get(postID = postID)
    user = MemberUser.objects.get(user_id = post.userID.user_id)
    serializer = MemberUserSerializer(user, many = False)
    return Response(serializer.data)

# get all comments of the post
@api_view(['GET'])
@permission_classes((AllowAny,))
def getPostComment(request, postpk):
    comments = Comment.objects.filter(postID = postpk)
    serializer = CommentSerializer(comments, many = True)
    return Response(serializer.data)

# get all replies of the comment
@api_view(['GET'])
@permission_classes((AllowAny,))
def getCommentAnswer(request, commentpk):
    replies = Reply.objects.filter(commentID = commentpk)
    serializer = ReplySerializer(replies, many = True)
    return Response(serializer.data)

# get the user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserbyPK(request, userID) :
    user = User.objects.get(user_id = userID)
    serializer = UserSerializer(user, many= False)
    return Response(serializer.data)

# get all tags of the category
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getTag(request, categoryid):
    tags = Tag.objects.filter(categoryID = categoryid)
    serializer = TagSerializer(tags, many = True)
    return Response(serializer.data)

# get faculty of the user
@api_view(['GET'])
def getFaculty(request, userID) :
    member = MemberUser.objects.get(user_id = userID)
    faculty = member.facultyID
    serializer = FacultySerializer(faculty, many=False)
    return Response(serializer.data)

# get major of the user
@api_view(['GET'])
def getMajor(request, userID) :
    member = MemberUser.objects.get(user_id = userID)
    major = member.majorID
    serializer = MajorSerializer(major, many=False)
    return Response(serializer.data)



# Create an instance of the item.
@api_view(['POST'])
def createPost(request):
    data = request.data
    memberid = data['userID']
    member = User.objects.get(id = memberid)
    posttitle = data['title']
    content = data['textContent']
    categoryid= data['categoryID']
    category = Category.objects.get(categoryID = categoryid)
    tagid = data['tagID']
    tag= Tag.objects.get(tagID = tagid)
    if not userHasPermission(request, memberid):
        return Response({'res' : 'User does not have permission to create this post.'}, status = status.HTTP_403_FORBIDDEN)
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
    member = User.objects.get(id = memberid)
    content = data['textContent']
    postid= data['postID']
    post = Post.objects.get(postID = postid)
    post.numOfComments += 1
    if not userHasPermission(request, memberid):
        return Response({'res' : 'User does not have permission to create this comment.'}, status = status.HTTP_403_FORBIDDEN)
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
    member = User.objects.get(id = memberid)
    content = data['textContent']
    postid= data['postID']
    post = Post.objects.get(postID = postid)
    commentid = data["commentID"]
    comment = Comment.objects.get(commentID = commentid)
    comment.replyCount += 1
    if not userHasPermission(request, memberid):
        return Response({'res' : 'User does not have permission to create this reply.'}, status = status.HTTP_403_FORBIDDEN)
    reply = Reply.objects.create(userID = member,  
    textContent=content, postID = post, commentID = comment)
    comment.save()
    reply.save()
    serializer = ReplySerializer(reply, many= False)
    return Response(serializer.data)

@api_view(['POST'])
def createEvent(request):
    data = request.data
    memberid = data['userID']
    eventTitle = data['title']
    eventDesc = data['description']
    eventStartDateTime = data['start']
    eventEndDateTime = data['end']
    try:
        member = MemberUser.objects.get(user_id = memberid)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.id != memberid:
        return Response({'res' : 'User does not have permission to create this lesson.'}, status = status.HTTP_403_FORBIDDEN)
    event = Event(
        userID = member, title = eventTitle, description = eventDesc,
        start = eventStartDateTime, end = eventEndDateTime
    )
    try:
        event.full_clean()  
        event.save()
        serializer = EventSerializer(event, many = False)
        return Response(serializer.data)
    except ValidationError as err:
        return Response({'res': err.message_dict['end'][0]}, status = status.HTTP_403_FORBIDDEN)

@api_view(['POST'])
def createScheduleLesson(request):
    data = request.data
    memberid = data['userID']
    lessonid = data['lessonID']
    try:
        member = MemberUser.objects.get(user_id = memberid)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try: 
        lesson = Lesson.objects.get(lessonID = lessonid)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such lesson.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.id != memberid:
        return Response({'res' : 'User does not have permission to create this lesson.'}, status = status.HTTP_403_FORBIDDEN)
    scheduleLesson = ScheduleLesson(
        userID = member, lessonID = lesson
    )
    scheduleLesson.save()
    serializer = ScheduleLessonSerializer(scheduleLesson, many = False)
    return Response(serializer.data)

@api_view(['POST'])
def createTask(request):
    data = request.data
    memberid = data['userID']
    taskTitle = data['title']
    taskDeadline = data['deadline']
    taskCompletition = data['completed']
    taskSubmission = data['submitted']
    try:
        member = MemberUser.objects.get(user_id = memberid)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    if request.user.id != memberid:
        return Response({'res' : 'User does not have permission to create this task.'}, status = status.HTTP_403_FORBIDDEN)
    task = Task(
        userID = member, title = taskTitle, deadline = taskDeadline,
        completed = taskCompletition, submitted = taskSubmission
    )
    task.save()
    serializer = TaskSerializer(task, many = False)
    return Response(serializer.data)



# Delete the instance of the item.
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
        post = Post.objects.get(postID = comment.postID.postID)
        post.numOfComments -= 1
        post.save()
        comment.delete()
        return Response({'res' : 'Comment deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this comment.'}, status = status.HTTP_403_FORBIDDEN)

@api_view(['DELETE'])
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
def deleteScheduleLesson(request, scheduleLessonPK, userPK):
    try:
        user = MemberUser.objects.get(user_id = userPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such user.'}, status = status.HTTP_404_NOT_FOUND)
    try:
        scheduleLesson = ScheduleLesson.objects.get(scheduleID = scheduleLessonPK)
    except ObjectDoesNotExist:
        return Response({'res' : 'No such lesson scheduled to the user.'}, status = status.HTTP_404_NOT_FOUND)
    userLesson = ScheduleLesson.objects.filter(scheduleID = scheduleLessonPK, userID = user)
    if userLesson.exists() and request.user.id == userPK:
        scheduleLesson.delete()
        return Response({'res' : 'Lesson scheduled to the user deleted successfully.'}, status = status.HTTP_200_OK)
    else:
        return Response({'res' : 'User does not have permission to delete this lesson.'}, status = status.HTTP_403_FORBIDDEN)

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



# Update the instance of the item.
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

@api_view(['POST'])
def editEvent(request):
    data = request.data
    userPK = data['userID']
    eventPK = data['eventID']
    title = data['title']
    startDateTime = data['start']
    endDateTime = data['end']    
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
            event.start = datetime.strptime(startDateTime, '%Y-%m-%dT%H:%M:%S')
            event.end = datetime.strptime(endDateTime, '%Y-%m-%dT%H:%M:%S')
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
    deadline = data['deadline']
    completed = data['completed']
    submitted = data['submitted']
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
            task.deadline = datetime.strptime(deadline, '%Y-%m-%dT%H:%M:%SZ')
            task.completed = completed
            task.submitted = submitted
            task.save()
            serializer = TaskSerializer(task)
            return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this task.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)



# Vote functions
@api_view(['GET'])
def getVote(request, votePK):
    voteInstance = Vote.objects.get(voteID = votePK)
    serializer = VoteSerializer(voteInstance, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def upvotePost(request):
    if request.user.is_authenticated:
        data = request.data
        post = Post.objects.get(postID = data["postID"])
        member = MemberUser.objects.get(user_id = data["userID"])
        if userHasPermission(request, data['userID']):
            try:
                vote = Vote.objects.get(postID = data["postID"], userID = data['userID'])
                if vote.type == "Upvote" :
                    post.upvote -= 1
                    vote.delete()
                    post.save()
                    serializer = PostSerializer(post)
                    return Response(serializer.data)
                elif vote.type == "Downvote" :
                    return Response({'res' : 
                    "You have upvoted this post. Please unvote first before proceeding to downvote this post"}, 
                    status= status.HTTP_403_FORBIDDEN)
            except:
                vote = Vote(type="Upvote",postID= post, userID = member)
                post.upvote += 1
                vote.save()
                post.save()
                serializer = PostSerializer(post)
                return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to vote this post.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'Please sign in to vote this post'}, status = status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def downvotePost(request):
    if request.user.is_authenticated:
        data = request.data
        post = Post.objects.get(postID = data["postID"])
        member = MemberUser.objects.get(user_id = data["userID"])
        if userHasPermission(request, data['userID']):
            try:
                vote = Vote.objects.get(postID = data["postID"], userID = data['userID'])
                if vote.type == "Downvote" :
                    post.downvote -= 1
                    vote.delete()
                    post.save()
                    serializer = PostSerializer(post)
                    return Response(serializer.data)
                elif vote.type == "Upvote" :
                    return Response({'res' : 
                    "You have downvoted this post. Please unvote first before proceeding to upvote this post"}, 
                    status= status.HTTP_403_FORBIDDEN)
            except:
                vote = Vote(type="Downvote",postID= post, userID = member)
                post = Post.objects.get(postID = data["postID"])
                post.downvote += 1 
                post.save()
                vote.save()
                serializer = PostSerializer(post)
                return Response(serializer.data)
        else:
            return Response({'res': 'User does not have permission to edit this reply.'}, status = status.HTTP_403_FORBIDDEN)
    else:
        return Response({'res' : 'User is not authenticated.'}, status = status.HTTP_403_FORBIDDEN)


# Filter functions
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



# Search functions
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
