from django.db import models

# Create your models here.
# student/models.py (updated with proper FK relationships)
from django.db import models
from courses.models import Course
from collages.models import Department
from user.models import UsersAuths

class Grade(models.Model):
    grade_id = models.CharField(max_length=20, primary_key=True)
    username = models.ForeignKey(
        UsersAuths, 
        on_delete=models.PROTECT,
        related_name='grades'
    )
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    quiz = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    mid = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    assignment = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    final = models.DecimalField(max_digits=5, decimal_places=2)
    participation = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.username} - {self.course_id} - {self.grade_id}"

class Student(models.Model):
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
    
    username = models.ForeignKey(UsersAuths, on_delete=models.CASCADE)
    department_id = models.ForeignKey(Department, on_delete=models.CASCADE)
    # Remove course_id foreign key and replace with ManyToMany
    courses = models.ManyToManyField(Course, through='StudentCourse')
    grade_id = models.ForeignKey(Grade, on_delete=models.CASCADE, null=True, blank=True)
    year = models.CharField(max_length=3, choices=YEAR_CHOICES, default='1st')
    semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES, default='I')
    course_category = models.CharField(max_length=3, choices=COURSE_CATEGORY_CHOICES, default='BSc')

# New through model for student-course relationship
class StudentCourse(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['student', 'course']



        