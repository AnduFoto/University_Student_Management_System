
from rest_framework import serializers
from .models import Student, StudentCourse, Grade
from user.serializers import UsersAuthsSerializer
from collages.serializers import DepartmentSerializer
from courses.serializers import CourseSerializer
from courses.models import Course


class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='username.firstName', read_only=True)
    course_name = serializers.CharField(source='course_id.course_name', read_only=True)

    class Meta:
        model = Grade
        fields = [
            'grade_id', 'username', 'student_name', 'course_id', 'course_name',
            'quiz', 'mid', 'assignment', 'final', 'participation'
        ]


class StudentSerializer(serializers.ModelSerializer):
    course_ids = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=True
    )
    courses = CourseSerializer(many=True, read_only=True)  # show enrolled courses

    class Meta:
        model = Student
        fields = [
            'username', 'department_id', 'course_ids', 'courses',
            'year', 'semester', 'course_category'
        ]

    def create(self, validated_data):
        course_ids = validated_data.pop('course_ids', [])
        student = Student.objects.create(**validated_data)

        # link student to courses
        for course_id in course_ids:
            try:
                course = Course.objects.get(course_id=course_id)
                StudentCourse.objects.create(student=student, course=course)
            except Course.DoesNotExist:
                raise serializers.ValidationError(f"Course with ID {course_id} does not exist.")
        return student
        def get_user_details(self, obj):
         return {
            "first_name": obj.first_name,
            "father_name": obj.father_name,
            "phone_number": obj.phone_number,
            "email": obj.email,
        }

    def update(self, instance, validated_data):
        course_ids = validated_data.pop('course_ids', None)

        # update student fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update courses if provided
        if course_ids is not None:
            instance.courses.clear()
            for course_id in course_ids:
                try:
                    course = Course.objects.get(course_id=course_id)
                    StudentCourse.objects.create(student=instance, course=course)
                except Course.DoesNotExist:
                    raise serializers.ValidationError(f"Course with ID {course_id} does not exist.")
        return instance


# class StudentDetailSerializer(serializers.ModelSerializer):
#     user_details = UsersAuthsSerializer(source='username', read_only=True)
#     department_details = DepartmentSerializer(source='department_id', read_only=True)
#     course_details = CourseSerializer(many=True, source='courses', read_only=True)
#     grade_details = serializers.SerializerMethodField()

#     class Meta:
#         model = Student
#         fields = [
#             'username', 'user_details', 'department_id', 'department_details',
#             'course_details', 'grade_details', 'year', 'semester', 'course_category'
#         ]

#     def get_grade_details(self, obj):
#         grades = Grade.objects.filter(username=obj.username)
#         return GradeSerializer(grades, many=True).data

class StudentDetailSerializer(serializers.ModelSerializer):
    user_details = UsersAuthsSerializer(source='username', read_only=True)
    department_details = DepartmentSerializer(source='department_id', read_only=True)
    semesters = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'username',
            'user_details',
            'department_id',
            'department_details',
            'semesters',
        ]

    def get_semesters(self, obj):
        """Group all courses across multiple semesters for the same username"""
        semester_data = {}

        # Get ALL student records with the same username
        all_students = Student.objects.filter(username=obj.username)

        for student in all_students:
            student_courses = student.studentcourse_set.select_related("course").all()

            for sc in student_courses:
                year = student.year
                semester = student.semester

                sem_label = f"{year} Year {semester} Semester"
                if sem_label not in semester_data:
                    semester_data[sem_label] = []

                # Attach grade if exists
                grade = Grade.objects.filter(username=student.username, course_id=sc.course).first()
                grade_data = None
                if grade:
                    grade_data = {
                        "quiz": grade.quiz,
                        "mid": grade.mid,
                        "assignment": grade.assignment,
                        "final": grade.final,
                        "participation": grade.participation,
                    }

                semester_data[sem_label].append({
                    "course_id": sc.course.course_id,
                    "course_name": sc.course.course_name,
                    "course_credit": sc.course.course_credit,
                    "grade": grade_data
                })

        return semester_data
