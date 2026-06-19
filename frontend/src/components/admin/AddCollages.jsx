
// // CollegeRegistration.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const CollegeRegistration = () => {
//   const [formData, setFormData] = useState({
//     college_id: '',
//     college_name: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');

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

//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
//         formData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setMessage('College registered successfully!');
//       setFormData({
//         college_id: '',
//         college_name: ''
//       });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to register college');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="px-6 py-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-extrabold text-gray-900">
//               Register New College
//             </h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Add a new college to the system
//             </p>
//           </div>

//           {message && (
//             <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//               {message}
//             </div>
//           )}

//           {error && (
//             <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="college_id" className="block text-sm font-medium text-gray-700">
//                   College ID *
//                 </label>
//                 <input
//                   id="college_id"
//                   name="college_id"
//                   type="text"
//                   required
//                   value={formData.college_id}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="e.g., COL001"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="college_name" className="block text-sm font-medium text-gray-700">
//                   College Name *
//                 </label>
//                 <input
//                   id="college_name"
//                   name="college_name"
//                   type="text"
//                   required
//                   value={formData.college_name}
//                   onChange={handleChange}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   placeholder="e.g., College of Natural Sciences"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
              
//                 disabled={loading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {loading ? (
//                   <span className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Registering...
//                   </span>
//                 ) : (
//                   'Register College'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CollegeRegistration;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BuildingLibraryIcon, 
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  BellIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

const CollegeRegistration = () => {
  const [formData, setFormData] = useState({
    college_id: '',
    college_name: '',
  });
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCollege, setDeleteCollege] = useState(null);
  const [editCollege, setEditCollege] = useState(null);
  const [editForm, setEditForm] = useState({ college_id: '', college_name: '' });

  // --- Logic ---

  const fetchColleges = async () => {
    setIsRefreshing(true);
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
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchColleges(); }, []);

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
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/collages/colleges/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage('College registered successfully!');
      setFormData({ college_id: '', college_name: '' });
      fetchColleges();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register college');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${editCollege.college_id}/`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('College updated successfully!');
      setEditCollege(null);
      fetchColleges();
    } catch (err) {
      setError('Failed to update college');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/collages/colleges/${deleteCollege.college_id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('College deleted successfully!');
      setDeleteCollege(null);
      fetchColleges();
    } catch (err) {
      setError('Failed to delete college');
    }
  };

  const filteredColleges = colleges.filter(c => 
    c.college_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.college_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Primary Header */}
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Feedback Alerts */}
        {message && (
          <div className="mb-6 bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm flex items-center">
            <CheckBadgeIcon className="h-5 w-5 text-emerald-500 mr-3" />
            <span className="text-emerald-800 text-sm font-bold">{message}</span>
          </div>
        )}
        {error && (
          <div className="mb-6 bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm">
            <span className="text-rose-800 text-sm font-bold">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Registration Form - Left Column */}
          <div className="xl:col-span-4 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-8">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <PlusIcon className="h-5 w-5 mr-2 text-indigo-600 stroke-[3px]" />
                Add New College
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College ID *</label>
                <input
                  type="text"
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  required
                  placeholder="e.g., COL001"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College Name *</label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., College of Health Sciences"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                ) : 'Register College'}
              </button>
            </form>
          </div>

          {/* College List - Right Column */}
          <div className="xl:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)]">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900">
                Registered Colleges <span className="ml-2 text-sm font-normal text-gray-400">({colleges.length})</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search ID or Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                </div>
                <button onClick={fetchColleges} className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 rounded-lg border border-gray-200">
                  <ArrowPathIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-3 scrollbar-thin">
              {filteredColleges.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50">
                  <BuildingLibraryIcon className="h-16 w-16 mb-2" />
                  <p>No colleges found</p>
                </div>
              ) : (
                filteredColleges.map((c) => (
                  <div key={c.college_id} className="group border border-gray-100 rounded-xl p-4 flex justify-between items-center hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs shadow-sm group-hover:scale-110 transition-transform uppercase">
                        {c.college_id.substring(0, 3)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{c.college_name}</p>
                        <p className="text-xs text-gray-500 font-mono tracking-widest">{c.college_id}</p>
                      </div>
                    </div>
                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditCollege(c); setEditForm(c); }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => setDeleteCollege(c)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Edit College Information</h2>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">College Name</label>
                <input
                  type="text"
                  value={editForm.college_name}
                  onChange={(e) => setEditForm({...editForm, college_name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setEditCollege(null)} className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-gray-900 font-bold rounded-xl hover:bg-indigo-400 shadow-lg shadow-indigo-100">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCollege && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-3 bg-rose-50 rounded-full w-fit mb-4">
              <TrashIcon className="h-6 w-6 text-rose-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete College</h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Are you sure you want to delete <strong>{deleteCollege.college_name}</strong>? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button onClick={() => setDeleteCollege(null)} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Keep</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeRegistration;