
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Teachers, TeachersCourse
from .serializers import (
    TeachersSerializer, TeachersDetailSerializer,
    TeachersCourseSerializer, TeachersCourseDetailSerializer,
    TeacherDropdownSerializer, TeachersCourseDropdownSerializer
)
from user.models import UsersAuths
from collages.models import College
from courses.models import Course

class TeachersViewSet(viewsets.ModelViewSet):
    queryset = Teachers.objects.select_related('username', 'college_id').all()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            return TeachersDetailSerializer
        return TeachersSerializer
    
    def create(self, request, *args, **kwargs):
    
        username = request.data.get('username')
        
        if username and not UsersAuths.objects.filter(username=username).exists():
            return Response(
                {"error": "User with this username does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
      
        username = request.data.get('username')
        if username and username != instance.username.username:
            if not UsersAuths.objects.filter(username=username).exists():
                return Response(
                    {"error": "User with this username does not exist"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dropdown(self, request):
        """Get teachers for dropdown selection"""
        teachers = Teachers.objects.select_related('username').all()
        serializer = TeacherDropdownSerializer(teachers, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def courses(self, request, pk=None):
        """Get all courses assigned to a specific teacher"""
        teacher = self.get_object()
        courses = TeachersCourse.objects.filter(teacher_id=teacher) \
            .select_related('course_id__department_id')
        serializer = TeachersCourseSerializer(courses, many=True)
        return Response(serializer.data)


class TeachersCourseViewSet(viewsets.ModelViewSet):
    queryset = TeachersCourse.objects.select_related(
        'teacher_id__username', 'course_id__department_id'
    ).all()
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            return TeachersCourseDetailSerializer
        return TeachersCourseSerializer
    
    def create(self, request, *args, **kwargs):
    
        teacher_id = request.data.get('teacher_id')
        course_id = request.data.get('course_id')
        
        if not Teachers.objects.filter(teacher_id=teacher_id).exists():
            return Response(
                {"error": "Teacher with this ID does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not Course.objects.filter(course_id=course_id).exists():
            return Response(
                {"error": "Course with this ID does not exist"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
       
        teacher_id = request.data.get('teacher_id')
        course_id = request.data.get('course_id')
        
        if teacher_id and teacher_id != instance.teacher_id.teacher_id:
            if not Teachers.objects.filter(teacher_id=teacher_id).exists():
                return Response(
                    {"error": "Teacher with this ID does not exist"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        if course_id and course_id != instance.course_id.course_id:
            if not Course.objects.filter(course_id=course_id).exists():
                return Response(
                    {"error": "Course with this ID does not exist"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def dropdown(self, request):
        """Get teacher course assignments for dropdown selection"""
        assignments = TeachersCourse.objects.select_related(
            'teacher_id__username', 'course_id'
        ).all()
        serializer = TeachersCourseDropdownSerializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_teacher(self, request):
        """Get courses by teacher ID"""
        teacher_id = request.query_params.get('teacher_id')
        if not teacher_id:
            return Response(
                {"error": "teacher_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        courses = TeachersCourse.objects.filter(teacher_id=teacher_id) \
            .select_related('course_id__department_id')
        serializer = TeachersCourseSerializer(courses, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_course(self, request):
        """Get teachers by course ID"""
        course_id = request.query_params.get('course_id')
        if not course_id:
            return Response(
                {"error": "course_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        teachers = TeachersCourse.objects.filter(course_id=course_id) \
            .select_related('teacher_id__username')
        serializer = TeachersCourseSerializer(teachers, many=True)
        return Response(serializer.data)
    


