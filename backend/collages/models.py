from django.db import models

# Create your models here.

from django.db import models
from django.utils import timezone
import re
from django.core.exceptions import ValidationError
# Create your models here.


def validate_college_name(value):
    """Ensure name contains only letters and spaces"""
    if not re.match(r'^[A-Za-z\s]+$', value):
        raise ValidationError("College name must contain only letters and spaces.")

class Collages(models.Model):
    college_code = models.CharField(max_length=50, primary_key=True)  # Primary Key
    name = models.CharField(max_length=255, unique=True, validators=[validate_college_name])
    created_at = models.DateTimeField(auto_now_add=True)  # set once when created
    updated_at = models.DateTimeField(auto_now=True)      # auto-updates on save

    def __str__(self):
        return f"{self.name} ({self.college_code})"
    




    from django.db import models
from django.core.exceptions import ValidationError
import re
from collages.models import Collages  # make sure to import the correct model

# Optional: validator for department name
def validate_department_name(value):
    if not re.match(r'^[A-Za-z\s]+$', value):
        raise ValidationError("Department name must contain only letters and spaces.")

class Department(models.Model):
    department_code = models.CharField(max_length=20, primary_key=True)
    department_name = models.CharField(max_length=255, validators=[validate_department_name])
    college = models.ForeignKey(
        Collages, on_delete=models.CASCADE, related_name="departments"
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
   

    def __str__(self):
        return f"{self.department_name} ({self.department_code}) - {self.college.name}"
