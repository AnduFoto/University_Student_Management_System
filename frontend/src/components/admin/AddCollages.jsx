// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaUniversity, FaUserCircle } from "react-icons/fa";

// const AddCollege = () => {
//   const [formData, setFormData] = useState({
//     college_code: "",
//     name: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [user, setUser] = useState({ username: "Admin", profile_photo: "" });
//   const [message, setMessage] = useState(null); // <-- For success/error messages

//   useEffect(() => {
//     // Get logged-in user info from localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage(null); // Reset message on submit

//     try {
//       const token = localStorage.getItem("access");
//       await axios.post("http://127.0.0.1:8000/api/collages/", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setMessage({ type: "success", text: "College added successfully!" });
//       setFormData({ college_code: "", name: "" });
//     } catch (err) {
//       console.error(err);
//       const errorText = err.response?.data
//         ? JSON.stringify(err.response.data)
//         : "Failed to add college.";
//       setMessage({ type: "error", text: errorText });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
//       {/* Admin Header */}
//       <header className="mb-6 flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         <div className="flex items-center space-x-4">
//           <span className="text-gray-600">Welcome, {user.firstName || user.username}</span>
//           {user?.picture ? (
//             <img
//               src={`http://127.0.0.1:8000${user.picture}`}
//               alt={user.name || "User"}
//               className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
//             />
//           ) : (
//             <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//           )}
//         </div>
//       </header>

//       {/* Content */}
//       <main className="flex flex-col items-center w-full">
    

//         <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8">
//           <div className="flex items-center mb-6">
//             <FaUniversity className="text-blue-600 text-3xl mr-3" />
//             <h2 className="text-2xl font-semibold text-gray-800">Add College</h2>
//           </div>
//                 {/* Message */}
//         {message && (
//           <div
//             className={`w-full max-w-lg mb-6 p-4 rounded-lg text-center ${
//               message.type === "success"
//                 ? "bg-green-100 text-green-700"
//                 : "bg-red-100 text-red-700"
//             }`}
//           >
//             {message.text}
//           </div>
//         )}
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 College Code
//               </label>
//               <input
//                 type="text"
//                 name="college_code"
//                 value={formData.college_code}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//                 placeholder="Enter College Code"
//               />
//             </div>

//             <div>
//               <label className="block text-gray-700 font-medium mb-2">
//                 College Name
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//                 className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
//                 placeholder="Enter College Name"
//               />
//             </div>

//             <div className="bg-orange-600 hover:bg-orange-700 rounded-xl">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full text-white font-bold py-3 rounded-xl transition duration-200 shadow-lg flex justify-center items-center space-x-2"
//               >
//                 {loading && (
//                   <svg
//                     className="animate-spin h-5 w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8H4z"
//                     ></path>
//                   </svg>
//                 )}
//                 <span>{loading ? "Adding..." : "Add College"}</span>
//               </button>
//             </div>
//           </form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AddCollege;



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