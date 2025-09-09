
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

