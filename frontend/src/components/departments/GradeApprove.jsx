
// components/GradeApproval.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GradeApproval = () => {
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState({});
  const [departments, setDepartments] = useState({});
  const [colleges, setColleges] = useState({});
  const [students, setStudents] = useState({});
  const [usersAuth, setUsersAuth] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGrades, setSelectedGrades] = useState(new Set());
  const [approving, setApproving] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState('');
  
  // Filter states
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [approvalFilter, setApprovalFilter] = useState('all'); // 'all', 'approved', 'pending'

  // Edit states
  const [editingGrade, setEditingGrade] = useState(null);
  const [editedComponents, setEditedComponents] = useState({});
  const [saving, setSaving] = useState(false);

  // Calculate final grade based on total_score only
  const calculateGradeFromTotalScore = (grade) => {
    if (!grade || !grade.total_score) return null;
    
    const totalScore = parseFloat(grade.total_score);
    
    if (totalScore >= 90) return 'A+';
    if (totalScore >= 85) return 'A';
    if (totalScore >= 80) return 'A-';
    if (totalScore >= 75) return 'B+';
    if (totalScore >= 70) return 'B';
    if (totalScore >= 65) return 'B-';
    if (totalScore >= 60) return 'C+';
    if (totalScore >= 50) return 'C';
    if (totalScore >= 45) return 'C-';
    if (totalScore >= 40) return 'D';
    return 'F';
  };

  // Helper function to get department info for a course
  const getDepartmentInfo = (course) => {
    if (!course || !course.department_id) return { department: null, college: null };
    
    const department = departments[course.department_id];
    const college = department ? colleges[department.college_id] : null;
    
    return { department, college };
  };

  // Fetch all grades and related data
  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching grades for approval...');
      const response = await axios.get('/api/grades/dynamic-grades/');
      const gradesData = response.data.results || [];
      console.log('Grades data:', gradesData);
      setGrades(gradesData);

      // Extract unique IDs for related data
      const courseIds = [...new Set(gradesData.map(grade => grade.course))];
      
      console.log('Course IDs:', courseIds);
      
      // Fetch all related data
      await Promise.all([
        fetchCourseDetails(courseIds),
        fetchAllStudentsAndUsers()
      ]);
      
    } catch (err) {
      console.error('Error fetching grades:', err);
      setError(`Failed to fetch grades: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all students and their UsersAuths data
  const fetchAllStudentsAndUsers = async () => {
    try {
      console.log('Fetching all students...');
      
      const studentsResponse = await axios.get('/api/students/');
      const allStudents = studentsResponse.data;
      console.log('All students:', allStudents);
      
      const studentDetails = {};
      const usernameIds = new Set();
      
      allStudents.forEach(student => {
        studentDetails[student.id] = student;
        studentDetails[student.username] = student;
        
        if (student.username) {
          usernameIds.add(student.username);
        }
      });
      
      setStudents(studentDetails);
      console.log('Student details stored:', studentDetails);
      
      if (usernameIds.size > 0) {
        await fetchUsersAuthDetails(Array.from(usernameIds));
      }
      
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  // Fetch UsersAuths details for batch and full name information
  const fetchUsersAuthDetails = async (usernames) => {
    try {
      const usersAuthDetails = {};
      
      console.log('Fetching UsersAuths for usernames:', usernames);
      
      const userPromises = usernames.map(async (username) => {
        if (username) {
          try {
            const response = await axios.get(`/api/users/users/${username}/`);
            usersAuthDetails[username] = response.data;
          } catch (err) {
            console.warn(`Could not fetch UsersAuths for ${username}:`, err);
            usersAuthDetails[username] = {
              username: username,
              firstName: 'Unknown',
              fatherName: '',
              batch: null,
              picture: null
            };
          }
        }
      });
      
      await Promise.all(userPromises);
      setUsersAuth(usersAuthDetails);
      
    } catch (err) {
      console.error('Error fetching UsersAuths details:', err);
    }
  };

  // Fetch course details
  const fetchCourseDetails = async (courseIds) => {
    try {
      const courseDetails = {};
      const departmentIds = new Set();
      
      for (const courseId of courseIds) {
        if (courseId) {
          try {
            const response = await axios.get(`/api/courses/courses/${courseId}/`);
            courseDetails[courseId] = response.data;
            
            if (response.data.department_id) {
              departmentIds.add(response.data.department_id);
            }
          } catch (err) {
            console.warn(`Could not fetch details for course ${courseId}:`, err);
            courseDetails[courseId] = {
              course_id: courseId,
              course_name: 'Unknown Course',
              course_credit: 0,
              department_id: null
            };
          }
        }
      }
      
      setCourses(courseDetails);
      
      if (departmentIds.size > 0) {
        await fetchDepartmentDetails(Array.from(departmentIds));
      }
      
    } catch (err) {
      console.error('Error fetching course details:', err);
    }
  };

  // Fetch department details
  const fetchDepartmentDetails = async (departmentIds) => {
    try {
      const departmentDetails = {};
      const collegeIds = new Set();
      
      for (const deptId of departmentIds) {
        if (deptId) {
          try {
            const response = await axios.get(`/api/collages/departments/${deptId}/`);
            departmentDetails[deptId] = response.data;
            
            if (response.data.college_id) {
              collegeIds.add(response.data.college_id);
            }
          } catch (err) {
            console.warn(`Could not fetch details for department ${deptId}:`, err);
            departmentDetails[deptId] = {
              department_id: deptId,
              department_name: 'Unknown Department',
              college_id: null
            };
          }
        }
      }
      
      setDepartments(departmentDetails);
      
      if (collegeIds.size > 0) {
        await fetchCollegeDetails(Array.from(collegeIds));
      }
      
    } catch (err) {
      console.error('Error fetching department details:', err);
    }
  };

  // Fetch college details
  const fetchCollegeDetails = async (collegeIds) => {
    try {
      const collegeDetails = {};
      
      for (const collegeId of collegeIds) {
        if (collegeId) {
          try {
            const response = await axios.get(`/api/collages/colleges/${collegeId}/`);
            collegeDetails[collegeId] = response.data;
          } catch (err) {
            console.warn(`Could not fetch details for college ${collegeId}:`, err);
            collegeDetails[collegeId] = {
              college_id: collegeId,
              college_name: 'Unknown College'
            };
          }
        }
      }
      
      setColleges(collegeDetails);
    } catch (err) {
      console.error('Error fetching college details:', err);
    }
  };

  // Fetch all data for dropdowns
  const fetchAllData = async () => {
    try {
      // Fetch all colleges
      const collegesResponse = await axios.get('/api/collages/colleges/');
      const allColleges = {};
      collegesResponse.data.forEach(college => {
        allColleges[college.college_id] = college;
      });
      setColleges(prev => ({ ...prev, ...allColleges }));

      // Fetch all departments
      const deptsResponse = await axios.get('/api/collages/departments/');
      const allDepartments = {};
      deptsResponse.data.forEach(dept => {
        allDepartments[dept.department_id] = dept;
      });
      setDepartments(prev => ({ ...prev, ...allDepartments }));

      // Fetch all courses
      const coursesResponse = await axios.get('/api/courses/courses/');
      const allCourses = {};
      coursesResponse.data.forEach(course => {
        allCourses[course.course_id] = course;
      });
      setCourses(prev => ({ ...prev, ...allCourses }));

    } catch (err) {
      console.error('Error fetching all data:', err);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchAllData();
  }, []);

  // Filter handlers
  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
    setSelectedDepartment('');
    setSelectedCourse('');
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setSelectedCourse('');
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
  };

  const handleApprovalFilterChange = (e) => {
    setApprovalFilter(e.target.value);
  };

  // Get student info by following the relationship chain
  const getStudentInfo = (grade) => {
    let student = students[grade.student];
    
    if (!student && grade.student_name) {
      student = students[grade.student_name];
    }
    
    if (student && student.username) {
      const userAuth = usersAuth[student.username];
      
      if (userAuth) {
        return {
          fullName: `${userAuth.firstName} ${userAuth.fatherName}`.trim(),
          batch: userAuth.batch,
          studentId: student.id || grade.student,
          username: student.username,
          picture: userAuth.picture,
          userData: userAuth
        };
      }
    }
    
    return {
      fullName: grade.student_name || `Student ${grade.student}`,
      batch: null,
      studentId: grade.student,
      username: null,
      picture: null,
      userData: null
    };
  };

  // Get profile picture URL
  const getProfilePicture = (pictureUrl) => {
    if (!pictureUrl) return null;
    
    if (pictureUrl.startsWith('http')) {
      return pictureUrl;
    }
    
    return `http://localhost:8000${pictureUrl}`;
  };

  // Get available batches from UsersAuths
  const availableBatches = [...new Set(
    Object.values(usersAuth)
      .map(user => user.batch)
      .filter(batch => batch !== null && batch !== undefined && batch !== '')
  )].sort();

  // Get departments for selected college
  const departmentsForCollege = selectedCollege 
    ? Object.values(departments).filter(dept => dept.college_id === selectedCollege)
    : Object.values(departments);

  // Get courses for selected department
  const coursesForDepartment = selectedDepartment
    ? Object.values(courses).filter(course => course.department_id === selectedDepartment)
    : Object.values(courses);

  // Filter grades based on all selected filters
  const filteredGrades = grades.filter(grade => {
    const course = courses[grade.course];
    if (!course) return false;

    const { department } = getDepartmentInfo(course);
    const { batch } = getStudentInfo(grade);

    // College filter
    if (selectedCollege && department?.college_id !== selectedCollege) return false;
    
    // Department filter
    if (selectedDepartment && course.department_id !== selectedDepartment) return false;
    
    // Course filter
    if (selectedCourse && grade.course !== selectedCourse) return false;
    
    // Batch filter
    if (selectedBatch && batch !== selectedBatch) return false;

    // Approval status filter
    if (approvalFilter === 'approved' && !grade.is_approved) return false;
    if (approvalFilter === 'pending' && grade.is_approved) return false;

    return true;
  });

  // Clear all filters
  const clearFilters = () => {
    setSelectedCollege('');
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedBatch('');
    setApprovalFilter('all');
    setSelectedGrades(new Set());
  };

  // Select/deselect individual grade
  const toggleGradeSelection = (gradeId) => {
    const newSelected = new Set(selectedGrades);
    if (newSelected.has(gradeId)) {
      newSelected.delete(gradeId);
    } else {
      newSelected.add(gradeId);
    }
    setSelectedGrades(newSelected);
  };

  // Select all grades in current view
  const selectAllGrades = () => {
    const allGradeIds = new Set(filteredGrades.map(grade => grade.id));
    setSelectedGrades(allGradeIds);
  };

  // Deselect all grades
  const deselectAllGrades = () => {
    setSelectedGrades(new Set());
  };

  // Approve selected grades
  const approveSelectedGrades = async () => {
    if (selectedGrades.size === 0) {
      setApprovalStatus('Please select at least one grade to approve.');
      return;
    }

    try {
      setApproving(true);
      setApprovalStatus('');

      const gradeIds = Array.from(selectedGrades);
      
      // Update each grade individually
      const updatePromises = gradeIds.map(gradeId => 
        axios.patch(`/api/grades/dynamic-grades/${gradeId}/`, {
          is_approved: true
        })
      );

      await Promise.all(updatePromises);
      
      // Update local state
      const updatedGrades = grades.map(grade => 
        selectedGrades.has(grade.id) ? { ...grade, is_approved: true } : grade
      );
      
      setGrades(updatedGrades);
      setSelectedGrades(new Set());
      setApprovalStatus(`Successfully approved ${gradeIds.length} grade(s)!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setApprovalStatus(''), 3000);
      
    } catch (err) {
      console.error('Error approving grades:', err);
      setApprovalStatus(`Failed to approve grades: ${err.response?.data?.message || err.message}`);
    } finally {
      setApproving(false);
    }
  };

  // Show grade details
  const showGradeDetails = (grade) => {
    setSelectedGrade(grade);
    setEditingGrade(null);
    setEditedComponents({});
  };

  // Close grade details modal
  const closeGradeDetails = () => {
    setSelectedGrade(null);
    setEditingGrade(null);
    setEditedComponents({});
  };

  // Start editing grade components
  const startEditing = (grade) => {
    setEditingGrade(grade.id);
    // Initialize edited components with current values
    const initialEdited = {};
    Object.entries(grade.grade_components || {}).forEach(([name, component]) => {
      initialEdited[name] = { ...component };
    });
    setEditedComponents(initialEdited);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingGrade(null);
    setEditedComponents({});
  };

  // Update component score
  const updateComponentScore = (componentName, field, value) => {
    setEditedComponents(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        [field]: field === 'score' || field === 'max_score' || field === 'weight' 
          ? parseFloat(value) || 0 
          : value
      }
    }));
  };

  // Add new component
  const addNewComponent = () => {
    const newComponentName = prompt('Enter name for new component:');
    if (newComponentName && newComponentName.trim()) {
      setEditedComponents(prev => ({
        ...prev,
        [newComponentName.trim()]: {
          score: 0,
          max_score: 100,
          weight: 1.0
        }
      }));
    }
  };

  // Remove component
  const removeComponent = (componentName) => {
    if (window.confirm(`Are you sure you want to remove "${componentName}"?`)) {
      setEditedComponents(prev => {
        const newComponents = { ...prev };
        delete newComponents[componentName];
        return newComponents;
      });
    }
  };

  // Calculate total score from components
  const calculateTotalScore = (components) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    Object.values(components).forEach(component => {
      const score = parseFloat(component.score) || 0;
      const maxScore = parseFloat(component.max_score) || 100;
      const weight = parseFloat(component.weight) || 1.0;

      if (maxScore > 0) {
        const normalizedScore = (score / maxScore) * 100;
        totalWeightedScore += normalizedScore * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? (totalWeightedScore / totalWeight).toFixed(2) : 0;
  };

  // Save edited grade
  const saveEditedGrade = async () => {
    if (!selectedGrade) return;

    try {
      setSaving(true);
      
      // Calculate new total score
      const newTotalScore = calculateTotalScore(editedComponents);
      
      const updateData = {
        grade_components: editedComponents,
        total_score: newTotalScore
      };

      await axios.patch(`/api/grades/dynamic-grades/${selectedGrade.id}/`, updateData);
      
      // Update local state
      const updatedGrades = grades.map(grade => 
        grade.id === selectedGrade.id 
          ? { 
              ...grade, 
              grade_components: editedComponents,
              total_score: newTotalScore
            } 
          : grade
      );
      
      setGrades(updatedGrades);
      setSelectedGrade(prev => prev ? { 
        ...prev, 
        grade_components: editedComponents,
        total_score: newTotalScore
      } : null);
      
      setEditingGrade(null);
      setEditedComponents({});
      
      setApprovalStatus('Grade updated successfully!');
      setTimeout(() => setApprovalStatus(''), 3000);
      
    } catch (err) {
      console.error('Error updating grade:', err);
      setApprovalStatus(`Failed to update grade: ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading grades for approval...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <strong>Error: </strong> {error}
        <button 
          onClick={fetchGrades}
          className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px- py-">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Grade Approval & Management</h1>
          <p className="text-gray-600 mt-2">Department Head - Review, approve, and edit student grades</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={clearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear Filters
          </button>
          <button 
            onClick={fetchGrades}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Approval Actions */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Approval Actions</h3>
            <p className="text-sm text-gray-600">
              {selectedGrades.size} grade(s) selected for approval
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={selectAllGrades}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              disabled={filteredGrades.length === 0}
            >
              Select All ({filteredGrades.length})
            </button>
            <button
              onClick={deselectAllGrades}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              disabled={selectedGrades.size === 0}
            >
              Deselect All
            </button>
            <button
              onClick={approveSelectedGrades}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold"
              disabled={selectedGrades.size === 0 || approving}
            >
              {approving ? 'Approving...' : `Approve Selected (${selectedGrades.size})`}
            </button>
          </div>
        </div>
        {/* Approval Status Message */}
        {approvalStatus && (
          <div className={`mt-3 p-3 rounded ${
            approvalStatus.includes('Successfully') || approvalStatus.includes('updated successfully')
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {approvalStatus}
          </div>
        )}
      </div>
      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* College Filter */}
          <div>
            <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700 mb-1">
              College:
            </label>
            <select
              id="college-filter"
              value={selectedCollege}
              onChange={handleCollegeChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Colleges</option>
              {Object.values(colleges).map(college => (
                <option key={college.college_id} value={college.college_id}>
                  {college.college_name}
                </option>
              ))}
            </select>
          </div>
          {/* Department Filter */}
          <div>
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Department:
            </label>
            <select
              id="department-filter"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedCollege && departmentsForCollege.length === 0}
            >
              <option value="">All Departments</option>
              {departmentsForCollege.map(dept => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
          {/* Course Filter */}
          <div>
            <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Course:
            </label>
            <select
              id="course-filter"
              value={selectedCourse}
              onChange={handleCourseChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedDepartment && coursesForDepartment.length === 0}
            >
              <option value="">All Courses</option>
              {coursesForDepartment.map(course => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
          {/* Batch Filter */}
          <div>
            <label htmlFor="batch-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Batch:
            </label>
            <select
              id="batch-filter"
              value={selectedBatch}
              onChange={handleBatchChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Batches</option>
              {availableBatches.map(batch => (
                <option key={batch} value={batch}>
                  {batch}
                </option>
              ))}
            </select>
          </div>
          {/* Approval Status Filter */}
          <div>
            <label htmlFor="approval-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Approval Status:
            </label>
            <select
              id="approval-filter"
              value={approvalFilter}
              onChange={handleApprovalFilterChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
        {/* Active Filters Summary */}
        {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch || approvalFilter !== 'all') && (
          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <div className="text-sm text-blue-800">
              <strong>Active Filters:</strong>{' '}
              {selectedCollege && `College: ${colleges[selectedCollege]?.college_name}`}
              {selectedDepartment && `, Department: ${departments[selectedDepartment]?.department_name}`}
              {selectedCourse && `, Course: ${courses[selectedCourse]?.course_name}`}
              {selectedBatch && `, Batch: ${selectedBatch}`}
              {approvalFilter !== 'all' && `, Status: ${approvalFilter === 'pending' ? 'Pending' : 'Approved'}`}
            </div>
          </div>
        )}
      </div>
      {/* Grades Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Grades</div>
          <div className="text-2xl font-bold text-gray-800">{filteredGrades.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Pending Approval</div>
          <div className="text-2xl font-bold text-orange-600">
            {filteredGrades.filter(g => !g.is_approved).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-600">
            {filteredGrades.filter(g => g.is_approved).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Selected</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedGrades.size}
          </div>
        </div>
      </div>
      {/* Grades Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredGrades.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department & College
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGrades.map((grade) => {
                const course = courses[grade.course] || {};
                const { department, college } = getDepartmentInfo(course);
                const { fullName, batch, studentId, username, picture } = getStudentInfo(grade);
                const profilePictureUrl = getProfilePicture(picture);
                const calculatedGrade = calculateGradeFromTotalScore(grade);
                const isSelected = selectedGrades.has(grade.id);
                return (
                  <tr key={grade.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                    {/* Selection Checkbox */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGradeSelection(grade.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    {/* Student Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {profilePictureUrl ? (
                          <img 
                            src={profilePictureUrl} 
                            alt={fullName}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                            <span className="text-gray-600 text-sm font-medium">
                              {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {studentId}
                            {username && ` (${username})`}
                          </div>
                          {batch && (
                            <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block mt-1">
                              Batch: {batch}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Course Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {course.course_name || grade.course_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {grade.course} • {course.course_credit || 0} credits
                      </div>
                    </td> 
                    {/* Department Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {department?.department_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {college?.college_name || 'N/A'}
                      </div>
                    </td>
                    {/* Total Score & Grade Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-semibold text-gray-900">
                        {grade.total_score}
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                        calculatedGrade === 'A+' ? 'bg-gradient-to-r   text-gray-900' :
                        calculatedGrade === 'A' ? 'bg-gradient-to-r  text-gray-900' :
                        calculatedGrade === 'A-' ? 'bg-gradient-to-r  text-gray-900' :
                        calculatedGrade === 'B+' ? 'bg-gradient-to- text-gray-900' :
                        calculatedGrade === 'B' ? 'bg-gradient-to-r  text-gray-900' :
                        calculatedGrade === 'B-' ? 'bg-gradient-to-r from-blue-300 to-blue-500 text-gray-900' :
                        calculatedGrade === 'C+' ? 'bg-gradient-to-r fr text-gray-900' :
                        calculatedGrade === 'C' ? 'bg-gradient-to-r f text-gray-900' :
                        calculatedGrade === 'C-' ? 'bg-gradient-to-r fr text-gray-900' :
                        calculatedGrade === 'D' ? 'bg-gradient-to-r text-gray-900' :
                        calculatedGrade === 'F' ? 'bg-gradient-to text-gray-900' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {calculatedGrade || 'No Grade'}
                      </span>
                    </td>
                    {/* Approval Status Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        grade.is_approved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {grade.is_approved ? 'Approved' : 'Pending '}
                      </span>
                    </td>
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => showGradeDetails(grade)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
            <p className="text-gray-500 mb-4">
              {selectedCollege || selectedDepartment || selectedCourse || selectedBatch || approvalFilter !== 'all'
                ? 'No grades match the current filters.' 
                : 'There are no grade records to display.'
              }
            </p>
            {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch || approvalFilter !== 'all') && (
              <button 
                onClick={clearFilters}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
      {/* Grade Details Modal */}
      {selectedGrade && (
        <GradeDetailsModal 
          grade={selectedGrade} 
          onClose={closeGradeDetails}
          courses={courses}
          getStudentInfo={getStudentInfo}
          getDepartmentInfo={getDepartmentInfo}
          getProfilePicture={getProfilePicture}
          calculateGradeFromTotalScore={calculateGradeFromTotalScore}
          editingGrade={editingGrade}
          editedComponents={editedComponents}
          updateComponentScore={updateComponentScore}
          addNewComponent={addNewComponent}
          removeComponent={removeComponent}
          startEditing={startEditing}
          cancelEditing={cancelEditing}
          saveEditedGrade={saveEditedGrade}
          saving={saving}
          calculateTotalScore={calculateTotalScore}
        />
      )}
    </div>
  );
};
// Grade Details Modal Component with Edit Functionality
const GradeDetailsModal = ({ 
  grade, 
  onClose, 
  courses, 
  getStudentInfo, 
  getDepartmentInfo, 
  getProfilePicture, 
  calculateGradeFromTotalScore,
  editingGrade,
  editedComponents,
  updateComponentScore,
  addNewComponent,
  removeComponent,
  startEditing,
  cancelEditing,
  saveEditedGrade,
  saving,
  calculateTotalScore
}) => {
  const course = courses[grade.course] || {};
  const { fullName, batch, studentId, username, picture, userData } = getStudentInfo(grade);
  const { department, college } = getDepartmentInfo(course);
  const profilePictureUrl = getProfilePicture(picture);
  const calculatedGrade = calculateGradeFromTotalScore(grade);
  const isEditing = editingGrade === grade.id;
  const displayComponents = isEditing ? editedComponents : (grade.grade_components || {});
  const displayTotalScore = isEditing ? calculateTotalScore(editedComponents) : grade.total_score;
  const displayCalculatedGrade = isEditing ? calculateGradeFromTotalScore({ total_score: displayTotalScore }) : calculatedGrade;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Grade Details {isEditing && '(Editing)'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Edit Actions */}
          {!isEditing && !grade.is_approved && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="flex justify-between items-center">
                <span className="text-yellow-700">You can edit this grade since it's not approved yet.</span>
                <button
                  onClick={() => startEditing(grade)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Edit Grade
                </button>
              </div>
            </div>
          )}
          {isEditing && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">You are currently editing this grade. Changes will be saved when you click "Save Changes".</span>
                <div className="space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEditedGrade}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Student Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Student Information</h3>
              <div className="flex items-center mb-3">
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt={fullName}
                    className="h-16 w-16 rounded-full object-cover mr-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    <span className="text-gray-600 font-medium">
                      {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-gray-900">{fullName}</div>
                  <div className="text-sm text-gray-500">ID: {studentId}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Username:</strong> {username || 'N/A'}</p>
                <p><strong>Batch:</strong> {batch || 'N/A'}</p>
                {userData && (
                  <>
                    <p><strong>Gender:</strong> {userData.gender || 'N/A'}</p>
                    <p><strong>Phone:</strong> {userData.phoneNumber || 'N/A'}</p>
                  </>
                )}
              </div>
            </div>
            {/* Course Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Course Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Course:</strong> {course.course_name || 'N/A'}</p>
                <p><strong>Course ID:</strong> {grade.course}</p>
                <p><strong>Credits:</strong> {course.course_credit || 0}</p>
                <p><strong>Year:</strong> {course.course_taken_year || 'N/A'}</p>
                <p><strong>Semester:</strong> {course.course_taken_semester || 'N/A'}</p>
                <p><strong>Category:</strong> {course.course_category || 'N/A'}</p>
              </div>
            </div>
            {/* Institution & Grade Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Institution & Grade</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Department:</strong> {department?.department_name || 'N/A'}</p>
                <p><strong>College:</strong> {college?.college_name || 'N/A'}</p>
                <p><strong>Total Score:</strong> {displayTotalScore}</p>
                <p><strong>Calculated Grade:</strong> 
                  <span className={`ml-2 inline-flex px-3 py-1 text-sm font-bold rounded-full ${
                    displayCalculatedGrade === 'A+' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    displayCalculatedGrade === 'A' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
                    displayCalculatedGrade === 'A-' ? 'bg-gradient-to-r from-green-300 to-green-500 text-white' :
                    displayCalculatedGrade === 'B+' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
                    displayCalculatedGrade === 'B' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
                    displayCalculatedGrade === 'B-' ? 'bg-gradient-to-r from-blue-300 to-blue-500 text-white' :
                    displayCalculatedGrade === 'C+' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
                    displayCalculatedGrade === 'C' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
                    displayCalculatedGrade === 'C-' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white' :
                    displayCalculatedGrade === 'D' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' :
                    displayCalculatedGrade === 'F' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {displayCalculatedGrade || 'No Grade'}
                  </span>
                </p>
                <p><strong>Approval Status:</strong> 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    grade.is_approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {grade.is_approved ? 'Approved' : 'Pending Approval'}
                  </span>
                </p>
                <p><strong>Active Status:</strong> 
                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    grade.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {grade.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* Grade Components Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-700">Grade Components</h3>
              {isEditing && (
                <button
                  onClick={addNewComponent}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  + Add Component
                </button>
              )}
            </div>
            {Object.entries(displayComponents).length > 0 ? (
              <div className="bg-gray-50 p-4 rounded">
                {Object.entries(displayComponents).map(([name, component]) => (
                  <div key={name} className="flex justify-between items-center py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium capitalize text-gray-800 mb-2">
                        {name}
                        {isEditing && (
                          <button
                            onClick={() => removeComponent(name)}
                            className="ml-2 text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Score Field */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Score</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={component.score || ''}
                              onChange={(e) => updateComponentScore(name, 'score', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                              step="0.1"
                            />
                          ) : (
                            <span className="text-sm font-medium">{component.score}</span>
                          )}
                        </div>
                        
                        {/* Max Score Field */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Max Score</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={component.max_score || ''}
                              onChange={(e) => updateComponentScore(name, 'max_score', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                              step="0.1"
                            />
                          ) : (
                            <span className="text-sm font-medium">{component.max_score}</span>
                          )}
                        </div>
                        {/* Weight Field */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Weight</label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={component.weight || ''}
                              onChange={(e) => updateComponentScore(name, 'weight', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              min="0"
                              step="0.01"
                            />
                          ) : (
                            <span className="text-sm font-medium">{component.weight}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No grade components available</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedGrade}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeApproval;