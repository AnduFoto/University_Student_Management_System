





import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaBook, FaLaptopCode, FaCogs, FaFlask } from "react-icons/fa";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("All");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("access");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      let allCourses = [];
      let page = 1;
      let hasNext = true;

      while (hasNext) {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/courses/?page=${page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data.results || [];
        allCourses = [...allCourses, ...data];
        hasNext = !!res.data.next;
        page++;
      }

      setCourses(allCourses);
      setDepartments(["All", ...new Set(allCourses.map((c) => c.course_department))]);
      setCategories(["All", ...new Set(allCourses.map((c) => c.course_category))]);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setCourses([]);
      setDepartments(["All"]);
      setCategories(["All"]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (c) =>
      (selectedDept === "All" || c.course_department === selectedDept) &&
      (selectedCategory === "All" || c.course_category === selectedCategory) &&
      (c.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.course_title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    for (let sort of sortConfig) {
      const { key, direction } = sort;
      const aVal = a[key];
      const bVal = b[key];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedCourses.length / itemsPerPage);
  const paginatedCourses = sortedCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSort = (key) => {
    setSortConfig((prev) => {
      const existing = prev.find((s) => s.key === key);
      if (existing) {
        const newDir = existing.direction === "asc" ? "desc" : "asc";
        return [{ key, direction: newDir }, ...prev.filter((s) => s.key !== key)];
      } else {
        return [{ key, direction: "asc" }, ...prev];
      }
    });
  };

  const exportToCSV = () => {
    const headers = [
      "No",
      "Code",
      "Title",
      "Department",
      "Credit",
      "Year",
      "Semester",
      "Category",
      "Prerequisite",
    ];
    const rows = filteredCourses.map((c, idx) => [
      idx + 1,
      c.course_code,
      c.course_title,
      c.course_department,
      c.course_credit,
      c.course_taken_year,
      c.course_taken_semester,
      c.course_category,
      c.course_prerequisite || "-",
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "courses.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeptColor = (dept) => {
    const colors = {
      CS: "bg-blue-200 text-blue-800",
      EE: "bg-green-200 text-green-800",
      ME: "bg-red-200 text-red-800",
      CE: "bg-yellow-200 text-yellow-800",
    };
    return colors[dept] || "bg-gray-200 text-gray-800";
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "core":
        return <FaBook className="inline text-2xl mr-2 text-blue-500" />;
      case "lab":
        return <FaFlask className="inline text-2xl mr-2 text-green-500" />;
      case "elective":
        return <FaLaptopCode className="inline text-2xl mr-2 text-purple-500" />;
      case "practical":
        return <FaCogs className="inline text-2xl mr-2 text-red-500" />;
      default:
        return <FaBook className="inline text-2xl mr-2 text-gray-500" />;
    }
  };

  const handleEdit = (course) => {
    alert(`Edit course: ${course.course_code}`);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Are you sure you want to delete ${course.course_code}?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/courses/${course.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCourses();
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-500 animate-pulse">Loading courses...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p- font-sans">
      <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">Course Dashboard</h2>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by code or title..."
          className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => {
              setSelectedDept(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded-lg border border-gray-300"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-all"
        >
          Export CSV
        </button>
      </div>

      {/* Table */}
      {paginatedCourses.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No courses found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="px-6 py-3">No</th>
                {[
                  { key: "course_code", label: "Code" },
                  { key: "course_title", label: "Title" },
                  { key: "course_department", label: "Department" },
                  { key: "course_credit", label: "Credit" },
                  { key: "course_taken_year", label: "Year" },
                  { key: "course_taken_semester", label: "Semester" },
                  { key: "course_category", label: "Category" },
                  { key: "course_prerequisite", label: "Prerequisite" },
                  { key: "actions", label: "Actions" },
                ].map((col) => {
                  const sort = sortConfig.find((s) => s.key === col.key);
                  return (
                    <th
                      key={col.key}
                      className="px- py-3 cursor-pointer select-none"
                      onClick={() => col.key !== "actions" && toggleSort(col.key)}
                    >
                      <div className="flex items-center justify-between">
                        {col.label}
                        {sort ? (sort.direction === "asc" ? "↑" : "↓") : ""}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedCourses.map((course, idx) => (
                <tr
                  key={`${course.course_code}-${idx}`}
                  className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 border-b border-gray-200 font-mono text-gray-700">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 font-mono text-gray-700">
                    {course.course_code}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800 font-semibold">
                    {course.course_title}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-medium ${getDeptColor(
                        course.course_department
                      )}`}
                    >
                      {course.course_department}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200">{course.course_credit}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{course.course_taken_year}</td>
                  <td className="px-6 py-4 border-b border-gray-200">{course.course_taken_semester}</td>
                  <td className="px-6 py-4 border-b border-gray-200">
                    {getCategoryIcon(course.course_category)}
                    {course.course_category}
                  </td>
                  <td
                    className={`px-6 py-4 border-b border-gray-200 ${
                      !course.course_prerequisite ? "text-red-500 font-semibold" : ""
                    }`}
                  >
                    {course.course_prerequisite || "None"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 space-x-4 text-lg">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(course)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-3 py-1 rounded ${
                currentPage === num ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
