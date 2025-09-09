
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Course
from .serializers import CourseSerializer, CourseWithGradesSerializer
from teacher.models import Teachers

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['department_id', 'course_taken_year', 'course_taken_semester', 'course_category']
    search_fields = ['course_name', 'course_id']
    ordering_fields = ['course_name', 'course_credit']

class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class AssignInstructorView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def patch(self, request, pk):
        try:
            course = Course.objects.get(course_id=pk)
        except Course.DoesNotExist:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)
        
        teacher_id = request.data.get('teacher_id')
        
        if not teacher_id:
            return Response({'error': 'Teacher ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            teacher = Teachers.objects.get(teacher_id=teacher_id)
            course.instructor = teacher.teacher_id
            course.save()
            
            serializer = CourseSerializer(course)
            return Response(serializer.data)
            
        except Teachers.DoesNotExist:
            return Response({'error': 'Teacher not found'}, status=status.HTTP_404_NOT_FOUND)

class CourseWithGradesDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseWithGradesSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DepartmentCoursesListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        department_id = self.kwargs['department_id']
        return Course.objects.filter(department_id=department_id)