// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaBuilding, FaSearch, FaSort } from "react-icons/fa";

// const DepartmentList = () => {
//   const [departments, setDepartments] = useState([]);
//   const [filteredDepartments, setFilteredDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [sortBy, setSortBy] = useState(""); // "" | "name" | "college"

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   // Fetch departments
//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem("access");
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = Array.isArray(res.data) ? res.data : res.data.results || [];
//       setDepartments(data);
//       setFilteredDepartments(data);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//       setError("Failed to load departments");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDepartments();
//   }, []);

//   // Handle search
//   useEffect(() => {
//     let filtered = departments.filter((dept) =>
//       dept.department_name.toLowerCase().includes(search.toLowerCase()) ||
//       (dept.department_code || "").toLowerCase().includes(search.toLowerCase()) ||
//       (dept.college_name || dept.college || "").toLowerCase().includes(search.toLowerCase())
//     );

//     // Apply sorting
//     if (sortBy === "name") {
//       filtered.sort((a, b) => a.department_name.localeCompare(b.department_name));
//     } else if (sortBy === "college") {
//       filtered.sort((a, b) => (a.college_name || a.college || "").localeCompare(b.college_name || b.college || ""));
//     }

//     setFilteredDepartments(filtered);
//     setCurrentPage(1); // reset to first page on search or sort
//   }, [search, sortBy, departments]);

//   // Pagination logic
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg text-white text-center">
//           <h1 className="text-3xl font-bold">All Departments</h1>
//           <p className="mt-2 text-lg">List of all departments in your university</p>
//         </div>

//         {/* Search and Sort */}
//         <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
//           {/* Search */}
//           <div className="relative w-full sm:max-w-md">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by department, code, or college..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//             />
//           </div>

//           {/* Sort */}
//           <div className="flex items-center space-x-2">
//             <FaSort className="text-gray-600" />
//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//             >
//               <option value="">Sort By</option>
//               <option value="name">Department Name</option>
//               <option value="college">College Name</option>
//             </select>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
//             {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <div className="text-center text-gray-500">Loading departments...</div>
//         ) : filteredDepartments.length === 0 ? (
//           <div className="text-center text-gray-500">No departments found.</div>
//         ) : (
//           <>
//             {/* Department Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentItems.map((dept) => (
//                 <div
//                   key={dept.id || dept.department_code}
//                   className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
//                 >
//                   <div className="flex items-center mb-4">
//                     <FaBuilding className="text-blue-500 text-2xl mr-3" />
//                     <h2 className="text-xl font-semibold text-gray-800">{dept.department_name}</h2>
//                   </div>
//                   <p className="text-gray-600">
//                     <span className="font-medium">Code:</span> {dept.department_code}
//                   </p>
//                   <p className="text-gray-600 mt-1">
//                     <span className="font-medium">College:</span> {dept.college_name || dept.college || "N/A"}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center mt-8 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-4 py-2 rounded-xl font-medium transition ${
//                       currentPage === i + 1
//                         ? "bg-blue-600 text-white shadow-lg"
//                         : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {i + 1}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DepartmentList;


// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import {
//   AcademicCapIcon,
//   TrashIcon,
//   MagnifyingGlassIcon,
//   BookOpenIcon,
//   PencilIcon,
//   DocumentArrowDownIcon,
//   XMarkIcon,
//   FunnelIcon,
//   PlusIcon
// } from '@heroicons/react/24/outline';
// import { CSVLink } from 'react-csv';

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [coursesList, setCoursesList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [courseSearchTerm, setCourseSearchTerm] = useState('');
//   const [selectedCollege, setSelectedCollege] = useState('');
//   const [selectedDepartment, setSelectedDepartment] = useState('');
//   const [showFilters, setShowFilters] = useState(false);

//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [showDetails, setShowDetails] = useState(false);

//   // Edit modal
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [editLoading, setEditLoading] = useState(false);
//   const [editData, setEditData] = useState({
//     year: '',
//     semester: '',
//     courseIds: [],
//   });

//   // Delete modal
//   const [deletingStudent, setDeletingStudent] = useState(null);

//   const BASE_URL = 'http://localhost:8000/api';

//   // Safe API call
//   const safeApiCall = async (url, options = {}) => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios({
//         url,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           ...options.headers,
//         },
//         ...options,
//       });

//       const data = response.data;
//       if (data && typeof data === 'object' && 'results' in data) {
//         return data.results || [];
//       }
//       return data || [];
//     } catch (err) {
//       if (err.response?.status === 404) {
//         console.warn(`Endpoint not found: ${url}`);
//         return [];
//       }
//       console.error(`Error calling ${url}:`, err);
//       throw err;
//     }
//   };

//   // Fetch student courses for a username
//   const fetchStudentCourses = async (studentUsername) => {
//     try {
//       const response = await safeApiCall(`${BASE_URL}/students/${studentUsername}/courses/`);
//       if (Array.isArray(response)) return response;
//       return response?.courses || [];
//     } catch (err) {
//       console.error(`Error fetching courses for ${studentUsername}:`, err);
//       return [];
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setError('');
//       setLoading(true);

//       const [usersData, collegesData, departmentsData, studentsData, allCourses] =
//         await Promise.all([
//           safeApiCall(`${BASE_URL}/users/`),
//           safeApiCall(`${BASE_URL}/collages/colleges/`),
//           safeApiCall(`${BASE_URL}/collages/departments/`),
//           safeApiCall(`${BASE_URL}/students/`),
//           safeApiCall(`${BASE_URL}/courses/courses/`),
//         ]);

//       setUsers(usersData);
//       setColleges(collegesData);
//       setDepartments(departmentsData);

//       setCoursesList(
//         (Array.isArray(allCourses) ? allCourses : allCourses?.results || []).map((c) => ({
//           course_id: c.course_id,
//           course_name: c.course_name,
//           course_credit: c.course_credit || 3,
//           course_category: c.course_category || 'Core',
//         }))
//       );

//       const studentsWithUserInfo = (studentsData || []).map((student) => ({
//         ...student,
//         userDetails: usersData.find((u) => u.username === student.username),
//         departmentDetails: departmentsData.find((d) => d.department_id === student.department_id),
//         courseDetails: [],
//       }));

//       const studentsWithCourses = await Promise.all(
//         studentsWithUserInfo.map(async (student) => {
//           try {
//             const courses = await fetchStudentCourses(student.username);
//             return { ...student, courseDetails: courses };
//           } catch (err) {
//             console.error(`Error processing ${student.username}:`, err);
//             return student;
//           }
//         })
//       );

//       setStudents(studentsWithCourses);
//     } catch (err) {
//       if (err.response?.status !== 404) {
//         setError('Failed to fetch data. Please check your connection.');
//       }
//       console.error('Error in fetchData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Delete flow
//   const openDeleteModal = (student) => setDeletingStudent(student);
//   const closeDeleteModal = () => setDeletingStudent(null);

//   const handleConfirmDelete = async () => {
//     if (!deletingStudent) return;
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${BASE_URL}/students/${deletingStudent.username}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Student record deleted successfully');
//       setStudents((prev) => prev.filter((s) => s.username !== deletingStudent.username));
//       closeDeleteModal();
//       setTimeout(() => setMessage(''), 3000);
//     } catch (err) {
//       setError('Failed to delete student record');
//       console.error('Delete error:', err);
//       closeDeleteModal();
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // View details
//   const viewStudentDetails = (student) => {
//     setSelectedStudent(student);
//     setShowDetails(true);
//   };
//   const closeDetails = () => {
//     setShowDetails(false);
//     setSelectedStudent(null);
//   };

//   // Edit flow
//   const openEditModal = (student) => {
//     setEditingStudent(student);
//     setEditData({
//       year: student.year || '',
//       semester: student.semester || '',
//       courseIds: (student.courseDetails || []).map((c) => c.course_id),
//     });
//   };
//   const closeEditModal = () => {
//     setEditingStudent(null);
//     setEditLoading(false);
//   };

//   const handleEditField = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleCourseToggle = (courseId) => {
//     setEditData((prev) => {
//       const exists = prev.courseIds.includes(courseId);
//       return {
//         ...prev,
//         courseIds: exists
//           ? prev.courseIds.filter((id) => id !== courseId)
//           : [...prev.courseIds, courseId],
//       };
//     });
//   };

//   const handleEditSave = async () => {
//     if (!editingStudent) return;
//     setEditLoading(true);
//     try {
//       const token = localStorage.getItem('access');

//       // Update local state
//       setStudents((prev) =>
//         prev.map((student) =>
//           student.username === editingStudent.username
//             ? {
//                 ...student,
//                 year: editData.year,
//                 semester: editData.semester,
//                 courseDetails: coursesList
//                   .filter((c) => editData.courseIds.includes(c.course_id))
//                   .map((c) => ({
//                     ...c,
//                     course_taken_year: editData.year,
//                     course_taken_semester: editData.semester,
//                     registered_at: new Date().toISOString(),
//                   })),
//               }
//             : student
//         )
//       );

//       setMessage('Student updated successfully with all course details!');
//       setTimeout(() => setMessage(''), 3000);
//       closeEditModal();
//     } catch (err) {
//       const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Failed to update student.';
//       setError(errorMsg);
//       console.error('Edit error:', err.response?.data || err);
//       setTimeout(() => setError(''), 5000);
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   // College name from department
//   const getCollegeNameFromDepartment = (deptId) => {
//     const dept = departments.find((d) => d.department_id === deptId);
//     if (!dept) return 'N/A';
//     const college = colleges.find((c) => c.college_id === dept.college_id);
//     return college ? college.college_name : 'N/A';
//   };

//   // Filter students
//   const filteredStudents = useMemo(() => {
//     const term = searchTerm.trim().toLowerCase();
//     return students.filter((student) => {
//       const user = student.userDetails || {};
//       const collegeName = getCollegeNameFromDepartment(student.department_id).toLowerCase();
//       const deptName = (student.departmentDetails?.department_name || '').toLowerCase();
      
//       // Check search term
//       const matchesSearch = !term || 
//         user.username?.toLowerCase().includes(term) ||
//         user.firstName?.toLowerCase().includes(term) ||
//         user.fatherName?.toLowerCase().includes(term) ||
//         student.department_id?.toLowerCase().includes(term) ||
//         collegeName.includes(term) ||
//         deptName.includes(term);
      
//       // Check college filter
//       const matchesCollege = !selectedCollege || 
//         collegeName.includes(selectedCollege.toLowerCase());
      
//       // Check department filter
//       const matchesDepartment = !selectedDepartment || 
//         deptName.includes(selectedDepartment.toLowerCase());
      
//       return matchesSearch && matchesCollege && matchesDepartment;
//     });
//   }, [students, searchTerm, selectedCollege, selectedDepartment]);

//   // Filter courses for edit modal
//   const filteredCourses = useMemo(() => {
//     const term = courseSearchTerm.trim().toLowerCase();
//     if (!term) return coursesList;
//     return coursesList.filter((course) => 
//       course.course_name.toLowerCase().includes(term) ||
//       course.course_id.toLowerCase().includes(term)
//     );
//   }, [coursesList, courseSearchTerm]);

//   // CSV export data
//   const csvData = useMemo(() => {
//     return filteredStudents.map(student => ({
//       'Student Name': `${student.userDetails?.firstName} ${student.userDetails?.fatherName}`,
//       'Username': student.username,
//       'Email': student.userDetails?.email,
//       'College': getCollegeNameFromDepartment(student.department_id),
//       'Department': student.departmentDetails?.department_name || student.department_id,
//       'Year': student.year,
//       'Semester': student.semester,
//       'Category': student.course_category,
//       'Courses': student.courseDetails.map(c => c.course_name).join(', '),
//       'Total Credits': student.courseDetails.reduce((sum, c) => sum + (c.course_credit || 0), 0)
//     }));
//   }, [filteredStudents]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       {/* Header */}
//       <div className="text-center mb-8 pt-4">
//         <div className="flex justify-center mb-4">
//           <div className="p-3 bg-blue-600 rounded-full shadow-lg">
//             <AcademicCapIcon className="h-12 w-12 text-white" />
//           </div>
//         </div>
//         <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//           Student Management Portal
//         </h1>
//         <p className="text-gray-600 max-w-2xl mx-auto">
//           Comprehensive management system for student records, course registrations, and academic tracking
//         </p>
//       </div>

//       {/* Alerts */}
//       {message && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 shadow-md">
//           <div className="flex items-center">
//             <div className="py-1">
//               <svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div>
//               <p className="font-bold">Success!</p>
//               <p>{message}</p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-md">
//           <div className="flex items-center">
//             <div className="py-1">
//               <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             </div>
//             <div>
//               <p className="font-bold">Error</p>
//               <p>{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Search and Controls */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <h2 className="text-2xl font-semibold text-gray-800">Student Records</h2>
          
//           <div className="flex flex-col sm:flex-row gap-3">
//             <div className="relative">
//               <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search students..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-80"
//               />
//             </div>
            
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className="px-4 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 flex items-center gap-2"
//             >
//               <FunnelIcon className="h-5 w-5" />
//               Filters
//             </button>
            
//             <CSVLink
//               data={csvData}
//               filename={"students_export.csv"}
//               className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2"
//             >
//               <DocumentArrowDownIcon className="h-5 w-5" />
//               Export CSV
//             </CSVLink>
            
//             <button
//               onClick={fetchData}
//               className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Advanced Filters */}
//         {showFilters && (
//           <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Filter by College</label>
//                 <select
//                   value={selectedCollege}
//                   onChange={(e) => setSelectedCollege(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Colleges</option>
//                   {colleges.map((college) => (
//                     <option key={college.college_id} value={college.college_name}>
//                       {college.college_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Department</label>
//                 <select
//                   value={selectedDepartment}
//                   onChange={(e) => setSelectedDepartment(e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">All Departments</option>
//                   {departments.map((dept) => (
//                     <option key={dept.department_id} value={dept.department_name}>
//                       {dept.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Students Table */}
//       <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
//         {filteredStudents.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <BookOpenIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//             <p className="text-lg">No students found matching your criteria.</p>
//             <p className="text-sm mt-2">Try adjusting your search or filters.</p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-xl">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student Information
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Academic Details
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Courses & Credits
//                   </th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredStudents.map((student) => (
//                   <tr key={student.username} className="hover:bg-blue-50 transition-colors duration-200">
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-semibold text-gray-900">
//                         {student.userDetails?.firstName} {student.userDetails?.fatherName}
//                       </div>
//                       <div className="text-sm text-gray-500">{student.username}</div>
//                       <div className="text-sm text-gray-400">{student.userDetails?.email}</div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900">
//                         <span className="font-medium">College:</span>{' '}
//                         {getCollegeNameFromDepartment(student.department_id)}
//                       </div>
//                       <div className="text-sm text-gray-900">
//                         <span className="font-medium">Department:</span>{' '}
//                         {student.departmentDetails?.department_name || student.department_id}
//                       </div>
//                       <div className="text-sm text-gray-900">
//                         <span className="font-medium">Year/Semester:</span>{' '}
//                         {student.year} Year, Sem {student.semester}
//                       </div>
//                       <div className="text-sm text-gray-900">
//                         <span className="font-medium">Category:</span>{' '}
//                         <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
//                           {student.course_category}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm text-gray-900 mb-2">
//                         <span className="font-medium">Total Courses:</span>{' '}
//                         <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
//                           {student.courseDetails?.length || 0}
//                         </span>
//                       </div>
//                       <div className="text-sm text-gray-900 mb-2">
//                         <span className="font-medium">Total Credits:</span>{' '}
//                         <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                           {student.courseDetails?.reduce((sum, c) => sum + (c.course_credit || 0), 0)}
//                         </span>
//                       </div>
//                       {student.courseDetails?.slice(0, 2).map((course) => (
//                         <div key={`${student.username}-${course.course_id}`} className="text-sm text-gray-600">
//                           • {course.course_name} ({course.course_id}) - {course.course_credit} Cr.
//                         </div>
//                       ))}
//                       {student.courseDetails?.length > 2 && (
//                         <div className="text-sm text-blue-600 mt-1">
//                           +{student.courseDetails.length - 2} more courses
//                         </div>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 space-y-2">
//                       <button
//                         onClick={() => viewStudentDetails(student)}
//                         className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <MagnifyingGlassIcon className="h-4 w-4" />
//                         Details
//                       </button>
//                       <button
//                         onClick={() => openEditModal(student)}
//                         className="w-full bg-gray-100 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-200 text-sm flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <PencilIcon className="h-4 w-4" />
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => openDeleteModal(student)}
//                         className="w-full bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 text-sm flex items-center justify-center gap-2 transition-colors"
//                       >
//                         <TrashIcon className="h-4 w-4" />
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
        
//         {/* Results count */}
//         {filteredStudents.length > 0 && (
//           <div className="mt-4 text-sm text-gray-500">
//             Showing {filteredStudents.length} of {students.length} students
//           </div>
//         )}
//       </div>

//       {/* Student Details Modal */}
//       {showDetails && selectedStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-8">
//                 <h2 className="text-3xl font-bold text-gray-900">Student Details</h2>
//                 <button onClick={closeDetails} className="text-gray-400 hover:text-gray-600 text-2xl p-2 rounded-full hover:bg-gray-100">
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                 <div className="bg-blue-50 p-6 rounded-xl">
//                   <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b border-blue-200 pb-2">Personal Information</h3>
//                   <div className="space-y-3">
//                     <p>
//                       <strong className="text-blue-700">Name:</strong> {selectedStudent.userDetails?.firstName}{' '}
//                       {selectedStudent.userDetails?.fatherName}
//                     </p>
//                     <p>
//                       <strong className="text-blue-700">Username:</strong> {selectedStudent.username}
//                     </p>
//                     <p>
//                       <strong className="text-blue-700">Email:</strong> {selectedStudent.userDetails?.email}
//                     </p>
//                     <p>
//                       <strong className="text-blue-700">Phone:</strong>{' '}
//                       {selectedStudent.userDetails?.phoneNumber || 'N/A'}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="bg-green-50 p-6 rounded-xl">
//                   <h3 className="text-xl font-semibold mb-4 text-green-800 border-b border-green-200 pb-2">Academic Information</h3>
//                   <div className="space-y-3">
//                     <p>
//                       <strong className="text-green-700">College:</strong>{' '}
//                       {getCollegeNameFromDepartment(selectedStudent.department_id)}
//                     </p>
//                     <p>
//                       <strong className="text-green-700">Department:</strong>{' '}
//                       {selectedStudent.departmentDetails?.department_name ||
//                         selectedStudent.department_id}
//                     </p>
//                     <p>
//                       <strong className="text-green-700">Year:</strong> {selectedStudent.year}
//                     </p>
//                     <p>
//                       <strong className="text-green-700">Semester:</strong> {selectedStudent.semester}
//                     </p>
//                     <p>
//                       <strong className="text-green-700">Category:</strong>{' '}
//                       <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">
//                         {selectedStudent.course_category}
//                       </span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-purple-50 p-6 rounded-xl">
//                 <h3 className="text-xl font-semibold mb-4 text-purple-800 border-b border-purple-200 pb-2">
//                   Registered Courses ({selectedStudent.courseDetails?.length || 0})
//                 </h3>
                
//                 <div className="mb-4">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">Total Credits: </span>
//                     <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full">
//                       {selectedStudent.courseDetails?.reduce((sum, c) => sum + (c.course_credit || 0), 0)}
//                     </span>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {selectedStudent.courseDetails?.map((course) => (
//                     <div key={`${selectedStudent.username}-${course.course_id}`} className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm">
//                       <h4 className="font-semibold text-purple-600 text-lg">{course.course_name}</h4>
//                       <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                         <div><strong>ID:</strong> {course.course_id}</div>
//                         <div><strong>Credits:</strong> {course.course_credit}</div>
//                         <div><strong>Category:</strong> {course.course_category}</div>
//                         <div><strong>Year/Semester:</strong> {course.course_taken_year}, {course.course_taken_semester}</div>
//                       </div>
//                       {course.registered_at && (
//                         <p className="text-xs text-gray-400 mt-2">
//                           Registered: {new Date(course.registered_at).toLocaleDateString()}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 {selectedStudent.courseDetails?.length === 0 && (
//                   <p className="text-gray-500 text-center py-4">No courses registered.</p>
//                 )}
//               </div>

//               <div className="mt-8 flex justify-end">
//                 <button
//                   onClick={closeDetails}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Student Modal */}
//       {editingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="p-8">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-semibold text-gray-900">Edit Student Courses</h2>
//                 <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-600 text-xl p-2 rounded-full hover:bg-gray-100">
//                   <XMarkIcon className="h-6 w-6" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
//                   <select
//                     name="year"
//                     value={editData.year}
//                     onChange={handleEditField}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select year</option>
//                     {[1, 2, 3, 4, 5, 6].map((y) => (
//                       <option key={y} value={y}>
//                         Year {y}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
//                   <select
//                     name="semester"
//                     value={editData.semester}
//                     onChange={handleEditField}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select semester</option>
//                     {[1, 2].map((s) => (
//                       <option key={s} value={s}>
//                         Semester {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Course Search */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Search Courses</label>
//                 <div className="relative">
//                   <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search by course name or code..."
//                     value={courseSearchTerm}
//                     onChange={(e) => setCourseSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
//                   />
//                 </div>
//               </div>

//               {/* Courses selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Courses ({editData.courseIds.length} selected)
//                 </label>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-3 border rounded-xl">
//                   {filteredCourses.map((course) => {
//                     const checked = editData.courseIds.includes(course.course_id);
//                     return (
//                       <label
//                         key={course.course_id}
//                         className={`flex items-start justify-between border rounded-xl p-4 cursor-pointer transition-all ${
//                           checked ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-white hover:bg-gray-50'
//                         }`}
//                       >
//                         <div className="flex-1">
//                           <div className="font-medium text-gray-900">{course.course_name}</div>
//                           <div className="text-sm text-gray-500">Code: {course.course_id}</div>
//                           <div className="text-sm text-gray-500">Credits: {course.course_credit} • Category: {course.course_category}</div>
//                         </div>
//                         <input
//                           type="checkbox"
//                           className="h-5 w-5 text-blue-600 rounded mt-1"
//                           checked={checked}
//                           onChange={() => handleCourseToggle(course.course_id)}
//                         />
//                       </label>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-8">
//                 <button
//                   onClick={closeEditModal}
//                   disabled={editLoading}
//                   className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSave}
//                   disabled={editLoading}
//                   className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
//                 >
//                   {editLoading && (
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   )}
//                   {editLoading ? 'Saving...' : 'Save Changes'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deletingStudent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center gap-3 mb-4 text-red-600">
//                 <div className="p-2 bg-red-100 rounded-full">
//                   <TrashIcon className="h-6 w-6" />
//                 </div>
//                 <h3 className="text-xl font-semibold">Delete Student</h3>
//               </div>
//               <p className="mb-6 text-gray-600">
//                 Are you sure you want to delete student{' '}
//                 <span className="font-semibold">{deletingStudent.username}</span>? This action cannot be undone.
//               </p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={closeDeleteModal}
//                   className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleConfirmDelete}
//                   className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentManagement;




// import React, { useState, useEffect, useMemo } from "react";
// import {
//   MagnifyingGlassIcon,
//   AcademicCapIcon,
//   DocumentArrowDownIcon,
//   ArrowLeftIcon,
// } from "@heroicons/react/24/outline";
// import { CSVLink } from "react-csv";
// import axios from "axios";

// const StudentManagement = () => {
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [activeDepartment, setActiveDepartment] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [selectedSemester, setSelectedSemester] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [editingStudent, setEditingStudent] = useState(null);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [deletingStudent, setDeletingStudent] = useState(null);

//   const BASE_URL = "http://localhost:8000/api";

//   // Fetch data
//   useEffect(() => {
//     const fetchData = async () => {
//       const token = localStorage.getItem("access");
//       const [studentsData, departmentsData] = await Promise.all([
//         axios.get(`${BASE_URL}/students/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${BASE_URL}/collages/departments/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);
//       setStudents(studentsData.data.results || studentsData.data);
//       setDepartments(departmentsData.data.results || departmentsData.data);
//     };
//     fetchData();
//   }, []);

//   // Filter students by dept + year + semester + search
//   const filteredStudents = useMemo(() => {
//     if (!activeDepartment || !selectedYear || !selectedSemester) return [];

//     return students.filter((s) => {
//       const matchesDept = String(s.department_id) === String(activeDepartment.department_id);
//       const matchesYear = Number(s.year) === Number(selectedYear);
//       const matchesSem = Number(s.semester) === Number(selectedSemester);
//       if (!(matchesDept && matchesYear && matchesSem)) return false;

//       if (!searchTerm) return true;
//       const fields = [s.username, s.student_id, s.userDetails?.firstName, s.userDetails?.fatherName];
//       return fields.filter(Boolean).some((f) =>
//         f.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });
//   }, [students, activeDepartment, selectedYear, selectedSemester, searchTerm]);

//   // CSV data
//   const csvData = filteredStudents.map((s) => ({
//     ID: s.student_id,
//     Username: s.username,
//     Name: `${s.userDetails?.firstName || ""} ${s.userDetails?.fatherName || ""}`,
//     Email: s.userDetails?.email,
//     Year: s.year,
//     Semester: s.semester,
//   }));

//   // Save edit
//   const handleSave = async (student) => {
//     try {
//       const token = localStorage.getItem("access");
//       await axios.put(`${BASE_URL}/students/${student.username}/`, student, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStudents((prev) =>
//         prev.map((s) => (s.username === student.username ? student : s))
//       );
//       setEditingStudent(null);
//     } catch (err) {
//       console.error("Update failed", err);
//     }
//   };

//   // Delete student
//   const handleDelete = async (username) => {
//     try {
//       const token = localStorage.getItem("access");
//       await axios.delete(`${BASE_URL}/students/${username}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStudents((prev) => prev.filter((s) => s.username !== username));
//       setDeletingStudent(null);
//     } catch (err) {
//       console.error("Delete failed", err);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="text-center mb-8 pt-4">
//         <AcademicCapIcon className="h-12 w-12 mx-auto text-blue-600 mb-4" />
//         <h1 className="text-3xl font-bold text-gray-900">
//           Student Management Portal
//         </h1>
//       </div>

//       {/* Step 1: Department Selection */}
//       {!activeDepartment ? (
//         <div className="grid md:grid-cols-3 gap-6">
//           {departments.map((dept) => (
//             <button
//               key={dept.department_id}
//               onClick={() => setActiveDepartment(dept)}
//               className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
//             >
//               <h2 className="text-lg font-semibold text-gray-800">
//                 {dept.department_name}
//               </h2>
//               <p className="text-sm text-gray-500 mt-2">
//                 Click to choose Year & Semester
//               </p>
//             </button>
//           ))}
//         </div>
//       ) : !selectedYear || !selectedSemester ? (
//         // Step 2: Year + Semester Selection
//         <div className="bg-white rounded-2xl shadow-xl p-6 max-w-xl mx-auto">
//           <button
//             onClick={() => setActiveDepartment(null)}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
//           >
//             <ArrowLeftIcon className="h-5 w-5" /> Back to Departments
//           </button>
//           <h2 className="text-xl font-bold mb-4">
//             {activeDepartment.department_name} – Select Year & Semester
//           </h2>
//           <div className="flex gap-4">
//             <select
//               value={selectedYear || ""}
//               onChange={(e) => setSelectedYear(Number(e.target.value))}
//               className="border rounded-lg p-2"
//             >
//               <option value="">Select Year</option>
//               {[1, 2, 3, 4].map((y) => (
//                 <option key={y} value={y}>{y}</option>
//               ))}
//             </select>
//             <select
//               value={selectedSemester || ""}
//               onChange={(e) => setSelectedSemester(Number(e.target.value))}
//               className="border rounded-lg p-2"
//             >
//               <option value="">Select Semester</option>
//               {[1, 2].map((s) => (
//                 <option key={s} value={s}>{s}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       ) : (
//         // Step 3: Student Table
//         <div className="bg-white rounded-2xl shadow-xl p-6">
//           <div className="flex justify-between items-center mb-4">
//             <button
//               onClick={() => {
//                 setSelectedYear(null);
//                 setSelectedSemester(null);
//               }}
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
//             >
//               <ArrowLeftIcon className="h-5 w-5" /> Back to Year/Semester
//             </button>
//             <h2 className="text-xl font-bold">
//               {activeDepartment.department_name} – Year {selectedYear} / Sem {selectedSemester}
//             </h2>
//             <CSVLink
//               data={csvData}
//               filename={`${activeDepartment.department_name}_Y${selectedYear}_S${selectedSemester}_students.csv`}
//               className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center gap-2"
//             >
//               <DocumentArrowDownIcon className="h-5 w-5" /> Export CSV
//             </CSVLink>
//           </div>

//           {/* Search */}
//           <div className="relative mb-4">
//             <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by ID, Name, Username..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10 pr-4 py-2 border rounded-lg w-full"
//             />
//           </div>

//           {/* Table */}
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year/Semester</th>
//                   <th className="px-6 py-3"></th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredStudents.map((s) => (
//                   <React.Fragment key={s.username}>
//                     <tr>
//                       <td className="px-6 py-4">
//                         {s.userDetails?.firstName} {s.userDetails?.fatherName}
//                       </td>
//                       <td className="px-6 py-4">{s.username}</td>
//                       <td className="px-6 py-4">{s.year} / {s.semester}</td>
//                       <td className="px-6 py-4 flex gap-2">
//                         <button
//                           onClick={() => setExpandedRow(expandedRow === s.username ? null : s.username)}
//                           className="text-blue-600 hover:underline"
//                         >Details</button>
//                         <button
//                           onClick={() => setEditingStudent(s)}
//                           className="text-green-600 hover:underline"
//                         >Edit</button>
//                         <button
//                           onClick={() => setDeletingStudent(s.username)}
//                           className="text-red-600 hover:underline"
//                         >Delete</button>
//                       </td>
//                     </tr>

//                     {/* Expanded details */}
//                     {expandedRow === s.username && (
//                       <tr className="bg-gray-50">
//                         <td colSpan="4" className="px-6 py-4">
//                           <p><strong>Email:</strong> {s.userDetails?.email}</p>
//                           <p><strong>ID:</strong> {s.student_id}</p>
//                         </td>
//                       </tr>
//                     )}

//                     {/* Inline edit */}
//                     {editingStudent?.username === s.username && (
//                       <tr className="bg-yellow-50">
//                         <td colSpan="4" className="px-6 py-4">
//                           <div className="flex gap-4 items-center">
//                             <input
//                               type="number"
//                               value={editingStudent.year}
//                               onChange={(e) =>
//                                 setEditingStudent({ ...editingStudent, year: Number(e.target.value) })
//                               }
//                               className="border p-2 rounded"
//                             />
//                             <input
//                               type="number"
//                               value={editingStudent.semester}
//                               onChange={(e) =>
//                                 setEditingStudent({ ...editingStudent, semester: Number(e.target.value) })
//                               }
//                               className="border p-2 rounded"
//                             />
//                             <button
//                               onClick={() => handleSave(editingStudent)}
//                               className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                             >Save</button>
//                             <button
//                               onClick={() => setEditingStudent(null)}
//                               className="px-4 py-2 bg-gray-400 text-white rounded-lg"
//                             >Cancel</button>
//                           </div>
//                         </td>
//                       </tr>
//                     )}

//                     {/* Inline delete */}
//                     {deletingStudent === s.username && (
//                       <tr className="bg-red-50">
//                         <td colSpan="4" className="px-6 py-4 flex gap-4 items-center">
//                           <span>Are you sure you want to delete this student?</span>
//                           <button
//                             onClick={() => handleDelete(s.username)}
//                             className="px-4 py-2 bg-red-600 text-white rounded-lg"
//                           >Confirm</button>
//                           <button
//                             onClick={() => setDeletingStudent(null)}
//                             className="px-4 py-2 bg-gray-400 text-white rounded-lg"
//                           >Cancel</button>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//                 {filteredStudents.length === 0 && (
//                   <tr>
//                     <td colSpan="4" className="text-center py-6 text-gray-500">
//                       No students found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UserIcon, 
  AcademicCapIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon,
  PlusIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon
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
  const [searchTerm, setSearchTerm] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [availableYearsSemesters, setAvailableYearsSemesters] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedYearSemester, setSelectedYearSemester] = useState({year: '', semester: ''});
  const [viewMode, setViewMode] = useState('department'); // 'department', 'batch', 'yearSemester', 'students', 'registration'
  const [selectedStudentForNewSemester, setSelectedStudentForNewSemester] = useState(null);
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [availableBatches, setAvailableBatches] = useState([]);

  const BASE_URL = 'http://localhost:8000/api';

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
        return []; // Return empty array for 404 errors
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
      // If the specific endpoint doesn't exist, fall back to client-side check
      if (err.response?.status === 404) {
        console.warn('Check existing endpoint not found, falling back to client-side check');
        
        // Check if student has courses in the selected semester
        const student = students.find(s => s.username === username);
        if (student && student.semesters) {
          const semesterKey = `${year} Year ${semester} Semester`;
          return !!student.semesters[semesterKey];
        }
        return false;
      }
      
      console.error('Error checking existing registration:', err);
      // In case of error, assume it doesn't exist to avoid blocking registration
      return false;
    }
  };

  // Fetch data with proper error handling
  const fetchData = async () => {
    try {
      setError('');
      setIsRefreshing(true);

      // Fetch users
      const usersResponse = await safeApiCall(`${BASE_URL}/users/`);
      const userList = usersResponse.results || [];
      const studentUsers = userList.filter(user => user.role === 'student');
      setUsers(studentUsers);
      setFilteredUsers(studentUsers);

      // Fetch colleges
      const collegeResponse = await safeApiCall(`${BASE_URL}/collages/colleges/`);
      setColleges(collegeResponse.results || collegeResponse || []);

      // Fetch departments
      const deptResponse = await safeApiCall(`${BASE_URL}/collages/departments/`);
      setDepartments(deptResponse.results || deptResponse || []);

      // Fetch courses
      const coursesResponse = await safeApiCall(`${BASE_URL}/courses/courses/`);
      setCourses(coursesResponse.results || coursesResponse || []);

      // Fetch students
      const studentsResponse = await safeApiCall(`${BASE_URL}/students/`);
      setStudents(studentsResponse.results || studentsResponse || []);

    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch data. Please check your connection.');
      }
      console.error('Error in fetchData:', err);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
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
    
    // Get all semesters the student is registered for
    const registeredSemesters = Object.keys(student.semesters);
    
    // Find the next available semester from the department's offerings
    for (const available of availableYearsSemesters) {
      const semesterKey = `${available.year} Year ${available.semester} Semester`;
      if (!registeredSemesters.includes(semesterKey)) {
        return available;
      }
    }
    
    // If all semesters are taken, return the first available
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

    // Validation
    if (!formData.username || !formData.department_id || !formData.batch || formData.course_ids.length === 0 || !formData.year || !formData.semester) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Check if student is already registered for the same year and semester
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
      
      // Refresh students list
      fetchData();
      
      // Return to department selection view
      setViewMode('department');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle duplicate error from server
        if (err.response.status === 400 && errorData.detail && 
            errorData.detail.includes('already registered')) {
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

  const handleDelete = async (studentUsername, year, semester) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;

    try {
      const token = localStorage.getItem('access');
      await axios.delete(
        `${BASE_URL}/students/${studentUsername}/courses/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          data: {
            year,
            semester
          }
        }
      );
      
      setMessage('Student courses deleted successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to delete student courses');
      console.error('Delete error:', err);
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

  // Get college name from department
  const getCollegeNameFromDepartment = (deptId) => {
    const dept = departments.find(d => d.department_id === deptId);
    if (!dept) return 'N/A';
    
    const college = colleges.find(c => c.college_id === dept.college_id);
    return college ? college.college_name : 'N/A';
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

  // Filter students by department, batch, year, and semester
  const getFilteredStudents = () => {
    if (!selectedDepartment || !selectedBatch || !selectedYearSemester.year || !selectedYearSemester.semester) {
      return [];
    }
    
    return students.filter(student => {
      // Check if student belongs to the selected department
      if (student.department_id !== selectedDepartment) {
        return false;
      }
      
      // Check if student belongs to the selected batch
      const user = getUserDetails(student.username);
      if (!user || user.batch !== selectedBatch) {
        return false;
      }
      
      // Check if student has courses in the selected year and semester
      if (student.semesters) {
        const semesterKey = `${selectedYearSemester.year} Year ${selectedYearSemester.semester} Semester`;
        return !!student.semesters[semesterKey];
      }
      
      return false;
    });
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" /> Select Department
      </h2>
      
      {/* Department Search */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search departments by name or college..."
          value={departmentSearch}
          onChange={(e) => setDepartmentSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleDepartmentSelect(dept.department_id)}
            >
              <div className="font-medium text-gray-900">{dept.department_name}</div>
              <div className="text-sm text-gray-500">{getCollegeNameFromDepartment(dept.department_id)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Render batch selection view
  const renderBatchSelection = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('department')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Select Batch for {getDepartmentName(selectedDepartment)}
        </h2>
      </div>
      
      {availableBatches.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No available batches</p>
          <p className="text-sm mt-1">No students found with batch information</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableBatches.map((batch) => (
            <div 
              key={batch} 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleBatchSelect(batch)}
            >
              <div className="font-medium text-gray-900">Batch {batch}</div>
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('batch')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
        </button>
        <h2 className="text-xl font-semibold text-gray-800">
          Select Year and Semester for {getDepartmentName(selectedDepartment)} - Batch {selectedBatch}
        </h2>
      </div>
      
      {availableYearsSemesters.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No available years/semesters</p>
          <p className="text-sm mt-1">No courses found for this department</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableYearsSemesters.map((item, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => handleYearSemesterSelect(item.year, item.semester)}
            >
              <div className="font-medium text-gray-900">{item.year} Year</div>
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setViewMode('yearSemester')}
            className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Students in {getDepartmentName(selectedDepartment)} - Batch {selectedBatch} - {selectedYearSemester.year} Year, Semester {selectedYearSemester.semester}
          </h2>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            {filteredStudents.length} student(s) registered
          </div>
          <button
            onClick={startRegistration}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-1" /> Register New Student
          </button>
        </div>
        
        {filteredStudents.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
                    <tr key={student.username}>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => startRegistrationForStudent(student)}
                          className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" /> Register for New Semester
                        </button>
                        <button
                          onClick={() => handleDelete(student.username, selectedYearSemester.year, selectedYearSemester.semester)}
                          className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" /> Delete
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
      <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => setViewMode('students')}
              className="mr-3 text-gray-500 hover:text-gray-700 flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" /> Back
            </button>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2 text-blue-500" /> 
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
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                  {showUserDropdown && userSearch && filteredUsers.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No courses available for {formData.year} Year, Semester {formData.semester}</p>
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
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
                        <div key={courseId} className="flex items-center justify-between bg-blue-100 px-4 py-3 rounded-lg">
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
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
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
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Student Registration
        </h1>
        <p className="text-gray-600">Register and manage student academic records</p>
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

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {viewMode === 'department' && renderDepartmentSelection()}
        {viewMode === 'batch' && renderBatchSelection()}
        {viewMode === 'yearSemester' && renderYearSemesterSelection()}
        {viewMode === 'students' && renderStudentsView()}
        {viewMode === 'registration' && renderRegistrationForm()}
      </div>
    </div>
  );
};

export default StudentRegistration;