from django.db import models

# Create your models here.

# from django.db import models
# from django.utils import timezone
# import re
# from django.core.exceptions import ValidationError
# # Create your models here.


# def validate_college_name(value):
#     """Ensure name contains only letters and spaces"""
#     if not re.match(r'^[A-Za-z\s]+$', value):
#         raise ValidationError("College name must contain only letters and spaces.")

# class Collages(models.Model):
#     college_code = models.CharField(max_length=50, primary_key=True)  # Primary Key
#     name = models.CharField(max_length=255, unique=True, validators=[validate_college_name])
#     created_at = models.DateTimeField(auto_now_add=True)  # set once when created
#     updated_at = models.DateTimeField(auto_now=True)      # auto-updates on save

#     def __str__(self):
#         return f"{self.name} ({self.college_code})"
    




#     from django.db import models
# from django.core.exceptions import ValidationError
# import re
# from collages.models import Collages  # make sure to import the correct model

# # Optional: validator for department name
# def validate_department_name(value):
#     if not re.match(r'^[A-Za-z\s]+$', value):
#         raise ValidationError("Department name must contain only letters and spaces.")

# class Department(models.Model):
#     department_code = models.CharField(max_length=20, primary_key=True)
#     department_name = models.CharField(max_length=255, validators=[validate_department_name])
#     college = models.ForeignKey(
#         Collages, on_delete=models.CASCADE, related_name="departments"
#     )
#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)
   

#     def __str__(self):
#         return f"{self.department_name} ({self.department_code}) - {self.college.name}"










#####################################################################################################

# collages/models.py
from django.db import models

# collages/models.py
from django.db import models

class College(models.Model):
    YEAR_CHOICES = [
        ('1st', '1st Year'),
        ('2nd', '2nd Year'),
        ('3rd', '3rd Year'),
        ('4th', '4th Year'),
        ('5th', '5th Year'),
        ('6th', '6th Year'),
        ('7th', '7th Year'),
    ]
    
    SEMESTER_CHOICES = [
        ('I', 'Semester I'),
        ('II', 'Semester II'),
    ]
    
    COURSE_CATEGORY_CHOICES = [
        ('BSc', 'Bachelor of Science'),
        ('MSc', 'Master of Science'),
        ('PhD', 'Doctor of Philosophy'),
    ]
    
    college_id = models.CharField(max_length=20, primary_key=True)
    college_name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.college_name

class Department(models.Model):
    department_id = models.CharField(max_length=20, primary_key=True)
    department_name = models.CharField(max_length=200)
    college_id = models.ForeignKey(College, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.department_name