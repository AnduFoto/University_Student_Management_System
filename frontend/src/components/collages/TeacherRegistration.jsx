// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// const TeacherRegistrationForm = () => {
//   const [formData, setFormData] = useState({
//     teacher_id: '',
//     username: '',
//     college_id: '',
//     academic_level: 'BSc'
//   });

//   const [teachers, setTeachers] = useState([]);
//   const [colleges, setColleges] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const [errors, setErrors] = useState({});
//   const [apiStatus, setApiStatus] = useState({ 
//     teachers: 'pending', 
//     colleges: 'pending' 
//   });

//   // Fetch teachers and colleges
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setApiStatus({ teachers: 'loading', colleges: 'loading' });
        
//         // Fetch teachers with role filter
//         console.log('Fetching teachers from:', `${API_BASE_URL}/users/?role=teacher`);
//         const teachersResponse = await axios.get(`${API_BASE_URL}/users/?role=teacher`);
//         console.log('Teachers API response:', teachersResponse);
        
//         let teachersData = [];
//         if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
//           teachersData = teachersResponse.data;
//         } else if (teachersResponse.data && teachersResponse.data.results && Array.isArray(teachersResponse.data.results)) {
//           teachersData = teachersResponse.data.results;
//         } else if (teachersResponse.data && teachersResponse.data.data && Array.isArray(teachersResponse.data.data)) {
//           teachersData = teachersResponse.data.data;
//         }
        
//         // Fallback: If backend filtering didn't work, filter on frontend
//         if (teachersData.length > 0 && teachersData.some(user => user.role !== 'teacher')) {
//           console.log('Backend role filtering not working, filtering on frontend');
//           teachersData = teachersData.filter(user => user.role === 'teacher');
//         }
        
//         setTeachers(teachersData);
//         setApiStatus(prev => ({ 
//           ...prev, 
//           teachers: teachersData.length > 0 ? 'success' : 'empty' 
//         }));
        
//         // Fetch colleges
//         console.log('Fetching colleges from:', `${API_BASE_URL}/collages/colleges/`);
//         const collegesResponse = await axios.get(`${API_BASE_URL}/collages/colleges/`);
//         console.log('Colleges API response:', collegesResponse);
        
//         let collegesData = [];
//         if (collegesResponse.data && Array.isArray(collegesResponse.data)) {
//           collegesData = collegesResponse.data;
//         } else if (collegesResponse.data && collegesResponse.data.results && Array.isArray(collegesResponse.data.results)) {
//           collegesData = collegesResponse.data.results;
//         } else if (collegesResponse.data && collegesResponse.data.data && Array.isArray(collegesResponse.data.data)) {
//           collegesData = collegesResponse.data.data;
//         }
        
//         setColleges(collegesData);
//         setApiStatus(prev => ({ 
//           ...prev, 
//           colleges: collegesData.length > 0 ? 'success' : 'empty' 
//         }));
        
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setMessage('Error loading form data');
//         setApiStatus({ teachers: 'error', colleges: 'error' });
        
//         if (error.response) {
//           console.error('Error response:', error.response);
//           console.error('Error status:', error.response.status);
//           console.error('Error data:', error.response.data);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const generateTeacherId = () => {
//     const randomNum = Math.floor(1000 + Math.random() * 9000);
//     return `DBU${randomNum}`;
//   };

//   const handleGenerateId = () => {
//     setFormData(prev => ({
//       ...prev,
//       teacher_id: generateTeacherId()
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');
//     setErrors({});

//     try {
//       const response = await axios.post(`${API_BASE_URL}/teachers/teachers/`, formData);
      
//       if (response.status === 201) {
//         setMessage('Teacher registered successfully!');
//         setFormData({
//           teacher_id: '',
//           username: '',
//           college_id: '',
//           academic_level: 'BSc'
//         });
        
//         // Refresh teachers list in case new teacher was added
//         const teachersResponse = await axios.get(`${API_BASE_URL}/users/?role=teacher`);
//         let teachersData = [];
//         if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
//           teachersData = teachersResponse.data;
//         } else if (teachersResponse.data && teachersResponse.data.results && Array.isArray(teachersResponse.data.results)) {
//           teachersData = teachersResponse.data.results;
//         }
        
//         // Fallback filtering
//         if (teachersData.length > 0 && teachersData.some(user => user.role !== 'teacher')) {
//           teachersData = teachersData.filter(user => user.role === 'teacher');
//         }
        
//         setTeachers(teachersData);
//       }
//     } catch (error) {
//       if (error.response?.data) {
//         setErrors(error.response.data);
//       } else {
//         setMessage('Error registering teacher');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && !formData.teacher_id) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
//           Teacher Registration
//         </h1>

       

//         {message && (
//           <div className={`mb-4 p-3 rounded-md ${
//             message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
//           }`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Teacher ID Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Teacher ID *
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 name="teacher_id"
//                 value={formData.teacher_id}
//                 onChange={handleChange}
//                 required
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="DBUXXXX"
//               />
//               <button
                
//                 onClick={handleGenerateId}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Generate ID
//               </button>
//             </div>
//             {errors.teacher_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
//             )}
//           </div>

//           {/* Teacher Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Select Teacher *
//             </label>
//             <select
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select a teacher</option>
//               {teachers.length > 0 ? (
//                 teachers.map(user => (
//                   <option key={user.username} value={user.username}>
//                     {user.firstName} {user.fatherName} {user.grandFatherName} 
//                     {user.motherName && ` (${user.motherName})`}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   {apiStatus.teachers === 'loading' ? 'Loading teachers...' : 'No teachers available'}
//                 </option>
//               )}
//             </select>
//             {errors.username && (
//               <p className="mt-1 text-sm text-red-600">{errors.username}</p>
//             )}
//           </div>

//           {/* College Selection */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               College *
//             </label>
//             <select
//               name="college_id"
//               value={formData.college_id}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">Select a college</option>
//               {colleges.length > 0 ? (
//                 colleges.map(college => (
//                   <option key={college.college_id} value={college.college_id}>
//                     {college.college_name}
//                   </option>
//                 ))
//               ) : (
//                 <option value="" disabled>
//                   {apiStatus.colleges === 'loading' ? 'Loading colleges...' : 'No colleges available'}
//                 </option>
//               )}
//             </select>
//             {errors.college_id && (
//               <p className="mt-1 text-sm text-red-600">{errors.college_id}</p>
//             )}
//           </div>

//           {/* Academic Level */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Academic Level *
//             </label>
//             <select
//               name="academic_level"
//               value={formData.academic_level}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="BSc">Bachelor of Science</option>
//               <option value="MSc">Master of Science</option>
//               <option value="PhD">Doctor of Philosophy</option>
//               <option value="Professor">Professor</option>
//             </select>
//             {errors.academic_level && (
//               <p className="mt-1 text-sm text-red-600">{errors.academic_level}</p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <div>
//             <button
             
//               disabled={loading}
//               className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Registering...' : 'Register Teacher'}
//             </button>
//           </div>
//         </form>

//         {/* Teacher Preview */}
//         {formData.username && teachers.length > 0 && (
//           <div className="mt-6 p-4 bg-gray-50 rounded-md">
//             <h3 className="font-semibold text-gray-800 mb-2">Selected Teacher Info:</h3>
//             {(() => {
//               const selectedUser = teachers.find(u => u.username === formData.username);
//               return selectedUser ? (
//                 <div className="text-sm text-gray-600">
//                   <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.fatherName}</p>
//                   <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
//                   <p><strong>Phone:</strong> {selectedUser.phoneNumber || 'N/A'}</p>
//                   <p><strong>Role:</strong> {selectedUser.role || 'N/A'}</p>
//                   <p><strong>User ID:</strong> {selectedUser.userId || 'N/A'}</p>
//                 </div>
//               ) : null;
//             })()}
//           </div>
//         )}

      
//       </div>
//     </div>
//   );
// };

// export default TeacherRegistrationForm;



// components/TeacherRegistrationForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  IdentificationIcon, 
  UserIcon, 
  AcademicCapIcon, 
  BuildingLibraryIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const TeacherRegistrationForm = () => {
  const [formData, setFormData] = useState({
    teacher_id: '',
    username: '',
    college_id: '',
    academic_level: 'BSc'
  });

  const [teachers, setTeachers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [apiStatus, setApiStatus] = useState({ 
    teachers: 'pending', 
    colleges: 'pending' 
  });

  // Fetch teachers and colleges
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setApiStatus({ teachers: 'loading', colleges: 'loading' });
        
        // Fetch teachers with role filter
        console.log('Fetching teachers from:', `${API_BASE_URL}/users/?role=teacher`);
        const teachersResponse = await axios.get(`${API_BASE_URL}/users/?role=teacher`);
        console.log('Teachers API response:', teachersResponse);
        
        let teachersData = [];
        if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
          teachersData = teachersResponse.data;
        } else if (teachersResponse.data && teachersResponse.data.results && Array.isArray(teachersResponse.data.results)) {
          teachersData = teachersResponse.data.results;
        } else if (teachersResponse.data && teachersResponse.data.data && Array.isArray(teachersResponse.data.data)) {
          teachersData = teachersResponse.data.data;
        }
        
        // Fallback: If backend filtering didn't work, filter on frontend
        if (teachersData.length > 0 && teachersData.some(user => user.role !== 'teacher')) {
          console.log('Backend role filtering not working, filtering on frontend');
          teachersData = teachersData.filter(user => user.role === 'teacher');
        }
        
        setTeachers(teachersData);
        setApiStatus(prev => ({ 
          ...prev, 
          teachers: teachersData.length > 0 ? 'success' : 'empty' 
        }));
        
        // Fetch colleges
        console.log('Fetching colleges from:', `${API_BASE_URL}/collages/colleges/`);
        const collegesResponse = await axios.get(`${API_BASE_URL}/collages/colleges/`);
        console.log('Colleges API response:', collegesResponse);
        
        let collegesData = [];
        if (collegesResponse.data && Array.isArray(collegesResponse.data)) {
          collegesData = collegesResponse.data;
        } else if (collegesResponse.data && collegesResponse.data.results && Array.isArray(collegesResponse.data.results)) {
          collegesData = collegesResponse.data.results;
        } else if (collegesResponse.data && collegesResponse.data.data && Array.isArray(collegesResponse.data.data)) {
          collegesData = collegesResponse.data.data;
        }
        
        setColleges(collegesData);
        setApiStatus(prev => ({ 
          ...prev, 
          colleges: collegesData.length > 0 ? 'success' : 'empty' 
        }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error loading form data');
        setApiStatus({ teachers: 'error', colleges: 'error' });
        
        if (error.response) {
          console.error('Error response:', error.response);
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const generateTeacherId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `DBU${randomNum}`;
  };

  const handleGenerateId = () => {
    setFormData(prev => ({
      ...prev,
      teacher_id: generateTeacherId()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    try {
      const response = await axios.post(`${API_BASE_URL}/teachers/teachers/`, formData);
      
      if (response.status === 201) {
        setMessage('Teacher registered successfully!');
        setFormData({
          teacher_id: '',
          username: '',
          college_id: '',
          academic_level: 'BSc'
        });
        
        // Refresh teachers list in case new teacher was added
        const teachersResponse = await axios.get(`${API_BASE_URL}/users/?role=teacher`);
        let teachersData = [];
        if (teachersResponse.data && Array.isArray(teachersResponse.data)) {
          teachersData = teachersResponse.data;
        } else if (teachersResponse.data && teachersResponse.data.results && Array.isArray(teachersResponse.data.results)) {
          teachersData = teachersResponse.data.results;
        }
        
        // Fallback filtering
        if (teachersData.length > 0 && teachersData.some(user => user.role !== 'teacher')) {
          teachersData = teachersData.filter(user => user.role === 'teacher');
        }
        
        setTeachers(teachersData);
      }
    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
      } else {
        setMessage('Error registering teacher');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.teacher_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">Retrieving secure environment configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Header Title Section */}
        <div className="bg-slate-900 px-6 py-6 sm:px-8 text-center sm:text-left border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-2.5">
            <AcademicCapIcon className="h-6 w-6 text-indigo-400" />
            Teacher Registry Assignment
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map existing user records into college department frameworks and register academic ranks.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Status Message System Banner */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl border text-sm flex items-start gap-3 transition-all ${
              message.includes('Error') 
                ? 'bg-rose-50 border-rose-200 text-rose-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              {message.includes('Error') ? (
                <XCircleIcon className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircleIcon className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              )}
              <span className="font-medium">{message}</span>
            </div>
          )}

          {/* Registration Form Context */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Teacher ID Generation Area */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Teacher Assignment ID *
              </label>
              <div className="flex gap-2.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <IdentificationIcon className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    name="teacher_id"
                    value={formData.teacher_id}
                    onChange={handleChange}
                    required
                    className={`pl-9 pr-4 py-2.5 w-full bg-slate-50/50 text-slate-800 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 font-mono ${
                      errors.teacher_id ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                    }`}
                    placeholder="e.g. DBU1234"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGenerateId}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-200 transition active:scale-95 flex-shrink-0"
                >
                  Generate ID
                </button>
              </div>
              {errors.teacher_id && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.teacher_id}
                </p>
              )}
            </div>

            {/* Teacher Dropdown Selection Container */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Base User Account *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="h-4 w-4" />
                </div>
                <select
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={`pl-9 pr-4 py-2.5 w-full bg-slate-50/50 text-slate-800 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none ${
                    errors.username ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <option value="">Choose an eligible user profile</option>
                  {teachers.length > 0 ? (
                    teachers.map(user => (
                      <option key={user.username} value={user.username}>
                        {user.firstName} {user.fatherName} {user.grandFatherName} 
                        {user.motherName && ` (${user.motherName})`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {apiStatus.teachers === 'loading' ? 'Populating structural profiles...' : 'No teacher-role accounts available'}
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.username}
                </p>
              )}
            </div>

            {/* College Infrastructure Selection Option */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Assigned College Domain *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <BuildingLibraryIcon className="h-4 w-4" />
                </div>
                <select
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  required
                  className={`pl-9 pr-4 py-2.5 w-full bg-slate-50/50 text-slate-800 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none ${
                    errors.college_id ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <option value="">Select target university college</option>
                  {colleges.length > 0 ? (
                    colleges.map(college => (
                      <option key={college.college_id} value={college.college_id}>
                        {college.college_name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {apiStatus.colleges === 'loading' ? 'Populating local college nodes...' : 'No institutional college entities found'}
                    </option>
                  )}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.college_id && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.college_id}
                </p>
              )}
            </div>

            {/* Academic Classification Tier Field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Certified Academic Rank Level *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <AcademicCapIcon className="h-4 w-4" />
                </div>
                <select
                  name="academic_level"
                  value={formData.academic_level}
                  onChange={handleChange}
                  required
                  className={`pl-9 pr-4 py-2.5 w-full bg-slate-50/50 text-slate-800 text-sm border rounded-xl focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none ${
                    errors.academic_level ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <option value="BSc">Bachelor of Science (BSc)</option>
                  <option value="MSc">Master of Science (MSc)</option>
                  <option value="PhD">Doctor of Philosophy (PhD)</option>
                  <option value="Professor">Full Academic Professor</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.academic_level && (
                <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                  <span>•</span> {errors.academic_level}
                </p>
              )}
            </div>

            {/* Submit Payload Execution Trigger */}
            <div className="p-1 pt-0 pb-0 w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Committing Registration...
                  </span>
                ) : 'Commit Registration Matrix'}
              </button>
            </div>
          </form>

          {/* Context Dynamic Metadata Live Preview Card */}
          {formData.username && teachers.length > 0 && (
            <div className="mt-6 border border-slate-100 bg-slate-50/70 rounded-xl p-5 transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Metadata Live Blueprint</h3>
              </div>
              {(() => {
                const selectedUser = teachers.find(u => u.username === formData.username);
                return selectedUser ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs font-medium text-slate-600">
                    <p><strong className="text-slate-400 font-normal">Legal Title:</strong> <span className="text-slate-800 font-semibold">{selectedUser.firstName} {selectedUser.fatherName}</span></p>
                    <p><strong className="text-slate-400 font-normal">Secure Tag:</strong> <span className="text-slate-800 font-mono bg-white border border-slate-200/60 px-1.5 py-0.5 rounded text-[11px]">{selectedUser.userId || 'N/A'}</span></p>
                    <p className="sm:col-span-2 truncate"><strong className="text-slate-400 font-normal">Contact Node:</strong> <span className="text-slate-800">{selectedUser.email || 'N/A'}</span></p>
                    <p><strong className="text-slate-400 font-normal">Mobile Line:</strong> <span className="text-slate-800">{selectedUser.phoneNumber || 'N/A'}</span></p>
                    <p><strong className="text-slate-400 font-normal">Assigned System Role:</strong> <span className="text-indigo-600 font-semibold capitalize">{selectedUser.role || 'N/A'}</span></p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Matching reference details could not be found...</p>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default TeacherRegistrationForm;