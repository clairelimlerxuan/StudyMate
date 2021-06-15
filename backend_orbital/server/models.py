from inspect import CO_ITERABLE_COROUTINE
from django.db import models
from django.db.models.deletion import CASCADE, DO_NOTHING, RESTRICT, SET_NULL
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.contrib.auth.models import User

# Create your models here.

class Faculty(models.Model):
    facultyID = models.CharField(max_length=10, primary_key=True)
    facultyName = models.CharField(max_length=50)

    def __str__(self):
        return self.facultyName

    class Meta:
        db_table = 'faculty'
        verbose_name = 'Faculty'
        verbose_name_plural = 'Faculties'


class Major(models.Model):
    majorID = models.CharField(max_length=10, primary_key=True)
    majorName = models.CharField(max_length=100)
    facultyID = models.ForeignKey(
        Faculty,
        on_delete=models.RESTRICT,
        db_column = 'facultyID'
    )

    def __str__(self):
        return self.majorName

    class Meta:
        db_table = 'major'     
        verbose_name = 'Major'


class AdminUser(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )
    adminUserPassword = models.CharField(max_length=30)

    def __str__(self):
        return self.user

    class Meta:
        db_table = 'adminUser'
        verbose_name = 'Admin User'  
        verbose_name_plural = 'Admin Users'  


class MemberUser(models.Model):
    YEAR_OF_STUDY_CHOICES = (
        ('1', 'Year 1'),
        ('2', 'Year 2'),
        ('3', 'Year 3'),
        ('4', 'Year 4')
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True
    )
    userPassword = models.CharField(max_length=100)
    userNUSEmail = models.EmailField()
    username = models.CharField(max_length=100)
    facultyID = models.ForeignKey(
        Faculty,
        on_delete=models.RESTRICT,
        null=True,
        db_column='facultyID'
    )
    majorID = models.ForeignKey(    # CEG belongs to SOC and ENGI! -> *:* relationship
        Major,
        on_delete=models.RESTRICT, 
        null=True,
        db_column='majorID'
    )
    yearOfStudy = models.CharField(max_length=6, choices=YEAR_OF_STUDY_CHOICES, blank = True)     # add constraint
    creationDate = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.username

    class Meta:
         db_table = 'memberUser'
         verbose_name = 'Member User'  
         verbose_name_plural = 'Member Users'  


class Category(models.Model):
    categoryID = models.CharField(max_length=20, primary_key=True)
    categoryName = models.CharField(max_length=50)

    def __str__(self):
        return self.categoryName

    class Meta:
        db_table = 'category'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'


class Tag(models.Model):
    tagID = models.CharField(max_length=20, primary_key=True) 
    tagName = models.CharField(max_length=50)
    categoryID = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        db_column = 'categoryID'
    )

    def __str__(self):
        return self.tagName

    class Meta:
         db_table = 'tag'
         verbose_name = 'Tag'  


class Module(models.Model):
    moduleCode = models.CharField(max_length=7, primary_key=True)
    title = models.CharField(max_length=50)
    tagID = models.ForeignKey(
        Tag,
        on_delete=models.RESTRICT,
        null=True,
        db_column = 'tagID'
    )

    def __str__(self):
        return self.moduleCode
    
    class Meta:
        db_table = 'module'
        verbose_name = 'Module'
    

class Post(models.Model):
    postID = models.AutoField(primary_key=True)  # auto increment id
    userID = models.ForeignKey(
        MemberUser, 
        on_delete=models.SET_NULL,  # if user is removed, post is still there 
        blank=True, 
        null=True,
        db_column = 'userID'
    )
    categoryID = models.ForeignKey(
        Category,
        on_delete=models.RESTRICT,
        db_column = 'categoryID'
    )
    tagID = models.ForeignKey(
        Tag,
        on_delete=models.RESTRICT,
        db_column = 'tagID'
    )
    moduleID = models.OneToOneField(
        Module,
        on_delete=models.RESTRICT,
        null=True,
        db_column='moduleID'
    )
    title = models.CharField(max_length=50)
    textContent = models.TextField()
    # imageContent = 
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Post Title (' + self.title + ')'

    class Meta:
         db_table = 'post' 
         verbose_name = 'Post'


class Comment(models.Model):
    commentID = models.AutoField(primary_key=True)  # auto increment id
    userID = models.ForeignKey(
        MemberUser, 
        on_delete=models.SET_NULL,  # if user is removed, comment is still there
        blank=True, 
        null=True,
        db_column = 'userID'
    )
    postID = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,   # if post is removed, comment is removed too 
        db_column = 'postID'
    )
    textContent = models.TextField()
    # imageContent = models.ImageField()
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Comment ID (' + str(self.commentID) + ')'

    class Meta:
         db_table = 'comment' 
         verbose_name = 'Comment'  


class Reply(models.Model):
    replyID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(
        MemberUser, 
        on_delete=models.SET_NULL,  # if user is removed, reply is still there
        blank=True, 
        null=True,
        db_column = 'userID'
    )
    postID = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,   # if post is removed, reply is removed too 
        db_column = 'postID'
    )
    commentID = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,   # if comment is removed, reply is removed
        db_column = 'commentID'
    )
    textContent = models.TextField()
    # imageContent = models.ImageField()
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Reply ID (' + str(self.replyID) + ')'
    
    class Meta:
        db_table = 'reply'
        verbose_name = 'Reply'
        verbose_name_plural = 'Replies'
    

class Vote(models.Model):

    TYPE_CHOICES = (
        ('Upvote', 'Upvote'),
        ('Downvote', 'Downvote'),
        ('None', 'None')
    )

    voteID = models.AutoField(primary_key=True)     # auto increment id
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='None')
    userID = models.ForeignKey(
        MemberUser,
        on_delete=models.CASCADE,  # if user is removed, vote is removed too
        db_column = 'userID'
    )
    postID = models.ForeignKey(     # changed from 1:1 to 1:*
        Post,
        on_delete=models.CASCADE,   # if post is removed, vote is removed too
        db_column = 'postID'
    )

    def __str__(self):
        return str(self.voteID)

    class Meta:
         db_table = 'vote' 
         verbose_name = 'Vote' 
         unique_together=('userID', 'postID')