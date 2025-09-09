
from django.urls import path
from . import views

urlpatterns = [
    path('courses/', views.CourseListCreateView.as_view(), name='course-list'),
    path('courses/<str:pk>/', views.CourseDetailView.as_view(), name='course-detail'),
    path('courses/<str:pk>/assign_instructor/', views.AssignInstructorView.as_view(), name='course-assign-instructor'),
    path('courses/<str:pk>/with-grades/', views.CourseWithGradesDetailView.as_view(), name='course-with-grades'),
    path('departments/<str:department_id>/courses/', views.DepartmentCoursesListView.as_view(), name='department-courses'),
]


