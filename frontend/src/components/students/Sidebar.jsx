// import React, { useState, useEffect } from "react";
// import { 
//   FaUserCircle, FaUser, FaBook, FaGraduationCap, FaSignOutAlt,
//   FaPen, FaFileAlt, FaHome, FaCalendarCheck, FaTasks, FaDownload, FaStar 
// } from "react-icons/fa";
// import { Link, useLocation } from "react-router-dom";

// const logout = () => {
//   localStorage.removeItem("access");
//   localStorage.removeItem("refresh");
//   localStorage.removeItem("role");
//   localStorage.removeItem("user");
//   window.location.href = "/login"; 
// };

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [user, setUser] = useState(null); 
//   const location = useLocation();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const toggleSidebar = () => setIsOpen(!isOpen);
//   const closeSidebar = () => setIsOpen(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//       if (window.innerWidth >= 768) setIsOpen(false);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const menuItems = [
//     { to: "/student", label: "Home", icon: <FaHome /> },
//     { to: "student-profile", label: "Profile", icon: <FaUser /> },
//     { to: "student-grade", label: "View Courses", icon:  <FaBook />},
//     { to: "grade-list", label: "Grade", icon:  <FaGraduationCap />},
//     { to: "take-exam", label: "Take Exam", icon: <FaPen /> },
//     { to: "exam-results", label: "View Exam Result", icon: <FaFileAlt /> },
//     { to: "dormitory", label: "View Dormitory", icon: <FaHome /> },
//     { to: "attendance", label: "View Attendance", icon: <FaCalendarCheck /> },
//     { to: "activities", label: "My Activities", icon: <FaTasks /> },
//     { to: "materials", label: "Download Materials", icon: <FaDownload /> },
//     { to: "my-biography", label: "My Biography", icon: <FaUser /> },
//     { to: "rate", label: "Rate", icon: <FaStar /> },
//   ];

//   const sidebarContent = (
//     <div className="h-screen w-64 bg-gradient-to-b from-slate-500 to-slate-700 text-white flex flex-col justify-between shadow-lg overflow-y-auto">
//       <div>
//         <h1 className="text-3xl font-extrabold p-6 border-b border-slate-700 tracking-wide"></h1>
//         <nav className="p-6">
//           <h2 className="text-xs uppercase text-slate-400 mb-4 tracking-widest"></h2>
//           <ul className="space-y-3 text-sm">
//             {menuItems.map(({ to, label, icon }) => {
//               // Fix for active link: exact match for top-level routes, includes for child routes
//               const isActive =
//                 to === "/student" || to === "/dormitory"
//                   ? location.pathname === to
//                   : location.pathname.includes(to);

//               return (
//                 <li key={to}>
//                   <Link
//                     to={to}
//                     onClick={isMobile ? closeSidebar : undefined}
//                     className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-300 ${
//                       isActive ? "bg-red-500 text-white" : "hover:bg-slate-700"
//                     }`}
//                   >
//                     <span className="text-lg">{icon}</span>
//                     <span className="font-medium">{label}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>
//       </div>

//       {/* Footer */}
//       <div className="p-6 border-t border-slate-700 flex flex-col gap-3 bg-slate-900 rounded-tl-xl rounded-tr-xl">
//         <div className="flex items-center gap-4">
//           {user?.picture ? (
//             <img
//               src={`http://127.0.0.1:8000${user.picture}`}
//               alt={user.firstName || "User"}
//               className="w-12 h-12 rounded-full border-2 border-slate-700 shadow-md"
//             />
//           ) : (
//             <FaUserCircle className="text-3xl text-slate-300" />
//           )}
//           <div>
//             <p className="text-sm font-semibold">{user?.firstName || "User"}</p>
//             <p className="text-xs text-slate-400">{user?.role || "Role"}</p>
//           </div>
//         </div>

//         <button
//           onClick={logout}
//           className="flex items-center gap-2 text-red-500 hover:text-red-400 mt-2 font-medium"
//         >
//           <FaSignOutAlt />
//           Logout
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Hamburger Button on Mobile */}
//       {isMobile && (
//         <button
//           className="fixed top-4 left-4 z-50 text-black p-3 rounded-full shadow-lg md:hidden hover:bg-slate-700 transition"
//           onClick={toggleSidebar}
//           aria-label="Toggle sidebar"
//         >
//           <svg
//             className="w-6 h-6"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             {isOpen ? (
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M6 18L18 6M6 6l12 12"
//               />
//             ) : (
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M4 6h16M4 12h16M4 18h16"
//               />
//             )}
//           </svg>
//         </button>
//       )}

//       {/* Sidebar Desktop */}
//       {!isMobile && (
//         <aside className="w-64 h-screen fixed top-0 left-0 z-40">{sidebarContent}</aside>
//       )}

//       {/* Slide-in Sidebar for Mobile */}
//       {isMobile && isOpen && (
//         <>
//           <aside className="fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white shadow-xl transform transition-transform duration-300">
//             {sidebarContent}
//           </aside>
//           <div
//             className="fixed inset-0 bg-black opacity-50 z-30"
//             onClick={toggleSidebar}
//             aria-hidden="true"
//           />
//         </>
//       )}
//     </>
//   );
// };

// export default Sidebar;



import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUserCircle, FaBook, FaGraduationCap, FaSignOutAlt, 
  FaPen, FaFileAlt, FaHome, FaCalendarCheck, FaTasks, 
  FaDownload, FaUser, FaStar, FaChevronLeft
} from "react-icons/fa";

const StudentSidebar = ({ showSidebar, setShowSidebar }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const menuItems = [
    { name: "Home", label: "Dashboard", link: "/studentdashboard", icon: <FaHome /> },
    { name: "Profile", label: "My Profile", link: "student-profile", icon: <FaUser /> },
    { name: "Courses", label: "View Courses", link: "student-grade", icon: <FaBook />},
    { name: "Grades", label: "Academic Grade", link: "grade-list", icon: <FaGraduationCap />},
    { name: "Exam", label: "Take Exam", link: "take-exam", icon: <FaPen /> },
    { name: "Results", label: "Exam Results", link: "exam-results", icon: <FaFileAlt /> },
    { name: "Attendance", label: "View Attendance", link: "attendance", icon: <FaCalendarCheck /> },
    { name: "Materials", label: "Download Materials", link: "materials", icon: <FaDownload /> },
    { name: "Biography", label: "My Biography", link: "my-biography", icon: <FaUserCircle /> },
    { name: "Rate", label: "Rate System", link: "rate", icon: <FaStar /> },
  ];

  return (
    <div
      className={`bg-[#343a40] text-[#c2c7d0] shadow-xl h-full flex flex-col fixed top-16 left-0 transition-all duration-300 ease-in-out z-20
        ${showSidebar ? "translate-x-0 w-64" : "-translate-x-full w-64"}
      `}
    >
      {/* Sidebar Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-[#343a40]">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-2 rounded-full text-white shadow-lg">
            <FaGraduationCap />
          </div>
          <span className="text-lg font-light text-white tracking-wide">Student Hub</span>
        </div>
        <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-400 hover:text-white">
          <FaChevronLeft />
        </button>
      </div>

      {/* User Info Section */}
      <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-gray-700">
        <div className="flex-shrink-0">
          {user?.picture ? (
            <img
              src={`http://127.0.0.1:8000${user.picture}`}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border border-gray-600 shadow-sm"
            />
          ) : (
            <FaUserCircle className="text-3xl text-gray-400" />
          )}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-white truncate">
            {user?.firstName || "Student"}
          </p>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] uppercase text-gray-400">Portal Active</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto mt-2">
        <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Student Navigation</p>
        <div className="pb-20">
          {menuItems.map((item) => {
            // Logic to handle active state for dashboard root and sub-routes
            const isActive = item.link.startsWith('/') 
              ? location.pathname === item.link 
              : location.pathname.includes(item.link);

            return (
              <Link 
                key={item.name} 
                to={item.link} 
                onClick={() => window.innerWidth < 768 && setShowSidebar(false)}
              >
                <div className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4
                    ${isActive ? "bg-[#494e54] text-white border-orange-500" : "hover:bg-[#494e54] hover:text-white border-transparent"}
                `}>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${isActive ? "text-orange-500" : "text-gray-400"}`}>{item.icon}</span>
                    <span className="text-sm font-light tracking-wide">{item.label}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 bg-[#2c3136] border-t border-gray-700">
        <button 
          onClick={() => { localStorage.clear(); window.location.href="/login"; }}
          className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white hover:bg-red-600/20 rounded transition-all text-[10px] font-bold uppercase tracking-widest"
        >
          <FaSignOutAlt /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;