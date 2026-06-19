# from django.db import models
# from django.core.exceptions import ValidationError
# from student.models import Student
# from courses.models import Course
# from teacher.models import Teachers  # Changed from teacher.models to teachers.models

# class DynamicGrade(models.Model):
#     GRADE_CHOICES = [
#         ('A', 'A (Excellent)'),
#         ('B', 'B (Very Good)'),
#         ('C', 'C (Good)'),
#         ('D', 'D (Satisfactory)'),
#         ('F', 'F (Fail)'),
#         ('I', 'Incomplete'),
#         ('W', 'Withdrawn'),
#     ]
    
#     student = models.ForeignKey(
#         Student, 
#         on_delete=models.CASCADE,
#         related_name='dynamic_grades'
#     )
#     course = models.ForeignKey(
#         Course,
#         on_delete=models.CASCADE,
#         related_name='dynamic_grades'
#     )
#     teacher = models.ForeignKey(
#         Teachers,  # This should match your actual model name
#         on_delete=models.CASCADE,
#         related_name='assigned_grades',
#         null=True,
#         blank=True
#     )
    
#     # Dynamic grade components stored as JSON
#     grade_components = models.JSONField(
#         default=dict,
#         help_text="JSON object containing grade components and their values"
#     )
    
#     # Final calculated grade
#     final_grade = models.CharField(
#         max_length=2,
#         choices=GRADE_CHOICES,
#         blank=True,
#         null=True
#     )
    
#     total_score = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Total score calculated from grade components"
#     )
    
#     max_possible_score = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Maximum possible score for this course"
#     )
    
#     percentage = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Percentage score (total_score / max_possible_score * 100)"
#     )
    
#     is_active = models.BooleanField(
#         default=True,
#         help_text="Whether this grade record is active or inactive"
#     )
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         verbose_name = 'Dynamic Grade'
#         verbose_name_plural = 'Dynamic Grades'
#         unique_together = ['student', 'course']
#         indexes = [
#             models.Index(fields=['student', 'course']),
#             models.Index(fields=['teacher']),
#             models.Index(fields=['is_active']),
#             models.Index(fields=['final_grade']),
#         ]
    
#     def __str__(self):
#         return f"{self.student} - {self.course} - {self.final_grade or 'No Grade'}"
    
#     def clean(self):
#         """Validate that the teacher is actually teaching this course"""
#         if self.teacher and self.course:
#             # Check if the teacher's ID matches the course instructor
#             # Note: course.instructor might be a string, not a Teachers object
#             # Adjust this logic based on your actual data structure
#             if hasattr(self.course, 'instructor') and self.course.instructor:
#                 # If course.instructor is a string (teacher ID), compare with teacher_id
#                 if isinstance(self.course.instructor, str) and self.teacher.teacher_id != self.course.instructor:
#                     raise ValidationError(
#                         f"Teacher {self.teacher} is not assigned to teach {self.course}"
#                     )
#                 # If course.instructor is a ForeignKey to Teachers, compare objects
#                 elif hasattr(self.course.instructor, 'teacher_id') and self.teacher != self.course.instructor:
#                     raise ValidationError(
#                         f"Teacher {self.teacher} is not assigned to teach {self.course}"
#                     )
    
#     def save(self, *args, **kwargs):
#         # Auto-set teacher from course instructor if not provided
#         if not self.teacher and self.course and hasattr(self.course, 'instructor') and self.course.instructor:
#             try:
#                 # If course.instructor is a string (teacher ID)
#                 if isinstance(self.course.instructor, str):
#                     self.teacher = Teachers.objects.get(teacher_id=self.course.instructor)
#                 # If course.instructor is a ForeignKey to Teachers
#                 elif hasattr(self.course.instructor, 'teacher_id'):
#                     self.teacher = self.course.instructor
#             except (Teachers.DoesNotExist, AttributeError):
#                 pass
        
#         # Calculate scores and final grade
#         self.calculate_scores()
        
#         super().save(*args, **kwargs)
    
#     def calculate_scores(self):
#         """Calculate total score, percentage, and final grade from components"""
#         if not self.grade_components:
#             return
        
#         total = 0
#         max_total = 0
#         weighted_total = 0
#         total_weight = 0
        
#         # Calculate total, max possible, and weighted scores
#         for component, data in self.grade_components.items():
#             if isinstance(data, dict) and 'score' in data and 'max_score' in data:
#                 try:
#                     score = float(data['score'])
#                     max_score = float(data['max_score'])
#                     weight = float(data.get('weight', 1.0))
                    
#                     total += score
#                     max_total += max_score
#                     weighted_total += score * weight
#                     total_weight += weight
#                 except (ValueError, TypeError):
#                     continue
        
#         self.total_score = total
#         self.max_possible_score = max_total
        
#         # Calculate percentage based on weighted scores if weights are provided
#         if total_weight > 0 and max_total > 0:
#             # Normalize weighted score to percentage
#             self.percentage = (weighted_total / (max_total * total_weight)) * 100 if total_weight > 0 else (total / max_total) * 100
#         elif max_total > 0:
#             self.percentage = (total / max_total) * 100
#         else:
#             self.percentage = None
        
#         # Determine final grade based on percentage
#         if self.percentage is not None:
#             if self.percentage >= 90:
#                 self.final_grade = 'A'
#             elif self.percentage >= 80:
#                 self.final_grade = 'B'
#             elif self.percentage >= 70:
#                 self.final_grade = 'C'
#             elif self.percentage >= 60:
#                 self.final_grade = 'D'
#             else:
#                 self.final_grade = 'F'
#         else:
#             self.final_grade = None
    
#     def add_grade_component(self, name, score, max_score, weight=1.0):
#         """Helper method to add a grade component"""
#         if not self.grade_components:
#             self.grade_components = {}
        
#         self.grade_components[name] = {
#             'score': float(score),
#             'max_score': float(max_score),
#             'weight': float(weight),
#             'updated_at': self.updated_at.isoformat() if self.updated_at else None
#         }
    
#     def get_grade_component(self, name):
#         """Get a specific grade component"""
#         return self.grade_components.get(name)
    
#     def remove_grade_component(self, name):
#         """Remove a grade component"""
#         if name in self.grade_components:
#             del self.grade_components[name]
    
#     @property
#     def is_passing(self):
#         """Check if the grade is passing (D or better)"""
#         return self.final_grade in ['A', 'B', 'C', 'D']
    
#     @property
#     def grade_points(self):
#         """Calculate grade points (typically used for GPA calculation)"""
#         grade_point_map = {
#             'A': 4.0,
#             'B': 3.0,
#             'C': 2.0,
#             'D': 1.0,
#             'F': 0.0
#         }
#         if self.final_grade and hasattr(self.course, 'course_credit'):
#             return grade_point_map.get(self.final_grade, 0.0) * self.course.course_credit
#         return 0.0
    
#     def deactivate(self):
#         """Deactivate this grade record"""
#         self.is_active = False
#         self.save()
    
#     def activate(self):
#         """Activate this grade record"""
#         self.is_active = True
#         self.save()

# # Grade component template model
# class GradeFormTemplate(models.Model):
#     course = models.ForeignKey(
#         Course,
#         on_delete=models.CASCADE,
#         related_name='grade_form_templates'
#     )
#     teacher = models.ForeignKey(
#         Teachers,
#         on_delete=models.CASCADE,
#         null=True,
#         blank=True
#     )
#     title = models.CharField(max_length=200)
#     description = models.TextField(blank=True)
#     is_active = models.BooleanField(default=True)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         unique_together = ['course', 'title']
    
#     def __str__(self):
#         return f"{self.course.course_name} - {self.title}"

# class GradeComponentTemplate(models.Model):
#     form_template = models.ForeignKey(
#         GradeFormTemplate,
#         on_delete=models.CASCADE,
#         related_name='components'
#     )
#     name = models.CharField(max_length=100)
#     max_score = models.DecimalField(max_digits=5, decimal_places=2)
#     weight = models.DecimalField(
#         max_digits=4,
#         decimal_places=2,
#         default=1.0,
#         help_text="Weight of this component in final grade calculation (1.0 = 100%)"
#     )
#     is_required = models.BooleanField(default=True)
#     order = models.IntegerField(default=0)
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         unique_together = ['form_template', 'name']
#         ordering = ['order']
    
#     def __str__(self):
#         return f"{self.form_template.title} - {self.name}"

from django.db import models
from django.core.exceptions import ValidationError
from student.models import Student
from courses.models import Course
from teacher.models import Teachers

# class DynamicGrade(models.Model):
#     GRADE_CHOICES = [
#         ('A+', 'A+ (Excellent)'),
#         ('A', 'A (Very Good)'),
#         ('A-', 'A- (Good)'),
#         ('B+', 'B+ (Very Good)'),
#         ('B', 'B (Good)'),
#         ('B-', 'B- (Satisfactory)'),
#         ('C+', 'C+ (Satisfactory)'),
#         ('C', 'C (Passing)'),
#         ('C-', 'C- (Marginal)'),
#         ('D', 'D (Poor)'),
#         ('F', 'F (Fail)'),
#         ('I', 'Incomplete'),
#         ('W', 'Withdrawn'),
#     ]
    
#     student = models.ForeignKey(
#         Student, 
#         on_delete=models.CASCADE,
#         related_name='dynamic_grades'
#     )
#     course = models.ForeignKey(
#         Course,
#         on_delete=models.CASCADE,
#         related_name='dynamic_grades'
#     )
#     teacher = models.ForeignKey(
#         Teachers,
#         on_delete=models.CASCADE,
#         related_name='assigned_grades',
#         null=True,
#         blank=True
#     )
    
#     grade_components = models.JSONField(
#         default=dict,
#         help_text="JSON object containing grade components and their values"
#     )
    
#     final_grade = models.CharField(
#         max_length=3,
#         choices=GRADE_CHOICES,
#         blank=True,
#         null=True
#     )
    
#     total_score = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Total score calculated from grade components"
#     )
    
#     max_possible_score = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Maximum possible score for this course"
#     )
    
#     percentage = models.DecimalField(
#         max_digits=5,
#         decimal_places=2,
#         null=True,
#         blank=True,
#         help_text="Percentage score (total_score / max_possible_score * 100)"
#     )
    
#     is_active = models.BooleanField(
#         default=True,
#         help_text="Whether this grade record is active or inactive"
#     )
    
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     class Meta:
#         verbose_name = 'Dynamic Grade'
#         verbose_name_plural = 'Dynamic Grades'
#         unique_together = ['student', 'course']
#         indexes = [
#             models.Index(fields=['student', 'course']),
#             models.Index(fields=['teacher']),
#             models.Index(fields=['is_active']),
#             models.Index(fields=['final_grade']),
#         ]
    
#     def __str__(self):
#         return f"{self.student.username} - {self.course.course_name} - {self.final_grade or 'No Grade'}"
    
#     def clean(self):
#         """Validate that the teacher is actually teaching this course"""
#         if self.teacher and self.course:
#             if hasattr(self.course, 'instructor') and self.course.instructor:
#                 if isinstance(self.course.instructor, str) and self.teacher.teacher_id != self.course.instructor:
#                     raise ValidationError(
#                         f"Teacher {self.teacher} is not assigned to teach {self.course}"
#                     )
#                 elif hasattr(self.course.instructor, 'teacher_id') and self.teacher != self.course.instructor:
#                     raise ValidationError(
#                         f"Teacher {self.teacher} is not assigned to teach {self.course}"
#                     )
    
#     def save(self, *args, **kwargs):
#         # Auto-set teacher from course instructor if not provided
#         if not self.teacher and self.course and hasattr(self.course, 'instructor') and self.course.instructor:
#             try:
#                 if isinstance(self.course.instructor, str):
#                     self.teacher = Teachers.objects.get(teacher_id=self.course.instructor)
#                 elif hasattr(self.course.instructor, 'teacher_id'):
#                     self.teacher = self.course.instructor
#             except (Teachers.DoesNotExist, AttributeError):
#                 pass
        
#         # Calculate scores and final grade
#         self.calculate_scores()
        
#         super().save(*args, **kwargs)
    
#     def calculate_scores(self):
#         """Calculate total score, percentage, and final grade from components"""
#         if not self.grade_components:
#             return
        
#         total = 0
#         max_total = 0
#         weighted_total = 0
#         total_weight = 0
        
#         for component, data in self.grade_components.items():
#             if isinstance(data, dict) and 'score' in data and 'max_score' in data:
#                 try:
#                     score = float(data['score'])
#                     max_score = float(data['max_score'])
#                     weight = float(data.get('weight', 1.0))
                    
#                     total += score
#                     max_total += max_score
#                     weighted_total += score * weight
#                     total_weight += weight
#                 except (ValueError, TypeError):
#                     continue
        
#         self.total_score = total
#         self.max_possible_score = max_total
        
#         if total_weight > 0 and max_total > 0:
#             self.percentage = (weighted_total / (max_total * total_weight)) * 100 if total_weight > 0 else (total / max_total) * 100
#         elif max_total > 0:
#             self.percentage = (total / max_total) * 100
#         else:
#             self.percentage = None
        
#         if self.percentage is not None:
#             if self.percentage >= 90:
#                 self.final_grade = 'A+'
#             elif self.percentage >= 85:
#                 self.final_grade = 'A'
#             elif self.percentage >= 80:
#                 self.final_grade = 'A-'
#             elif self.percentage >= 75:
#                 self.final_grade = 'B+'
#             elif self.percentage >= 70:
#                 self.final_grade = 'B'
#             elif self.percentage >= 65:
#                 self.final_grade = 'B-'
#             elif self.percentage >= 60:
#                 self.final_grade = 'C+'
#             elif self.percentage >= 50:
#                 self.final_grade = 'C'
#             elif self.percentage >= 45:
#                 self.final_grade = 'C-'
#             elif self.percentage >= 40:
#                 self.final_grade = 'D'
#             else:
#                 self.final_grade = 'F'
#         else:
#             self.final_grade = None
    
#     def add_grade_component(self, name, score, max_score, weight=1.0):
#         """Helper method to add a grade component"""
#         if not self.grade_components:
#             self.grade_components = {}
        
#         self.grade_components[name] = {
#             'score': float(score),
#             'max_score': float(max_score),
#             'weight': float(weight),
#         }
    
#     def get_grade_component(self, name):
#         """Get a specific grade component"""
#         return self.grade_components.get(name)
    
#     def remove_grade_component(self, name):
#         """Remove a grade component"""
#         if name in self.grade_components:
#             del self.grade_components[name]
    
#     @property
#     def is_passing(self):
#         """Check if the grade is passing (D or better)"""
#         return self.final_grade in ['A', 'B', 'C', 'D']
    
#     @property
#     def grade_points(self):
#         """Calculate grade points (typically used for GPA calculation)"""
#         grade_point_map = {
#             'A': 4.0,
#             'B': 3.0,
#             'C': 2.0,
#             'D': 1.0,
#             'F': 0.0
#         }
#         if self.final_grade and hasattr(self.course, 'course_credit'):
#             return grade_point_map.get(self.final_grade, 0.0) * self.course.course_credit
#         return 0.0


class DynamicGrade(models.Model):
    GRADE_CHOICES = [
        ('A+', 'A+ (Excellent)'),
        ('A', 'A (Very Good)'),
        ('A-', 'A- (Good)'),
        ('B+', 'B+ (Very Good)'),
        ('B', 'B (Good)'),
        ('B-', 'B- (Satisfactory)'),
        ('C+', 'C+ (Satisfactory)'),
        ('C', 'C (Passing)'),
        ('C-', 'C- (Marginal)'),
        ('D', 'D (Poor)'),
        ('F', 'F (Fail)'),
        ('I', 'Incomplete'),
        ('W', 'Withdrawn'),
    ]
    
    student = models.ForeignKey(
        Student, 
        on_delete=models.CASCADE,
        related_name='dynamic_grades'
    )
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='dynamic_grades'
    )
    teacher = models.ForeignKey(
        Teachers,
        on_delete=models.CASCADE,
        related_name='assigned_grades',
        null=True,
        blank=True
    )
    
    grade_components = models.JSONField(
        default=dict,
        help_text="JSON object containing grade components and their values"
    )
    
    final_grade = models.CharField(
        max_length=3,
        choices=GRADE_CHOICES,
        blank=True,
        null=True
    )
    
    total_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total score calculated from grade components"
    )
    
    max_possible_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Maximum possible score for this course"
    )
    
    percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Percentage score (total_score / max_possible_score * 100)"
    )
    
    is_approved = models.BooleanField(
        null=True,
        blank=True,
        help_text="Whether this grade has been approved by the administration"
    )
    
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this grade record is active or inactive"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Dynamic Grade'
        verbose_name_plural = 'Dynamic Grades'
        unique_together = ['student', 'course']
        indexes = [
            models.Index(fields=['student', 'course']),
            models.Index(fields=['teacher']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_approved']),
            models.Index(fields=['final_grade']),
        ]
    
    def __str__(self):
        return f"{self.student.username} - {self.course.course_name} - {self.final_grade or 'No Grade'}"
    
    def clean(self):
        """Validate that the teacher is actually teaching this course"""
        if self.teacher and self.course:
            if hasattr(self.course, 'instructor') and self.course.instructor:
                if isinstance(self.course.instructor, str) and self.teacher.teacher_id != self.course.instructor:
                    raise ValidationError(
                        f"Teacher {self.teacher} is not assigned to teach {self.course}"
                    )
                elif hasattr(self.course.instructor, 'teacher_id') and self.teacher != self.course.instructor:
                    raise ValidationError(
                        f"Teacher {self.teacher} is not assigned to teach {self.course}"
                    )
    
    def save(self, *args, **kwargs):
        # Auto-set teacher from course instructor if not provided
        if not self.teacher and self.course and hasattr(self.course, 'instructor') and self.course.instructor:
            try:
                if isinstance(self.course.instructor, str):
                    self.teacher = Teachers.objects.get(teacher_id=self.course.instructor)
                elif hasattr(self.course.instructor, 'teacher_id'):
                    self.teacher = self.course.instructor
            except (Teachers.DoesNotExist, AttributeError):
                pass
        
        # Calculate scores and final grade
        self.calculate_scores()
        
        super().save(*args, **kwargs)
    
    def calculate_scores(self):
        """Calculate total score, percentage, and final grade from components"""
        if not self.grade_components:
            return
        
        total = 0
        max_total = 0
        weighted_total = 0
        total_weight = 0
        
        for component, data in self.grade_components.items():
            if isinstance(data, dict) and 'score' in data and 'max_score' in data:
                try:
                    score = float(data['score'])
                    max_score = float(data['max_score'])
                    weight = float(data.get('weight', 1.0))
                    
                    total += score
                    max_total += max_score
                    weighted_total += score * weight
                    total_weight += weight
                except (ValueError, TypeError):
                    continue
        
        self.total_score = total
        self.max_possible_score = max_total
        
        if total_weight > 0 and max_total > 0:
            self.percentage = (weighted_total / (max_total * total_weight)) * 100 if total_weight > 0 else (total / max_total) * 100
        elif max_total > 0:
            self.percentage = (total / max_total) * 100
        else:
            self.percentage = None
        
        if self.percentage is not None:
            if self.percentage >= 90:
                self.final_grade = 'A+'
            elif self.percentage >= 85:
                self.final_grade = 'A'
            elif self.percentage >= 80:
                self.final_grade = 'A-'
            elif self.percentage >= 75:
                self.final_grade = 'B+'
            elif self.percentage >= 70:
                self.final_grade = 'B'
            elif self.percentage >= 65:
                self.final_grade = 'B-'
            elif self.percentage >= 60:
                self.final_grade = 'C+'
            elif self.percentage >= 50:
                self.final_grade = 'C'
            elif self.percentage >= 45:
                self.final_grade = 'C-'
            elif self.percentage >= 40:
                self.final_grade = 'D'
            else:
                self.final_grade = 'F'
        else:
            self.final_grade = None
    
    def add_grade_component(self, name, score, max_score, weight=1.0):
        """Helper method to add a grade component"""
        if not self.grade_components:
            self.grade_components = {}
        
        self.grade_components[name] = {
            'score': float(score),
            'max_score': float(max_score),
            'weight': float(weight),
        }
    
    def get_grade_component(self, name):
        """Get a specific grade component"""
        return self.grade_components.get(name)
    
    def remove_grade_component(self, name):
        """Remove a grade component"""
        if name in self.grade_components:
            del self.grade_components[name]
    
    @property
    def is_passing(self):
        """Check if the grade is passing (D or better)"""
        return self.final_grade in ['A', 'B', 'C', 'D']
    
    @property
    def grade_points(self):
        """Calculate grade points (typically used for GPA calculation)"""
        grade_point_map = {
            'A': 4.0,
            'B': 3.0,
            'C': 2.0,
            'D': 1.0,
            'F': 0.0
        }
        if self.final_grade and hasattr(self.course, 'course_credit'):
            return grade_point_map.get(self.final_grade, 0.0) * self.course.course_credit
        return 0.0

class GradeFormTemplate(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name='grade_form_templates'
    )
    teacher = models.ForeignKey(
        Teachers,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['course', 'title']
    
    def __str__(self):
        return f"{self.course.course_name} - {self.title}"

class GradeComponentTemplate(models.Model):
    form_template = models.ForeignKey(
        GradeFormTemplate,
        on_delete=models.CASCADE,
        related_name='components'
    )
    name = models.CharField(max_length=100)
    max_score = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        default=1.0,
        help_text="Weight of this component in final grade calculation (1.0 = 100%)"
    )
    is_required = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['form_template', 'name']
        ordering = ['order']
    
    def __str__(self):
        return f"{self.form_template.title} - {self.name}"