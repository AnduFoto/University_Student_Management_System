
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'teachers', views.TeachersViewSet, basename='teachers')
router.register(r'teacher-courses', views.TeachersCourseViewSet, basename='teacher-courses')

urlpatterns = [
    path('', include(router.urls)),
    
    # Additional custom endpoints
    path('teachers/<str:teacher_id>/courses/', 
         views.TeachersViewSet.as_view({'get': 'courses'}), 
         name='teacher-courses-list'),
    
    path('teacher-courses/by-teacher/', 
         views.TeachersCourseViewSet.as_view({'get': 'by_teacher'}), 
         name='courses-by-teacher'),
    
    path('teacher-courses/by-course/', 
         views.TeachersCourseViewSet.as_view({'get': 'by_course'}), 
         name='teachers-by-course'),
]

