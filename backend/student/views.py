# # from django.shortcuts import render

# # # Create your views here.
# # # student/views.py
# # from rest_framework import generics, permissions, filters
# # from django_filters.rest_framework import DjangoFilterBackend
# # from .models import Grade, Student
# # from .serializers import GradeSerializer, StudentSerializer, StudentDetailSerializer
# # from user.models import UsersAuths


# # # student/views.py
# # class StudentListCreateView(generics.ListCreateAPIView):
# #     queryset = Student.objects.all().prefetch_related('courses')
# #     serializer_class = StudentSerializer
# #     permission_classes = [permissions.IsAuthenticated]

# # class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
# #     queryset = Student.objects.all().prefetch_related('courses')
# #     serializer_class = StudentSerializer
# #     permission_classes = [permissions.IsAuthenticated]
# #     lookup_field = 'username'


# #     # views.py
# # from rest_framework import viewsets, status
# # from rest_framework.response import Response
# # from .models import Student
# # from .serializers import StudentSerializer

# # class StudentViewSet(viewsets.ModelViewSet):
# #     queryset = Student.objects.all()
# #     serializer_class = StudentSerializer
 


# from rest_framework import generics, status
# from rest_framework.response import Response
# from .models import Student, StudentCourse
# from .serializers import StudentSerializer
# from courses.models import Course

# class StudentCreateView(generics.CreateAPIView):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer
    
#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
        
#         try:
#             self.perform_create(serializer)
#             headers = self.get_success_headers(serializer.data)
#             return Response(
#                 {
#                     'message': 'Student registered successfully with courses',
#                     'data': serializer.data
#                 },
#                 status=status.HTTP_201_CREATED,
#                 headers=headers
#             )
#         except Exception as e:
#             return Response(
#                 {
#                     'error': 'Failed to register student',
#                     'details': str(e)
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )

# class StudentUpdateView(generics.UpdateAPIView):
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer
#     lookup_field = 'username'  # Assuming username is the identifier
    
#     def update(self, request, *args, **kwargs):
#         partial = kwargs.pop('partial', False)
#         instance = self.get_object()
#         serializer = self.get_serializer(instance, data=request.data, partial=partial)
#         serializer.is_valid(raise_exception=True)
        
#         try:
#             self.perform_update(serializer)
#             return Response(
#                 {
#                     'message': 'Student updated successfully',
#                     'data': serializer.data
#                 },
#                 status=status.HTTP_200_OK
#             )
#         except Exception as e:
#             return Response(
#                 {
#                     'error': 'Failed to update student',
#                     'details': str(e)
#                 },
#                 status=status.HTTP_400_BAD_REQUEST
#             )





        
# from rest_framework import generics
# from .models import Student
# from .serializers import StudentSerializer

# class StudentListView(generics.ListAPIView):
#     """GET /api/students/ - List all students"""
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class StudentCreateView(generics.CreateAPIView):
#     """POST /api/students/create/ - Create new student"""
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer

# class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     """GET, PUT, DELETE /api/students/<username>/ - Single student operations"""
#     queryset = Student.objects.all()
#     serializer_class = StudentSerializer
#     lookup_field = 'username'


# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from .models import StudentCourse
# from courses.models import Course

# @api_view(['GET'])
# def get_student_courses(request, username):
#     try:
#         # CORRECTED: Filter by student's username ForeignKey
#         student_courses = StudentCourse.objects.filter(student__username__username=username)
        
#         # Get the course details for each StudentCourse entry
#         courses = []
#         for sc in student_courses:
#             course = {
#                 'course_id': sc.course.course_id,
#                 'course_name': sc.course.course_name,
#                 'course_credit': sc.course.course_credit,
#                 'course_taken_year': sc.course.course_taken_year,
#                 'course_taken_semester': sc.course.course_taken_semester,
#                 'course_category': sc.course.course_category,
#                 'registered_at': sc.registered_at
#             }
#             courses.append(course)
        
#         return Response({'courses': courses})
#     except Exception as e:
#         return Response({'error': str(e)}, status=400)


# student/views.py
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Student, StudentCourse, Grade
from .serializers import (
    StudentSerializer,
    StudentDetailSerializer,
    GradeSerializer,
)
from courses.models import Course


class StudentListView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentDetailSerializer   


class StudentCreateView(generics.CreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer  


from rest_framework import generics
from rest_framework.exceptions import NotFound
from .models import Student
from .serializers import StudentDetailSerializer

class StudentDetailView(generics.RetrieveAPIView):
    serializer_class = StudentDetailSerializer
    lookup_field = "username"

    def get_queryset(self):
        return Student.objects.all()

    def get_object(self):
        username = self.kwargs.get("username")
        students = self.get_queryset().filter(username=username)

        if not students.exists():
            raise NotFound("Student not found")

        # ✅ Pass only one instance, serializer will fetch all
        return students.first()



@api_view(["GET"])
def get_student_courses(request, username):
    """
    GET /api/students/<username>/courses/ - Get all courses a student is enrolled in
    """
    try:
        student_courses = StudentCourse.objects.filter(student__username__username=username)

        courses = []
        for sc in student_courses:
            courses.append({
                "course_id": sc.course.course_id,
                "course_name": sc.course.course_name,
                "course_credit": sc.course.course_credit,
                "course_taken_year": sc.course.course_taken_year,
                "course_taken_semester": sc.course.course_taken_semester,
                "course_category": sc.course.course_category,
                "registered_at": sc.registered_at,
            })

        return Response({"courses": courses})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["GET"])
def get_student_grades(request, username):
    """
    GET /api/students/<username>/grades/ - Get all grades for a student
    """
    try:
        grades = Grade.objects.filter(username__username=username)
        serializer = GradeSerializer(grades, many=True)
        return Response({"grades": serializer.data})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    


    # views.py
from django.http import JsonResponse
from .models import Student

def check_registration(request):
    username = request.GET.get('username')
    year = request.GET.get('year')
    semester = request.GET.get('semester')

    exists = Student.objects.filter(
        username=username,
        year=year,
        semester=semester
    ).exists()

    return JsonResponse({'exists': exists})

