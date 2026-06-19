// import { useState, useEffect } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { 
//   FaUserCircle, 
//   FaRegIdBadge, 
//   FaUserEdit, 
//   FaUsers, 
//   FaLayerGroup 
// } from "react-icons/fa";
// import CollegeNavbar from "./CollegeNavbar.jsx";

// const Registeraldashboard = () => {
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [user, setUser] = useState(null);
//   const location = useLocation();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));

//     if (window.innerWidth < 768) setShowSidebar(false);
//   }, []);

//   const tabsside = [
//     { name: "Register Instructor", label: "Register Instructor", link: "teacher-registration", icon: <FaRegIdBadge /> },
//     { name: "Assign Instructor", label: "Assign Instructor", link: "teacher", icon: <FaUserEdit /> },
//     { name: "Assigned Instructor", label: "Assigned Instructor", link: "assigned-teacher", icon: <FaUsers /> },
//     { name: "All Instructors", label: "All Instructors", link: "all-teachers", icon: <FaLayerGroup /> },
//   ];

//   return (
//     <div className="h-screen w-full bg-gray-100 overflow-hidden">
//       <CollegeNavbar />
//       <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
//         {/* Sidebar */}
//         <div
//           className={`bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-15 left-0 transition-transform duration-300 ease-in-out z-20 ${
//             showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
//           }`}
//         >
//           <div className="flex flex-col flex-1 overflow-hidden">
//             {/* Profile */}
//             <div className="flex flex-col items-center p-6 border-b border-orange-300 relative flex-shrink-0">
//               <button
//                 onClick={() => setShowSidebar(false)}
//                 className="absolute top-6 right-3 bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
//                 title="Hide sidebar"
//               >
//                 ←
//               </button>
//               {user?.picture ? (
//                 <img
//                   src={`http://127.0.0.1:8000${user.picture}`}
//                   alt={user.name || "User"}
//                   className="w-24 h-24 object-cover border-2 border-black shadow-lg"
//                 />
//               ) : (
//                 <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//               )}
//               <p className="font-bold text-lg mt-2">
//                 {user?.firstName || "User"} {user?.fatherName || ""}
//               </p>
//               <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
//                 {user?.role || "Role"}
//               </span>
//             </div>

//             {/* Navigation */}
//             <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 p-4">
//               {tabsside.map((tab) => {
//                 const path = location.pathname.replace(/\/$/, ""); // remove trailing slash
//                 const tabPath = `/${tab.link}`;
//                 const isActive = path === tabPath || path.endsWith(`/${tab.link}`);

//                 return (
//                   <Link
//                     key={tab.name}
//                     to={tab.link}
//                     onClick={() => {
//                       if (window.innerWidth < 768) setShowSidebar(false);
//                     }}
//                   >
//                     <div
//                       className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-2 transition-all duration-200 ${
//                         isActive
//                           ? "bg-white text-orange-600 shadow-md"
//                           : "hover:bg-orange-400 hover:shadow-md"
//                       }`}
//                     >
//                       <span className="text-lg">{tab.icon}</span>
//                       <span className="font-medium">{tab.label}</span>
//                     </div>
//                   </Link>
//                 );
//               })}
//             </nav>
//           </div>

//           {/* Footer */}
//           <div className="p-6 border-t border-orange-300 flex flex-col gap-3 flex-shrink-0">
//             <div className="flex items-center gap-3">
          
//               <div></div>
//             </div>
//             <button className="flex items-center gap-2 text-red-200 hover:text-red-100 mt-2 font-medium">
//               {/* Add logout action if needed */}
//             </button>
//           </div>
//         </div>

//         {/* Sidebar toggle */}
//         {!showSidebar && (
//           <div className="absolute top-6 left-2 z-30">
//             <button
//               onClick={() => setShowSidebar(true)}
//               className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600 shadow-lg transition"
//               title="Show sidebar"
//             >
//               →
//             </button>
//           </div>
//         )}

//         {/* Main Content */}
//         <div
//           className={`flex-1 bg-white h-full px-4 sm:px-6 md:px-10 lg:px-16 overflow-y-auto py-8 transition-all duration-300 ${
//             showSidebar ? "md:ml-72" : "ml-0"
//           }`}
//         >
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Registeraldashboard;




import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FaUserCircle, 
  FaRegIdBadge, 
  FaUserEdit, 
  FaUsers, 
  FaLayerGroup,
  FaBars,
  FaChevronLeft,
  FaCalendarAlt,
  FaClock,
  FaShieldAlt,
  FaUniversity
} from "react-icons/fa";
import CollegeNavbar from "./CollegeNavbar.jsx";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleResize = () => {
      if (window.innerWidth < 1024) setShowSidebar(false);
      else setShowSidebar(true);
    };

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, []);

  const tabsside = [
    { name: "Register Instructor", label: "Register Instructor", link: "teacher-registration", icon: <FaRegIdBadge /> },
    { name: "Assign Instructor", label: "Assign Instructor", link: "teacher", icon: <FaUserEdit /> },
    { name: "Assigned Instructor", label: "Assigned Instructor", link: "assigned-teacher", icon: <FaUsers /> },
    { name: "All Instructors", label: "All Instructors", link: "all-teachers", icon: <FaLayerGroup /> },
  ];

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  // Checks if the URL is pointing directly to the landing page base path
  const isLandingPage = location.pathname.endsWith('dashboard') || location.pathname.endsWith('dashboard/');

  return (
    <div className="h-screen w-full bg-[#f4f6f9] overflow-hidden">
      <CollegeNavbar />
      
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        {/* Sidebar */}
        <div
          className={`bg-[#343a40] text-[#c2c7d0] shadow-xl h-full flex flex-col fixed top-16 left-0 transition-all duration-300 ease-in-out z-20
            ${showSidebar ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          `}
        >
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-[#343a40]">
             <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-full text-white shadow-lg">
                  <FaUniversity />
                </div>
                <span className="text-lg font-light text-white tracking-wide">College Panel</span>
             </div>
             <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-400">
                <FaChevronLeft />
             </button>
          </div>

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
                {user?.firstName || "College"} {user?.fatherName || "User"}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase text-gray-400">{user?.role || "Online"}</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto mt-2">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Instructor Management</p>
            <div className="pb-20">
              {tabsside.map((tab) => {
                const path = location.pathname.replace(/\/$/, "");
                const tabPath = `/${tab.link}`;
                const isActive = path === tabPath || path.endsWith(`/${tab.link}`);
                
                return (
                  <Link key={tab.name} to={tab.link} onClick={() => window.innerWidth < 768 && setShowSidebar(false)}>
                    <div className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4
                        ${isActive ? "bg-[#494e54] text-white border-orange-500" : "hover:bg-[#494e54] hover:text-white border-transparent"}
                    `}>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm ${isActive ? "text-orange-500" : "text-gray-400"}`}>{tab.icon}</span>
                        <span className="text-sm font-light tracking-wide">{tab.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Floating Toggle Button */}
        {!showSidebar && (
          <button onClick={handleToggleSidebar} className="fixed top-20 left-4 z-30 bg-[#343a40] text-white p-3 rounded-md shadow-lg hover:bg-orange-600 transition-all">
            <FaBars />
          </button>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 bg-[#f4f6f9] h-full overflow-y-auto transition-all duration-300 ${showSidebar ? "md:ml-64" : "ml-0"}`}>
          
          {/* Header Bar */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
             <div className="flex flex-col">
                <h1 className="text-xl font-black text-gray-800">
                  Welcome, <span className="text-orange-500">{user?.firstName || "Administrator"}</span>
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <FaShieldAlt className="text-green-600" /> Manage your college easily
                </p>
             </div>

             <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  <FaCalendarAlt className="text-orange-500" /> {currentTime.toLocaleDateString()}
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                  <FaClock className="text-orange-500" /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
             </div>
          </div>

          {/* Render Area with Content Fill Logic */}
          <div className="p-4 sm:p-6 md:p-8">
            {isLandingPage ? (
              <div className="animate-in fade-in duration-700">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black text-gray-800 mb-2">College Workspace Dashboard</h2>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                      Select a module from the navigation drawer to onboard faculty members, assign departments, and track active academic teaching assignments.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="text-orange-600 font-black text-lg">Active</div>
                        <div className="text-[10px] text-orange-400 uppercase font-bold">Faculty Portal</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-blue-600 font-black text-lg">Synchronized</div>
                        <div className="text-[10px] text-blue-400 uppercase font-bold">Course Records</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="text-green-600 font-black text-lg">Encrypted</div>
                        <div className="text-[10px] text-green-400 uppercase font-bold">Session State</div>
                      </div>
                    </div>
                  </div>
                  {/* Background Watermark decoration icon */}
                  <FaUniversity className="absolute -bottom-10 -right-10 text-gray-100 text-[200px] rotate-12 pointer-events-none" />
                </div>

                {/* Grid Shortlink Shortcuts */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="teacher-registration" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 transition-all">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <FaRegIdBadge className="text-orange-500" /> Onboard Instructor
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Register new faculty staff IDs to the database.</p>
                  </Link>
                  <Link to="teacher" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <FaUserEdit className="text-blue-500" /> Allocate Lecture Courses
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Assign active professors to designated department classes.</p>
                  </Link>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;
