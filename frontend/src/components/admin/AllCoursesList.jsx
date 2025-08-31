// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaBook, FaLaptopCode, FaCogs, FaFlask } from "react-icons/fa";

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [selectedDept, setSelectedDept] = useState("All");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const token = localStorage.getItem("access");

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/courses/courses/`,
//         { 
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page_size: 100 } // Get more courses per page
//         }
//       );
      
//       // Handle both paginated and non-paginated responses
//       const data = res.data.results || res.data;
//       console.log("Courses API Response:", data);
      
//       setCourses(Array.isArray(data) ? data : []);

//       // Extract department names from nested structure
//       const departmentNames = new Set(["All"]);
//       data.forEach(course => {
//         const deptName = getDepartmentName(course);
//         if (deptName && deptName !== "N/A") {
//           departmentNames.add(deptName);
//         }
//       });
      
//       setDepartments(Array.from(departmentNames));

//       // Extract categories
//       const categoryNames = new Set(["All"]);
//       data.forEach(course => {
//         if (course.course_category) {
//           categoryNames.add(course.course_category);
//         }
//       });
      
//       setCategories(Array.from(categoryNames));
//     } catch (err) {
//       console.error("Failed to fetch courses:", err);
//       setCourses([]);
//       setDepartments(["All"]);
//       setCategories(["All"]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Helper function to get department name from course object
//   const getDepartmentName = (course) => {
//     console.log("Course department data:", course);
    
//     // Try different possible department field structures
//     if (course.department_name) return course.department_name;
//     if (course.department_details?.department_name) return course.department_details.department_name;
//     if (course.department_id?.department_name) return course.department_id.department_name;
//     if (course.department?.department_name) return course.department.department_name;
//     if (course.department) return course.department; // if it's a string
    
//     // Check for nested department in other fields
//     if (course.department_details && typeof course.department_details === 'string') {
//       return course.department_details;
//     }
//     if (course.department_id && typeof course.department_id === 'string') {
//       return course.department_id;
//     }
    
//     return "N/A";
//   };

//   // Helper function to get course name
//   const getCourseName = (course) => {
//     return course.course_name || course.course_title || "Unnamed Course";
//   };

//   // Helper function to get course code
//   const getCourseCode = (course) => {
//     return course.course_code || course.course_id || "N/A";
//   };

//   const filteredCourses = courses.filter(
//     (c) =>
//       (selectedDept === "All" || getDepartmentName(c) === selectedDept) &&
//       (selectedCategory === "All" || (c.course_category || "") === selectedCategory) &&
//       ((getCourseCode(c) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (getCourseName(c) || "").toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const sortedCourses = [...filteredCourses].sort((a, b) => {
//     for (let sort of sortConfig) {
//       const { key, direction } = sort;
      
//       let aVal, bVal;
      
//       if (key === 'course_department') {
//         aVal = getDepartmentName(a);
//         bVal = getDepartmentName(b);
//       } else if (key === 'course_title') {
//         aVal = getCourseName(a);
//         bVal = getCourseName(b);
//       } else if (key === 'course_code') {
//         aVal = getCourseCode(a);
//         bVal = getCourseCode(b);
//       } else {
//         aVal = a[key] ?? "";
//         bVal = b[key] ?? "";
//       }
      
//       if (aVal < bVal) return direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return direction === "asc" ? 1 : -1;
//     }
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
//   const paginatedCourses = sortedCourses.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const toggleSort = (key) => {
//     setSortConfig((prev) => {
//       const existing = prev.find((s) => s.key === key);
//       if (existing) {
//         const newDir = existing.direction === "asc" ? "desc" : "asc";
//         return [{ key, direction: newDir }, ...prev.filter((s) => s.key !== key)];
//       } else {
//         return [{ key, direction: "asc" }, ...prev];
//       }
//     });
//   };

//   const exportToCSV = () => {
//     const headers = [
//       "No",
//       "Code",
//       "Title",
//       "Department",
//       "Credit",
//       "Year",
//       "Semester",
//       "Category",
//       "Prerequisite",
//     ];
//     const rows = filteredCourses.map((c, idx) => [
//       idx + 1,
//       getCourseCode(c),
//       getCourseName(c),
//       getDepartmentName(c),
//       c.course_credit || "",
//       c.course_taken_year || "",
//       c.course_taken_semester || "",
//       c.course_category || "",
//       c.course_prerequisite || "-",
//     ]);
//     const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "courses.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const getDeptColor = (deptName) => {
//     const colors = {
//       'Computer Science': "bg-blue-200 text-blue-800",
//       'Electrical Engineering': "bg-green-200 text-green-800",
//       'Mechanical Engineering': "bg-red-200 text-red-800",
//       'Civil Engineering': "bg-yellow-200 text-yellow-800",
//       'CS': "bg-blue-200 text-blue-800",
//       'EE': "bg-green-200 text-green-800",
//       'ME': "bg-red-200 text-red-800",
//       'CE': "bg-yellow-200 text-yellow-800",
//       'Information Technology': "bg-purple-200 text-purple-800",
//       'IT': "bg-purple-200 text-purple-800",
//     };
//     return colors[deptName] || "bg-gray-200 text-gray-800";
//   };

//   const getCategoryIcon = (category) => {
//     switch ((category || "").toLowerCase()) {
//       case "core":
//         return <FaBook className="inline text-2xl mr-2 text-blue-500" />;
//       case "lab":
//         return <FaFlask className="inline text-2xl mr-2 text-green-500" />;
//       case "elective":
//         return <FaLaptopCode className="inline text-2xl mr-2 text-purple-500" />;
//       case "practical":
//         return <FaCogs className="inline text-2xl mr-2 text-red-500" />;
//       default:
//         return <FaBook className="inline text-2xl mr-2 text-gray-500" />;
//     }
//   };

//   const handleEdit = (course) => {
//     alert(`Edit course: ${getCourseCode(course)}`);
//   };

//   const handleDelete = async (course) => {
//     if (!window.confirm(`Are you sure you want to delete ${getCourseCode(course) || "this course"}?`)) return;
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${course.id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCourses();
//     } catch (err) {
//       console.error("Failed to delete course:", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-xl text-gray-500 animate-pulse">Loading courses...</p>
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto p-4 font-sans">
//       <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Course Dashboard</h2>

//       {/* Search & Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         <input
//           type="text"
//           placeholder="Search by code or title..."
//           className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all w-full md:w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <div className="flex gap-2 w-full md:w-auto">
//           <select
//             value={selectedDept}
//             onChange={(e) => {
//               setSelectedDept(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="px-3 py-2 rounded-lg border border-gray-300"
//           >
//             {departments.map((dept) => (
//               <option key={dept} value={dept}>
//                 {dept}
//               </option>
//             ))}
//           </select>

//           <select
//             value={selectedCategory}
//             onChange={(e) => {
//               setSelectedCategory(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="px-3 py-2 rounded-lg border border-gray-300"
//           >
//             {categories.map((cat) => (
//               <option key={cat} value={cat}>
//                 {cat}
//               </option>
//             ))}
//           </select>
//         </div>
//         <button
//           onClick={exportToCSV}
//           className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
//         >
//           Export CSV
//         </button>
//       </div>

//       {/* Debug: Show API response structure */}
//       {courses.length > 0 && (
//         <div className="mb-4 p-2 bg-yellow-100 rounded">
//           <details>
//             <summary className="cursor-pointer font-semibold">Debug: First course structure (check console for full details)</summary>
//             <pre className="text-xs overflow-auto">
//               {JSON.stringify({
//                 id: courses[0].id,
//                 course_code: courses[0].course_code,
//                 course_name: courses[0].course_name,
//                 department_data: courses[0].department_id || courses[0].department_details || courses[0].department
//               }, null, 2)}
//             </pre>
//           </details>
//         </div>
//       )}

//       {/* Table */}
//       {paginatedCourses.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">No courses found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
//             <thead className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//               <tr>
//                 <th className="px-6 py-3">No</th>
//                 {[
//                   { key: "course_code", label: "Code" },
//                   { key: "course_title", label: "Title" },
//                   { key: "course_department", label: "Department" },
//                   { key: "course_credit", label: "Credit" },
//                   { key: "course_taken_year", label: "Year" },
//                   { key: "course_taken_semester", label: "Semester" },
//                   { key: "course_category", label: "Category" },
//                   { key: "course_prerequisite", label: "Prerequisite" },
//                   { key: "actions", label: "Actions" },
//                 ].map((col) => {
//                   const sort = sortConfig.find((s) => s.key === col.key);
//                   return (
//                     <th
//                       key={col.key}
//                       className="px-6 py-3 cursor-pointer select-none"
//                       onClick={() => col.key !== "actions" && toggleSort(col.key)}
//                     >
//                       <div className="flex items-center justify-between">
//                         {col.label}
//                         {sort ? (sort.direction === "asc" ? "↑" : "↓") : ""}
//                       </div>
//                     </th>
//                   );
//                 })}
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedCourses.map((course, idx) => {
//                 const departmentName = getDepartmentName(course);
//                 return (
//                   <tr
//                     key={`${getCourseCode(course)}-${idx}`}
//                     className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
//                   >
//                     <td className="px-6 py-4 border-b border-gray-200 font-mono text-gray-700">
//                       {(currentPage - 1) * itemsPerPage + idx + 1}
//                     </td>
//                     <td className="px-6 py-4 border-b border-gray-200 font-mono text-gray-700">
//                       {getCourseCode(course)}
//                     </td>
//                     <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
//                       {getCourseName(course)}
//                     </td>
//                     <td className="px-6 py-4 border-b border-gray-200">
//                       <span
//                         className={`px-2 py-1 rounded-full text-sm font-medium ${getDeptColor(
//                           departmentName
//                         )}`}
//                       >
//                         {departmentName}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 border-b border-gray-200">{course.course_credit}</td>
//                     <td className="px-6 py-4 border-b border-gray-200">{course.course_taken_year}</td>
//                     <td className="px-6 py-4 border-b border-gray-200">{course.course_taken_semester}</td>
//                     <td className="px-6 py-4 border-b border-gray-200">
//                       {getCategoryIcon(course.course_category)}
//                       {course.course_category}
//                     </td>
//                     <td
//                       className={`px-6 py-4 border-b border-gray-200 ${
//                         !course.course_prerequisite ? "text-red-500 font-semibold" : ""
//                       }`}
//                     >
//                       {course.course_prerequisite || "None"}
//                     </td>
//                     <td className="px-6 py-4 border-b border-gray-200 space-x-4 text-lg">
//                       <button
//                         onClick={() => handleEdit(course)}
//                         className="text-blue-600 hover:text-blue-800"
//                         title="Edit"
//                       >
//                         <FaEdit size={20} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(course)}
//                         className="text-red-600 hover:text-red-800"
//                         title="Delete"
//                       >
//                         <FaTrash size={20} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-4 gap-2 flex-wrap">
//           {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
//             <button
//               key={num}
//               onClick={() => setCurrentPage(num)}
//               className={`px-3 py-1 rounded ${
//                 currentPage === num ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"
//               }`}
//             >
//               {num}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseList;






// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaBook, FaLaptopCode, FaCogs, FaFlask, FaFilter, FaSearch, FaFileExport, FaTimes } from "react-icons/fa";

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [departments, setDepartments] = useState([]);
//   const [selectedDept, setSelectedDept] = useState("All");
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [alert, setAlert] = useState({ show: false, message: "", type: "" });
//   const itemsPerPage = 10;

//   const token = localStorage.getItem("access");

//   const showAlert = (message, type = "info") => {
//     setAlert({ show: true, message, type });
//     setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
//   };

//   const fetchCourses = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/courses/courses/`,
//         { 
//           headers: { Authorization: `Bearer ${token}` },
//           params: { page_size: 100 }
//         }
//       );
      
//       const data = res.data.results || res.data;
//       setCourses(Array.isArray(data) ? data : []);

//       // Extract department names
//       const departmentNames = new Set(["All"]);
//       data.forEach(course => {
//         const deptName = getDepartmentName(course);
//         if (deptName && deptName !== "N/A") {
//           departmentNames.add(deptName);
//         }
//       });
      
//       setDepartments(Array.from(departmentNames));

//       // Extract categories
//       const categoryNames = new Set(["All"]);
//       data.forEach(course => {
//         if (course.course_category) {
//           categoryNames.add(course.course_category);
//         }
//       });
      
//       setCategories(Array.from(categoryNames));
//     } catch (err) {
//       console.error("Failed to fetch courses:", err);
//       setCourses([]);
//       setDepartments(["All"]);
//       setCategories(["All"]);
//       showAlert("Failed to load courses. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   // Helper function to get department name from course object
//   const getDepartmentName = (course) => {
//     if (course.department_name) return course.department_name;
//     if (course.department_details?.department_name) return course.department_details.department_name;
//     if (course.department_id?.department_name) return course.department_id.department_name;
//     if (course.department?.department_name) return course.department.department_name;
//     if (course.department) return course.department;
//     if (course.department_details && typeof course.department_details === 'string') {
//       return course.department_details;
//     }
//     if (course.department_id && typeof course.department_id === 'string') {
//       return course.department_id;
//     }
    
//     return "N/A";
//   };

//   // Helper function to get course name
//   const getCourseName = (course) => {
//     return course.course_name || course.course_title || "Unnamed Course";
//   };

//   // Helper function to get course code
//   const getCourseCode = (course) => {
//     return course.course_code || course.course_id || "N/A";
//   };

//   const filteredCourses = courses.filter(
//     (c) =>
//       (selectedDept === "All" || getDepartmentName(c) === selectedDept) &&
//       (selectedCategory === "All" || (c.course_category || "") === selectedCategory) &&
//       ((getCourseCode(c) || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (getCourseName(c) || "").toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   const sortedCourses = [...filteredCourses].sort((a, b) => {
//     for (let sort of sortConfig) {
//       const { key, direction } = sort;
      
//       let aVal, bVal;
      
//       if (key === 'course_department') {
//         aVal = getDepartmentName(a);
//         bVal = getDepartmentName(b);
//       } else if (key === 'course_title') {
//         aVal = getCourseName(a);
//         bVal = getCourseName(b);
//       } else if (key === 'course_code') {
//         aVal = getCourseCode(a);
//         bVal = getCourseCode(b);
//       } else {
//         aVal = a[key] ?? "";
//         bVal = b[key] ?? "";
//       }
      
//       if (aVal < bVal) return direction === "asc" ? -1 : 1;
//       if (aVal > bVal) return direction === "asc" ? 1 : -1;
//     }
//     return 0;
//   });

//   const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
//   const paginatedCourses = sortedCourses.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const toggleSort = (key) => {
//     setSortConfig((prev) => {
//       const existing = prev.find((s) => s.key === key);
//       if (existing) {
//         const newDir = existing.direction === "asc" ? "desc" : "asc";
//         return [{ key, direction: newDir }, ...prev.filter((s) => s.key !== key)];
//       } else {
//         return [{ key, direction: "asc" }, ...prev];
//       }
//     });
//   };

//   const exportToCSV = () => {
//     const headers = [
//       "No",
//       "Code",
//       "Title",
//       "Department",
//       "Credit",
//       "Year",
//       "Semester",
//       "Category",
//       "Prerequisite",
//     ];
//     const rows = filteredCourses.map((c, idx) => [
//       idx + 1,
//       getCourseCode(c),
//       getCourseName(c),
//       getDepartmentName(c),
//       c.course_credit || "",
//       c.course_taken_year || "",
//       c.course_taken_semester || "",
//       c.course_category || "",
//       c.course_prerequisite || "-",
//     ]);
//     const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "courses.csv";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     showAlert("Courses exported to CSV successfully!", "success");
//   };

//   // const getDeptColor = (deptName) => {
//   //   const colors = {
//   //     'Computer Science': "bg-blue-100 text-blue-800 border border-blue-300",
//   //     'Electrical Engineering': "bg-green-100 text-green-800 border border-green-300",
//   //     'Mechanical Engineering': "bg-red-100 text-red-800 border border-red-300",
//   //     'Civil Engineering': "bg-yellow-100 text-yellow-800 border border-yellow-300",
//   //     'CS': "bg-blue-100 text-blue-800 border border-blue-300",
//   //     'EE': "bg-green-100 text-green-800 border border-green-300",
//   //     'ME': "bg-red-100 text-red-800 border border-red-300",
//   //     'CE': "bg-yellow-100 text-yellow-800 border border-yellow-300",
//   //     'Information Technology': "bg-purple-100 text-purple-800 border border-purple-300",
//   //     'IT': "bg-purple-100 text-purple-800 border border-purple-300",
//   //   };
//   //   return colors[deptName] || "bg-gray-100 text-gray-800 border border-gray-300";
//   // };

//   const getCategoryIcon = (category) => {
//     switch ((category || "").toLowerCase()) {
//       case "core":
//         return <FaBook className="inline text-xl mr-2 text-blue-500" />;
//       case "lab":
//         return <FaFlask className="inline text-xl mr-2 text-green-500" />;
//       case "elective":
//         return <FaLaptopCode className="inline text-xl mr-2 text-purple-500" />;
//       case "practical":
//         return <FaCogs className="inline text-xl mr-2 text-red-500" />;
//       default:
//         return <FaBook className="inline text-xl mr-2 text-gray-500" />;
//     }
//   };

//   const handleEdit = (course) => {
//     showAlert(`Edit mode activated for: ${getCourseCode(course)}`, "info");
//   };

//   const handleDelete = async (course) => {
//     if (!window.confirm(`Are you sure you want to delete ${getCourseCode(course) || "this course"}?`)) return;
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${course.id}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       showAlert(`Course ${getCourseCode(course)} deleted successfully!`, "success");
//       fetchCourses();
//     } catch (err) {
//       console.error("Failed to delete course:", err);
//       showAlert("Failed to delete course. Please try again.", "error");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );

//   return (
//     <div className="max-w-7xl mx-auto  font-sans">
//       {/* Alert Notification */}
//       {alert.show && (
//         <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
//           alert.type === "error" ? "bg-red-100 border-l-4 border-red-500 text-red-700" :
//           alert.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" :
//           "bg-blue-100 border-l-4 border-blue-500 text-blue-700"
//         }`}>
//           <div className="flex justify-between items-center">
//             <p>{alert.message}</p>
//             <button onClick={() => setAlert({ show: false, message: "", type: "" })}>
//               <FaTimes className="ml-4 cursor-pointer" />
//             </button>
//           </div>
//         </div>
//       )}

//       <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//         Course Dashboard
//       </h2>

//       {/* Search & Filters */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <div className="relative w-full md:w-2/5">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by code or title..."
//               className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none transition-all w-full"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
          
//           <div className="flex gap-3 w-full md:w-2/5">
//             <div className="relative flex-1">
//               <FaFilter className="absolute left-3 top-3 text-gray-400" />
//               <select
//                 value={selectedDept}
//                 onChange={(e) => {
//                   setSelectedDept(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-full appearance-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none"
//               >
//                 {departments.map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="relative flex-1">
//               <FaFilter className="absolute left-3 top-3 text-gray-400" />
//               <select
//                 value={selectedCategory}
//                 onChange={(e) => {
//                   setSelectedCategory(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-full appearance-none focus:ring-2 focus:ring-purple-400 focus:border-transparent focus:outline-none"
//               >
//                 {categories.map((cat) => (
//                   <option key={cat} value={cat}>
//                     {cat}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <button
//             onClick={exportToCSV}
//             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow hover:shadow-lg transition-all"
//           >
//             <FaFileExport /> Export CSV
//           </button>
//         </div>
        
//         <div className="mt-4 text-sm text-gray-500">
//           Showing {filteredCourses.length} of {courses.length} courses
//         </div>
//       </div>

//       {/* Table */}
//       {paginatedCourses.length === 0 ? (
//         <div className="bg-white rounded-xl shadow-md p-8 text-center">
//           <div className="text-6xl text-gray-300 mb-4">📚</div>
//           <h3 className="text-xl font-semibold text-gray-600">No courses found</h3>
//           <p className="text-gray-500 mt-2">
//             Try adjusting your search or filter criteria
//           </p>
//         </div>
//       ) : (
//         <div className="bg-white rounded-xl shadow-md overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full">
//               <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
//                 <tr>
//                   <th className="px-6 py-4 text-left">No</th>
//                   {[
//                     { key: "course_code", label: "Code" },
//                     { key: "course_title", label: "Title" },
//                     { key: "course_department", label: "Department" },
//                     { key: "course_credit", label: "Credit" },
//                     { key: "course_taken_year", label: "Year" },
//                     { key: "course_taken_semester", label: "Semester" },
//                     { key: "course_category", label: "Category" },
//                     { key: "course_prerequisite", label: "Prerequisite" },
//                     { key: "actions", label: "Actions" },
//                   ].map((col) => {
//                     const sort = sortConfig.find((s) => s.key === col.key);
//                     return (
//                       <th
//                         key={col.key}
//                         className="px-6 py-4 text-left cursor-pointer select-none hover:bg-purple-600 transition-colors"
//                         onClick={() => col.key !== "actions" && toggleSort(col.key)}
//                       >
//                         <div className="flex items-center justify-between">
//                           {col.label}
//                           {sort && (
//                             <span className="ml-1">
//                               {sort.direction === "asc" ? "↑" : "↓"}
//                             </span>
//                           )}
//                         </div>
//                       </th>
//                     );
//                   })}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedCourses.map((course, idx) => {
//                   const departmentName = getDepartmentName(course);
//                   return (
//                     <tr
//                       key={`${getCourseCode(course)}-${idx}`}
//                       className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
//                     >
//                       <td className="px-6 py-4 font-mono text-gray-500">
//                         {(currentPage - 1) * itemsPerPage + idx + 1}
//                       </td>
//                       <td className="px-6 py-4 font-mono text-purple-600 font-semibold">
//                         {getCourseCode(course)}
//                       </td>
//                       <td className="px-6 py-4 text-gray-800 font-medium">
//                         {getCourseName(course)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className=""
//                         >
//                           {departmentName}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">{course.course_credit}</td>
//                       <td className="px-6 py-4">{course.course_taken_year}</td>
//                       <td className="px-6 py-4">{course.course_taken_semester}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center">
//                           {getCategoryIcon(course.course_category)}
//                           <span className="text-sm">{course.course_category}</span>
//                         </div>
//                       </td>
//                       <td
//                         className={`px-6 py-4 ${
//                           !course.course_prerequisite ? "text-red-400" : "text-gray-600"
//                         }`}
//                       >
//                         {course.course_prerequisite || "None"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex space-x-3">
//                           <button
//                             onClick={() => handleEdit(course)}
//                             className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded-full hover:bg-blue-50"
//                             title="Edit"
//                           >
//                             <FaEdit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(course)}
//                             className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
//                             title="Delete"
//                           >
//                             <FaTrash size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center mt-6 gap-1">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="px-3 py-2 rounded-l-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//           >
//             Previous
//           </button>
          
//           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//             let pageNum;
//             if (totalPages <= 5) {
//               pageNum = i + 1;
//             } else if (currentPage <= 3) {
//               pageNum = i + 1;
//             } else if (currentPage >= totalPages - 2) {
//               pageNum = totalPages - 4 + i;
//             } else {
//               pageNum = currentPage - 2 + i;
//             }
            
//             return (
//               <button
//                 key={pageNum}
//                 onClick={() => setCurrentPage(pageNum)}
//                 className={`px-3 py-2 border border-gray-200 ${
//                   currentPage === pageNum 
//                     ? "bg-purple-500 text-white border-purple-500" 
//                     : "bg-white text-gray-600 hover:bg-gray-50"
//                 }`}
//               >
//                 {pageNum}
//               </button>
//             );
//           })}
          
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="px-3 py-2 rounded-r-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseList;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// const CoursesTable = () => {
//   const [courses, setCourses] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [filterDept, setFilterDept] = useState('');
//   const [search, setSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');

//       const [coursesRes, deptRes] = await Promise.all([
//         axios.get('http://localhost:8000/api/courses/courses/', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         axios.get('http://localhost:8000/api/collages/departments/', {
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

//   const handleDelete = async (courseId) => {
//     if (!window.confirm('Are you sure you want to delete this course?')) return;

//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`http://localhost:8000/api/courses/courses/${courseId}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage('Course deleted successfully!');
//       setCourses((prev) => prev.filter((c) => c.course_id !== courseId));
//     } catch (err) {
//       console.error('Delete error:', err);
//       setError('Failed to delete course');
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

//   return (
//     <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h2 className="text-2xl font-semibold mb-4">All Courses</h2>

//       {/* Messages */}
//       {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{message}</div>}
//       {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

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
//             ) : filteredCourses.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
//                   No courses found.
//                 </td>
//               </tr>
//             ) : (
//               filteredCourses.map((course) => (
//                 <tr key={course.course_id}>
//                   <td className="px-4 py-2">{course.course_id}</td>
//                   <td className="px-4 py-2">{course.course_name}</td>
//                   <td className="px-4 py-2">{course.course_credit}</td>
//                   <td className="px-4 py-2">{course.course_taken_year}</td>
//                   <td className="px-4 py-2">{course.course_taken_semester}</td>
//                   <td className="px-4 py-2">{getDepartmentName(course.department_id)}</td>
//                   <td className="px-4 py-2 text-center">
//                     <button
//                       onClick={() => handleDelete(course.course_id)}
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
//     </div>
//   );
// };

// export default CoursesTable;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
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
      console.error('Error fetching courses:', err);
      setError('Failed to load data');
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
      setMessage('Course deleted successfully!');
      setCourses((prev) => prev.filter((c) => c.course_id !== deletingCourse.course_id));
    } catch (err) {
      console.error('Delete error:', err);
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
    try {
      const token = localStorage.getItem('access');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${editingCourse}/`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Course updated successfully!');
      setCourses((prev) =>
        prev.map((c) => (c.course_id === editingCourse ? editData : c))
      );
      setEditingCourse(null);
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to update course');
    }
  };

  const handleEditCancel = () => {
    setEditingCourse(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept ? dept.department_name : deptId;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesDept = filterDept ? course.department_id === filterDept : true;
    const matchesSearch =
      course.course_id.toLowerCase().includes(search.toLowerCase()) ||
      course.course_name.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Courses</h2>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter by Department:</label>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Course ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <CSVLink
            data={filteredCourses}
            filename="courses.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semester</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  Loading courses...
                </td>
              </tr>
            ) : currentCourses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              currentCourses.map((course) => (
                <tr key={course.course_id}>
                  <td className="px-4 py-2">{course.course_id}</td>
                  <td className="px-4 py-2">{course.course_name}</td>
                  <td className="px-4 py-2">{course.course_credit}</td>
                  <td className="px-4 py-2">{course.course_taken_year}</td>
                  <td className="px-4 py-2">{course.course_taken_semester}</td>
                  <td className="px-4 py-2">{getDepartmentName(course.department_id)}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline-block" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Course</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Course Name</label>
                <input
                  type="text"
                  name="course_name"
                  value={editData.course_name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Course Credit</label>
                <input
                  type="number"
                  name="course_credit"
                  value={editData.course_credit}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Year Taken</label>
                <input
                  type="number"
                  name="course_taken_year"
                  value={editData.course_taken_year}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Semester</label>
                <input
                  type="text"
                  name="course_taken_semester"
                  value={editData.course_taken_semester}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  name="department_id"
                  value={editData.department_id}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
              Confirm Delete
            </h3>
            <p className="mb-4 text-center">
              Are you sure you want to delete <strong>{deletingCourse.course_name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTable;




