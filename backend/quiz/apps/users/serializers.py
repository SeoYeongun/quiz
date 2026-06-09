from django.contrib.auth import authenticate
from rest_framework import serializers

from quiz.apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'password',
            'email',
            'nickname',
            'profile_image',
            'bio',
            'is_staff',
            'date_joined',
        )
        read_only_fields = ('id', 'is_staff', 'date_joined')

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password_confirm', 'email', 'nickname')
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'nickname': {'required': False, 'allow_blank': True},
        }

    def validate_email(self, value):
        if not value:
            return None
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError(
                {'password_confirm': '비밀번호가 일치하지 않습니다.'},
            )
        if not attrs.get('email'):
            attrs['email'] = None
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        if validated_data.get('email') in (None, ''):
            validated_data['email'] = None
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(
            username=attrs['username'],
            password=attrs['password'],
        )
        if user is None:
            raise serializers.ValidationError(
                '아이디 또는 비밀번호가 올바르지 않습니다.',
            )
        if not user.is_active:
            raise serializers.ValidationError('비활성화된 계정입니다.')
        attrs['user'] = user
        return attrs
