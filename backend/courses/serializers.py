


# import re
# from rest_framework import serializers
# from .models import Course

# class CourseSerializer(serializers.ModelSerializer):
#     prerequisite_code = serializers.CharField(source="course_prerequisite.course_code", read_only=True)

#     class Meta:
#         model = Course
#         fields = [
#             "course_code",
#             "course_title",
#             "course_department",
#             "course_credit",
#             "course_taken_year",
#             "course_taken_semester",
#             "course_category",
#             "course_prerequisite",
#             "prerequisite_code",
#             "created_at",
#             "updated_at",
#         ]

   
#     def validate_course_department(self, value):
#         """Department name must be letters only (allow spaces)."""
#         if not re.match(r'^[A-Za-z ]+$', value):
#             raise serializers.ValidationError("Department name must contain letters only.")
#         return value.strip()

#     def validate_course_title(self, value):
#         """Course title must be letters only (allow spaces)."""
#         if not re.match(r'^[A-Za-z ]+$', value):
#             raise serializers.ValidationError("Course title must contain letters only.")
#         return value.strip()

#     def validate_course_credit(self, value):
#         """Course credit must be a positive integer (>0)."""
#         if value <= 0:
#             raise serializers.ValidationError("Course credit must be greater than 0.")
#         return value

    
#     def validate(self, attrs):
#         """Ensure prerequisite is not itself (no circular reference)."""
#         if "course_prerequisite" in attrs and attrs.get("course_prerequisite"):
#             if attrs["course_prerequisite"].course_code == attrs.get("course_code"):
#                 raise serializers.ValidationError("A course cannot be its own prerequisite.")
#         return attrs





# # from rest_framework import serializers
# # from .models import College, Department
# # import re

# # letters_only = re.compile(r'^[A-Za-z\s]+$')

# # class CollegeSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = College
# #         fields = ['id', 'college_code', 'name']

# #     def validate_college_name(self, value):
# #         if not letters_only.match(value):
# #             raise serializers.ValidationError("College name must contain letters only")
# #         return value


# # class DepartmentSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = Department
# #         fields = '__all__'

# #     def validate_department_name(self, value):
# #         if not letters_only.match(value):
# #             raise serializers.ValidationError("Department name must contain letters only")
# #         return value





# # courses/serializers.py
# from rest_framework import serializers
# from .models import Course
# from collages.serializers import DepartmentSerializer

# class CourseSerializer(serializers.ModelSerializer):
#     department_name = serializers.CharField(source='department_id.department_name', read_only=True)
#     college_name = serializers.CharField(source='department_id.college_id.college_name', read_only=True)
    
#     class Meta:
#         model = Course
#         fields = [
#             'course_id', 'course_name', 'course_credit', 
#             'course_taken_year', 'course_taken_semester', 
#             'course_category', 'department_id', 'department_name', 'college_name'
#         ]


# # courses/serializers.py (add this at the bottom)
# class CourseWithGradesSerializer(serializers.ModelSerializer):
#     department_name = serializers.CharField(source='department_id.department_name', read_only=True)
#     grades = serializers.SerializerMethodField()
    
#     class Meta:
#         model = Course
#         fields = [
#             'course_id', 'course_name', 'course_credit', 
#             'course_taken_year', 'course_taken_semester', 
#             'course_category', 'department_id', 'department_name', 'grades'
#         ]
    
#     def get_grades(self, obj):
#         from student.serializers import GradeSerializer
#         grades = obj.grade_set.all()  # This assumes a reverse relation from Course to Grade
#         return GradeSerializer(grades, many=True).data



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
            'course_category', 'department_id', 'department_name', 'college_name'
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


class CourseWithGradesSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department_id.department_name', read_only=True)
    grades = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = [
            'course_id', 'course_name', 'course_credit', 
            'course_taken_year', 'course_taken_semester', 
            'course_category', 'department_id', 'department_name', 'grades'
        ]
    
    def get_grades(self, obj):
        from student.serializers import GradeSerializer
        grades = obj.grade_set.all()  # Reverse relation from Course to Grade
        return GradeSerializer(grades, many=True).data


# Optional: If you need a simple serializer for basic operations
class CourseBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['course_id', 'course_name', 'course_credit']