from django.urls import include, path
from rest_framework import routers
from . import views
from .views import MemberUserCreateView, current_user, UserList, viewComment, viewPost, viewReply, viewUser

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
# raw string treats backslash (\) as a literal character

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('current_user/', current_user),
    path('users/', UserList.as_view()),

    path('viewpost/<int:pk>/', viewPost),
    path('viewcomment/<int:pk>/', viewComment),
    path('viewreply/<int:pk>/', viewReply),
    path('viewuser/<int:pk>/', viewUser),

    path('addMemberUser/', views.MemberUserCreateView.as_view(), name='addMemberUser'),
]