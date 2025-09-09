
from django.db import models
from collages.models import Department

class Course(models.Model):
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
    
    COURSE_TYPE_CHOICES = [
        ('compulsory', 'Compulsory'),
        ('supporting', 'Supporting'),
        ('common', 'Common'),
        ('elective', 'Elective'),
    ]
    
    course_id = models.CharField(max_length=20, primary_key=True)
    course_name = models.CharField(max_length=200)
    course_credit = models.PositiveIntegerField()
    course_taken_year = models.CharField(max_length=3, choices=YEAR_CHOICES, default='1st')
    course_taken_semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES, default='I')
    course_category = models.CharField(max_length=3, choices=COURSE_CATEGORY_CHOICES, default='BSc')
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    # New fields
    instructor = models.CharField(max_length=100, null=True, blank=True)
    course_type = models.CharField(
        max_length=20, 
        choices=COURSE_TYPE_CHOICES, 
        default='compulsory',
        null=True,
        blank=True
    )
    
    def __str__(self):
        return self.course_name



