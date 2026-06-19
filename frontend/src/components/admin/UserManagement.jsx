
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   UserIcon,
//   PencilIcon,
//   TrashIcon,
//   PlusIcon,
//   MagnifyingGlassIcon,
//   ArrowPathIcon,
//   EyeIcon,
//   FunnelIcon,
//   XMarkIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon
// } from '@heroicons/react/24/outline';

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
//   const [filters, setFilters] = useState({
//     role: '',
//     gender: '',
//     category: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(8);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

//   // Auto-hide messages after 5 seconds
//   useEffect(() => {
//     if (message || error) {
//       const timer = setTimeout(() => {
//         setMessage('');
//         setError('');
//       }, 5000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [message, error]);

//   // Filter users based on search and filters
//   useEffect(() => {
//     let result = users;

//     // Apply search filter
//     if (searchTerm) {
//       result = result.filter(user =>
//         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Apply role filter
//     if (filters.role) {
//       result = result.filter(user => user.role === filters.role);
//     }

//     // Apply gender filter
//     if (filters.gender) {
//       result = result.filter(user => user.gender === filters.gender);
//     }

//     // Apply category filter
//     if (filters.category) {
//       result = result.filter(user => user.catagory === filters.category);
//     }

//     setFilteredUsers(result);
//     setCurrentPage(1); // Reset to first page when filters change
//   }, [users, searchTerm, filters]);

//   // Fetch users from API
//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       const usersData = response.data.results || response.data || [];
//       setUsers(usersData);
//       setFilteredUsers(usersData);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setError('Failed to fetch users. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Handle user deletion
//   const handleDelete = async (username) => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${username}/`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });
      
//       setMessage('User deleted successfully!');
//       setDeleteModal({ isOpen: false, user: null });
//       fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error('Error deleting user:', err);
//       setError('Failed to delete user. Please check your connection.');
//     }
//   };

//   // Debug function to see what data is being sent
//   const debugUpdate = async (userData) => {
//     try {
//       const token = localStorage.getItem('access');
      
//       // Prepare the data in the format expected by the Django API
//       const updateData = {
//         firstName: userData.firstName || '',
//         fatherName: userData.fatherName || '',
//         grandFatherName: userData.grandFatherName || '',
//         motherName: userData.motherName || '',
//         phoneNumber: userData.phoneNumber || '',
//         gender: userData.gender || 'Male',
//         role: userData.role || 'student',
//         catagory: userData.catagory || '',
//         is_active: userData.is_active !== undefined ? userData.is_active : true,
//         userId: userData.userId || '',
//         username: userData.username || '',
//         handicap: userData.handicap || 'normal',
//         religion: userData.religion || '',
//         region: userData.region || '',
//         zone_or_special_wereda: userData.zone_or_special_wereda || '',
//         city_or_town: userData.city_or_town || '',
//         house_number: userData.house_number || '',
//         batch: userData.batch || '',
//         entrance_exam: userData.entrance_exam || '',
//         mothersFatherName: userData.mothersFatherName || '',
//         nationality: userData.nationality || '',
//         dob: userData.dob || null,
//         position: userData.position || ''
//       };

//       console.log('Sending data:', updateData);

//       const response = await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/users/${userData.username}/`, 
//         updateData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       console.log('Server response:', response.data);
//       return response;
//     } catch (err) {
//       console.error('Debug error:', err);
//       console.error('Error response:', err.response?.data);
//       throw err;
//     }
//   };

//   // Handle user update
//   const handleUpdate = async (userData) => {
//     setIsUpdating(true);
//     try {
//       // Use the debug function to see what's happening
//       const response = await debugUpdate(userData);
      
//       setMessage('User updated successfully!');
//       setViewMode('list');
//       fetchUsers(); // Refresh the list
//     } catch (err) {
//       console.error('Error updating user:', err);
      
//       // More detailed error handling
//       if (err.response?.data) {
//         const errorData = err.response.data;
//         if (typeof errorData === 'object') {
//           // Handle field validation errors
//           const errorMessages = Object.entries(errorData)
//             .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
//             .join('; ');
//           setError(`Update failed: ${errorMessages}`);
//         } else if (typeof errorData === 'string') {
//           setError(`Update failed: ${errorData}`);
//         } else {
//           setError('Failed to update user. Please check the data and try again.');
//         }
//       } else {
//         setError('Failed to update user. Please check your connection.');
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // View user details
//   const viewUser = (user) => {
//     setSelectedUser(user);
//     setViewMode('view');
//   };

//   // Edit user
//   const editUser = (user) => {
//     setSelectedUser(user);
//     setViewMode('edit');
//   };

//   // Reset filters
//   const resetFilters = () => {
//     setFilters({
//       role: '',
//       gender: '',
//       category: ''
//     });
//     setSearchTerm('');
//   };

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   // Delete Confirmation Modal
//   const DeleteConfirmationModal = () => {
//     if (!deleteModal.isOpen) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//         <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-95 animate-in fade-in-90 zoom-in-90">
//           <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
//             <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
//           </div>
          
//           <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h3>
//           <p className="text-gray-600 text-center mb-6">
//             Are you sure you want to delete <span className="font-semibold">{deleteModal.user?.firstName} {deleteModal.user?.fatherName}</span>? This action cannot be undone.
//           </p>
          
//           <div className="flex space-x-4">
//             <button
//               onClick={() => setDeleteModal({ isOpen: false, user: null })}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => handleDelete(deleteModal.user.username)}
//               className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md hover:shadow-lg"
//             >
//               Delete User
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render user list view
//   const renderUserList = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
//           <p className="text-gray-500 mt-1">{filteredUsers.length} users found</p>
//         </div>
//         <div className="flex space-x-3 mt-4 sm:mt-0">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className={`px-4 py-2 rounded-xl flex items-center transition-all ${
//               showFilters 
//                 ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <FunnelIcon className="h-5 w-5 mr-2" />
//             Filters
//           </button>
//           <button
//             onClick={fetchUsers}
//             className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center transition-all shadow-sm hover:shadow-md"
//           >
//             <ArrowPathIcon className="h-5 w-5 mr-2" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* Search and Filters */}
//       <div className="mb-6">
//         <div className="relative mb-4">
//           <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search users by name, username, or ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all bg-gray-50"
//           />
//         </div>

//         {showFilters && (
//           <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl mb-4 border border-gray-200 shadow-sm">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
//                 <select
//                   value={filters.role}
//                   onChange={(e) => setFilters({...filters, role: e.target.value})}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
//                 >
//                   <option value="">All Roles</option>
//                   <option value="student">Student</option>
//                   <option value="teacher">Teacher</option>
//                   <option value="registeral">Registeral</option>
//                   <option value="department">Department Head</option>
//                   <option value="collage">College Head</option>
//                   <option value="president">President</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                 <select
//                   value={filters.gender}
//                   onChange={(e) => setFilters({...filters, gender: e.target.value})}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
//                 >
//                   <option value="">All Genders</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//                 <select
//                   value={filters.category}
//                   onChange={(e) => setFilters({...filters, category: e.target.value})}
//                   className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
//                 >
//                   <option value="">All Categories</option>
//                   <option value="Natural Science">Natural Science</option>
//                   <option value="Social Science">Social Science</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
//             <button
//               onClick={resetFilters}
//               className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors font-medium"
//             >
//               <XMarkIcon className="h-4 w-4 mr-1" />
//               Clear all filters
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Users Table */}
//       {loading ? (
//         <div className="text-center py-12">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       ) : filteredUsers.length === 0 ? (
//         <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
//           <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//           <p className="text-lg font-medium text-gray-600">No users found</p>
//           <p className="text-sm mt-1">
//             {searchTerm || filters.role || filters.gender || filters.category 
//               ? "Try adjusting your search or filters" 
//               : "No users available in the system"}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentUsers.map((user) => (
//                   <tr key={user.username} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-12 w-12">
//                           {user.picture ? (
//                             <img className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" src={user.picture} alt={user.firstName} />
//                           ) : (
//                             <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-white shadow-sm">
//                               <UserIcon className="h-6 w-6 text-blue-600" />
//                             </div>
//                           )}
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-semibold text-gray-900">
//                             {user.firstName} {user.fatherName}
//                           </div>
//                           <div className="text-sm text-gray-500">{user.username}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">{user.userId}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {user.gender}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
//                         user.is_active 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {user.is_active ? 'Active' : 'Inactive'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => viewUser(user)}
//                           className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50 flex items-center"
//                           title="View details"
//                         >
//                           <EyeIcon className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => editUser(user)}
//                           className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-50 flex items-center"
//                           title="Edit user"
//                         >
//                           <PencilIcon className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => setDeleteModal({ isOpen: true, user })}
//                           className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center"
//                           title="Delete user"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
          
//           {/* Pagination */}
//           {totalPages > 1 && (
//             <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 space-y-4 sm:space-y-0">
//               <div className="text-sm text-gray-600">
//                 Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
//                 <span className="font-medium">
//                   {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
//                 </span> of{' '}
//                 <span className="font-medium">{filteredUsers.length}</span> results
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => paginate(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-sm"
//                 >
//                   <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
//                 </button>
//                 <div className="flex space-x-1">
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                     <button
//                       key={number}
//                       onClick={() => paginate(number)}
//                       className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
//                         currentPage === number
//                           ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
//                           : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
//                       }`}
//                     >
//                       {number}
//                     </button>
//                   ))}
//                 </div>
//                 <button
//                   onClick={() => paginate(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-sm"
//                 >
//                   Next <ChevronRightIcon className="h-4 w-4 ml-1" />
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );

//   // Render user detail view
//   const renderUserView = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center mb-6">
//         <button 
//           onClick={() => setViewMode('list')}
//           className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors p-2 rounded-lg hover:bg-gray-100"
//         >
//           <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back to List
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
//       </div>

//       {selectedUser && (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="md:col-span-1">
//             <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl text-center border border-gray-200 shadow-sm">
//               {selectedUser.picture ? (
//                 <img className="h-32 w-32 rounded-full mx-auto object-cover mb-4 border-4 border-white shadow-md" src={selectedUser.picture} alt={selectedUser.firstName} />
//               ) : (
//                 <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
//                   <UserIcon className="h-16 w-16 text-blue-600" />
//                 </div>
//               )}
//               <h3 className="text-xl font-bold text-gray-900">
//                 {selectedUser.firstName} {selectedUser.fatherName}
//               </h3>
//               <p className="text-gray-500">{selectedUser.username}</p>
//               <p className="text-sm text-gray-500 mt-1 font-mono">{selectedUser.userId}</p>
              
//               <div className="mt-4">
//                 <span className={`px-3 py-1.5 inline-flex text-sm leading-4 font-semibold rounded-full ${
//                   selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }`}>
//                   {selectedUser.is_active ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
              
//               <button
//                 onClick={() => editUser(selectedUser)}
//                 className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
//               >
//                 <PencilIcon className="h-4 w-4 mr-2" /> Edit User
//               </button>
//             </div>
//           </div>
          
//           <div className="md:col-span-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <h4 className="font-semibold text-gray-700 mb-3 text-lg">Personal Information</h4>
//                 <dl className="space-y-3">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Full Name</dt>
//                     <dd className="text-sm text-gray-900 font-medium">{selectedUser.firstName} {selectedUser.fatherName} {selectedUser.grandFatherName}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.motherName || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.dob || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Gender</dt>
//                     <dd className="text-sm text-gray-900 capitalize">{selectedUser.gender}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.phoneNumber || 'N/A'}</dd>
//                   </div>
//                 </dl>
//               </div>
              
//               <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
//                 <h4 className="font-semibold text-gray-700 mb-3 text-lg">Account Information</h4>
//                 <dl className="space-y-3">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Role</dt>
//                     <dd className="text-sm text-gray-900 capitalize">{selectedUser.role}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Category</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.catagory || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Batch</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.batch || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Entrance Exam</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.entrance_exam || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Password Status</dt>
//                     <dd className="text-sm text-gray-900">
//                       {selectedUser.is_using_default_password ? 'Using Default Password' : 'Custom Password'}
//                     </dd>
//                   </div>
//                 </dl>
//               </div>
              
//               <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
//                 <h4 className="font-semibold text-gray-700 mb-3 text-lg">Address Information</h4>
//                 <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Region</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.region || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Zone/Wereda</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.zone_or_special_wereda || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">City/Town</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.city_or_town || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">House Number</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.house_number || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Religion</dt>
//                     <dd className="text-sm text-gray-900">{selectedUser.religion || 'N/A'}</dd>
//                   </div>
//                   <div>
//                     <dt className="text-sm font-medium text-gray-500">Handicap</dt>
//                     <dd className="text-sm text-gray-900 capitalize">{selectedUser.handicap || 'N/A'}</dd>
//                   </div>
//                 </dl>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   // Render user edit form
//   const renderUserEdit = () => (
//     <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//       <div className="flex items-center mb-6">
//         <button 
//           onClick={() => setViewMode('list')}
//           className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors p-2 rounded-lg hover:bg-gray-100"
//         >
//           <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back to List
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
//       </div>

//       {selectedUser && (
//         <form onSubmit={(e) => {
//           e.preventDefault();
//           handleUpdate(selectedUser);
//         }} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
//               <input
//                 type="text"
//                 value={selectedUser.firstName || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
//               <input
//                 type="text"
//                 value={selectedUser.fatherName || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, fatherName: e.target.value})}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Grandfather's Name</label>
//               <input
//                 type="text"
//                 value={selectedUser.grandFatherName || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, grandFatherName: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
//               <input
//                 type="text"
//                 value={selectedUser.motherName || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, motherName: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
//               <input
//                 type="tel"
//                 value={selectedUser.phoneNumber || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, phoneNumber: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
//               <select
//                 value={selectedUser.gender || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, gender: e.target.value})}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               >
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
//               <select
//                 value={selectedUser.role || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
//                 required
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               >
//                 <option value="student">Student</option>
//                 <option value="teacher">Teacher</option>
//                 <option value="registeral">Registeral</option>
//                 <option value="department">Department Head</option>
//                 <option value="collage">College Head</option>
//                 <option value="president">President</option>
//                 <option value="admin">Admin</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//               <select
//                 value={selectedUser.catagory || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, catagory: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               >
//                 <option value="">Select Category</option>
//                 <option value="Natural Science">Natural Science</option>
//                 <option value="Social Science">Social Science</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
//               <select
//                 value={selectedUser.is_active ? 'true' : 'false'}
//                 onChange={(e) => setSelectedUser({...selectedUser, is_active: e.target.value === 'true'})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               >
//                 <option value="true">Active</option>
//                 <option value="false">Inactive</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
//               <input
//                 type="text"
//                 value={selectedUser.region || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, region: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Zone/Wereda</label>
//               <input
//                 type="text"
//                 value={selectedUser.zone_or_special_wereda || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, zone_or_special_wereda: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
//               <input
//                 type="text"
//                 value={selectedUser.city_or_town || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, city_or_town: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">House Number</label>
//               <input
//                 type="text"
//                 value={selectedUser.house_number || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, house_number: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
//               <input
//                 type="text"
//                 value={selectedUser.religion || ''}
//                 onChange={(e) => setSelectedUser({...selectedUser, religion: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Handicap</label>
//               <select
//                 value={selectedUser.handicap || 'normal'}
//                 onChange={(e) => setSelectedUser({...selectedUser, handicap: e.target.value})}
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
//               >
//                 <option value="normal">Normal</option>
//                 <option value="case">Case</option>
//               </select>
//             </div>
//           </div>
          
//           <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={() => setViewMode('list')}
//               className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//             <button
             
//               disabled={isUpdating}
//               className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all font-medium shadow-md hover:shadow-lg flex items-center"
//             >
//               {isUpdating ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                   Updating...
//                 </>
//               ) : (
//                 'Update User'
//               )}
//             </button>
//           </div>
//         </form>
//       )}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="flex justify-center mb-4">
//           <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
//             <UserIcon className="h-10 w-10 text-white" />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           User Management
//         </h1>
//         <p className="text-gray-600">View and manage all system users</p>
//       </div>

//       {/* Alert Messages */}
//       {message && (
//         <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center">
//           <CheckCircleIcon className="h-5 w-5 mr-2" />
//           <p className="font-medium">{message}</p>
//         </div>
//       )}

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center">
//           <XCircleIcon className="h-5 w-5 mr-2" />
//           <p className="font-medium">{error}</p>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="grid grid-cols-1 gap-8">
//         {viewMode === 'list' && renderUserList()}
//         {viewMode === 'view' && renderUserView()}
//         {viewMode === 'edit' && renderUserEdit()}
//       </div>

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal />
//     </div>
//   );
// };

// export default UsersManagement;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   UserIcon,
//   PencilIcon,
//   TrashIcon,
//   PlusIcon,
//   MagnifyingGlassIcon,
//   ArrowPathIcon,
//   EyeIcon,
//   FunnelIcon,
//   XMarkIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ExclamationTriangleIcon,
//   CheckCircleIcon,
//   XCircleIcon,
//   PhoneIcon,
//   MapPinIcon,
//   AcademicCapIcon,
//   IdentificationIcon
// } from '@heroicons/react/24/outline';

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
//   const [filters, setFilters] = useState({
//     role: '',
//     gender: '',
//     category: ''
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(8);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

//   // Auto-hide messages
//   useEffect(() => {
//     if (message || error) {
//       const timer = setTimeout(() => {
//         setMessage('');
//         setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message, error]);

//   // Filter Logic
//   useEffect(() => {
//     let result = users;
//     if (searchTerm) {
//       result = result.filter(user =>
//         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (filters.role) result = result.filter(user => user.role === filters.role);
//     if (filters.gender) result = result.filter(user => user.gender === filters.gender);
//     if (filters.category) result = result.filter(user => user.catagory === filters.category);

//     setFilteredUsers(result);
//     setCurrentPage(1);
//   }, [users, searchTerm, filters]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const usersData = response.data.results || response.data || [];
//       setUsers(usersData);
//       setFilteredUsers(usersData);
//     } catch (err) {
//       setError('Failed to fetch users. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const handleDelete = async (username) => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${username}/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setMessage('User deleted successfully!');
//       setDeleteModal({ isOpen: false, user: null });
//       fetchUsers();
//     } catch (err) {
//       setError('Failed to delete user.');
//     }
//   };

//   const handleUpdate = async (userData) => {
//     setIsUpdating(true);
//     try {
//       const token = localStorage.getItem('access');
//       const updateData = { ...userData };
//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/users/${userData.username}/`,
//         updateData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       setMessage('User updated successfully!');
//       setViewMode('list');
//       fetchUsers();
//     } catch (err) {
//       setError(err.response?.data?.detail || 'Update failed. Check your data.');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Pagination Helper
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const renderUserList = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//       {/* List Header */}
//       <div className="px-6 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Users</h2>
//           <p className="text-slate-500 text-sm mt-1 font-medium">Manage and monitor system access</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button 
//             onClick={() => setShowFilters(!showFilters)}
//             className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
//           >
//             <FunnelIcon className="h-5 w-5" />
//           </button>
//           <button 
//             onClick={fetchUsers}
//             className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all"
//           >
//             <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
//         <div className="relative">
//           <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by name, ID, or username..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm text-slate-700"
//           />
//         </div>

//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 animate-in slide-in-from-top-2">
//             <select 
//               value={filters.role} 
//               onChange={(e) => setFilters({...filters, role: e.target.value})}
//               className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-600 shadow-sm"
//             >
//               <option value="">All Roles</option>
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//               <option value="admin">Admin</option>
//             </select>
//             <select 
//               value={filters.gender} 
//               onChange={(e) => setFilters({...filters, gender: e.target.value})}
//               className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-600 shadow-sm"
//             >
//               <option value="">All Genders</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//             <button onClick={() => setFilters({role:'', gender:'', category:''})} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center justify-center">
//               Reset Filters
//             </button>
//           </div>
//         )}
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
//             <tr>
//               <th className="px-6 py-4">Identification</th>
//               <th className="px-6 py-4">Role & Status</th>
//               <th className="px-6 py-4">Contact Info</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentUsers.map((user) => (
//               <tr key={user.username} className="hover:bg-slate-50/50 transition-colors group">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm">
//                       {user.picture ? <img src={user.picture} className="h-full w-full object-cover" /> : user.firstName[0]}
//                     </div>
//                     <div>
//                       <div className="text-slate-900 font-bold text-sm leading-none">{user.firstName} {user.fatherName}</div>
//                       <div className="text-slate-400 text-xs mt-1.5 font-mono">{user.userId}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex flex-col gap-2">
//                     <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-indigo-50 text-indigo-600 w-fit">{user.role}</span>
//                     <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.is_active ? 'text-emerald-600' : 'text-rose-500'}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
//                       {user.is_active ? 'Active Account' : 'Suspended'}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                    <div className="text-slate-600 text-xs font-medium">{user.phoneNumber || 'No phone'}</div>
//                    <div className="text-slate-400 text-[11px] mt-1 italic">{user.username}</div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex justify-end gap-2">
//                     <button onClick={() => { setSelectedUser(user); setViewMode('view'); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><EyeIcon className="h-5 w-5" /></button>
//                     <button onClick={() => { setSelectedUser(user); setViewMode('edit'); }} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"><PencilIcon className="h-5 w-5" /></button>
//                     <button onClick={() => setDeleteModal({ isOpen: true, user })} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><TrashIcon className="h-5 w-5" /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       {/* Pagination Footer */}
//       <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
//           <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm"><ChevronLeftIcon className="h-5 w-5" /></button>
//           <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Page {currentPage} of {totalPages}</span>
//           <button disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 shadow-sm"><ChevronRightIcon className="h-5 w-5" /></button>
//       </div>
//     </div>
//   );// Render user detail view
//   const renderUserView = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
//       <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//         <button 
//           onClick={() => setViewMode('list')}
//           className="group flex items-center text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
//         >
//           <ChevronLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
//           Back to Directory
//         </button>
//         <div className="flex gap-2">
//           <button 
//              onClick={() => setViewMode('edit')}
//              className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-all"
//           >
//             Edit Profile
//           </button>
//         </div>
//       </div>

//       <div className="p-8">
//         <div className="flex flex-col lg:flex-row gap-12">
//           {/* Sidebar / Photo */}
//           <div className="lg:w-1/3 flex flex-col items-center">
//             <div className="relative">
//               <div className="h-48 w-48 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
//                 {selectedUser?.picture ? (
//                   <img src={selectedUser.picture} className="h-full w-full object-cover" />
//                 ) : (
//                   <UserIcon className="h-20 w-20 text-indigo-200" />
//                 )}
//               </div>
//               <div className={`absolute -bottom-2 -right-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${selectedUser?.is_active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
//                 {selectedUser?.is_active ? 'Active' : 'Suspended'}
//               </div>
//             </div>
//             <h3 className="mt-8 text-2xl font-black text-slate-800">{selectedUser?.firstName} {selectedUser?.fatherName}</h3>
//             <p className="text-indigo-600 font-bold tracking-wide uppercase text-xs mt-1">{selectedUser?.role}</p>
//             
//             <div className="w-full mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
//               <div className="flex items-center gap-3 mb-4">
//                 <IdentificationIcon className="h-5 w-5 text-slate-400" />
//                 <span className="text-sm font-mono text-slate-600">{selectedUser?.userId}</span>
//               </div>
//               <div className="flex items-center gap-3">
//                 <PhoneIcon className="h-5 w-5 text-slate-400" />
//                 <span className="text-sm text-slate-600 font-medium">{selectedUser?.phoneNumber || 'N/A'}</span>
//               </div>
//             </div>
//           </div>

//           {/* Details Content */}
//           <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <section>
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Personal Profile</h4>
//               <div className="space-y-4">
//                 <DetailRow label="Mother's Name" value={selectedUser?.motherName} />
//                 <DetailRow label="Date of Birth" value={selectedUser?.dob} />
//                 <DetailRow label="Gender" value={selectedUser?.gender} />
//                 <DetailRow label="Religion" value={selectedUser?.religion} />
//               </div>
//             </section>

//             <section>
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Academic Details</h4>
//               <div className="space-y-4">
//                 <DetailRow label="Category" value={selectedUser?.catagory} />
//                 <DetailRow label="Batch / Year" value={selectedUser?.batch} />
//                 <DetailRow label="Entrance Exam" value={selectedUser?.entrance_exam} />
//                 <DetailRow label="Disability" value={selectedUser?.handicap} />
//               </div>
//             </section>

//             <section className="md:col-span-2">
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Address & Location</h4>
//               <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4">
//                 <DetailRow label="Region" value={selectedUser?.region} />
//                 <DetailRow label="Zone/Wereda" value={selectedUser?.zone_or_special_wereda} />
//                 <DetailRow label="City/Town" value={selectedUser?.city_or_town} />
//                 <DetailRow label="House No." value={selectedUser?.house_number} />
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const DetailRow = ({ label, value }) => (
//     <div>
//       <dt className="text-[10px] font-bold text-slate-400 uppercase">{label}</dt>
//       <dd className="text-sm font-semibold text-slate-700 mt-0.5">{value || 'Not provided'}</dd>
//     </div>
//   );

//   // Render user edit form
//   // Render user edit form
//   const renderUserEdit = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
//         <h2 className="text-xl font-black text-slate-800">Update Profile Information</h2>
//         <p className="text-slate-500 text-sm">Modify the account settings for <strong>{selectedUser?.username}</strong></p>
//       </div>

//       <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedUser); }} className="p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           {/* --- Personal Information (6 Fields) --- */}
//           <FormInput label="First Name" value={selectedUser?.firstName} onChange={(val) => setSelectedUser({...selectedUser, firstName: val})} required />
//           <FormInput label="Father's Name" value={selectedUser?.fatherName} onChange={(val) => setSelectedUser({...selectedUser, fatherName: val})} required />
//           <FormInput label="Grandfather's Name" value={selectedUser?.grandFatherName} onChange={(val) => setSelectedUser({...selectedUser, grandFatherName: val})} />
//           <FormInput label="Mother's Name" value={selectedUser?.motherName} onChange={(val) => setSelectedUser({...selectedUser, motherName: val})} />
//           <FormInput label="Date of Birth" type="date" value={selectedUser?.dob} onChange={(val) => setSelectedUser({...selectedUser, dob: val})} />
//           <FormSelect label="Gender" value={selectedUser?.gender} onChange={(val) => setSelectedUser({...selectedUser, gender: val})} options={[
//             {label: 'Select Gender', value: ''}, {label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}
//           ]} />

//           {/* --- Contact & Status (3 Fields) --- */}
//           <FormInput label="Phone Number" type="tel" value={selectedUser?.phoneNumber} onChange={(val) => setSelectedUser({...selectedUser, phoneNumber: val})} />
//           <FormSelect label="Role" value={selectedUser?.role} onChange={(val) => setSelectedUser({...selectedUser, role: val})} options={[
//             {label: 'Student', value: 'student'}, {label: 'Teacher', value: 'teacher'}, {label: 'Admin', value: 'admin'}
//           ]} />
//           <FormSelect label="Account Status" value={selectedUser?.is_active ? 'true' : 'false'} onChange={(val) => setSelectedUser({...selectedUser, is_active: val === 'true'})} options={[
//             {label: 'Active', value: 'true'}, {label: 'Inactive', value: 'false'}
//           ]} />

//           {/* --- Academic & Background (3 Fields) --- */}
//           <FormInput label="Batch" value={selectedUser?.batch} onChange={(val) => setSelectedUser({...selectedUser, batch: val})} />
//           <FormInput label="Category" value={selectedUser?.catagory} onChange={(val) => setSelectedUser({...selectedUser, catagory: val})} />
//           <FormSelect label="Handicap" value={selectedUser?.handicap} onChange={(val) => setSelectedUser({...selectedUser, handicap: val})} options={[
//             {label: 'Normal', value: 'normal'}, {label: 'Case', value: 'case'}
//           ]} />

//           {/* --- Address Information (4 Fields) --- */}
//           <FormInput label="Region" value={selectedUser?.region} onChange={(val) => setSelectedUser({...selectedUser, region: val})} />
//           <FormInput label="Zone / Special Wereda" value={selectedUser?.zone_or_special_wereda} onChange={(val) => setSelectedUser({...selectedUser, zone_or_special_wereda: val})} />
//           <FormInput label="City / Town" value={selectedUser?.city_or_town} onChange={(val) => setSelectedUser({...selectedUser, city_or_town: val})} />
//           <FormInput label="House Number" value={selectedUser?.house_number} onChange={(val) => setSelectedUser({...selectedUser, house_number: val})} />
          
//           {/* Miscellaneous */}
//           <FormInput label="Religion" value={selectedUser?.religion} onChange={(val) => setSelectedUser({...selectedUser, religion: val})} />
//           <FormInput label="Entrance Exam Result" value={selectedUser?.entrance_exam} onChange={(val) => setSelectedUser({...selectedUser, entrance_exam: val})} />
//         </div>

//         <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
//           <button 
//             type="button" 
//             onClick={() => setViewMode('list')}
//             className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
//           >
//             Discard Changes
//           </button>
//           <button 
//             type="submit" 
//             disabled={isUpdating}
//             className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2 transition-all"
//           >
//             {isUpdating && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
//             {isUpdating ? 'Saving...' : 'Save Profile'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const FormInput = ({ label, value, onChange, type = "text", required = false }) => (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label} {required && '*'}</label>
//       <input 
//         type={type} 
//         value={value || ''} 
//         onChange={(e) => onChange(e.target.value)} 
//         required={required}
//         className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm text-slate-700 font-medium"
//       />
//     </div>
//   );

//   const FormSelect = ({ label, value, onChange, options }) => (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
//       <select 
//         value={value || ''} 
//         onChange={(e) => onChange(e.target.value)}
//         className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm text-slate-700 font-medium"
//       >
//         {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//       </select>
//     </div>
//   );

//   const DeleteConfirmationModal = () => (
//     deleteModal.isOpen && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
//         <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95 duration-200">
//           <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-6">
//             <ExclamationTriangleIcon className="h-8 w-8 text-rose-600" />
//           </div>
//           <h3 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h3>
//           <p className="text-slate-500 text-sm mb-8">This will permanently delete <strong>{deleteModal.user?.firstName}</strong>'s account. This action cannot be undone.</p>
//           <div className="flex flex-col gap-3">
//             <button 
//               onClick={() => handleDelete(deleteModal.user.username)}
//               className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
//             >
//               Delete Account
//             </button>
//             <button 
//               onClick={() => setDeleteModal({ isOpen: false, user: null })}
//               className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-12">
//       {/* Dynamic Status Messages */}
//       <div className="max-w-7xl mx-auto px-4 mt-4 space-y-4">
//         {message && (
//           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in slide-in-from-right">
//             <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
//             <p className="text-sm font-bold">{message}</p>
//           </div>
//         )}
//         {error && (
//           <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-in slide-in-from-right">
//             <XCircleIcon className="h-5 w-5 text-rose-500" />
//             <p className="text-sm font-bold">{error}</p>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 pt-6">
//         {viewMode === 'list' && renderUserList()}
//         {viewMode === 'view' && renderUserView()}
//         {viewMode === 'edit' && renderUserEdit()}
//       </div>

//       <DeleteConfirmationModal />
//     </div>
//   );
// };

// export default UsersManagement; 



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   UserIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
//   ArrowPathIcon, EyeIcon, FunnelIcon, XMarkIcon, ChevronLeftIcon,
//   ChevronRightIcon, ExclamationTriangleIcon, CheckCircleIcon,
//   XCircleIcon, PhoneIcon, MapPinIcon, AcademicCapIcon, IdentificationIcon
// } from '@heroicons/react/24/outline';

// const UsersManagement = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [viewMode, setViewMode] = useState('list');
//   const [filters, setFilters] = useState({ role: '', gender: '', category: '' });
//   const [showFilters, setShowFilters] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [usersPerPage] = useState(8);
//   const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

//   useEffect(() => {
//     if (message || error) {
//       const timer = setTimeout(() => {
//         setMessage('');
//         setError('');
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message, error]);

//   useEffect(() => {
//     let result = users;
//     if (searchTerm) {
//       result = result.filter(user =>
//         user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (filters.role) result = result.filter(user => user.role === filters.role);
//     if (filters.gender) result = result.filter(user => user.gender === filters.gender);
//     if (filters.category) result = result.filter(user => user.catagory === filters.category);

//     setFilteredUsers(result);
//     setCurrentPage(1);
//   }, [users, searchTerm, filters]);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('access');
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       const usersData = response.data.results || response.data || [];
//       setUsers(usersData);
//     } catch (err) {
//       setError('Failed to fetch users. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const handleUpdate = async (userData) => {
//     setIsUpdating(true);
//     try {
//       const token = localStorage.getItem('access');
      
//       // FIX: Strip the picture URL string. 
//       // Most APIs fail if you send a URL string back to a FileField.
//       const { picture, ...payload } = userData;

//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/users/${userData.username}/`,
//         payload,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       setMessage('User updated successfully!');
//       setViewMode('list');
//       fetchUsers();
//     } catch (err) {
//       // FIX: Detailed error parsing
//       const errorData = err.response?.data;
//       const errorMsg = typeof errorData === 'object' 
//         ? Object.entries(errorData).map(([key, val]) => `${key}: ${val}`).join(' ')
//         : 'Update failed. Please check the form.';
//       setError(errorMsg);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDelete = async (username) => {
//     try {
//       const token = localStorage.getItem('access');
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${username}/`, {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       setMessage('User deleted successfully!');
//       setDeleteModal({ isOpen: false, user: null });
//       fetchUsers();
//     } catch (err) {
//       setError('Failed to delete user.');
//     }
//   };

//   // Pagination Logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

//   const renderUserList = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="px-6 py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Users</h2>
//           <p className="text-slate-500 text-sm mt-1 font-medium">Manage and monitor system access</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border transition-all ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
//             <FunnelIcon className="h-5 w-5" />
//           </button>
//           <button onClick={fetchUsers} className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all">
//             <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//       </div>

//       <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
//         <div className="relative">
//           <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             type="text"
//             placeholder="Search by name, ID, or username..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm text-slate-700"
//           />
//         </div>

//         {showFilters && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//             <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-600 shadow-sm">
//               <option value="">All Roles</option>
//               <option value="student">Student</option>
//               <option value="teacher">Teacher</option>
//               <option value="admin">Admin</option>
//             </select>
//             <select value={filters.gender} onChange={(e) => setFilters({...filters, gender: e.target.value})} className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm text-slate-600 shadow-sm">
//               <option value="">All Genders</option>
//               <option value="Male">Male</option>
//               <option value="Female">Female</option>
//             </select>
//             <button onClick={() => setFilters({role:'', gender:'', category:''})} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Reset Filters</button>
//           </div>
//         )}
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full text-left">
//           <thead className="bg-slate-50/80 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
//             <tr>
//               <th className="px-6 py-4">Identification</th>
//               <th className="px-6 py-4">Role & Status</th>
//               <th className="px-6 py-4">Contact Info</th>
//               <th className="px-6 py-4 text-right">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-100">
//             {currentUsers.map((user) => (
//               <tr key={user.username} className="hover:bg-slate-50/50 transition-colors group">
//                 <td className="px-6 py-4">
//                   <div className="flex items-center gap-4">
//                     <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm">
//                       {user.picture ? <img src={user.picture} className="h-full w-full object-cover" alt="user" /> : user.firstName[0]}
//                     </div>
//                     <div>
//                       <div className="text-slate-900 font-bold text-sm leading-none">{user.firstName} {user.fatherName}</div>
//                       <div className="text-slate-400 text-xs mt-1.5 font-mono">{user.userId}</div>
//                     </div>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex flex-col gap-2">
//                     <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-lg bg-indigo-50 text-indigo-600 w-fit">{user.role}</span>
//                     <span className={`flex items-center gap-1.5 text-xs font-semibold ${user.is_active ? 'text-emerald-600' : 'text-rose-500'}`}>
//                       <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
//                       {user.is_active ? 'Active Account' : 'Suspended'}
//                     </span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4">
//                    <div className="text-slate-600 text-xs font-medium">{user.phoneNumber || 'No phone'}</div>
//                    <div className="text-slate-400 text-[11px] mt-1 italic">{user.username}</div>
//                 </td>
//                 <td className="px-6 py-4">
//                   <div className="flex justify-end gap-2">
//                     <button onClick={() => { setSelectedUser(user); setViewMode('view'); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><EyeIcon className="h-5 w-5" /></button>
//                     {/* FIX: Create copy on edit selection */}
//                     <button onClick={() => { setSelectedUser({ ...user }); setViewMode('edit'); }} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"><PencilIcon className="h-5 w-5" /></button>
//                     <button onClick={() => setDeleteModal({ isOpen: true, user })} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"><TrashIcon className="h-5 w-5" /></button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
//           <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronLeftIcon className="h-5 w-5" /></button>
//           <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Page {currentPage} of {totalPages}</span>
//           <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronRightIcon className="h-5 w-5" /></button>
//       </div>
//     </div>
//   );

//   const renderUserView = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
//         <button onClick={() => setViewMode('list')} className="group flex items-center text-slate-500 hover:text-indigo-600 font-semibold transition-colors">
//           <ChevronLeftIcon className="h-5 w-5 mr-1 group-hover:-translate-x-1 transition-transform" />
//           Back to Directory
//         </button>
//         <button onClick={() => setViewMode('edit')} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 shadow-md">Edit Profile</button>
//       </div>
//       <div className="p-8">
//         <div className="flex flex-col lg:flex-row gap-12">
//           <div className="lg:w-1/3 flex flex-col items-center">
//             <div className="h-48 w-48 rounded-[2.5rem] bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
//               {selectedUser?.picture ? <img src={selectedUser.picture} className="h-full w-full object-cover" alt="profile" /> : <UserIcon className="h-20 w-20 text-indigo-200" />}
//             </div>
//             <h3 className="mt-8 text-2xl font-black text-slate-800">{selectedUser?.firstName} {selectedUser?.fatherName}</h3>
//             <p className="text-indigo-600 font-bold tracking-wide uppercase text-xs mt-1">{selectedUser?.role}</p>
//           </div>
//           <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
//             <section>
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Personal Profile</h4>
//               <div className="space-y-4">
//                 <DetailRow label="Mother's Name" value={selectedUser?.motherName} />
//                 <DetailRow label="Date of Birth" value={selectedUser?.dob} />
//                 <DetailRow label="Gender" value={selectedUser?.gender} />
//                 <DetailRow label="Religion" value={selectedUser?.religion} />
//               </div>
//             </section>
//             <section>
//               <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Academic</h4>
//               <div className="space-y-4">
//                 <DetailRow label="Category" value={selectedUser?.catagory} />
//                 <DetailRow label="Batch" value={selectedUser?.batch} />
//                 <DetailRow label="Disability" value={selectedUser?.handicap} />
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderUserEdit = () => (
//     <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
//       <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
//         <h2 className="text-xl font-black text-slate-800">Update Profile Information</h2>
//         <p className="text-slate-500 text-sm">Modify the account settings for <strong>{selectedUser?.username}</strong></p>
//       </div>

//       <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedUser); }} className="p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//           <FormInput label="First Name" value={selectedUser?.firstName} onChange={(val) => setSelectedUser({...selectedUser, firstName: val})} required />
//           <FormInput label="Father's Name" value={selectedUser?.fatherName} onChange={(val) => setSelectedUser({...selectedUser, fatherName: val})} required />
//           <FormInput label="Grandfather's Name" value={selectedUser?.grandFatherName} onChange={(val) => setSelectedUser({...selectedUser, grandFatherName: val})} />
//           <FormInput label="Mother's Name" value={selectedUser?.motherName} onChange={(val) => setSelectedUser({...selectedUser, motherName: val})} />
//           <FormInput label="Date of Birth" type="date" value={selectedUser?.dob} onChange={(val) => setSelectedUser({...selectedUser, dob: val})} />
//           <FormSelect label="Gender" value={selectedUser?.gender} onChange={(val) => setSelectedUser({...selectedUser, gender: val})} options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]} />
//           <FormInput label="Phone Number" type="tel" value={selectedUser?.phoneNumber} onChange={(val) => setSelectedUser({...selectedUser, phoneNumber: val})} />
//           <FormSelect label="Role" value={selectedUser?.role} onChange={(val) => setSelectedUser({...selectedUser, role: val})} options={[{label: 'Student', value: 'student'}, {label: 'Teacher', value: 'teacher'}, {label: 'Admin', value: 'admin'}]} />
          
//           {/* FIX: Ensure boolean conversion from select string */}
//           <FormSelect label="Account Status" value={selectedUser?.is_active ? 'true' : 'false'} onChange={(val) => setSelectedUser({...selectedUser, is_active: val === 'true'})} options={[{label: 'Active', value: 'true'}, {label: 'Inactive', value: 'false'}]} />

//           <FormInput label="Batch" value={selectedUser?.batch} onChange={(val) => setSelectedUser({...selectedUser, batch: val})} />
//           <FormInput label="Category" value={selectedUser?.catagory} onChange={(val) => setSelectedUser({...selectedUser, catagory: val})} />
//           <FormSelect label="Handicap" value={selectedUser?.handicap} onChange={(val) => setSelectedUser({...selectedUser, handicap: val})} options={[{label: 'Normal', value: 'normal'}, {label: 'Case', value: 'case'}]} />
//           <FormInput label="Region" value={selectedUser?.region} onChange={(val) => setSelectedUser({...selectedUser, region: val})} />
//           <FormInput label="City" value={selectedUser?.city_or_town} onChange={(val) => setSelectedUser({...selectedUser, city_or_town: val})} />
//           <FormInput label="House No." value={selectedUser?.house_number} onChange={(val) => setSelectedUser({...selectedUser, house_number: val})} />
//         </div>

//         <div className="flex justify-end gap-3 pt-8 border-t border-slate-100">
//           <button type="button" onClick={() => setViewMode('list')} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Discard Changes</button>
//           <button type="submit" disabled={isUpdating} className="px-8 py-2.5 bg-indigo-600 text-gray-900 text-sm font-bold rounded-xl hover:bg-indigo-400 shadow-md disabled:opacity-50 flex items-center gap-2 transition-all">
//             {isUpdating && <ArrowPathIcon className="h-4 w-4 animate-spin" />}
//             {isUpdating ? 'Saving...' : 'Save Profile'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const DetailRow = ({ label, value }) => (
//     <div>
//       <dt className="text-[10px] font-bold text-slate-400 uppercase">{label}</dt>
//       <dd className="text-sm font-semibold text-slate-700 mt-0.5">{value || 'Not provided'}</dd>
//     </div>
//   );

//   const FormInput = ({ label, value, onChange, type = "text", required = false }) => (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label} {required && '*'}</label>
//       <input type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} required={required} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm text-slate-700 font-medium" />
//     </div>
//   );

//   const FormSelect = ({ label, value, onChange, options }) => (
//     <div className="flex flex-col gap-1.5">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{label}</label>
//       <select value={value || ''} onChange={(e) => onChange(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm text-slate-700 font-medium">
//         {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//       </select>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] pb-12">
//       <div className="max-w-7xl mx-auto px-4 mt-4 space-y-4">
//         {message && (
//           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 animate-in slide-in-from-right">
//             <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
//             <p className="text-sm font-bold">{message}</p>
//           </div>
//         )}
//         {error && (
//           <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 animate-in slide-in-from-right">
//             <XCircleIcon className="h-5 w-5 text-rose-500" />
//             <p className="text-sm font-bold">{error}</p>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 pt-6">
//         {viewMode === 'list' && renderUserList()}
//         {viewMode === 'view' && renderUserView()}
//         {viewMode === 'edit' && renderUserEdit()}
//       </div>

//       {deleteModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
//           <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center animate-in zoom-in-95">
//             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 mb-6">
//               <ExclamationTriangleIcon className="h-8 w-8 text-rose-600" />
//             </div>
//             <h3 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h3>
//             <p className="text-slate-500 text-sm mb-8">Permanently delete <strong>{deleteModal.user?.firstName}</strong>'s account?</p>
//             <div className="flex flex-col gap-3">
//               <button onClick={() => handleDelete(deleteModal.user.username)} className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all">Delete Account</button>
//               <button onClick={() => setDeleteModal({ isOpen: false, user: null })} className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UsersManagement;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserIcon, PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon,
  ArrowPathIcon, EyeIcon, FunnelIcon, XMarkIcon, ChevronLeftIcon,
  ChevronRightIcon, ExclamationTriangleIcon, CheckCircleIcon,
  XCircleIcon, PhoneIcon, MapPinIcon, AcademicCapIcon, IdentificationIcon,
  GlobeAltIcon, HomeIcon, CalendarDaysIcon, HeartIcon
} from '@heroicons/react/24/outline';

// --- SUB-COMPONENTS MOVED OUTSIDE TO FIX FOCUS ISSUE ---

const DetailRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
    {Icon && <Icon className="h-5 w-5 text-slate-400 mt-0.5" />}
    <div>
      <dt className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</dt>
      <dd className="text-sm font-bold text-slate-700 mt-0.5">{value || '—'}</dd>
    </div>
  </div>
);

const FormInput = ({ label, value, onChange, type = "text", required = false }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input 
      type={type} 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      required={required} 
      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm text-slate-700 font-semibold" 
    />
  </div>
);

const FormSelect = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-1">{label}</label>
    <select 
      value={value || ''} 
      onChange={(e) => onChange(e.target.value)} 
      className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all text-sm text-slate-700 font-semibold"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// --- MAIN COMPONENT ---

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
  const [filters, setFilters] = useState({ role: '', gender: '', category: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => { setMessage(''); setError(''); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  useEffect(() => {
    let result = users;
    if (searchTerm) {
      result = result.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filters.role) result = result.filter(user => user.role === filters.role);
    if (filters.gender) result = result.filter(user => user.gender === filters.gender);
    
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [users, searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data.results || response.data || []);
    } catch (err) {
      setError('Failed to fetch users. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleUpdate = async (userData) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('access');
      const { picture, ...payload } = userData;

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userData.username}/`,
        payload,
        { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }}
      );

      setMessage('User updated successfully!');
      setViewMode('list');
      fetchUsers();
    } catch (err) {
      setError('Update failed. Verify form data.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (username) => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${username}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessage('User deleted successfully!');
      setDeleteModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (err) { setError('Failed to delete user.'); }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const renderUserList = () => (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
      <div className="px-8 py-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Users Directory</h2>
          <p className="text-slate-500 font-medium mt-1">Manage system accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-2xl border transition-all ${showFilters ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}>
            <FunnelIcon className="h-5 w-5" />
          </button>
          <button onClick={fetchUsers} className="p-3 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="px-8 py-6 bg-slate-50/40 border-b border-slate-100">
        <div className="relative group">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all shadow-sm font-semibold text-slate-700"
          />
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-in slide-in-from-top-2 duration-300">
            <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})} className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100">
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            <select value={filters.gender} onChange={(e) => setFilters({...filters, gender: e.target.value})} className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs uppercase text-slate-600 outline-none focus:ring-2 focus:ring-indigo-100">
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <button onClick={() => setFilters({role:'', gender:'', category:''})} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors">Clear All Filters</button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black">
              <th className="px-8 py-5">Profile</th>
              <th className="px-8 py-5">Role & Account</th>
              <th className="px-8 py-5">Registration</th>
              <th className="px-8 py-5 text-right">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentUsers.map((user) => (
              <tr key={user.username} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-100 flex items-center justify-center text-indigo-600 font-black shadow-sm overflow-hidden border border-white">
                      {user.picture ? <img src={user.picture} className="h-full w-full object-cover" alt="" /> : user.firstName[0]}
                    </div>
                    <div>
                      <div className="text-slate-900 font-black text-sm uppercase tracking-tight">{user.firstName} {user.fatherName}</div>
                      <div className="text-indigo-600 text-[10px] font-bold mt-0.5">{user.userId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="flex flex-col gap-1.5">
                    <span className="px-3 py-1 text-[10px] font-black uppercase rounded-lg bg-indigo-50 text-indigo-700 w-fit">{user.role}</span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase ${user.is_active ? 'text-emerald-600' : 'text-rose-500'}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {user.is_active ? 'Verified' : 'Suspended'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                   <div className="text-slate-700 text-xs font-bold">{user.phoneNumber || '—'}</div>
                   <div className="text-slate-400 text-[11px] font-medium mt-0.5">{user.username}</div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setSelectedUser(user); setViewMode('view'); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><EyeIcon className="h-5 w-5" /></button>
                    <button onClick={() => { setSelectedUser({ ...user }); setViewMode('edit'); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"><PencilIcon className="h-5 w-5" /></button>
                    <button onClick={() => setDeleteModal({ isOpen: true, user })} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><TrashIcon className="h-5 w-5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:shadow-sm"><ChevronLeftIcon className="h-5 w-5" /></button>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:shadow-sm"><ChevronRightIcon className="h-5 w-5" /></button>
      </div>
    </div>
  );

  const renderUserView = () => (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-slate-50/80 px-10 py-8 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => setViewMode('list')} className="group flex items-center text-slate-500 hover:text-indigo-600 text-xs font-black uppercase tracking-widest transition-all">
          <ChevronLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
        <button onClick={() => setViewMode('edit')} className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 shadow-lg shadow-slate-200 transition-all">Edit Account</button>
      </div>

      <div className="p-10">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar Info */}
          <div className="lg:w-1/4 flex flex-col items-center">
            <div className="h-44 w-44 rounded-[3rem] bg-gradient-to-br from-indigo-50 to-white border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
              {selectedUser?.picture ? <img src={selectedUser.picture} className="h-full w-full object-cover" alt="" /> : <UserIcon className="h-20 w-20 text-indigo-100" />}
            </div>
            <div className="mt-8 text-center">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none">{selectedUser?.firstName} {selectedUser?.fatherName}</h3>
              <p className="text-indigo-600 font-bold tracking-[0.2em] uppercase text-[10px] mt-2 bg-indigo-50 px-3 py-1 rounded-full">{selectedUser?.role}</p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                  <IdentificationIcon className="h-4 w-4" /> {selectedUser?.userId}
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-bold">
                  <PhoneIcon className="h-4 w-4" /> {selectedUser?.phoneNumber || 'No phone'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Data Sections */}
          <div className="lg:w-3/4 space-y-12">
            {/* Identity Group */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><IdentificationIcon className="h-5 w-5"/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Identity & Origin</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailRow label="First Name" value={selectedUser?.firstName} />
                <DetailRow label="Father's Name" value={selectedUser?.fatherName} />
                <DetailRow label="Grandfather" value={selectedUser?.grandFatherName} />
                <DetailRow label="Mother's Name" value={selectedUser?.motherName} />
                <DetailRow label="Gender" value={selectedUser?.gender} />
                <DetailRow label="Date of Birth" value={selectedUser?.dob} icon={CalendarDaysIcon} />
                <DetailRow label="Religion" value={selectedUser?.religion} />
                <DetailRow label="Handicap" value={selectedUser?.handicap} icon={HeartIcon} />
              </div>
            </section>

            {/* Academic Group */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600"><AcademicCapIcon className="h-5 w-5"/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Academic Status</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailRow label="User ID" value={selectedUser?.userId} />
                <DetailRow label="Enrollment Batch" value={selectedUser?.batch} />
                <DetailRow label="Category" value={selectedUser?.catagory} />
                <DetailRow label="Account Status" value={selectedUser?.is_active ? 'Active' : 'Suspended'} />
              </div>
            </section>

            {/* Contact Group */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600"><MapPinIcon className="h-5 w-5"/></div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Location</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DetailRow label="Phone Number" value={selectedUser?.phoneNumber} icon={PhoneIcon} />
                <DetailRow label="Region" value={selectedUser?.region} icon={GlobeAltIcon} />
                <DetailRow label="City / Town" value={selectedUser?.city_or_town} icon={HomeIcon} />
                <DetailRow label="House Number" value={selectedUser?.house_number} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserEdit = () => (
    <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-8 bg-slate-50 border-b border-slate-100">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Modify Account</h2>
        <p className="text-slate-500 text-sm font-medium mt-1">Updating profile for system user: <span className="text-indigo-600 font-bold">{selectedUser?.username}</span></p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedUser); }} className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <FormInput label="First Name" value={selectedUser?.firstName} onChange={(val) => setSelectedUser({...selectedUser, firstName: val})} required />
          <FormInput label="Father's Name" value={selectedUser?.fatherName} onChange={(val) => setSelectedUser({...selectedUser, fatherName: val})} required />
          <FormInput label="Grandfather Name" value={selectedUser?.grandFatherName} onChange={(val) => setSelectedUser({...selectedUser, grandFatherName: val})} />
          <FormInput label="Mother's Name" value={selectedUser?.motherName} onChange={(val) => setSelectedUser({...selectedUser, motherName: val})} />
          
          <FormInput label="Date of Birth" type="date" value={selectedUser?.dob} onChange={(val) => setSelectedUser({...selectedUser, dob: val})} />
          <FormSelect label="Gender" value={selectedUser?.gender} onChange={(val) => setSelectedUser({...selectedUser, gender: val})} options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}]} />
          <FormInput label="Phone Number" type="tel" value={selectedUser?.phoneNumber} onChange={(val) => setSelectedUser({...selectedUser, phoneNumber: val})} />
          <FormSelect label="Role" value={selectedUser?.role} onChange={(val) => setSelectedUser({...selectedUser, role: val})} options={[{label: 'Student', value: 'student'}, {label: 'Teacher', value: 'teacher'}, {label: 'Admin', value: 'admin'}]} />
          
          <FormSelect label="Account Status" value={selectedUser?.is_active ? 'true' : 'false'} onChange={(val) => setSelectedUser({...selectedUser, is_active: val === 'true'})} options={[{label: 'Active', value: 'true'}, {label: 'Inactive', value: 'false'}]} />
          <FormInput label="Batch" value={selectedUser?.batch} onChange={(val) => setSelectedUser({...selectedUser, batch: val})} />
          <FormInput label="Category" value={selectedUser?.catagory} onChange={(val) => setSelectedUser({...selectedUser, catagory: val})} />
          <FormSelect label="Handicap" value={selectedUser?.handicap} onChange={(val) => setSelectedUser({...selectedUser, handicap: val})} options={[{label: 'Normal', value: 'normal'}, {label: 'Case', value: 'case'}]} />
          
          <FormInput label="Region" value={selectedUser?.region} onChange={(val) => setSelectedUser({...selectedUser, region: val})} />
          <FormInput label="City" value={selectedUser?.city_or_town} onChange={(val) => setSelectedUser({...selectedUser, city_or_town: val})} />
          <FormInput label="House No." value={selectedUser?.house_number} onChange={(val) => setSelectedUser({...selectedUser, house_number: val})} />
          <FormInput label="Religion" value={selectedUser?.religion} onChange={(val) => setSelectedUser({...selectedUser, religion: val})} />
        </div>

        <div className="flex justify-end gap-3 pt-10 border-t border-slate-100">
          <button type="button" onClick={() => setViewMode('list')} className="px-8 py-3.5 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Discard</button>
          <button type="submit" disabled={isUpdating} className="px-10 py-3.5 bg-blue-600 text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-purple-400 shadow-xl shadow-blue-100 disabled:opacity-50 flex items-center gap-2 transition-all">
            {isUpdating ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : <CheckCircleIcon className="h-4 w-4"/>}
            {isUpdating ? 'Synchronizing...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Notifications */}
      <div className="max-w-7xl mx-auto px-6 pt-6 sticky top-0 z-40 pointer-events-none">
        {message && (
          <div className="max-w-md ml-auto p-4 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] shadow-xl flex items-center gap-3 text-emerald-800 animate-in slide-in-from-right pointer-events-auto">
            <CheckCircleIcon className="h-6 w-6 text-emerald-500" />
            <p className="text-xs font-black uppercase tracking-tight">{message}</p>
          </div>
        )}
        {error && (
          <div className="max-w-md ml-auto p-4 bg-rose-50 border border-rose-100 rounded-[1.5rem] shadow-xl flex items-center gap-3 text-rose-800 animate-in slide-in-from-right pointer-events-auto">
            <XCircleIcon className="h-6 w-6 text-rose-500" />
            <p className="text-xs font-black uppercase tracking-tight">{error}</p>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        {viewMode === 'list' && renderUserList()}
        {viewMode === 'view' && renderUserView()}
        {viewMode === 'edit' && renderUserEdit()}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-sm w-full p-10 text-center animate-in zoom-in-95">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 mb-8 border border-rose-100">
              <ExclamationTriangleIcon className="h-10 w-10 text-rose-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Terminate?</h3>
            <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed text-center">
              Are you certain you want to permanently remove <span className="text-slate-900 font-bold">{deleteModal.user?.firstName}</span> from the system?
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => handleDelete(deleteModal.user.username)} className="w-full py-4 bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all">Confirm Delete</button>
              <button onClick={() => setDeleteModal({ isOpen: false, user: null })} className="w-full py-4 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Go Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;