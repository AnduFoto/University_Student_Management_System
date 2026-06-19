// import React, { useState, useRef, useEffect } from "react";
// import { FaUserCircle, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

// export default function Navbar() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [user, setUser] = useState(null);
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);
//   const [dropdownStyles, setDropdownStyles] = useState({});

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     localStorage.removeItem("role");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Update dropdown position relative to button
//   useEffect(() => {
//     if (dropdownOpen && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setDropdownStyles({
//         position: "fixed",
//         top: rect.bottom + 4,
//         left: rect.left,
//         width: rect.width,
//         zIndex: 9999,
//       });
//     }
//   }, [dropdownOpen]);

//   return (
//     <nav className="fixed top-0 left-0 w-full z-50 p-2 backdrop-blur-md bg-white/20 border-b border-white/30 shadow-lg select-none">
//       <div className="flex items-center justify-between px-4 sm:px-6 md:px-12 h-16">

//         {/* Left section */}
//         <div className="flex items-center w-1/4">
//           {/* Optional: logo or empty space */}
//         </div>

//         {/* Center section */}
//         <div className="flex items-center justify-center w-1/2 text-center">
//           <span className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-gradient-x break-words">
//             College <br className="sm:hidden" /> Dashboard
//           </span>
//         </div>

//         {/* Right section */}
//         <div className="flex items-center justify-end w-1/4">
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => setDropdownOpen(!dropdownOpen)}
//             ref={buttonRef}
//           >
//             {user?.picture ? (
//               <img
//                 src={`http://127.0.0.1:8000${user.picture}`}
//                 alt={user.name || "User"}
//                 className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-black shadow-lg hover:scale-110 hover:shadow-xl transition-transform duration-300"
//               />
//             ) : (
//               <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//             )}

//             <div className="text-right hidden sm:block">
//               <p className="text-sm sm:text-base font-semibold text-black">{user?.firstName || "User"}</p>
//               <p className="text-xs sm:text-sm text-gray-600">{user?.role || "Role"}</p>
//             </div>

//             <FaChevronDown
//               className={`text-black ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
//             />
//           </div>

//           {dropdownOpen && (
//             <div
//               ref={dropdownRef}
//               style={dropdownStyles}
//               className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden mt-1"
//             >
//               <button
//                 onClick={logout}
//                 className="flex items-center text-center justify-center  w-full  py-2 text-red-600 hover:bg-red-100 hover:text-red-700 transition"
//               >
//                 <FaSignOutAlt />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaChevronDown, 
  FaBell, 
  FaSearch, 
  FaCog, 
  FaUser, 
  FaUniversity 
} from "react-icons/fa";

export default function CollegeNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.clear();
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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm h-16 select-none">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        
        {/* Left Section: Matching Brand / Icon Spacing */}
        <div className="flex items-center gap-4 w-1/4">
          <div className="bg-indigo-600 p-2 rounded-lg text-white hidden sm:block shadow-sm">
            <FaUniversity className="text-xl" />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight hidden lg:block">
            College<span className="text-indigo-600">Portal</span>
          </span>
        </div>

        {/* Center Section: Global Search Bar Styling */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <FaSearch className="absolute left-3 text-slate-400 text-sm" />
          <input 
            type="text" 
            placeholder="Search dashboard elements..." 
            className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
          />
        </div>

        {/* Right Section: Notifications & Modern Profile Trigger */}
        <div className="flex items-center justify-end w-1/4 gap-3 md:gap-6">
          
          {/* Notifications Icon with Rose Badge */}
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition">
            <FaBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile Container */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="relative">
                {user?.picture ? (
                  <img
                    src={`http://127.0.0.1:8000${user.picture}`}
                    alt="User"
                    className="w-9 h-9 object-cover rounded-lg shadow-sm border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-lg">
                    <FaUser />
                  </div>
                )}
                {/* Online Status Dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>

              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {user?.firstName || "Admin"}
                </p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium uppercase tracking-wider">
                  {user?.role || "Registrar"}
                </p>
              </div>

              <FaChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Modern Clean Dropdown Menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                {/* Account Header info */}
                <div className="px-4 py-3 border-b border-slate-50">
                  <p className="text-xs font-semibold text-slate-400 uppercase">Account Information</p>
                  <p className="text-sm text-slate-600 truncate mt-1">{user?.email || "registrar@university.edu"}</p>
                </div>

                {/* Navigation Links inside Dropdown */}
                <div className="p-1">
                  <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition">
                    <FaUser className="text-slate-400" /> My Profile
                  </button>
                  <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-xl transition">
                    <FaCog className="text-slate-400" /> Settings
                  </button>
                </div>

                {/* Action Footer Button */}
                <div className="p-1 mt-1 border-t border-slate-50">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium"
                  >
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}