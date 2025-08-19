
import { useState, useEffect } from "react";
import { FaUser, FaEdit } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const ITEMS_PER_PAGE = 10;

  // Fetch all students across all pages
  const fetchAllStudents = async () => {
    let allStudents = [];
    let url = `${API_BASE_URL}/users/`;

    try {
      while (url) {
        const res = await fetch(url);
        const data = await res.json();

        const normalized = (data.results || []).map((student) => ({
          ...student,
          // Normalize backend keys to match form expectations
          picture: student.avatar || student.picture || null,
          zone_or_special_wereda:
            student.zone_or_special_wereda || student.zone_or_special_wereda || "",
        }));

        allStudents = allStudents.concat(normalized);
        url = data.next; // get next page URL
      }
      setStudents(allStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchAllStudents();
  }, []);

  // Frontend filtering based on search
  useEffect(() => {
    const query = search.toLowerCase();
    const results = students.filter((student) => {
      const fullName = `${student.firstName || ""} ${student.fatherName || ""} ${
        student.grandFatherName || ""
      }`.toLowerCase();
      const id = (student.userId || "").toString().toLowerCase();
      const phone = (student.phoneNumber || "").toLowerCase();
      return (
        fullName.includes(query) || id.includes(query) || phone.includes(query)
      );
    });
    setFilteredStudents(results);
    setPage(1); // reset to first page after search
  }, [search, students]);

  // Highlight matched search text
  const highlightMatch = (text) => {
    if (!text) return "";
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Pagination logic
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const pageStudents = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Students List</h1>

      {/* Search */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search by name, ID, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-1/3"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">No</th>
              <th className="border px-3 py-2">Profile</th>
              <th className="border px-3 py-2">Student Info</th>
              <th className="border px-3 py-2">Address</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pageStudents.length > 0 ? (
              pageStudents.map((student, index) => (
                <tr key={student.userId} className="hover:bg-gray-100">
                  <td className="border px-3 py-2">{startIndex + index + 1}</td>
                  <td className="border px-3 py-2 text-center">
                    {student.picture ? (
                      <img
                        src={student.picture}
                        alt={student.firstName || "Student"}
                        className="w-24 h-24 object-cover mx-auto"
                      />
                    ) : (
                      <FaUser className="text-gray-400 text-4xl mx-auto" />
                    )}
                  </td>
                  <td className="border px-3 py-2 text-sm space-y-1">
                    <p className="font-bold">
                      {highlightMatch(
                        `${student.firstName} ${student.fatherName} ${student.grandFatherName}`
                      )}
                    </p>
                    <p>
                      ID: {highlightMatch(student.userId)} | Gender:{" "}
                      {student.gender || "-"}
                    </p>
                    <p>
                      Mother: {student.motherName} {student.mothersFatherName}
                    </p>
                    <p>
                      Phone: {highlightMatch(student.phoneNumber)} | DOB:{" "}
                      {student.dob || "-"}
                    </p>
                    <p>
                      Religion: {student.religion || "-"} | Field:{" "}
                      {student.catagory || "-"} | Batch: {student.batch || "-"}
                    </p>
                    <p>Handicap: <strong>{student.handicap || "-"}</strong>  | Enterance-Result: {student.entrance_exam || "-"}</p>
                  </td>
                  <td className="border px-3 py-2 text-sm space-y-1">
                    <p>Country: {student.nationality || "-"}</p>
                    <p>
                      Region: {student.region || "-"} | Zone:{" "}
                      {student.zone_or_special_wereda || "-"}
                    </p>
                    <p>
                      City/Town: {student.city_or_town || "-"} | House:{" "}
                      {student.house_number || "-"}
                    </p>
                  </td>
                  <td className="border px-3 py-2 text-center">
                    {student.is_active ? (
                      <h1 className="border-2 border-orange-400 font-bold text-orange-500 px-2 py-1 rounded text-xs">
                        Active
                      </h1>
                    ) : (
                      <h1 className="bg-gray-300 text-white px-2 py-1 rounded text-xs">
                        Inactive
                      </h1>
                    )}
                  </td>
                  <td className="border px-3 py-2 flex justify-center">
                    <Link to={`/user-biography/${student.userId}`}>
                      <button className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 flex items-center gap-1">
                        Edit <FaEdit />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded ${
            page > 1
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded ${
            page < totalPages
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    
    </div>
  );
}
