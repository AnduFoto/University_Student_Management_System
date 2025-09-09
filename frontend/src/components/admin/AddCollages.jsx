
// CollegeRegistration.jsx
import React, { useState } from 'react';
import axios from 'axios';

const CollegeRegistration = () => {
  const [formData, setFormData] = useState({
    college_id: '',
    college_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('access');
      const response = await axios.post(
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
      setFormData({
        college_id: '',
        college_name: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register college');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Register New College
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Add a new college to the system
            </p>
          </div>

          {message && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="college_id" className="block text-sm font-medium text-gray-700">
                  College ID *
                </label>
                <input
                  id="college_id"
                  name="college_id"
                  type="text"
                  required
                  value={formData.college_id}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., COL001"
                />
              </div>

              <div>
                <label htmlFor="college_name" className="block text-sm font-medium text-gray-700">
                  College Name *
                </label>
                <input
                  id="college_name"
                  name="college_name"
                  type="text"
                  required
                  value={formData.college_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., College of Natural Sciences"
                />
              </div>
            </div>

            <div>
              <button
              
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </span>
                ) : (
                  'Register College'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollegeRegistration;