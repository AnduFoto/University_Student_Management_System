from .views import UserRegisterView
from .views import  ChangePasswordView
from django.urls import path, include
from django.urls import path
from .views import UsersAuthsLoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UsersListView
from .views import RetriveUpdateDeleteView
from .views import reset_user_password

from rest_framework.routers import DefaultRouter
from .views import RegisterViewSet
from . import views

router = DefaultRouter()
router.register(r'register', RegisterViewSet, basename='register')

urlpatterns = [
      path('', include(router.urls)),
    path('registering/', UserRegisterView.as_view(), name='user-register'),
    path('login/', UsersAuthsLoginView.as_view(), name='usersauths-login'),

    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('reset-password/<str:userId>/', reset_user_password, name='reset-password'),
   
     path('users/<str:username>/reset-password/', reset_user_password, name='reset-password'),


    path("users/", UsersListView.as_view(), name="users-list"),
    path("users/<str:pk>/", RetriveUpdateDeleteView.as_view(), name="users-detail"),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),



        path('users/<str:username>/reset-password/', views.reset_user_password, name='reset-password'),
   
    
]


# # user/urls.py
# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import UserViewSet, UserRegistrationViewSet

# router = DefaultRouter()
# router.register(r'users', UserViewSet)
# router.register(r'register', UserRegistrationViewSet, basename='register')

# urlpatterns = [
#     path('', include(router.urls)),
# ]