import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaSearch, FaSort } from "react-icons/fa";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(""); // "" | "name" | "college"

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setDepartments(data);
      setFilteredDepartments(data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Handle search
  useEffect(() => {
    let filtered = departments.filter((dept) =>
      dept.department_name.toLowerCase().includes(search.toLowerCase()) ||
      (dept.department_code || "").toLowerCase().includes(search.toLowerCase()) ||
      (dept.college_name || dept.college || "").toLowerCase().includes(search.toLowerCase())
    );

    // Apply sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.department_name.localeCompare(b.department_name));
    } else if (sortBy === "college") {
      filtered.sort((a, b) => (a.college_name || a.college || "").localeCompare(b.college_name || b.college || ""));
    }

    setFilteredDepartments(filtered);
    setCurrentPage(1); // reset to first page on search or sort
  }, [search, sortBy, departments]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-6 mb-6 shadow-lg text-white text-center">
          <h1 className="text-3xl font-bold">All Departments</h1>
          <p className="mt-2 text-lg">List of all departments in your university</p>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by department, code, or college..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <FaSort className="text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
            >
              <option value="">Sort By</option>
              <option value="name">Department Name</option>
              <option value="college">College Name</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500">Loading departments...</div>
        ) : filteredDepartments.length === 0 ? (
          <div className="text-center text-gray-500">No departments found.</div>
        ) : (
          <>
            {/* Department Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((dept) => (
                <div
                  key={dept.id || dept.department_code}
                  className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <FaBuilding className="text-blue-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">{dept.department_name}</h2>
                  </div>
                  <p className="text-gray-600">
                    <span className="font-medium">Code:</span> {dept.department_code}
                  </p>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">College:</span> {dept.college_name || dept.college || "N/A"}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-xl font-medium transition ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DepartmentList;
