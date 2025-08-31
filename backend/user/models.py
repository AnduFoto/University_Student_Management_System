from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password
import random


# Create your models here.

# class UsersAuthsManager(BaseUserManager):
#     def create_user(self, username=None, userId=None, password=None, **extra_fields):
#         if not userId:
#             raise ValueError('The userId must be set')
        
#         if password is None:
#             password = "Default@123"

#         if not username and 'firstName' in extra_fields:
#             random_number = random.randint(100000, 999999)
#             username = f"{extra_fields['firstName'].lower()}-{random_number}"

#         user = self.model(username=username, userId=userId, **extra_fields)
#         user.password = make_password(password)
#         user.save(using=self._db)
#         return user
    
#     def create_superuser(self, username, userId, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
        
#         if extra_fields.get('is_staff') is not True:
#             raise ValueError('Superuser must have is_staff=True.')
#         if extra_fields.get('is_superuser') is not True:
#             raise ValueError('Superuser must have is_superuser=True.')
        
#         return self.create_user(username, userId, password, **extra_fields)


# class UsersAuths(AbstractBaseUser, PermissionsMixin):

#     firstName = models.CharField(max_length=100)
#     fatherName = models.CharField(max_length=100)
#     grandFatherName = models.CharField(max_length=100)
#     motherName = models.CharField(max_length=100, null=True, blank=True)
#     mothersFatherName = models.CharField(max_length=100, null=True, blank=True)
#     phoneNumber = models.CharField(max_length=20, null=True, blank=True)
#     batch = models.CharField(max_length=100, null=True, blank=True)
#     entrance_exam = models.CharField(max_length=100, null=True, blank=True)

#     CATAGORY_CHOICES = [
#         ('Natural Science', 'Natural Science'),
#         ('Social Science', 'Social Science'),
#         ('Other', 'Other'),
#     ]
#     catagory = models.CharField(max_length=30, choices=CATAGORY_CHOICES, null=True, blank=True)

#     ROLE_CHOICES = [
#         ('Student', 'Student'),
#         ('Teacher', 'Teacher'),
#         ('Department Head', 'Department Head'),
#         ('College Head', 'College Head'),
#         ('President', 'President'),
#         ('Admin', 'Admin'),
#     ]
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', blank=True)

#     GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
#     gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

#     nationality = models.CharField(max_length=100, blank=True)
#     dob = models.DateField(blank=True, null=True)

#     userId = models.CharField(max_length=100, unique=True, null=True, blank=True)
#     username = models.CharField(max_length=150, primary_key=True)
#     password = models.CharField(max_length=255, default=make_password("Default@123"))
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     picture = models.ImageField(upload_to='profile_image/', null=True, blank=True)
#     last_login = models.DateTimeField(blank=True, null=True)

#     region = models.CharField(max_length=100, null=True, blank=True)
#     zone_or_special_wereda = models.CharField(max_length=100, null=True, blank=True)
#     city_or_town = models.CharField(max_length=100, null=True, blank=True)
#     house_number = models.CharField(max_length=50, null=True, blank=True)
#     religion = models.CharField(max_length=50, null=True, blank=True)
#     handicap = models.CharField(max_length=50, null=True, blank=True)

#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)

#     objects = UsersAuthsManager()

#     USERNAME_FIELD = 'username'
#     REQUIRED_FIELDS = []

#     def __str__(self):
#         return f"{self.userId} - {self.username}"

#     def save(self, *args, **kwargs):
        
#         if not self.username and self.firstName:
#                 self.username = f"{self.firstName.lower()}-{self.user_count:06d}"
        
#         if self.password and not self.password.startswith('pbkdf2_'):
#             self.password = make_password(self.password)
#         super().save(*args, **kwargs)

#     def is_using_default_password(self):
#         from django.contrib.auth.hashers import check_password
#         return check_password("Default@123", self.password)




########################################################################################################







# import random
# from io import BytesIO
# from PIL import Image
# from django.db import models
# from django.contrib.auth.hashers import make_password
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# from django.core.files.base import ContentFile

# ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
# MAX_IMAGE_SIZE = 100 * 1024  # 100 KB
# MAX_IMAGE_WIDTH = 500
# MAX_IMAGE_HEIGHT = 500
# DEFAULT_PASSWORD = "Default@123"


# class UsersAuthsManager(BaseUserManager):
#     def generate_unique_username(self, firstName):
#         """Generate a unique username: firstname-XXXXXX (6-digit random number)"""
#         base = firstName.lower()
#         while True:
#             random_number = random.randint(100000, 999999)
#             username = f"{base}-{random_number}"
#             if not self.model.objects.filter(username=username).exists():
#                 return username

#     def create_user(self, username=None, userId=None, password=None, **extra_fields):
#         if not userId:
#             raise ValueError('The userId must be set')

#         if password is None:
#             password = DEFAULT_PASSWORD

#         if not username and 'firstName' in extra_fields:
#             username = self.generate_unique_username(extra_fields['firstName'])

#         user = self.model(username=username, userId=userId, **extra_fields)
#         user.set_password(password)  # ✅ use overridden method
#         user.save(using=self._db)
#         return user
    
#     def create_superuser(self, username, userId, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
        
#         if extra_fields.get('is_staff') is not True:
#             raise ValueError('Superuser must have is_staff=True.')
#         if extra_fields.get('is_superuser') is not True:
#             raise ValueError('Superuser must have is_superuser=True.')
        
#         return self.create_user(username, userId, password, **extra_fields)


# class UsersAuths(AbstractBaseUser, PermissionsMixin):
#     firstName = models.CharField(max_length=200)
#     fatherName = models.CharField(max_length=200)
#     grandFatherName = models.CharField(max_length=200)
#     motherName = models.CharField(max_length=200, null=True, blank=True)
#     mothersFatherName = models.CharField(max_length=200, null=True, blank=True)
#     phoneNumber = models.CharField(max_length=20, null=True, blank=True)
#     batch = models.CharField(max_length=100, null=True, blank=True)
#     entrance_exam = models.CharField(max_length=100, null=True, blank=True)

#     CATAGORY_CHOICES = [
#         ('Natural Science', 'Natural Science'),
#         ('Social Science', 'Social Science'),
#         ('Other', 'Other'),
#     ]
#     catagory = models.CharField(max_length=50, choices=CATAGORY_CHOICES, null=True, blank=True)

#     ROLE_CHOICES = [
#         ('student', 'student'),
#         ('registeral', 'registeral'),
#         ('teacher', 'teacher'),
#          ('department Head', 'department Head'),
#          ('college Head', 'college Head'),
#          ('president', 'president'),
#          ('admin', 'admin'), 
#      ]
#     role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student', blank=True)

#     GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
#     gender = models.CharField(max_length=50, choices=GENDER_CHOICES)

#     nationality = models.CharField(max_length=200, blank=True)
#     dob = models.DateField(blank=True, null=True)

#     userId = models.CharField(max_length=120, unique=True, null=True, blank=True)
#     username = models.CharField(max_length=150, primary_key=True)
#     password = models.CharField(max_length=255, default=make_password(DEFAULT_PASSWORD))
#     is_default_password = models.BooleanField(default=True)  
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     picture = models.ImageField(upload_to='profile_image/', null=True, blank=True)
#     last_login = models.DateTimeField(blank=True, null=True)

#     region = models.CharField(max_length=200, null=True, blank=True)
#     zone_or_special_wereda = models.CharField(max_length=200, null=True, blank=True)
#     city_or_town = models.CharField(max_length=200, null=True, blank=True)
#     house_number = models.CharField(max_length=200, null=True, blank=True)
#     religion = models.CharField(max_length=200, null=True, blank=True)

#     CASE_CHOICES = [
#         ('normal', 'normal'),
#         ('case', 'case'),
#     ]
#     handicap = models.CharField(max_length=200, null=True, choices=CASE_CHOICES, default='normal', blank=True)

#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     POSITION_CHOICES = [
#         ('collage_head', 'collage_head'),
#         ('department_head', 'department_head'),
#         ('peresdant', 'peresdant'),
#          ('registeral', 'registeral'),
#          ('admin', 'admin'),
#          ('teacher', 'teacher'),
#          ('student', 'student'), 
#      ]

#     position= models.CharField(max_length=100, null=True, blank=True)

#     objects = UsersAuthsManager()

#     USERNAME_FIELD = 'username'
    

#     def __str__(self):
#         return f"{self.userId} - {self.username}"

#     def set_password(self, raw_password):
#         """Override set_password to update default password flag"""
#         self.password = make_password(raw_password)
#         self.is_default_password = (raw_password == DEFAULT_PASSWORD)
#         self._password = raw_password

#     def save(self, *args, **kwargs):
#         # Only generate username if it does not already exist
#         if not self.username and self.firstName:
#             self.username = UsersAuths.objects.generate_unique_username(self.firstName)

#         # Prevent username changes if it already exists
#         if self.pk and UsersAuths.objects.filter(pk=self.pk).exists():
#             orig = UsersAuths.objects.get(pk=self.pk)
#             self.username = orig.username

#         # Ensure password is always hashed + flag updated
#         if self.password and not self.password.startswith('pbkdf2_'):
#             self.set_password(self.password)

#         # Process image to fit constraints
#         if self.picture:
#             try:
#                 img = Image.open(self.picture)
#                 img_format = img.format if img.format else 'PNG'
#                 img.thumbnail((MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT), Image.LANCZOS)
                
#                 buffer = BytesIO()
#                 quality = 85
#                 while True:
#                     buffer.seek(0)
#                     img.save(buffer, format=img_format, quality=quality)
#                     if buffer.tell() <= MAX_IMAGE_SIZE or quality <= 10:
#                         break
#                     quality -= 5
#                 self.picture = ContentFile(buffer.getvalue(), name=self.picture.name)
#             except Exception:
#                 pass

#         super().save(*args, **kwargs)

#     def is_using_default_password(self):
#         """Fast check without re-hashing"""
#         return self.is_default_password
#     def reset_to_default_password(self):
 
#      self.set_password(DEFAULT_PASSWORD)
#      self.save(update_fields=["password", "is_default_password"])
 
#     class Meta:
#         verbose_name = 'User Auth'
#         verbose_name_plural = 'Users Auths'
#     class Meta:
#         indexes = [
#             models.Index(fields=['username', 'userId']),
#             models.Index(fields=['firstName', 'fatherName']),
        #]

import random
from io import BytesIO
from PIL import Image
from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.files.base import ContentFile
import logging

logger = logging.getLogger(__name__)

ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
MAX_IMAGE_SIZE = 100 * 1024  # 100 KB
MAX_IMAGE_WIDTH = 500
MAX_IMAGE_HEIGHT = 500
DEFAULT_PASSWORD = "Default@123"


class UsersAuthsManager(BaseUserManager):
    def generate_unique_username(self, firstName):
        """Generate a unique username: firstname-XXXXXX (6-digit random number)"""
        base = firstName.lower()
        while True:
            random_number = random.randint(100000, 999999)
            username = f"{base}-{random_number}"
            if not self.model.objects.filter(username=username).exists():
                return username

    def create_user(self, username=None, userId=None, password=None, **extra_fields):
        if not userId:
            raise ValueError('The userId must be set')

        if password is None:
            password = DEFAULT_PASSWORD

        if not username and 'firstName' in extra_fields:
            username = self.generate_unique_username(extra_fields['firstName'])

        user = self.model(username=username, userId=userId, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, userId, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(username, userId, password, **extra_fields)


class UsersAuths(AbstractBaseUser, PermissionsMixin):
    firstName = models.CharField(max_length=200)
    fatherName = models.CharField(max_length=200)
    grandFatherName = models.CharField(max_length=200)
    motherName = models.CharField(max_length=200, null=True, blank=True)
    mothersFatherName = models.CharField(max_length=200, null=True, blank=True)
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    batch = models.CharField(max_length=100, null=True, blank=True)
    entrance_exam = models.CharField(max_length=100, null=True, blank=True)

    CATAGORY_CHOICES = [
        ('Natural Science', 'Natural Science'),
        ('Social Science', 'Social Science'),
        ('Other', 'Other'),
    ]
    catagory = models.CharField(max_length=50, choices=CATAGORY_CHOICES, null=True, blank=True)

    ROLE_CHOICES = [
        ('student', 'student'),
        ('registeral', 'registeral'),
        ('teacher', 'teacher'),
        ('department Head', 'department Head'),
        ('college Head', 'college Head'),
        ('president', 'president'),
        ('admin', 'admin'), 
    ]
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student', blank=True)

    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    gender = models.CharField(max_length=50, choices=GENDER_CHOICES)

    nationality = models.CharField(max_length=200, blank=True)
    dob = models.DateField(blank=True, null=True)

    userId = models.CharField(max_length=120, unique=True, null=True, blank=True)
    username = models.CharField(max_length=150, primary_key=True)
    password = models.CharField(max_length=255, default=make_password(DEFAULT_PASSWORD))
    is_default_password = models.BooleanField(default=True)  
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    picture = models.ImageField(upload_to='profile_images/%Y/%m/%d/', null=True, blank=True)
    last_login = models.DateTimeField(blank=True, null=True)

    region = models.CharField(max_length=200, null=True, blank=True)
    zone_or_special_wereda = models.CharField(max_length=200, null=True, blank=True)
    city_or_town = models.CharField(max_length=200, null=True, blank=True)
    house_number = models.CharField(max_length=200, null=True, blank=True)
    religion = models.CharField(max_length=200, null=True, blank=True)

    CASE_CHOICES = [
        ('normal', 'normal'),
        ('case', 'case'),
    ]
    handicap = models.CharField(max_length=200, null=True, choices=CASE_CHOICES, default='normal', blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    POSITION_CHOICES = [
        ('collage_head', 'collage_head'),
        ('department_head', 'department_head'),
        ('peresdant', 'peresdant'),
        ('registeral', 'registeral'),
        ('admin', 'admin'),
        ('teacher', 'teacher'),
        ('student', 'student'), 
    ]
    position = models.CharField(max_length=100, null=True, blank=True)

    objects = UsersAuthsManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['userId']

    def __str__(self):
        return f"{self.userId} - {self.username}"

    def set_password(self, raw_password):
        """Override set_password to update default password flag"""
        self.password = make_password(raw_password)
        self.is_default_password = (raw_password == DEFAULT_PASSWORD)
        self._password = raw_password

    def save(self, *args, **kwargs):
        # Only generate username if it does not already exist
        if not self.username and self.firstName:
            self.username = UsersAuths.objects.generate_unique_username(self.firstName)

        # Prevent username changes if it already exists
        if self.pk and UsersAuths.objects.filter(pk=self.pk).exists():
            orig = UsersAuths.objects.get(pk=self.pk)
            if orig.username != self.username:
                self.username = orig.username

        # Ensure password is always hashed + flag updated
        if self.password and not self.password.startswith('pbkdf2_'):
            self.set_password(self.password)

        # Process image to fit constraints - FIXED VERSION
        if self.picture and hasattr(self.picture, 'file'):
            try:
                # Extract just the filename without path for safe saving
                original_filename = self.picture.name
                if '/' in original_filename:
                    filename = original_filename.split('/')[-1]
                else:
                    filename = original_filename
                    
                img = Image.open(self.picture)
                img_format = img.format if img.format else 'PNG'
                
                # Maintain aspect ratio while resizing
                img.thumbnail((MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT), Image.LANCZOS)
                
                # Optimize image quality and size
                buffer = BytesIO()
                quality = 85
                
                # Save with decreasing quality until under size limit
                while True:
                    buffer.seek(0)
                    buffer.truncate(0)
                    
                    if img_format == 'JPEG':
                        img.save(buffer, format='JPEG', quality=quality, optimize=True)
                    else:
                        img.save(buffer, format=img_format, optimize=True)
                    
                    if buffer.tell() <= MAX_IMAGE_SIZE or quality <= 10:
                        break
                    quality -= 5
                
                # Save with proper filename handling
                self.picture.save(
                    filename, 
                    ContentFile(buffer.getvalue()), 
                    save=False
                )
            except Exception as e:
                logger.error(f"Error processing image for user {self.username}: {str(e)}")
                # Continue saving without the image processing

        super().save(*args, **kwargs)

    def is_using_default_password(self):
        """Fast check without re-hashing"""
        return self.is_default_password
        
    def reset_to_default_password(self):
        """Reset password to default"""
        self.set_password(DEFAULT_PASSWORD)
        self.save(update_fields=["password", "is_default_password"])
    
    class Meta:
        verbose_name = 'User Auth'
        verbose_name_plural = 'Users Auths'
        indexes = [
            models.Index(fields=['username', 'userId']),
            models.Index(fields=['firstName', 'fatherName']),
        ]


########################################################################################################






# import random
# from io import BytesIO
# from PIL import Image
# from django.db import models
# from django.contrib.auth.hashers import make_password
# from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# from django.core.files.base import ContentFile
# from collages.models import Collages, Department

# ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png']
# MAX_IMAGE_SIZE = 100 * 1024  # 100 KB
# MAX_IMAGE_WIDTH = 500
# MAX_IMAGE_HEIGHT = 500
# DEFAULT_PASSWORD = "Default@123"

# class UsersAuthsManager(BaseUserManager):
#     def generate_unique_username(self, firstName):
#         """Generate a unique username: firstname-XXXXXX (6-digit random number)"""
#         base = firstName.lower()
#         while True:
#             random_number = random.randint(100000, 999999)
#             username = f"{base}-{random_number}"
#             if not self.model.objects.filter(username=username).exists():
#                 return username

#     def create_user(self, username=None, userId=None, password=None, **extra_fields):
#         if not userId:
#             raise ValueError('The userId must be set')

#         if password is None:
#             password = DEFAULT_PASSWORD

#         if not username and 'firstName' in extra_fields:
#             username = self.generate_unique_username(extra_fields['firstName'])

#         user = self.model(username=username, userId=userId, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user
    
#     def create_superuser(self, username, userId, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
        
#         if extra_fields.get('is_staff') is not True:
#             raise ValueError('Superuser must have is_staff=True.')
#         if extra_fields.get('is_superuser') is not True:
#             raise ValueError('Superuser must have is_superuser=True.')
        
#         return self.create_user(username, userId, password, **extra_fields)

# class UsersAuths(AbstractBaseUser, PermissionsMixin):
#     firstName = models.CharField(max_length=200)
#     fatherName = models.CharField(max_length=200)
#     grandFatherName = models.CharField(max_length=200)
#     motherName = models.CharField(max_length=200, null=True, blank=True)
#     mothersFatherName = models.CharField(max_length=200, null=True, blank=True)
#     phoneNumber = models.CharField(max_length=20, null=True, blank=True)
#     batch = models.CharField(max_length=100, null=True, blank=True)
#     entrance_exam = models.CharField(max_length=100, null=True, blank=True)

#     CATAGORY_CHOICES = [
#         ('Natural Science', 'Natural Science'),
#         ('Social Science', 'Social Science'),
#         ('Other', 'Other'),
#     ]
#     catagory = models.CharField(max_length=50, choices=CATAGORY_CHOICES, null=True, blank=True)

#     ROLE_CHOICES = [
#         ('student', 'student'),
#         ('registeral', 'registeral'),
#         ('teacher', 'teacher'),
#         ('department Head', 'department Head'),
#         ('college Head', 'college Head'),
#         ('president', 'president'),
#         ('admin', 'admin'), 
#     ]
#     role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='student', blank=True)

#     GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
#     gender = models.CharField(max_length=50, choices=GENDER_CHOICES)

#     nationality = models.CharField(max_length=200, blank=True)
#     dob = models.DateField(blank=True, null=True)

#     userId = models.CharField(max_length=120, unique=True, null=True, blank=True)
#     username = models.CharField(max_length=150, primary_key=True)
#     password = models.CharField(max_length=255, default=make_password(DEFAULT_PASSWORD))
#     is_default_password = models.BooleanField(default=True)  
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)

#     picture = models.ImageField(upload_to='profile_image/', null=True, blank=True)
#     last_login = models.DateTimeField(blank=True, null=True)

#     region = models.CharField(max_length=200, null=True, blank=True)
#     zone_or_special_wereda = models.CharField(max_length=200, null=True, blank=True)
#     city_or_town = models.CharField(max_length=200, null=True, blank=True)
#     house_number = models.CharField(max_length=200, null=True, blank=True)
#     religion = models.CharField(max_length=200, null=True, blank=True)

#     CASE_CHOICES = [
#         ('normal', 'normal'),
#         ('case', 'case'),
#     ]
#     handicap = models.CharField(max_length=200, null=True, choices=CASE_CHOICES, default='normal', blank=True)

#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)
    
#     POSITION_CHOICES = [
#         ('collage_head', 'collage_head'),
#         ('department_head', 'department_head'),
#         ('peresdant', 'peresdant'),
#         ('registeral', 'registeral'),
#         ('admin', 'admin'),
#         ('teacher', 'teacher'),
#         ('student', 'student'), 
#     ]
#     position = models.CharField(max_length=100, null=True, blank=True)
    
#     # New foreign key fields for college and department
#     college = models.ForeignKey(
#         Collages, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         related_name='users'
#     )
#     department = models.ForeignKey(
#         Department, 
#         on_delete=models.SET_NULL, 
#         null=True, 
#         blank=True,
#         related_name='users'
#     )

#     objects = UsersAuthsManager()

#     USERNAME_FIELD = 'username'

#     def __str__(self):
#         return f"{self.userId} - {self.username}"

#     def set_password(self, raw_password):
#         """Override set_password to update default password flag"""
#         self.password = make_password(raw_password)
#         self.is_default_password = (raw_password == DEFAULT_PASSWORD)
#         self._password = raw_password

#     def save(self, *args, **kwargs):
#         # Only generate username if it does not already exist
#         if not self.username and self.firstName:
#             self.username = UsersAuths.objects.generate_unique_username(self.firstName)

#         # Prevent username changes if it already exists
#         if self.pk and UsersAuths.objects.filter(pk=self.pk).exists():
#             orig = UsersAuths.objects.get(pk=self.pk)
#             self.username = orig.username

#         # Ensure password is always hashed + flag updated
#         if self.password and not self.password.startswith('pbkdf2_'):
#             self.set_password(self.password)

#         # Process image to fit constraints
#         if self.picture:
#             try:
#                 img = Image.open(self.picture)
#                 img_format = img.format if img.format else 'PNG'
#                 img.thumbnail((MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT), Image.LANCZOS)
                
#                 buffer = BytesIO()
#                 quality = 85
#                 while True:
#                     buffer.seek(0)
#                     img.save(buffer, format=img_format, quality=quality)
#                     if buffer.tell() <= MAX_IMAGE_SIZE or quality <= 10:
#                         break
#                     quality -= 5
#                 self.picture = ContentFile(buffer.getvalue(), name=self.picture.name)
#             except Exception:
#                 pass

#         super().save(*args, **kwargs)

#     def is_using_default_password(self):
#         """Fast check without re-hashing"""
#         return self.is_default_password