
from django.db import models
from user.models import UsersAuths  
from collages.models import College
from courses.models import Course

class Teachers(models.Model):
    ACADEMIC_LEVEL_CHOICES = [
        ('BSc', 'Bachelor of Science'),
        ('MSc', 'Master of Science'),
        ('PhD', 'Doctor of Philosophy'),
        ('Professor', 'Professor'),
    ]
    
    teacher_id = models.CharField(max_length=20, primary_key=True)
    username = models.ForeignKey(UsersAuths, on_delete=models.CASCADE, to_field='username')
    college_id = models.ForeignKey(College, on_delete=models.CASCADE)
    academic_level = models.CharField(
        max_length=10, 
        choices=ACADEMIC_LEVEL_CHOICES, 
        default='BSc'
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.teacher_id} - {self.username.firstName} {self.username.fatherName}"
    
    class Meta:
        verbose_name = 'Teacher'
        verbose_name_plural = 'Teachers'
        indexes = [
            models.Index(fields=['teacher_id', 'username']),
            models.Index(fields=['college_id']),
        ]


class TeachersCourse(models.Model):
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
    
    teacher_id = models.ForeignKey(Teachers, on_delete=models.CASCADE)
    course_id = models.ForeignKey(Course, on_delete=models.CASCADE)
    batch = models.CharField(max_length=100)
    year = models.CharField(max_length=3, choices=YEAR_CHOICES)
    semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.teacher_id} - {self.course_id} - {self.batch}"
    
    class Meta:
        verbose_name = 'Teacher Course Assignment'
        verbose_name_plural = 'Teacher Course Assignments'
        unique_together = ['teacher_id', 'course_id', 'batch', 'year', 'semester']
        indexes = [
            models.Index(fields=['teacher_id', 'course_id']),
            models.Index(fields=['batch', 'year', 'semester']),
        ]