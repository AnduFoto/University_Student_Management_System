import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseManagementDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSemesters, setAvailableSemesters] = useState([]);

  const API_BASE_URL = 'http://localhost:8000';

  const getAuthToken = () => {
    return localStorage.getItem('access');
  };

  const authAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${getAuthToken()}`
    }
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (courses.length > 0) {
      // Extract unique years and semesters from courses
      const years = [...new Set(courses.map(course => course.year))].sort();
      const semesters = [...new Set(courses.map(course => course.semester))].sort();
      
      setAvailableYears(['all', ...years]);
      setAvailableSemesters(['all', ...semesters]);
    }
  }, [courses]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch all data in parallel
      const [
        coursesResponse,
        departmentsResponse,
        collegesResponse
      ] = await Promise.all([
        authAxios.get(`${API_BASE_URL}/api/courses/courses/`),
        authAxios.get(`${API_BASE_URL}/api/collages/departments/`),
        authAxios.get(`${API_BASE_URL}/api/collages/colleges/`)
      ]);

      // Extract data from responses
      const extractData = (response, defaultKey) => {
        if (Array.isArray(response.data)) return response.data;
        if (response.data.results) return response.data.results;
        if (response.data[defaultKey]) return response.data[defaultKey];
        if (response.data.data) return response.data.data;
        return [];
      };

      let coursesData = extractData(coursesResponse, 'courses');
      const departmentsData = extractData(departmentsResponse, 'departments');
      const collegesData = extractData(collegesResponse, 'colleges');

      // Enhance courses with department and college information
      const enhancedCourses = coursesData.map(course => {
        // Get department info
        let department = null;
        let departmentId = course.department || course.department_id;
        
        if (departmentId) {
          if (typeof departmentId === 'object') {
            department = departmentId;
          } else {
            department = departmentsData.find(dept =>
              dept.id == departmentId || 
              dept.department_id == departmentId
            );
          }
        }

        // Get college info through department
        let college = null;
        if (department) {
          let collegeId = department.college || department.college_id;
          
          if (collegeId) {
            if (typeof collegeId === 'object') {
              college = collegeId;
            } else {
              college = collegesData.find(col =>
                col.id == collegeId || 
                col.college_id == collegeId
              );
            }
          }
        }

        return {
          ...course,
          department_name: department?.department_name || department?.name || 'Unknown Department',
          department_id: department?.id || department?.department_id,
          college_name: college?.college_name || college?.name || 'Unknown College',
          college_id: college?.id || college?.college_id,
          year: course.course_taken_year || course.year || 'N/A',
          semester: course.course_taken_semester || course.semester || 'N/A'
        };
      });

      setCourses(enhancedCourses);
      setDepartments(departmentsData);
      setColleges(collegesData);

    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else if (error.response?.status === 404) {
        setError('Some endpoints are not available. Please check your API configuration.');
      } else {
        setError(`Failed to load data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDepartmentExpansion = (departmentId) => {
    if (expandedDepartment === departmentId) {
      setExpandedDepartment(null);
    } else {
      setExpandedDepartment(departmentId);
    }
  };

  const filteredCourses = courses.filter(course => {
    const collegeMatch = !selectedCollege || 
                        course.college_id == selectedCollege;
    
    const departmentMatch = !selectedDepartment || 
                           course.department_id == selectedDepartment;
    
    const yearMatch = selectedYear === 'all' || 
                     course.year == selectedYear;
    
    const semesterMatch = selectedSemester === 'all' || 
                         course.semester == selectedSemester;
    
    return collegeMatch && departmentMatch && yearMatch && semesterMatch;
  });

  // Group courses by department
  const coursesByDepartment = filteredCourses.reduce((acc, course) => {
    const deptId = course.department_id || 'unknown';
    if (!acc[deptId]) {
      acc[deptId] = {
        department_name: course.department_name,
        college_name: course.college_name,
        courses: []
      };
    }
    acc[deptId].courses.push(course);
    return acc;
  }, {});

  // Further group courses by year and semester within each department
  Object.keys(coursesByDepartment).forEach(deptId => {
    const dept = coursesByDepartment[deptId];
    
    // Group by year
    dept.coursesByYear = dept.courses.reduce((acc, course) => {
      const year = course.year;
      if (!acc[year]) {
        acc[year] = {
          year: year,
          coursesBySemester: {}
        };
      }
      
      // Group by semester within year
      const semester = course.semester;
      if (!acc[year].coursesBySemester[semester]) {
        acc[year].coursesBySemester[semester] = {
          semester: semester,
          courses: []
        };
      }
      
      acc[year].coursesBySemester[semester].courses.push(course);
      return acc;
    }, {});
  });

  const refreshData = () => {
    setLoading(true);
    setError(null);
    fetchAllData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <span className="ml-3 text-gray-600 mt-3 block">Loading course data...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <p className="text-gray-600 mt-1">View all courses organized by department, year, and semester</p>
          </div>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Error/Warning Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 border-red-400 text-red-700 border">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span><strong>Error:</strong> {error}</span>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Courses</h2>
                <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Departments</h2>
                <p className="text-2xl font-semibold text-gray-900">{departments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Colleges</h2>
                <p className="text-2xl font-semibold text-gray-900">{colleges.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College
              </label>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Colleges</option>
                {colleges.map(college => (
                  <option key={college.id || college.college_id} value={college.id || college.college_id}>
                    {college.college_name || college.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id || dept.department_id} value={dept.id || dept.department_id}>
                    {dept.department_name || dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>
                    {year === 'all' ? 'All Years' : `Year ${year}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableSemesters.map(semester => (
                  <option key={semester} value={semester}>
                    {semester === 'all' ? 'All Semesters' : `Semester ${semester}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Courses by Department */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {Object.keys(coursesByDepartment).length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {Object.keys(coursesByDepartment).map(deptId => {
                const dept = coursesByDepartment[deptId];
                
                return (
                  <div key={deptId} className="transition-colors">
                    <div 
                      className="px-6 py-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                      onClick={() => toggleDepartmentExpansion(deptId)}
                    >
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{dept.department_name}</h3>
                        <p className="text-sm text-gray-500">{dept.college_name}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {dept.courses.length} courses
                        </span>
                        <svg 
                          className={`ml-4 h-5 w-5 text-gray-500 transform ${expandedDepartment === deptId ? 'rotate-180' : ''}`} 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    
                    {expandedDepartment === deptId && (
                      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        {Object.keys(dept.coursesByYear).length === 0 ? (
                          <p className="text-gray-500 text-sm">No courses available for this department.</p>
                        ) : (
                          <div className="space-y-6">
                            {Object.keys(dept.coursesByYear).sort().map(year => {
                              const yearData = dept.coursesByYear[year];
                              
                              return (
                                <div key={year} className="border-l-4 border-blue-500 pl-4">
                                  <h4 className="text-md font-semibold text-gray-800 mb-3">Year {year}</h4>
                                  
                                  {Object.keys(yearData.coursesBySemester).sort().map(semester => {
                                    const semesterData = yearData.coursesBySemester[semester];
                                    
                                    return (
                                      <div key={semester} className="mb-6 ml-4">
                                        <h5 className="text-sm font-medium text-gray-700 mb-3">Semester {semester}</h5>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                          {semesterData.courses.map(course => (
                                            <div key={course.id} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                              <h6 className="font-medium text-gray-900">{course.course_name || course.name}</h6>
                                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                <p>ID: {course.course_id || course.id}</p>
                                                <p>Credits: {course.course_credit || course.credits || 'N/A'}</p>
                                                <p>Category: {course.course_category || course.category || 'N/A'}</p>
                                              </div>
                                              {course.course_description && (
                                                <p className="mt-2 text-xs text-gray-500 line-clamp-2">{course.course_description}</p>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseManagementDashboard;