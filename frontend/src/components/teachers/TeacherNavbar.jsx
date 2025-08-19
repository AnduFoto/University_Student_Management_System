import React, { useState, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownStyles, setDropdownStyles] = useState({});

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update dropdown position relative to button
  useEffect(() => {
    if (dropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [dropdownOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-2 backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg select-none">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 h-16">

        {/* Left section */}
        <div className="flex items-center w-1/4">
          {/* Optional: logo or empty space */}
        </div>

        {/* Center section */}
        <div className="flex items-center justify-center w-1/2 text-center">
          <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-x break-words">
            Teacher <br className="sm:hidden" /> Dashboard
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-end w-1/4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            ref={buttonRef}
          >
            {user?.picture ? (
              <img
                src={`http://127.0.0.1:8000${user.picture}`}
                alt={user.name || "User"}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
              />
            ) : (
              <FaUserCircle className="text-3xl sm:text-4xl text-black" />
            )}

            <div className="text-right hidden sm:block">
              <p className="text-sm sm:text-base font-semibold text-black">{user?.firstName || "User"}</p>
              <p className="text-xs sm:text-sm text-gray-600">{user?.role || "Role"}</p>
            </div>

            <FaChevronDown
              className={`text-black ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              style={dropdownStyles}
              className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mt-1"
            >
              <button
                onClick={logout}
                className="flex items-center text-center justify-center  w-full  py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
