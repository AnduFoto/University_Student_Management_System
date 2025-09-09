
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
  const [filters, setFilters] = useState({
    role: '',
    gender: '',
    category: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });

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

  // Filter users based on search and filters
  useEffect(() => {
    let result = users;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(user =>
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filters.role) {
      result = result.filter(user => user.role === filters.role);
    }

    // Apply gender filter
    if (filters.gender) {
      result = result.filter(user => user.gender === filters.gender);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(user => user.catagory === filters.category);
    }

    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [users, searchTerm, filters]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const usersData = response.data.results || response.data || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user deletion
  const handleDelete = async (username) => {
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${username}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setMessage('User deleted successfully!');
      setDeleteModal({ isOpen: false, user: null });
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please check your connection.');
    }
  };

  // Debug function to see what data is being sent
  const debugUpdate = async (userData) => {
    try {
      const token = localStorage.getItem('access');
      
      // Prepare the data in the format expected by the Django API
      const updateData = {
        firstName: userData.firstName || '',
        fatherName: userData.fatherName || '',
        grandFatherName: userData.grandFatherName || '',
        motherName: userData.motherName || '',
        phoneNumber: userData.phoneNumber || '',
        gender: userData.gender || 'Male',
        role: userData.role || 'student',
        catagory: userData.catagory || '',
        is_active: userData.is_active !== undefined ? userData.is_active : true,
        userId: userData.userId || '',
        username: userData.username || '',
        handicap: userData.handicap || 'normal',
        religion: userData.religion || '',
        region: userData.region || '',
        zone_or_special_wereda: userData.zone_or_special_wereda || '',
        city_or_town: userData.city_or_town || '',
        house_number: userData.house_number || '',
        batch: userData.batch || '',
        entrance_exam: userData.entrance_exam || '',
        mothersFatherName: userData.mothersFatherName || '',
        nationality: userData.nationality || '',
        dob: userData.dob || null,
        position: userData.position || ''
      };

      console.log('Sending data:', updateData);

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userData.username}/`, 
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Server response:', response.data);
      return response;
    } catch (err) {
      console.error('Debug error:', err);
      console.error('Error response:', err.response?.data);
      throw err;
    }
  };

  // Handle user update
  const handleUpdate = async (userData) => {
    setIsUpdating(true);
    try {
      // Use the debug function to see what's happening
      const response = await debugUpdate(userData);
      
      setMessage('User updated successfully!');
      setViewMode('list');
      fetchUsers(); // Refresh the list
    } catch (err) {
      console.error('Error updating user:', err);
      
      // More detailed error handling
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object') {
          // Handle field validation errors
          const errorMessages = Object.entries(errorData)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ');
          setError(`Update failed: ${errorMessages}`);
        } else if (typeof errorData === 'string') {
          setError(`Update failed: ${errorData}`);
        } else {
          setError('Failed to update user. Please check the data and try again.');
        }
      } else {
        setError('Failed to update user. Please check your connection.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  // View user details
  const viewUser = (user) => {
    setSelectedUser(user);
    setViewMode('view');
  };

  // Edit user
  const editUser = (user) => {
    setSelectedUser(user);
    setViewMode('edit');
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      role: '',
      gender: '',
      category: ''
    });
    setSearchTerm('');
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!deleteModal.isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-95 animate-in fade-in-90 zoom-in-90">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete User</h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete <span className="font-semibold">{deleteModal.user?.firstName} {deleteModal.user?.fatherName}</span>? This action cannot be undone.
          </p>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setDeleteModal({ isOpen: false, user: null })}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteModal.user.username)}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-md hover:shadow-lg"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render user list view
  const renderUserList = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <p className="text-gray-500 mt-1">{filteredUsers.length} users found</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-xl flex items-center transition-all ${
              showFilters 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 flex items-center transition-all shadow-sm hover:shadow-md"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, username, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all bg-gray-50"
          />
        </div>

        {showFilters && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl mb-4 border border-gray-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="">All Roles</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="registeral">Registeral</option>
                  <option value="department Head">Department Head</option>
                  <option value="college">College Head</option>
                  <option value="president">President</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => setFilters({...filters, gender: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                >
                  <option value="">All Categories</option>
                  <option value="Natural Science">Natural Science</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors font-medium"
            >
              <XMarkIcon className="h-4 w-4 mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No users found</p>
          <p className="text-sm mt-1">
            {searchTerm || filters.role || filters.gender || filters.category 
              ? "Try adjusting your search or filters" 
              : "No users available in the system"}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {user.picture ? (
                            <img className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm" src={user.picture} alt={user.firstName} />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border-2 border-white shadow-sm">
                              <UserIcon className="h-6 w-6 text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.fatherName}
                          </div>
                          <div className="text-sm text-gray-500">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded-md inline-block">{user.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {user.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewUser(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50 flex items-center"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => editUser(user)}
                          className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-lg hover:bg-indigo-50 flex items-center"
                          title="Edit user"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, user })}
                          className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center"
                          title="Delete user"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 space-y-4 sm:space-y-0">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{indexOfFirstUser + 1}</span> to{' '}
                <span className="font-medium">
                  {indexOfLastUser > filteredUsers.length ? filteredUsers.length : indexOfLastUser}
                </span> of{' '}
                <span className="font-medium">{filteredUsers.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-sm"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" /> Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                        currentPage === number
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-sm"
                >
                  Next <ChevronRightIcon className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  // Render user detail view
  const renderUserView = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('list')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back to List
        </button>
        <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
      </div>

      {selectedUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl text-center border border-gray-200 shadow-sm">
              {selectedUser.picture ? (
                <img className="h-32 w-32 rounded-full mx-auto object-cover mb-4 border-4 border-white shadow-md" src={selectedUser.picture} alt={selectedUser.firstName} />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
                  <UserIcon className="h-16 w-16 text-blue-600" />
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {selectedUser.firstName} {selectedUser.fatherName}
              </h3>
              <p className="text-gray-500">{selectedUser.username}</p>
              <p className="text-sm text-gray-500 mt-1 font-mono">{selectedUser.userId}</p>
              
              <div className="mt-4">
                <span className={`px-3 py-1.5 inline-flex text-sm leading-4 font-semibold rounded-full ${
                  selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selectedUser.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <button
                onClick={() => editUser(selectedUser)}
                className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <PencilIcon className="h-4 w-4 mr-2" /> Edit User
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 text-lg">Personal Information</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="text-sm text-gray-900 font-medium">{selectedUser.firstName} {selectedUser.fatherName} {selectedUser.grandFatherName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Mother's Name</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.motherName || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.dob || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="text-sm text-gray-900 capitalize">{selectedUser.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.phoneNumber || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-700 mb-3 text-lg">Account Information</h4>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Role</dt>
                    <dd className="text-sm text-gray-900 capitalize">{selectedUser.role}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.catagory || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Batch</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.batch || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Entrance Exam</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.entrance_exam || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Password Status</dt>
                    <dd className="text-sm text-gray-900">
                      {selectedUser.is_using_default_password ? 'Using Default Password' : 'Custom Password'}
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                <h4 className="font-semibold text-gray-700 mb-3 text-lg">Address Information</h4>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Region</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.region || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Zone/Wereda</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.zone_or_special_wereda || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City/Town</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.city_or_town || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">House Number</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.house_number || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Religion</dt>
                    <dd className="text-sm text-gray-900">{selectedUser.religion || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Handicap</dt>
                    <dd className="text-sm text-gray-900 capitalize">{selectedUser.handicap || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Render user edit form
  const renderUserEdit = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setViewMode('list')}
          className="mr-3 text-gray-500 hover:text-gray-700 flex items-center transition-colors p-2 rounded-lg hover:bg-gray-100"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-1" /> Back to List
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
      </div>

      {selectedUser && (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleUpdate(selectedUser);
        }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                value={selectedUser.firstName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, firstName: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
              <input
                type="text"
                value={selectedUser.fatherName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, fatherName: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Grandfather's Name</label>
              <input
                type="text"
                value={selectedUser.grandFatherName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, grandFatherName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother's Name</label>
              <input
                type="text"
                value={selectedUser.motherName || ''}
                onChange={(e) => setSelectedUser({...selectedUser, motherName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={selectedUser.phoneNumber || ''}
                onChange={(e) => setSelectedUser({...selectedUser, phoneNumber: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                value={selectedUser.gender || ''}
                onChange={(e) => setSelectedUser({...selectedUser, gender: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={selectedUser.role || ''}
                onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="registeral">Registeral</option>
                <option value="department Head">Department Head</option>
                <option value="college Head">College Head</option>
                <option value="president">President</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedUser.catagory || ''}
                onChange={(e) => setSelectedUser({...selectedUser, catagory: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              >
                <option value="">Select Category</option>
                <option value="Natural Science">Natural Science</option>
                <option value="Social Science">Social Science</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
              <select
                value={selectedUser.is_active ? 'true' : 'false'}
                onChange={(e) => setSelectedUser({...selectedUser, is_active: e.target.value === 'true'})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <input
                type="text"
                value={selectedUser.region || ''}
                onChange={(e) => setSelectedUser({...selectedUser, region: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zone/Wereda</label>
              <input
                type="text"
                value={selectedUser.zone_or_special_wereda || ''}
                onChange={(e) => setSelectedUser({...selectedUser, zone_or_special_wereda: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City/Town</label>
              <input
                type="text"
                value={selectedUser.city_or_town || ''}
                onChange={(e) => setSelectedUser({...selectedUser, city_or_town: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">House Number</label>
              <input
                type="text"
                value={selectedUser.house_number || ''}
                onChange={(e) => setSelectedUser({...selectedUser, house_number: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <input
                type="text"
                value={selectedUser.religion || ''}
                onChange={(e) => setSelectedUser({...selectedUser, religion: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Handicap</label>
              <select
                value={selectedUser.handicap || 'normal'}
                onChange={(e) => setSelectedUser({...selectedUser, handicap: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50"
              >
                <option value="normal">Normal</option>
                <option value="case">Case</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 transition-all font-medium shadow-md hover:shadow-lg flex items-center"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
            <UserIcon className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-600">View and manage all system users</p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          <p className="font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center">
          <XCircleIcon className="h-5 w-5 mr-2" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-8">
        {viewMode === 'list' && renderUserList()}
        {viewMode === 'view' && renderUserView()}
        {viewMode === 'edit' && renderUserEdit()}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
};

export default UsersManagement;