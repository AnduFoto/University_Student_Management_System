
from django.urls import path
from . import views

urlpatterns = [
    # College endpoints
    path('colleges/', views.CollegeListCreateView.as_view(), name='college-list'),
    path('colleges/<str:pk>/', views.CollegeDetailView.as_view(), name='college-detail'),
    path('colleges/<str:college_id>/departments/', views.CollegeDepartmentsListView.as_view(), name='college-departments'),
    
    # Department endpoints
    path('departments/', views.DepartmentListCreateView.as_view(), name='department-list'),
    path('departments/<str:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    
]