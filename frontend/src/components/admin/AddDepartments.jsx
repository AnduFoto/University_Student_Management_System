import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUniversity, FaUserCircle } from "react-icons/fa";

const RegisterDepartment = () => {
  const [formData, setFormData] = useState({
    department_code: "",
    department_name: "",
    college: "",
  });
  const [colleges, setColleges] = useState([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState({ username: "Admin", profile_photo: "" });

  // Fetch logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setColleges(data);
      } catch (err) {
        console.error(err);
        setColleges([]);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lettersOnly = /^[A-Za-z\s]+$/;
    if (!lettersOnly.test(formData.department_name)) {
      setMessage({ type: "error", text: "Department name must contain letters only" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("access");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/departments/`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Department registered successfully!" });
      setFormData({ department_code: "", department_name: "", college: "" });
    } catch (err) {
      const errorText = err.response?.data ? JSON.stringify(err.response.data) : "Failed to register department";
      setMessage({ type: "error", text: errorText });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      {/* Admin Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user.firstName || user.username}</span>
          {user?.picture ? (
            <img
              src={`http://127.0.0.1:8000${user.picture}`}
              alt={user.username || "User"}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
            />
          ) : (
            <FaUserCircle className="text-3xl sm:text-4xl text-black" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex justify-center items-start">
        <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
          <div className="flex items-center mb-6">
            <FaUniversity className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Register Department</h2>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {loadingColleges ? (
            <p className="text-center text-gray-500">Loading colleges...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Department Code</label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleChange}
                  required
                  placeholder="Enter department code"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Department Name</label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter department name (letters only)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">College</label>
                <select
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                >
                  <option value="">Select College</option>
                  {colleges.map((c) => (
                    <option key={c.id || c.college_code} value={c.id || c.college_code}>
                      {c.name || c.college_name || "Unnamed College"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-orange-600 hover:bg-orange-700 rounded-xl">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg flex justify-center items-center space-x-2"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  )}
                  <span>{loading ? "Registering..." : "Register Department"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterDepartment;
