import React, { useState } from "react";
import axios from "axios";

const ManageCourses = () => {
  const [formData, setFormData] = useState({
    course_code: "",
    course_title: "",
    course_department: "",
    course_credit: "",
    course_taken_year: 1,
    course_taken_semester: "I",
    course_category: "BSc",
    course_prerequisite: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false); // 🔹 loading state for button

  const yearOptions = [
    { label: "1st", value: 1 },
    { label: "2nd", value: 2 },
    { label: "3rd", value: 3 },
    { label: "4th", value: 4 },
    { label: "5th", value: 5 },
    { label: "6th", value: 6 },
    { label: "7th", value: 7 },
  ];
  const semesters = ["I", "II"];
  const categories = ["BSc", "MSc", "PhD"];

  const token = localStorage.getItem("access");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "course_taken_year" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lettersOnly = /^[A-Za-z\s]+$/;
    if (!lettersOnly.test(formData.course_title)) {
      setMessage({ type: "error", text: "❌ Course title must contain letters only" });
      return;
    }
    if (!lettersOnly.test(formData.course_department)) {
      setMessage({ type: "error", text: "❌ Department must contain letters only" });
      return;
    }

    setLoading(true); // 🔹 show spinner
    try {
      const payload = {
        ...formData,
        course_credit: Number(formData.course_credit),
      };

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/courses/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ type: "success", text: "✅ Course added successfully!" });

      setFormData({
        course_code: "",
        course_title: "",
        course_department: "",
        course_credit: "",
        course_taken_year: 1,
        course_taken_semester: "I",
        course_category: "BSc",
        course_prerequisite: "",
      });

      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    } catch (err) {
      console.error("Failed to add course:", err.response?.data || err.message);

      if (err.response?.data) {
        const errors = err.response.data;
        let messages = [];
        for (const key in errors) {
          messages.push(
            `${key}: ${errors[key].join ? errors[key].join(", ") : errors[key]}`
          );
        }
        setMessage({ type: "error", text: "❌ " + messages.join(" | ") });
      } else {
        setMessage({ type: "error", text: "❌ Failed to add course: " + err.message });
      }
    } finally {
      setLoading(false); // 🔹 hide spinner after request
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          📚 Add Courses
        </h2>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg text-center font-medium ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Course Code */}
          <div className="relative">
            <input
              type="text"
              name="course_code"
              value={formData.course_code}
              onChange={handleChange}
              required
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Course Code
            </label>
          </div>

          {/* Course Title */}
          <div className="relative">
            <input
              type="text"
              name="course_title"
              value={formData.course_title}
              onChange={handleChange}
              required
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Course Title
            </label>
          </div>

          {/* Department */}
          <div className="relative">
            <input
              type="text"
              name="course_department"
              value={formData.course_department}
              onChange={handleChange}
              required
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Department
            </label>
          </div>

          {/* Credit */}
          <div className="relative">
            <input
              type="number"
              name="course_credit"
              value={formData.course_credit}
              onChange={handleChange}
              required
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Credit
            </label>
          </div>

          {/* Year */}
          <div>
            <select
              name="course_taken_year"
              value={formData.course_taken_year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              {yearOptions.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <select
              name="course_taken_semester"
              value={formData.course_taken_semester}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              {semesters.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              name="course_category"
              value={formData.course_category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Prerequisite */}
          <div className="relative sm:col-span-2">
            <input
              type="text"
              name="course_prerequisite"
              value={formData.course_prerequisite}
              onChange={handleChange}
              className="peer w-full border border-gray-300 rounded-lg px-3 pt-5 pb-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              placeholder=" "
            />
            <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-600">
              Prerequisite (optional)
            </label>
          </div>

          {/* Submit Button */}
          <div className="sm:col-span-2 bg-orange-500 hover:bg-orange-600">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 text-white font-bold py-3 rounded-lg shadow-md transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }`}
            >
              {loading ? (
                <>
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Please wait...
                </>
              ) : (
                "➕ Add Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageCourses;
