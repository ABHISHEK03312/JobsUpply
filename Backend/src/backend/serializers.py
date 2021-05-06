from rest_framework import serializers 
from .models import *
from rest_framework_jwt.settings import api_settings
 
 
class UserSerializer(serializers.ModelSerializer):
    """
    Used for requests after user is created
    """
 
    class Meta:
        model = User
        fields = ('name',
                  'email',
                  'university',
                  'major',
                  'minor',
                  'skills')

class UserSerializerWithToken(serializers.ModelSerializer):
    """
    Used for sign-ups only, generates jwt and hashes password
    """

    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'email', 'password',
                'name',
                'university',
                'major',
                'minor',
                'skills')

class SkillSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = Skill
        fields = ('name',)

class JobQuerySerializer(serializers.ModelSerializer):

    class Meta:
        model = JobQuery
        fields = ('queryText', 'jobList')

class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Courses
        fields = (
            'course',
            'url',
            'about',
            'instructor',
            'university',
            'content',
            'rating',
            'numratings',
            'numenrolled',
            'skills'
        )