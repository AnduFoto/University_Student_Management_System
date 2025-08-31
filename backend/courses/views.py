

# courses/views.py
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Course
from .serializers import CourseSerializer, CourseWithGradesSerializer
from collages.models import Department

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