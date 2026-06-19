// // components/TeacherCoursesPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeacherCoursesPage = () => {
//   const [assignedCourses, setAssignedCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     year: '',
//     semester: ''
//   });

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Axios instance
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     fetchAssignedCourses();
//   }, []);

//   useEffect(() => {
//     filterCourses();
//   }, [assignedCourses, filters]);

//   const fetchAssignedCourses = async () => {
//     try {
//       setLoading(true);
//       const user = getUserData();

//       if (!user || !user.userId) {
//         setError('User information not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const response = await api.get('courses/courses/');
//       const allCourses = response.data;

//       const teacherCourses = allCourses.filter(
//         course => course.instructor === user.userId
//       );

//       setAssignedCourses(teacherCourses);
//     } catch (error) {
//       console.error('Error fetching assigned courses:', error);
//       setError('Failed to fetch assigned courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCourses = () => {
//     let filtered = assignedCourses;

//     if (filters.year) {
//       filtered = filtered.filter(course => course.course_taken_year === filters.year);
//     }

//     if (filters.semester) {
//       filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
//     }

//     setFilteredCourses(filtered);
//   };

//   const getUserDisplayName = () => {
//     const user = getUserData();
//     if (!user) return 'Teacher';
//     if (user.firstName && user.fatherName) {
//       return `${user.firstName} ${user.fatherName}`;
//     }
//     return user.userId || 'Teacher';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your courses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Assigned Courses</h1>
//               <p className="text-gray-600">Welcome, {getUserDisplayName()}</p>
//               <p className="text-sm text-gray-500">User ID: {getUserData()?.userId}</p>
//             </div>
//             <div className="text-left sm:text-right">
//               <p className="text-sm text-gray-500">Total Assigned Courses</p>
//               <p className="text-xl sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</p>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter Courses</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
//               <select
//                 value={filters.year}
//                 onChange={(e) => setFilters({...filters, year: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Years</option>
//                 <option value="1st">1st Year</option>
//                 <option value="2nd">2nd Year</option>
//                 <option value="3rd">3rd Year</option>
//                 <option value="4th">4th Year</option>
//                 <option value="5th">5th Year</option>
//                 <option value="6th">6th Year</option>
//                 <option value="7th">7th Year</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//               <select
//                 value={filters.semester}
//                 onChange={(e) => setFilters({...filters, semester: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Semesters</option>
//                 <option value="I">Semester I</option>
//                 <option value="II">Semester II</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={fetchAssignedCourses}
//                 className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 flex items-center justify-center text-sm"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         {filteredCourses.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {filteredCourses.map((course) => (
//               <div key={course.course_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
//                     <div>
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{course.course_name}</h3>
//                       <p className="text-xs sm:text-sm text-gray-600">ID: {course.course_id}</p>
//                     </div>
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto">
//                       {course.course_credit} Credits
//                     </span>
//                   </div>

//                   <div className="space-y-2 text-xs sm:text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {course.course_taken_year} Year • Semester {course.course_taken_semester}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.department_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.college_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Category: {course.course_category}
//                     </div>
//                   </div>

//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                       <span className="text-xs sm:text-sm font-medium text-green-600">
//                         Assigned to You
//                       </span>
//                       <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                         Active
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
//             <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
//             </svg>
//             <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Courses Assigned</h3>
//             <p className="text-gray-500 mb-4 text-sm sm:text-base">
//               You don't have any courses assigned to you yet. Please contact your department administrator.
//             </p>
//             <button
//               onClick={fetchAssignedCourses}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
//             >
//               Check Again
//             </button>
//           </div>
//         )}

//         {/* Statistics */}
//         {assignedCourses.length > 0 && (
//           <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//               <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-blue-800">Total Courses</div>
//               </div>
//               <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-green-600">
//                   {assignedCourses.filter(course => course.course_taken_year === '1st').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-green-800">1st Year Courses</div>
//               </div>
//               <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-yellow-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'I').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-yellow-800">Semester I</div>
//               </div>
//               <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-purple-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'II').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-purple-800">Semester II</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherCoursesPage;





// // components/TeacherCoursesPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import GradeInsertionPage from './GradeInsertionPage';

// const TeacherCoursesPage = () => {
//   const [assignedCourses, setAssignedCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     year: '',
//     semester: ''
//   });
//   const [selectedCourse, setSelectedCourse] = useState(null);

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Axios instance
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     fetchAssignedCourses();
//   }, []);

//   useEffect(() => {
//     filterCourses();
//   }, [assignedCourses, filters]);

//   const fetchAssignedCourses = async () => {
//     try {
//       setLoading(true);
//       const user = getUserData();

//       if (!user || !user.userId) {
//         setError('User information not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const response = await api.get('courses/courses/');
//       const allCourses = response.data;

//       const teacherCourses = allCourses.filter(
//         course => course.instructor === user.userId
//       );

//       setAssignedCourses(teacherCourses);
//     } catch (error) {
//       console.error('Error fetching assigned courses:', error);
//       setError('Failed to fetch assigned courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCourses = () => {
//     let filtered = assignedCourses;

//     if (filters.year) {
//       filtered = filtered.filter(course => course.course_taken_year === filters.year);
//     }

//     if (filters.semester) {
//       filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
//     }

//     setFilteredCourses(filtered);
//   };

//   const getUserDisplayName = () => {
//     const user = getUserData();
//     if (!user) return 'Teacher';
//     if (user.firstName && user.fatherName) {
//       return `${user.firstName} ${user.fatherName}`;
//     }
//     return user.userId || 'Teacher';
//   };

//   const handleInsertMarks = (course) => {
//     setSelectedCourse(course);
//   };

//   // If a course is selected, show the GradeInsertionPage
//   if (selectedCourse) {
//     return <GradeInsertionPage course={selectedCourse} />;
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your courses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Assigned Courses</h1>
//               <p className="text-gray-600">Welcome, {getUserDisplayName()}</p>
//               <p className="text-sm text-gray-500">User ID: {getUserData()?.userId}</p>
//             </div>
//             <div className="text-left sm:text-right">
//               <p className="text-sm text-gray-500">Total Assigned Courses</p>
//               <p className="text-xl sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</p>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter Courses</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
//               <select
//                 value={filters.year}
//                 onChange={(e) => setFilters({...filters, year: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Years</option>
//                 <option value="1st">1st Year</option>
//                 <option value="2nd">2nd Year</option>
//                 <option value="3rd">3rd Year</option>
//                 <option value="4th">4th Year</option>
//                 <option value="5th">5th Year</option>
//                 <option value="6th">6th Year</option>
//                 <option value="7th">7th Year</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//               <select
//                 value={filters.semester}
//                 onChange={(e) => setFilters({...filters, semester: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Semesters</option>
//                 <option value="I">Semester I</option>
//                 <option value="II">Semester II</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={fetchAssignedCourses}
//                 className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 flex items-center justify-center text-sm"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         {filteredCourses.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {filteredCourses.map((course) => (
//               <div key={course.course_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
//                     <div>
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{course.course_name}</h3>
//                       <p className="text-xs sm:text-sm text-gray-600">ID: {course.course_id}</p>
//                     </div>
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto">
//                       {course.course_credit} Credits
//                     </span>
//                   </div>

//                   <div className="space-y-2 text-xs sm:text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {course.course_taken_year} Year • Semester {course.course_taken_semester}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.department_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.college_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Category: {course.course_category}
//                     </div>
//                   </div>

//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                       <span className="text-xs sm:text-sm font-medium text-green-600">
//                         Assigned to You
//                       </span>
//                       <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                         Active
//                       </span>
//                     </div>
//                   </div>

//                   {/* Insert Marks Button */}
//                   <div className="mt-4">
//                     <button
//                       onClick={() => handleInsertMarks(course)}
//                       className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 text-sm"
//                     >
//                       Insert Marks
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
//             <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
//             </svg>
//             <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Courses Assigned</h3>
//             <p className="text-gray-500 mb-4 text-sm sm:text-base">
//               You don't have any courses assigned to you yet. Please contact your department administrator.
//             </p>
//             <button
//               onClick={fetchAssignedCourses}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
//             >
//               Check Again
//             </button>
//           </div>
//         )}

//         {/* Statistics */}
//         {assignedCourses.length > 0 && (
//           <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//               <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-blue-800">Total Courses</div>
//               </div>
//               <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-green-600">
//                   {assignedCourses.filter(course => course.course_taken_year === '1st').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-green-800">1st Year Courses</div>
//               </div>
//               <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-yellow-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'I').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-yellow-800">Semester I</div>
//               </div>
//               <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-purple-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'II').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-purple-800">Semester II</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherCoursesPage;



// // components/TeacherCoursesPage.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import GradeInsertionPage from './GradeInsertionPage';
// import EditMark from './EditMark';

// const TeacherCoursesPage = () => {
//   const [assignedCourses, setAssignedCourses] = useState([]);
//   const [filteredCourses, setFilteredCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filters, setFilters] = useState({
//     year: '',
//     semester: ''
//   });
//   const [selectedCourse, setSelectedCourse] = useState(null);
//   const [editMode, setEditMode] = useState(false);

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Axios instance
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     fetchAssignedCourses();
//   }, []);

//   useEffect(() => {
//     filterCourses();
//   }, [assignedCourses, filters]);

//   const fetchAssignedCourses = async () => {
//     try {
//       setLoading(true);
//       const user = getUserData();

//       if (!user || !user.userId) {
//         setError('User information not found. Please login again.');
//         setLoading(false);
//         return;
//       }

//       const response = await api.get('courses/courses/');
//       const allCourses = response.data;

//       const teacherCourses = allCourses.filter(
//         course => course.instructor === user.userId
//       );

//       setAssignedCourses(teacherCourses);
//     } catch (error) {
//       console.error('Error fetching assigned courses:', error);
//       setError('Failed to fetch assigned courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterCourses = () => {
//     let filtered = assignedCourses;

//     if (filters.year) {
//       filtered = filtered.filter(course => course.course_taken_year === filters.year);
//     }

//     if (filters.semester) {
//       filtered = filtered.filter(course => course.course_taken_semester === filters.semester);
//     }

//     setFilteredCourses(filtered);
//   };

//   const getUserDisplayName = () => {
//     const user = getUserData();
//     if (!user) return 'Teacher';
//     if (user.firstName && user.fatherName) {
//       return `${user.firstName} ${user.fatherName}`;
//     }
//     return user.userId || 'Teacher';
//   };

//   const handleInsertMarks = (course) => {
//     setSelectedCourse(course);
//     setEditMode(false);
//   };

//   const handleEditMarks = (course) => {
//     setSelectedCourse(course);
//     setEditMode(true);
//   };

//   const handleBackToCourses = () => {
//     setSelectedCourse(null);
//     setEditMode(false);
//   };

//   // If a course is selected, show the appropriate page
//   if (selectedCourse) {
//     if (editMode) {
//       return <EditMark course={selectedCourse} onBack={handleBackToCourses} />;
//     } else {
//       return <GradeInsertionPage course={selectedCourse} onBack={handleBackToCourses} />;
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading your courses...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             <div>
//               <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Assigned Courses</h1>
//               <p className="text-gray-600">Welcome, {getUserDisplayName()}</p>
//               <p className="text-sm text-gray-500">User ID: {getUserData()?.userId}</p>
//             </div>
//             <div className="text-left sm:text-right">
//               <p className="text-sm text-gray-500">Total Assigned Courses</p>
//               <p className="text-xl sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</p>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
//             {error}
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700">Filter Courses</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
//               <select
//                 value={filters.year}
//                 onChange={(e) => setFilters({...filters, year: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Years</option>
//                 <option value="1st">1st Year</option>
//                 <option value="2nd">2nd Year</option>
//                 <option value="3rd">3rd Year</option>
//                 <option value="4th">4th Year</option>
//                 <option value="5th">5th Year</option>
//                 <option value="6th">6th Year</option>
//                 <option value="7th">7th Year</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//               <select
//                 value={filters.semester}
//                 onChange={(e) => setFilters({...filters, semester: e.target.value})}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//               >
//                 <option value="">All Semesters</option>
//                 <option value="I">Semester I</option>
//                 <option value="II">Semester II</option>
//               </select>
//             </div>

//             <div className="flex items-end">
//               <button
//                 onClick={fetchAssignedCourses}
//                 className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200 flex items-center justify-center text-sm"
//               >
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Courses Grid */}
//         {filteredCourses.length > 0 ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {filteredCourses.map((course) => (
//               <div key={course.course_id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
//                     <div>
//                       <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">{course.course_name}</h3>
//                       <p className="text-xs sm:text-sm text-gray-600">ID: {course.course_id}</p>
//                     </div>
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full self-start sm:self-auto">
//                       {course.course_credit} Credits
//                     </span>
//                   </div>

//                   <div className="space-y-2 text-xs sm:text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                       </svg>
//                       {course.course_taken_year} Year • Semester {course.course_taken_semester}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.department_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m2 0H9m2 0H7m2 0H5m14 0v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2" />
//                       </svg>
//                       {course.college_name}
//                     </div>

//                     <div className="flex items-center text-gray-600">
//                       <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                       </svg>
//                       Category: {course.course_category}
//                     </div>
//                   </div>

//                   <div className="mt-4 pt-4 border-t border-gray-200">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
//                       <span className="text-xs sm:text-sm font-medium text-green-600">
//                         Assigned to You
//                       </span>
//                       <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
//                         Active
//                       </span>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="mt-4 flex flex-col sm:flex-row gap-2">
//                     <button
//                       onClick={() => handleInsertMarks(course)}
//                       className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 text-sm flex items-center justify-center"
//                     >
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                       Insert Marks
//                     </button>
//                     <button
//                       onClick={() => handleEditMarks(course)}
//                       className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200 text-sm flex items-center justify-center"
//                     >
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                       </svg>
//                       Edit Marks
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
//             <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l-9 5m9-5v6" />
//             </svg>
//             <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No Courses Assigned</h3>
//             <p className="text-gray-500 mb-4 text-sm sm:text-base">
//               You don't have any courses assigned to you yet. Please contact your department administrator.
//             </p>
//             <button
//               onClick={fetchAssignedCourses}
//               className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200 text-sm sm:text-base"
//             >
//               Check Again
//             </button>
//           </div>
//         )}

//         {/* Statistics */}
//         {assignedCourses.length > 0 && (
//           <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Statistics</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
//               <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-blue-600">{assignedCourses.length}</div>
//                 <div className="text-xs sm:text-sm text-blue-800">Total Courses</div>
//               </div>
//               <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-green-600">
//                   {assignedCourses.filter(course => course.course_taken_year === '1st').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-green-800">1st Year Courses</div>
//               </div>
//               <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-yellow-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'I').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-yellow-800">Semester I</div>
//               </div>
//               <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
//                 <div className="text-lg sm:text-2xl font-bold text-purple-600">
//                   {assignedCourses.filter(course => course.course_taken_semester === 'II').length}
//                 </div>
//                 <div className="text-xs sm:text-sm text-purple-800">Semester II</div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherCoursesPage;


// components/TeacherCoursesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GradeInsertionPage from './GradeInsertionPage';
import EditMark from './EditMark';
import { 
  FaBookOpen, FaFilter, FaRedo, FaGraduationCap, 
  FaCalendarAlt, FaUniversity, FaTags, FaPlusCircle, 
  FaEdit, FaExclamationCircle, FaArrowRight, FaIdBadge
} from 'react-icons/fa';

const TeacherCoursesPage = () => {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    semester: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editMode, setEditMode] = useState(false);

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

  const handleInsertMarks = (course) => {
    setSelectedCourse(course);
    setEditMode(false);
  };

  const handleEditMarks = (course) => {
    setSelectedCourse(course);
    setEditMode(true);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setEditMode(false);
  };

  // If a course is selected, show the appropriate page
  if (selectedCourse) {
    if (editMode) {
      return <EditMark course={selectedCourse} onBack={handleBackToCourses} />;
    } else {
      return <GradeInsertionPage course={selectedCourse} onBack={handleBackToCourses} />;
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto shadow-md"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500 tracking-wide uppercase">Syncing courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      
      {/* Upper Status Frame */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
        <div>
          <span className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <FaBookOpen className="text-xs" /> Academic Curriculum Portal
          </span>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Assigned Modules</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
            <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">{getUserDisplayName()}</span>
            <span className="flex items-center gap-1"><FaIdBadge className="text-slate-400" /> ID: {getUserData()?.userId}</span>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl flex items-center gap-4 self-stretch md:self-auto justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Roll</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Total Assigned</p>
          </div>
          <div className="text-3xl font-black text-orange-600 tracking-tight">
            {assignedCourses.length}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200">
          <FaExclamationCircle className="flex-shrink-0 text-lg" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Filters Block */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-50 pb-3">
          <FaFilter className="text-slate-400 text-sm" />
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Filter Workspace</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Academic Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({...filters, year: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-sm font-medium text-slate-700"
            >
              <option value="">All Available Years</option>
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
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Semester Term</label>
            <select
              value={filters.semester}
              onChange={(e) => setFilters({...filters, semester: e.target.value})}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-sm font-medium text-slate-700"
            >
              <option value="">All Semesters</option>
              <option value="I">Semester I</option>
              <option value="II">Semester II</option>
            </select>
          </div>

          <button
            onClick={fetchAssignedCourses}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 border border-slate-200 transition-colors duration-200 flex items-center justify-center gap-2 text-sm h-[38px]"
          >
            <FaRedo className="text-xs text-slate-500 animate-hover" />
            Refresh Records
          </button>
        </div>
      </div>

      {/* Main Grid View */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.course_id} 
              className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Card Banner Header */}
              <div className="p-5 border-b border-slate-50 flex-1">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      Code: {course.course_id}
                    </span>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                      {course.course_name}
                    </h3>
                  </div>
                  <span className="bg-orange-50 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-lg border border-orange-100 flex-shrink-0">
                    {course.course_credit} Cr
                  </span>
                </div>

                {/* Info Metadata Block */}
                <div className="space-y-2.5 mt-4 pt-1">
                  <div className="flex items-center text-xs font-medium text-slate-600 gap-2.5">
                    <FaCalendarAlt className="text-slate-400 text-sm flex-shrink-0" />
                    <span>{course.course_taken_year} Year &bull; Term {course.course_taken_semester}</span>
                  </div>

                  <div className="flex items-center text-xs font-medium text-slate-600 gap-2.5">
                    <FaGraduationCap className="text-slate-400 text-sm flex-shrink-0" />
                    <span className="truncate">{course.department_name}</span>
                  </div>

                  <div className="flex items-center text-xs font-medium text-slate-600 gap-2.5">
                    <FaUniversity className="text-slate-400 text-sm flex-shrink-0" />
                    <span className="truncate text-slate-500">{course.college_name}</span>
                  </div>

                  <div className="flex items-center text-xs font-medium text-slate-600 gap-2.5">
                    <FaTags className="text-slate-400 text-sm flex-shrink-0" />
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {course.course_category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Base Action Footer */}
              <div className="bg-slate-50/50 px-5 py-4 border-t border-slate-50 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Assigned Sync
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md border border-emerald-100 uppercase tracking-wider text-[10px]">
                    Active
                  </span>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleInsertMarks(course)}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 shadow-sm shadow-orange-600/10 transition-colors text-xs flex items-center justify-center gap-1.5"
                  >
                    <FaPlusCircle />
                    <span>Insert Marks</span>
                  </button>
                  <button
                    onClick={() => handleEditMarks(course)}
                    className="flex-1 px-3 py-2 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-900 shadow-sm transition-colors text-xs flex items-center justify-center gap-1.5"
                  >
                    <FaEdit />
                    <span>Edit Marks</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty Ledger State */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <FaBookOpen className="text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No Courses Found</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto mb-5 leading-relaxed">
            There are no active educational modules matches your current filter setup, or assigned under your instructor profile.
          </p>
          <button
            onClick={fetchAssignedCourses}
            className="px-4 py-2 bg-orange-50 text-orange-600 border border-orange-100 font-bold rounded-xl hover:bg-orange-100 transition-colors text-sm inline-flex items-center gap-1.5"
          >
            Re-evaluate Profile Ledger <FaArrowRight className="text-xs" />
          </button>
        </div>
      )}

      {/* Auxiliary Statistics Panel */}
      {assignedCourses.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mt-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Term Metrics Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-800">{assignedCourses.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Total Allocation</div>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-orange-600">
                {assignedCourses.filter(course => course.course_taken_year === '1st').length}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">1st Year Pipeline</div>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-700">
                {assignedCourses.filter(course => course.course_taken_semester === 'I').length}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Semester I Track</div>
            </div>
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              <div className="text-2xl font-black text-slate-700">
                {assignedCourses.filter(course => course.course_taken_semester === 'II').length}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Semester II Track</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesPage;