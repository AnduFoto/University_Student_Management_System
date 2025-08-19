from .views import UserRegisterView
from .views import  ChangePasswordView
from django.urls import path, include
from django.urls import path
from .views import UsersAuthsLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsersListView
from .views import RetriveUpdateDeleteView


from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = [
      path('', include(router.urls)),
    path('register/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UsersAuthsLoginView.as_view(), name='usersauths-login'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),

    path("users/", UsersListView.as_view(), name="users-list"),
   
    path("users/<str:pk>/", RetriveUpdateDeleteView.as_view(), name="users-detail"),




    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    
]
