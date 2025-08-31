# from django.db import models

# # Create your models here.

# from django.db import models

# class Course(models.Model):
   
#     YEAR_CHOICES = [
#         ("1", "1st Year"),
#         ("2", "2nd Year"),
#         ("3", "3rd Year"),
#         ("4", "4th Year"),
#         ("5", "5th Year"),
#         ("6", "6th Year"),
#         ("7", "7th Year"),
#     ]

#     SEMESTER_CHOICES = [
#         ("I", "Semester I"),
#         ("II", "Semester II"),
#     ]

#     CATEGORY_CHOICES = [
#         ("BSc", "BSc"),
#         ("MSc", "MSc"),
#         ("PhD", "PhD"),
#     ]

   
#     course_code = models.CharField(max_length=12, primary_key=True)   
#     course_title = models.CharField(max_length=200)
#     course_department = models.CharField(max_length=100)              
#     course_credit = models.PositiveSmallIntegerField(default=3)
#     course_taken_year = models.CharField(max_length=1, choices=YEAR_CHOICES)
#     course_taken_semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES)
#     course_category = models.CharField(max_length=5, choices=CATEGORY_CHOICES, default="BSc")

    
#     course_prerequisite = models.ForeignKey(
#         "self",
#         null=True,
#         blank=True,
#         on_delete=models.SET_NULL,
#         related_name="dependent_courses"
#     )

    
#     updated_at = models.DateTimeField(auto_now=True)
#     created_at = models.DateTimeField(auto_now_add=True)
  

#     class Meta:
#         db_table = "courses"  
#         ordering = ["course_code"]

#     def __str__(self):
#         return f"{self.course_code} - {self.course_title}"

#####################################################################################





# courses/models.py
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
    
    course_id = models.CharField(max_length=20, primary_key=True)
    course_name = models.CharField(max_length=200)
    course_credit = models.PositiveIntegerField()
    course_taken_year = models.CharField(max_length=3, choices=YEAR_CHOICES, default='1st')
    course_taken_semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES, default='I')
    course_category = models.CharField(max_length=3, choices=COURSE_CATEGORY_CHOICES, default='BSc')
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.course_name



