from rest_framework import serializers
from .models import *
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User


# note to self: 
'''
serialization is the process of converting a model to JSON

.clean() method will not be called as part of serializer validation, as it would be if using a ModelForm.
add validate() method
'''

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'id', 'is_staff')


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    email = serializers.CharField(write_only = True)
    password = serializers.CharField(write_only=True)
    
    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        email = validated_data.pop('email', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        if email is not None :
            instance.email = email
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password', 'email')


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    
    """
    A ModelSerializer that takes an additional `fields` and 'exclude' argument that
    controls which fields should be displayed.
    """
    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)
        exclude = kwargs.pop('exclude', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields.keys())
            for field_name in existing - allowed:
                self.fields.pop(field_name)

        if exclude is not None:
            not_allowed = set(exclude)
            for exclude_name in not_allowed:
                self.fields.pop(exclude_name)


class FacultySerializer(serializers.ModelSerializer): 
    
    class Meta:
        model = Faculty
        fields = "__all__"


class MajorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Major
        fields = "__all__"


class AdminUserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = AdminUser
        fields = "__all__"  


class MemberUserSerializer(serializers.ModelSerializer):    
    
    def validate(self, attrs):
        errorDict = {}
        facultyName = attrs['facultyID']
        facultyFK = attrs['majorID'].facultyID
        if facultyName != facultyFK:   # check FK of major against faculty
            errorDict['majorID'] = ValidationError('Invalid major selected. MajorID does not match with FacultyID.')
        if errorDict:
            raise ValidationError(errorDict)
        else:
            return attrs

    class Meta:
        model = MemberUser
        fields = "__all__"


class CategorySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Category
        fields = "__all__"


class TagSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Tag
        fields = "__all__"


class ModuleSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Module
        fields = "__all__"  


class PostSerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):
        errorDict = {}
        categoryName = attrs['categoryID']
        categoryFK = attrs['tagID'].categoryID
        tagName = attrs['tagID']
        moduleName = attrs['moduleID']

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
        else:
            return attrs

    class Meta:
        model = Post
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Comment
        fields = "__all__"


class ReplySerializer(serializers.ModelSerializer):
    
    def validate(self, attrs):    # check FK of comment against post
        errorDict = {}
        postName = attrs['postID']
        postFK = attrs['commentID'].postID
        if postName != postFK:   # check FK of major against faculty
            errorDict['commentID'] = ValidationError('Invalid comment selected. CommentID does not match with PostID.')
        if errorDict:
            raise ValidationError(errorDict)
        else:
            return attrs

    class Meta:
        model = Reply
        fields = '__all__'


class VoteSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Vote
        fields = "__all__"


class EventSerializer(serializers.ModelSerializer):
    
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

    def validate(self, attrs):
        errorDict = {}
        userInst = attrs['userID']
        startDateTimeInst = attrs['startDateTime']
        endDateTimeInst = attrs['endDateTime']

        events = Event.objects.filter(userID = userInst)
        if events.exists():
            for event in events:
                if self.overlap(event.startDateTime, event.endDateTime, startDateTimeInst, endDateTimeInst):
                    errorDict['endDateTime'] = ValidationError('Invalid event. There is an overlap with another event: ' + str(event.startDateTime) + ' - ' + str(event.endDateTime))
        if endDateTimeInst < startDateTimeInst:
            errorDict['endDateTime'] = ValidationError('Invalid timings. Ending time must end before starting time.')
        elif endDateTimeInst <= startDateTimeInst:
             errorDict['endDateTime'] = ValidationError('Invalid timings. Ending time must be different from starting time.')
        if errorDict:
            raise ValidationError(errorDict)
        else:
            return attrs

    class Meta:
        model = Event
        fields = "__all__"


class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = "__all__"


class ScheduleLessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = ScheduleLesson
        fields = "__all__"
        

class TaskSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Task
        fields = "__all__"