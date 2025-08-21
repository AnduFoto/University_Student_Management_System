from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourseViewSet
# from .views import CollegeViewSet, DepartmentViewSet
# from .views import CollegeList
router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
# router.register(r'colleges', CollegeViewSet)
# router.register(r'departments', DepartmentViewSet)


urlpatterns = [
    path("", include(router.urls)),
    # path('collages/', CollegeList.as_view(), name='college-list'),
]
