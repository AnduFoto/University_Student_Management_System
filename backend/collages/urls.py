from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CollagesViewSet, DepartmentViewSet

router = DefaultRouter()
router.register(r'collages', CollagesViewSet, basename='collages')
router.register(r'departments', DepartmentViewSet, basename='departments')

urlpatterns = [
    path('', include(router.urls)),
]
