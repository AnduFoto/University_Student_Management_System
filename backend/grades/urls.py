# grades/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DynamicGradeViewSet, GradeFormTemplateViewSet,
    GradeComponentTemplateViewSet, get_course_students,
    upload_grades_from_excel, get_teacher_courses
)

router = DefaultRouter()
router.register(r'dynamic-grades', DynamicGradeViewSet)
router.register(r'grade-form-templates', GradeFormTemplateViewSet)
router.register(r'grade-components', GradeComponentTemplateViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('course/<str:course_id>/students/', get_course_students, name='course-students'),
    path('upload-grades/', upload_grades_from_excel, name='upload-grades'),
    path('teacher/<str:teacher_id>/courses/', get_teacher_courses, name='teacher-courses'),
]