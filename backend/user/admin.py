from django.contrib import admin
# from .models import Users

# Register your models here.


# admin.site.register(Users)



# # user/admin.py

# from .models import UsersAuths

# @admin.register(UsersAuths)
# class UsersAuthsAdmin(admin.ModelAdmin):
#     list_display = ['username', 'firstName', 'fatherName', 'role', 'is_active', 'is_staff']
#     list_filter = ['role', 'is_active', 'gender', 'catagory']
#     search_fields = ['username', 'firstName', 'fatherName', 'userId', 'phoneNumber']
#     readonly_fields = ['userId', 'username', 'created_at', 'updated_at']
#     fieldsets = (
#         ('Personal Information', {
#             'fields': ('firstName', 'fatherName', 'grandFatherName', 'motherName', 'mothersFatherName')
#         }),
#         ('Contact Information', {
#             'fields': ('phoneNumber', 'region', 'zone_or_special_wereda', 'city_or_town', 'house_number')
#         }),
#         ('Academic Information', {
#             'fields': ('batch', 'entrance_exam', 'catagory', 'role')
#         }),
#         ('Personal Details', {
#             'fields': ('gender', 'nationality', 'dob', 'religion', 'handicap')
#         }),
#         ('Account Information', {
#             'fields': ('username', 'userId', 'password', 'is_active', 'is_staff', 'is_superuser')
#         }),
#         ('Timestamps', {
#             'fields': ('created_at', 'updated_at'),
#             'classes': ('collapse',)
#         }),
#     )
    
#     def save_model(self, request, obj, form, change):
#         # Hash password if it's being changed
#         if 'password' in form.changed_data:
#             from django.contrib.auth.hashers import make_password
#             obj.password = make_password(obj.password)
#         super().save_model(request, obj, form, change)