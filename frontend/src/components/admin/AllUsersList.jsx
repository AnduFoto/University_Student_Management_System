
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import {
//   MagnifyingGlassIcon,
//   AcademicCapIcon,
//   UserGroupIcon,
//   BuildingLibraryIcon,
//   UserCircleIcon,
//   CogIcon,
//   DocumentArrowDownIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   EyeIcon,
//   ChartBarIcon,
//   UsersIcon,
//   AdjustmentsHorizontalIcon
// } from '@heroicons/react/24/outline';

// // Main Dashboard Component
// const UserManagementDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('students');
//   const [selectedBatch, setSelectedBatch] = useState('all');
//   const [batches, setBatches] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
  
//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   // Stats state
//   const [stats, setStats] = useState({
//     total: 0,
//     students: 0,
//     teachers: 0,
//     active: 0
//   });

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`);
      
//       let usersData = [];
//       if (Array.isArray(response.data)) {
//         usersData = response.data;
//       } else if (response.data && Array.isArray(response.data.results)) {
//         usersData = response.data.results;
//       } else if (response.data && Array.isArray(response.data.users)) {
//         usersData = response.data.users;
//       } else if (response.data && typeof response.data === 'object') {
//         usersData = Object.values(response.data);
//       } else {
//         console.error('Unexpected API response structure:', response.data);
//         setError('Unexpected data format received from server');
//         setLoading(false);
//         return;
//       }
      
//       setUsers(usersData);
      
//       // Extract unique batches
//       const userBatches = [...new Set(usersData
//         .filter(user => user.batch)
//         .map(user => user.batch))];
//       setBatches(userBatches);
      
//       // Calculate statistics
//       const total = usersData.length;
//       const students = usersData.filter(user => getUserRole(user).toLowerCase().includes('student')).length;
//       const teachers = usersData.filter(user => getUserRole(user).toLowerCase().includes('teacher')).length;
//       const active = usersData.filter(user => user.is_active).length;
      
//       setStats({ total, students, teachers, active });
      
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setError('Failed to fetch users. Please try again later.');
//       setLoading(false);
//     }
//   };

//   const getUserRole = (user) => {
//     if (user.role) return user.role;
//     if (user.userType) return user.userType;
//     if (user.type) return user.type;
//     if (user.roleName) return user.roleName;
//     return 'Unknown';
//   };

//   const filteredUsers = Array.isArray(users) ? users.filter(user => {
//     const userRole = getUserRole(user).toLowerCase();
//     const matchesSearch = searchTerm === '' || 
//       user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.fatherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.userId?.toLowerCase().includes(searchTerm.toLowerCase());
    
//     if (activeTab === 'students') {
//       return userRole.includes('student') && 
//         (selectedBatch === 'all' || user.batch === selectedBatch) &&
//         matchesSearch;
//     } else if (activeTab === 'teachers') {
//       return userRole.includes('teacher') && matchesSearch;
//     } else if (activeTab === 'registeral') {
//       return userRole.includes('registeral') && matchesSearch;
//     } else if (activeTab === 'department') {
//       return userRole.includes('department') && matchesSearch;
//     } else if (activeTab === 'collage') {
//       return userRole.includes('collage') && matchesSearch;
//     } else if (activeTab === 'president') {
//       return userRole.includes('president') && matchesSearch;
//     } else if (activeTab === 'admin') {
//       return userRole.includes('admin') && matchesSearch;
//     }
//     return false;
//   }) : [];

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const exportToCSV = () => {
//     const dataToExport = filteredUsers.map(user => ({
//       'First Name': user.firstName,
//       'Father Name': user.fatherName,
//       'Grand Father Name': user.grandFatherName,
//       'Username': user.username,
//       'User ID': user.userId,
//       'Role': getUserRole(user),
//       'Batch': user.batch || 'N/A',
//       'Status': user.is_active ? 'Active' : 'Inactive',
//       'Phone Number': user.phoneNumber || 'N/A',
//       'Category': user.catagory || 'N/A',
//       'Gender': user.gender,
//       'Nationality': user.nationality || 'N/A'
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataToExport);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
//     const fileName = `${activeTab}_${selectedBatch === 'all' ? 'all_batches' : 'batch_' + selectedBatch}.xlsx`;
//     XLSX.writeFile(workbook, fileName);
//   };

//   const exportToPDF = () => {
//     const doc = new jsPDF();
    
//     doc.setFontSize(16);
//     doc.text(`${activeTab.toUpperCase()} LIST - ${selectedBatch === 'all' ? 'ALL BATCHES' : 'BATCH ' + selectedBatch}`, 14, 15);
    
//     const tableData = filteredUsers.map(user => [
//       user.firstName || '',
//       user.fatherName || '',
//       user.username || '',
//       user.userId || '',
//       getUserRole(user) || '',
//       user.batch || 'N/A',
//       user.is_active ? 'Active' : 'Inactive'
//     ]);

//     autoTable(doc, {
//       head: [['First Name', 'Father Name', 'Username', 'User ID', 'Role', 'Batch', 'Status']],
//       body: tableData,
//       startY: 25,
//       theme: 'grid',
//       styles: { fontSize: 9, cellPadding: 2 },
//       headStyles: { 
//         fillColor: [140, 140, 140],
//         textColor: [255, 255, 255],
//         fontStyle: 'bold'
//       },
//       alternateRowStyles: {
//         fillColor: [240, 240, 240]
//       }
//     });

//     const fileName = `${activeTab}_${selectedBatch === 'all' ? 'all_batches' : 'batch_' + selectedBatch}.pdf`;
//     doc.save(fileName);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading users...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//         <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm max-w-md">
//           <div className="flex items-center">
//             <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <strong className="font-bold">Error: </strong>
//             <span className="ml-1">{error}</span>
//           </div>
//           <button
//             onClick={fetchUsers}
//             className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const tabConfig = [
//     { key: 'students', label: 'Students', icon: AcademicCapIcon, color: 'blue' },
//     { key: 'teachers', label: 'Teachers', icon: UserGroupIcon, color: 'green' },
//     { key: 'registeral', label: 'Registeral', icon: CogIcon, color: 'purple' },
//     { key: 'department', label: 'Department', icon: BuildingLibraryIcon, color: 'orange' },
//     { key: 'collage', label: 'College', icon: BuildingLibraryIcon, color: 'indigo' },
//     { key: 'president', label: 'President', icon: UserCircleIcon, color: 'red' },
//     { key: 'admin', label: 'Admin', icon: CogIcon, color: 'gray' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//               <p className="text-gray-600 mt-1">Manage all system users efficiently</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <UsersIcon className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="bg-blue-100 p-3 rounded-lg">
//                 <UsersIcon className="h-6 w-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <AcademicCapIcon className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Students</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.students}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="bg-purple-100 p-3 rounded-lg">
//                 <UserGroupIcon className="h-6 w-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Teachers</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.teachers}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-lg">
//                 <ChartBarIcon className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Active Users</p>
//                 <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           {/* Tab Navigation */}
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {tabConfig.map((tab) => {
//                 const IconComponent = tab.icon;
//                 return (
//                   <button
//                     key={tab.key}
//                     onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setSearchTerm(''); }}
//                     className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
//                       activeTab === tab.key
//                         ? `border-${tab.color}-500 text-${tab.color}-600`
//                         : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                     }`}
//                   >
//                     <IconComponent className="h-5 w-5" />
//                     <span>{tab.label}</span>
//                   </button>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Controls */}
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
//               <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
//                 {/* Search */}
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search users..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
//                   />
//                 </div>

//                 {/* Batch Filter */}
//                 {activeTab === 'students' && batches.length > 0 && (
//                   <div className="flex items-center space-x-2">
//                     <label className="text-sm font-medium text-gray-700">Batch:</label>
//                     <select
//                       value={selectedBatch}
//                       onChange={(e) => { setSelectedBatch(e.target.value); setCurrentPage(1); }}
//                       className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                     >
//                       <option value="all">All Batches</option>
//                       {batches.map(batch => (
//                         <option key={batch} value={batch}>{batch}</option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//               </div>

//               {/* Export Buttons */}
//               <div className="flex space-x-3">
//                 <button
//                   onClick={exportToCSV}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//                 >
//                   <DocumentArrowDownIcon className="h-4 w-4" />
//                   <span>Export CSV</span>
//                 </button>
//                 <button
//                   onClick={exportToPDF}
//                   className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//                 >
//                   <DocumentArrowDownIcon className="h-4 w-4" />
//                   <span>Export PDF</span>
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="px-6 py-4">
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-600">
//                   Showing {Math.min(filteredUsers.length, 1)} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} results
//                 </span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <span className="text-sm text-gray-600">Show:</span>
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
//                   className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
//                 >
//                   <option value="5">5</option>
//                   <option value="10">10</option>
//                   <option value="20">20</option>
//                   <option value="50">50</option>
//                 </select>
//                 <span className="text-sm text-gray-600">entries</span>
//               </div>
//             </div>

//             <div className="overflow-x-auto rounded-lg border border-gray-200">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       ID
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Role
//                     </th>
//                     {activeTab === 'students' && (
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Batch
//                       </th>
//                     )}
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Phone
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {currentItems.length > 0 ? (
//                     currentItems.map(user => (
//                       <tr key={user.username || user.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10">
//                               {user.picture ? (
//                                 <img
//                                   className="h-10 w-10 rounded-full object-cover"
//                                   src={user.picture}
//                                   alt={user.firstName}
//                                 />
//                               ) : (
//                                 <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                                   <span className="text-blue-600 font-medium">
//                                     {user.firstName?.charAt(0) || 'U'}
//                                     {user.fatherName?.charAt(0) || 'S'}
//                                   </span>
//                                 </div>
//                               )}
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900">
//                                 {user.firstName} {user.fatherName}
//                               </div>
//                               <div className="text-sm text-gray-500">
//                                 @{user.username}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {user.userId}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
//                             {getUserRole(user)}
//                           </span>
//                         </td>
//                         {activeTab === 'students' && (
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                               {user.batch}
//                             </span>
//                           </td>
//                         )}<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           {user.phoneNumber}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             user.is_active 
//                               ? 'bg-green-100 text-green-800' 
//                               : 'bg-red-100 text-red-800'
//                           }`}>
//                             {user.is_active ? 'Active' : 'Inactive'}
//                           </span>
//                         </td>
                        
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td 
//                         colSpan={activeTab === 'students' ? 6 : 5} 
//                         className="px-6 py-8 text-center"
//                       >
//                         <div className="text-gray-500">
//                           <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//                           <p className="text-lg font-medium">No users found</p>
//                           <p className="text-sm mt-1">
//                             {searchTerm 
//                               ? "Try adjusting your search terms" 
//                               : `No ${activeTab} found in the system`
//                             }
//                           </p>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {filteredUsers.length > 0 && (
//               <div className="flex items-center justify-between mt-6">
//                 <div className="text-sm text-gray-700">
//                   Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} results
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={() => paginate(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className={`p-2 rounded-lg border ${
//                       currentPage === 1 
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
//                     }`}
//                   >
//                     <ChevronLeftIcon className="h-5 w-5" />
//                   </button>
                  
//                   {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                     let pageNumber;
//                     if (totalPages <= 5) {
//                       pageNumber = i + 1;
//                     } else if (currentPage <= 3) {
//                       pageNumber = i + 1;
//                     } else if (currentPage >= totalPages - 2) {
//                       pageNumber = totalPages - 4 + i;
//                     } else {
//                       pageNumber = currentPage - 2 + i;
//                     }
                    
//                     return (
//                       <button
//                         key={pageNumber}
//                         onClick={() => paginate(pageNumber)}
//                         className={`px-3 py-1 rounded-lg text-sm ${
//                           currentPage === pageNumber
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
//                         }`}
//                       >
//                         {pageNumber}
//                       </button>
//                     );
//                   })}
                  
//                   <button
//                     onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                     className={`p-2 rounded-lg border ${
//                       currentPage === totalPages
//                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                         : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
//                     }`}
//                   >
//                     <ChevronRightIcon className="h-5 w-5" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagementDashboard;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  UserGroupIcon,
  BuildingLibraryIcon,
  UserCircleIcon,
  CogIcon,
  DocumentArrowDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChartBarIcon,
  UsersIcon,
  BellIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [stats, setStats] = useState({ total: 0, students: 0, teachers: 0, active: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`);
      let usersData = [];
      if (Array.isArray(response.data)) usersData = response.data;
      else if (response.data?.results) usersData = response.data.results;
      else if (response.data?.users) usersData = response.data.users;
      else if (response.data && typeof response.data === 'object') usersData = Object.values(response.data);
      else throw new Error('Format Error');

      setUsers(usersData);
      const userBatches = [...new Set(usersData.filter(u => u.batch).map(u => u.batch))];
      setBatches(userBatches);

      setStats({
        total: usersData.length,
        students: usersData.filter(u => getUserRole(u).toLowerCase().includes('student')).length,
        teachers: usersData.filter(u => getUserRole(u).toLowerCase().includes('teacher')).length,
        active: usersData.filter(u => u.is_active).length
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users.');
      setLoading(false);
    }
  };

  const getUserRole = (user) => user.role || user.userType || user.type || user.roleName || 'Unknown';

  const filteredUsers = users.filter(user => {
    const userRole = getUserRole(user).toLowerCase();
    const matchesSearch = searchTerm === '' || 
      [user.firstName, user.fatherName, user.username, user.userId].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const roleMap = {
      students: 'student',
      teachers: 'teacher',
      registeral: 'registeral',
      department: 'department',
      collage: 'collage',
      president: 'president',
      admin: 'admin'
    };

    const matchesTab = userRole.includes(roleMap[activeTab]);
    const matchesBatch = activeTab !== 'students' || selectedBatch === 'all' || user.batch === selectedBatch;

    return matchesTab && matchesBatch && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginate = (num) => setCurrentPage(num);

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(u => ({
      'Name': `${u.firstName} ${u.fatherName}`,
      'Username': u.username,
      'ID': u.userId,
      'Role': getUserRole(u),
      'Status': u.is_active ? 'Active' : 'Inactive'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, `${activeTab}_report.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Name', 'ID', 'Role', 'Status']],
      body: filteredUsers.map(u => [`${u.firstName} ${u.fatherName}`, u.userId, getUserRole(u), u.is_active ? 'Active' : 'Inactive']),
    });
    doc.save(`${activeTab}_report.pdf`);
  };

  const tabConfig = [
    { key: 'students', label: 'Students', icon: AcademicCapIcon },
    { key: 'teachers', label: 'Teachers', icon: UserGroupIcon },
    { key: 'registeral', label: 'Registrar', icon: CogIcon },
    { key: 'department', label: 'Dept', icon: BuildingLibraryIcon },
    { key: 'collage', label: 'College', icon: BuildingLibraryIcon },
    { key: 'president', label: 'President', icon: UserCircleIcon },
    { key: 'admin', label: 'Admin', icon: CogIcon }
  ];

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* Primary Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">EduAdmin Central</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-300 hover:text-white"><BellIcon className="h-6 w-6" /></button>
              <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold">JD</div>
                <span className="hidden md:block text-sm font-medium">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-Header / Nav Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 overflow-x-auto no-scrollbar py-3">
            {tabConfig.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: UsersIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Students', value: stats.students, icon: AcademicCapIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Staff', value: stats.teachers, icon: UserGroupIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Active Status', value: stats.active, icon: ChartBarIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-200 flex items-center space-x-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Action Bar */}
          <div className="p-6 bg-white border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative w-full max-w-sm">
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {activeTab === 'students' && (
                <select 
                  className="border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 text-sm outline-none hover:bg-white transition-colors cursor-pointer"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="all">All Batches</option>
                  {batches.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={exportToCSV} className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">
                <ArrowDownTrayIcon className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
              <button onClick={exportToPDF} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-all">
                <DocumentArrowDownIcon className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">User Name & Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">System ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Assigned Role</th>
                  {activeTab === 'students' && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Batch</th>}
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((user) => (
                  <tr key={user.id || user.username} className="hover:bg-indigo-50/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold border border-indigo-200">
                          {user.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{user.firstName} {user.fatherName}</p>
                          <p className="text-xs text-gray-400">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{user.userId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-white border border-gray-200 text-gray-600">
                        {getUserRole(user)}
                      </span>
                    </td>
                    {activeTab === 'students' && (
                      <td className="px-6 py-4 text-sm text-gray-600">{user.batch || 'N/A'}</td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> to <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of {filteredUsers.length} entries
            </span>
            <div className="flex space-x-1">
              <button 
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-1" /> Prev
              </button>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next <ChevronRightIcon className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementDashboard;