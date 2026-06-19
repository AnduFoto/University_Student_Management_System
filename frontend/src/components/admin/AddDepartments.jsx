

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   BuildingOfficeIcon, 
//   AcademicCapIcon, 
//   TrashIcon, 
//   PlusIcon,
//   ArrowPathIcon,
//   MagnifyingGlassIcon,
//   PencilSquareIcon
// } from '@heroicons/react/24/outline';

// const DepartmentRegistration = () => {
//   const [formData, setFormData] = useState({
//     department_id: '',
//     department_name: '',
//     college_id: ''
//   });
//   const [colleges, setColleges] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [deleteDept, setDeleteDept] = useState(null);
//   const [editDept, setEditDept] = useState(null);
//   const [editForm, setEditForm] = useState({ department_id: '', department_name: '', college_id: '' });

//   // Fetch colleges
//   const fetchColleges = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (Array.isArray(response.data)) {
//         setColleges(response.data);
//       } else if (response.data.results) {
//         setColleges(response.data.results);
//       } else {
//         setColleges([]);
//       }
//     } catch (err) {
//       setError('Failed to fetch colleges');
//       console.error("Error fetching colleges:", err);
//       setColleges([]);
//     }
//   };

//   // Fetch departments
//   const fetchDepartments = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       let data = response.data;
//       if (!Array.isArray(data) && data.results) {
//         data = data.results;
//       }

//       const mapped = data.map((dept) => {
//         const college = colleges.find((c) => c.college_id === dept.college_id);
//         return {
//           ...dept,
//           college_name: college ? college.college_name : dept.college_id
//         };
//       });

//       setDepartments(mapped);
//     } catch (err) {
//       console.error("Error fetching departments:", err);
//       setDepartments([]);
//     }
//   };

//   const fetchData = async () => {
//     setIsRefreshing(true);
//     await fetchColleges();
//     setIsRefreshing(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (colleges.length > 0) {
//       fetchDepartments();
//     }
//   }, [colleges]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setMessage('');

//     if (!formData.department_id || !formData.department_name || !formData.college_id) {
//       setError('Please fill in all required fields');
//       setLoading(false);
//       return;
//     }

//     try {
//       const token = localStorage.getItem('access');
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       setMessage('Department registered successfully!');
//       setFormData({ department_id: '', department_name: '', college_id: '' });
//       fetchDepartments();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to register department');
//       console.error("Error registering department:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (dept) => {
//     setDeleteDept(dept);
//   };

//   const handleDelete = async () => {
//     if (!deleteDept) return;

//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/${deleteDept.department_id}/`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage('Department deleted successfully!');
//       setDeleteDept(null);
//       fetchDepartments();
//     } catch (err) {
//       setError('Failed to delete department');
//       console.error("Error deleting department:", err);
//     }
//   };

//   const openEdit = (dept) => {
//     setEditDept(dept);
//     setEditForm({
//       department_id: dept.department_id,
//       department_name: dept.department_name,
//       college_id: dept.college_id
//     });
//   };

//   const handleEditChange = (e) => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('access');
//       await axios.put(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/${editDept.department_id}/`, editForm, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage('Department updated successfully!');
//       setEditDept(null);
//       fetchDepartments();
//     } catch (err) {
//       setError('Failed to update department');
//       console.error("Error updating department:", err);
//     }
//   };

//   const filteredDepartments = searchTerm 
//     ? departments.filter(dept => 
//         dept.department_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         dept.college_name.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : departments;

//   return (
//     <div className="max-w-7xl mx-auto p-4 lg:p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="flex justify-center mb-4">
//           <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
//             <AcademicCapIcon className="h-10 w-10 text-white" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           Department Registration
//         </h1>
//         <p className="text-gray-600">Register and manage academic departments</p>
//       </div>

//       {/* Alerts */}
//       {message && (
//         <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">{message}</div>
//       )}
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">{error}</div>
//       )}

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//         {/* Registration Form */}
//         <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 flex items-center">
//               <PlusIcon className="h-5 w-5 mr-2 text-blue-500" /> Register New Department
//             </h2>
//             <button onClick={fetchData} disabled={isRefreshing} className="p-2 text-gray-500 hover:text-blue-600">
//               <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department ID *</label>
//               <input type="text" name="department_id" value={formData.department_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
//               <input type="text" name="department_name" value={formData.department_name} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg" />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">College *</label>
//               <select name="college_id" value={formData.college_id} onChange={handleChange} required className="w-full px-4 py-3 border rounded-lg">
//                 <option value="">Select a College</option>
//                 {colleges.map((c) => (
//                   <option key={c.college_id} value={c.college_id}>{c.college_name} ({c.college_id})</option>
//                 ))}
//               </select>
//             </div>
//             <div className='bg-orange-500 hover:bg-orange-600 rounded-md'>
//               <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg">
//               {loading ? 'Registering...' : 'Register Department'}
//             </button>
//             </div>
            
//           </form>
//         </div>

//         {/* Department List */}
//         <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-180px)] flex flex-col">
//           <div className="flex flex-col sm:flex-row sm:justify-between mb-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-0">
//               Registered Departments ({filteredDepartments.length})
//             </h2>
//             <div className="relative">
//               <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 border rounded-lg" />
//             </div>
//           </div>

//           <div className="flex-grow overflow-y-auto">
//             {filteredDepartments.length === 0 ? (
//               <div className="text-center text-gray-500">No departments found</div>
//             ) : (
//               <div className="space-y-4">
//                 {filteredDepartments.map((dept) => (
//                   <div key={dept.department_id} className="border rounded-lg p-4 flex justify-between items-center">
//                     <div>
//                       <div className="font-medium text-gray-900">{dept.department_name}</div>
//                       <div className="text-sm text-gray-500">ID: {dept.department_id} | {dept.college_name}</div>
//                     </div>
//                     <div className="flex space-x-3">
//                       <button onClick={() => openEdit(dept)} className="text-blue-600 hover:text-blue-800">
//                         <PencilSquareIcon className="h-5 w-5" />
//                       </button>
//                       <button onClick={() => confirmDelete(dept)} className="text-red-600 hover:text-red-800">
//                         <TrashIcon className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteDept && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
//             <p>Are you sure you want to delete the department <strong>{deleteDept.department_name}</strong>?</p>
//             <div className="mt-4 flex justify-end space-x-3">
//               <button onClick={() => setDeleteDept(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//               <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editDept && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-lg font-semibold mb-4">Edit Department</h2>
//             <form onSubmit={handleEditSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department ID *</label>
//                 <input type="text" name="department_id" value={editForm.department_id} onChange={handleEditChange} disabled className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Department Name *</label>
//                 <input type="text" name="department_name" value={editForm.department_name} onChange={handleEditChange} required className="w-full px-4 py-2 border rounded-lg" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">College *</label>
//                 <select name="college_id" value={editForm.college_id} onChange={handleEditChange} required className="w-full px-4 py-2 border rounded-lg">
//                   {colleges.map((c) => (
//                     <option key={c.college_id} value={c.college_id}>{c.college_name} ({c.college_id})</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex justify-end space-x-3 ">
//                 <button  onClick={() => setEditDept(null)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
//                 <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
//               </div>
//             </form>
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
  PencilSquareIcon,
  BellIcon
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

  // --- Core Functionality (Restored) ---

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (Array.isArray(response.data)) setColleges(response.data);
      else if (response.data.results) setColleges(response.data.results);
      else setColleges([]);
    } catch (err) {
      setError('Failed to fetch colleges');
      setColleges([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      let data = response.data;
      if (!Array.isArray(data) && data.results) data = data.results;

      const mapped = data.map((dept) => {
        const college = colleges.find((c) => c.college_id === dept.college_id);
        return {
          ...dept,
          college_name: college ? college.college_name : dept.college_id
        };
      });
      setDepartments(mapped);
    } catch (err) {
      setDepartments([]);
    }
  };

  const fetchData = async () => {
    setIsRefreshing(true);
    await fetchColleges();
    setIsRefreshing(false);
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { if (colleges.length > 0) fetchDepartments(); }, [colleges]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const token = localStorage.getItem('access');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      setMessage('Department registered successfully!');
      setFormData({ department_id: '', department_name: '', college_id: '' });
      fetchDepartments();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register department');
    } finally {
      setLoading(false);
    }
  };

  // --- Edit/Delete Logic (Explicitly Restored) ---

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
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Header */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Alerts */}
        {message && (
          <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg mb-6 shadow-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-rose-100 border-l-4 border-rose-500 text-rose-800 p-4 rounded-r-lg mb-6 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Registration Form */}
          <div className="xl:col-span-5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800 flex items-center">
                <PlusIcon className="h-5 w-5 mr-2 text-gray-900-600 stroke-[3px]" />
                Register Department
              </h2>
              <button onClick={fetchData} className="text-gray-400 hover:text-indigo-600 transition-colors">
                <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Department ID *</label>
                <input type="text" name="department_id" value={formData.department_id} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Department Name *</label>
                <input type="text" name="department_name" value={formData.department_name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">College *</label>
                <select name="college_id" value={formData.college_id} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select a College</option>
                  {colleges.map((c) => (
                    <option key={c.college_id} value={c.college_id}>{c.college_name} ({c.college_id})</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg transition-all active:scale-[0.98]">
                {loading ? 'Processing...' : 'Register Department'}
              </button>
            </form>
          </div>

          {/* Department List */}
          <div className="xl:col-span-7 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[750px]">
            <div className="p-6 border-b border-gray-100 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-800">Departments ({filteredDepartments.length})</h2>
              <div className="relative">
                <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none" />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {filteredDepartments.map((dept) => (
                <div key={dept.department_id} className="group border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:bg-indigo-50 transition-all">
                  <div>
                    <div className="font-bold text-gray-900">{dept.department_name}</div>
                    <div className="text-xs text-gray-500">ID: {dept.department_id} | {dept.college_name}</div>
                  </div>
                  <div className="flex space-x-2">
                    <button onClick={() => openEdit(dept)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => confirmDelete(dept)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals (Restored Functionality) */}
      {deleteDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
            <h2 className="text-lg font-bold mb-2">Delete Department</h2>
            <p className="text-gray-600 text-sm mb-6">Are you sure you want to delete <strong>{deleteDept.department_name}</strong>?</p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteDept(null)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {editDept && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Edit Department</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID (Fixed)</label>
                <input type="text" value={editForm.department_id} disabled className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department Name</label>
                <input type="text" name="department_name" value={editForm.department_name} onChange={handleEditChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">College</label>
                <select name="college_id" value={editForm.college_id} onChange={handleEditChange} required className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm outline-none">
                  {colleges.map((c) => (
                    <option key={c.college_id} value={c.college_id}>{c.college_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setEditDept(null)} className="flex-1 px-4 py-2 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-gray-900 rounded-xl font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentRegistration;