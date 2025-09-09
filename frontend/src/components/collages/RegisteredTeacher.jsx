// components/CourseManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    semester: ''
  });
  const [teacherFilters, setTeacherFilters] = useState({
    college: '',
    search: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchAllTeachers();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, filters]);

  useEffect(() => {
    filterTeachers();
  }, [allTeachers, teacherFilters]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('courses/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get('collages/departments/');
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else if (response.data && Array.isArray(response.data.results)) {
        setDepartments(response.data.results);
      } else if (response.data && Array.isArray(response.data.departments)) {
        setDepartments(response.data.departments);
      } else {
        console.error('Unexpected departments response structure:', response.data);
        setDepartments([]);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      setError('Failed to fetch departments');
      setDepartments([]);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await api.get('teachers/teachers/');
      console.log('Teachers API response:', response.data);
      
      // Extract teachers from results array
      let teachersData = [];
      if (response.data && Array.isArray(response.data.results)) {
        teachersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        teachersData = response.data;
      }
      
      setAllTeachers(teachersData);
      setFilteredTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching all teachers:', error);
      setError('Failed to fetch teachers');
    }
  };

  const filterTeachers = () => {
    let filtered = allTeachers;
    
    // Filter by college
    if (teacherFilters.college) {
      filtered = filtered.filter(teacher => 
        teacher.college_name === teacherFilters.college
      );
    }
    
    // Filter by search term
    if (teacherFilters.search) {
      const searchTerm = teacherFilters.search.toLowerCase();
      filtered = filtered.filter(teacher => 
        getTeacherDisplayName(teacher).toLowerCase().includes(searchTerm) ||
        teacher.teacher_id.toLowerCase().includes(searchTerm) ||
        teacher.academic_level.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredTeachers(filtered);
  };

  const filterCourses = () => {
    let filtered = courses;
    
    if (filters.department) {
      filtered = filtered.filter(course => course.department_id === filters.department);
    }
    
    if (filters.year) {
      filtered = filtered.filter(course => course.course_taken_year === filters.year);
    }
    
    if (filters.semester) {
      filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
    }
    
    setFilteredCourses(filtered);
  };

  const handleAssignInstructor = async (course) => {
    setSelectedCourse(course);
    setSelectedTeacher('');
    setSuccessMessage('');
    setIsModalOpen(true);
    setTeacherFilters({ college: '', search: '' });
  };

  const handleAssignTeacher = async () => {
    if (!selectedTeacher) return;

    setLoading(true);
    try {
      await api.patch(`courses/courses/${selectedCourse.course_id}/assign_instructor/`, {
        teacher_id: selectedTeacher
      });
      
      setSuccessMessage(`Instructor assigned successfully to ${selectedCourse.course_name}!`);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMessage('');
        fetchCourses(); // Refresh the course list
      }, 2000);
    } catch (error) {
      console.error('Error assigning instructor:', error);
      setError('Failed to assign instructor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher('');
    setSuccessMessage('');
    setTeacherFilters({ college: '', search: '' });
  };

  // Helper function to get teacher display name
  const getTeacherDisplayName = (teacher) => {
    if (teacher.user_first_name && teacher.user_father_name) {
      return `${teacher.user_first_name} ${teacher.user_father_name}`;
    }
    if (teacher.username?.firstName && teacher.username?.fatherName) {
      return `${teacher.username.firstName} ${teacher.username.fatherName}`;
    }
    if (teacher.full_name) return teacher.full_name;
    return teacher.teacher_id || 'Unknown Teacher';
  };

  // Get unique colleges from teachers
  const getUniqueColleges = () => {
    const colleges = allTeachers.map(teacher => teacher.college_name).filter(Boolean);
    return [...new Set(colleges)];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Course Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Course Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {Array.isArray(departments) && departments.map(dept => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Semesters</option>
              <option value="I">Semester I</option>
              <option value="II">Semester II</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <tr key={course.course_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowra text-sm font-medium text-gray-900">{course.course_id}</td>
                <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_name}</td>
                <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_credit}</td>
                <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_taken_year}</td>
                <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_taken_semester}</td>
                <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.department_name}</td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.college_name}</td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.instructor || 'Not Assigned'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleAssignInstructor(course)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition duration-200 w-full"
                  >
                    Assign Instructor
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Assigning Instructor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Assign Instructor to {selectedCourse?.course_name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>

            {successMessage ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            ) : (
              <>
                {/* Teacher Filters */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Filter Teachers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
                      <select
                        value={teacherFilters.college}
                        onChange={(e) => setTeacherFilters({...teacherFilters, college: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Colleges</option>
                        {getUniqueColleges().map(college => (
                          <option key={college} value={college}>
                            {college}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                      <input
                        type="text"
                        placeholder="Search by name, ID, or academic level..."
                        value={teacherFilters.search}
                        onChange={(e) => setTeacherFilters({...teacherFilters, search: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Teachers List */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Available Teachers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {filteredTeachers.length > 0 ? (
                      filteredTeachers.map(teacher => (
                        <div
                          key={teacher.teacher_id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                            selectedTeacher === teacher.teacher_id
                              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedTeacher(teacher.teacher_id)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {teacher.username?.picture ? (
                                <img
                                  src={teacher.username.picture}
                                  alt={getTeacherDisplayName(teacher)}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {getTeacherDisplayName(teacher).charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {getTeacherDisplayName(teacher)}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                ID: {teacher.teacher_id}
                              </p>
                              <p className="text-sm text-gray-500">
                                {teacher.academic_level}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {teacher.college_name}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No teachers found matching your criteria
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignTeacher}
                    disabled={!selectedTeacher || loading}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                  >
                    {loading ? 'Assigning...' : 'Assign Instructor'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;