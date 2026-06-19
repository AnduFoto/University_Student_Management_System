

// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { CSVLink } from 'react-csv';
// import {
//   PencilIcon,
//   TrashIcon,
//   PlusIcon,
//    PencilSquareIcon,
//   MagnifyingGlassIcon,
// } from '@heroicons/react/24/outline';

// const CollegeList = () => {
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [message, setMessage] = useState('');

//   // Create form (kept from your original functionality)
//   const [showForm, setShowForm] = useState(false);
//   const [editingInline, setEditingInline] = useState(null); // for form (create/update) panel
//   const [formData, setFormData] = useState({
//     college_id: '',
//     college_name: '',
//   });

//   // Search / Pagination
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const perPage = 10;

//   // Edit Modal
//   const [editingCollege, setEditingCollege] = useState(null); // object being edited in modal
//   const [editData, setEditData] = useState({ college_id: '', college_name: '' });

//   // Delete Confirmation Modal
//   const [deletingCollege, setDeletingCollege] = useState(null); // object being deleted

//   // Fetch colleges
//   const fetchColleges = async () => {
//     try {
//       setError('');
//       setLoading(true);

//       const token = localStorage.getItem('access');
//       const response = await axios.get(
//         `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const data = response.data;
//       if (data && typeof data === 'object' && 'results' in data) {
//         setColleges(data.results || []);
//       } else if (Array.isArray(data)) {
//         setColleges(data);
//       } else {
//         setColleges([]);
//       }
//     } catch (err) {
//       setError('Failed to fetch colleges');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   // Create/Update via the side form (kept for compatibility)
//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handlePanelSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('access');

//       if (editingInline) {
//         // Update via panel
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${editingInline.college_id}/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//         );

//         setColleges((prev) =>
//           prev.map((c) => (c.college_id === editingInline.college_id ? { ...c, ...formData } : c))
//         );
//         setMessage('College updated successfully');
//       } else {
//         // Create via panel
//         const resp = await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
//           formData,
//           { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//         );
//         setColleges((prev) => [...prev, resp.data]);
//         setMessage('College created successfully');
//       }

//       setFormData({ college_id: '', college_name: '' });
//       setEditingInline(null);
//       setShowForm(false);
//       setTimeout(() => setMessage(''), 3000);
//     } catch (err) {
//       setError('Failed to save college');
//       console.error(err);
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   const handlePanelEdit = (college) => {
//     setEditingInline(college);
//     setFormData({ college_id: college.college_id, college_name: college.college_name });
//     setShowForm(true);
//   };

//   const handlePanelCancel = () => {
//     setFormData({ college_id: '', college_name: '' });
//     setEditingInline(null);
//     setShowForm(false);
//   };

//   // ====== Edit Modal handlers (inline modal like your other pages) ======
//   const openEditModal = (college) => {
//     setEditingCollege(college);
//     setEditData({ college_id: college.college_id, college_name: college.college_name });
//   };

//   const closeEditModal = () => {
//     setEditingCollege(null);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSave = async () => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${editingCollege.college_id}/`,
//         editData,
//         { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
//       );

//       setColleges((prev) =>
//         prev.map((c) => (c.college_id === editingCollege.college_id ? { ...c, ...editData } : c))
//       );
//       setMessage('College updated successfully');
//       setTimeout(() => setMessage(''), 3000);
//       closeEditModal();
//     } catch (err) {
//       setError('Failed to update college');
//       console.error(err);
//       setTimeout(() => setError(''), 3000);
//     }
//   };

//   // ====== Delete Modal handlers ======
//   const openDeleteModal = (college) => {
//     setDeletingCollege(college);
//   };

//   const closeDeleteModal = () => {
//     setDeletingCollege(null);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deletingCollege) return;
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(
//         `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${deletingCollege.college_id}/`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setColleges((prev) => prev.filter((c) => c.college_id !== deletingCollege.college_id));
//       setMessage('College deleted successfully');
//       setTimeout(() => setMessage(''), 3000);
//       closeDeleteModal();
//     } catch (err) {
//       setError('Failed to delete college');
//       console.error(err);
//       setTimeout(() => setError(''), 3000);
//       closeDeleteModal();
//     }
//   };

//   // ====== Derived data: search + pagination ======
//   const filtered = useMemo(() => {
//     if (!search.trim()) return colleges;
//     const s = search.toLowerCase();
//     return colleges.filter(
//       (c) =>
//         String(c.college_id).toLowerCase().includes(s) ||
//         String(c.college_name).toLowerCase().includes(s)
//     );
//   }, [colleges, search]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
//   const current = useMemo(() => {
//     const start = (currentPage - 1) * perPage;
//     return filtered.slice(start, start + perPage);
//   }, [filtered, currentPage]);

//   useEffect(() => {
//     // Reset to page 1 when search changes to avoid empty pages
//     setCurrentPage(1);
//   }, [search]);

//   // ====== UI ======
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header / Controls */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Colleges Management</h1>

//         <div className="flex items-center gap-2">
//           {/* Search */}
//           <div className="relative">
//             <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by ID or name"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           {/* CSV Export (filtered rows) */}
//           <CSVLink
//             data={filtered}
//             filename="colleges.csv"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Export CSV
//           </CSVLink>

//           {/* Add College via panel (kept functionality) */}
//           <button
//             onClick={() => {
//               setShowForm(true);
//               setEditingInline(null);
//               setFormData({ college_id: '', college_name: '' });
//             }}
//             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
//           >
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add College
//           </button>
//         </div>
//       </div>

//       {/* Alerts */}
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

//       {/* Create/Update Panel (kept) */}
//       {showForm && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingInline ? 'Edit College' : 'Add New College'}
//           </h2>
//           <form onSubmit={handlePanelSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 College ID *
//               </label>
//               <input
//                 type="text"
//                 name="college_id"
//                 value={formData.college_id}
//                 onChange={handleInputChange}
//                 required
//                 disabled={!!editingInline}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., COL001"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 College Name *
//               </label>
//               <input
//                 type="text"
//                 name="college_name"
//                 value={formData.college_name}
//                 onChange={handleInputChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="e.g., College of Natural Sciences"
//               />
//             </div>
//             <div className="flex space-x-3 pt-4">
//               <button
                
//                 className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
//               >
//                 {editingInline ? 'Update College' : 'Create College'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handlePanelCancel}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         {filtered.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No colleges found.</p>
//             <button
//               onClick={() => {
//                 setShowForm(true);
//                 setEditingInline(null);
//                 setFormData({ college_id: '', college_name: '' });
//               }}
//               className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
//             >
//               Add Your College
//             </button>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     College ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     College Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {current.map((college) => (
//                   <tr key={college.college_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {college.college_id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {college.college_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => openEditModal(college)}
//                           className="text-blue-600 hover:text-blue-900 p-2"
//                           title="Edit"
//                         >
//                           <PencilSquareIcon className="h-5 w-5 " />
//                         </button>
//                         <button
//                           onClick={() => openDeleteModal(college)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>

//                         {/* (Optional) keep old panel edit for parity, can use this: */}
//                         {/* <button onClick={() => handlePanelEdit(college)} className="text-gray-500 hover:text-gray-700 text-xs">Panel Edit</button> */}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {filtered.length > perPage && (
//         <div className="flex justify-center items-center gap-2 mt-4">
//           <button
//             onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//             className="px-3 py-1 border rounded-md hover:bg-gray-100"
//           >
//             Prev
//           </button>
//           <span className="text-sm">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//             className="px-3 py-1 border rounded-md hover:bg-gray-100"
//           >
//             Next
//           </button>
//         </div>
//       )}

//       {/* Stats */}
//       {colleges.length > 0 && (
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-gray-900">Total Colleges</h3>
//             <p className="text-3xl font-bold text-blue-600">{colleges.length}</p>
//           </div>
//         </div>
//       )}

//       {/* ===== Edit Modal ===== */}
//       {editingCollege && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold mb-4">Edit College</h3>

//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   College ID
//                 </label>
//                 <input
//                   type="text"
//                   name="college_id"
//                   value={editData.college_id}
//                   disabled
//                   className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
//                   readOnly
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   College Name
//                 </label>
//                 <input
//                   type="text"
//                   name="college_name"
//                   value={editData.college_name}
//                   onChange={handleEditChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="e.g., College of Natural Sciences"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <button
//                 onClick={closeEditModal}
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

//       {/* ===== Delete Confirmation Modal ===== */}
//       {deletingCollege && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
//             <h3 className="text-lg font-semibold mb-3">Delete College</h3>
//             <p className="mb-6">
//               Are you sure you want to delete{' '}
//               <span className="font-semibold">{deletingCollege.college_name}</span>?
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={closeDeleteModal}
//                 className="px-4 py-2 border rounded-md hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmDelete}
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

// export default CollegeList;





import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import {
  TrashIcon,
  PlusIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Create/Update Panel State
  const [showForm, setShowForm] = useState(false);
  const [editingInline, setEditingInline] = useState(null);
  const [formData, setFormData] = useState({
    college_id: '',
    college_name: '',
  });

  // Search / Pagination
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Modals
  const [editingCollege, setEditingCollege] = useState(null);
  const [editData, setEditData] = useState({ college_id: '', college_name: '' });
  const [deletingCollege, setDeletingCollege] = useState(null);

  const fetchColleges = async () => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('access');
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data;
      if (data && typeof data === 'object' && 'results' in data) {
        setColleges(data.results || []);
      } else if (Array.isArray(data)) {
        setColleges(data);
      } else {
        setColleges([]);
      }
    } catch (err) {
      setError('Failed to fetch colleges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Form Handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePanelSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      if (editingInline) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${editingInline.college_id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setColleges((prev) =>
          prev.map((c) => (c.college_id === editingInline.college_id ? { ...c, ...formData } : c))
        );
        setMessage('College updated successfully');
      } else {
        const resp = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setColleges((prev) => [...prev, resp.data]);
        setMessage('College created successfully');
      }
      handlePanelCancel();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save college');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePanelCancel = () => {
    setFormData({ college_id: '', college_name: '' });
    setEditingInline(null);
    setShowForm(false);
  };

  const openEditModal = (college) => {
    setEditingCollege(college);
    setEditData({ college_id: college.college_id, college_name: college.college_name });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${editingCollege.college_id}/`,
        editData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setColleges((prev) =>
        prev.map((c) => (c.college_id === editingCollege.college_id ? { ...c, ...editData } : c))
      );
      setMessage('College updated successfully');
      setEditingCollege(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to update college');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${deletingCollege.college_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setColleges((prev) => prev.filter((c) => c.college_id !== deletingCollege.college_id));
      setMessage('College deleted successfully');
      setDeletingCollege(null);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete college');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Logic
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return colleges.filter(
      (c) =>
        String(c.college_id).toLowerCase().includes(s) ||
        String(c.college_name).toLowerCase().includes(s)
    );
  }, [colleges, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <CSVLink
            data={filtered}
            filename="colleges_list.csv"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </CSVLink>
          <button
            onClick={() => { setShowForm(true); setEditingInline(null); setFormData({ college_id: '', college_name: '' }); }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add College</span>
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {message && <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg animate-fade-in">{message}</div>}
      {error && <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg animate-fade-in">{error}</div>}

      {/* Inline Form Panel */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-slide-down">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{editingInline ? 'Update College Details' : 'Register New College'}</h2>
          <form onSubmit={handlePanelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">College ID</label>
              <input
                name="college_id"
                value={formData.college_id}
                onChange={handleInputChange}
                disabled={!!editingInline}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 disabled:opacity-60 outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. CS01"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-600 ml-1">College Name</label>
              <input
                name="college_name"
                value={formData.college_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. College of Computing"
                required
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={handlePanelCancel} className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-indigo-600 text-gray-900 rounded-lg hover:bg-indigo-400 transition-all shadow-md">
                {editingInline ? 'Save Changes' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">College Name</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentItems.map((college) => (
              <tr key={college.college_id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-indigo-600 uppercase">{college.college_id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{college.college_name}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-1">
                    <button onClick={() => openEditModal(college)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Quick Edit">
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => setDeletingCollege(college)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Remove">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="py-20 text-center space-y-3">
            <div className="text-gray-300 flex justify-center"><MagnifyingGlassIcon className="h-12 w-12" /></div>
            <p className="text-gray-500">No colleges match your current search criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination & Summary */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-700">{currentItems.length}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> entries</p>
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-white disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-white disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editingCollege && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800">Edit College</h3>
              <button onClick={() => setEditingCollege(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">System ID</label>
                <div className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-mono text-sm">{editData.college_id}</div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Display Name</label>
                <input
                  type="text"
                  value={editData.college_name}
                  onChange={(e) => setEditData({ ...editData, college_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setEditingCollege(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Discard</button>
              <button onClick={handleEditSave} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md">Update College</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingCollege && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-scale-in">
            <div className="mx-auto w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <TrashIcon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Are you sure?</h3>
            <p className="text-gray-500 mb-6">You are about to delete <span className="font-semibold text-gray-800">"{deletingCollege.college_name}"</span>. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeletingCollege(null)} className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
              <button onClick={handleConfirmDelete} className="flex-1 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 shadow-lg font-medium">Delete Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeList;