# # from rest_framework import serializers
# # from .models import Collages, Department
# # import re


# # # Reusable validator for names
# # def validate_name_only_letters(value):
# #     if not re.match(r'^[A-Za-z\s]+$', value):
# #         raise serializers.ValidationError("Name must contain only letters and spaces.")
# #     return value


# # class CollagesSerializer(serializers.ModelSerializer):
# #     name = serializers.CharField(
# #         max_length=255,
# #         validators=[validate_name_only_letters]
# #     )

# #     class Meta:
# #         model = Collages
# #         fields = ['college_code', 'name', 'created_at', 'updated_at']

# #     # Unique name validation (case-insensitive)
# #     def validate_name(self, value):
# #         qs = Collages.objects.filter(name__iexact=value)
# #         if self.instance:  # Exclude current instance on update
# #             qs = qs.exclude(pk=self.instance.pk)
# #         if qs.exists():
# #             raise serializers.ValidationError("College name must be unique.")
# #         return value


# # class DepartmentSerializer(serializers.ModelSerializer):
# #     department_name = serializers.CharField(
# #         max_length=255,
# #         validators=[validate_name_only_letters]
# #     )

# #     class Meta:
# #         model = Department
# #         fields = ['department_code', 'department_name', 'college', 'created_at', 'updated_at']

# #     # Unique department name within the same college (case-insensitive)
# #     def validate(self, attrs):
# #         college = attrs.get('college') or getattr(self.instance, 'college', None)
# #         department_name = attrs.get('department_name') or getattr(self.instance, 'department_name', None)

# #         if college and department_name:
# #             qs = Department.objects.filter(department_name__iexact=department_name, college=college)
# #             if self.instance:  # Exclude current instance on update
# #                 qs = qs.exclude(pk=self.instance.pk)
# #             if qs.exists():
# #                 raise serializers.ValidationError({
# #                     "department_name": "Department name must be unique within the same college."
# #                 })
# #         return attrs
 


# ########################################################################################################



# from rest_framework import serializers
# from .models import Collages, Department
# import re

# def validate_name_only_letters(value):
#     if not re.match(r'^[A-Za-z\s]+$', value):
#         raise serializers.ValidationError("Name must contain only letters and spaces.")
#     return value

# class CollagesSerializer(serializers.ModelSerializer):
#     name = serializers.CharField(
#         max_length=255,
#         validators=[validate_name_only_letters]
#     )

#     class Meta:
#         model = Collages
#         fields = ['college_code', 'name', 'created_at', 'updated_at']

#     def validate_name(self, value):
#         qs = Collages.objects.filter(name__iexact=value)
#         if self.instance:
#             qs = qs.exclude(pk=self.instance.pk)
#         if qs.exists():
#             raise serializers.ValidationError("College name must be unique.")
#         return value




# from rest_framework import serializers
# from .models import Department
# import re

# def validate_name_only_letters(value):
#     if not re.match(r'^[A-Za-z\s]+$', value):
#         raise serializers.ValidationError("Name must contain only letters and spaces.")
#     return value

# class DepartmentSerializer(serializers.ModelSerializer):
#     department_name = serializers.CharField(
#         max_length=255,
#         validators=[validate_name_only_letters]
#     )
#     college_name = serializers.CharField(source='college.name', read_only=True)

#     class Meta:
#         model = Department
#         fields = ['department_code', 'department_name', 'college', 'college_name', 'created_at', 'updated_at']

#     def validate(self, attrs):
#         college = attrs.get('college') or getattr(self.instance, 'college', None)
#         department_name = attrs.get('department_name') or getattr(self.instance, 'department_name', None)

#         if college and department_name:
#             qs = Department.objects.filter(department_name__iexact=department_name, college=college)
#             if self.instance:
#                 qs = qs.exclude(pk=self.instance.pk)
#             if qs.exists():
#                 raise serializers.ValidationError({
#                     "department_name": "Department name must be unique within the same college."
#                 })
#         return attrs



# collages/serializers.py
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