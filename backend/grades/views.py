# # grades/views.py
# from rest_framework import viewsets, status, generics
# from rest_framework.decorators import action, api_view
# from rest_framework.response import Response
# from django.shortcuts import get_object_or_404
# from django.db import transaction
# from django.http import JsonResponse
# from .models import DynamicGrade, GradeFormTemplate, GradeComponentTemplate
# from .serializers import (
#     DynamicGradeSerializer, GradeFormTemplateSerializer, 
#     GradeComponentTemplateSerializer, BulkGradeCreateSerializer,
#     GradeFormCreateSerializer
# )
# from student.models import Student
# from courses.models import Course
# from teacher.models import Teachers

# # grades/views.py
# class DynamicGradeViewSet(viewsets.ModelViewSet):
#     queryset = DynamicGrade.objects.all()
#     serializer_class = DynamicGradeSerializer
    
#     def create(self, request, *args, **kwargs):
#         # Handle single creation with username
#         data = request.data.copy()
#         if 'student' in data and isinstance(data['student'], str) and not data['student'].isdigit():
#             # This is a username, not an ID
#             try:
#                 student = Student.objects.get(username=data['student'])
#                 data['student'] = student.id
#             except Student.DoesNotExist:
#                 return Response(
#                     {'error': f"Student with username '{data['student']}' does not exist"},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
        
#         serializer = self.get_serializer(data=data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         headers = self.get_success_headers(serializer.data)
#         return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
#     @action(detail=False, methods=['post'])
#     def bulk_create(self, request):
#         """Create or update multiple grades at once"""
#         grades_data = request.data.get('grades', [])
        
#         # Convert usernames to IDs
#         processed_grades = []
#         for grade_data in grades_data:
#             processed_grade = grade_data.copy()
            
#             # Handle student field
#             student_field = grade_data.get('student')
#             if student_field and isinstance(student_field, str) and not student_field.isdigit():
#                 try:
#                     student = Student.objects.get(username=student_field)
#                     processed_grade['student'] = student.id
#                 except Student.DoesNotExist:
#                     return Response(
#                         {'error': f"Student with username '{student_field}' does not exist"},
#                         status=status.HTTP_400_BAD_REQUEST
#                     )
            
#             processed_grades.append(processed_grade)
        
#         # Use the regular serializer with processed data
#         serializer = BulkGradeCreateSerializer(data={'grades': processed_grades})
#         if serializer.is_valid():
#             try:
#                 with transaction.atomic():
#                     result = serializer.save()
#                 return Response(
#                     DynamicGradeSerializer(result['grades'], many=True).data,
#                     status=status.HTTP_201_CREATED
#                 )
#             except Exception as e:
#                 return Response(
#                     {'error': str(e)},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#     queryset = DynamicGrade.objects.all()
#     serializer_class = DynamicGradeSerializer
    
#     def get_queryset(self):
#         queryset = DynamicGrade.objects.all()
        
#         # Filter by student
#         student_id = self.request.query_params.get('student_id')
#         if student_id:
#             queryset = queryset.filter(student_id=student_id)
        
#         # Filter by course
#         course_id = self.request.query_params.get('course_id')
#         if course_id:
#             queryset = queryset.filter(course_id=course_id)
        
#         # Filter by teacher
#         teacher_id = self.request.query_params.get('teacher_id')
#         if teacher_id:
#             queryset = queryset.filter(teacher_id=teacher_id)
        
#         # Filter by active status
#         is_active = self.request.query_params.get('is_active')
#         if is_active is not None:
#             queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
#         return queryset
    
#     @action(detail=False, methods=['post'])
#     def bulk_create(self, request):
#         """Create or update multiple grades at once"""
#         serializer = BulkGradeCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 with transaction.atomic():
#                     result = serializer.save()
#                 return Response(
#                     DynamicGradeSerializer(result['grades'], many=True).data,
#                     status=status.HTTP_201_CREATED
#                 )
#             except Exception as e:
#                 return Response(
#                     {'error': str(e)},
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     @action(detail=True, methods=['post'])
#     def add_component(self, request, pk=None):
#         """Add a grade component to an existing grade"""
#         grade = self.get_object()
#         component_name = request.data.get('name')
#         score = request.data.get('score')
#         max_score = request.data.get('max_score')
#         weight = request.data.get('weight', 1.0)
        
#         if not all([component_name, score]):
#             return Response(
#                 {'error': 'Name and score are required'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
        
#         grade.add_grade_component(component_name, score, max_score, weight)
#         grade.save()
        
#         serializer = self.get_serializer(grade)
#         return Response(serializer.data)
    
#     @action(detail=True, methods=['post'])
#     def recalculate(self, request, pk=None):
#         """Recalculate scores for a grade"""
#         grade = self.get_object()
#         grade.calculate_scores()
#         grade.save()
        
#         serializer = self.get_serializer(grade)
#         return Response(serializer.data)

# class GradeFormTemplateViewSet(viewsets.ModelViewSet):
#     queryset = GradeFormTemplate.objects.all()
#     serializer_class = GradeFormTemplateSerializer
    
#     def get_serializer_class(self):
#         if self.action in ['create', 'update']:
#             return GradeFormCreateSerializer
#         return GradeFormTemplateSerializer
    
#     def get_queryset(self):
#         queryset = GradeFormTemplate.objects.all()
        
#         # Filter by course
#         course_id = self.request.query_params.get('course_id')
#         if course_id:
#             queryset = queryset.filter(course_id=course_id)
        
#         # Filter by teacher
#         teacher_id = self.request.query_params.get('teacher_id')
#         if teacher_id:
#             queryset = queryset.filter(teacher_id=teacher_id)
        
#         # Filter by active status
#         is_active = self.request.query_params.get('is_active')
#         if is_active is not None:
#             queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
#         return queryset

# class GradeComponentTemplateViewSet(viewsets.ModelViewSet):
#     queryset = GradeComponentTemplate.objects.all()
#     serializer_class = GradeComponentTemplateSerializer
    
#     def get_queryset(self):
#         queryset = GradeComponentTemplate.objects.all()
        
#         # Filter by form template
#         form_template_id = self.request.query_params.get('form_template_id')
#         if form_template_id:
#             queryset = queryset.filter(form_template_id=form_template_id)
        
#         return queryset

# # Additional API views
# @api_view(['GET'])
# def get_course_students(request, course_id):
#     """Get all students enrolled in a specific course"""
#     try:
#         course = Course.objects.get(course_id=course_id)
#         # Assuming you have a way to get students for a course
#         # This might need to be adjusted based on your student-course relationship
#         students = Student.objects.filter(
#             courses=course,
#             year=course.course_taken_year,
#             semester=course.course_taken_semester
#         )
#         student_data = [{
#             'id': student.username,
#             'name': f"{student.firstName} {student.fatherName}",
#             'department': student.department_id
#         } for student in students]
        
#         return Response(student_data)
#     except Course.DoesNotExist:
#         return Response(
#             {'error': 'Course not found'},
#             status=status.HTTP_404_NOT_FOUND
#         )

# @api_view(['POST'])
# def upload_grades_from_excel(request):
#     """Upload grades from Excel file (simplified version)"""
#     try:
#         # This would typically process an uploaded Excel file
#         # For now, we'll assume the data is sent as JSON
#         grades_data = request.data.get('grades', [])
        
#         created_grades = []
#         for grade_data in grades_data:
#             serializer = DynamicGradeSerializer(data=grade_data)
#             if serializer.is_valid():
#                 grade = serializer.save()
#                 created_grades.append(grade)
#             else:
#                 return Response(
#                     serializer.errors,
#                     status=status.HTTP_400_BAD_REQUEST
#                 )
        
#         return Response(
#             DynamicGradeSerializer(created_grades, many=True).data,
#             status=status.HTTP_201_CREATED
#         )
        
#     except Exception as e:
#         return Response(
#             {'error': str(e)},
#             status=status.HTTP_400_BAD_REQUEST
#         )

# @api_view(['GET'])
# def get_teacher_courses(request, teacher_id):
#     """Get all courses taught by a specific teacher"""
#     try:
#         teacher = Teachers.objects.get(teacher_id=teacher_id)
#         courses = Course.objects.filter(instructor=teacher.teacher_id)
        
#         course_data = [{
#             'course_id': course.course_id,
#             'course_name': course.course_name,
#             'year': course.course_taken_year,
#             'semester': course.course_taken_semester,
#             'department': course.department_id
#         } for course in courses]
        
#         return Response(course_data)
#     except Teachers.DoesNotExist:
#         return Response(
#             {'error': 'Teacher not found'},
#             status=status.HTTP_404_NOT_FOUND
#         )



# # grades/views.py
# from student.models import Student, StudentCourse
# from courses.models import Course
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status

# @api_view(['GET'])
# def get_course_students(request, course_id):
#     """Get students enrolled in a course that match the course's department, year, and semester"""
#     try:
#         course = Course.objects.get(course_id=course_id)

#         # 🔍 Query students linked through StudentCourse and filter by department/year/semester
#         student_courses = StudentCourse.objects.filter(course=course).select_related("student")
#         students = [
#             sc.student for sc in student_courses
#             if sc.student.department_id == course.department_id
#             and sc.student.year == course.course_taken_year
#             and sc.student.semester == course.course_taken_semester
#         ]

#         # ✅ Prepare response
#         student_data = [{
#             "id": student.username.username if hasattr(student.username, "username") else student.username.id,
#             "name": f"{student.firstName} {student.fatherName}",
#             "department": student.department_id.department_name if hasattr(student.department_id, "department_name") else str(student.department_id_id),
#             "year": student.year,
#             "semester": student.semester,
#             "course_category": student.course_category,
#         } for student in students]

#         return Response(student_data, status=status.HTTP_200_OK)

#     except Course.DoesNotExist:
#         return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)




from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.http import JsonResponse
from .models import DynamicGrade, GradeFormTemplate, GradeComponentTemplate
from .serializers import (
    DynamicGradeSerializer, DynamicGradeIDSerializer, GradeFormTemplateSerializer, 
    GradeComponentTemplateSerializer, BulkGradeCreateSerializer,
    GradeFormCreateSerializer
)
from student.models import Student
from courses.models import Course
from teacher.models import Teachers

class DynamicGradeViewSet(viewsets.ModelViewSet):
    queryset = DynamicGrade.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'bulk_create':
            return BulkGradeCreateSerializer
        return DynamicGradeIDSerializer  # Use the ID serializer for single operations
    
    def create(self, request, *args, **kwargs):
        """Handle single grade creation"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            with transaction.atomic():
                self.perform_create(serializer)
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Create or update multiple grades at once"""
        serializer = BulkGradeCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    result = serializer.save()
                
                response_data = {
                    'message': f"Successfully processed {len(result['grades'])} grades",
                    'created_count': len(result['grades']),
                    'grades': DynamicGradeIDSerializer(result['grades'], many=True).data
                }
                
                if result.get('errors'):
                    response_data['errors'] = result['errors']
                    response_data['message'] += f" with {len(result['errors'])} errors"
                
                status_code = status.HTTP_201_CREATED
                if result.get('errors') and not result['grades']:
                    status_code = status.HTTP_400_BAD_REQUEST
                
                return Response(response_data, status=status_code)
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get_queryset(self):
        queryset = DynamicGrade.objects.all()
        
        # Filter by student
        student_id = self.request.query_params.get('student_id')
        if student_id:
            queryset = queryset.filter(student_id=student_id)
        
        # Filter by course
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        # Filter by teacher
        teacher_id = self.request.query_params.get('teacher_id')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def add_component(self, request, pk=None):
        """Add a grade component to an existing grade"""
        grade = self.get_object()
        component_name = request.data.get('name')
        score = request.data.get('score')
        max_score = request.data.get('max_score')
        weight = request.data.get('weight', 1.0)
        
        if not all([component_name, score]):
            return Response(
                {'error': 'Name and score are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        grade.add_grade_component(component_name, score, max_score, weight)
        grade.save()
        
        serializer = self.get_serializer(grade)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def recalculate(self, request, pk=None):
        """Recalculate scores for a grade"""
        grade = self.get_object()
        grade.calculate_scores()
        grade.save()
        
        serializer = self.get_serializer(grade)
        return Response(serializer.data)

class GradeFormTemplateViewSet(viewsets.ModelViewSet):
    queryset = GradeFormTemplate.objects.all()
    serializer_class = GradeFormTemplateSerializer
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return GradeFormCreateSerializer
        return GradeFormTemplateSerializer
    
    def get_queryset(self):
        queryset = GradeFormTemplate.objects.all()
        
        # Filter by course
        course_id = self.request.query_params.get('course_id')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        
        # Filter by teacher
        teacher_id = self.request.query_params.get('teacher_id')
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

class GradeComponentTemplateViewSet(viewsets.ModelViewSet):
    queryset = GradeComponentTemplate.objects.all()
    serializer_class = GradeComponentTemplateSerializer
    
    def get_queryset(self):
        queryset = GradeComponentTemplate.objects.all()
        
        # Filter by form template
        form_template_id = self.request.query_params.get('form_template_id')
        if form_template_id:
            queryset = queryset.filter(form_template_id=form_template_id)
        
        return queryset

@api_view(['GET'])
def get_course_students(request, course_id):
    """Get students enrolled in a course with their IDs"""
    try:
        course = Course.objects.get(course_id=course_id)
        
        # Get students through StudentCourse relationship
        from student.models import StudentCourse
        student_courses = StudentCourse.objects.filter(course=course).select_related("student")
        
        students = [
            sc.student for sc in student_courses
            if sc.student.department_id == course.department_id
            and sc.student.year == course.course_taken_year
            and sc.student.semester == course.course_taken_semester
        ]

        # Return students with both ID and username
        student_data = [{
            "id": student.id,  # Include the database ID
            "username": student.username,
            "name": f"{student.firstName} {student.fatherName}",
            "department": student.department_id.department_name if hasattr(student.department_id, "department_name") else str(student.department_id),
            "year": student.year,
            "semester": student.semester,
        } for student in students]

        return Response(student_data, status=status.HTTP_200_OK)

    except Course.DoesNotExist:
        return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def upload_grades_from_excel(request):
    """Upload grades from Excel file"""
    try:
        grades_data = request.data.get('grades', [])
        
        created_grades = []
        errors = []
        
        for index, grade_data in enumerate(grades_data):
            serializer = DynamicGradeIDSerializer(data=grade_data)
            if serializer.is_valid():
                try:
                    grade = serializer.save()
                    created_grades.append(grade)
                except Exception as e:
                    errors.append(f"Row {index + 1}: {str(e)}")
            else:
                errors.append(f"Row {index + 1}: {serializer.errors}")
        
        if created_grades:
            response_data = {
                'message': f"Successfully created {len(created_grades)} grades",
                'grades': DynamicGradeIDSerializer(created_grades, many=True).data
            }
            if errors:
                response_data['errors'] = errors
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
def get_teacher_courses(request, teacher_id):
    """Get all courses taught by a specific teacher"""
    try:
        teacher = Teachers.objects.get(teacher_id=teacher_id)
        courses = Course.objects.filter(instructor=teacher.teacher_id)
        
        course_data = [{
            'course_id': course.course_id,
            'course_name': course.course_name,
            'year': course.course_taken_year,
            'semester': course.course_taken_semester,
            'department': course.department_id
        } for course in courses]
        
        return Response(course_data)
    except Teachers.DoesNotExist:
        return Response(
            {'error': 'Teacher not found'},
            status=status.HTTP_404_NOT_FOUND
        )