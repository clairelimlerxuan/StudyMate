from django.urls import include, path
from rest_framework import routers
from . import views
from .views import *

router = routers.DefaultRouter()
router.register(r'Faculty', views.FacultyViewSet) 
router.register(r'Major', views.MajorViewSet) 
router.register(r'AdminUser', views.AdminUserViewSet)
router.register(r'MemberUser', views.MemberUserViewSet)
router.register(r'Category', views.CategoryViewSet) 
router.register(r'Tag', views.TagViewSet) 
router.register(r'Module', views.ModuleViewSet)
router.register(r'Post', views.PostViewSet)
router.register(r'Comment', views.CommentViewSet)
router.register(r'Reply', views.ReplyViewSet)
router.register(r'Vote', views.VoteViewSet)
router.register(r'Event', views.EventViewSet)
router.register(r'Task', views.TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),
    path('postuser/<int:postID>/', getUser),

<<<<<<< HEAD

    path('postdata/<int:pk>/', getPostData),
=======
    path('postdata/<int:postpk>/', getPostData),
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be

    path('postlist/', postList),
    path('commentlist/', commentList),
    path('replylist/', replyList),
    path('taglist/', tagList),
    path('categorylist/', categoryList),
    path('modulelist/', moduleList),
    path('majorlist/', majorList),
    path('facultylist/', facultyList),

    path('userpostlist/<int:userid>/',  getUsersPost),
    path('usercommentlist/<int:userid>/', getUsersComment),
    path('userreplylist/<int:userid>/', getUsersReply),
<<<<<<< HEAD
    path('postcomment/<int:postpk>/', getPostComment),
    path('commentanswer/<int:commentpk>/',getCommentAnswer),
    path('getuserbyID/<int:userID>/', getUserbyPK),
    path('getfaculty/<int:userID>/', getFaculty),
    path('getmajor/<int:userID>/', getMajor),

=======
    path('usereventlist/<int:userid>/', getUsersEvent),
    path('usertasklist/<int:userid>/', getUsersTask),
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be

    path('commentparent/<int:commentpk>/', getCommentParent),
    
    path('replyparent/<int:replyID>/', getReplyParent),

    path('viewpost/<int:postPK>/', viewPost),
    path('viewcomment/<int:commentPK>/', viewComment),
    path('viewreply/<int:replyPK>/', viewReply),
    path('viewuser/<int:userPK>/', viewUser),
    path('viewevent/<int:eventPK>/', viewEvent),
    path('viewtask/<int:taskPK>/', viewTask),

    path('createpost/', createPost),
    path('createcomment/', createComment),
    path('createreply/', createReply),

    path('deletepost/<int:postID>/<int:userID>/', deletePost),
    path('deletecomment/<int:commentPK>/<int:userPK>/', deleteComment),
    path('deletereply/<int:replyPK>/<int:userPK>/', deleteReply),
    path('deleteevent/<int:eventPK>/<int:userPK>/', deleteEvent),
    path('deletetask/<int:taskPK>/<int:userPK>/', deleteTask),

    path('editpost/', editPost),
    path('editcomment/', editComment),
    path('editreply/', editReply),
<<<<<<< HEAD
    path('editprofile/', editProfile),
=======
    path('editevent/', editEvent),
    path('edittask/', editTask),
>>>>>>> 7adba78a57015bc9676992ae16cab4320d6f49be

    path('getVote/<int:votePK>/', getVote),
    path('upvotepost/', upvotePost),
    path('downvotepost/', downvotePost),
    path('unvotepost/', unvotePost),

    path('filterbycategory/', FilterByCategory.as_view()),
    path('filterbytag/', FilterByTag.as_view()),            
    path('filterbymodule/', FilterByModule.as_view()),
    path('fitlerbyfaculty/', FilterByFaculty.as_view()),
    path('filterbymajor/', FilterByMajor.as_view()),

    path('search/', PostSearch.as_view()),

    # path('addMemberUser/', views.MemberUserCreateView.as_view(), name='addMemberUser'),
]