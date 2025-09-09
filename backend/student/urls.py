
from django.urls import path
from .views import StudentListView, StudentCreateView, StudentDetailView,check_registration

from .views import (
    StudentListView,
    StudentCreateView,
    StudentDetailView,
    get_student_courses,
    get_student_grades,
)

urlpatterns = [
    path('', StudentListView.as_view(), name='student-list'),        # GET - List all students
    path('create/', StudentCreateView.as_view(), name='student-create'), # POST - Create new student
    path('<str:username>/', StudentDetailView.as_view(), name='student-detail'), # GET, PUT, DELETE - Single student
    path('<str:username>/courses/', get_student_courses, name='student-courses'),
    path('<str:username>/grades/', get_student_grades, name='student-grades'), 
    path('check-registration/', check_registration, name='check_registration'),
]



