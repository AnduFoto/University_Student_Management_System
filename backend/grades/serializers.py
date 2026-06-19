# # grades/serializers.py
# from rest_framework import serializers
# from .models import DynamicGrade, GradeFormTemplate, GradeComponentTemplate
# from student.models import Student
# from courses.models import Course
# from teacher.models import Teachers

# class GradeComponentTemplateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GradeComponentTemplate
#         fields = '__all__'

# class GradeFormTemplateSerializer(serializers.ModelSerializer):
#     components = GradeComponentTemplateSerializer(many=True, read_only=True)
    
#     class Meta:
#         model = GradeFormTemplate
#         fields = '__all__'

# class DynamicGradeSerializer(serializers.ModelSerializer):
#     student_name = serializers.CharField(source='student.username', read_only=True)
#     course_name = serializers.CharField(source='course.course_name', read_only=True)
#     teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    
#     class Meta:
#         model = DynamicGrade
#         fields = [
#             'id', 'student', 'student_name', 'course', 'course_name', 
#             'teacher', 'teacher_name', 'grade_components', 'final_grade',
#             'total_score', 'max_possible_score', 'percentage', 'is_active',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = [
#             'final_grade', 'total_score', 'max_possible_score', 'percentage',
#             'created_at', 'updated_at'
#         ]
    
#     def validate_grade_components(self, value):
#         """Validate grade components structure"""
#         if not isinstance(value, dict):
#             raise serializers.ValidationError("Grade components must be a JSON object")
        
#         for component_name, component_data in value.items():
#             if not isinstance(component_data, dict):
#                 raise serializers.ValidationError(f"Component {component_name} must be an object")
            
#             if 'score' not in component_data:
#                 raise serializers.ValidationError(f"Component {component_name} must have a score")
            
#             try:
#                 score = float(component_data['score'])
#                 if score < 0:
#                     raise serializers.ValidationError(f"Component {component_name}: score cannot be negative")
                
#                 # Validate max_score if provided
#                 if 'max_score' in component_data:
#                     max_score = float(component_data['max_score'])
#                     if max_score <= 0:
#                         raise serializers.ValidationError(f"Component {component_name}: max_score must be positive")
#                     if score > max_score:
#                         raise serializers.ValidationError(f"Component {component_name}: score cannot exceed max_score")
                
#             except (ValueError, TypeError):
#                 raise serializers.ValidationError(f"Component {component_name}: score must be a number")
        
#         return value
    
#     def validate(self, data):
#         """Additional validation"""
#         # Auto-set teacher from course if not provided
#         if 'course' in data and 'teacher' not in data:
#             course = data['course']
#             if hasattr(course, 'instructor') and course.instructor:
#                 try:
#                     if isinstance(course.instructor, str):
#                         data['teacher'] = Teachers.objects.get(teacher_id=course.instructor)
#                     elif hasattr(course.instructor, 'teacher_id'):
#                         data['teacher'] = course.instructor
#                 except Teachers.DoesNotExist:
#                     pass
        
#         return data

# class BulkGradeCreateSerializer(serializers.Serializer):
#     """Serializer for bulk grade creation"""
#     grades = DynamicGradeSerializer(many=True)
    
#     def create(self, validated_data):
#         grades_data = validated_data.pop('grades')
#         created_grades = []
        
#         for grade_data in grades_data:
#             # Check if grade already exists
#             student = grade_data.get('student')
#             course = grade_data.get('course')
            
#             if student and course:
#                 try:
#                     # Update existing grade
#                     grade = DynamicGrade.objects.get(student=student, course=course)
#                     for attr, value in grade_data.items():
#                         setattr(grade, attr, value)
#                     grade.save()
#                     created_grades.append(grade)
#                 except DynamicGrade.DoesNotExist:
#                     # Create new grade
#                     grade = DynamicGrade.objects.create(**grade_data)
#                     created_grades.append(grade)
        
#         return {'grades': created_grades}

# class GradeFormCreateSerializer(serializers.ModelSerializer):
#     components = GradeComponentTemplateSerializer(many=True, required=False)
    
#     class Meta:
#         model = GradeFormTemplate
#         fields = ['id','course', 'teacher', 'title', 'description', 'components']
    
#     def create(self, validated_data):
#         components_data = validated_data.pop('components', [])
#         form_template = GradeFormTemplate.objects.create(**validated_data)
        
#         for component_data in components_data:
#             GradeComponentTemplate.objects.create(form_template=form_template, **component_data)
        
#         return form_template
    



# # grades/serializers.py
# class UsernameField(serializers.Field):
#     """Custom field to handle student username input"""
    
#     def to_internal_value(self, data):
#         print(f"UsernameField received: {data}, type: {type(data)}")
        
#         # If data is already a student ID (integer), return it
#         if isinstance(data, int):
#             return data
        
#         # If data is a string that can be converted to integer, it's probably an ID
#         if isinstance(data, int) and data.isdigit():
#             return int(data)
        
#         # Otherwise, treat it as a username and look up the student
#         try:
#             student = Student.objects.get(username=data)
#             print(f"Found student by username: {student.id}")
#             return student.id
#         except Student.DoesNotExist:
#             try:
#                 # Try with username_id field if it exists
#                 student = Student.objects.get(username_id=data)
#                 print(f"Found student by username_id: {student.id}")
#                 return student.id
#             except Student.DoesNotExist:
#                 print(f"Student not found for username: {data}")
#                 raise serializers.ValidationError(f"Student with username '{data}' does not exist")
#         except Exception as e:
#             print(f"Error in UsernameField: {e}")
#             raise serializers.ValidationError(f"Error processing student field: {e}")
    
#     def to_representation(self, value):
#         # Return the username when serializing
#         try:
#             student = Student.objects.get(id=value)
#             return student.username
#         except Student.DoesNotExist:
#             return value

# class DynamicGradeSerializer(serializers.ModelSerializer):
#     student = UsernameField()  # Use custom field
    
#     class Meta:
#         model = DynamicGrade
#         fields = '__all__'  # Use __all__ to simplify




from rest_framework import serializers
from .models import DynamicGrade, GradeFormTemplate, GradeComponentTemplate
from student.models import Student
from courses.models import Course
from teacher.models import Teachers

class GradeComponentTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = GradeComponentTemplate
        fields = '__all__'

class GradeFormTemplateSerializer(serializers.ModelSerializer):
    components = GradeComponentTemplateSerializer(many=True, read_only=True)
    
    class Meta:
        model = GradeFormTemplate
        fields = '__all__'

class DynamicGradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    
    class Meta:
        model = DynamicGrade
        fields = [
            'id', 'student', 'student_name', 'student_username', 'course', 'course_name', 
            'teacher', 'teacher_name', 'grade_components', 'final_grade',
            'total_score', 'max_possible_score', 'percentage', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'final_grade', 'total_score', 'max_possible_score', 'percentage',
            'created_at', 'updated_at'
        ]
    
    def validate_student(self, value):
        """Ensure student exists and return the Student instance"""
        if isinstance(value, int):
            try:
                return Student.objects.get(id=value)
            except Student.DoesNotExist:
                raise serializers.ValidationError(f"Student with ID {value} does not exist")
        elif isinstance(value, str):
            try:
                return Student.objects.get(username=value)
            except Student.DoesNotExist:
                raise serializers.ValidationError(f"Student with username '{value}' does not exist")
        elif isinstance(value, Student):
            return value
        else:
            raise serializers.ValidationError("Invalid student value")
    
    def validate_grade_components(self, value):
        """Validate grade components structure"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Grade components must be a JSON object")
        
        for component_name, component_data in value.items():
            if not isinstance(component_data, dict):
                raise serializers.ValidationError(f"Component {component_name} must be an object")
            
            if 'score' not in component_data:
                raise serializers.ValidationError(f"Component {component_name} must have a score")
            
            try:
                score = float(component_data['score'])
                if score < 0:
                    raise serializers.ValidationError(f"Component {component_name}: score cannot be negative")
                
                if 'max_score' in component_data:
                    max_score = float(component_data['max_score'])
                    if max_score <= 0:
                        raise serializers.ValidationError(f"Component {component_name}: max_score must be positive")
                    if score > max_score:
                        raise serializers.ValidationError(f"Component {component_name}: score cannot exceed max_score")
                
            except (ValueError, TypeError):
                raise serializers.ValidationError(f"Component {component_name}: score must be a number")
        
        return value
    
    def validate(self, data):
        """Additional validation"""
        # Auto-set teacher from course if not provided
        if 'course' in data and 'teacher' not in data:
            course = data['course']
            if hasattr(course, 'instructor') and course.instructor:
                try:
                    if isinstance(course.instructor, str):
                        data['teacher'] = Teachers.objects.get(teacher_id=course.instructor)
                    elif hasattr(course.instructor, 'teacher_id'):
                        data['teacher'] = course.instructor
                except Teachers.DoesNotExist:
                    pass
        
        return data

class BulkGradeCreateSerializer(serializers.Serializer):
    """Serializer for bulk grade creation"""
    grades = DynamicGradeSerializer(many=True)
    
    def create(self, validated_data):
        grades_data = validated_data.pop('grades')
        created_grades = []
        errors = []
        
        for index, grade_data in enumerate(grades_data):
            try:
                student = grade_data.get('student')
                course = grade_data.get('course')
                
                if not student or not course:
                    errors.append(f"Row {index + 1}: Student and course are required")
                    continue
                
                # Check if grade already exists
                try:
                    grade = DynamicGrade.objects.get(student=student, course=course)
                    # Update existing grade
                    for attr, value in grade_data.items():
                        if attr not in ['student', 'course']:  # Don't update relationships
                            setattr(grade, attr, value)
                    grade.save()
                    created_grades.append(grade)
                except DynamicGrade.DoesNotExist:
                    # Create new grade
                    grade = DynamicGrade.objects.create(**grade_data)
                    created_grades.append(grade)
                    
            except Exception as e:
                student_identifier = grade_data.get('student', {}).username if hasattr(grade_data.get('student'), 'username') else 'Unknown'
                errors.append(f"Row {index + 1} (Student: {student_identifier}): {str(e)}")
        
        if errors and not created_grades:
            raise serializers.ValidationError({"errors": errors})
        
        return {'grades': created_grades, 'errors': errors}

class GradeFormCreateSerializer(serializers.ModelSerializer):
    components = GradeComponentTemplateSerializer(many=True, required=False)
    
    class Meta:
        model = GradeFormTemplate
        fields = ['id','course', 'teacher', 'title', 'description', 'components']
    
    def create(self, validated_data):
        components_data = validated_data.pop('components', [])
        form_template = GradeFormTemplate.objects.create(**validated_data)
        
        for component_data in components_data:
            GradeComponentTemplate.objects.create(form_template=form_template, **component_data)
        
        return form_template

class StudentIDField(serializers.Field):
    """Custom field to handle student ID input - accepts both ID and username"""
    
    def to_internal_value(self, data):
        print(f"StudentIDField received: {data}, type: {type(data)}")
        
        # If data is already a Student instance, return it
        if isinstance(data, Student):
            return data
        
        # If data is an integer or string that can be converted to integer, treat as ID
        if isinstance(data, int) or (isinstance(data, str) and data.isdigit()):
            try:
                student_id = int(data)
                student = Student.objects.get(id=student_id)
                print(f"Found student by ID: {student.id} - {student.username}")
                return student
            except Student.DoesNotExist:
                raise serializers.ValidationError(f"Student with ID {data} does not exist")
        
        # If data is a string, treat as username
        elif isinstance(data, str):
            try:
                student = Student.objects.get(username=data)
                print(f"Found student by username: {student.id} - {student.username}")
                return student
            except Student.DoesNotExist:
                raise serializers.ValidationError(f"Student with username '{data}' does not exist")
        
        else:
            raise serializers.ValidationError(f"Invalid student value: {data}")
    
    def to_representation(self, value):
        # Return the student ID when serializing
        if isinstance(value, Student):
            return value.id
        return value

# Alternative serializer that uses StudentIDField
class DynamicGradeIDSerializer(serializers.ModelSerializer):
    student = StudentIDField()
    student_name = serializers.CharField(source='student.username', read_only=True)
    student_username = serializers.CharField(source='student.username', read_only=True)
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.username', read_only=True)
    
    class Meta:
        model = DynamicGrade
        fields = '__all__'
        read_only_fields = [
            'final_grade', 'total_score', 'max_possible_score', 'percentage',
            'created_at', 'updated_at'
        ]