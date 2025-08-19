from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models, transaction
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth.hashers import make_password
import random


# Create your models here.

class UsersAuthsManager(BaseUserManager):
    def create_user(self, username=None, userId=None, password=None, **extra_fields):
        if not userId:
            raise ValueError('The userId must be set')
        
        if password is None:
            password = "Default@123"

        if not username and 'firstName' in extra_fields:
            random_number = random.randint(100000, 999999)
            username = f"{extra_fields['firstName'].lower()}-{random_number}"

        user = self.model(username=username, userId=userId, **extra_fields)
        user.password = make_password(password)
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

    firstName = models.CharField(max_length=100)
    fatherName = models.CharField(max_length=100)
    grandFatherName = models.CharField(max_length=100)
    motherName = models.CharField(max_length=100, null=True, blank=True)
    mothersFatherName = models.CharField(max_length=100, null=True, blank=True)
    phoneNumber = models.CharField(max_length=20, null=True, blank=True)
    batch = models.CharField(max_length=100, null=True, blank=True)
    entrance_exam = models.CharField(max_length=100, null=True, blank=True)

    CATAGORY_CHOICES = [
        ('Natural Science', 'Natural Science'),
        ('Social Science', 'Social Science'),
        ('Other', 'Other'),
    ]
    catagory = models.CharField(max_length=30, choices=CATAGORY_CHOICES, null=True, blank=True)

    ROLE_CHOICES = [
        ('Student', 'Student'),
        ('Teacher', 'Teacher'),
        ('Department Head', 'Department Head'),
        ('College Head', 'College Head'),
        ('President', 'President'),
        ('Admin', 'Admin'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', blank=True)

    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')]
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    nationality = models.CharField(max_length=100, blank=True)
    dob = models.DateField(blank=True, null=True)

    userId = models.CharField(max_length=100, primary_key=True)
    username = models.CharField(max_length=150, unique=True, blank=True)
    password = models.CharField(max_length=255, default=make_password("Default@123"))
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    picture = models.ImageField(upload_to='profile_image/', null=True, blank=True)
    last_login = models.DateTimeField(blank=True, null=True)

    region = models.CharField(max_length=100, null=True, blank=True)
    zone_or_special_wereda = models.CharField(max_length=100, null=True, blank=True)
    city_or_town = models.CharField(max_length=100, null=True, blank=True)
    house_number = models.CharField(max_length=50, null=True, blank=True)
    religion = models.CharField(max_length=50, null=True, blank=True)
    handicap = models.CharField(max_length=50, null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UsersAuthsManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['userId']

    def __str__(self):
        return f"{self.userId} - {self.username}"

    def save(self, *args, **kwargs):
        
        if not self.username and self.firstName:
                self.username = f"{self.firstName.lower()}-{self.user_count:06d}"
        
        if self.password and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def is_using_default_password(self):
        from django.contrib.auth.hashers import check_password
        return check_password("Default@123", self.password)
