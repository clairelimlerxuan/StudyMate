from rest_framework import serializers
from .models import *
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User


# note to self: 
'''
serialization is the process of converting a model to JSON
use a serializer to specify fields to be present in the JSON representation of the model
1. import models
2. import rest framework serializer
3. create new classes that links the models with their serializer
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
     class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class ReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = Reply
        fields = '__all__'

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = "__all__"