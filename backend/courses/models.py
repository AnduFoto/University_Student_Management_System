from django.db import models

# Create your models here.

from django.db import models

class Course(models.Model):
   
    YEAR_CHOICES = [
        ("1", "1st Year"),
        ("2", "2nd Year"),
        ("3", "3rd Year"),
        ("4", "4th Year"),
        ("5", "5th Year"),
        ("6", "6th Year"),
        ("7", "7th Year"),
    ]

    SEMESTER_CHOICES = [
        ("I", "Semester I"),
        ("II", "Semester II"),
    ]

    CATEGORY_CHOICES = [
        ("BSc", "BSc"),
        ("MSc", "MSc"),
        ("PhD", "PhD"),
    ]

   
    course_code = models.CharField(max_length=12, primary_key=True)   
    course_title = models.CharField(max_length=200)
    course_department = models.CharField(max_length=100)              
    course_credit = models.PositiveSmallIntegerField(default=3)
    course_taken_year = models.CharField(max_length=1, choices=YEAR_CHOICES)
    course_taken_semester = models.CharField(max_length=2, choices=SEMESTER_CHOICES)
    course_category = models.CharField(max_length=5, choices=CATEGORY_CHOICES, default="BSc")

    
    course_prerequisite = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="dependent_courses"
    )

    
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
  

    class Meta:
        db_table = "courses"  
        ordering = ["course_code"]

    def __str__(self):
        return f"{self.course_code} - {self.course_title}"







