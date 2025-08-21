import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUniversity, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const CollegeList = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const collegesPerPage = 6;

  // Fetch colleges from API
  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get("http://127.0.0.1:8000/api/collages/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      setColleges(data);
      setFilteredColleges(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // Search filter
  useEffect(() => {
    const filtered = colleges.filter((college) =>
      college.name.toLowerCase().includes(search.toLowerCase()) ||
      college.college_code.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredColleges(filtered);
    setCurrentPage(1);
  }, [search, colleges]);

  // Sorting
  const handleSort = () => {
    const sorted = [...filteredColleges].sort((a, b) => {
      if (sortAsc) return a.name.localeCompare(b.name);
      else return b.name.localeCompare(a.name);
    });
    setFilteredColleges(sorted);
    setSortAsc(!sortAsc);
  };

  // Pagination
  const indexOfLast = currentPage * collegesPerPage;
  const indexOfFirst = indexOfLast - collegesPerPage;
  const currentColleges = filteredColleges.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredColleges.length / collegesPerPage);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl p-6 mb-6 shadow-lg text-white text-center">
          <h1 className="text-3xl font-bold">All Colleges</h1>
          <p className="mt-2 text-lg">Explore all colleges in your database</p>
        </div>

        {/* Search and Sort */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
          />
          <button
            onClick={handleSort}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            {sortAsc ? <FaSortAlphaDown /> : <FaSortAlphaUp />}
            <span>Sort by Name</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center text-gray-500">Loading colleges...</div>
        ) : filteredColleges.length === 0 ? (
          <div className="text-center text-gray-500">No colleges found.</div>
        ) : (
          <>
            {/* Colleges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentColleges.map((college) => (
                <div
                  key={college.id || college.college_code}
                  className="bg-white shadow-lg rounded-2xl p-6 transition-transform transform hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="flex items-center mb-4">
                    <FaUniversity className="text-blue-500 text-2xl mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">{college.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-2">
                    <span className="font-medium">Code:</span> {college.college_code}
                  </p>
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    College
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    } transition duration-200`}
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

export default CollegeList;
