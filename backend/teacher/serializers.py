
from rest_framework import serializers
from .models import Teachers, TeachersCourse
from user.models import UsersAuths
from collages.models import College
from courses.models import Course

class TeachersSerializer(serializers.ModelSerializer):
    user_first_name = serializers.CharField(source='username.firstName', read_only=True)
    user_father_name = serializers.CharField(source='username.fatherName', read_only=True)
    college_name = serializers.CharField(source='college_id.college_name', read_only=True)
    
    class Meta:
        model = Teachers
        fields = [
            'teacher_id', 'username', 'user_first_name', 'user_father_name',
            'college_id', 'college_name', 'academic_level',
            'updated_at', 'created_at'
        ]
        extra_kwargs = {
            'username': {'write_only': True},
            'college_id': {'write_only': True},
        }

    def validate_teacher_id(self, value):
        """Validate teacher ID format"""
        if not value.startswith('DBU'):
            raise serializers.ValidationError("Teacher ID must start with 'DBU'")
        return value.upper()

    def validate(self, data):
        """Additional validation"""
        # Check if the user has teacher role
        username = data.get('username')
        if username and username.role != 'teacher':
            raise serializers.ValidationError("The selected user must have a teacher role")
        return data


class TeachersCourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher_id.username.firstName', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    course_credit = serializers.IntegerField(source='course_id.course_credit', read_only=True)
    department_name = serializers.CharField(source='course_id.department_id.department_name', read_only=True)
    
    class Meta:
        model = TeachersCourse
        fields = [
            'id', 'teacher_id', 'teacher_name', 'course_id', 'course_name',
            'course_credit', 'department_name', 'batch', 'year', 'semester',
            'updated_at', 'created_at'
        ]
        extra_kwargs = {
            'teacher_id': {'write_only': True},
            'course_id': {'write_only': True},
        }

    def validate(self, data):
        """Validate that the same teacher isn't assigned to the same course in same batch/year/semester"""
        teacher_id = data.get('teacher_id')
        course_id = data.get('course_id')
        batch = data.get('batch')
        year = data.get('year')
        semester = data.get('semester')

        if TeachersCourse.objects.filter(
            teacher_id=teacher_id,
            course_id=course_id,
            batch=batch,
            year=year,
            semester=semester
        ).exists():
            raise serializers.ValidationError(
                "This teacher is already assigned to this course for the same batch, year, and semester"
            )
        
        return data



class TeachersDetailSerializer(TeachersSerializer):
  
    class Meta(TeachersSerializer.Meta):
        extra_kwargs = {}


class TeachersCourseDetailSerializer(TeachersCourseSerializer):
  
    class Meta(TeachersCourseSerializer.Meta):
        extra_kwargs = {}



class TeacherDropdownSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Teachers
        fields = ['teacher_id', 'full_name']
    
    def get_full_name(self, obj):
        return f"{obj.username.firstName} {obj.username.fatherName}"


class TeachersCourseDropdownSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()
    
    class Meta:
        model = TeachersCourse
        fields = ['id', 'display_name']
    
    def get_display_name(self, obj):
        return f"{obj.teacher_id} - {obj.course_id} - {obj.batch}"
    


  
class UserTeachersCourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher_id.username.firstName', read_only=True)
    teacher_father_name = serializers.CharField(source='teacher_id.username.fatherName', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)
    course_code = serializers.CharField(source='course_id.course_code', read_only=True)
    course_credit = serializers.IntegerField(source='course_id.course_credit', read_only=True)
    college_name = serializers.CharField(source='teacher_id.college_id.college_name', read_only=True)
    department_name = serializers.CharField(source='course_id.department_id.department_name', read_only=True)
    
    class Meta:
        model = TeachersCourse
        fields = [
            'id', 
            'teacher_id', 'teacher_name', 'teacher_father_name',
            'course_id', 'course_name', 'course_code', 'course_credit',
            'college_name', 'department_name',
            'batch', 'year', 'semester',
            'updated_at', 'created_at'
        ]