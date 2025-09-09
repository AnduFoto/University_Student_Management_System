
from rest_framework import serializers
from .models import College, Department

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    college_name = serializers.CharField(source='college_id.college_name', read_only=True)
    
    class Meta:
        model = Department
        fields = ['department_id', 'department_name', 'college_id', 'college_name']