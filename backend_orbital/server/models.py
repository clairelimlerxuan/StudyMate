from inspect import CO_ITERABLE_COROUTINE
from django.db import models
from django.db.models.deletion import CASCADE, DO_NOTHING, RESTRICT, SET_NULL
from django.db.models.fields.related import ForeignKey, ManyToManyField
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

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
        return str(self.user)

    def clean(self):
        errorDict = {}
        facultyName = self.facultyID
        facultyFK = self.majorID.facultyID
        if facultyName != facultyFK:    # check FK of major against faculty
            errorDict['majorID'] = ValidationError('Invalid major selected. MajorID does not match with FacultyID.')
        if errorDict:
            raise ValidationError(errorDict)

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
    moduleCode = models.CharField(max_length=15, primary_key=True)
    title = models.CharField(max_length=100)
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
    moduleID = models.ForeignKey(
        Module,
        on_delete=models.RESTRICT,
        null=True,
        db_column='moduleID',
        blank=True
    )
    title = models.CharField(max_length=50)
    textContent = models.TextField()
    #imageContent = models.ImageField()
    creationDate = models.DateTimeField(auto_now_add=True)
    upvote = models.IntegerField(default=0)
    downvote = models.IntegerField(default=0)
    numOfComments = models.IntegerField(default=0)

    def __str__(self):
        return 'Post #' + str(self.postID) + ': ' + str(self.title)
        
    def clean(self):
        errorDict = {}
        categoryName = self.categoryID
        categoryFK = self.tagID.categoryID
        tagName = self.tagID
        moduleName = self.moduleID

        if categoryName != categoryFK:    # check FK of tag against category
            errorDict['tagID'] = ValidationError('Invalid tag selected. TagID does not match with CategoryID.')
        if moduleName is not None:
            tagFK = moduleName.tagID
            if tagName != tagFK:     # check FK of module against tag 
                errorDict['moduleID'] = ValidationError('Invalid module selected. ModuleID does not match with TagID.')
        elif tagName.tagID == 'Module': 
            errorDict['moduleID'] = ValidationError('No module selected.')
        if errorDict:
            raise ValidationError(errorDict)

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
    replyCount =models.IntegerField(default=0)
    def __str__(self):
        return 'Comment #' + str(self.commentID) + ' to ' + str(self.postID)

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
    #imageContent = models.ImageField()
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Reply #' + str(self.replyID) + ' to ' + str(self.commentID)
    
    def clean(self):
        errorDict = {}
        postName = self.postID
        postFK = self.commentID.postID
        if postName != postFK:    # check FK of comment against post
            errorDict['commentID'] = ValidationError('Invalid comment selected. CommentID does not match with PostID.')
        if errorDict:
            raise ValidationError(errorDict)
    
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
    postID = models.ForeignKey(  
        Post,
        on_delete=models.CASCADE,   # if post is removed, vote is removed too
        db_column = 'postID'
    )

    def __str__(self):
        return str(self.voteID)

    class Meta:
         db_table = 'vote' 
         verbose_name = 'Vote' 
         unique_together = ('userID', 'postID')

class Event(models.Model):
    eventID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(
        MemberUser,
        on_delete=models.CASCADE,   # if user is removed, event is removed too
        db_column = 'userID'
    )
    title = models.CharField(max_length = 50)
    description = models.CharField(max_length = 100)
    date = models.DateField()
    startTime = models.TimeField()
    endTime = models.TimeField()
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Event #' + str(self.eventID) + ': ' + str(self.title) 

    def overlap(self, fixedStart, fixedEnd, newStart, newEnd):
        overlap = False
        if newStart == fixedEnd or newEnd == fixedStart:    # edge cases
            overlap = False
        elif newStart >= fixedStart and newStart <= fixedEnd:   # inner limits
            overlap = True
        elif newEnd >= fixedStart and newEnd <= fixedEnd:   # inner limits
            overlap = True
        elif newStart <= fixedStart and newEnd >= fixedEnd:     # outer limits
            overlap = True
        return overlap

    # "Note, however, that like Model.full_clean(), a model’s clean() method is not invoked when you call your model’s save() method."
    # fixed bug at view.py - editEvent method
    def full_clean(self):
        errorDict = {}
        events = Event.objects.filter(userID = self.userID, date = self.date).exclude(eventID = self.eventID)
        if events.exists():
            for event in events:
                if self.overlap(event.startTime, event.endTime, self.startTime, self.endTime):
                    errorDict['endTime'] = ValidationError('Invalid event. There is an overlap with another event: ' + str(event.date) 
                                            + ', ' + str(event.startTime) + ' - ' + str(event.endTime))
        if self.endTime < self.startTime:
            errorDict['date'] = ValidationError('Invalid timings. Ending time must end before starting time.')
        elif self.endTime <= self.startTime:
             errorDict['date'] = ValidationError('Invalid timings. Ending time must be different from starting time.')
        if errorDict:
            raise ValidationError(errorDict)
    
    class Meta:
        db_table = 'event'
        verbose_name = 'Event'


class Task(models.Model):
    taskID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(
        MemberUser,
        on_delete=models.CASCADE,   # if user is removed, task is removed too
        db_column = 'userID'
    )
    title = models.CharField(max_length = 50)
    completed = models.BooleanField()
    submitted =  models.BooleanField()
    creationDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'Item #' + str(self.taskID) + ': ' + str(self.title)

    class Meta:
        db_table = 'task'
        verbose_name = 'Task'
