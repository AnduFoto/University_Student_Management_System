// import { useState, useEffect, useRef } from "react";
// import { Link, Outlet, useLocation } from "react-router-dom";
// import { FaUserCircle } from "react-icons/fa";
// import RegisteralNavbar from './RegisteralNavbar';
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
// import { createPortal } from "react-dom";

// const Registeraldashboard = () => {
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [activeTab, setActiveTab] = useState("registration");
//   const [user, setUser] = useState(null);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const location = useLocation();
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target) &&
//         !buttonRef.current.contains(e.target)
//       ) {
//         setShowDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Update dropdown position relative to button
//   useEffect(() => {
//     if (showDropdown && buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       setDropdownPosition({
//         top: rect.bottom + window.scrollY,
//         left: rect.left + window.scrollX
//       });
//     }
//   }, [showDropdown]);

//   const tabs = [
//     { name: "registration", label: "Registration", dropdown: true },
//     { name: "biography", label: "Fill Biography", link: "biography-edit" },
   
//   ];

//   const tabsside = [
//     { name: "Registered Student", label: "Registered Student", link: "registratered/student", icon: <FaRegIdBadge /> },
//     { name: "Student", label: "Fill Biography", link: "biography-edit", icon: <FaUserEdit /> },
 
//   ];

//   return (
//     <div className="h-screen w-full bg-gray-100 overflow-hidden">
//       <RegisteralNavbar />

//       <div className="flex h-[calc(100vh-4rem)] mt-16 relative">

//         {/* Sidebar */}
//         <div
//           className={`bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-16 left-0 transition-transform duration-300 ease-in-out z-20 ${
//             showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
//           }`}
//         >
//           {/* Profile & Sidebar Navigation */}
//           <div className="flex flex-col flex-1 overflow-hidden">
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
//                   className="w-24 h-24 object-cover mt-6 border-2 border-black shadow-lg"
//                 />
//               ) : (
//                 <FaUserCircle className="text-3xl sm:text-4xl text-black" />
//               )}
//               <p className="font-bold text-lg mt-2">
//                 {user?.firstName || "User"} {user?.fatherName}
//               </p>
//               <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
//                 {user?.role || "Role"}
//               </span>
//             </div>

//             <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 p-4">
//               {tabsside.map((tab) => {
//                 const isActive = location.pathname.includes(tab.link);
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

//           <div className="p-6 border-t border-orange-300 flex flex-col gap-3 flex-shrink-0">
//             <div className="flex items-center gap-3">
//               <FaUserCircle className="text-4xl" />
//             </div>
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
//           className={`flex-1 bg-white h-full px-16 overflow-y-auto py-8 transition-all duration-300 top-2 ${
//             showSidebar ? "ml-72" : "ml-0"
//           }`}
//         >
//           {/* Tabs with Dropdown */}
//           <div className="border-b border-gray-200">
//             <div className="flex text-sm font-medium overflow-x-auto whitespace-nowrap gap-2 p-2 relative">
//               {tabs.map((tab) =>
//                 tab.dropdown ? (
//                   <div key={tab.name} className="relative">
//                     <button
//                       ref={buttonRef}
//                       onClick={() => setShowDropdown(!showDropdown)}
//                       className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                         activeTab === tab.name
//                           ? "bg-orange-500 text-white shadow"
//                           : "bg-gray-100 hover:bg-orange-100 text-gray-700"
//                       }`}
//                     >
//                       {tab.label} ▼
//                     </button>
//                   </div>
//                 ) : tab.link ? (
//                   <Link key={tab.name} to={tab.link}>
//                     <button
//                       onClick={() => {
//                         setActiveTab(tab.name);
//                         if (window.innerWidth < 768) setShowSidebar(false);
//                       }}
//                       className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                         activeTab === tab.name
//                           ? "bg-orange-500 text-white shadow"
//                           : "bg-gray-100 hover:bg-orange-100 text-gray-700"
//                       }`}
//                     >
//                       {tab.label}
//                     </button>
//                   </Link>
//                 ) : (
//                   <button
//                     key={tab.name}
//                     onClick={() => setActiveTab(tab.name)}
//                     className={`px-4 py-2 rounded-full transition-colors duration-200 ${
//                       activeTab === tab.name
//                         ? "bg-orange-500 text-white shadow"
//                         : "bg-gray-100 hover:bg-orange-100 text-gray-700"
//                     }`}
//                   >
//                     {tab.label}
//                   </button>
//                 )
//               )}
//             </div>
//           </div>

//           <Outlet />
//         </div>
//       </div>

//       {/* Dropdown rendered via portal */}
//       {showDropdown &&
//         createPortal(
//           <div
//             ref={dropdownRef}
//             style={{
//               position: "absolute",
//               top: dropdownPosition.top,
//               left: dropdownPosition.left
//             }}
//             className="w-40 bg-white shadow-lg rounded-lg overflow-hidden border z-[9999]"
//           >
//             <Link
//               to="registration/freshman"
//               onClick={() => {
//                 setActiveTab("registration");
//                 setShowDropdown(false);
//                 if (window.innerWidth < 768) setShowSidebar(false);
//               }}
//               className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             >
//               New Batch
//             </Link>
//             <Link
//               to="registration"
//               onClick={() => {
//                 setActiveTab("registration");
//                 setShowDropdown(false);
//                 if (window.innerWidth < 768) setShowSidebar(false);
//               }}
//               className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             >
//               Existing Batch
//             </Link>
//           </div>,
//           document.body
//         )}
//     </div>
//   );
// };

// export default Registeraldashboard;



import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import RegisteralNavbar from "./RegisteralNavbar";
import {
  FaRegIdBadge,
  FaUserEdit,
  FaShieldAlt,
  FaBars,
  FaChevronDown,
  FaFolderPlus,
  FaUsersCog,
  FaUserPlus,
  FaClipboardList,
  FaServer,
  FaChevronLeft,
  FaCalendarAlt,
  FaClock,
  FaUniversity,
  FaListUl
} from "react-icons/fa";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Local storage extraction failed safely:", err);
    }

    const handleResize = () => {
      if (window.innerWidth < 1024) setShowSidebar(false);
      else setShowSidebar(true);
    };

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(timer);
    };
  }, []);

  // Automatically keep registration sub-menu open if an intake/cohort route is currently active
  useEffect(() => {
    if (location.pathname.includes("registration")) {
      setSidebarDropdownOpen(true);
    }
  }, [location.pathname]);

  const handleToggleSidebar = () => setShowSidebar(!showSidebar);

  // Checks if the user is precisely at the dashboard base path landing view
  const isLandingPage = location.pathname.endsWith("dashboard") || location.pathname.endsWith("dashboard/");

  return (
    <div className="h-screen w-full bg-[#f4f6f9] overflow-hidden">
      {/* Top Navbar Component Integration */}
      <RegisteralNavbar />

      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        
        {/* SIDEBAR AREA */}
        <div
          className={`bg-[#343a40] text-[#c2c7d0] shadow-xl h-full flex flex-col fixed top-16 left-0 transition-all duration-300 ease-in-out z-20
            ${showSidebar ? "translate-x-0 w-64" : "-translate-x-full w-64"}
          `}
        >
          {/* Header Branding */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-700 bg-[#343a40]">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-full text-white shadow-lg">
                <FaUniversity />
              </div>
              <span className="text-lg font-light text-white tracking-wide">Registrar Panel</span>
            </div>
            <button onClick={() => setShowSidebar(false)} className="md:hidden text-gray-400 hover:text-white">
              <FaChevronLeft />
            </button>
          </div>

          {/* User Status Profile Card */}
          <div className="flex-shrink-0 flex items-center gap-3 p-4 border-b border-gray-700">
            <div className="flex-shrink-0">
              {user?.picture ? (
                <img
                  src={`http://127.0.0.1:8000${user.picture}`}
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border border-gray-600 shadow-sm"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
              ) : (
                <div className="w-10 h-10 bg-slate-700 text-orange-500 flex items-center justify-center rounded-full font-bold border border-slate-600">
                  R
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName || "Registrar"} {user?.fatherName || ""}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Online</span>
              </div>
            </div>
          </div>

          {/* Main Navigation Sidebar Options */}
          <nav className="flex-1 overflow-y-auto mt-2">
            <p className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Navigation</p>
            <div className="pb-20">
              
              {/* Static Item: Registered Students */}
              <Link to="registratered/student" onClick={() => window.innerWidth < 768 && setShowSidebar(false)}>
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4
                    ${location.pathname.includes("registratered/student") ? "bg-[#494e54] text-white border-orange-500" : "hover:bg-[#494e54] hover:text-white border-transparent"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${location.pathname.includes("registratered/student") ? "text-orange-500" : "text-gray-400"}`}>
                      <FaRegIdBadge />
                    </span>
                    <span className="text-sm font-light tracking-wide">Registered Students</span>
                  </div>
                </div>
              </Link>

              {/* Collapsible Dropdown Sidebar Module: Registration Modules */}
              <div>
                <div
                  onClick={() => setSidebarDropdownOpen(!sidebarDropdownOpen)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4
                    ${location.pathname.includes("registration") ? "bg-[#494e54] text-white border-orange-500" : "hover:bg-[#494e54] hover:text-white border-transparent"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${location.pathname.includes("registration") ? "text-orange-500" : "text-gray-400"}`}>
                      <FaListUl />
                    </span>
                    <span className="text-sm font-light tracking-wide">Registration Modules</span>
                  </div>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${sidebarDropdownOpen ? "rotate-180 text-orange-500" : ""}`} />
                </div>

                {/* Submenu Nesting Elements */}
                {sidebarDropdownOpen && (
                  <div className="bg-[#2d3238] border-b border-gray-800/40 animate-in fade-in slide-in-from-top-1 duration-150">
                    <Link to="registration/freshman" onClick={() => window.innerWidth < 768 && setShowSidebar(false)}>
                      <div className={`flex items-center gap-3 pl-10 pr-4 py-2.5 text-xs font-light transition-colors ${location.pathname.includes("registration/freshman") ? "text-white bg-[#3e444a]" : "text-gray-400 hover:text-white hover:bg-[#343a40]"}`}>
                        <FaFolderPlus className={location.pathname.includes("registration/freshman") ? "text-orange-500" : "text-gray-500"} /> New Intake Batch
                      </div>
                    </Link>
                    <Link to="registration" end onClick={() => window.innerWidth < 768 && setShowSidebar(false)}>
                      <div className={`flex items-center gap-3 pl-10 pr-4 py-2.5 text-xs font-light transition-colors ${(location.pathname.endsWith("registration") || location.pathname.endsWith("registration/")) ? "text-white bg-[#3e444a]" : "text-gray-400 hover:text-white hover:bg-[#343a40]"}`}>
                        <FaUsersCog className={(location.pathname.endsWith("registration") || location.pathname.endsWith("registration/")) ? "text-orange-500" : "text-gray-500"} /> Existing Cohorts
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Static Item: Biographical Master */}
              <Link to="biography-edit" onClick={() => window.innerWidth < 768 && setShowSidebar(false)}>
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 border-l-4
                    ${location.pathname.includes("biography-edit") ? "bg-[#494e54] text-white border-orange-500" : "hover:bg-[#494e54] hover:text-white border-transparent"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-sm ${location.pathname.includes("biography-edit") ? "text-orange-500" : "text-gray-400"}`}>
                      <FaUserEdit />
                    </span>
                    <span className="text-sm font-light tracking-wide">Biographical Master</span>
                  </div>
                </div>
              </Link>

            </div>
          </nav>
        </div>

        {/* Floating Toggle Button */}
        {!showSidebar && (
          <button
            onClick={handleToggleSidebar}
            className="fixed top-20 left-4 z-30 bg-[#343a40] text-white p-3 rounded-md shadow-lg hover:bg-orange-500 transition-all border border-slate-700"
          >
            <FaBars />
          </button>
        )}

        {/* MAIN PANEL VIEW AREA */}
        <div
          className={`flex-1 bg-[#f4f6f9] h-full overflow-y-auto transition-all duration-300 ${
            showSidebar ? "md:ml-64" : "ml-0"
          }`}
        >
          {/* Header Bar */}
          <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">
                Registrar <span className="text-orange-500">Workspace</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1 mt-0.5">
                <FaShieldAlt className="text-green-600" /> Manage university records securely
              </p>
            </div>

            {/* Calendar and Clock widgets layout */}
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <FaCalendarAlt className="text-orange-500" /> {currentTime.toLocaleDateString()}
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <FaClock className="text-orange-500" /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* DYNAMIC COMPONENT CONTAINER */}
          <div className="p-4 sm:p-6 md:p-8">
            {isLandingPage ? (
              <div className="animate-in fade-in duration-700">
                {/* Institutional Welcome Banner */}
                <div className="rounded-2xl p-8 shadow-sm border border-gray-200 relative overflow-hidden text-white">
                  <div className="relative z-10">
                    <h2 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                      Welcome Back, <span className="text-orange-500">{user?.firstName || "Officer"}</span>
                    </h2>
                    <p className="text-gray-400 text-sm max-w-xl leading-relaxed font-light">
                      Select a module from the sidebar navigation menu or explore the dashboard shortcuts below to manage students, 
                      verify cohorts, or view demographic data streams.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                        <div className="text-orange-500 font-black text-lg">Active</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Terminal Scope</div>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                        <div className="text-blue-400 font-black text-lg">Secure</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Encrypted Link</div>
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                        <div className="text-green-400 font-black text-lg">Verified</div>
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Access Log</div>
                      </div>
                    </div>
                  </div>
                  {/* Faded Background Icon element */}
                  <FaServer className="absolute -bottom-10 -right-10 text-white/5 text-[200px] rotate-12 pointer-events-none" />
                </div>

                {/* Operations Management Shortcuts Quick Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="registratered/student" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-orange-500 transition-all">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm tracking-tight">
                      <FaUserPlus className="text-orange-500" /> Registered Student Logs
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Review intake batch tracking data metrics across profiles.</p>
                  </Link>
                  <Link to="biography-edit" className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 uppercase text-sm tracking-tight">
                      <FaClipboardList className="text-blue-500" /> Biographical Master Records
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Audit or adjust core structural student identity dossiers.</p>
                  </Link>
                </div>
              </div>
            ) : (
              /* Content injection wrapper box */
              <div className="animate-in fade-in duration-300">
                <Outlet />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;