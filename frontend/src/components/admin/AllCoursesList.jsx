
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrashIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
// import { CSVLink } from 'react-csv';

// const CoursesTable = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [filterDept, setFilterDept] = useState('');
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const coursesPerPage = 10;

//   // Edit modal
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editData, setEditData] = useState({});

//   // Delete confirmation modal
//   const [deletingCourse, setDeletingCourse] = useState(null);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');

//       const [coursesRes, deptRes] = await Promise.all([
//         axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setCourses(coursesRes.data.results || coursesRes.data);
//       setDepartments(deptRes.data.results || deptRes.data);
//     } catch (err) {
//       console.error('Error fetching courses:', err);
//       setError('Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async () => {
//     if (!deletingCourse) return;

//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${deletingCourse.course_id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Course deleted successfully!');
//       setCourses((prev) => prev.filter((c) => c.course_id !== deletingCourse.course_id));
//     } catch (err) {
//       console.error('Delete error:', err);
//       setError('Failed to delete course');
//     } finally {
//       setDeletingCourse(null);
//     }
//   };

//   const handleEditClick = (course) => {
//     setEditingCourse(course.course_id);
//     setEditData({ ...course });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSave = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.put(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${editingCourse}/`, editData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Course updated successfully!');
//       setCourses((prev) =>
//         prev.map((c) => (c.course_id === editingCourse ? editData : c))
//       );
//       setEditingCourse(null);
//     } catch (err) {
//       console.error('Edit error:', err);
//       setError('Failed to update course');
//     }
//   };

//   const handleEditCancel = () => {
//     setEditingCourse(null);
//   };

//   const getDepartmentName = (deptId) => {
//     const dept = departments.find((d) => d.department_id === deptId);
//     return dept ? dept.department_name : deptId;
//   };

//   const filteredCourses = courses.filter((course) => {
//     const matchesDept = filterDept ? course.department_id === filterDept : true;
//     const matchesSearch =
//       course.course_id.toLowerCase().includes(search.toLowerCase()) ||
//       course.course_name.toLowerCase().includes(search.toLowerCase());
//     return matchesDept && matchesSearch;
//   });

//   // Pagination logic
//   const indexOfLastCourse = currentPage * coursesPerPage;
//   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
//   const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">All Courses</h2>

//       {message && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//           {message}
//         </div>
//       )}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* Filters */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
//         <div className="flex items-center gap-2">
//           <label className="font-medium">Filter by Department:</label>
//           <select
//             value={filterDept}
//             onChange={(e) => setFilterDept(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Departments</option>
//             {departments.map((dept) => (
//               <option key={dept.department_id} value={dept.department_id}>
//                 {dept.department_name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="flex items-center gap-2">
//           <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
//           <input
//             type="text"
//             placeholder="Search by Course ID or Name"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <CSVLink
//             data={filteredCourses}
//             filename="courses.csv"
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//           >
//             Export CSV
//           </CSVLink>
//         </div>
//       </div>

//       {/* Courses Table */}
//       <div className="overflow-x-auto">
//         <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course ID</th>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit</th>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semester</th>
//               <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
//               <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr>
//                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
//                   Loading courses...
//                 </td>
//               </tr>
//             ) : currentCourses.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
//                   No courses found.
//                 </td>
//               </tr>
//             ) : (
//               currentCourses.map((course) => (
//                 <tr key={course.course_id}>
//                   <td className="px-4 py-2">{course.course_id}</td>
//                   <td className="px-4 py-2">{course.course_name}</td>
//                   <td className="px-4 py-2">{course.course_credit}</td>
//                   <td className="px-4 py-2">{course.course_taken_year}</td>
//                   <td className="px-4 py-2">{course.course_taken_semester}</td>
//                   <td className="px-4 py-2">{getDepartmentName(course.department_id)}</td>
//                   <td className="px-4 py-2 text-center flex justify-center gap-2">
//                     <button
//                       onClick={() => handleEditClick(course)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <PencilSquareIcon className="h-5 w-5 inline-block" />
//                     </button>
//                     <button
//                       onClick={() => setDeletingCourse(course)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <TrashIcon className="h-5 w-5 inline-block" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center mt-4 gap-2">
//           <button
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             className="px-3 py-1 border rounded-md hover:bg-gray-100"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//             className="px-3 py-1 border rounded-md hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editingCourse && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">Edit Course</h3>

//             <div className="flex flex-col gap-4">
//               <div>
//                 <label className="block mb-1 font-medium">Course Name</label>
//                 <input
//                   type="text"
//                   name="course_name"
//                   value={editData.course_name}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Course Credit</label>
//                 <input
//                   type="number"
//                   name="course_credit"
//                   value={editData.course_credit}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Year Taken</label>
//                 <input
//                   type="number"
//                   name="course_taken_year"
//                   value={editData.course_taken_year}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Semester</label>
//                 <input
//                   type="text"
//                   name="course_taken_semester"
//                   value={editData.course_taken_semester}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block mb-1 font-medium">Department</label>
//                 <select
//                   name="department_id"
//                   value={editData.department_id}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {departments.map((dept) => (
//                     <option key={dept.department_id} value={dept.department_id}>
//                       {dept.department_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <button
//                 onClick={handleEditCancel}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {deletingCourse && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//             <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
//               Confirm Delete
//             </h3>
//             <p className="mb-4 text-center">
//               Are you sure you want to delete <strong>{deletingCourse.course_name}</strong>?
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={() => setDeletingCourse(null)}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDelete}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoursesTable;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   TrashIcon, 
//   MagnifyingGlassIcon, 
//   PencilSquareIcon,
//   ArrowDownTrayIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   AcademicCapIcon,
//   XMarkIcon,
//   ExclamationTriangleIcon
// } from '@heroicons/react/24/outline';
// import { CSVLink } from 'react-csv';

// const CoursesTable = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [filterDept, setFilterDept] = useState('');
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const coursesPerPage = 10;

//   // Edit modal
//   const [editingCourse, setEditingCourse] = useState(null);
//   const [editData, setEditData] = useState({});

//   // Delete confirmation modal
//   const [deletingCourse, setDeletingCourse] = useState(null);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');

//       const [coursesRes, deptRes] = await Promise.all([
//         axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       setCourses(coursesRes.data.results || coursesRes.data);
//       setDepartments(deptRes.data.results || deptRes.data);
//     } catch (err) {
//       setError('Failed to load course data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDelete = async () => {
//     if (!deletingCourse) return;
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${deletingCourse.course_id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Course removed successfully');
//       setCourses((prev) => prev.filter((c) => c.course_id !== deletingCourse.course_id));
//       setTimeout(() => setMessage(''), 3000);
//     } catch (err) {
//       setError('Failed to delete course');
//     } finally {
//       setDeletingCourse(null);
//     }
//   };

//   const handleEditClick = (course) => {
//     setEditingCourse(course.course_id);
//     setEditData({ ...course });
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSave = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.put(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${editingCourse}/`, editData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Course updated successfully');
//       setCourses((prev) =>
//         prev.map((c) => (c.course_id === editingCourse ? editData : c))
//       );
//       setEditingCourse(null);
//       setTimeout(() => setMessage(''), 3000);
//     } catch (err) {
//       setError('Failed to update course');
//     }
//   };

//   const getDepartmentName = (deptId) => {
//     const dept = departments.find((d) => d.department_id === deptId);
//     return dept ? dept.department_name : deptId;
//   };

//   const filteredCourses = courses.filter((course) => {
//     const matchesDept = filterDept ? course.department_id === filterDept : true;
//     const matchesSearch =
//       course.course_id.toLowerCase().includes(search.toLowerCase()) ||
//       course.course_name.toLowerCase().includes(search.toLowerCase());
//     return matchesDept && matchesSearch;
//   });

//   const indexOfLastCourse = currentPage * coursesPerPage;
//   const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
//   const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
//   const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
//       <div className="max-w-7xl mx-auto">
        
//         {/* HEADER SECTION */}
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
//               <AcademicCapIcon className="h-7 w-7 text-indigo-600" />
//               Course Catalog
//             </h1>
//             <p className="text-slate-500 text-sm">Manage and review all registered academic courses.</p>
//           </div>
          
//           <CSVLink
//             data={filteredCourses}
//             filename="academic_courses.csv"
//             className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm shadow-sm hover:bg-slate-50 transition-all"
//           >
//             <ArrowDownTrayIcon className="h-4 w-4" />
//             Export Data
//           </CSVLink>
//         </div>

//         {/* ALERTS */}
//         {message && (
//           <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
//             <div className="h-2 w-2 rounded-full bg-emerald-500" />
//             <span className="text-sm font-medium">{message}</span>
//           </div>
//         )}
//         {error && (
//           <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2">
//             <div className="h-2 w-2 rounded-full bg-rose-500" />
//             <span className="text-sm font-medium">{error}</span>
//           </div>
//         )}

//         {/* FILTERS CARD */}
//         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center">
//           <div className="relative flex-1 w-full">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search by ID or Course Name..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
//             />
//           </div>

//           <div className="flex items-center gap-3 w-full lg:w-auto">
//             <select
//               value={filterDept}
//               onChange={(e) => setFilterDept(e.target.value)}
//               className="flex-1 lg:min-w-[240px] px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
//             >
//               <option value="">All Departments</option>
//               {departments.map((dept) => (
//                 <option key={dept.department_id} value={dept.department_id}>
//                   {dept.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* TABLE CARD */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course ID</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Title</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Credit</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                   Array(5).fill(0).map((_, i) => (
//                     <tr key={i} className="animate-pulse">
//                       <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
//                     </tr>
//                   ))
//                 ) : currentCourses.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
//                       No courses found matching your criteria.
//                     </td>
//                   </tr>
//                 ) : (
//                   currentCourses.map((course) => (
//                     <tr key={course.course_id} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{course.course_id}</td>
//                       <td className="px-6 py-4">
//                         <span className="font-semibold text-slate-800 block">{course.course_name}</span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
//                           {course.course_credit} HP
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-slate-600">Year {course.course_taken_year} • Sem {course.course_taken_semester}</span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-sm text-slate-600 truncate max-w-[150px] block">
//                           {getDepartmentName(course.department_id)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-2">
//                           <button
//                             onClick={() => handleEditClick(course)}
//                             className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
//                             title="Edit Course"
//                           >
//                             <PencilSquareIcon className="h-5 w-5" />
//                           </button>
//                           <button
//                             onClick={() => setDeletingCourse(course)}
//                             className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
//                             title="Delete Course"
//                           >
//                             <TrashIcon className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* PAGINATION FOOTER */}
//           {totalPages > 1 && (
//             <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//               <span className="text-sm text-slate-500 font-medium">
//                 Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
//               </span>
//               <div className="flex gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-all"
//                 >
//                   <ChevronLeftIcon className="h-4 w-4" />
//                 </button>
//                 <button
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-all"
//                 >
//                   <ChevronRightIcon className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* EDIT MODAL */}
//       {editingCourse && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
//             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
//               <h3 className="font-bold text-slate-800">Modify Course Details</h3>
//               <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600">
//                 <XMarkIcon className="h-6 w-6" />
//               </button>
//             </div>

//             <div className="p-6 grid grid-cols-2 gap-4">
//               <div className="col-span-2">
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Course Title</label>
//                 <input
//                   type="text"
//                   name="course_name"
//                   value={editData.course_name}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Credit Hours</label>
//                 <input
//                   type="number"
//                   name="course_credit"
//                   value={editData.course_credit}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
//                 <select
//                   name="department_id"
//                   value={editData.department_id}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                 >
//                   {departments.map((dept) => (
//                     <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Year</label>
//                 <input
//                   type="text"
//                   name="course_taken_year"
//                   value={editData.course_taken_year}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//               <div>
//                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Semester</label>
//                 <input
//                   type="text"
//                   name="course_taken_semester"
//                   value={editData.course_taken_semester}
//                   onChange={handleEditChange}
//                   className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
//                 />
//               </div>
//             </div>

//             <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
//               <button onClick={() => setEditingCourse(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
//               <button onClick={handleEditSave} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">Update Course</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DELETE MODAL */}
//       {deletingCourse && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
//             <div className="p-6 text-center">
//               <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <ExclamationTriangleIcon className="h-8 w-8" />
//               </div>
//               <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Course?</h3>
//               <p className="text-slate-500 text-sm mb-6">
//                 Are you sure you want to delete <span className="font-bold text-slate-800">{deletingCourse.course_name}</span>? This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button 
//                   onClick={() => setDeletingCourse(null)} 
//                   className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
//                 >
//                   No, Keep it
//                 </button>
//                 <button 
//                   onClick={handleDelete} 
//                   className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100"
//                 >
//                   Yes, Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CoursesTable;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  TrashIcon, 
  MagnifyingGlassIcon, 
  PencilSquareIcon,
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  // Edit modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [editData, setEditData] = useState({});

  // Delete confirmation modal
  const [deletingCourse, setDeletingCourse] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');

      const [coursesRes, deptRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCourses(coursesRes.data.results || coursesRes.data);
      setDepartments(deptRes.data.results || deptRes.data);
    } catch (err) {
      setError('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deletingCourse) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${deletingCourse.course_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Course removed successfully');
      setCourses((prev) => prev.filter((c) => c.course_id !== deletingCourse.course_id));
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete course');
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course.course_id);
    setEditData({ ...course });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    setError('');
    
    // Sanitize the instructor name automatically if it exists to fix formatting issues
    let cleanInstructor = null;
    if (editData.instructor) {
      // Strips anything that isn't a letter, space, or period to satisfy regex cleanly
      const sanitized = editData.instructor.toString().replace(/[^A-Za-z .]/g, '').trim();
      cleanInstructor = sanitized === '' ? null : sanitized;
    }

    try {
      const token = localStorage.getItem('access');
      
      const rawDept = editData.department_id;
      const parsedDeptId = Object.is(Number(rawDept), NaN) ? rawDept : parseInt(rawDept, 10);

      const payload = {
        course_id: editingCourse,
        course_name: editData.course_name ? editData.course_name.toString().trim() : '',
        course_credit: parseInt(editData.course_credit, 10),
        course_taken_year: editData.course_taken_year,
        course_taken_semester: editData.course_taken_semester,
        course_category: editData.course_category || 'BSc',
        department_id: parsedDeptId,
        instructor: cleanInstructor, 
        course_type: editData.course_type || 'compulsory'
      };

      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${editingCourse}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Course updated successfully');
      
      setCourses((prev) =>
        prev.map((c) => (c.course_id === editingCourse ? { ...c, ...payload } : c))
      );
      setEditingCourse(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("DRF Error details:", err.response?.data);
      const serverErr = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update course';
      setError(serverErr);
    }
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept ? dept.department_name : deptId;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesDept = filterDept ? course.department_id === filterDept : true;
    const matchesSearch =
      (course.course_id && course.course_id.toLowerCase().includes(search.toLowerCase())) ||
      (course.course_name && course.course_name.toLowerCase().includes(search.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <AcademicCapIcon className="h-7 w-7 text-indigo-600" />
              Course Catalog
            </h1>
            <p className="text-slate-500 text-sm">Manage and review all registered academic courses.</p>
          </div>
          
          <CSVLink
            data={filteredCourses}
            filename="academic_courses.csv"
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm shadow-sm hover:bg-slate-50 transition-all"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export Data
          </CSVLink>
        </div>

        {/* ALERTS */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-center gap-2 break-words">
            <div className="h-2 w-2 rounded-full bg-rose-500 flex-shrink-0" />
            <span className="text-sm font-medium font-mono">{error}</span>
          </div>
        )}

        {/* FILTERS CARD */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID or Course Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="flex-1 lg:min-w-[240px] px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.department_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Credit</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : currentCourses.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      No courses found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  currentCourses.map((course) => (
                    <tr key={course.course_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-indigo-600">{course.course_id}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800 block">{course.course_name}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                          {course.course_credit} HP
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">Year {course.course_taken_year} • Sem {course.course_taken_semester}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 truncate max-w-[150px] block">
                          {getDepartmentName(course.department_id)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                            title="Edit Course"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeletingCourse(course)}
                            className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                            title="Delete Course"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION FOOTER */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">
                Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="p-2 border border-slate-200 rounded-lg bg-white disabled:opacity-50 hover:bg-slate-50 transition-all"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800">Modify Course Details</h3>
              <button onClick={() => setEditingCourse(null)} className="text-slate-400 hover:text-slate-600">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Course Title (Letters & Spaces Only)</label>
                <input
                  type="text"
                  name="course_name"
                  value={editData.course_name || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Credit Hours</label>
                <input
                  type="number"
                  name="course_credit"
                  value={editData.course_credit || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Department</label>
                <select
                  name="department_id"
                  value={editData.department_id || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                >
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>{dept.department_name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Year</label>
                <input
                  type="text"
                  name="course_taken_year"
                  value={editData.course_taken_year || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Semester</label>
                <input
                  type="text"
                  name="course_taken_semester"
                  value={editData.course_taken_semester || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Instructor (Letters, Spaces, and Periods Only)</label>
                <input
                  type="text"
                  name="instructor"
                  value={editData.instructor || ''}
                  onChange={handleEditChange}
                  placeholder="e.g. Dr. John"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setEditingCourse(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700">Cancel</button>
              <button onClick={handleEditSave} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700">Update Course</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Course?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Are you sure you want to delete <span className="font-bold text-slate-800">{deletingCourse.course_name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingCourse(null)} 
                  className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={handleDelete} 
                  className="flex-1 px-4 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;