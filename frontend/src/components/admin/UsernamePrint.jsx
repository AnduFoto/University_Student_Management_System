// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Filter, Download, User, Mail, Building, GraduationCap, Calendar, ChevronDown, ChevronUp, Loader, RefreshCw, AlertCircle } from 'lucide-react';

// // API base URL - adjust according to your Django server
// const API_BASE_URL = 'http://localhost:8000/api';

// const UserManagementDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     search: '',
//     college: '',
//     department: '',
//     batch: '',
//     role: ''
//   });
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
//   const [selectedUsers, setSelectedUsers] = useState(new Set());

//   // Helper function to extract array from API response
//   const extractDataFromResponse = (responseData) => {
//     // Handle different possible response structures
//     if (Array.isArray(responseData)) {
//       return responseData;
//     } else if (responseData && Array.isArray(responseData.results)) {
//       // Django REST framework pagination
//       return responseData.results;
//     } else if (responseData && Array.isArray(responseData.data)) {
//       // Custom pagination structure
//       return responseData.data;
//     } else if (responseData && typeof responseData === 'object') {
//       // Convert object to array if needed
//       return Object.values(responseData);
//     } else {
//       console.warn('Unexpected API response structure:', responseData);
//       return [];
//     }
//   };

//   // Fetch data from APIs with correct endpoints
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch users - from user app
//       const usersResponse = await fetch(`${API_BASE_URL}/users/`);
//       if (!usersResponse.ok) throw new Error(`Failed to fetch users: ${usersResponse.status}`);
//       const usersData = await usersResponse.json();
//       const usersArray = extractDataFromResponse(usersData);
//       setUsers(usersArray);

//       // Fetch students - from student app
//       const studentsResponse = await fetch(`${API_BASE_URL}/students/`);
//       if (!studentsResponse.ok) throw new Error(`Failed to fetch students: ${studentsResponse.status}`);
//       const studentsData = await studentsResponse.json();
//       const studentsArray = extractDataFromResponse(studentsData);
//       setStudents(studentsArray);

//       // Try multiple department endpoints
//       let departmentsArray = [];
//       const departmentEndpoints = [
//         `${API_BASE_URL}/collages/departments/`,
//         `${API_BASE_URL}/departments/`,
//         `${API_BASE_URL}/colleges/departments/`
//       ];

//       for (const endpoint of departmentEndpoints) {
//         try {
//           const response = await fetch(endpoint);
//           if (response.ok) {
//             const data = await response.json();
//             departmentsArray = extractDataFromResponse(data);
//             if (departmentsArray.length > 0) break;
//           }
//         } catch (err) {
//           console.log(`Failed to fetch from ${endpoint}:`, err.message);
//         }
//       }
      
//       if (departmentsArray.length === 0) {
//         console.warn('No departments data found from any endpoint');
//       }
//       setDepartments(departmentsArray);

//       // Try multiple college endpoints
//       let collegesArray = [];
//       const collegeEndpoints = [
//         `${API_BASE_URL}/collages/colleges/`,
//         `${API_BASE_URL}/colleges/`,
//         `${API_BASE_URL}/collages/`
//       ];

//       for (const endpoint of collegeEndpoints) {
//         try {
//           const response = await fetch(endpoint);
//           if (response.ok) {
//             const data = await response.json();
//             collegesArray = extractDataFromResponse(data);
//             if (collegesArray.length > 0) break;
//           }
//         } catch (err) {
//           console.log(`Failed to fetch from ${endpoint}:`, err.message);
//         }
//       }
      
//       if (collegesArray.length === 0) {
//         console.warn('No colleges data found from any endpoint');
//       }
//       setColleges(collegesArray);

//     } catch (err) {
//       setError(err.message);
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Helper function to get full image URL
//   const getFullImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     if (imagePath.startsWith('http')) return imagePath;
//     // Remove leading slash if present
//     const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
//     return `${API_BASE_URL.replace('/api', '')}/${cleanPath}`;
//   };

//   // Combine user data with student, department, and college information
//   const combinedUsers = useMemo(() => {
//     if (!Array.isArray(users)) {
//       console.error('Users is not an array:', users);
//       return [];
//     }

//     return users.map(user => {
//       // Find student data for this user - try matching by username or userId
//       const studentData = Array.isArray(students) ? students.find(student => {
//         // Try different possible matching strategies
//         return (
//           student.username === user.username || 
//           student.username === user.userId ||
//           (student.user && student.user === user.username) ||
//           (student.userId && student.userId === user.userId) ||
//           (student.user_auth && student.user_auth === user.username) ||
//           (student.user && student.user === user.userId)
//         );
//       }) : null;

//       // Get department and college info from student data
//       let departmentName = 'N/A';
//       let collegeName = 'N/A';
//       let departmentId = null;

//       if (studentData && Array.isArray(departments)) {
//         // Try different possible field names for department ID
//         departmentId = studentData.department_id || studentData.department || studentData.departmentId;
        
//         if (departmentId) {
//           const departmentInfo = departments.find(dept => 
//             dept.department_id === departmentId || 
//             dept.id === departmentId ||
//             dept.pk === departmentId ||
//             dept.department_id === departmentId.toString()
//           );
          
//           if (departmentInfo) {
//             departmentName = departmentInfo.department_name || departmentInfo.name || departmentInfo.department_name || 'N/A';
            
//             // Get college info
//             const collegeId = departmentInfo.college_id || departmentInfo.college;
//             if (collegeId && Array.isArray(colleges)) {
//               const collegeInfo = colleges.find(college => 
//                 college.college_id === collegeId || 
//                 college.id === collegeId ||
//                 college.pk === collegeId ||
//                 college.college_id === collegeId.toString()
//               );
//               if (collegeInfo) {
//                 collegeName = collegeInfo.college_name || collegeInfo.name || collegeInfo.college_name || 'N/A';
//               }
//             }
//           }
//         }
//       }

//       // Generate full name based on available fields
//       const fullName = [user.firstName, user.fatherName, user.grandFatherName]
//         .filter(name => name && name.trim() !== '')
//         .join(' ') || 'Unknown User';

//       return {
//         ...user,
//         studentData,
//         department: departmentName,
//         college: collegeName,
//         batch: user.batch || (studentData ? studentData.batch : 'N/A'),
//         year: studentData ? studentData.year : 'N/A',
//         semester: studentData ? studentData.semester : 'N/A',
//         fullName: fullName,
//         // Generate email if not available
//         email: user.email || `${user.username || 'user'}@university.edu`,
//         // Get full image URL
//         picture: getFullImageUrl(user.picture) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || 'User')}+${encodeURIComponent(user.fatherName || 'Name')}&background=random&size=150`
//       };
//     });
//   }, [users, students, departments, colleges]);

//   // Extract unique filter options
//   const filterOptions = useMemo(() => {
//     if (!Array.isArray(combinedUsers)) {
//       return { colleges: [], departments: [], batches: [], roles: [] };
//     }

//     const collegesList = [...new Set(combinedUsers.map(user => user.college).filter(college => college && college !== 'N/A'))];
//     const departmentsList = [...new Set(combinedUsers.map(user => user.department).filter(dept => dept && dept !== 'N/A'))];
//     const batchesList = [...new Set(combinedUsers.map(user => user.batch).filter(batch => batch && batch !== 'N/A'))];
//     const rolesList = [...new Set(combinedUsers.map(user => user.role).filter(role => role && role !== 'N/A'))];
    
//     return { 
//       colleges: collegesList, 
//       departments: departmentsList, 
//       batches: batchesList, 
//       roles: rolesList 
//     };
//   }, [combinedUsers]);

//   // Filter and sort users
//   const filteredUsers = useMemo(() => {
//     if (!Array.isArray(combinedUsers)) {
//       return [];
//     }

//     let filtered = combinedUsers.filter(user => {
//       const searchTerm = filters.search.toLowerCase();
//       const matchesSearch = 
//         (user.firstName && user.firstName.toLowerCase().includes(searchTerm)) ||
//         (user.userId && user.userId.toLowerCase().includes(searchTerm)) ||
//         (user.username && user.username.toLowerCase().includes(searchTerm)) ||
//         (user.fatherName && user.fatherName.toLowerCase().includes(searchTerm)) ||
//         (user.grandFatherName && user.grandFatherName.toLowerCase().includes(searchTerm)) ||
//         (user.fullName && user.fullName.toLowerCase().includes(searchTerm));

//       const matchesCollege = !filters.college || user.college === filters.college;
//       const matchesDepartment = !filters.department || user.department === filters.department;
//       const matchesBatch = !filters.batch || user.batch === filters.batch;
//       const matchesRole = !filters.role || user.role === filters.role;

//       return matchesSearch && matchesCollege && matchesDepartment && matchesBatch && matchesRole;
//     });

//     // Sorting
//     if (sortConfig.key) {
//       filtered.sort((a, b) => {
//         const aVal = a[sortConfig.key] || '';
//         const bVal = b[sortConfig.key] || '';
        
//         if (aVal < bVal) {
//           return sortConfig.direction === 'asc' ? -1 : 1;
//         }
//         if (aVal > bVal) {
//           return sortConfig.direction === 'asc' ? 1 : -1;
//         }
//         return 0;
//       });
//     }

//     return filtered;
//   }, [combinedUsers, filters, sortConfig]);

//   const handleSort = (key) => {
//     setSortConfig(current => ({
//       key,
//       direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const handleSelectUser = (username) => {
//     setSelectedUsers(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(username)) {
//         newSet.delete(username);
//       } else {
//         newSet.add(username);
//       }
//       return newSet;
//     });
//   };

//   const selectAllUsers = () => {
//     if (selectedUsers.size === filteredUsers.length) {
//       setSelectedUsers(new Set());
//     } else {
//       setSelectedUsers(new Set(filteredUsers.map(user => user.username)));
//     }
//   };

//   const exportToCSV = () => {
//     const headers = ['User ID', 'Full Name', 'Username', 'Department', 'College', 'Batch', 'Role', 'Username', 'Phone Number', 'Gender'];
//     const data = filteredUsers.map(user => [
//       user.userId || 'N/A',
//       user.fullName,
//       user.username || 'N/A',
//       user.department || 'N/A',
//       user.college || 'N/A',
//       user.batch || 'N/A',
//       user.role || 'N/A',
//       user.email || 'N/A',
//       user.phoneNumber || 'N/A',
//       user.gender || 'N/A'
//     ]);

//     const csvContent = [
//       headers.join(','),
//       ...data.map(row => row.map(field => `"${field}"`).join(','))
//     ].join('\n');

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   const exportToPDF = async () => {
//     const printWindow = window.open('', '_blank');
    
//     const tableContent = filteredUsers.map(user => `
//       <tr>
//         <td class="border px-4 py-2">${user.userId || 'N/A'}</td>
//         <td class="border px-4 py-2">${user.fullName}</td>
//         <td class="border px-4 py-2">${user.username || 'N/A'}</td>
//         <td class="border px-4 py-2">${user.department || 'N/A'}</td>
//         <td class="border px-4 py-2">${user.college || 'N/A'}</td>
//         <td class="border px-4 py-2">${user.batch || 'N/A'}</td>
//         <td class="border px-4 py-2">${user.role || 'N/A'}</td>
//       </tr>
//     `).join('');

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Users Export</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @media print {
//               body { margin: 0; }
//               .no-print { display: none; }
//             }
//           </style>
//         </head>
//         <body class="p-6">
//           <div class="no-print mb-4">
//             <button onclick="window.print()" class="bg-blue-600 text-white px-4 py-2 rounded">Print PDF</button>
//             <button onclick="window.close()" class="bg-gray-600 text-white px-4 py-2 rounded ml-2">Close</button>
//           </div>
//           <h1 class="text-2xl font-bold mb-4">Users Export - ${new Date().toLocaleDateString()}</h1>
//           <table class="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr class="bg-gray-100">
//                 <th class="border px-4 py-2 text-left">User ID</th>
//                 <th class="border px-4 py-2 text-left">Full Name</th>
//                 <th class="border px-4 py-2 text-left">Username</th>
//                 <th class="border px-4 py-2 text-left">Department</th>
//                 <th class="border px-4 py-2 text-left">College</th>
//                 <th class="border px-4 py-2 text-left">Batch</th>
//                 <th class="border px-4 py-2 text-left">Role</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${tableContent}
//             </tbody>
//           </table>
//           <div class="mt-4 text-sm text-gray-600">
//             Generated on: ${new Date().toLocaleString()}<br>
//             Total Users: ${filteredUsers.length}
//           </div>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       college: '',
//       department: '',
//       batch: '',
//       role: ''
//     });
//   };

//   const SortIcon = ({ columnKey }) => {
//     if (sortConfig.key !== columnKey) return <ChevronDown className="w-4 h-4 opacity-30" />;
//     return sortConfig.direction === 'asc' ? 
//       <ChevronUp className="w-4 h-4" /> : 
//       <ChevronDown className="w-4 h-4" />;
//   };

//   const retryFetch = () => {
//     fetchData();
//   };

//   // Debug: Log the API responses to understand the structure
//   useEffect(() => {
//     if (!loading && !error) {
//       console.log('Users data structure:', users);
//       console.log('Students data structure:', students);
//       console.log('Departments data structure:', departments);
//       console.log('Colleges data structure:', colleges);
//     }
//   }, [loading, error, users, students, departments, colleges]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Loading user data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md">
//           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="space-y-2 mb-4 text-sm text-gray-500">
//             <p>Check browser console for detailed API response structure.</p>
//           </div>
//           <button
//             onClick={retryFetch}
//             className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
//               <p className="text-gray-600">Manage and export user information from the system</p>
//               <p className="text-sm text-gray-500 mt-1">
//                 Loaded: {users.length} users, {students.length} students, {departments.length} departments, {colleges.length} colleges
//               </p>
//             </div>
//             <button
//               onClick={fetchData}
//               className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               <RefreshCw className="w-4 h-4 mr-2" />
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <User className="w-6 h-6 text-blue-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Total Users</p>
//                 <p className="text-2xl font-bold text-gray-900">{users.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <GraduationCap className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Students</p>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {users.filter(u => u.role === 'student').length}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <Building className="w-6 h-6 text-purple-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Colleges</p>
//                 <p className="text-2xl font-bold text-gray-900">{colleges.length}</p>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center">
//               <div className="p-3 bg-orange-100 rounded-lg">
//                 <Calendar className="w-6 h-6 text-orange-600" />
//               </div>
//               <div className="ml-4">
//                 <p className="text-sm font-medium text-gray-600">Departments</p>
//                 <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters and Actions */}
//         <div className="bg-white rounded-lg shadow mb-6">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex flex-col lg:flex-row gap-4">
//               {/* Search */}
//               <div className="flex-1">
//                 <div className="relative">
//                   <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     placeholder="Search users by name, ID, username, or father name..."
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     value={filters.search}
//                     onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
//                   />
//                 </div>
//               </div>

//               {/* Export Buttons */}
//               <div className="flex gap-2">
//                 <button
//                   onClick={exportToCSV}
//                   disabled={filteredUsers.length === 0}
//                   className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   CSV
//                 </button>
//                 <button
//                   onClick={exportToPDF}
//                   disabled={filteredUsers.length === 0}
//                   className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <Download className="w-4 h-4 mr-2" />
//                   PDF
//                 </button>
//               </div>
//             </div>

//             {/* Filter Row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
//               <select
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.college}
//                 onChange={(e) => setFilters(prev => ({ ...prev, college: e.target.value }))}
//               >
//                 <option value="">All Colleges</option>
//                 {filterOptions.colleges.map(college => (
//                   <option key={college} value={college}>{college}</option>
//                 ))}
//               </select>

//               <select
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.department}
//                 onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
//               >
//                 <option value="">All Departments</option>
//                 {filterOptions.departments.map(dept => (
//                   <option key={dept} value={dept}>{dept}</option>
//                 ))}
//               </select>

//               <select
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.batch}
//                 onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
//               >
//                 <option value="">All Batches</option>
//                 {filterOptions.batches.map(batch => (
//                   <option key={batch} value={batch}>{batch}</option>
//                 ))}
//               </select>

//               <select
//                 className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={filters.role}
//                 onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
//               >
//                 <option value="">All Roles</option>
//                 {filterOptions.roles.map(role => (
//                   <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Clear Filters */}
//             {(filters.college || filters.department || filters.batch || filters.role || filters.search) && (
//               <div className="mt-4">
//                 <button
//                   onClick={clearFilters}
//                   className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                 >
//                   Clear all filters
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Results Count */}
//           <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
//             <div className="flex justify-between items-center">
//               <p className="text-sm text-gray-600">
//                 Showing {filteredUsers.length} of {users.length} users
//                 {filters.search && ` for "${filters.search}"`}
//               </p>
//               <div className="flex items-center space-x-4">
//                 <span className="text-sm text-gray-600">
//                   {selectedUsers.size} selected
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Users Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
                
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Full Name
//                   </th>
               
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('role')}
//                   >
//                     <div className="flex items-center space-x-1">
//                       <span>Username</span>
//                       <SortIcon columnKey="username" />
//                     </div>
//                   </th>
//                   <th 
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                     onClick={() => handleSort('role')}
//                   >
//                     <div className="flex items-center space-x-1">
//                       <span>Role</span>
//                       <SortIcon columnKey="role" />
//                     </div>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredUsers.map((user) => (
//                   <tr 
//                     key={user.username} 
//                     className="hover:bg-gray-50 transition-colors"
//                   >
                 
                   
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <img
//                           className="h-10 w-10 rounded-full object-cover"
//                           src={user.picture}
//                           alt={user.fullName}
//                           onError={(e) => {
//                             e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || 'User')}+${encodeURIComponent(user.fatherName || 'Name')}&background=random&size=150`;
//                           }}
//                         />
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {user.fullName}
//                           </div>
                        
//                           {user.phoneNumber && (
//                             <div className="text-sm text-gray-500">
//                               📞 {user.phoneNumber}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {/* <div className="text-sm font-medium text-gray-900">{user.userId || 'N/A'}</div> */}
//                       <div className="text-sm text-gray-500">{user.username}</div>
//                     </td>
                   
                   
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         user.role === 'student' ? 'bg-green-100 text-green-800' :
//                         user.role === 'teacher' ? 'bg-purple-100 text-purple-800' :
//                         user.role === 'admin' ? 'bg-red-100 text-red-800' :
//                         'bg-gray-100 text-gray-800'
//                       }`}>
//                         {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Empty State */}
//           {filteredUsers.length === 0 && (
//             <div className="text-center py-12">
//               <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
//               <p className="text-gray-500">Try adjusting your search or filters</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserManagementDashboard;


// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Download, User, Building, GraduationCap, Calendar, ChevronDown, ChevronUp, Loader, RefreshCw, AlertCircle, Users, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';

// const UserManagementDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Keep your existing filter state
//   const [filters, setFilters] = useState({
//     search: '',
//     college: '',
//     department: '',
//     batch: '',
//     role: ''
//   });

//   // Pagination Logic (Added)
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;

//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//   // --- LOGIC PRESERVED: Data Fetching ---
//   const extractDataFromResponse = (responseData) => {
//     if (Array.isArray(responseData)) return responseData;
//     if (responseData && Array.isArray(responseData.results)) return responseData.results;
//     if (responseData && Array.isArray(responseData.data)) return responseData.data;
//     return responseData && typeof responseData === 'object' ? Object.values(responseData) : [];
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [uRes, sRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/users/`),
//         fetch(`${API_BASE_URL}/students/`)
//       ]);
//       if (!uRes.ok || !sRes.ok) throw new Error("Server communication error");
      
//       const uData = await uRes.json();
//       const sData = await sRes.json();
//       setUsers(extractDataFromResponse(uData));
//       setStudents(extractDataFromResponse(sData));

//       // Attempt dept/college fetches (preserved endpoint loop)
//       const dEndpoints = [`${API_BASE_URL}/departments/`, `${API_BASE_URL}/collages/departments/` ];
//       for (const ep of dEndpoints) {
//         const res = await fetch(ep);
//         if (res.ok) {
//           setDepartments(extractDataFromResponse(await res.json()));
//           break;
//         }
//       }
      
//       const cEndpoints = [`${API_BASE_URL}/colleges/`, `${API_BASE_URL}/collages/colleges/` ];
//       for (const ep of cEndpoints) {
//         const res = await fetch(ep);
//         if (res.ok) {
//           setColleges(extractDataFromResponse(await res.json()));
//           break;
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // --- LOGIC PRESERVED: Data Combination ---
//   const combinedUsers = useMemo(() => {
//     if (!Array.isArray(users)) return [];
//     return users.map(user => {
//       const studentData = Array.isArray(students) ? students.find(s => s.username === user.username || s.username === user.userId) : null;
//       let deptName = 'N/A', collName = 'N/A';
      
//       const dId = studentData?.department_id || studentData?.department;
//       if (dId && departments.length) {
//         const dInfo = departments.find(d => d.id === dId || d.department_id === dId);
//         if (dInfo) {
//           deptName = dInfo.name || dInfo.department_name || 'N/A';
//           const cId = dInfo.college_id || dInfo.college;
//           const cInfo = colleges.find(c => c.id === cId || c.college_id === cId);
//           if (cInfo) collName = cInfo.name || cInfo.college_name || 'N/A';
//         }
//       }

//       return {
//         ...user,
//         department: deptName,
//         college: collName,
//         batch: user.batch || studentData?.batch || 'N/A',
//         fullName: [user.firstName, user.fatherName, user.grandFatherName].filter(Boolean).join(' ') || 'Unknown',
//         picture: user.picture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}&background=random`
//       };
//     });
//   }, [users, students, departments, colleges]);

//   // --- LOGIC PRESERVED: Filtering & Sorting ---
//   const filteredUsers = useMemo(() => {
//     let result = combinedUsers.filter(u => {
//       const s = filters.search.toLowerCase();
//       const matchSearch = u.fullName.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s);
//       const matchCol = !filters.college || u.college === filters.college;
//       const matchDep = !filters.department || u.department === filters.department;
//       const matchBatch = !filters.batch || u.batch === filters.batch;
//       const matchRole = !filters.role || u.role === filters.role;
//       return matchSearch && matchCol && matchDep && matchBatch && matchRole;
//     });

//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         const aV = a[sortConfig.key] || ''; const bV = b[sortConfig.key] || '';
//         return sortConfig.direction === 'asc' ? (aV < bV ? -1 : 1) : (aV > bV ? -1 : 1);
//       });
//     }
//     return result;
//   }, [combinedUsers, filters, sortConfig]);

//   // Pagination Helper
//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredUsers.slice(start, start + itemsPerPage);
//   }, [filteredUsers, currentPage]);

//   useEffect(() => { setCurrentPage(1); }, [filters]);

//   // Extract filter options (Logic preserved)
//   const filterOptions = useMemo(() => ({
//     colleges: [...new Set(combinedUsers.map(u => u.college).filter(c => c !== 'N/A'))],
//     departments: [...new Set(combinedUsers.map(u => u.department).filter(d => d !== 'N/A'))],
//     batches: [...new Set(combinedUsers.map(u => u.batch).filter(b => b !== 'N/A'))],
//     roles: [...new Set(combinedUsers.map(u => u.role).filter(r => r !== 'N/A'))]
//   }), [combinedUsers]);

//   if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader className="animate-spin text-blue-600" /></div>;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Modern Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
//               <Users className="w-6 h-6 text-blue-600" />
//               Academic Directory
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">Manage and export institutional user records</p>
//           </div>
//           <div className="flex gap-2">
//              <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
//                <RefreshCw className="w-4 h-4 text-slate-600" />
//              </button>
//              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
//                <Download className="w-4 h-4" /> Export Data
//              </button>
//           </div>
//         </div>

//         {/* Integrated Filter Bar */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
//             <div className="relative lg:col-span-1">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input 
//                 type="text" placeholder="Search identity..."
//                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
//                 value={filters.search} onChange={e => setFilters(p => ({...p, search: e.target.value}))}
//               />
//             </div>
            
//             {[
//               { key: 'college', label: 'All Colleges', options: filterOptions.colleges },
//               { key: 'department', label: 'All Departments', options: filterOptions.departments },
//               { key: 'batch', label: 'All Batches', options: filterOptions.batches },
//               { key: 'role', label: 'All Roles', options: filterOptions.roles }
//             ].map(f => (
//               <select 
//                 key={f.key}
//                 className="bg-slate-50 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 cursor-pointer"
//                 value={filters[f.key]} onChange={e => setFilters(p => ({...p, [f.key]: e.target.value}))}
//               >
//                 <option value="">{f.label}</option>
//                 {f.options.map(opt => <option key={opt} value={opt}>{opt.toUpperCase()}</option>)}
//               </select>
//             ))}
//           </div>
//         </div>

//         {/* Main Data Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity & Username</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Affiliation</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">System Role</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {paginatedUsers.map((user) => (
//                   <tr key={user.username} className="hover:bg-slate-50/80 transition-colors group">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <img className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" src={user.picture} alt="" />
//                         <div>
//                           <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
//                           <p className="text-xs font-mono text-slate-400">@{user.username}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">{user.college}</p>
//                       <p className="text-xs text-slate-500 font-medium">{user.department}</p>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{user.batch}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
//                         user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
//                         user.role === 'teacher' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
//                         'bg-emerald-50 text-emerald-600 border-emerald-100'
//                       }`}>
//                         {user.role || 'User'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination Footer */}
//           <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//             <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
//               Page <span className="text-slate-800">{currentPage}</span> of <span className="text-slate-800">{totalPages || 1}</span>
//             </p>
//             <div className="flex items-center gap-2">
//               <button 
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//                 className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
//               >
//                 <ChevronLeft className="w-4 h-4" />
//               </button>
//               <button 
//                 disabled={currentPage === totalPages || totalPages === 0}
//                 onClick={() => setCurrentPage(p => p + 1)}
//                 className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
//               >
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Empty State */}
//         {filteredUsers.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100 mt-6">
//             <X className="w-10 h-10 text-slate-200 mx-auto mb-2" />
//             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No results found matching your criteria</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagementDashboard;



// import React, { useState, useEffect, useMemo } from 'react';
// import { Search, Download, Users, RefreshCw, ChevronLeft, ChevronRight, X, Loader, Building, GraduationCap, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

// const API_BASE_URL = 'http://localhost:8000/api';

// const UserManagementDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const [filters, setFilters] = useState({
//     search: '',
//     college: '',
//     department: '',
//     batch: '',
//     role: ''
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8;
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//   // --- LOGIC PRESERVED: Data Extraction ---
//   const extractDataFromResponse = (responseData) => {
//     if (Array.isArray(responseData)) return responseData;
//     if (responseData && Array.isArray(responseData.results)) return responseData.results;
//     if (responseData && Array.isArray(responseData.data)) return responseData.data;
//     return responseData && typeof responseData === 'object' ? Object.values(responseData) : [];
//   };

//   // --- LOGIC PRESERVED: Data Fetching ---
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const [uRes, sRes] = await Promise.all([
//         fetch(`${API_BASE_URL}/users/`),
//         fetch(`${API_BASE_URL}/students/`)
//       ]);
      
//       const uData = await uRes.json();
//       const sData = await sRes.json();
//       setUsers(extractDataFromResponse(uData));
//       setStudents(extractDataFromResponse(sData));

//       const dEndpoints = [`${API_BASE_URL}/departments/`, `${API_BASE_URL}/collages/departments/` ];
//       for (const ep of dEndpoints) {
//         const res = await fetch(ep);
//         if (res.ok) {
//           setDepartments(extractDataFromResponse(await res.json()));
//           break;
//         }
//       }
      
//       const cEndpoints = [`${API_BASE_URL}/colleges/`, `${API_BASE_URL}/collages/colleges/` ];
//       for (const ep of cEndpoints) {
//         const res = await fetch(ep);
//         if (res.ok) {
//           setColleges(extractDataFromResponse(await res.json()));
//           break;
//         }
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   // --- LOGIC PRESERVED: Data Combination ---
//   const combinedUsers = useMemo(() => {
//     if (!Array.isArray(users)) return [];
//     return users.map(user => {
//       const studentData = Array.isArray(students) ? students.find(s => s.username === user.username || s.username === user.userId) : null;
//       let deptName = 'N/A', collName = 'N/A';
      
//       const dId = studentData?.department_id || studentData?.department;
//       if (dId && departments.length) {
//         const dInfo = departments.find(d => d.id === dId || d.department_id === dId);
//         if (dInfo) {
//           deptName = dInfo.name || dInfo.department_name || 'N/A';
//           const cId = dInfo.college_id || dInfo.college;
//           const cInfo = colleges.find(c => c.id === cId || c.college_id === cId);
//           if (cInfo) collName = cInfo.name || cInfo.college_name || 'N/A';
//         }
//       }

//       return {
//         ...user,
//         department: deptName,
//         college: collName,
//         batch: user.batch || studentData?.batch || 'N/A',
//         fullName: [user.firstName, user.fatherName, user.grandFatherName].filter(Boolean).join(' ') || 'Unknown',
//         picture: user.picture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}&background=random`
//       };
//     });
//   }, [users, students, departments, colleges]);

//   // --- LOGIC PRESERVED: Filtering & Sorting ---
//   const filteredUsers = useMemo(() => {
//     let result = combinedUsers.filter(u => {
//       const s = filters.search.toLowerCase();
//       const matchSearch = u.fullName.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s);
//       const matchCol = !filters.college || u.college === filters.college;
//       const matchDep = !filters.department || u.department === filters.department;
//       const matchBatch = !filters.batch || u.batch === filters.batch;
//       const matchRole = !filters.role || u.role === filters.role;
//       return matchSearch && matchCol && matchDep && matchBatch && matchRole;
//     });

//     if (sortConfig.key) {
//       result.sort((a, b) => {
//         const aV = a[sortConfig.key] || ''; const bV = b[sortConfig.key] || '';
//         return sortConfig.direction === 'asc' ? (aV < bV ? -1 : 1) : (aV > bV ? -1 : 1);
//       });
//     }
//     return result;
//   }, [combinedUsers, filters, sortConfig]);

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const paginatedUsers = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredUsers.slice(start, start + itemsPerPage);
//   }, [filteredUsers, currentPage]);

//   useEffect(() => { setCurrentPage(1); }, [filters]);

//   const filterOptions = useMemo(() => ({
//     colleges: [...new Set(combinedUsers.map(u => u.college).filter(c => c !== 'N/A'))],
//     departments: [...new Set(combinedUsers.map(u => u.department).filter(d => d !== 'N/A'))],
//     batches: [...new Set(combinedUsers.map(u => u.batch).filter(b => b !== 'N/A'))],
//     roles: [...new Set(combinedUsers.map(u => u.role).filter(r => r !== 'N/A'))]
//   }), [combinedUsers]);

//   if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader className="animate-spin text-blue-600" /></div>;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
//               <Users className="w-6 h-6 text-blue-600" />
//               Username
//             </h1>
//             <p className="text-slate-500 text-sm font-medium">Directory management and data export</p>
//           </div>
//           <div className="flex gap-2">
//              <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"><RefreshCw size={18}/></button>
//              <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200"><Download size={16}/> Export CSV</button>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
//             <div className="relative lg:col-span-1">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input 
//                 type="text" placeholder="Search by name..."
//                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
//                 value={filters.search} onChange={e => setFilters(p => ({...p, search: e.target.value}))}
//               />
//             </div>
//             {Object.entries(filterOptions).map(([key, opts]) => (
//               <select 
//                 key={key}
//                 className="bg-slate-50 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500"
//                 value={filters[key.slice(0, -1)]} 
//                 onChange={e => setFilters(p => ({...p, [key.slice(0, -1)]: e.target.value}))}
//               >
//                 <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
//                 {opts.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
//               </select>
//             ))}
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-slate-50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
//                   <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {paginatedUsers.map((user) => (
//                   <tr key={user.username} className="hover:bg-slate-50/80 transition-colors">
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src={user.picture} alt="" />
//                         <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{user.username}</span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{user.batch}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
//                         user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
//                         user.role === 'teacher' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
//                         'bg-emerald-50 text-emerald-600 border-emerald-100'
//                       }`}>
//                         {user.role || 'User'}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Footer */}
//           <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
//             <p className="text-xs font-bold text-slate-400 uppercase">Page {currentPage} of {totalPages || 1}</p>
//             <div className="flex gap-2">
//               <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><ChevronLeft size={16}/></button>
//               <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30"><ChevronRight size={16}/></button>
//             </div>
//           </div>
//         </div>

//         {filteredUsers.length === 0 && (
//           <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100 mt-6">
//             <X className="w-10 h-10 text-slate-200 mx-auto mb-2" />
//             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserManagementDashboard;




import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Download, Users, RefreshCw, ChevronLeft, ChevronRight, 
  X, Loader, Building, GraduationCap, Calendar, ChevronDown, ChevronUp 
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    college: '',
    department: '',
    batch: '',
    role: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // --- NEW LOGIC: CSV Export ---
  const exportToCSV = () => {
    if (filteredUsers.length === 0) return;

    // Define headers
    const headers = ['Full Name', 'Username', 'Role', 'Batch', 'College', 'Department'];
    
    // Map data to rows
    const rows = filteredUsers.map(u => [
      u.fullName,
      u.username,
      u.role || 'User',
      u.batch,
      u.college,
      u.department
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(value => `"${value}"`).join(','))
    ].join('\n');

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `user_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- LOGIC PRESERVED: Data Extraction ---
  const extractDataFromResponse = (responseData) => {
    if (Array.isArray(responseData)) return responseData;
    if (responseData && Array.isArray(responseData.results)) return responseData.results;
    if (responseData && Array.isArray(responseData.data)) return responseData.data;
    return responseData && typeof responseData === 'object' ? Object.values(responseData) : [];
  };

  // --- LOGIC PRESERVED: Data Fetching ---
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [uRes, sRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users/`),
        fetch(`${API_BASE_URL}/students/`)
      ]);
      
      const uData = await uRes.json();
      const sData = await sRes.json();
      setUsers(extractDataFromResponse(uData));
      setStudents(extractDataFromResponse(sData));

      const dEndpoints = [`${API_BASE_URL}/departments/`, `${API_BASE_URL}/collages/departments/` ];
      for (const ep of dEndpoints) {
        const res = await fetch(ep);
        if (res.ok) {
          setDepartments(extractDataFromResponse(await res.json()));
          break;
        }
      }
      
      const cEndpoints = [`${API_BASE_URL}/colleges/`, `${API_BASE_URL}/collages/colleges/` ];
      for (const ep of cEndpoints) {
        const res = await fetch(ep);
        if (res.ok) {
          setColleges(extractDataFromResponse(await res.json()));
          break;
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- LOGIC PRESERVED: Data Combination ---
  const combinedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.map(user => {
      const studentData = Array.isArray(students) ? students.find(s => s.username === user.username || s.username === user.userId) : null;
      let deptName = 'N/A', collName = 'N/A';
      
      const dId = studentData?.department_id || studentData?.department;
      if (dId && departments.length) {
        const dInfo = departments.find(d => d.id === dId || d.department_id === dId);
        if (dInfo) {
          deptName = dInfo.name || dInfo.department_name || 'N/A';
          const cId = dInfo.college_id || dInfo.college;
          const cInfo = colleges.find(c => c.id === cId || c.college_id === cId);
          if (cInfo) collName = cInfo.name || cInfo.college_name || 'N/A';
        }
      }

      return {
        ...user,
        department: deptName,
        college: collName,
        batch: user.batch || studentData?.batch || 'N/A',
        fullName: [user.firstName, user.fatherName, user.grandFatherName].filter(Boolean).join(' ') || 'Unknown',
        picture: user.picture || `https://ui-avatars.com/api/?name=${user.firstName || 'U'}&background=random`
      };
    });
  }, [users, students, departments, colleges]);

  // --- LOGIC PRESERVED: Filtering & Sorting ---
  const filteredUsers = useMemo(() => {
    let result = combinedUsers.filter(u => {
      const s = filters.search.toLowerCase();
      const matchSearch = u.fullName.toLowerCase().includes(s) || u.username?.toLowerCase().includes(s);
      const matchCol = !filters.college || u.college === filters.college;
      const matchDep = !filters.department || u.department === filters.department;
      const matchBatch = !filters.batch || u.batch === filters.batch;
      const matchRole = !filters.role || u.role === filters.role;
      return matchSearch && matchCol && matchDep && matchBatch && matchRole;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aV = a[sortConfig.key] || ''; const bV = b[sortConfig.key] || '';
        return sortConfig.direction === 'asc' ? (aV < bV ? -1 : 1) : (aV > bV ? -1 : 1);
      });
    }
    return result;
  }, [combinedUsers, filters, sortConfig]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [filters]);

  const filterOptions = useMemo(() => ({
    colleges: [...new Set(combinedUsers.map(u => u.college).filter(c => c !== 'N/A'))],
    departments: [...new Set(combinedUsers.map(u => u.department).filter(d => d !== 'N/A'))],
    batches: [...new Set(combinedUsers.map(u => u.batch).filter(b => b !== 'N/A'))],
    roles: [...new Set(combinedUsers.map(u => u.role).filter(r => r !== 'N/A'))]
  }), [combinedUsers]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              User Directory
            </h1>
            <p className="text-slate-500 text-sm font-medium">Manage records and download reports</p>
          </div>
          <div className="flex gap-2">
             <button onClick={fetchData} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all active:scale-95"><RefreshCw size={18}/></button>
             <button 
                onClick={exportToCSV}
                disabled={filteredUsers.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               <Download size={16}/> Export CSV
             </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="relative lg:col-span-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" placeholder="Search by name..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                value={filters.search} onChange={e => setFilters(p => ({...p, search: e.target.value}))}
              />
            </div>
            {Object.entries(filterOptions).map(([key, opts]) => (
              <select 
                key={key}
                className="bg-slate-50 border-none rounded-xl text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={filters[key.slice(0, -1)]} 
                onChange={e => setFilters(p => ({...p, [key.slice(0, -1)]: e.target.value}))}
              >
                <option value="">All {key.charAt(0).toUpperCase() + key.slice(1)}</option>
                {opts.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedUsers.map((user) => (
                  <tr key={user.username} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" src={user.picture} alt="" />
                        <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{user.username}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{user.batch}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        user.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        user.role === 'teacher' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer / Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Showing {filteredUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} Results
            </p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronLeft size={16}/></button>
              <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-all"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-100 mt-6">
            <X className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No matching records found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementDashboard;