
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from .models import UsersAuths
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile
import random
import re
import datetime


#####################UsersAuths Sezializers##############################


ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
MAX_IMAGE_SIZE = 100 * 1024  # 100 KB
MAX_IMAGE_WIDTH = 500
MAX_IMAGE_HEIGHT = 500
DEFAULT_PASSWORD = "Default@123"

class UsersAuthsSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    is_active = serializers.BooleanField(required=False)
    is_staff = serializers.BooleanField(required=False)
  

    class Meta:
        model = UsersAuths
        fields = [
            "userId", "username", "password",
            "firstName", "fatherName", "grandFatherName",
            "motherName", "mothersFatherName", "entrance_exam",
            "region", "zone_or_special_wereda", "city_or_town", "house_number",
            "religion", "handicap",
            "phoneNumber", "batch", "catagory", "role",
            "gender", "nationality", "dob", "picture",
            "is_active", "is_staff"
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'dob': {'required': False}
        }
      
    def get_picture(self, obj):
        request = self.context.get("request")
        if obj.picture and hasattr(obj.picture, "url"):
            return request.build_absolute_uri(obj.picture.url)
        return None
    ############################### VALIDATIONS ##########################################
    def validate_password(self, value):
        if value:
            if len(value) < 8:
                raise serializers.ValidationError("Password must be at least 8 characters long.")
            if not re.search(r'[A-Z]', value):
                raise serializers.ValidationError("Password must contain at least one uppercase letter.")
            if not re.search(r'[a-z]', value):
                raise serializers.ValidationError("Password must contain at least one lowercase letter.")
            if not re.search(r'\d', value):
                raise serializers.ValidationError("Password must contain at least one number.")
            if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', value):
                raise serializers.ValidationError("Password must contain at least one special character.")
        return value

    def validate_name_field(self, value, field_name):
        if value and not re.fullmatch(r'[\u1200-\u137F A-Za-z]+', value):
            raise serializers.ValidationError(
                f"{field_name} should contain only letters (Latin or Amharic) and spaces."
            )
        return value

    def validate_firstName(self, value):
        return self.validate_name_field(value, "First name")

    def validate_fatherName(self, value):
        return self.validate_name_field(value, "Father name")

    def validate_grandFatherName(self, value):
        return self.validate_name_field(value, "Grandfather name")

    def validate_motherName(self, value):
        return self.validate_name_field(value, "Mother name")

    def validate_mothersFatherName(self, value):
        return self.validate_name_field(value, "Mother's father name")

    def validate_phoneNumber(self, value):
        if value and not re.fullmatch(r'\d{7,15}', value):
            raise serializers.ValidationError("Phone number must contain 7-15 digits only.")
        return value

    def validate_dob(self, value):
        if value > datetime.date.today():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

    def validate_picture(self, value):
     if value:
        # check mime type safely
        content_type = getattr(value, 'content_type', None)
        if content_type and content_type not in ALLOWED_IMAGE_TYPES:
            raise serializers.ValidationError("Allowed image types: JPEG, PNG.")
        
        try:
            img = Image.open(value)
            img_format = img.format if img.format else 'PNG'
            img.thumbnail((MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT), Image.LANCZOS)
            
            buffer = BytesIO()
            quality = 85
            while True:
                buffer.seek(0)
                img.save(buffer, format=img_format, quality=quality)
                if buffer.tell() <= MAX_IMAGE_SIZE or quality <= 10:
                    break
                quality -= 5
            value = ContentFile(buffer.getvalue(), name=value.name)
        except Exception as e:
            raise serializers.ValidationError(f"Failed to process the image. Error: {str(e)}")
     return value


    def validate_catagory(self, value):
        valid = [choice[0] for choice in UsersAuths.CATAGORY_CHOICES]
        if value and value not in valid:
            raise serializers.ValidationError(f"Invalid category. Choose from: {valid}")
        return value

    def validate_role(self, value):
        valid = [choice[0] for choice in UsersAuths.ROLE_CHOICES]
        if value and value not in valid:
            raise serializers.ValidationError(f"Invalid role. Choose from: {valid}")
        return value

    def validate_gender(self, value):
        valid = [choice[0] for choice in UsersAuths.GENDER_CHOICES]
        if value and value not in valid:
            raise serializers.ValidationError(f"Invalid gender. Choose from: {valid}")
        return value

    #################################CREATE / UPDATE#############################
    def create(self, validated_data):
        password = validated_data.pop('password', None)

        if not validated_data.get('username') and validated_data.get('firstName'):
            random_number = random.randint(100000, 999999)
            validated_data['username'] = f"{validated_data['firstName'].lower()}-{random_number}"

        if not password:
            password = DEFAULT_PASSWORD
        validated_data['password'] = make_password(password)

        validated_data['is_active'] = True

        return super().create(validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        if password:
            instance.password = make_password(password)

        if 'username' in validated_data:
            instance.username = validated_data.pop('username')
        if 'is_active' in validated_data:
            instance.is_active = validated_data.pop('is_active')
        if 'is_staff' in validated_data:
            instance.is_staff = validated_data.pop('is_staff')

        optional_fields = [
            "firstName", "fatherName", "grandFatherName",
            "motherName", "mothersFatherName", "entrance_exam",
            "region", "zone_or_special_wereda", "city_or_town",
            "house_number", "religion", "handicap",
            "phoneNumber", "batch", "catagory", "role",
            "gender", "nationality", "dob", "picture"
        ]
        for field in optional_fields:
            if field in validated_data:
                setattr(instance, field, validated_data.pop(field))

        return super().update(instance, validated_data)







############################# Login ##########################################################

class UsersAuthsLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError("Invalid username or password")
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Both username and password are required")
        
    
#     ######################### Change Password#####################################################

class ChangePasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField(write_only=True)
        new_password = serializers.CharField(write_only=True)

        def validate_old_password(self, value):
            user = self.context['request'].user
            if not user.check_password(value):
                raise serializers.ValidationError("Old password is incorrect")
            return value

        def validate_new_password(self, value):
            if len(value) < 8:
                raise serializers.ValidationError("New password must be at least 8 characters long")
            
            if not re.search(r'[A-Z]', value):
                raise serializers.ValidationError("New password must contain at least one uppercase letter")
            
            if not re.search(r'[a-z]', value):
                raise serializers.ValidationError("New password must contain at least one lowercase letter")
            
            if not re.search(r'[0-9]', value):
                raise serializers.ValidationError("New password must contain at least one digit")
            
            if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
                raise serializers.ValidationError("New password must contain at least one special character")

            return value

        def save(self, **kwargs):
            user = self.context['request'].user
            user.password = make_password(self.validated_data['new_password'])
            user.save()
            return user




