from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAdminOrDepartmentOrReadOnly(BasePermission):
    """
    - SAFE methods (GET, HEAD, OPTIONS) → allowed for everyone
    - Write methods → allowed for admin/staff OR users with role='department'
    """
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and (request.user.is_staff or request.user.role == 'department')
