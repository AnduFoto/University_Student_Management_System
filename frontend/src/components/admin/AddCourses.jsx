// import React, { useState } from "react";
// import axios from "axios";

// const ManageCourses = () => {
//   const [formData, setFormData] = useState({
//     course_code: "",
//     course_title: "",
//     course_department: "",
//     course_credit: "",
//     course_taken_year: 1,
//     course_taken_semester: "I",
//     course_category: "BSc",
//     course_prerequisite: "",
//   });

//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [loading, setLoading] = useState(false); // 🔹 loading state for button

//   const yearOptions = [
//     { label: "1st", value: 1 },
//     { label: "2nd", value: 2 },
//     { label: "3rd", value: 3 },
//     { label: "4th", value: 4 },
//     { label: "5th", value: 5 },
//     { label: "6th", value: 6 },
//     { label: "7th", value: 7 },
//   ];
//   const semesters = ["I", "II"];
//   const categories = ["BSc", "MSc", "PhD"];

//   const token = localStorage.getItem("access");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: name === "course_taken_year" ? Number(value) : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const lettersOnly = /^[A-Za-z\s]+$/;
//     if (!lettersOnly.test(formData.course_title)) {
//       setMessage({ type: "error", text: "❌ Course title must contain letters only" });
//       return;
//     }
//     if (!lettersOnly.test(formData.course_department)) {
//       setMessage({ type: "error", text: "❌ Department must contain letters only" });
//       return;
//     }

//     setLoading(true); // 🔹 show spinner
//     try {
//       const payload = {
//         ...formData,
//         course_credit: Number(formData.course_credit),
//       };

//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/courses/`, payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setMessage({ type: "success", text: "✅ Course added successfully!" });

//       setFormData({
//         course_code: "",
//         course_title: "",
//         course_department: "",
//         course_credit: "",
//         course_taken_year: 1,
//         course_taken_semester: "I",
//         course_category: "BSc",
//         course_prerequisite: "",
//       });

//       setTimeout(() => setMessage({ type: "", text: "" }), 5000);
//     } catch (err) {
//       console.error("Failed to add course:", err.response?.data || err.message);

//       if (err.response?.data) {
//         const errors = err.response.data;
//         let messages = [];
//         for (const key in errors) {
//           messages.push(
//             `${key}: ${errors[key].join ? errors[key].join(", ") : errors[key]}`
//           );
//         }
//         setMessage({ type: "error", text: "❌ " + messages.join(" | ") });
//       } else {
//         setMessage({ type: "error", text: "❌ Failed to add course: " + err.message });
//       }
//     } finally {
//       setLoading(false); // 🔹 hide spinner after request
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6 font-sans">
//       <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
//         <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
//           📚 Add Courses
//         </h2>

//         {message.text && (
//           <div
//             className={`mb-6 p-4 rounded-lg text-center font-medium ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700 border border-green-300"
//                 : "bg-red-100 text-red-700 border border-red-300"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}

//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 sm:grid-cols-2 gap-6"
//         >
//           {/* Course Code */}
//           <div className="relative">
//             <input
//               type="text"
//               name="course_code"
//               value={formData.course_code}
//               onChange={handleChange}
//               required
//               className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//               placeholder=" "
//             />
//             <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
//               Course Code
//             </label>
//           </div>

//           {/* Course Title */}
//           <div className="relative">
//             <input
//               type="text"
//               name="course_title"
//               value={formData.course_title}
//               onChange={handleChange}
//               required
//               className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//               placeholder=" "
//             />
//             <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
//               Course Title
//             </label>
//           </div>

//           {/* Department */}
//           <div className="relative">
//             <input
//               type="text"
//               name="course_department"
//               value={formData.course_department}
//               onChange={handleChange}
//               required
//               className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//               placeholder=" "
//             />
//             <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
//               Department
//             </label>
//           </div>

//           {/* Credit */}
//           <div className="relative">
//             <input
//               type="number"
//               name="course_credit"
//               value={formData.course_credit}
//               onChange={handleChange}
//               required
//               className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//               placeholder=" "
//             />
//             <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
//               Credit
//             </label>
//           </div>

//           {/* Year */}
//           <div>
//             <select
//               name="course_taken_year"
//               value={formData.course_taken_year}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//             >
//               {yearOptions.map((y) => (
//                 <option key={y.value} value={y.value}>
//                   {y.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Semester */}
//           <div>
//             <select
//               name="course_taken_semester"
//               value={formData.course_taken_semester}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//             >
//               {semesters.map((s) => (
//                 <option key={s} value={s}>
//                   {s}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Category */}
//           <div>
//             <select
//               name="course_category"
//               value={formData.course_category}
//               onChange={handleChange}
//               className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//             >
//               {categories.map((c) => (
//                 <option key={c} value={c}>
//                   {c}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Prerequisite */}
//           <div className="relative sm:col-span-2">
//             <input
//               type="text"
//               name="course_prerequisite"
//               value={formData.course_prerequisite}
//               onChange={handleChange}
//               className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
//               placeholder=" "
//             />
//             <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
//               Prerequisite (optional)
//             </label>
//           </div>

//           {/* Submit Button */}
//           <div className="sm:col-span-2 bg-orange-500 hover:bg-orange-600">
//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full flex justify-center items-center gap-2 text-white font-bold py-3 rounded-lg shadow-md transition-all ${
//                 loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     ></path>
//                   </svg>
//                   Please wait...
//                 </>
//               ) : (
//                 "➕ Add Course"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManageCourses;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  TrashIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const CourseRegistration = () => {
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    course_credit: '',
    course_taken_year: '1st',
    course_taken_semester: 'I',
    course_category: 'BSc',
    department_id: '',
    course_prerequisite:''
  });
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [filterCollege, setFilterCollege] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      setIsRefreshing(true);
      const token = localStorage.getItem('access');
      
      // Fetch departments
      const deptResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDepartments(Array.isArray(deptResponse.data) ? deptResponse.data : deptResponse.data.results || []);

      // Fetch colleges
      const collegeResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setColleges(Array.isArray(collegeResponse.data) ? collegeResponse.data : collegeResponse.data.results || []);

      // Fetch courses
      const coursesResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCourses(Array.isArray(coursesResponse.data) ? coursesResponse.data : coursesResponse.data.results || []);

    } catch (err) {
      setError('Failed to fetch data');
      console.error('Error fetching data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!formData.course_id || !formData.course_name || !formData.course_credit || !formData.department_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access');
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/courses/courses/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('Course registered successfully!');
      setFormData({
        course_id: '',
        course_name: '',
        course_credit: '',
        course_taken_year: '1st',
        course_taken_semester: 'I',
        course_category: 'BSc',
        department_id: '',
       course_prerequisite:''
      });
      
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register course');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('access');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/courses/courses/${courseId}/`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      setMessage('Course deleted successfully!');
      fetchData();
    } catch (err) {
      setError('Failed to delete course');
      console.error('Delete error:', err);
    }
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.department_id === deptId);
    return dept ? dept.department_name : deptId;
  };

  const getCollegeName = (deptId) => {
    const dept = departments.find(d => d.department_id === deptId);
    if (!dept) return deptId;
    const college = colleges.find(c => c.college_id === dept.college_id);
    return college ? college.college_name : dept.college_id;
  };

  const filteredCourses = filterCollege 
    ? courses.filter(course => {
        const dept = departments.find(d => d.department_id === course.department_id);
        return dept && dept.college_id === filterCollege;
      })
    : courses;

  // Filter courses by search term
  const searchedCourses = searchTerm 
    ? filteredCourses.filter(course => 
        course.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDepartmentName(course.department_id).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredCourses;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <BookOpenIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Course Registration
        </h1>
        <p className="text-gray-600">Register and manage academic courses</p>
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
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Registration Form - Fixed height with scroll */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2 text-blue-500" /> Register New Course
            </h2>
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Refresh data"
            >
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto pr-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course ID *
                  </label>
                  <input
                    type="text"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., CS101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Credit *
                  </label>
                  <input
                    type="number"
                    name="course_credit"
                    value={formData.course_credit}
                    onChange={handleChange}
                    required
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., Introduction to Programming"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    name="course_taken_year"
                    value={formData.course_taken_year}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Semester
                  </label>
                  <select
                    name="course_taken_semester"
                    value={formData.course_taken_semester}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="I">Semester I</option>
                    <option value="II">Semester II</option>
                  </select>
                </div>

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
                 <div className="relative sm:col-span-2">
            <input
              type="text"
              name="course_prerequisite"
              value={formData.course_prerequisite}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Prerequisite (optional)
            </label>
          </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a Department</option>
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name} ({getCollegeName(dept.department_id)})
                    </option>
                  ))}
                </select>
              </div>

      <div className='bg-orange-600'>        <button
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
                  'Register Course'
                )}
              </button></div>
            </form>
          </div>
        </div>

        {/* Courses List - Fixed height with scroll */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              Registered Courses ({searchedCourses.length})
            </h2>
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  value={filterCollege}
                  onChange={(e) => setFilterCollege(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((college) => (
                    <option key={college.college_id} value={college.college_id}>
                      {college.college_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-2">
            {searchedCourses.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No courses found</p>
                <p className="text-sm mt-1">
                  {searchTerm || filterCollege ? "Try adjusting your search or filter" : "Register a course to get started"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {searchedCourses.map((course) => {
                  const isExpanded = expandedCourse === course.course_id;
                  
                  return (
                    <div key={course.course_id} className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md">
                      <div 
                        className="p-4 bg-white cursor-pointer"
                        onClick={() => setExpandedCourse(isExpanded ? null : course.course_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {course.course_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {course.course_id}</div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                {getCollegeName(course.department_id)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {getDepartmentName(course.department_id)}
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              {isExpanded ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Credit:</span>
                              <span className="ml-2 text-gray-600">{course.course_credit}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Year:</span>
                              <span className="ml-2 text-gray-600">{course.course_taken_year}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Semester:</span>
                              <span className="ml-2 text-gray-600">{course.course_taken_semester}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Category:</span>
                              <span className="ml-2 text-gray-600">{course.course_category || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => handleDelete(course.course_id)}
                              className="flex items-center text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                            >
                              <TrashIcon className="h-4 w-4 mr-1" />
                              Delete Course
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Statistics */}
          {searchedCourses.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{searchedCourses.length}</p>
                  <p className="text-xs text-gray-500">Total Courses</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {new Set(searchedCourses.map(course => course.department_id)).size}
                  </p>
                  <p className="text-xs text-gray-500">Departments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">
                    {new Set(searchedCourses.map(course => course.course_category)).size}
                  </p>
                  <p className="text-xs text-gray-500">Categories</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;