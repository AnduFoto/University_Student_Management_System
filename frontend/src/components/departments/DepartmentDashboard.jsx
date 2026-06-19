// import { useState, useEffect } from "react";

// import { Link, Outlet, useLocation } from "react-router-dom";
// import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
// import DepartmentNavbar from './DepartmentNavbar'
// import {
//   FaRegIdBadge,
//   FaUserEdit,
//   FaLock,
//   FaTags,
//   FaUsers,
//   FaLayerGroup,
//   FaIdCard,
//   FaBriefcaseMedical
// } from "react-icons/fa";

// const Registeraldashboard = () => {
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [activeTab, setActiveTab] = useState("registration");
//    const [user, setUser] = useState(null);
//   const location = useLocation();

// useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const tabs = [
    
    
//     { name: "security", label: "Security" },
//     { name: "metadata", label: "Metadata" },
//     { name: "associations", label: "Associations" },
//     { name: "groups", label: "Groups" },
//     { name: "identifiers", label: "Identifiers" },
//     { name: "medical", label: "Medical" }
//   ];

//   const tabsside = [
 
//     { name: "Add Course", label: "Add Course", link: "addcourse", icon: <FaUserEdit /> },
//     { name: "Course List", label: "View Grade", link: "courselist", icon: <FaUsers /> },
//     { name: "Grade Approve", label: "Grade Approve", link: "grade-approve", icon: <FaUsers /> },

 
//   ];

//   return (
//     <div className="h-screen w-full bg-gray-100 overflow-hidden">
//      <DepartmentNavbar/>
//       <div className="flex h-[calc(100vh-4rem)]  mt-16 relative">
        
//         {/* Sidebar */}
//         <div
//           className={`bg-gradient-to-b   from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-16 left-0 transition-transform duration-300 ease-in-out z-20 ${
//             showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
//           }`}
//         >
//           {/* Top section (Profile + Navigation) */}
//           <div className="flex flex-col flex-1 overflow-hidden">
            
//             {/* Profile (fixed at top) */}
//             <div className="flex flex-col items-center p-6 border-b border-orange-300 relative flex-shrink-0">
//               <button
//                 onClick={() => setShowSidebar(false)}
//                 className="absolute top-6 right-3 bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
//                 title="Hide sidebar"
//               >
//                 ←
//               </button>
//                {user?.picture ? (
//                            <img
//                              src={`http://127.0.0.1:8000${user.picture}`}
//                              alt={user.name || "User"}
//                              className="w-24 h-24  object-cover border-2 border-black shadow-lg hover:scal  transiion-transform durtion-300"
//                            />
//                          ) : (
//                            <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//                          )}
//               <p className="font-bold text-lg mt-2">{user?.firstName  || "User"}{' '+ user?.fatherName}</p>
//               <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
//               {user?.role || "Role"}
//               </span>
//             </div>

//             {/* Navigation (scrollable) */}
//             <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 p-4">
//               {tabsside.map((tab) => {
//                 const isActive = location.pathname.includes(tab.link);
//                 return (
//                   <Link key={tab.name} to={tab.link}>
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

//           {/* Footer (Logout always visible) */}
//           <div className="p-6 border-t border-orange-300  flex flex-col gap-3 flex-shrink-0">
           
//             <div className="flex items-center gap-3">
//               <FaUserCircle className="text-4xl" />
//               <div>
               
//               </div>
//             </div>
//             <button
             
//               className="flex items-center gap-2 text-red-200 hover:text-red-100 mt-2 font-medium"
//             >
             
//             </button>
//           </div>
//         </div>

//         {/* Sidebar toggle */}
//         {!showSidebar && (
//           <div className="absolute top-6 left-2 z-30">
//             <button
//               onClick={() => setShowSidebar(true)}
//               className="bg-orange-500 text-white rounded-full w-10 h-10  flex items-center justify-center hover:bg-orange-600 shadow-lg transition"
//               title="Show sidebar"
//             >
//               →
//             </button>
//           </div>
//         )}

//         {/* Main Content */}
//         <div
//           className={`flex-1 bg-white h-full px-16 overflow-y-auto py-8 transition-all top-2 duration-300 ${
//             showSidebar ? "ml-72" : "ml-0"
//           }`}
//          >
          

//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Registeraldashboard;



import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle, FaChevronLeft, FaBars } from "react-icons/fa";
import DepartmentNavbar from './DepartmentNavbar';
import {
  FaUserEdit,
  FaUsers,
  FaShieldAlt,
  FaBook,
  FaUniversity
} from "react-icons/fa";

const Registeraldashboard = () => {
  // --- STATE AND HOOKS (Preserved exactly) ---
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("registration");
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // --- ARRAYS AND METADATA (Preserved exactly) ---
  const tabs = [
    { name: "security", label: "Security" },
    { name: "metadata", label: "Metadata" },
    { name: "associations", label: "Associations" },
    { name: "groups", label: "Groups" },
    { name: "identifiers", label: "Identifiers" },
    { name: "medical", label: "Medical" }
  ];

  const tabsside = [
    { name: "Add Course", label: "Add Course", link: "addcourse", icon: <FaUserEdit /> },
    { name: "Course List", label: "View Grade", link: "courselist", icon: <FaUsers /> },
    { name: "Grade Approve", label: "Grade Approve", link: "grade-approve", icon: <FaUsers /> },
    { name: "Assign Instructor", label: "Assign Instructor", link: "teacher", icon: <FaUserEdit /> },
    { name: "Assigned Instructor", label: "Assigned Instructor", link: "assigned-teacher", icon: <FaUsers /> },
 
  ];

  // Core Landing Page Validation Logic
  const isLandingPage = location.pathname.endsWith('dashboard') || location.pathname.endsWith('dashboard/');

  return (
    <div className="h-screen w-full bg-[#f4f6f9] font-sans antialiased overflow-hidden">
      <DepartmentNavbar />
      
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        
        {/* Sidebar Panel - Dark Mode Color Matched to Admin Dashboard */}
        <div
          className={`bg-[#343a40] text-[#c2c7d0] shadow-xl h-full flex flex-col justify-between fixed top-16 left-0 transition-transform duration-300 ease-in-out z-20 ${
            showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
          }`}
        >
          {/* Top section (Profile Card + Navigation Options) */}
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* User Profile Card Context */}
            <div className="flex flex-col items-center p-6 border-b border-gray-700 relative flex-shrink-0 bg-[#343a40]">
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-4 right-3 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg w-8 h-8 flex items-center justify-center transition-colors border border-gray-600/50 text-sm font-semibold"
                title="Hide sidebar"
              >
                &larr;
              </button>
              
              <div className="mb-3">
                {user?.picture ? (
                  <img
                    src={`http://127.0.0.1:8000${user.picture}`}
                    alt={user.name || "User"}
                    className="w-20 h-20 rounded-2xl object-cover border border-gray-600 shadow-md transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <FaUserCircle className="w-20 h-20 text-gray-400" />
                )}
              </div>
              
              <p className="font-bold text-white text-base tracking-tight text-center truncate w-full px-2">
                {user?.firstName || "User"}{' '}{user?.fatherName || ''}
              </p>
              
              <div className="flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-400">Online</span>
              </div>
            </div>

            {/* Navigation Menu Links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
              <p className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Modules</p>
              {tabsside.map((tab) => {
                const isActive = location.pathname.includes(tab.link);
                return (
                  <Link key={tab.name} to={tab.link}>
                    <div
                      className={`flex items-center justify-between px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border-l-4 group ${
                        isActive
                          ? "bg-[#494e54] text-white border-orange-500 font-semibold shadow-md"
                          : "hover:bg-[#494e54] hover:text-white border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className={`text-sm transition-colors ${isActive ? "text-orange-500" : "text-gray-400 group-hover:text-white"}`}>
                          {tab.icon}
                        </span>
                        <span className="text-sm font-light tracking-wide">{tab.label}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Panel */}
          <div className="p-4 border-t border-gray-700 bg-[#2e3439] flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center gap-3 px-2">
              <FaUserCircle className="text-3xl text-gray-400" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.firstName || "Account"}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate">Department Coordinator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Sidebar Toggle Action Button */}
        {!showSidebar && (
          <div className="absolute top-6 left-4 z-30">
            <button
              onClick={() => setShowSidebar(true)}
              className="bg-[#343a40] text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-orange-600 shadow-lg transition-all font-bold"
              title="Show sidebar"
            >
              <FaBars />
            </button>
          </div>
        )}

        {/* Primary Screen View Area Dashboard Content Wrapper */}
        <div
          className={`flex-1 bg-[#f4f6f9] h-full overflow-y-auto transition-all duration-300 ${
            showSidebar ? "ml-72" : "ml-0"
          }`}
        >
          {/* Main Top Banner Content Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
             <div className="flex flex-col">
                <h1 className="text-lg font-black text-gray-800 tracking-tight">
                   Welcome, <span className="text-orange-500">{user?.firstName || "Coordinator"}</span>
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <FaShieldAlt className="text-green-600" /> Manage your department easily
                </p>
             </div>
          </div>

          {/* Core Content Routing Container */}
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
            {isLandingPage ? (
              <div className="animate-in fade-in duration-700 space-y-6">
                
                {/* Hero Layout Welcome Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-2">Ready to Get Started?</h2>
                    <p className="text-gray-500 text-sm max-w-md leading-relaxed">
                      Select a management module from the sidebar panel to easily organize department resources, configure catalog options, or verify active marks submissions.
                    </p>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-orange-55/60 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="text-orange-600 font-black text-lg">Active</div>
                        <div className="text-[10px] text-orange-400 uppercase font-bold tracking-wider mt-0.5">Syllabus Scope</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <div className="text-blue-600 font-black text-lg">Secure</div>
                        <div className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mt-0.5">Academic Logs</div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <div className="text-green-600 font-black text-lg">Online</div>
                        <div className="text-[10px] text-green-400 uppercase font-bold tracking-wider mt-0.5">Portal Status</div>
                      </div>
                    </div>
                  </div>
                  {/* Decorative Background Icon */}
                  <FaUniversity className="absolute -bottom-10 -right-10 text-gray-100 text-[200px] rotate-12 pointer-events-none" />
                </div>

                {/* Quick Shortcuts Content Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="addcourse" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 transition-all duration-200">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2.5 transition-colors">
                      <FaUserEdit className="text-orange-500" /> Department Curriculum
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">Add new course definitions or assign specific credit hours to the program system catalogs.</p>
                  </Link>
                  <Link to="courselist" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all duration-200">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2.5 transition-colors">
                      <FaBook className="text-blue-500" /> Performance Oversight
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">Review operational active records metrics or check submitted grades metrics summaries.</p>
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