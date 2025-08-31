// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FaUniversity, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

// const CollegeList = () => {
//   const [colleges, setColleges] = useState([]);
//   const [filteredColleges, setFilteredColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [sortAsc, setSortAsc] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const collegesPerPage = 6;

//   // Fetch colleges from API
//   const fetchColleges = async () => {
//     try {
//       const token = localStorage.getItem("access");
//       const res = await axios.get("http://127.0.0.1:8000/api/collages/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = Array.isArray(res.data) ? res.data : res.data.results || [];
//       setColleges(data);
//       setFilteredColleges(data);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load colleges.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   // Search filter
//   useEffect(() => {
//     const filtered = colleges.filter((college) =>
//       college.name.toLowerCase().includes(search.toLowerCase()) ||
//       college.college_code.toLowerCase().includes(search.toLowerCase())
//     );
//     setFilteredColleges(filtered);
//     setCurrentPage(1);
//   }, [search, colleges]);

//   // Sorting
//   const handleSort = () => {
//     const sorted = [...filteredColleges].sort((a, b) => {
//       if (sortAsc) return a.name.localeCompare(b.name);
//       else return b.name.localeCompare(a.name);
//     });
//     setFilteredColleges(sorted);
//     setSortAsc(!sortAsc);
//   };

//   // Pagination
//   const indexOfLast = currentPage * collegesPerPage;
//   const indexOfFirst = indexOfLast - collegesPerPage;
//   const currentColleges = filteredColleges.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Gradient Header */}
//         <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg text-white text-center">
//           <h1 className="text-3xl font-bold">All Colleges</h1>
//           <p className="mt-2 text-lg">Explore all colleges in your database</p>
//         </div>

//         {/* Search and Sort */}
//         <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
//           <input
//             type="text"
//             placeholder="Search by name or code..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//           />
//           <button
//             onClick={handleSort}
//             className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg"
//           >
//             {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
//             <span>Sort by Name</span>
//           </button>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
//             {error}
//           </div>
//         )}

//         {/* Loading */}
//         {loading ? (
//           <div className="text-center text-gray-500">Loading colleges...</div>
//         ) : filteredColleges.length === 0 ? (
//           <div className="text-center text-gray-500">No colleges found.</div>
//         ) : (
//           <>
//             {/* Colleges Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {currentColleges.map((college) => (
//                 <div
//                   key={college.id || college.college_code}
//                   className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
//                 >
//                   <div className="flex items-center mb-4">
//                     <FaUniversity className="text-blue-500 text-2xl mr-3" />
//                     <h2 className="text-xl font-semibold text-gray-800">{college.name}</h2>
//                   </div>
//                   <p className="text-gray-600 mb-2">
//                     <span className="font-medium">Code:</span> {college.college_code}
//                   </p>
//                   <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                     College
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex justify-center mt-8 space-x-2">
//                 {Array.from({ length: totalPages }, (_, i) => (
//                   <button
//                     key={i + 1}
//                     onClick={() => setCurrentPage(i + 1)}
//                     className={`px-4 py-2 rounded-lg ${
//                       currentPage === i + 1
//                         ? "bg-blue-600 text-white"
//                         : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
//                     } transition duration-200`}
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

// export default CollegeList;





// CollegeList.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

// const CollegeList = () => {
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingCollege, setEditingCollege] = useState(null);
//   const [formData, setFormData] = useState({
//     college_id: '',
//     college_name: ''
//   });

//   // Fetch colleges from API
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
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchColleges();
//   }, []);

//   // Handle form input changes
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('access');
      
//       if (editingCollege) {
//         // Update existing college
//         await axios.put(
//           `http://localhost:8000/api/collages/colleges/${editingCollege.college_id}/`,
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       } else {
//         // Create new college
//         await axios.post(
//           'http://localhost:8000/api/collages/colleges/',
//           formData,
//           {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );
//       }

//       // Reset form and refresh data
//       setFormData({ college_id: '', college_name: '' });
//       setEditingCollege(null);
//       setShowForm(false);
//       fetchColleges();
//     } catch (err) {
//       setError('Failed to save college');
//       console.error('Error saving college:', err);
//     }
//   };

//   // Edit college
//   const handleEdit = (college) => {
//     setEditingCollege(college);
//     setFormData({
//       college_id: college.college_id,
//       college_name: college.college_name
//     });
//     setShowForm(true);
//   };

//   // Delete college
//   const handleDelete = async (collegeId) => {
//     if (!window.confirm('Are you sure you want to delete this college?')) return;

//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(
//         `http://localhost:8000/api/collages/colleges/${collegeId}/`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );
//       fetchColleges();
//     } catch (err) {
//       setError('Failed to delete college');
//       console.error('Error deleting college:', err);
//     }
//   };

//   // Cancel form
//   const handleCancel = () => {
//     setFormData({ college_id: '', college_name: '' });
//     setEditingCollege(null);
//     setShowForm(false);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Colleges Management</h1>
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
//         >
//           <PlusIcon className="h-5 w-5 mr-2" />
//           Add College
//         </button>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       {/* College Form */}
//       {showForm && (
//         <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//           <h2 className="text-xl font-semibold mb-4">
//             {editingCollege ? 'Edit College' : 'Add New College'}
//           </h2>
//           <form onSubmit={handleSubmit} className="space-y-4">
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
//                 disabled={!!editingCollege}
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
//                 type="submit"
//                 className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//               >
//                 {editingCollege ? 'Update College' : 'Create College'}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleCancel}
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Colleges List */}
//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         {colleges.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">No colleges found.</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Add Your First College
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
//                 {colleges.map((college) => (
//                   <tr key={college.college_id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {college.college_id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {college.college_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleEdit(college)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Edit"
//                         >
//                           <PencilIcon className="h-5 w-5" />
//                         </button>
//                         <button
//                           onClick={() => handleDelete(college.college_id)}
//                           className="text-red-600 hover:text-red-900"
//                           title="Delete"
//                         >
//                           <TrashIcon className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Statistics */}
//       {colleges.length > 0 && (
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-semibold text-gray-900">Total Colleges</h3>
//             <p className="text-3xl font-bold text-blue-600">{colleges.length}</p>
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
  PencilIcon,
  TrashIcon,
  PlusIcon,
   PencilSquareIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Create form (kept from your original functionality)
  const [showForm, setShowForm] = useState(false);
  const [editingInline, setEditingInline] = useState(null); // for form (create/update) panel
  const [formData, setFormData] = useState({
    college_id: '',
    college_name: '',
  });

  // Search / Pagination
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Edit Modal
  const [editingCollege, setEditingCollege] = useState(null); // object being edited in modal
  const [editData, setEditData] = useState({ college_id: '', college_name: '' });

  // Delete Confirmation Modal
  const [deletingCollege, setDeletingCollege] = useState(null); // object being deleted

  // Fetch colleges
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Create/Update via the side form (kept for compatibility)
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePanelSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');

      if (editingInline) {
        // Update via panel
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
        // Create via panel
        const resp = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setColleges((prev) => [...prev, resp.data]);
        setMessage('College created successfully');
      }

      setFormData({ college_id: '', college_name: '' });
      setEditingInline(null);
      setShowForm(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to save college');
      console.error(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handlePanelEdit = (college) => {
    setEditingInline(college);
    setFormData({ college_id: college.college_id, college_name: college.college_name });
    setShowForm(true);
  };

  const handlePanelCancel = () => {
    setFormData({ college_id: '', college_name: '' });
    setEditingInline(null);
    setShowForm(false);
  };

  // ====== Edit Modal handlers (inline modal like your other pages) ======
  const openEditModal = (college) => {
    setEditingCollege(college);
    setEditData({ college_id: college.college_id, college_name: college.college_name });
  };

  const closeEditModal = () => {
    setEditingCollege(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
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
      setTimeout(() => setMessage(''), 3000);
      closeEditModal();
    } catch (err) {
      setError('Failed to update college');
      console.error(err);
      setTimeout(() => setError(''), 3000);
    }
  };

  // ====== Delete Modal handlers ======
  const openDeleteModal = (college) => {
    setDeletingCollege(college);
  };

  const closeDeleteModal = () => {
    setDeletingCollege(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCollege) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${deletingCollege.college_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setColleges((prev) => prev.filter((c) => c.college_id !== deletingCollege.college_id));
      setMessage('College deleted successfully');
      setTimeout(() => setMessage(''), 3000);
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete college');
      console.error(err);
      setTimeout(() => setError(''), 3000);
      closeDeleteModal();
    }
  };

  // ====== Derived data: search + pagination ======
  const filtered = useMemo(() => {
    if (!search.trim()) return colleges;
    const s = search.toLowerCase();
    return colleges.filter(
      (c) =>
        String(c.college_id).toLowerCase().includes(s) ||
        String(c.college_name).toLowerCase().includes(s)
    );
  }, [colleges, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, currentPage]);

  useEffect(() => {
    // Reset to page 1 when search changes to avoid empty pages
    setCurrentPage(1);
  }, [search]);

  // ====== UI ======
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Colleges Management</h1>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CSV Export (filtered rows) */}
          <CSVLink
            data={filtered}
            filename="colleges.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>

          {/* Add College via panel (kept functionality) */}
          <button
            onClick={() => {
              setShowForm(true);
              setEditingInline(null);
              setFormData({ college_id: '', college_name: '' });
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add College
          </button>
        </div>
      </div>

      {/* Alerts */}
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

      {/* Create/Update Panel (kept) */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingInline ? 'Edit College' : 'Add New College'}
          </h2>
          <form onSubmit={handlePanelSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College ID *
              </label>
              <input
                type="text"
                name="college_id"
                value={formData.college_id}
                onChange={handleInputChange}
                required
                disabled={!!editingInline}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., COL001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Name *
              </label>
              <input
                type="text"
                name="college_name"
                value={formData.college_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., College of Natural Sciences"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <button
                
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
              >
                {editingInline ? 'Update College' : 'Create College'}
              </button>
              <button
                type="button"
                onClick={handlePanelCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No colleges found.</p>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingInline(null);
                setFormData({ college_id: '', college_name: '' });
              }}
              className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Add Your College
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {current.map((college) => (
                  <tr key={college.college_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {college.college_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {college.college_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(college)}
                          className="text-blue-600 hover:text-blue-900 p-2"
                          title="Edit"
                        >
                          <PencilSquareIcon className="h-5 w-5 " />
                        </button>
                        <button
                          onClick={() => openDeleteModal(college)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>

                        {/* (Optional) keep old panel edit for parity, can use this: */}
                        {/* <button onClick={() => handlePanelEdit(college)} className="text-gray-500 hover:text-gray-700 text-xs">Panel Edit</button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > perPage && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Prev
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Stats */}
      {colleges.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Colleges</h3>
            <p className="text-3xl font-bold text-blue-600">{colleges.length}</p>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {editingCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit College</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College ID
                </label>
                <input
                  type="text"
                  name="college_id"
                  value={editData.college_id}
                  disabled
                  className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-600"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={editData.college_name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., College of Natural Sciences"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeEditModal}
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

      {/* ===== Delete Confirmation Modal ===== */}
      {deletingCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-3">Delete College</h3>
            <p className="mb-6">
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deletingCollege.college_name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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

export default CollegeList;


