import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUniversity, FaUserCircle } from "react-icons/fa";

const AddCollege = () => {
  const [formData, setFormData] = useState({
    college_code: "",
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({ username: "Admin", profile_photo: "" });
  const [message, setMessage] = useState(null); // <-- For success/error messages

  useEffect(() => {
    // Get logged-in user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null); // Reset message on submit

    try {
      const token = localStorage.getItem("access");
      await axios.post("http://127.0.0.1:8000/api/collages/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setMessage({ type: "success", text: "College added successfully!" });
      setFormData({ college_code: "", name: "" });
    } catch (err) {
      console.error(err);
      const errorText = err.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to add college.";
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
              alt={user.name || "User"}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
            />
          ) : (
            <FaUserCircle className="text-3xl sm:text-4xl text-black" />
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex flex-col items-center w-full">
    

        <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
          <div className="flex items-center mb-6">
            <FaUniversity className="text-blue-600 text-3xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Add College</h2>
          </div>
                {/* Message */}
        {message && (
          <div
            className={`w-full max-w-lg mb-6 p-4 rounded-lg text-center ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                College Code
              </label>
              <input
                type="text"
                name="college_code"
                value={formData.college_code}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                placeholder="Enter College Code"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                College Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                placeholder="Enter College Name"
              />
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
                <span>{loading ? "Adding..." : "Add College"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddCollege;
