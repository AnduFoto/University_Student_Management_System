import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaSpinner ,FaSignOutAlt  } from "react-icons/fa";

const Eye = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeOff = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M17.94 17.94A10.94 10.94 0 0112 19.5c-6 0-10.5-7.5-10.5-7.5a20.3 20.3 0 014.58-5.32M9.88 9.88a3 3 0 104.24 4.24M1.5 1.5l21 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/login/`,
        { username, password }
      );

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUsername("");
      setPassword("");

      const roleRoutes = {
        admin: "/admindashboard",
        student: "/student",
        registeral: "/registeraldashboard",
        teacher: "/teacherdashboard",
        department: "/departmentdashboard",
        collage: "/studentdashboard",
        president: "/studentdashboard"
      };

      navigate(roleRoutes[response.data.role] || "/");
    } catch (error) {
      let message = "Invalid credentials or error occurred. Please try again.";

      if (error.response && error.response.data?.change_password_required) {
        message = "Password change required!";
        const data = error.response.data;
        if (data.access && data.refresh) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
        }
        navigate("/change-password");
        return;
      }

      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 p-0">
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-xl sm:shadow-lg p-6 sm:p-8 md:p-10 flex flex-col justify-center">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 border-b p-2 bg-slate-700 text-white rounded-t-xl sm:rounded-t-xl">
            Login
          </h2>
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">Student Management</h1>
          <h1 className="mt-1 text-sm sm:text-base">System</h1>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mt-4 sm:mt-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-medium mt-2">Welcome Back</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
          {/* Username */}
          <div>
            <label htmlFor="username" className="flex items-center gap-2 mb-1 text-sm sm:text-base font-medium">
              <FaUser className="text-gray-500" /> Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="flex items-center gap-2 mb-1 text-sm sm:text-base font-medium">
              <FaLock className="text-gray-500" /> Password
            </label>
            <input
              type={show ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute inset-y-0 right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500"
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="text-red-600  text-center">{errorMessage}</div>
          )}

          {/* Login Button */}
          <div className="bg-orange-600 rounded-xl hover:bg-orange-700 transition-colors">
             <button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  loading
                    ? " cursor-not-allowed"
                    : " hover:bg-orange-600"
                } text-white font-medium py-2 sm:py-3  rounded-md transition-colors duration-200 flex items-center justify-center`}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
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
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {loading ? "Please wait..." : "Login"}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
}
