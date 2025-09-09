// components/TeacherCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherCoursesPage = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    semester: ''
  });

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access');
  };

  // Axios instance
  const api = axios.create({
    baseURL: '/api/',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    fetchAssignedCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [assignedCourses, filters]);

  const fetchAssignedCourses = async () => {
    try {
      setLoading(true);
      const user = getUserData();

      if (!user || !user.userId) {
        setError('User information not found. Please login again.');
        setLoading(false);
        return;
      }

      const response = await api.get('courses/courses/');
      const allCourses = response.data;

      const teacherCourses = allCourses.filter(
        course => course.instructor === user.userId
      );

      setAssignedCourses(teacherCourses);
    } catch (error) {
      console.error('Error fetching assigned courses:', error);
      setError('Failed to fetch assigned courses');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = assignedCourses;

    if (filters.year) {
      filtered = filtered.filter(course => course.course_taken_year === filters.year);
    }

    if (filters.semester) {
      filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
    }

    setFilteredCourses(filtered);
  };

  const getUserDisplayName = () => {
    const user = getUserData();
    if (!user) return 'Teacher';
    if (user.firstName && user.fatherName) {
      return `${user.firstName} ${user.fatherName}`;
    }
    return user.userId || 'Teacher';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Assigned Courses</h1>
              <p className="text-gray-600">Welcome, {getUserDisplayName()}</p>
              <p className="text-sm text-gray-500">User ID: {getUserData()?.userId}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-sm text-gray-500">Total Assigned Courses</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Years</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
                <option value="6th">6th Year</option>
                <option value="7th">7th Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={filters.semester}
                onChange={(e) => setFilters({...filters, semester: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">All Semesters</option>
                <option value="I">Semester I</option>
                <option value="II">Semester II</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchAssignedCourses}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 flex items-center justify-center text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <div key={course.course_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{course.course_name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">ID: {course.course_id}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto">
                      {course.course_credit} Credits
                    </span>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {course.course_taken_year} Year • Semester {course.course_taken_semester}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
                      </svg>
                      {course.department_name}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
                      </svg>
                      {course.college_name}
                    </div>

                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Category: {course.course_category}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-green-600">
                        Assigned to You
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
            </svg>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Courses Assigned</h3>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">
              You don't have any courses assigned to you yet. Please contact your department administrator.
            </p>
            <button
              onClick={fetchAssignedCourses}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
            >
              Check Again
            </button>
          </div>
        )}

        {/* Statistics */}
        {assignedCourses.length > 0 && (
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</div>
                <div className="text-xs sm:text-sm text-blue-800">Total Courses</div>
              </div>
              <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {assignedCourses.filter(course => course.course_taken_year === '1st').length}
                </div>
                <div className="text-xs sm:text-sm text-green-800">1st Year Courses</div>
              </div>
              <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                  {assignedCourses.filter(course => course.course_taken_semester === 'I').length}
                </div>
                <div className="text-xs sm:text-sm text-yellow-800">Semester I</div>
              </div>
              <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">
                  {assignedCourses.filter(course => course.course_taken_semester === 'II').length}
                </div>
                <div className="text-xs sm:text-sm text-purple-800">Semester II</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCoursesPage;
