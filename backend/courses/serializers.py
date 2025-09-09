
from rest_framework import serializers
from .models import Course
from collages.serializers import DepartmentSerializer
import re

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department_id.department_name', read_only=True)
    college_name = serializers.CharField(source='department_id.college_id.college_name', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'course_id', 'course_name', 'course_credit', 
            'course_taken_year', 'course_taken_semester', 
            'course_category', 'department_id', 'department_name', 
            'college_name', 'instructor', 'course_type'
        ]

    def validate_course_name(self, value):
        """Course name must be letters only (allow spaces)."""
        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError("Course name must contain letters only.")
        return value.strip()

    def validate_course_credit(self, value):
        """Course credit must be a positive integer (>0)."""
        if value <= 0:
            raise serializers.ValidationError("Course credit must be greater than 0.")
        return value
    
    def validate_instructor(self, value):
        """Instructor name must be letters only (allow spaces and periods)."""
        if value and not re.match(r'^[A-Za-z .]+$', value):
            raise serializers.ValidationError("Instructor name must contain letters, spaces, and periods only.")
        return value.strip() if value else value


class CourseWithGradesSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department_id.department_name', read_only=True)
    grades = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'course_id', 'course_name', 'course_credit', 
            'course_taken_year', 'course_taken_semester', 
            'course_category', 'department_id', 'department_name', 
            'grades', 'instructor', 'course_type'
        ]
    
    def get_grades(self, obj):
        from student.serializers import GradeSerializer
        grades = obj.grade_set.all()  # Reverse relation from Course to Grade
        return GradeSerializer(grades, many=True).data


# Optional: If you need a simple serializer for basic operations
class CourseBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            'course_id', 'course_name', 'course_credit', 
            'instructor', 'course_type'
        ]
    
    def validate_course_name(self, value):
        """Course name must be letters only (allow spaces)."""
        if not re.match(r'^[A-Za-z ]+$', value):
            raise serializers.ValidationError("Course name must contain letters only.")
        return value.strip()
    
    def validate_instructor(self, value):
        """Instructor name must be letters only (allow spaces and periods)."""
        if value and not re.match(r'^[A-Za-z .]+$', value):
            raise serializers.ValidationError("Instructor name must contain letters, spaces, and periods only.")
        return value.strip() if value else value