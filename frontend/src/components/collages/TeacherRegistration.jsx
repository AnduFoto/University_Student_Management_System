import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    return `TECH${randomNum}`;
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Teacher Registration
        </h1>

       

        {message && (
          <div className={`mb-4 p-3 rounded-md ${
            message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Teacher ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teacher ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                required
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="TECHXXXX"
              />
              <button
                type="button"
                onClick={handleGenerateId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Generate ID
              </button>
            </div>
            {errors.teacher_id && (
              <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
            )}
          </div>

          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Teacher *
            </label>
            <select
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a teacher</option>
              {teachers.length > 0 ? (
                teachers.map(user => (
                  <option key={user.username} value={user.username}>
                    {user.firstName} {user.fatherName} {user.grandFatherName} 
                    {user.motherName && ` (${user.motherName})`}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {apiStatus.teachers === 'loading' ? 'Loading teachers...' : 'No teachers available'}
                </option>
              )}
            </select>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* College Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              College *
            </label>
            <select
              name="college_id"
              value={formData.college_id}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a college</option>
              {colleges.length > 0 ? (
                colleges.map(college => (
                  <option key={college.college_id} value={college.college_id}>
                    {college.college_name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {apiStatus.colleges === 'loading' ? 'Loading colleges...' : 'No colleges available'}
                </option>
              )}
            </select>
            {errors.college_id && (
              <p className="mt-1 text-sm text-red-600">{errors.college_id}</p>
            )}
          </div>

          {/* Academic Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Level *
            </label>
            <select
              name="academic_level"
              value={formData.academic_level}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BSc">Bachelor of Science</option>
              <option value="MSc">Master of Science</option>
              <option value="PhD">Doctor of Philosophy</option>
              <option value="Professor">Professor</option>
            </select>
            {errors.academic_level && (
              <p className="mt-1 text-sm text-red-600">{errors.academic_level}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
             
              disabled={loading}
              className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Registering...' : 'Register Teacher'}
            </button>
          </div>
        </form>

        {/* Teacher Preview */}
        {formData.username && teachers.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-2">Selected Teacher Info:</h3>
            {(() => {
              const selectedUser = teachers.find(u => u.username === formData.username);
              return selectedUser ? (
                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.fatherName}</p>
                  <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedUser.phoneNumber || 'N/A'}</p>
                  <p><strong>Role:</strong> {selectedUser.role || 'N/A'}</p>
                  <p><strong>User ID:</strong> {selectedUser.userId || 'N/A'}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}

      
      </div>
    </div>
  );
};

export default TeacherRegistrationForm;