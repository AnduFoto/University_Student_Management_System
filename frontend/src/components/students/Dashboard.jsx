import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import StudentNavbar from './StudentNavbar'
import { Outlet } from "react-router-dom";
import StudentProfile from "./Student";

const Studentdashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full bg-gray-100 min-h-screen overflow-x-hidden">
      
    
     <StudentNavbar/>

      {/* <header className="fixed top-0 left-0 w-full z-50 shadow bg-slate-700 text-white px-4 md:px-6 py-4 flex items-center justify-between border-b">
        <h1 className="text-lg font-semibold">Student Dashboard</h1>
        {/* Optional: add user avatar, logout, etc.
      </header> */}

      <div className="flex flex-col md:flex-row pt-20">
        {/* Sidebar */}
        <aside
          className={`${
            isMobile ? "w-full" : "w-64"
          } bg-white border-r border-gray-200 md:h-[calc(100vh-5rem)] overflow-y-auto`}
        >
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* <Mainbar /> */}
          
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Studentdashboard;
