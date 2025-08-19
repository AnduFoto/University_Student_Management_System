from django.contrib.auth.backends import BaseBackend
from user.models import UsersAuth

class UsersAuthBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        try:
            user = UsersAuth.objects.get(username=username)
        except UsersAuth.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        return None

    def get_user(self, user_id):
        try:
            return UsersAuth.objects.get(pk=user_id)
        except UsersAuth.DoesNotExist:
            return None
        
