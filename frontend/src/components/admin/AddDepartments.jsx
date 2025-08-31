// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaUniversity, FaUserCircle } from "react-icons/fa";

// const RegisterDepartment = () => {
//   const [formData, setFormData] = useState({
//     department_code: "",
//     department_name: "",
//     college: "",
//   });
//   const [colleges, setColleges] = useState([]);
//   const [loadingColleges, setLoadingColleges] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [user, setUser] = useState({ username: "Admin", profile_photo: "" });

//   // Fetch logged-in user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // Fetch colleges
//   useEffect(() => {
//     const fetchColleges = async () => {
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const data = Array.isArray(res.data) ? res.data : res.data.results || [];
//         setColleges(data);
//       } catch (err) {
//         console.error(err);
//         setColleges([]);
//       } finally {
//         setLoadingColleges(false);
//       }
//     };
//     fetchColleges();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const lettersOnly = /^[A-Za-z\s]+$/;
//     if (!lettersOnly.test(formData.department_name)) {
//       setMessage({ type: "error", text: "Department name must contain letters only" });
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       const token = localStorage.getItem("access");
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/departments/`, formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMessage({ type: "success", text: "Department registered successfully!" });
//       setFormData({ department_code: "", department_name: "", college: "" });
//     } catch (err) {
//       const errorText = err.response?.data ? JSON.stringify(err.response.data) : "Failed to register department";
//       setMessage({ type: "error", text: errorText });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
//       {/* Admin Header */}
//       <header className="mb-6 flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-600">Welcome, {user.firstName || user.username}</span>
//           {user?.picture ? (
//             <img
//               src={`http://127.0.0.1:8000${user.picture}`}
//               alt={user.username || "User"}
//               className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
//             />
//           ) : (
//             <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//           )}
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="flex justify-center items-start">
//         <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
//           <div className="flex items-center mb-6">
//             <FaUniversity className="text-blue-600 text-3xl mr-3" />
//             <h2 className="text-2xl font-semibold text-gray-800">Register Department</h2>
//           </div>

//           {message && (
//             <div
//               className={`mb-6 p-4 rounded-lg text-center ${
//                 message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//               }`}
//             >
//               {message.text}
//             </div>
//           )}

//           {loadingColleges ? (
//             <p className="text-center text-gray-500">Loading colleges...</p>
//           ) : (
//             <form onSubmit={handleSubmit} className="space-y-5">
//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">Department Code</label>
//                 <input
//                   type="text"
//                   name="department_code"
//                   value={formData.department_code}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter department code"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">Department Name</label>
//                 <input
//                   type="text"
//                   name="department_name"
//                   value={formData.department_name}
//                   onChange={handleChange}
//                   required
//                   placeholder="Enter department name (letters only)"
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//                 />
//               </div>

//               <div>
//                 <label className="block text-gray-700 font-medium mb-2">College</label>
//                 <select
//                   name="college"
//                   value={formData.college}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//                 >
//                   <option value="">Select College</option>
//                   {colleges.map((c) => (
//                     <option key={c.id || c.college_code} value={c.id || c.college_code}>
//                       {c.name || c.college_name || "Unnamed College"}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="bg-orange-600 hover:bg-orange-700 rounded-xl">
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg flex justify-center items-center space-x-2"
//                 >
//                   {loading && (
//                     <svg
//                       className="animate-spin h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v8H4z"
//                       ></path>
//                     </svg>
//                   )}
//                   <span>{loading ? "Registering..." : "Register Department"}</span>
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default RegisterDepartment;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BuildingOfficeIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

// const DepartmentRegistration = () => {
//   const [formData, setFormData] = useState({
//     department_id: '',
//     department_name: '',
//     college_id: ''
//   });
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [departments, setDepartments] = useState([]);

//   // Fetch colleges for dropdown
//   const fetchColleges = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.get('http://localhost:8000/api/collages/colleges/', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       setColleges(response.data);
//     } catch (err) {
//       setError('Failed to fetch colleges');
//       console.error('Error fetching colleges:', err);
//     }
//   };

//   // Fetch departments list
//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.get('http://localhost:8000/api/collages/departments/', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       // If departments only have college_id, we need to map to college names
//       const departmentsWithCollegeNames = response.data.map(dept => {
//         // Find the college name from the colleges list
//         const college = colleges.find(col => col.college_id === dept.college_id);
//         return {
//           ...dept,
//           college_name: college ? college.college_name : dept.college_id
//         };
//       });
      
//       setDepartments(departmentsWithCollegeNames);
//     } catch (err) {
//       console.error('Error fetching departments:', err);
//     }
//   };

//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   // Fetch departments after colleges are loaded
//   useEffect(() => {
//     if (colleges.length > 0) {
//       fetchDepartments();
//     }
//   }, [colleges]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMessage('');

//     // Validation
//     if (!formData.department_id || !formData.department_name || !formData.college_id) {
//       setError('Please fill in all required fields');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.post(
//         'http://localhost:8000/api/collages/departments/',
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setMessage('Department registered successfully!');
//       setFormData({
//         department_id: '',
//         department_name: '',
//         college_id: ''
//       });
      
//       // Refresh departments list
//       fetchDepartments();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to register department');
//       console.error('Registration error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (departmentId) => {
//     if (!window.confirm('Are you sure you want to delete this department?')) return;

//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(
//         `http://localhost:8000/api/collages/departments/${departmentId}/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
      
//       setMessage('Department deleted successfully!');
//       fetchDepartments();
//     } catch (err) {
//       setError('Failed to delete department');
//       console.error('Delete error:', err);
//     }
//   };

//   // Helper function to get college name from ID
//   const getCollegeName = (collegeId) => {
//     const college = colleges.find(col => col.college_id === collegeId);
//     return college ? college.college_name : collegeId;
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="flex justify-center mb-4">
//           <AcademicCapIcon className="h-12 w-12 text-blue-600" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Department Registration</h1>
//         <p className="text-gray-600">Register and manage academic departments</p>
//       </div>

//       {/* Alert Messages */}
//       {message && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Registration Form */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Register New Department</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department ID *
//               </label>
//               <input
//                 type="text"
//                 name="department_id"
//                 value={formData.department_id}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., DEPT001"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department Name *
//               </label>
//               <input
//                 type="text"
//                 name="department_name"
//                 value={formData.department_name}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="e.g., Computer Science"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 College *
//               </label>
//               <select
//                 name="college_id"
//                 value={formData.college_id}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select a College</option>
//                 {colleges.map((college) => (
//                   <option key={college.college_id} value={college.college_id}>
//                     {college.college_name} ({college.college_id})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Registering...
//                 </span>
//               ) : (
//                 'Register Department'
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Departments List */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Registered Departments</h2>
          
//           {departments.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//               <p>No departments registered yet.</p>
//             </div>
//           ) : (
//             <div className="overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         ID
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         College
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {departments.map((dept) => (
//                       <tr key={dept.department_id} className="hover:bg-gray-50">
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {dept.department_id}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-900">
//                           {dept.department_name}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-900">
//                           {/* Display college name instead of ID */}
//                           {dept.college_name || getCollegeName(dept.college_id)}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm">
//                           <button
//                             onClick={() => handleDelete(dept.department_id)}
//                             className="text-red-600 hover:text-red-900"
//                             title="Delete Department"
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}

//           {/* Statistics */}
//           {departments.length > 0 && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-2xl font-bold text-blue-600">{departments.length}</p>
//                   <p className="text-xs text-gray-500">Total Departments</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold text-green-600">
//                     {new Set(departments.map(dept => dept.college_id)).size}
//                   </p>
//                   <p className="text-xs text-gray-500">Colleges with Departments</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* College Quick Reference */}
//       {colleges.length > 0 && (
//         <div className="mt-8 bg-blue-50 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-blue-900 mb-4">Available Colleges</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//             {colleges.map((college) => (
//               <div key={college.college_id} className="bg-white rounded-lg p-3 shadow-sm">
//                 <p className="text-sm font-medium text-gray-900">{college.college_name}</p>
//                 <p className="text-xs text-gray-500">ID: {college.college_id}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DepartmentRegistration;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BuildingOfficeIcon, 
  AcademicCapIcon, 
  TrashIcon, 
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';

const DepartmentRegistration = () => {
  const [formData, setFormData] = useState({
    department_id: '',
    department_name: '',
    college_id: ''
  });
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDept, setDeleteDept] = useState(null);
  const [editDept, setEditDept] = useState(null);
  const [editForm, setEditForm] = useState({ department_id: '', department_name: '', college_id: '' });

  // Fetch colleges
  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (Array.isArray(response.data)) {
        setColleges(response.data);
      } else if (response.data.results) {
        setColleges(response.data.results);
      } else {
        setColleges([]);
      }
    } catch (err) {
      setError('Failed to fetch colleges');
      console.error("Error fetching colleges:", err);
      setColleges([]);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let data = response.data;
      if (!Array.isArray(data) && data.results) {
        data = data.results;
      }

      const mapped = data.map((dept) => {
        const college = colleges.find((c) => c.college_id === dept.college_id);
        return {
          ...dept,
          college_name: college ? college.college_name : dept.college_id
        };
      });

      setDepartments(mapped);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    await fetchColleges();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (colleges.length > 0) {
      fetchDepartments();
    }
  }, [colleges]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (!formData.department_id || !formData.department_name || !formData.college_id) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Department registered successfully!');
      setFormData({ department_id: '', department_name: '', college_id: '' });
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register department');
      console.error("Error registering department:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (dept) => {
    setDeleteDept(dept);
  };

  const handleDelete = async () => {
    if (!deleteDept) return;

    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/${deleteDept.department_id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Department deleted successfully!');
      setDeleteDept(null);
      fetchDepartments();
    } catch (err) {
      setError('Failed to delete department');
      console.error("Error deleting department:", err);
    }
  };

  const openEdit = (dept) => {
    setEditDept(dept);
    setEditForm({
      department_id: dept.department_id,
      department_name: dept.department_name,
      college_id: dept.college_id
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/${editDept.department_id}/`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Department updated successfully!');
      setEditDept(null);
      fetchDepartments();
    } catch (err) {
      setError('Failed to update department');
      console.error("Error updating department:", err);
    }
  };

  const filteredDepartments = searchTerm 
    ? departments.filter(dept => 
        dept.department_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.college_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : departments;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <AcademicCapIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Department Registration
        </h1>
        <p className="text-gray-600">Register and manage academic departments</p>
      </div>

      {/* Alerts */}
      {message && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">{message}</div>
      )}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">{error}</div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <PlusIcon className="h-5 w-5 mr-2 text-blue-500" /> Register New Department
            </h2>
            <button onClick={fetchData} disabled={isRefreshing} className="p-2 text-gray-500 hover:text-blue-600">
              <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department ID *</label>
              <input type="text" name="department_id" value={formData.department_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
              <input type="text" name="department_name" value={formData.department_name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College *</label>
              <select name="college_id" value={formData.college_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">
                <option value="">Select a College</option>
                {colleges.map((c) => (
                  <option key={c.college_id} value={c.college_id}>{c.college_name} ({c.college_id})</option>
                ))}
              </select>
            </div>
            <div className='bg-orange-500 hover:bg-orange-600 rounded-md'>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">
              {loading ? 'Registering...' : 'Register Department'}
            </button>
            </div>
            
          </form>
        </div>

        {/* Department List */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
          <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
              Registered Departments ({filteredDepartments.length})
            </h2>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {filteredDepartments.length === 0 ? (
              <div className="text-center text-gray-500">No departments found</div>
            ) : (
              <div className="space-y-4">
                {filteredDepartments.map((dept) => (
                  <div key={dept.department_id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{dept.department_name}</div>
                      <div className="text-sm text-gray-500">ID: {dept.department_id} | {dept.college_name}</div>
                    </div>
                    <div className="flex space-x-3">
                      <button onClick={() => openEdit(dept)} className="text-blue-600 hover:text-blue-800">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => confirmDelete(dept)} className="text-red-600 hover:text-red-800">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDept && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete the department <strong>{deleteDept.department_name}</strong>?</p>
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={() => setDeleteDept(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDept && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Department</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department ID *</label>
                <input type="text" name="department_id" value={editForm.department_id} onChange={handleEditChange} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
                <input type="text" name="department_name" value={editForm.department_name} onChange={handleEditChange} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College *</label>
                <select name="college_id" value={editForm.college_id} onChange={handleEditChange} required className="w-full px-4 py-2 border rounded-lg">
                  {colleges.map((c) => (
                    <option key={c.college_id} value={c.college_id}>{c.college_name} ({c.college_id})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3 ">
                <button  onClick={() => setEditDept(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentRegistration;