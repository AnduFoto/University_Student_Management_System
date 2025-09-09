import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UsersIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ChartBarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const TeachersListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    college: '',
    search: '',
    academicLevel: ''
  });

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access');
  };

  // Create axios instance with auth headers
  const api = axios.create({
    baseURL: '/api/',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const safeApiCall = async (url, options = {}) => {
    try {
      const response = await api.get(url, options);
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      console.error(`Error calling ${url}:`, err);
      throw err;
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch teachers
      const response = await safeApiCall('teachers/teachers/');
      let teachersData = [];
      
      if (response && Array.isArray(response.results)) {
        teachersData = response.results;
      } else if (Array.isArray(response)) {
        teachersData = response;
      }

      console.log('Teachers data:', teachersData);
      setTeachers(teachersData);
      setFilteredTeachers(teachersData);

      // Extract unique colleges from teachers
      const uniqueColleges = [...new Set(teachersData
        .map(teacher => teacher.college_name)
        .filter(Boolean)
      )].sort();
      
      setColleges(uniqueColleges);

    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError('Failed to fetch teachers data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, filters]);

  const filterTeachers = () => {
    let filtered = teachers;

    // Filter by college
    if (filters.college) {
      filtered = filtered.filter(teacher => 
        teacher.college_name === filters.college
      );
    }

    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(teacher =>
        getTeacherDisplayName(teacher).toLowerCase().includes(searchTerm) ||
        teacher.teacher_id.toLowerCase().includes(searchTerm) ||
        teacher.academic_level.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by academic level
    if (filters.academicLevel) {
      filtered = filtered.filter(teacher =>
        teacher.academic_level === filters.academicLevel
      );
    }

    setFilteredTeachers(filtered);
  };

  const getTeacherDisplayName = (teacher) => {
    if (teacher.user_first_name && teacher.user_father_name) {
      return `${teacher.user_first_name} ${teacher.user_father_name}`;
    }
    if (teacher.firstName && teacher.fatherName) {
      return `${teacher.firstName} ${teacher.fatherName}`;
    }
    if (teacher.username?.firstName && teacher.username?.fatherName) {
      return `${teacher.username.firstName} ${teacher.username.fatherName}`;
    }
    if (teacher.full_name) return teacher.full_name;
    return teacher.teacher_id || 'Unknown Teacher';
  };

  const getTeacherPicture = (teacher) => {
    return teacher.picture || 
           teacher.user_picture || 
           teacher.username?.picture || 
           teacher.user_details?.picture;
  };

  const getAcademicLevels = () => {
    return [...new Set(teachers.map(teacher => teacher.academic_level).filter(Boolean))].sort();
  };

  const clearFilters = () => {
    setFilters({
      college: '',
      search: '',
      academicLevel: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
          <div className="text-red-500 text-center">
            <AcademicCapIcon className="h-16 w-16 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={fetchTeachers}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-12">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Faculty Directory</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our dedicated teaching staff and academic professionals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-2">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{teachers.length}</h3>
              <p className="text-sm text-gray-600">Total Teachers</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-2">
                <BuildingLibraryIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{colleges.length}</h3>
              <p className="text-sm text-gray-600">Colleges</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-2">
                <AcademicCapIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{getAcademicLevels().length}</h3>
              <p className="text-sm text-gray-600">Academic Levels</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-2">
                <ChartBarIcon className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{filteredTeachers.length}</h3>
              <p className="text-sm text-gray-600">Filtered Results</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">Filter Teachers</h3>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search Input */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                />
              </div>

              {/* College Filter */}
              <select
                value={filters.college}
                onChange={(e) => setFilters({...filters, college: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Colleges</option>
                {colleges.map(college => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>

              {/* Academic Level Filter */}
              <select
                value={filters.academicLevel}
                onChange={(e) => setFilters({...filters, academicLevel: e.target.value})}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                {getAcademicLevels().map(level => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <div key={teacher.teacher_id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Teacher Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-200">
                {getTeacherPicture(teacher) ? (
                  <img
                    src={getTeacherPicture(teacher)}
                    alt={getTeacherDisplayName(teacher)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`absolute inset-0 flex items-center justify-center ${getTeacherPicture(teacher) ? 'hidden' : 'flex'}`}
                >
                  <UserCircleIcon className="h-20 w-20 text-blue-400" />
                </div>
                
                {/* Academic Level Badge */}
                {teacher.academic_level && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {teacher.academic_level}
                    </span>
                  </div>
                )}
              </div>

              {/* Teacher Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {getTeacherDisplayName(teacher)}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">ID: {teacher.teacher_id}</p>
                
                {teacher.college_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <BuildingLibraryIcon className="h-4 w-4" />
                    <span>{teacher.college_name}</span>
                  </div>
                )}

                {teacher.username && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span className="truncate">{teacher.username}@example.com</span>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Teacher ID</span>
                    <span className="text-sm font-medium text-blue-600">{teacher.teacher_id}</span>
                  </div>
                  
                  {teacher.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <PhoneIcon className="h-4 w-4" />
                      <span>{teacher.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <UsersIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No teachers found</h3>
              <p className="text-gray-600 mb-4">
                {teachers.length === 0 
                  ? 'No teachers are currently registered in the system.'
                  : 'No teachers match your current filters.'
                }
              </p>
              {teachers.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersListPage;