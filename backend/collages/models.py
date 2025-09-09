
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