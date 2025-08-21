from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import UpdateAPIView
from .serializers import ChangePasswordSerializer
from django.contrib.auth.hashers import check_password
from user.models import UsersAuths
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UsersAuthsSerializer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser


# # Create your views here.

#############################User Registration################################################
class UserRegisterView(APIView):
    def post(self, request):
        data = request.data.copy() 
    
        if not data.get('password'):
            data['password'] = "Default@123"
        else:
            data['password'] = make_password(data['password'])

        serializer = UsersAuthsSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response_data = serializer.data
            response_data.pop('password', None) 
            return Response(
                {
                    "message": "User registered successfully",
                    "data": response_data
                
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



DEFAULT_PASSWORD = "Default@123"

class UsersAuthsLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = UsersAuths.objects.get(username=username)
        except UsersAuths.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not check_password(password, user.password):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(user)
        role = getattr(user, 'role', None)  

        # serialize user data
        from .serializers import UsersAuthsSerializer
        serializer = UsersAuthsSerializer(user)

        if check_password(DEFAULT_PASSWORD, user.password):
            return Response({
                "detail": "You must change your default password before proceeding.",
                "change_password_required": True,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": role,
                "user": serializer.data,   
            }, status=status.HTTP_403_FORBIDDEN)

        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "role": role,
            "user": serializer.data, 
        })

#############################change password################################################
class ChangePasswordView(UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully"}, status=status.HTTP_200_OK)
    
    ######################################Display all view###############################


class UsersListView(generics.ListAPIView):
    queryset = UsersAuths.objects.all()
    serializer_class = UsersAuthsSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(userId__icontains=search) |
                Q(firstName__icontains=search) |
                Q(phoneNumber__icontains=search)
            )
        return queryset


class RetriveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset=UsersAuths.objects.all()
    serializer_class=UsersAuthsSerializer
    lookup_field='pk'
 

class RegisterViewSet(viewsets.ModelViewSet):
    queryset = UsersAuths.objects.all()
    serializer_class = UsersAuthsSerializer
    lookup_field = 'username'
    parser_classes = (MultiPartParser, FormParser)


