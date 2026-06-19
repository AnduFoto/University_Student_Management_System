// import { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import StudentNavbar from './StudentNavbar'
// import { Outlet } from "react-router-dom";
// import StudentProfile from "./Student";

// const Studentdashboard = () => {
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="w-full bg-gray-100 min-h-screen overflow-x-hidden">
      
    
//      <StudentNavbar/>

//       {/* <header className="fixed top-0 left-0 w-full z-50 shadow bg-slate-700 text-white px-4 md:px-6 py-4 flex items-center justify-between border-b">
//         <h1 className="text-lg font-semibold">Student Dashboard</h1>
//         {/* Optional: add user avatar, logout, etc.
//       </header> */}

//       <div className="flex flex-col md:flex-row pt-20">
//         {/* Sidebar */}
//         <aside
//           className={`${
//             isMobile ? "w-full" : "w-64"
//           } bg-white border-r border-gray-200 md:h-[calc(100vh-5rem)] overflow-y-auto`}
//         >
//           <Sidebar />
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-4">
//           {/* <Mainbar /> */}
          
//           <Outlet/>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Studentdashboard;


// import { useState, useEffect } from "react";
// import StudentSidebar from "./Sidebar";
// import StudentNavbar from './StudentNavbar'
// import { Outlet, useLocation } from "react-router-dom";
// import { 
//   FaGraduationCap, FaShieldAlt, FaCalendarAlt, FaClock, 
//   FaCheckDouble, FaNetworkWired, FaBriefcase, FaBars 
// } from "react-icons/fa";

// const Studentdashboard = () => {
//   const [showSidebar, setShowSidebar] = useState(true);
//   const [user, setUser] = useState(null);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const location = useLocation();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));

//     const handleResize = () => {
//       if (window.innerWidth < 1024) setShowSidebar(false);
//       else setShowSidebar(true);
//     };

//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => {
//       window.removeEventListener('resize', handleResize);
//       clearInterval(timer);
//     };
//   }, []);

//   const isLandingPage = location.pathname.endsWith('dashboard') || location.pathname.endsWith('dashboard/');

//   return (
//     <div className="h-screen w-full bg-[#f4f6f9] overflow-hidden">
//       <StudentNavbar />
      
//       <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
//         {/* Sidebar component now receives props for toggle state */}
//         <StudentSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

//         {/* Floating Toggle Button (Visible when sidebar is hidden) */}
//         {!showSidebar && (
//           <button 
//             onClick={() => setShowSidebar(true)} 
//             className="fixed top-20 left-4 z-30 bg-[#343a40] text-white p-3 rounded-md shadow-lg hover:bg-orange-600 transition-all"
//           >
//             <FaBars />
//           </button>
//         )}

//         {/* Main Content Area */}
//         <div className={`flex-1 bg-[#f4f6f9] h-full overflow-y-auto transition-all duration-300 ${showSidebar ? "md:ml-64" : "ml-0"}`}>
          
//           {/* Header Bar - Matches Registrar Style */}
//           <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
//              <div className="flex flex-col">
//                 <h1 className="text-xl font-black text-gray-800 uppercase tracking-tighter">
//                   Student <span className="text-orange-500">Portal</span>
//                 </h1>
//                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
//                   <FaShieldAlt className="text-green-600" /> Academic Session 2026 Verified
//                 </p>
//              </div>

//              <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
//                 <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
//                   <FaCalendarAlt className="text-orange-500" /> {currentTime.toLocaleDateString()}
//                 </div>
//                 <div className="hidden sm:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
//                   <FaClock className="text-orange-500" /> {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                 </div>
//              </div>
//           </div>

//           <div className="p-4 sm:p-6 md:p-8">
//             {isLandingPage ? (
//               <div className="animate-in fade-in duration-700 max-w-7xl mx-auto space-y-8">
                
//                 {/* Institutional Welcome Banner */}
//                 <div className="bg-[#343a40] rounded-xl p-10 shadow-xl border-l-[6px] border-orange-500 relative overflow-hidden">
//                   <div className="relative z-10 text-white">
//                     <h2 className="text-3xl font-black uppercase tracking-tighter italic">
//                       Welcome, <span className="text-orange-500">{user?.firstName || "Student"}</span>
//                     </h2>
//                     <div className="w-16 h-1 bg-orange-500 my-5"></div>
//                     <p className="text-slate-400 text-sm max-w-xl leading-relaxed italic font-medium">
//                       Your centralized academic hub is ready. Access your course materials, 
//                       track your grading progress, and manage your examination portal from the sidebar.
//                     </p>
//                     <div className="mt-8">
//                       <button className="bg-orange-500 text-white px-8 py-3 rounded font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-md active:scale-95">
//                         View Academic Records
//                       </button>
//                     </div>
//                   </div>
//                   <FaGraduationCap className="absolute -right-16 -bottom-16 text-white/5 text-[22rem] -rotate-12" />
//                 </div>

//                 {/* Status Cards Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   {[
//                     { title: "Academic standing", val: "Satisfactory", icon: <FaCheckDouble />, color: "border-orange-500" },
//                     { title: "Active Enrollment", val: "2026 Year", icon: <FaNetworkWired />, color: "border-blue-500" },
//                     { title: "Career Path", val: "Verified", icon: <FaBriefcase />, color: "border-green-500" },
//                   ].map((card, idx) => (
//                     <div key={idx} className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm border-t-4 ${card.color} hover:shadow-md transition-all`}>
//                       <div className="flex items-center justify-between mb-4">
//                         <div className="text-gray-400">{card.icon}</div>
//                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Live Data</span>
//                       </div>
//                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.title}</h4>
//                       <p className="text-xl font-bold text-[#343a40] mt-1">{card.val}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* System Footer Info */}
//                 <div className="bg-white border border-gray-200 p-4 rounded-lg text-[10px] text-gray-400 flex justify-between uppercase font-bold tracking-widest">
//                   <span>Logged in as: {user?.role || "Student"}</span>
//                   <span className="text-orange-500/50 italic">System V3.0 - Student Module</span>
//                 </div>
//               </div>
//             ) : (
//               <Outlet />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Studentdashboard;


import { useState, useEffect } from "react";
import StudentSidebar from "./Sidebar";
import StudentNavbar from './StudentNavbar';
import { Outlet, useLocation } from "react-router-dom";
import { 
  FaGraduationCap, FaShieldAlt, FaCalendarAlt, FaClock, 
  FaCheckDouble, FaNetworkWired, FaBriefcase, FaBars 
} from "react-icons/fa";

const Studentdashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const handleResize = () => {
      // Auto-hide sidebar on screens smaller than 1024px (LG breakpoint)
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

  const isLandingPage = location.pathname.endsWith('dashboard') || location.pathname.endsWith('dashboard/');

  return (
    <div className="h-screen w-full bg-[#f4f6f9] overflow-hidden flex flex-col">
      {/* Top Navbar */}
      <StudentNavbar />
      
      <div className="flex flex-1 relative overflow-hidden mt-16">
        {/* Sidebar Component */}
        <StudentSidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />

        {/* Main Content Area */}
        <div 
          className={`flex-1 flex flex-col min-w-0 bg-[#f4f6f9] transition-all duration-300 ${
            showSidebar ? "lg:ml-64" : "ml-0"
          }`}
        >
          {/* Header Bar: Integrated Mobile Menu */}
          <div className="bg-white border-b px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Hamburger Button: Only visible when sidebar is closed */}
              {!showSidebar && (
                <button 
                  onClick={() => setShowSidebar(true)} 
                  className="p-2 rounded-lg bg-gray-100 text-[#343a40] hover:bg-orange-500 hover:text-white transition-all border border-gray-200"
                  title="Open Menu"
                >
                  <FaBars className="text-lg" />
                </button>
              )}

              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-black text-gray-800 uppercase tracking-tighter leading-none">
                  Student <span className="text-orange-500">Portal</span>
                </h1>
                <p className="hidden xs:flex text-[9px] font-bold text-gray-400 uppercase tracking-widest items-center gap-1 mt-1">
                  <FaShieldAlt className="text-green-600" /> Session 2026 Verified
                </p>
              </div>
            </div>

            {/* Time and Date Stats */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs font-bold text-gray-500">
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <FaCalendarAlt className="text-orange-500" /> 
                <span>{currentTime.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 md:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm md:shadow-none">
                <FaClock className="text-orange-500" /> 
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {isLandingPage ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto space-y-8">
                
                {/* Institutional Welcome Banner */}
                <div className="bg-[#343a40] rounded-2xl p-6 sm:p-10 shadow-xl border-l-[6px] border-orange-500 relative overflow-hidden">
                  <div className="relative z-10 text-white">
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic">
                      Welcome, <span className="text-orange-500">{user?.firstName || "Student"}</span>
                    </h2>
                    <div className="w-16 h-1 bg-orange-500 my-4 sm:my-5"></div>
                    <p className="text-slate-400 text-sm max-w-xl leading-relaxed italic font-medium">
                      Your centralized academic hub is ready. Access your course materials, 
                      track your grading progress, and manage your examination portal from the sidebar.
                    </p>
                    <div className="mt-8">
                      <button className="bg-orange-500 text-white px-8 py-3 rounded font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                        View Academic Records
                      </button>
                    </div>
                  </div>
                  <FaGraduationCap className="absolute -right-16 -bottom-16 text-white/5 text-[15rem] sm:text-[22rem] -rotate-12 pointer-events-none" />
                </div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { title: "Academic standing", val: "Satisfactory", icon: <FaCheckDouble />, color: "border-orange-500" },
                    { title: "Active Enrollment", val: "2026 Year", icon: <FaNetworkWired />, color: "border-blue-500" },
                    { title: "Career Path", val: "Verified", icon: <FaBriefcase />, color: "border-green-500" },
                  ].map((card, idx) => (
                    <div key={idx} className={`bg-white border border-gray-200 p-6 rounded-xl shadow-sm border-t-4 ${card.color} hover:shadow-md transition-all group`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-gray-400 group-hover:text-gray-600 transition-colors">{card.icon}</div>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Live Data</span>
                      </div>
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{card.title}</h4>
                      <p className="text-xl font-bold text-[#343a40] mt-1">{card.val}</p>
                    </div>
                  ))}
                </div>

                {/* System Footer Info */}
                <div className="bg-white border border-gray-200 p-4 rounded-xl text-[10px] text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2 uppercase font-bold tracking-widest">
                  <span>Logged in as: {user?.role || "Student"}</span>
                  <span className="text-orange-500/50 italic">System V3.0 — Student Module</span>
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

export default Studentdashboard;