
// // components/GradesDisplay.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const GradesDisplay = () => {
//   const [grades, setGrades] = useState([]);
//   const [courses, setCourses] = useState({});
//   const [departments, setDepartments] = useState({});
//   const [colleges, setColleges] = useState({});
//   const [students, setStudents] = useState({}); // Store student details
//   const [usersAuth, setUsersAuth] = useState({}); // Store UsersAuths details
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filter states
//   const [selectedCollege, setSelectedCollege] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [selectedCourse, setSelectedCourse] = useState('');
//   const [selectedBatch, setSelectedBatch] = useState('');
//   const [selectedGrade, setSelectedGrade] = useState(null);

//   // Calculate final grade based on total_score only
//   const calculateGradeFromTotalScore = (grade) => {
//     if (!grade || !grade.total_score) return null;
    
//     const totalScore = parseFloat(grade.total_score);
    
//     // Define your grading scale based on total_score only
//     if (totalScore >= 90) return 'A+';
//     if (totalScore >= 85) return 'A';
//     if (totalScore >= 80) return 'A-';
//     if (totalScore >= 75) return 'B+';
//     if (totalScore >= 70) return 'B';
//     if (totalScore >= 65) return 'B-';
//     if (totalScore >= 60) return 'C+';
//     if (totalScore >= 50) return 'C';
//     if (totalScore >= 45) return 'C-';
//     if (totalScore >= 40) return 'D';
//     return 'F';
//   };

//   // Helper function to get department info for a course
//   const getDepartmentInfo = (course) => {
//     if (!course || !course.department_id) return { department: null, college: null };
    
//     const department = departments[course.department_id];
//     const college = department ? colleges[department.college_id] : null;
    
//     return { department, college };
//   };

//   // Fetch all grades and related data
//   const fetchGrades = async () => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       console.log('Fetching grades...');
//       const response = await axios.get('/api/grades/dynamic-grades/');
//       const gradesData = response.data.results || [];
//       console.log('Grades data:', gradesData);
//       setGrades(gradesData);

//       // Extract unique IDs for related data
//       const courseIds = [...new Set(gradesData.map(grade => grade.course))];
      
//       console.log('Course IDs:', courseIds);
      
//       // Fetch all related data
//       await Promise.all([
//         fetchCourseDetails(courseIds),
//         fetchAllStudentsAndUsers() // Fetch all students and users at once
//       ]);
      
//     } catch (err) {
//       console.error('Error fetching grades:', err);
//       setError(`Failed to fetch grades: ${err.response?.data?.message || err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all students and their UsersAuths data
//   const fetchAllStudentsAndUsers = async () => {
//     try {
//       console.log('Fetching all students...');
      
//       // Fetch all students
//       const studentsResponse = await axios.get('/api/students/');
//       const allStudents = studentsResponse.data;
//       console.log('All students:', allStudents);
      
//       const studentDetails = {};
//       const usernameIds = new Set();
      
//       // Organize students by ID and collect usernames
//       allStudents.forEach(student => {
//         studentDetails[student.id] = student;
//         studentDetails[student.username] = student; // Also index by username
        
//         if (student.username) {
//           usernameIds.add(student.username);
//         }
//       });
      
//       setStudents(studentDetails);
//       console.log('Student details stored:', studentDetails);
//       console.log('Usernames to fetch:', Array.from(usernameIds));
      
//       // Fetch UsersAuths for all collected usernames
//       if (usernameIds.size > 0) {
//         await fetchUsersAuthDetails(Array.from(usernameIds));
//       }
      
//     } catch (err) {
//       console.error('Error fetching students:', err);
//     }
//   };

//   // Fetch UsersAuths details for batch and full name information
//   const fetchUsersAuthDetails = async (usernames) => {
//     try {
//       const usersAuthDetails = {};
      
//       console.log('Fetching UsersAuths for usernames:', usernames);
      
//       // Fetch UsersAuths in parallel
//       const userPromises = usernames.map(async (username) => {
//         if (username) {
//           try {
//             const response = await axios.get(`/api/users/users/${username}/`);
//             usersAuthDetails[username] = response.data;
//             console.log(`UsersAuth for ${username}:`, response.data);
//           } catch (err) {
//             console.warn(`Could not fetch UsersAuths for ${username}:`, err);
//             usersAuthDetails[username] = {
//               username: username,
//               firstName: 'Unknown',
//               fatherName: '',
//               batch: null,
//               picture: null
//             };
//           }
//         }
//       });
      
//       await Promise.all(userPromises);
//       setUsersAuth(usersAuthDetails);
//       console.log('UsersAuth details stored:', usersAuthDetails);
      
//     } catch (err) {
//       console.error('Error fetching UsersAuths details:', err);
//     }
//   };

//   // Fetch course details
//   const fetchCourseDetails = async (courseIds) => {
//     try {
//       const courseDetails = {};
//       const departmentIds = new Set();
      
//       for (const courseId of courseIds) {
//         if (courseId) {
//           try {
//             const response = await axios.get(`/api/courses/courses/${courseId}/`);
//             courseDetails[courseId] = response.data;
            
//             if (response.data.department_id) {
//               departmentIds.add(response.data.department_id);
//             }
//           } catch (err) {
//             console.warn(`Could not fetch details for course ${courseId}:`, err);
//             courseDetails[courseId] = {
//               course_id: courseId,
//               course_name: 'Unknown Course',
//               course_credit: 0,
//               department_id: null
//             };
//           }
//         }
//       }
      
//       setCourses(courseDetails);
      
//       if (departmentIds.size > 0) {
//         await fetchDepartmentDetails(Array.from(departmentIds));
//       }
      
//     } catch (err) {
//       console.error('Error fetching course details:', err);
//     }
//   };

//   // Fetch department details
//   const fetchDepartmentDetails = async (departmentIds) => {
//     try {
//       const departmentDetails = {};
//       const collegeIds = new Set();
      
//       for (const deptId of departmentIds) {
//         if (deptId) {
//           try {
//             const response = await axios.get(`/api/collages/departments/${deptId}/`);
//             departmentDetails[deptId] = response.data;
            
//             if (response.data.college_id) {
//               collegeIds.add(response.data.college_id);
//             }
//           } catch (err) {
//             console.warn(`Could not fetch details for department ${deptId}:`, err);
//             departmentDetails[deptId] = {
//               department_id: deptId,
//               department_name: 'Unknown Department',
//               college_id: null
//             };
//           }
//         }
//       }
      
//       setDepartments(departmentDetails);
      
//       if (collegeIds.size > 0) {
//         await fetchCollegeDetails(Array.from(collegeIds));
//       }
      
//     } catch (err) {
//       console.error('Error fetching department details:', err);
//     }
//   };

//   // Fetch college details
//   const fetchCollegeDetails = async (collegeIds) => {
//     try {
//       const collegeDetails = {};
      
//       for (const collegeId of collegeIds) {
//         if (collegeId) {
//           try {
//             const response = await axios.get(`/api/collages/colleges/${collegeId}/`);
//             collegeDetails[collegeId] = response.data;
//           } catch (err) {
//             console.warn(`Could not fetch details for college ${collegeId}:`, err);
//             collegeDetails[collegeId] = {
//               college_id: collegeId,
//               college_name: 'Unknown College'
//             };
//           }
//         }
//       }
      
//       setColleges(collegeDetails);
//     } catch (err) {
//       console.error('Error fetching college details:', err);
//     }
//   };

//   // Fetch all data for dropdowns
//   const fetchAllData = async () => {
//     try {
//       // Fetch all colleges
//       const collegesResponse = await axios.get('/api/collages/colleges/');
//       const allColleges = {};
//       collegesResponse.data.forEach(college => {
//         allColleges[college.college_id] = college;
//       });
//       setColleges(prev => ({ ...prev, ...allColleges }));

//       // Fetch all departments
//       const deptsResponse = await axios.get('/api/collages/departments/');
//       const allDepartments = {};
//       deptsResponse.data.forEach(dept => {
//         allDepartments[dept.department_id] = dept;
//       });
//       setDepartments(prev => ({ ...prev, ...allDepartments }));

//       // Fetch all courses
//       const coursesResponse = await axios.get('/api/courses/courses/');
//       const allCourses = {};
//       coursesResponse.data.forEach(course => {
//         allCourses[course.course_id] = course;
//       });
//       setCourses(prev => ({ ...prev, ...allCourses }));

//     } catch (err) {
//       console.error('Error fetching all data:', err);
//     }
//   };

//   useEffect(() => {
//     fetchGrades();
//     fetchAllData();
//   }, []);

//   // Filter handlers
//   const handleCollegeChange = (e) => {
//     setSelectedCollege(e.target.value);
//     setSelectedDepartment('');
//     setSelectedCourse('');
//   };

//   const handleDepartmentChange = (e) => {
//     setSelectedDepartment(e.target.value);
//     setSelectedCourse('');
//   };

//   const handleCourseChange = (e) => {
//     setSelectedCourse(e.target.value);
//   };

//   const handleBatchChange = (e) => {
//     setSelectedBatch(e.target.value);
//   };

//   // Get student info by following the relationship chain
//   const getStudentInfo = (grade) => {
//     console.log('Getting student info for grade student ID:', grade.student);
//     console.log('Available students:', students);
    
//     // Try to find student by the grade's student ID (numeric ID)
//     let student = students[grade.student];
    
//     // If not found by numeric ID, try to find by username (student_name might be username)
//     if (!student && grade.student_name) {
//       student = students[grade.student_name];
//     }
    
//     console.log('Found student:', student);
    
//     if (student && student.username) {
//       const userAuth = usersAuth[student.username];
//       console.log('Found userAuth:', userAuth);
      
//       if (userAuth) {
//         return {
//           fullName: `${userAuth.firstName} ${userAuth.fatherName}`.trim(),
//           batch: userAuth.batch,
//           studentId: student.id || grade.student,
//           username: student.username,
//           picture: userAuth.picture,
//           userData: userAuth
//         };
//       }
//     }
    
//     // Fallback: use the student_name from grade data if available
//     return {
//       fullName: grade.student_name || `Student ${grade.student}`,
//       batch: null,
//       studentId: grade.student,
//       username: null,
//       picture: null,
//       userData: null
//     };
//   };

//   // Get profile picture URL
//   const getProfilePicture = (pictureUrl) => {
//     if (!pictureUrl) return null;
    
//     // If it's already a full URL, return it
//     if (pictureUrl.startsWith('http')) {
//       return pictureUrl;
//     }
    
//     // Otherwise, construct the full URL (adjust base URL as needed)
//     return `http://localhost:8000${pictureUrl}`;
//   };

//   // Get available batches from UsersAuths
//   const availableBatches = [...new Set(
//     Object.values(usersAuth)
//       .map(user => user.batch)
//       .filter(batch => batch !== null && batch !== undefined && batch !== '')
//   )].sort();

//   // Get departments for selected college
//   const departmentsForCollege = selectedCollege 
//     ? Object.values(departments).filter(dept => dept.college_id === selectedCollege)
//     : Object.values(departments);

//   // Get courses for selected department
//   const coursesForDepartment = selectedDepartment
//     ? Object.values(courses).filter(course => course.department_id === selectedDepartment)
//     : Object.values(courses);

//   // Filter grades based on all selected filters
//   const filteredGrades = grades.filter(grade => {
//     const course = courses[grade.course];
//     if (!course) return false;

//     const { department } = getDepartmentInfo(course);
//     const { batch } = getStudentInfo(grade);

//     // College filter
//     if (selectedCollege && department?.college_id !== selectedCollege) return false;
    
//     // Department filter
//     if (selectedDepartment && course.department_id !== selectedDepartment) return false;
    
//     // Course filter
//     if (selectedCourse && grade.course !== selectedCourse) return false;
    
//     // Batch filter
//     if (selectedBatch && batch !== selectedBatch) return false;

//     return true;
//   });

//   // Clear all filters
//   const clearFilters = () => {
//     setSelectedCollege('');
//     setSelectedDepartment('');
//     setSelectedCourse('');
//     setSelectedBatch('');
//   };

//   // Export to CSV
//   const exportToCSV = () => {
//     const headers = ['Student Name', 'Student ID', 'Username', 'Batch', 'Course', 'Department', 'College', 'Total Score', 'Final Grade'];
    
//     const csvData = filteredGrades.map(grade => {
//       const course = courses[grade.course] || {};
//       const { department, college } = getDepartmentInfo(course);
//       const { fullName, batch, studentId, username } = getStudentInfo(grade);
//       const calculatedGrade = calculateGradeFromTotalScore(grade);
      
//       return [
//         fullName,
//         studentId,
//         username || 'N/A',
//         batch || 'N/A',
//         course.course_name || 'N/A',
//         department?.department_name || 'N/A',
//         college?.college_name || 'N/A',
//         grade.total_score,
//         calculatedGrade || 'N/A'
//       ];
//     });

//     const csvContent = [
//       headers.join(','),
//       ...csvData.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `grades-export-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // Export to PDF (simple version)
//   const exportToPDF = () => {
//     const printWindow = window.open('', '_blank');
//     const printContent = `
//       <html>
//         <head>
//           <title>Grades Report</title>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f5f5f5; }
//             .header { text-align: center; margin-bottom: 20px; }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>Student Grades Report</h1>
//             <p>Generated on: ${new Date().toLocaleDateString()}</p>
//           </div>
//           <table>
//             <thead>
//               <tr>
//                 <th>Student Name</th>
//                 <th>Student ID</th>
//                 <th>Batch</th>
//                 <th>Course</th>
//                 <th>Department</th>
//                 <th>College</th>
//                 <th>Total Score</th>
//                 <th>Final Grade</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${filteredGrades.map(grade => {
//                 const course = courses[grade.course] || {};
//                 const { department, college } = getDepartmentInfo(course);
//                 const { fullName, batch, studentId } = getStudentInfo(grade);
//                 const calculatedGrade = calculateGradeFromTotalScore(grade);
                
//                 return `
//                   <tr>
//                     <td>${fullName}</td>
//                     <td>${studentId}</td>
//                     <td>${batch || 'N/A'}</td>
//                     <td>${course.course_name || 'N/A'}</td>
//                     <td>${department?.department_name || 'N/A'}</td>
//                     <td>${college?.college_name || 'N/A'}</td>
//                     <td>${grade.total_score}</td>
//                     <td>${calculatedGrade || 'N/A'}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;
    
//     printWindow.document.write(printContent);
//     printWindow.document.close();
//     printWindow.print();
//   };

//   // Show grade details
//   const showGradeDetails = (grade) => {
//     setSelectedGrade(grade);
//   };

//   // Close grade details modal
//   const closeGradeDetails = () => {
//     setSelectedGrade(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <span className="ml-3 text-gray-600">Loading grades...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//         <strong>Error: </strong> {error}
//         <button 
//           onClick={fetchGrades}
//           className="ml-4 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Student Grades</h1>
//         <div className="flex space-x-2">
//           <button 
//             onClick={exportToCSV}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Export CSV
//           </button>
//           <button 
//             onClick={exportToPDF}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Export PDF
//           </button>
//           <button 
//             onClick={clearFilters}
//             className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//           >
//             Clear Filters
//           </button>
//           <button 
//             onClick={fetchGrades}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Filters Section */}
//       <div className="mb-6 bg-white p-4 rounded-lg shadow">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {/* College Filter */}
//           <div>
//             <label htmlFor="college-filter" className="block text-sm font-medium text-gray-700 mb-1">
//               College:
//             </label>
//             <select
//               id="college-filter"
//               value={selectedCollege}
//               onChange={handleCollegeChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Colleges</option>
//               {Object.values(colleges).map(college => (
//                 <option key={college.college_id} value={college.college_id}>
//                   {college.college_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Department Filter */}
//           <div>
//             <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">
//               Department:
//             </label>
//             <select
//               id="department-filter"
//               value={selectedDepartment}
//               onChange={handleDepartmentChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               disabled={!selectedCollege && departmentsForCollege.length === 0}
//             >
//               <option value="">All Departments</option>
//               {departmentsForCollege.map(dept => (
//                 <option key={dept.department_id} value={dept.department_id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Course Filter */}
//           <div>
//             <label htmlFor="course-filter" className="block text-sm font-medium text-gray-700 mb-1">
//               Course:
//             </label>
//             <select
//               id="course-filter"
//               value={selectedCourse}
//               onChange={handleCourseChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               disabled={!selectedDepartment && coursesForDepartment.length === 0}
//             >
//               <option value="">All Courses</option>
//               {coursesForDepartment.map(course => (
//                 <option key={course.course_id} value={course.course_id}>
//                   {course.course_name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Batch Filter */}
//           <div>
//             <label htmlFor="batch-filter" className="block text-sm font-medium text-gray-700 mb-1">
//               Batch:
//             </label>
//             <select
//               id="batch-filter"
//               value={selectedBatch}
//               onChange={handleBatchChange}
//               className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="">All Batches</option>
//               {availableBatches.map(batch => (
//                 <option key={batch} value={batch}>
//                   {batch}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Active Filters Summary */}
//         {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch) && (
//           <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
//             <div className="text-sm text-blue-800">
//               <strong>Active Filters:</strong>{' '}
//               {selectedCollege && `College: ${colleges[selectedCollege]?.college_name}`}
//               {selectedDepartment && `, Department: ${departments[selectedDepartment]?.department_name}`}
//               {selectedCourse && `, Course: ${courses[selectedCourse]?.course_name}`}
//               {selectedBatch && `, Batch: ${selectedBatch}`}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Grades Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Total Grades</div>
//           <div className="text-2xl font-bold text-gray-800">{filteredGrades.length}</div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Active Grades</div>
//           <div className="text-2xl font-bold text-green-600">
//             {filteredGrades.filter(g => g.is_active).length}
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Passing Grades</div>
//           <div className="text-2xl font-bold text-blue-600">
//             {filteredGrades.filter(g => {
//               const calculatedGrade = calculateGradeFromTotalScore(g);
//               return calculatedGrade && ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'].includes(calculatedGrade);
//             }).length}
//           </div>
//         </div>
//         <div className="bg-white p-4 rounded-lg shadow">
//           <div className="text-sm text-gray-500">Average Score</div>
//           <div className="text-2xl font-bold text-purple-600">
//             {filteredGrades.length > 0 
//               ? (filteredGrades.reduce((sum, g) => sum + parseFloat(g.total_score || 0), 0) / filteredGrades.length).toFixed(1)
//               : 0}
//           </div>
//         </div>
//       </div>

//       {/* Grades Table */}
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         {filteredGrades.length > 0 ? (
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Course Details
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Department & College
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Total Score
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Final Grade
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredGrades.map((grade) => {
//                 const course = courses[grade.course] || {};
//                 const { department, college } = getDepartmentInfo(course);
//                 const { fullName, batch, studentId, username, picture } = getStudentInfo(grade);
//                 const profilePictureUrl = getProfilePicture(picture);
//                 const calculatedGrade = calculateGradeFromTotalScore(grade);
                
//                 return (
//                   <tr key={grade.id} className="hover:bg-gray-50">
//                     {/* Student Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         {profilePictureUrl ? (
//                           <img 
//                             src={profilePictureUrl} 
//                             alt={fullName}
//                             className="h-10 w-10 rounded-full object-cover mr-3"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                             }}
//                           />
//                         ) : (
//                           <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
//                             <span className="text-gray-600 text-sm font-medium">
//                               {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
//                             </span>
//                           </div>
//                         )}
//                         <div>
//                           <div className="text-sm font-medium text-gray-900">
//                             {fullName}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             ID: {studentId}
//                             {username && ` (${username})`}
//                           </div>
//                           {batch && (
//                             <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded inline-block mt-1">
//                               Batch: {batch}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
                    
//                     {/* Course Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {course.course_name || grade.course_name || 'N/A'}
//                       </div>
//                       <div className="text-sm text-gray-500">
//                         ID: {grade.course} • {course.course_credit || 0} credits
//                       </div>
//                     </td>
                    
//                     {/* Department Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm font-medium text-gray-900">
//                         {department?.department_name || 'N/A'}
//                       </div>
//                       <div className="text-sm text-gray-600">
//                         {college?.college_name || 'N/A'}
//                       </div>
//                     </td>
                    
//                     {/* Total Score Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-lg font-semibold text-gray-900">
//                         {grade.total_score}
//                       </div>
//                     </td>
                    
//                     {/* Final Grade Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-3 py-2 text-sm font-bold rounded-full ${
//                         calculatedGrade === 'A+' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
//                         calculatedGrade === 'A' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
//                         calculatedGrade === 'A-' ? 'bg-gradient-to-r from-green-300 to-green-500 text-white' :
//                         calculatedGrade === 'B+' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
//                         calculatedGrade === 'B' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
//                         calculatedGrade === 'B-' ? 'bg-gradient-to-r from-blue-300 to-blue-500 text-white' :
//                         calculatedGrade === 'C+' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
//                         calculatedGrade === 'C' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
//                         calculatedGrade === 'C-' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white' :
//                         calculatedGrade === 'D' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' :
//                         calculatedGrade === 'F' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {calculatedGrade || 'No Grade'}
//                       </span>
//                     </td>
                    
//                     {/* Actions Column */}
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <button
//                         onClick={() => showGradeDetails(grade)}
//                         className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
//                       >
//                         Details
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         ) : (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-4">
//               <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
//             <p className="text-gray-500 mb-4">
//               {selectedCollege || selectedDepartment || selectedCourse || selectedBatch 
//                 ? 'No grades match the current filters.' 
//                 : 'There are no grade records to display.'
//               }
//             </p>
//             {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch) && (
//               <button 
//                 onClick={clearFilters}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Grade Details Modal */}
//       {selectedGrade && (
//         <GradeDetailsModal 
//           grade={selectedGrade} 
//           onClose={closeGradeDetails}
//           courses={courses}
//           getStudentInfo={getStudentInfo}
//           getDepartmentInfo={getDepartmentInfo}
//           getProfilePicture={getProfilePicture}
//           calculateGradeFromTotalScore={calculateGradeFromTotalScore}
//         />
//       )}
//     </div>
//   );
// };

// // Grade Details Modal Component
// const GradeDetailsModal = ({ grade, onClose, courses, getStudentInfo, getDepartmentInfo, getProfilePicture, calculateGradeFromTotalScore }) => {
//   const course = courses[grade.course] || {};
//   const { fullName, batch, studentId, username, picture, userData } = getStudentInfo(grade);
//   const { department, college } = getDepartmentInfo(course);
//   const profilePictureUrl = getProfilePicture(picture);
//   const calculatedGrade = calculateGradeFromTotalScore(grade);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-bold text-gray-800">Grade Details</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//             {/* Student Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Student Information</h3>
//               <div className="flex items-center mb-3">
//                 {profilePictureUrl ? (
//                   <img 
//                     src={profilePictureUrl} 
//                     alt={fullName}
//                     className="h-16 w-16 rounded-full object-cover mr-3"
//                     onError={(e) => {
//                       e.target.style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center mr-3">
//                     <span className="text-gray-600 font-medium">
//                       {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
//                     </span>
//                   </div>
//                 )}
//                 <div>
//                   <div className="font-medium text-gray-900">{fullName}</div>
//                   <div className="text-sm text-gray-500">ID: {studentId}</div>
//                 </div>
//               </div>
//               <div className="space-y-2 text-sm">
//                 <p><strong>Username:</strong> {username || 'N/A'}</p>
//                 <p><strong>Batch:</strong> {batch || 'N/A'}</p>
//                 {userData && (
//                   <>
//                     <p><strong>Gender:</strong> {userData.gender || 'N/A'}</p>
//                     <p><strong>Phone:</strong> {userData.phoneNumber || 'N/A'}</p>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Course Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Course Information</h3>
//               <div className="space-y-2 text-sm">
//                 <p><strong>Course:</strong> {course.course_name || 'N/A'}</p>
//                 <p><strong>Course ID:</strong> {grade.course}</p>
//                 <p><strong>Credits:</strong> {course.course_credit || 0}</p>
//                 <p><strong>Year:</strong> {course.course_taken_year || 'N/A'}</p>
//                 <p><strong>Semester:</strong> {course.course_taken_semester || 'N/A'}</p>
//                 <p><strong>Category:</strong> {course.course_category || 'N/A'}</p>
//               </div>
//             </div>

//             {/* Institution & Grade Info */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-semibold text-gray-700 mb-3 border-b pb-2">Institution & Grade</h3>
//               <div className="space-y-2 text-sm">
//                 <p><strong>Department:</strong> {department?.department_name || 'N/A'}</p>
//                 <p><strong>College:</strong> {college?.college_name || 'N/A'}</p>
//                 <p><strong>Total Score:</strong> {grade.total_score}</p>
//                 <p><strong>Calculated Grade:</strong> 
//                   <span className={`ml-2 inline-flex px-3 py-1 text-sm font-bold rounded-full ${
//                     calculatedGrade === 'A+' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
//                     calculatedGrade === 'A' ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' :
//                     calculatedGrade === 'A-' ? 'bg-gradient-to-r from-green-300 to-green-500 text-white' :
//                     calculatedGrade === 'B+' ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white' :
//                     calculatedGrade === 'B' ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' :
//                     calculatedGrade === 'B-' ? 'bg-gradient-to-r from-blue-300 to-blue-500 text-white' :
//                     calculatedGrade === 'C+' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' :
//                     calculatedGrade === 'C' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white' :
//                     calculatedGrade === 'C-' ? 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white' :
//                     calculatedGrade === 'D' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white' :
//                     calculatedGrade === 'F' ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' :
//                     'bg-gray-100 text-gray-800'
//                   }`}>
//                     {calculatedGrade || 'No Grade'}
//                   </span>
//                 </p>
//                 <p><strong>Status:</strong> 
//                   <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                     grade.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {grade.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <h3 className="font-semibold text-gray-700 mb-2">Grade Components</h3>
//             {Object.entries(grade.grade_components || {}).length > 0 ? (
//               <div className="bg-gray-50 p-4 rounded">
//                 {Object.entries(grade.grade_components || {}).map(([name, component]) => (
//                   <div key={name} className="flex justify-between items-center py-2 border-b last:border-b-0">
//                     <span className="font-medium capitalize">{name}:</span>
//                     <span>{component.score} {component.max_score && `/ ${component.max_score}`} {component.weight && `(weight: ${component.weight})`}</span>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500">No grade components available</p>
//             )}
//           </div>

//           <div className="flex justify-end space-x-2">
//             <button
//               onClick={onClose}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GradesDisplay;



// components/GradesDisplay.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUniversity, 
  FaGraduationCap, 
  FaBookOpen, 
  FaCalendarAlt, 
  FaFileCsv, 
  FaFilePdf, 
  FaEraser, 
  FaSync, 
  FaEye,
  FaExclamationTriangle,
  FaAward,
  FaCheckCircle,
  FaPercent,
  FaTimes,
  FaIdCard,
  FaPhone,
  FaGenderless
} from 'react-icons/fa';

const GradesDisplay = () => {
  // --- STATE HOOKS (Preserved Exactly) ---
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState({});
  const [departments, setDepartments] = useState({});
  const [colleges, setColleges] = useState({});
  const [students, setStudents] = useState({}); 
  const [usersAuth, setUsersAuth] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states (Preserved Exactly)
  const [selectedCollege, setSelectedCollege] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);

  // --- LOGIC & CALCULATION HOOKS (Preserved Exactly) ---
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

  const getDepartmentInfo = (course) => {
    if (!course || !course.department_id) return { department: null, college: null };
    
    const department = departments[course.department_id];
    const college = department ? colleges[department.college_id] : null;
    
    return { department, college };
  };

  // --- API DATA FETCHING METHODS (Preserved Exactly) ---
  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching grades...');
      const response = await axios.get('/api/grades/dynamic-grades/');
      const gradesData = response.data.results || [];
      console.log('Grades data:', gradesData);
      setGrades(gradesData);

      const courseIds = [...new Set(gradesData.map(grade => grade.course))];
      console.log('Course IDs:', courseIds);
      
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
      console.log('Usernames to fetch:', Array.from(usernameIds));
      
      if (usernameIds.size > 0) {
        await fetchUsersAuthDetails(Array.from(usernameIds));
      }
      
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchUsersAuthDetails = async (usernames) => {
    try {
      const usersAuthDetails = {};
      console.log('Fetching UsersAuths for usernames:', usernames);
      
      const userPromises = usernames.map(async (username) => {
        if (username) {
          try {
            const response = await axios.get(`/api/users/users/${username}/`);
            usersAuthDetails[username] = response.data;
            console.log(`UsersAuth for ${username}:`, response.data);
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
      console.log('UsersAuth details stored:', usersAuthDetails);
      
    } catch (err) {
      console.error('Error fetching UsersAuths details:', err);
    }
  };

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

  const fetchAllData = async () => {
    try {
      const collegesResponse = await axios.get('/api/collages/colleges/');
      const allColleges = {};
      collegesResponse.data.forEach(college => {
        allColleges[college.college_id] = college;
      });
      setColleges(prev => ({ ...prev, ...allColleges }));

      const deptsResponse = await axios.get('/api/collages/departments/');
      const allDepartments = {};
      deptsResponse.data.forEach(dept => {
        allDepartments[dept.department_id] = dept;
      });
      setDepartments(prev => ({ ...prev, ...allDepartments }));

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

  // --- FILTER HANDLERS (Preserved Exactly) ---
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

  const getProfilePicture = (pictureUrl) => {
    if (!pictureUrl) return null;
    if (pictureUrl.startsWith('http')) return pictureUrl;
    return `http://localhost:8000${pictureUrl}`;
  };

  const availableBatches = [...new Set(
    Object.values(usersAuth)
      .map(user => user.batch)
      .filter(batch => batch !== null && batch !== undefined && batch !== '')
  )].sort();

  const departmentsForCollege = selectedCollege 
    ? Object.values(departments).filter(dept => dept.college_id === selectedCollege)
    : Object.values(departments);

  const coursesForDepartment = selectedDepartment
    ? Object.values(courses).filter(course => course.department_id === selectedDepartment)
    : Object.values(courses);

  // --- FILTERED ARRAYS AND FILE EXPORTS (Preserved Exactly) ---
  const filteredGrades = grades.filter(grade => {
    const course = courses[grade.course];
    if (!course) return false;

    const { department } = getDepartmentInfo(course);
    const { batch } = getStudentInfo(grade);

    if (selectedCollege && department?.college_id !== selectedCollege) return false;
    if (selectedDepartment && course.department_id !== selectedDepartment) return false;
    if (selectedCourse && grade.course !== selectedCourse) return false;
    if (selectedBatch && batch !== selectedBatch) return false;

    return true;
  });

  const clearFilters = () => {
    setSelectedCollege('');
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedBatch('');
  };

  const exportToCSV = () => {
    const headers = ['Student Name', 'Student ID', 'Username', 'Batch', 'Course', 'Department', 'College', 'Total Score', 'Final Grade'];
    const csvData = filteredGrades.map(grade => {
      const course = courses[grade.course] || {};
      const { department, college } = getDepartmentInfo(course);
      const { fullName, batch, studentId, username } = getStudentInfo(grade);
      const calculatedGrade = calculateGradeFromTotalScore(grade);
      
      return [
        fullName,
        studentId,
        username || 'N/A',
        batch || 'N/A',
        course.course_name || 'N/A',
        department?.department_name || 'N/A',
        college?.college_name || 'N/A',
        grade.total_score,
        calculatedGrade || 'N/A'
      ];
    });

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <html>
        <head>
          <title>Grades Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 13px; }
            th { background-color: #f8fafc; font-weight: bold; color: #1e293b; }
            .header { text-align: center; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 15px; }
            h1 { color: #1e293b; margin: 0 0 5px 0; }
            p { color: #64748b; margin: 0; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Student Grades Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Batch</th>
                <th>Course</th>
                <th>Department</th>
                <th>College</th>
                <th>Total Score</th>
                <th>Final Grade</th>
              </tr>
            </thead>
            <tbody>
              ${filteredGrades.map(grade => {
                const course = courses[grade.course] || {};
                const { department, college } = getDepartmentInfo(course);
                const { fullName, batch, studentId } = getStudentInfo(grade);
                const calculatedGrade = calculateGradeFromTotalScore(grade);
                
                return `
                  <tr>
                    <td><strong>${fullName}</strong></td>
                    <td>${studentId}</td>
                    <td>${batch || 'N/A'}</td>
                    <td>${course.course_name || 'N/A'}</td>
                    <td>${department?.department_name || 'N/A'}</td>
                    <td>${college?.college_name || 'N/A'}</td>
                    <td>${grade.total_score}</td>
                    <td><span style="font-weight: bold;">${calculatedGrade || 'N/A'}</span></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const showGradeDetails = (grade) => { setSelectedGrade(grade); };
  const closeGradeDetails = () => { setSelectedGrade(null); };

  // --- PREMIUM LOADING AND ERROR LAYOUTS (Preserved Exactly) ---
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
        <span className="mt-4 text-sm font-semibold text-slate-500 tracking-wide">Loading performance logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl mb-6 shadow-sm flex items-center justify-between animate-fadeIn">
        <div className="flex items-center gap-3">
          <FaExclamationTriangle className="text-xl text-rose-500 flex-shrink-0" />
          <div className="text-sm font-medium">
            <strong className="font-bold">Sync Error:</strong> {error}
          </div>
        </div>
        <button 
          onClick={fetchGrades}
          className="flex items-center gap-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-rose-700 transition shadow-sm shadow-rose-200"
        >
          <FaSync /> Retry Sync
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 tracking-normal text-slate-800">
      {/* Upper Navigation Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-6 mb-8 border-b border-slate-200/80 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">Student Grades</h1>
          <p className="mt-1 text-sm text-slate-500">Monitor academic performances, manage dynamic marks configurations and view metrics records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition shadow-sm shadow-emerald-100"
          >
            <FaFileCsv className="text-sm" /> Export CSV
          </button>
          <button 
            onClick={exportToPDF}
            className="flex items-center gap-2 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-rose-700 transition shadow-sm shadow-rose-100"
          >
            <FaFilePdf className="text-sm" /> Export PDF
          </button>
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-200 transition"
          >
            <FaEraser className="text-sm" /> Clear Filters
          </button>
          <button 
            onClick={fetchGrades}
            className="flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-100"
          >
            <FaSync className="text-sm" /> Refresh Data
          </button>
        </div>
      </div>

      {/* Modern Filter Frame */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          Filter Profiles Registry
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* College Filter */}
          <div className="relative">
            <label htmlFor="college-filter" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 tracking-wider">
              College Jurisdiction
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <FaUniversity className="text-xs" />
              </span>
              <select
                id="college-filter"
                value={selectedCollege}
                onChange={handleCollegeChange}
                className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
              >
                <option value="">All Colleges</option>
                {Object.values(colleges).map(college => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Department Filter */}
          <div className="relative">
            <label htmlFor="department-filter" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 tracking-wider">
              Department Branch
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <FaGraduationCap className="text-xs" />
              </span>
              <select
                id="department-filter"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Course Filter */}
          <div className="relative">
            <label htmlFor="course-filter" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 tracking-wider">
              Course Syllabus
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <FaBookOpen className="text-xs" />
              </span>
              <select
                id="course-filter"
                value={selectedCourse}
                onChange={handleCourseChange}
                className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
          </div>

          {/* Batch Filter */}
          <div className="relative">
            <label htmlFor="batch-filter" className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 tracking-wider">
              Enrollment Batch
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 pointer-events-none">
                <FaCalendarAlt className="text-xs" />
              </span>
              <select
                id="batch-filter"
                value={selectedBatch}
                onChange={handleBatchChange}
                className="block w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition appearance-none"
              >
                <option value="">All Batches</option>
                {availableBatches.map(batch => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Active Filters Bar Summary Component */}
        {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch) && (
          <div className="mt-5 p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100/80 transition-all">
            <div className="text-xs text-indigo-900 font-medium flex items-center flex-wrap gap-1">
              <span className="bg-indigo-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md mr-1.5 tracking-wider">Active</span>
              {selectedCollege && <span className="bg-white px-2.5 py-1 border border-indigo-100 rounded-lg shadow-2xs">College: <strong>{colleges[selectedCollege]?.college_name}</strong></span>}
              {selectedDepartment && <span className="bg-white px-2.5 py-1 border border-indigo-100 rounded-lg shadow-2xs">Department: <strong>{departments[selectedDepartment]?.department_name}</strong></span>}
              {selectedCourse && <span className="bg-white px-2.5 py-1 border border-indigo-100 rounded-lg shadow-2xs">Course: <strong>{courses[selectedCourse]?.course_name}</strong></span>}
              {selectedBatch && <span className="bg-white px-2.5 py-1 border border-indigo-100 rounded-lg shadow-2xs">Batch: <strong>{selectedBatch}</strong></span>}
            </div>
          </div>
        )}
      </div>

      {/* Analytics Scorecards Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registers</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{filteredGrades.length}</div>
          </div>
          <div className="h-10 w-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-500">
            <FaIdCard />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Logs</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {filteredGrades.filter(g => g.is_active).length}
            </div>
          </div>
          <div className="h-10 w-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <FaCheckCircle />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Passing Total</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {filteredGrades.filter(g => {
                const calculatedGrade = calculateGradeFromTotalScore(g);
                return calculatedGrade && ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D'].includes(calculatedGrade);
              }).length}
            </div>
          </div>
          <div className="h-10 w-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <FaAward />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mean Score Score</div>
            <div className="text-2xl font-black text-purple-600 mt-1">
              {filteredGrades.length > 0 
                ? (filteredGrades.reduce((sum, g) => sum + parseFloat(g.total_score || 0), 0) / filteredGrades.length).toFixed(1)
                : 0}
            </div>
          </div>
          <div className="h-10 w-10 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center text-purple-600">
            <FaPercent />
          </div>
        </div>
      </div>

      {/* Main Datatable Render View Container */}
      <div className="bg-white shadow-xs rounded-2xl border border-slate-200/70 overflow-hidden">
        {filteredGrades.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-slate-50/70">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Parameters</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Modules</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Institutional Tracks</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluated Grade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredGrades.map((grade) => {
                  const course = courses[grade.course] || {};
                  const { department, college } = getDepartmentInfo(course);
                  const { fullName, batch, studentId, username, picture } = getStudentInfo(grade);
                  const profilePictureUrl = getProfilePicture(picture);
                  const calculatedGrade = calculateGradeFromTotalScore(grade);
                  
                  return (
                    <tr key={grade.id} className="hover:bg-slate-50/50 transition">
                      {/* Student Column Profile */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3.5">
                          {profilePictureUrl ? (
                            <img 
                              src={profilePictureUrl} 
                              alt={fullName}
                              className="h-11 w-11 rounded-full object-cover border border-slate-100 shadow-2xs"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs shadow-2xs">
                              {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-semibold text-slate-900 tracking-tight">{fullName}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              ID: <span className="font-mono text-slate-600">{studentId}</span>
                              {username && <span className="text-slate-400 font-normal"> ({username})</span>}
                            </div>
                            {batch && (
                              <div className="text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/50 px-1.5 py-0.5 rounded-md inline-block mt-1">
                                BATCH: {batch}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      {/* Course Details Block */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-800 tracking-tight">
                          {course.course_name || grade.course_name || 'N/A'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          ID: <span className="font-mono">{grade.course}</span> • <span className="font-medium text-slate-600">{course.course_credit || 0} credits</span>
                        </div>
                      </td>
                      
                      {/* Department and Structural Info Column */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-800">{department?.department_name || 'N/A'}</div>
                        <div className="text-xs text-slate-400 font-normal mt-0.5">{college?.college_name || 'N/A'}</div>
                      </td>
                      
                      {/* Numerical Total Score Metrics */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-base font-extrabold text-slate-900 tracking-tight">
                          {grade.total_score}
                        </div>
                      </td>
                      
                      {/* Stylized Grade Badge Output */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 text-xs font-black rounded-full shadow-2xs tracking-wide ${
                          calculatedGrade === 'A+' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          calculatedGrade === 'A' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          calculatedGrade === 'A-' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                          calculatedGrade === 'B+' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          calculatedGrade === 'B' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          calculatedGrade === 'B-' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                          calculatedGrade === 'C+' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          calculatedGrade === 'C' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          calculatedGrade === 'C-' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                          calculatedGrade === 'D' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                          calculatedGrade === 'F' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>
                          {calculatedGrade || 'No Grade'}
                        </span>
                      </td>
                      
                      {/* Actions Buttons Trigger */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <button
                          onClick={() => showGradeDetails(grade)}
                          className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-slate-800 shadow-sm transition"
                        >
                          <FaEye className="text-xs" /> Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Custom Premium Empty Dataset Fallback Frame Component */
          <div className="text-center py-16 bg-white px-4">
            <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 shadow-3xs">
              <FaBookOpen />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">No performance grades located</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-5">
              {selectedCollege || selectedDepartment || selectedCourse || selectedBatch 
                ? 'No recorded logs corresponding to the active combination criteria were identified inside databases.' 
                : 'There are currently no formal grade entries configurations synchronized inside this academic layout portal.'
              }
            </p>
            {(selectedCollege || selectedDepartment || selectedCourse || selectedBatch) && (
              <button 
                onClick={clearFilters}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-indigo-700 transition shadow-sm shadow-indigo-100"
              >
                <FaEraser /> Reset View Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grade Details Modal Panel Component Block */}
      {selectedGrade && (
        <GradeDetailsModal 
          grade={selectedGrade} 
          onClose={closeGradeDetails}
          courses={courses}
          getStudentInfo={getStudentInfo}
          getDepartmentInfo={getDepartmentInfo}
          getProfilePicture={getProfilePicture}
          calculateGradeFromTotalScore={calculateGradeFromTotalScore}
        />
      )}
    </div>
  );
};

// --- SUBSIDIARY DETAIL MODAL PANEL INTERFACE COMPONENT ---
const GradeDetailsModal = ({ grade, onClose, courses, getStudentInfo, getDepartmentInfo, getProfilePicture, calculateGradeFromTotalScore }) => {
  const course = courses[grade.course] || {};
  const { fullName, batch, studentId, username, picture, userData } = getStudentInfo(grade);
  const { department, college } = getDepartmentInfo(course);
  const profilePictureUrl = getProfilePicture(picture);
  const calculatedGrade = calculateGradeFromTotalScore(grade);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 transform scale-100 transition-all">
        <div className="p-6 sm:p-8">
          {/* Header Panel */}
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Performance Ledger Detail</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium uppercase tracking-wider">System Log Registry ID: #{grade.id}</p>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Core Information Profile Grid Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Structural Column: Student Information */}
            <div className="bg-slate-50/60 border border-slate-100 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-slate-200/60">
                Student Profile
              </h3>
              <div className="flex items-center gap-3.5 mb-4">
                {profilePictureUrl ? (
                  <img 
                    src={profilePictureUrl} 
                    alt={fullName}
                    className="h-14 w-14 rounded-xl object-cover border border-white shadow-sm"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm shadow-sm">
                    {fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="font-bold text-slate-900 tracking-tight">{fullName}</div>
                  <div className="text-xs font-medium text-slate-500 mt-0.5">ID: <span className="font-mono text-slate-700">{studentId}</span></div>
                </div>
              </div>
              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Username:</span> <span className="font-semibold text-slate-800">{username || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Batch Year:</span> <span className="font-semibold text-slate-800">{batch || 'N/A'}</span>
                </p>
                {userData && (
                  <>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><FaGenderless /> Gender:</span> 
                      <span className="font-semibold text-slate-800 capitalize">{userData.gender || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><FaPhone /> Contact:</span> 
                      <span className="font-semibold text-slate-800 font-mono">{userData.phoneNumber || 'N/A'}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Structural Column: Course Information */}
            <div className="bg-slate-50/60 border border-slate-100 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-slate-200/60">
                Course Syllabus
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="flex flex-col gap-0.5 border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Module Name:</span> 
                  <span className="font-bold text-slate-800 tracking-tight text-sm">{course.course_name || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Module Key ID:</span> <span className="font-mono font-semibold text-slate-800">{grade.course}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Weight Credits:</span> <span className="font-semibold text-slate-800">{course.course_credit || 0} CH</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Academic Year:</span> <span className="font-semibold text-slate-800">{course.course_taken_year || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Semester Period:</span> <span className="font-semibold text-slate-800">{course.course_taken_semester || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Category Class:</span> <span className="font-semibold text-slate-800">{course.course_category || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Structural Column: Institution Metrics */}
            <div className="bg-slate-50/60 border border-slate-100 p-5 rounded-xl">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-1.5 border-b border-slate-200/60">
                Institutional Matrix
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <p className="flex flex-col gap-0.5 border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">Department Division:</span> <span className="font-semibold text-slate-800">{department?.department_name || 'N/A'}</span>
                </p>
                <p className="flex flex-col gap-0.5 border-b border-slate-100 pb-1.5">
                  <span className="text-slate-400 font-medium">College Base:</span> <span className="font-semibold text-slate-800">{college?.college_name || 'N/A'}</span>
                </p>
                <p className="flex justify-between border-b border-slate-100 pb-1.5 items-center">
                  <span className="text-slate-400 font-medium">Sum Score Marks:</span> <span className="text-sm font-black text-slate-900">{grade.total_score}</span>
                </p>
                <div className="flex justify-between border-b border-slate-100 pb-1.5 items-center">
                  <span className="text-slate-400 font-medium">Evaluated Alpha:</span> 
                  <span className={`inline-flex px-2.5 py-0.5 text-xs font-black rounded-full border shadow-3xs ${
                    calculatedGrade?.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    calculatedGrade?.startsWith('B') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    calculatedGrade?.startsWith('C') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    calculatedGrade === 'D' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {calculatedGrade || 'No Grade'}
                  </span>
                </div>
                <div className="flex justify-between pb-1 items-center">
                  <span className="text-slate-400 font-medium">System Status:</span> 
                  <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                    grade.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-400 text-white'
                  }`}>
                    {grade.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Split Components Section Breakdown Layout */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              Structural Evaluation Weight Components
            </h3>
            {Object.entries(grade.grade_components || {}).length > 0 ? (
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl overflow-hidden divide-y divide-slate-200/40">
                {Object.entries(grade.grade_components || {}).map(([name, component]) => (
                  <div key={name} className="flex sm:items-center justify-between p-4 flex-col sm:flex-row gap-2 hover:bg-slate-100/30 transition">
                    <span className="text-sm font-bold text-slate-700 capitalize flex items-center gap-2">
                      <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div> {name}
                    </span>
                    <div className="text-xs text-slate-600 font-medium flex items-center gap-3">
                      <span className="bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg shadow-3xs font-semibold">
                        Score Obtained: <strong className="text-slate-900 font-black">{component.score}</strong> {component.max_score && `/ ${component.max_score}`}
                      </span>
                      {component.weight && (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-lg font-bold">
                          Contribution Weight: {component.weight}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs font-medium text-slate-400 bg-slate-50/50">
                No nested evaluation element component logs are allocated to this criteria entry.
              </div>
            )}
          </div>

          {/* Lower Action Operations Block Footer */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-sm"
            >
              Dismiss Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradesDisplay;