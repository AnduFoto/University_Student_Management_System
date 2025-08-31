from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import CourseViewSet
# # from .views import CollegeViewSet, DepartmentViewSet
# # from .views import CollegeList
# router = DefaultRouter()
# router.register(r"courses", CourseViewSet, basename="course")
# # router.register(r'colleges', CollegeViewSet)
# # router.register(r'departments', DepartmentViewSet)
from . import views

urlpatterns = [
    # path("", include(router.urls)),
    # # path('collages/', CollegeList.as_view(), name='college-list'),
]


# courses/urls.py
from django.urls import path
from . import views


urlpatterns = [
    path('courses/', views.CourseListCreateView.as_view(), name='course-list'),
    path('courses/<str:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/<str:pk>/with-grades/', views.CourseWithGradesDetailView.as_view(), name='course-with-grades'),
    path('departments/<str:department_id>/courses/', views.DepartmentCoursesListView.as_view(), name='department-courses'),

    #  path('student-courses/', views.StudentCourseListCreateView.as_view(), name='studentcourse-list'),
    # path('student-courses/<int:pk>/', views.StudentCourseDetailView.as_view(), name='studentcourse-detail'),
]


# from django.urls import path
# from . import views

# urlpatterns = [
#     # Course endpoints
#     path('courses/', views.CourseListCreateView.as_view(), name='course-list'),
#     path('courses/<str:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
#     path('courses/<str:pk>/with-grades/', views.CourseWithGradesDetailView.as_view(), name='course-with-grades'),
    
#     # Department courses endpoints
#     path('departments/<str:department_id>/courses/', views.DepartmentCoursesListView.as_view(), name='department-courses'),
    
#     # Additional course endpoints
#     path('courses/by-year/<str:year>/', views.CoursesByYearView.as_view(), name='courses-by-year'),
#     path('courses/by-semester/<str:semester>/', views.CoursesBySemesterView.as_view(), name='courses-by-semester'),
#     path('courses/by-category/<str:category>/', views.CoursesByCategoryView.as_view(), name='courses-by-category'),
# ]