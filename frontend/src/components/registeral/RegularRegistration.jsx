
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserIcon, 
  AcademicCapIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    username: '',
    department_id: '',
    batch: '',
    course_ids: [],
    year: '',
    semester: '',
    course_category: 'BSc'
  });
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableYearsSemesters, setAvailableYearsSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedYearSemester, setSelectedYearSemester] = useState({year: '', semester: ''});
  const [viewMode, setViewMode] = useState('department');
  const [selectedStudentForNewSemester, setSelectedStudentForNewSemester] = useState(null);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const BASE_URL = 'http://localhost:8000/api';

  // Get college name from department
  const getCollegeNameFromDepartment = (deptId) => {
    const dept = departments.find(d => d.department_id === deptId);
    if (!dept) return 'N/A';
    
    const college = colleges.find(c => c.college_id === dept.college_id);
    return college ? college.college_name : 'N/A';
  };

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept => 
    dept.department_name.toLowerCase().includes(departmentSearch.toLowerCase()) ||
    getCollegeNameFromDepartment(dept.department_id).toLowerCase().includes(departmentSearch.toLowerCase())
  );

  // Get unique batches from users
  const getAvailableBatches = () => {
    const batches = new Set();
    users.forEach(user => {
      if (user.batch) {
        batches.add(user.batch);
      }
    });
    return Array.from(batches).sort();
  };

  // Safe API call function with error handling
  const safeApiCall = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios({
        url,
        headers: { 
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn(`Endpoint not found: ${url}`);
        return [];
      }
      console.error(`Error calling ${url}:`, err);
      throw err;
    }
  };

  // Check if student is already registered for the same year and semester
  const checkExistingRegistration = async (username, year, semester) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `${BASE_URL}/students/check-existing/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            username,
            year,
            semester
          }
        }
      );
      
      return response.data.exists;
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn('Check existing endpoint not found, falling back to client-side check');
        
        const student = students.find(s => s.username === username);
        if (student && student.semesters) {
          const semesterKey = `${year} Year ${semester} Semester`;
          return !!student.semesters[semesterKey];
        }
        return false;
      }
      
      console.error('Error checking existing registration:', err);
      return false;
    }
  };

  // Fetch data with proper error handling
  const fetchData = async () => {
    try {
      setError('');
      setIsRefreshing(true);
      setIsLoading(true); // Set loading to true when fetching starts

      const [usersResponse, collegeResponse, deptResponse, coursesResponse, studentsResponse] = await Promise.all([
        safeApiCall(`${BASE_URL}/users/`),
        safeApiCall(`${BASE_URL}/collages/colleges/`),
        safeApiCall(`${BASE_URL}/collages/departments/`),
        safeApiCall(`${BASE_URL}/courses/courses/`),
        safeApiCall(`${BASE_URL}/students/`)
      ]);

      const userList = usersResponse.results || usersResponse;
      const studentUsers = userList.filter(user => user.role === 'student');
      setUsers(studentUsers);
      setFilteredUsers(studentUsers);

      setColleges(collegeResponse.results || collegeResponse || []);
      setDepartments(deptResponse.results || deptResponse || []);
      setCourses(coursesResponse.results || coursesResponse || []);
      setStudents(studentsResponse.results || studentsResponse || []);

    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch data. Please check your connection.');
      }
      console.error('Error in fetchData:', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
      setIsLoading(false); // Set loading to false when done
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update available batches when users change
  useEffect(() => {
    setAvailableBatches(getAvailableBatches());
  }, [users]);

  // Get available years and semesters for a department
  const getAvailableYearsSemesters = (deptId) => {
    const deptCourses = courses.filter(course => course.department_id === deptId);
    const uniqueCombinations = {};
    
    deptCourses.forEach(course => {
      const key = `${course.course_taken_year}-${course.course_taken_semester}`;
      if (!uniqueCombinations[key]) {
        uniqueCombinations[key] = {
          year: course.course_taken_year,
          semester: course.course_taken_semester
        };
      }
    });
    
    return Object.values(uniqueCombinations);
  };

  // Get next available semester for a student
  const getNextAvailableSemester = (student) => {
    if (!student.semesters || Object.keys(student.semesters).length === 0) {
      return availableYearsSemesters[0] || { year: '1st', semester: 'I' };
    }
    
    const registeredSemesters = Object.keys(student.semesters);
    
    for (const available of availableYearsSemesters) {
      const semesterKey = `${available.year} Year ${available.semester} Semester`;
      if (!registeredSemesters.includes(semesterKey)) {
        return available;
      }
    }
    
    return availableYearsSemesters[0] || { year: '1st', semester: 'I' };
  };

  // Filter courses when department, year, or semester is selected
  useEffect(() => {
    if (formData.department_id && formData.year && formData.semester) {
      const filtered = courses.filter(course => 
        course.department_id === formData.department_id &&
        course.course_taken_year === formData.year &&
        course.course_taken_semester === formData.semester
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.department_id, formData.year, formData.semester, courses]);

  // Filter users based on search
  useEffect(() => {
    if (userSearch.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.firstName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.fatherName?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.username?.toLowerCase().includes(userSearch.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [userSearch, users]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedCourses = checked
        ? [...formData.course_ids, value]
        : formData.course_ids.filter(id => id !== value);
      
      setFormData({
        ...formData,
        course_ids: updatedCourses
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleUserSelect = (username) => {
    setFormData({
      ...formData,
      username
    });
    setUserSearch('');
    setShowUserDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!formData.username || !formData.department_id || !formData.batch || formData.course_ids.length === 0 || !formData.year || !formData.semester) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const alreadyRegistered = await checkExistingRegistration(
        formData.username, 
        formData.year, 
        formData.semester
      );
      
      if (alreadyRegistered) {
        setError(`Student with username ${formData.username} is already registered for ${formData.year} Year, Semester ${formData.semester}`);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('access');
      
      const submissionData = {
        ...formData,
        course_ids: formData.course_ids
      };
      
      const response = await axios.post(
        `${BASE_URL}/students/create/`,
        submissionData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('Student registered successfully!');
      setFormData({
        username: '',
        department_id: '',
        batch: '',
        course_ids: [],
        year: '',
        semester: '',
        course_category: 'BSc'
      });
      
      fetchData();
      setViewMode('students');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        
        if (err.response.status === 400 && errorData.detail && errorData.detail.includes('already registered')) {
          setError(errorData.detail);
        } else if (typeof errorData === 'object') {
          if (errorData.detail) {
            setError(errorData.detail);
          } else if (errorData.message) {
            setError(errorData.message);
          } else if (errorData.course_ids) {
            setError(`Course error: ${JSON.stringify(errorData.course_ids)}`);
          } else {
            const errorMessages = Object.entries(errorData)
              .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
              .join('; ');
            setError(errorMessages || 'Failed to register student');
          }
        } else if (typeof errorData === 'string') {
          setError(errorData);
        } else {
          setError('Failed to register student');
        }
      } else {
        setError('Failed to register student. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get user details
  const getUserDetails = (username) => {
    return users.find(user => user.username === username);
  };

  // Get department name
  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.department_id === deptId);
    return dept ? dept.department_name : deptId;
  };

  // Remove selected course
  const removeCourse = (courseId) => {
    setFormData(prev => ({
      ...prev,
      course_ids: prev.course_ids.filter(id => id !== courseId)
    }));
  };

  // Get course details
  const getCourseDetails = (courseId) => {
    return courses.find(c => c.course_id.toString() === courseId.toString());
  };

  // Filter students by department, batch, year, and semester - FIXED VERSION
  const getFilteredStudents = () => {
    if (!selectedDepartment || !selectedBatch || !selectedYearSemester.year || !selectedYearSemester.semester) {
      return [];
    }
    
    const semesterKey = `${selectedYearSemester.year} Year ${selectedYearSemester.semester} Semester`;
    
    // Create a map to ensure each student appears only once
    const studentMap = new Map();
    
    students.forEach(student => {
      // Check if student belongs to the selected department
      if (student.department_id !== selectedDepartment) {
        return;
      }
      
      // Check if student belongs to the selected batch
      const user = getUserDetails(student.username);
      if (!user || user.batch !== selectedBatch) {
        return;
      }
      
      // Check if student has courses specifically in the selected year and semester
      if (student.semesters && student.semesters[semesterKey] && student.semesters[semesterKey].length > 0) {
        // Use username as key to ensure uniqueness
        studentMap.set(student.username, student);
      }
    });
    
    return Array.from(studentMap.values());
  };

  // Handle department selection
  const handleDepartmentSelect = (deptId) => {
    setSelectedDepartment(deptId);
    const yearsSemesters = getAvailableYearsSemesters(deptId);
    setAvailableYearsSemesters(yearsSemesters);
    setViewMode('batch');
  };

  // Handle batch selection
  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    setViewMode('yearSemester');
  };

  // Handle year/semester selection
  const handleYearSemesterSelect = (year, semester) => {
    setSelectedYearSemester({year, semester});
    setViewMode('students');
  };

  // Start registration for a new student
  const startRegistration = () => {
    setFormData(prev => ({
      ...prev,
      department_id: selectedDepartment,
      batch: selectedBatch,
      year: availableYearsSemesters[0]?.year || '1st',
      semester: availableYearsSemesters[0]?.semester || 'I',
      username: '',
      course_ids: []
    }));
    setSelectedStudentForNewSemester(null);
    setViewMode('registration');
  };

  // Start registration for a specific student for a new semester
  const startRegistrationForStudent = (student) => {
    const nextSemester = getNextAvailableSemester(student);
    
    setFormData(prev => ({
      ...prev,
      department_id: student.department_id,
      batch: getUserDetails(student.username)?.batch || '',
      year: nextSemester.year,
      semester: nextSemester.semester,
      username: student.username,
      course_ids: []
    }));
    
    setSelectedStudentForNewSemester(student);
    setViewMode('registration');
  };

  // Render department selection view
  const renderDepartmentSelection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-blue-100 rounded-full mr-4">
          <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Select Department</h2>
      </div>
      
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search departments by name or college..."
          value={departmentSearch}
          onChange={(e) => setDepartmentSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDepartments.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-gray-500">
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No departments found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          filteredDepartments.map((dept) => (
            <div 
              key={dept.department_id} 
              className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              onClick={() => handleDepartmentSelect(dept.department_id)}
            >
              <div className="font-semibold text-gray-900 text-lg mb-1">{dept.department_name}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <BuildingLibraryIcon className="h-4 w-4 mr-1" />
                {getCollegeNameFromDepartment(dept.department_id)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render batch selection view
  const renderBatchSelection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('department')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
        <div className="p-3 bg-blue-100 rounded-full mr-4">
          <UserGroupIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Select Batch for {getDepartmentName(selectedDepartment)}
        </h2>
      </div>
      
      {availableBatches.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No available batches</p>
          <p className="text-sm mt-1">No students found with batch information</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableBatches.map((batch) => (
            <div 
              key={batch} 
              className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              onClick={() => handleBatchSelect(batch)}
            >
              <div className="font-semibold text-gray-900 text-lg mb-1">Batch {batch}</div>
              <div className="text-sm text-gray-500">
                {users.filter(user => user.batch === batch).length} student(s)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render year/semester selection view
  const renderYearSemesterSelection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('batch')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
        <div className="p-3 bg-blue-100 rounded-full mr-4">
          <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Select Year and Semester for {getDepartmentName(selectedDepartment)} - Batch {selectedBatch}
        </h2>
      </div>
      
      {availableYearsSemesters.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No available years/semesters</p>
          <p className="text-sm mt-1">No courses found for this department</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableYearsSemesters.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              onClick={() => handleYearSemesterSelect(item.year, item.semester)}
            >
              <div className="font-semibold text-gray-900 text-lg mb-1">{item.year} Year</div>
              <div className="text-sm text-gray-500">Semester {item.semester}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Render students list view
  const renderStudentsView = () => {
    const filteredStudents = getFilteredStudents();
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setViewMode('yearSemester')}
            className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
          </button>
          <div className="p-3 bg-blue-100 rounded-full mr-4">
            <UserIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            Students in {getDepartmentName(selectedDepartment)} - Batch {selectedBatch} - {selectedYearSemester.year} Year, Semester {selectedYearSemester.semester}
          </h2>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600 bg-blue-50 px-4 py-2 rounded-lg">
            {filteredStudents.length} student(s) registered
          </div>
          <button
            onClick={startRegistration}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Register New Student
          </button>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No students registered</p>
            <p className="text-sm mt-1">Click "Register New Student" to add students</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => {
                  const user = getUserDetails(student.username);
                  const semesterKey = `${selectedYearSemester.year} Year ${selectedYearSemester.semester} Semester`;
                  const semesterCourses = student.semesters[semesterKey] || [];
                  
                  return (
                    <tr key={student.username} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user ? `${user.firstName} ${user.fatherName}` : student.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.username}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user?.batch || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {semesterCourses.length} course(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => startRegistrationForStudent(student)}
                          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" /> Register for New Semester
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  // Render registration form
  const renderRegistrationForm = () => {
    const isNewSemesterRegistration = !!selectedStudentForNewSemester;
    const studentName = isNewSemesterRegistration 
      ? `${getUserDetails(formData.username)?.firstName} ${getUserDetails(formData.username)?.fatherName}`
      : '';

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setViewMode('students')}
              className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
            </button>
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <DocumentCheckIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isNewSemesterRegistration ? 'Register for New Semester' : 'Register New Student'}
            </h2>
          </div>
          <button
            onClick={fetchData}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
            title="Refresh data"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="text-sm text-blue-800">
              <span className="font-medium">Department:</span> {getDepartmentName(selectedDepartment)}
            </div>
            <div className="text-sm text-blue-800">
              <span className="font-medium">Batch:</span> {selectedBatch}
            </div>
            <div className="text-sm text-blue-800">
              <span className="font-medium">Year/Semester:</span> {formData.year} Year, Semester {formData.semester}
            </div>
            {isNewSemesterRegistration && (
              <div className="text-sm text-blue-800">
                <span className="font-medium">Student:</span> {studentName} ({formData.username})
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Student Search and Selection - Only show for new student registration */}
            {!isNewSemesterRegistration && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Student *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or username..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                  {showUserDropdown && userSearch && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {filteredUsers
                        .filter(user => user.batch === selectedBatch)
                        .map((user) => (
                        <div
                          key={user.username}
                          onClick={() => handleUserSelect(user.username)}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{user.firstName} {user.fatherName}</div>
                          <div className="text-sm text-gray-500">{user.username} (Batch: {user.batch})</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {formData.username && (
                  <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-green-800">Selected: </span>
                        <span className="text-green-700">
                          {getUserDetails(formData.username)?.firstName} {getUserDetails(formData.username)?.fatherName}
                        </span>
                        <span className="text-green-700 ml-2">(Batch: {getUserDetails(formData.username)?.batch})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, username: '' }))}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Batch field (hidden for new semester registration as it's already set) */}
            {!isNewSemesterRegistration && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch *
                </label>
                <input
                  type="text"
                  name="batch"
                  value={selectedBatch}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 cursor-not-allowed"
                />
              </div>
            )}

            {/* Year and Semester Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Year</option>
                  {availableYearsSemesters
                    .filter((item, index, self) => 
                      index === self.findIndex(t => t.year === item.year)
                    )
                    .map((item) => (
                      <option key={item.year} value={item.year}>
                        {item.year} Year
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Semester</option>
                  {availableYearsSemesters
                    .filter(item => item.year === formData.year)
                    .map((item) => (
                      <option key={`${item.year}-${item.semester}`} value={item.semester}>
                        Semester {item.semester}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="course_category"
                value={formData.course_category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="BSc">BSc</option>
                <option value="MSc">MSc</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Course Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courses * (Select one or more)
              </label>
              <div className="mb-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                Showing courses for {formData.year} Year, Semester {formData.semester}
              </div>
              
              {filteredCourses.length === 0 ? (
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                  <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No courses available for {formData.year} Year, Semester {formData.semester}</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
                  {filteredCourses.map((course) => (
                    <label key={course.course_id} className="flex items-center p-3 hover:bg-white rounded-lg transition-colors mb-2 last:mb-0">
                      <input
                        type="checkbox"
                        name="course_ids"
                        value={course.course_id}
                        checked={formData.course_ids.includes(course.course_id.toString())}
                        onChange={handleChange}
                        className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{course.course_name}</div>
                        <div className="text-sm text-gray-500">
                          {course.course_credit} credits • ID: {course.course_id}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              
              {/* Selected Courses */}
              {formData.course_ids.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Courses:
                  </label>
                  <div className="space-y-2">
                    {formData.course_ids.map(courseId => {
                      const course = getCourseDetails(courseId);
                      return course ? (
                        <div key={courseId} className="flex items-center justify-between bg-blue-100 px-4 py-3 rounded-xl">
                          <div>
                            <span className="font-medium text-blue-800">{course.course_name}</span>
                            <span className="text-sm text-blue-600 ml-2">({course.course_credit} credits)</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCourse(courseId)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          
            <button
             
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-orange-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering...
                </span>
              ) : (
                isNewSemesterRegistration ? 'Register for New Semester' : 'Register Student'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Student Registration Portal
        </h1>
        <p className="text-gray-600">Easily register and manage student academic records</p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{message}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="CurrentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner - Option 3 */}
      {isLoading && (
        <div className="flex flex-col justify-center items-center h-96">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-t-transparent border-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading Departments</p>
        </div>
      )}

      {/* Main Content */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-8">
          {viewMode === 'department' && renderDepartmentSelection()}
          {viewMode === 'batch' && renderBatchSelection()}
          {viewMode === 'yearSemester' && renderYearSemesterSelection()}
          {viewMode === 'students' && renderStudentsView()}
          {viewMode === 'registration' && renderRegistrationForm()}
        </div>
      )}
    </div>
  );
};

export default StudentRegistration;