from rest_framework import serializers
from .models import *

# note to self: 
'''
serialization is the process of converting a model to JSON
use a serializer to specify fields to be present in the JSON representation of the model
1. import models
2. import rest framework serializer
3. create new classes that links the models with their serializer
'''

class MajorSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Major
        fields = "__all__"

class AdminUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AdminUser
        fields = "__all__"  

class MemberUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MemberUser
        fields = "__all__"

class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Tag
        fields = "__all__"  

class PostSerializer(serializers.HyperlinkedModelSerializer):
     class Meta:
        model = Post
        fields = "__all__"

class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = "__all__"

class VoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vote
        fields = "__all__"