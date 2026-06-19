// // components/CourseManagement.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const CourseManagement = () => {
//   const [courses, setCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [allTeachers, setAllTeachers] = useState([]);
//   const [filteredTeachers, setFilteredTeachers] = useState([]);
//   const [filters, setFilters] = useState({
//     department: '',
//     year: '',
//     semester: ''
//   });
//   const [teacherFilters, setTeacherFilters] = useState({
//     college: '',
//     search: ''
//   });
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [selectedTeacher, setSelectedTeacher] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Create axios instance with auth headers
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor to include auth token
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   useEffect(() => {
//     fetchCourses();
//     fetchDepartments();
//     fetchAllTeachers();
//   }, []);

//   useEffect(() => {
//     filterCourses();
//   }, [courses, filters]);

//   useEffect(() => {
//     filterTeachers();
//   }, [allTeachers, teacherFilters]);

//   const fetchCourses = async () => {
//     try {
//       const response = await api.get('courses/courses/');
//       setCourses(response.data);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//       setError('Failed to fetch courses');
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await api.get('collages/departments/');
//       if (Array.isArray(response.data)) {
//         setDepartments(response.data);
//       } else if (response.data && Array.isArray(response.data.results)) {
//         setDepartments(response.data.results);
//       } else if (response.data && Array.isArray(response.data.departments)) {
//         setDepartments(response.data.departments);
//       } else {
//         console.error('Unexpected departments response structure:', response.data);
//         setDepartments([]);
//       }
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//       setError('Failed to fetch departments');
//       setDepartments([]);
//     }
//   };

//   const fetchAllTeachers = async () => {
//     try {
//       const response = await api.get('teachers/teachers/');
//       console.log('Teachers API response:', response.data);
      
//       // Extract teachers from results array
//       let teachersData = [];
//       if (response.data && Array.isArray(response.data.results)) {
//         teachersData = response.data.results;
//       } else if (Array.isArray(response.data)) {
//         teachersData = response.data;
//       }
      
//       setAllTeachers(teachersData);
//       setFilteredTeachers(teachersData);
//     } catch (error) {
//       console.error('Error fetching all teachers:', error);
//       setError('Failed to fetch teachers');
//     }
//   };

//   const filterTeachers = () => {
//     let filtered = allTeachers;
    
//     // Filter by college
//     if (teacherFilters.college) {
//       filtered = filtered.filter(teacher => 
//         teacher.college_name === teacherFilters.college
//       );
//     }
    
//     // Filter by search term
//     if (teacherFilters.search) {
//       const searchTerm = teacherFilters.search.toLowerCase();
//       filtered = filtered.filter(teacher => 
//         getTeacherDisplayName(teacher).toLowerCase().includes(searchTerm) ||
//         teacher.teacher_id.toLowerCase().includes(searchTerm) ||
//         teacher.academic_level.toLowerCase().includes(searchTerm)
//       );
//     }
    
//     setFilteredTeachers(filtered);
//   };

//   const filterCourses = () => {
//     let filtered = courses;
    
//     if (filters.department) {
//       filtered = filtered.filter(course => course.department_id === filters.department);
//     }
    
//     if (filters.year) {
//       filtered = filtered.filter(course => course.course_taken_year === filters.year);
//     }
    
//     if (filters.semester) {
//       filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
//     }
    
//     setFilteredCourses(filtered);
//   };

//   const handleAssignInstructor = async (course) => {
//     setSelectedCourse(course);
//     setSelectedTeacher('');
//     setSuccessMessage('');
//     setIsModalOpen(true);
//     setTeacherFilters({ college: '', search: '' });
//   };

//   const handleAssignTeacher = async () => {
//     if (!selectedTeacher) return;

//     setLoading(true);
//     try {
//       await api.patch(`courses/courses/${selectedCourse.course_id}/assign_instructor/`, {
//         teacher_id: selectedTeacher
//       });
      
//       setSuccessMessage(`Instructor assigned successfully to ${selectedCourse.course_name}!`);
//       setTimeout(() => {
//         setIsModalOpen(false);
//         setSuccessMessage('');
//         fetchCourses(); // Refresh the course list
//       }, 2000);
//     } catch (error) {
//       console.error('Error assigning instructor:', error);
//       setError('Failed to assign instructor. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTeacher('');
//     setSuccessMessage('');
//     setTeacherFilters({ college: '', search: '' });
//   };

//   // Helper function to get teacher display name
//   const getTeacherDisplayName = (teacher) => {
//     if (teacher.user_first_name && teacher.user_father_name) {
//       return `${teacher.user_first_name} ${teacher.user_father_name}`;
//     }
//     if (teacher.username?.firstName && teacher.username?.fatherName) {
//       return `${teacher.username.firstName} ${teacher.username.fatherName}`;
//     }
//     if (teacher.full_name) return teacher.full_name;
//     return teacher.teacher_id || 'Unknown Teacher';
//   };

//   // Get unique colleges from teachers
//   const getUniqueColleges = () => {
//     const colleges = allTeachers.map(teacher => teacher.college_name).filter(Boolean);
//     return [...new Set(colleges)];
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-gray-800">Course Management</h1>
      
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Course Filters</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
//             <select
//               value={filters.department}
//               onChange={(e) => setFilters({...filters, department: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Departments</option>
//               {Array.isArray(departments) && departments.map(dept => (
//                 <option key={dept.department_id} value={dept.department_id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
//             <select
//               value={filters.year}
//               onChange={(e) => setFilters({...filters, year: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Years</option>
//               <option value="1st">1st Year</option>
//               <option value="2nd">2nd Year</option>
//               <option value="3rd">3rd Year</option>
//               <option value="4th">4th Year</option>
//               <option value="5th">5th Year</option>
//               <option value="6th">6th Year</option>
//               <option value="7th">7th Year</option>
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//             <select
//               value={filters.semester}
//               onChange={(e) => setFilters({...filters, semester: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">All Semesters</option>
//               <option value="I">Semester I</option>
//               <option value="II">Semester II</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Courses Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course code</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
//               {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th> */}
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {filteredCourses.map((course) => (
//               <tr key={course.course_id} className="hover:bg-gray-50">
//                 <td className="px-6 py-4 whitespace-nowra text-sm font-medium text-gray-900">{course.course_id}</td>
//                 <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_name}</td>
//                 <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_credit}</td>
//                 <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_taken_year}</td>
//                 <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.course_taken_semester}</td>
//                 <td className="px-6 py-4 whitespace-nowra text-sm text-gray-900">{course.department_name}</td>
//                 {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.college_name}</td> */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                   {course.instructor || 'Not Assigned'}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                   <button
//                     onClick={() => handleAssignInstructor(course)}
//                     className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm transition duration-200 w-full"
//                   >
//                     Assign Instructor
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal for Assigning Instructor */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-semibold text-gray-800">
//                 Assign Instructor to {selectedCourse?.course_name}
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-700 text-xl"
//               >
//                 ×
//               </button>
//             </div>

//             {successMessage ? (
//               <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//                 {successMessage}
//               </div>
//             ) : (
//               <>
//                 {/* Teacher Filters */}
//                 <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                   <h3 className="text-lg font-medium text-gray-700 mb-3">Filter Teachers</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">College</label>
//                       <select
//                         value={teacherFilters.college}
//                         onChange={(e) => setTeacherFilters({...teacherFilters, college: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">All Colleges</option>
//                         {getUniqueColleges().map(college => (
//                           <option key={college} value={college}>
//                             {college}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//                       <input
//                         type="text"
//                         placeholder="Search by name, ID, or academic level..."
//                         value={teacherFilters.search}
//                         onChange={(e) => setTeacherFilters({...teacherFilters, search: e.target.value})}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Teachers List */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-medium text-gray-700 mb-3">Available Teachers</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
//                     {filteredTeachers.length > 0 ? (
//                       filteredTeachers.map(teacher => (
//                         <div
//                           key={teacher.teacher_id}
//                           className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
//                             selectedTeacher === teacher.teacher_id
//                               ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
//                               : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
//                           }`}
//                           onClick={() => setSelectedTeacher(teacher.teacher_id)}
//                         >
//                           <div className="flex items-center space-x-4">
//                             <div className="flex-shrink-0">
//                               {teacher.username?.picture ? (
//                                 <img
//                                   src={teacher.username.picture}
//                                   alt={getTeacherDisplayName(teacher)}
//                                   className="w-12 h-12 rounded-full object-cover"
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
//                                   <span className="text-gray-600 font-medium">
//                                     {getTeacherDisplayName(teacher).charAt(0)}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-gray-900 truncate">
//                                 {getTeacherDisplayName(teacher)}
//                               </p>
//                               <p className="text-sm text-gray-500 truncate">
//                                 ID: {teacher.teacher_id}
//                               </p>
//                               <p className="text-sm text-gray-500">
//                                 {teacher.academic_level}
//                               </p>
//                               <p className="text-sm text-gray-500 truncate">
//                                 {teacher.college_name}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <div className="col-span-2 text-center py-8 text-gray-500">
//                         No teachers found matching your criteria
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex justify-end space-x-3 pt-4 border-t">
//                   <button
//                     onClick={closeModal}
//                     className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleAssignTeacher}
//                     disabled={!selectedTeacher || loading}
//                     className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
//                   >
//                     {loading ? 'Assigning...' : 'Assign Instructor'}
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseManagement;



// components/AssignedInstructorsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const AssignedInstructorsPage = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    semester: '',
    instructor: ''
  });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState('');

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

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('courses/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch assigned courses.');
    } finally {
      setLoading(false);
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
      setError('Failed to fetch departments data.');
      setDepartments([]);
    }
  };

  const fetchAllTeachers = async () => {
    try {
      const response = await api.get('teachers/teachers/');
      
      let teachersData = [];
      if (response.data && Array.isArray(response.data.results)) {
        teachersData = response.data.results;
      } else if (Array.isArray(response.data)) {
        teachersData = response.data;
      }
      
      setTeachers(teachersData);
    } catch (error) {
      console.error('Error fetching all teachers:', error);
      setError('Failed to sync faculty profiles.');
    }
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
    
    if (filters.instructor) {
      filtered = filtered.filter(course => course.instructor === filters.instructor);
    }
    
    setFilteredCourses(filtered);
  };

  // Helper function to get teacher details by ID
  const getTeacherDetails = (teacherId) => {
    return teachers.find(teacher => teacher.teacher_id === teacherId);
  };

  // Helper function to get teacher display name
  const getTeacherDisplayName = (teacher) => {
    if (teacher && teacher.user_first_name && teacher.user_father_name) {
      return `${teacher.user_first_name} ${teacher.user_father_name}`;
    }
    if (teacher && teacher.username?.firstName && teacher.username?.fatherName) {
      return `${teacher.username.firstName} ${teacher.username.fatherName}`;
    }
    if (teacher && teacher.full_name) return teacher.full_name;
    return 'Unknown Teacher';
  };

  // Export to CSV function
  const exportToCSV = () => {
    setExportLoading(true);
    try {
      const dataToExport = filteredCourses.map(course => {
        const teacher = getTeacherDetails(course.instructor);
        return {
          'Course ID': course.course_id,
          'Course Name': course.course_name,
          'Credits': course.course_credit,
          'Year': course.course_taken_year,
          'Semester': course.course_taken_semester,
          'Department': course.department_name,
          'College': course.college_name,
          'Category': course.course_category,
          'Instructor ID': course.instructor,
          'Instructor Name': teacher ? getTeacherDisplayName(teacher) : 'Not Assigned',
          'Instructor Username': teacher?.username || '',
          'Academic Level': teacher?.academic_level || ''
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Assigned Courses');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(data, `assigned-courses-${new Date().toISOString().split('T')[0]}.xlsx`);
      
    } catch (error) {
      console.error('Error export workbook:', error);
      setError('Export processing encountered an issue.');
    } finally {
      setExportLoading(false);
    }
  };

  // Get unique instructors from courses
  const getUniqueInstructors = () => {
    const instructorIds = courses
      .filter(course => course.instructor)
      .map(course => course.instructor);
    
    return [...new Set(instructorIds)].map(instructorId => {
      const teacher = getTeacherDetails(instructorId);
      return {
        id: instructorId,
        name: teacher ? getTeacherDisplayName(teacher) : instructorId,
        teacher: teacher
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">Loading assignments registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300">
      
      {/* Top Heading Actions Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
            Assigned Instructors Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor, filter, and track course modular allocations across academic branches.
          </p>
        </div>
        
        <button
          onClick={exportToCSV}
          disabled={exportLoading || filteredCourses.length === 0}
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm self-start sm:self-auto"
        >
          {exportLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Exporting Matrix...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export to Excel</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-sm font-medium shadow-sm">
          <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Advanced Filter Panel Shelf */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Search Scope
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Department Matrix</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Academic Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Semester Cycle</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
              className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="">All Semesters</option>
              <option value="I">Semester I</option>
              <option value="II">Semester II</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">Instructor Profile</label>
            <select
              value={filters.instructor}
              onChange={(e) => setFilters({...filters, instructor: e.target.value})}
              className="w-full bg-slate-50 text-slate-800 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="">All Instructors</option>
              {getUniqueInstructors().map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Grid Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-6 mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Registry Summary Insights</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <div className="text-2xl font-bold text-indigo-600">{filteredCourses.length}</div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Total Core Modules</div>
          </div>
          
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <div className="text-2xl font-bold text-indigo-600">
              {new Set(filteredCourses.map(course => course.department_id)).size}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Departments Engaged</div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <div className="text-2xl font-bold text-indigo-600">
              {new Set(filteredCourses.map(course => course.college_name)).size}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Colleges Active</div>
          </div>
        </div>
      </div>

      {/* Roster Data Table Card Workspace */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Module Details</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Term</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Faculty</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Department Context</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 text-slate-600">
              {filteredCourses.map((course) => {
                const teacher = getTeacherDetails(course.instructor);
                return (
                  <tr key={course.course_id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Course Specifications Card Box */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-bold text-slate-800 leading-snug">{course.course_name}</p>
                        <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
                          <span>Ref: {course.course_id}</span>
                          <span>•</span>
                          <span>{course.course_credit} Credits</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 mt-2 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600 tracking-wider">
                          {course.course_category}
                        </span>
                      </div>
                    </td>

                    {/* Timeline Academic Badges */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs">
                          <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">Year:</span> 
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-medium">{course.course_taken_year}</span>
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold text-slate-400 text-[10px] uppercase tracking-wider mr-1.5">Term:</span> 
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">Sem {course.course_taken_semester}</span>
                        </div>
                      </div>
                    </td>

                    {/* Instructor Profile Details Box Layout */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {teacher ? (
                        <div className="flex items-center space-x-3">
                          {teacher.username?.picture ? (
                            <img
                              src={teacher.username.picture}
                              alt={getTeacherDisplayName(teacher)}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                              {getTeacherDisplayName(teacher).charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {getTeacherDisplayName(teacher)}
                            </p>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {teacher.teacher_id}</p>
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              <span className="bg-indigo-50/60 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mr-1">{teacher.academic_level || 'Faculty'}</span>
                              {teacher.username ? `@${teacher.username}` : ''}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold">
                          Not Assigned
                        </span>
                      )}
                    </td>

                    {/* Department / Collage institutional data mapping */}
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p className="text-sm font-semibold text-slate-800 truncate">{course.department_name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{course.college_name}</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty Fallback Screen */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 bg-slate-50/30 border-t border-slate-100">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9l-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-slate-500 font-semibold text-sm">No matched results found</p>
            <p className="text-slate-400 text-xs mt-1">Adjust your chosen filter drop-downs to search again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedInstructorsPage;