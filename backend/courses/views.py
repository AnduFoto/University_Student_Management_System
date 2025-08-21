from django.shortcuts import render

# Create your views here.

from rest_framework import viewsets, filters
from .models import Course
from .serializers import CourseSerializer
from .permissions import IsAdminOrDepartmentOrReadOnly   

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("course_prerequisite").all()
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrDepartmentOrReadOnly]

    # enable search & ordering
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["course_code", "course_title", "course_department"]
    ordering_fields = ["course_code", "course_credit", "created_at"]
    ordering = ["course_code"]




# from rest_framework import viewsets
# from rest_framework.permissions import IsAdminUser
# from .models import College, Department
# from .serializers import CollegeSerializer, DepartmentSerializer

# class CollegeViewSet(viewsets.ModelViewSet):
#     queryset = College.objects.all()
#     serializer_class = CollegeSerializer
#     permission_classes = [IsAdminUser] 

# class DepartmentViewSet(viewsets.ModelViewSet):
#     queryset = Department.objects.all()
#     serializer_class = DepartmentSerializer
#     permission_classes = [IsAdminUser] 





# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status


# class CollegeList(APIView):
#     def get(self, request):
#         try:
#             colleges = College.objects.all()
#             serializer = CollegeSerializer(colleges, many=True)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except Exception as e:
#             # Log the error to console for debugging
#             print("Error fetching colleges:", e)
#             return Response({"error": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)