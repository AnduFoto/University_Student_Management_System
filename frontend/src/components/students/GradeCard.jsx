import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserIcon, 
  AcademicCapIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ArrowPathIcon,
  MoonIcon,
  SunIcon,
  ChartBarIcon,
  BookOpenIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [studentCourses, setStudentCourses] = useState([]); 
  const [courseDetails, setCourseDetails] = useState([]); 
  const [grades, setGrades] = useState([]);
  const [instructors, setInstructors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSemesters, setExpandedSemesters] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access');
  };

  // Create axios instance with auth headers
  const api = axios.create({
    baseURL: '/api/',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const safeApiCall = async (url, options = {}) => {
    try {
      const response = await api.get(url, options);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      console.error(`Error calling ${url}:`, err);
      throw err;
    }
  };

  const fetchInstructorDetails = async (instructorId) => {
    if (!instructorId) return null;
    try {
      console.log('Fetching instructor with ID:', instructorId);
      
      // Try multiple possible endpoints for fetching instructor data
      const endpoints = [
        `teachers/${instructorId}/`,
        `teachers/teachers/${instructorId}/`,
        `teacher/${instructorId}/`
      ];

      for (const endpoint of endpoints) {
        try {
          const response = await safeApiCall(endpoint);
          if (response) {
            console.log('Instructor found:', response);
            return response;
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed, trying next...`);
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching instructor details:', error);
      return null;
    }
  };

  const fetchAllCourses = async () => {
    try {
      // Fetch all courses to get instructor information
      const response = await safeApiCall('courses/courses/');
      return response || [];
    } catch (error) {
      console.error('Error fetching all courses:', error);
      return [];
    }
  };

  const fetchStudentData = async () => {
    try {
      setError('');
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const username = userData.username;
      if (!username) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      // Fetch student data
      const studentResponse = await safeApiCall(`students/${username}/`);
      setStudentData(studentResponse);

      // Fetch student's enrolled courses
      const coursesResponse = await safeApiCall(`students/${username}/courses/`);
      const studentCoursesData = coursesResponse?.courses || [];
      console.log('Student courses data:', studentCoursesData);
      setStudentCourses(studentCoursesData);

      // Fetch all courses to get instructor information
      const allCourses = await fetchAllCourses();
      console.log('All courses data:', allCourses);

      // Match student's courses with full course details
      const courseDetailsData = studentCoursesData.map(studentCourse => {
        const fullCourse = allCourses.find(course => course.course_id === studentCourse.course_id);
        return {
          ...studentCourse,
          ...fullCourse // This includes the instructor field from the Course model
        };
      });
      
      console.log('Course details with instructors:', courseDetailsData);
      setCourseDetails(courseDetailsData);

      // Fetch grades
      const gradesResponse = await safeApiCall(`students/${username}/grades/`);
      setGrades(gradesResponse?.grades || []);

      // Fetch instructor details for each course
      const instructorPromises = courseDetailsData.map(async (course) => {
        // Get instructor ID from the course details (from Course model)
        const instructorId = course.instructor;
        
        if (instructorId) {
          console.log(`Course ${course.course_id} has instructor:`, instructorId);
          const instructor = await fetchInstructorDetails(instructorId);
          return { courseId: course.course_id, instructor };
        } else {
          console.log(`Course ${course.course_id} has no instructor assigned`);
        }
        return { courseId: course.course_id, instructor: null };
      });

      const instructorResults = await Promise.all(instructorPromises);
      const instructorsMap = {};
      instructorResults.forEach(result => {
        instructorsMap[result.courseId] = result.instructor;
      });
      
      console.log('Instructors map:', instructorsMap);
      setInstructors(instructorsMap);

    } catch (err) {
      console.error('Error in fetchStudentData:', err);
      if (err.response?.status !== 404) {
        setError('Failed to fetch student data. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchStudentData(); 
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getCourseGrade = (courseId) => grades.find(grade => grade.course_id === courseId);

  const calculateGPA = () => {
    if (!grades.length) return '0.00';
    const totalPoints = grades.reduce((sum, grade) => sum + ((Number(grade.final) || 0) / 20), 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'text-gray-500';
    if (grade >= 90) return 'text-emerald-600';
    if (grade >= 80) return 'text-green-600';
    if (grade >= 70) return 'text-lime-600';
    if (grade >= 60) return 'text-yellow-600';
    if (grade >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getGradeBgColor = (grade) => {
    if (!grade) return 'bg-gray-100';
    if (grade >= 90) return 'bg-emerald-50';
    if (grade >= 80) return 'bg-green-50';
    if (grade >= 70) return 'bg-lime-50';
    if (grade >= 60) return 'bg-yellow-50';
    if (grade >= 50) return 'bg-amber-50';
    return 'bg-red-50';
  };

  const toggleSemester = (semester) => setExpandedSemesters(prev => ({ ...prev, [semester]: !prev[semester] }));

  const coursesBySemester = courseDetails.reduce((acc, course) => {
    const key = `${course.course_taken_year} - Semester ${course.course_taken_semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

  const getInstructorDisplayName = (instructor) => {
    if (!instructor) return 'Not Assigned';
    
    // Try multiple possible field combinations for instructor name
    if (instructor.user_first_name && instructor.user_father_name) {
      return `${instructor.user_first_name} ${instructor.user_father_name}`;
    }
    if (instructor.firstName && instructor.fatherName) {
      return `${instructor.firstName} ${instructor.fatherName}`;
    }
    if (instructor.username?.firstName && instructor.username?.fatherName) {
      return `${instructor.username.firstName} ${instructor.username.fatherName}`;
    }
    if (instructor.full_name) return instructor.full_name;
    if (instructor.name) return instructor.name;
    return instructor.teacher_id || 'Unknown Instructor';
  };

  const getInstructorPicture = (instructor) => {
    if (!instructor) return null;
    
    // Try multiple possible field combinations for instructor picture
    return instructor.picture || 
           instructor.user_picture || 
           instructor.username?.picture || 
            instructor.username.picture || 
           instructor.user_details?.picture;
  };

  const getInstructorAcademicLevel = (instructor) => {
    if (!instructor) return '';
    
    return instructor.academic_level || 
           instructor.academicLevel || 
           instructor.level || 
           '';
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading your academic data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-white flex justify-center items-center px-4">
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
        <h3 className="font-bold text-lg mb-2">Error</h3>
        <p>{error}</p>
        <button 
          onClick={fetchStudentData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!studentData) return (
    <div className="min-h-screen bg-white flex justify-center items-center">
      <div className="text-center">
        <AcademicCapIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-gray-500">No student data found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <UserIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Student Dashboard</h1>
                <p className="text-blue-100">View your academic information and course grades</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Current GPA</p>
                <h3 className="text-2xl font-bold text-gray-800">{calculateGPA()}/4.0</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Based on {grades.length} graded courses</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Courses Taken</p>
                <h3 className="text-2xl font-bold text-gray-800">{courseDetails.length}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BookOpenIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Across {Object.keys(coursesBySemester).length} semesters</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Current Status</p>
                <h3 className="text-2xl font-bold text-gray-800">Active</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <UserIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">Year {studentData.year}, Semester {studentData.semester}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <UserIcon className="h-5 w-5 mr-2 text-blue-600" /> Personal Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{studentData.user_details?.firstName} {studentData.user_details?.fatherName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium text-gray-800">{studentData.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{studentData.user_details?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-gray-800">{studentData.userId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-800">{studentData.user_details?.phoneNumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" /> Academic Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{studentData.department_details?.department_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Program</p>
                  <p className="font-medium text-gray-800">{studentData.course_category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Year</p>
                  <p className="font-medium text-gray-800">{studentData.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Semester</p>
                  <p className="font-medium text-gray-800">{studentData.semester}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Course History</h2>
                <button
                  onClick={fetchStudentData}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>

              {/* Semester-based Accordion */}
              <div className="space-y-4">
                {Object.entries(coursesBySemester).map(([semester, semesterCourses]) => (
                  <div key={semester} className="rounded-xl overflow-hidden border border-gray-200">
                    <button
                      onClick={() => toggleSemester(semester)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div>
                        <span className="font-semibold text-gray-800">{semester}</span>
                        <span className="ml-2 text-sm text-gray-500">({semesterCourses.length} courses)</span>
                      </div>
                      {expandedSemesters[semester] ? 
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" /> : 
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      }
                    </button>
                    {expandedSemesters[semester] && (
                      <div className="p-5 grid grid-cols-1 gap-4 bg-white">
                        {semesterCourses.map(course => {
                          const courseGrade = getCourseGrade(course.course_id);
                          const instructor = instructors[course.course_id];
                          
                          return (
                            <div key={course.course_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-blue-600 mb-1 text-lg">{course.course_name}</h3>
                                  <p className="text-sm text-gray-500 mb-2">ID: {course.course_id}</p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">Credits: {course.course_credit}</span>
                                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">{course.course_category}</span>
                                  </div>
                                </div>
                                {courseGrade && (
                                  <div className={`ml-3 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getGradeBgColor(courseGrade.final)}`}>
                                    <span className={`font-bold ${getGradeColor(courseGrade.final)}`}>
                                      {courseGrade.final}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Instructor Information */}
                              {instructor ? (
                                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      {getInstructorPicture(instructor) ? (
                                        <img
                                          src={getInstructorPicture(instructor)}
                                          alt={getInstructorDisplayName(instructor)}
                                          className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                          <UsersIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-800">
                                        {getInstructorDisplayName(instructor)}
                                      </p>
                                      <p className="text-xs text-gray-600">Instructor</p>
                                      <p className="text-xs text-gray-500">
                                        {getInstructorAcademicLevel(instructor)}
                                        {instructor.teacher_id && ` • ${instructor.teacher_id}`}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-600 italic">No instructor assigned to this course</p>
                                </div>
                              )}

                              {courseGrade && (
                                <div className="pt-3 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Grade: {courseGrade.final}%</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${courseGrade.final >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                      {courseGrade.final >= 50 ? 'Passed' : 'Failed'}
                                    </span>
                                  </div>
                                </div>
                              )}
                              
                              <p className="text-xs text-gray-500 mt-2">
                                Registered: {new Date(course.registered_at).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {courseDetails.length === 0 && (
                <div className="text-center py-10">
                  <AcademicCapIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No courses found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;