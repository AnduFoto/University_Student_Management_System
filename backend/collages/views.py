from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Collages, Department
from .serializers import CollagesSerializer, DepartmentSerializer

# Create your views here.


class CollagesViewSet(viewsets.ModelViewSet):
    queryset = Collages.objects.all()
    serializer_class = CollagesSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAdminUser]  # Only admin users can access

