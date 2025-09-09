
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';

const CoursesTable = () => {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filterDept, setFilterDept] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  // Edit modal
  const [editingCourse, setEditingCourse] = useState(null);
  const [editData, setEditData] = useState({});

  // Delete confirmation modal
  const [deletingCourse, setDeletingCourse] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');

      const [coursesRes, deptRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCourses(coursesRes.data.results || coursesRes.data);
      setDepartments(deptRes.data.results || deptRes.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deletingCourse) return;

    try {
      const token = localStorage.getItem('access');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${deletingCourse.course_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Course deleted successfully!');
      setCourses((prev) => prev.filter((c) => c.course_id !== deletingCourse.course_id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete course');
    } finally {
      setDeletingCourse(null);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse(course.course_id);
    setEditData({ ...course });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('access');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/courses/courses/${editingCourse}/`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Course updated successfully!');
      setCourses((prev) =>
        prev.map((c) => (c.course_id === editingCourse ? editData : c))
      );
      setEditingCourse(null);
    } catch (err) {
      console.error('Edit error:', err);
      setError('Failed to update course');
    }
  };

  const handleEditCancel = () => {
    setEditingCourse(null);
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find((d) => d.department_id === deptId);
    return dept ? dept.department_name : deptId;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesDept = filterDept ? course.department_id === filterDept : true;
    const matchesSearch =
      course.course_id.toLowerCase().includes(search.toLowerCase()) ||
      course.course_name.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">All Courses</h2>

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

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <label className="font-medium">Filter by Department:</label>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.department_id} value={dept.department_id}>
                {dept.department_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Course ID or Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <CSVLink
            data={filteredCourses}
            filename="courses.csv"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>
      </div>

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Course ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Credit</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Semester</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Department</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  Loading courses...
                </td>
              </tr>
            ) : currentCourses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No courses found.
                </td>
              </tr>
            ) : (
              currentCourses.map((course) => (
                <tr key={course.course_id}>
                  <td className="px-4 py-2">{course.course_id}</td>
                  <td className="px-4 py-2">{course.course_name}</td>
                  <td className="px-4 py-2">{course.course_credit}</td>
                  <td className="px-4 py-2">{course.course_taken_year}</td>
                  <td className="px-4 py-2">{course.course_taken_semester}</td>
                  <td className="px-4 py-2">{getDepartmentName(course.department_id)}</td>
                  <td className="px-4 py-2 text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(course)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline-block" />
                    </button>
                    <button
                      onClick={() => setDeletingCourse(course)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded-md hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Course</h3>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 font-medium">Course Name</label>
                <input
                  type="text"
                  name="course_name"
                  value={editData.course_name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Course Credit</label>
                <input
                  type="number"
                  name="course_credit"
                  value={editData.course_credit}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Year Taken</label>
                <input
                  type="number"
                  name="course_taken_year"
                  value={editData.course_taken_year}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Semester</label>
                <input
                  type="text"
                  name="course_taken_semester"
                  value={editData.course_taken_semester}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Department</label>
                <select
                  name="department_id"
                  value={editData.department_id}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.department_id} value={dept.department_id}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleEditCancel}
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

      {/* Delete Confirmation Modal */}
      {deletingCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-center text-red-600">
              Confirm Delete
            </h3>
            <p className="mb-4 text-center">
              Are you sure you want to delete <strong>{deletingCourse.course_name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingCourse(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default CoursesTable;




