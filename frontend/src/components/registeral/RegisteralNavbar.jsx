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
//             Registrar <br className="sm:hidden" /> Dashboard
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
  FaSignOutAlt, 
  FaChevronDown, 
  FaBell, 
  FaSearch,
  FaUserEdit,
  FaGraduationCap,
  FaShieldAlt
} from "react-icons/fa";

export default function RegisteralNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Failed to parse navigation user identity:", e);
    }
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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-200 shadow-sm h-16">
      <div className="flex items-center justify-between h-full px-4 md:px-8">
        
        {/* Left Section: Branding */}
        <div className="flex items-center gap-3 w-1/4">
          <div className="bg-indigo-600 p-2 rounded-lg text-white hidden sm:block">
            <FaGraduationCap className="text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-black uppercase tracking-tight leading-none text-gray-900">
              Infolink<span className="text-orange-500">Portal</span>
            </span>
            <span className="text-[9px] text-gray-900 uppercase tracking-widest mt-0.5 font-bold hidden lg:block">
              Registrar Core
            </span>
          </div>
        </div>

        {/* Center Section: Global Search */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <FaSearch className="absolute left-3 text-slate-200 text-sm" />
          <input 
            type="text" 
            placeholder="Search students, batches, records..." 
            className="w-full bg-slate-300/50 border border-slate-300 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
          />
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center justify-end w-1/4 gap-3 md:gap-6">
          
          {/* Notifications Icon */}
          <button className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition">
            <FaBell className="text-lg" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#343a40]"></span>
          </button>

          {/* User Profile Trigger */}
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-800/50 border border-transparent hover:border-slate-700/60 transition-all"
            >
              <div className="relative">
                {user?.picture ? (
                  <img
                    src={`http://127.0.0.1:8000${user.picture}`}
                    alt="User"
                    className="w-9 h-9 object-cover rounded-lg border border-slate-600 shadow-sm"
                    onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                  />
                ) : (
                  <div className="w-9 h-9 bg-slate-700 text-orange-500 flex items-center justify-center rounded-lg font-bold">
                    R
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#343a40] rounded-full"></div>
              </div>

              <div className="text-left hidden lg:block">
                <p className="text-xs font-black text-gray-900 uppercase tracking-wide leading-none">
                  {user?.firstName || "Officer"}
                </p>
                <p className="text-[9px] font-black text-orange-500 mt-1 uppercase tracking-widest flex items-center gap-1">
                  <FaShieldAlt className="text-[8px] text-green-500" /> {user?.role || "Registrar"}
                </p>
              </div>

              <FaChevronDown className={`text-slate-400 text-xs transition-transform ${dropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Information</p>
                  <p className="text-sm font-bold text-slate-700 truncate mt-1">{user?.email || "registrar@dbu.edu.et"}</p>
                </div>

                <div className="p-1">
                  <button className="flex items-center gap-3 w-full px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:bg-slate-50 rounded-xl transition">
                    <FaUserEdit className="text-slate-400 text-sm" /> Edit Profile
                  </button>
                </div>

                <div className="p-1 mt-1 border-t border-gray-100">
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-xs font-black uppercase tracking-wider text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  >
                    <FaSignOutAlt className="text-sm" /> Sign Out Session
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