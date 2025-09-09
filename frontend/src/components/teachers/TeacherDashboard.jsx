import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import TeacherNavbar from './TeacherNavbar'
import {
  FaRegIdBadge,
  FaUserEdit,
  FaLock,
  FaTags,
  FaUsers,
  FaLayerGroup,
  FaIdCard,
  FaBriefcaseMedical
} from "react-icons/fa";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  // Hide sidebar automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShowSidebar(false);
      } else {
        setShowSidebar(true);
      }
    };
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const tabsside = [
    { name: "New", label: "Students", link: "Students", icon: <FaRegIdBadge /> },
    { name: "Course", label: "Course", link: "course", icon: <FaUserEdit /> },
    { name: "Seting", label: "Collages", link: "Collages", icon: <FaLock /> },
    { name: "Data", label: "Departments", link: "Departments", icon: <FaTags /> },
    { name: "Teachers", label: "Staff", link: "Staff", icon: <FaUsers /> },
    { name: "Class", label: "Report", link: "Report", icon: <FaLayerGroup /> },
    { name: "Dorm", label: "Account", link: "Account", icon: <FaIdCard /> },
    { name: "medical", label: "Security", link: "Security", icon: <FaBriefcaseMedical /> },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      <TeacherNavbar />

      {/* main area below a 4rem navbar */}
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-lg h-[calc(100vh-4rem)] flex flex-col justify-between fixed top-16 left-0 transition-transform duration-300 ease-in-out z-20
          ${showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"}`}
        >
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Profile */}
            <div className="flex flex-col items-center p-6 border-b border-orange-300 relative flex-shrink-0">
              <button
                onClick={() => setShowSidebar(false)}
                className="absolute top-6 right-3 bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition"
                title="Hide sidebar"
              >
                ←
              </button>
              {user?.picture ? (
                <img
                  src={`http://127.0.0.1:8000${user.picture}`}
                  alt={user.name || "User"}
                  className="w-24 h-24 object-cover border-2 border-black shadow-lg"
                />
              ) : (
                <FaUserCircle className="text-3xl sm:text-4xl text-black" />
              )}
              <p className="font-bold text-lg mt-2 text-center">
                {user?.firstName || "User"}{" "}{user?.fatherName}
              </p>
              <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
                {user?.role || "Role"}
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 p-4">
              {tabsside.map((tab) => {
                const isActive = location.pathname.includes(tab.link);
                return (
                  <Link key={tab.name} to={tab.link}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-2 transition-all duration-200 ${
                        isActive
                          ? "bg-white text-orange-600 shadow-md"
                          : "hover:bg-orange-400 hover:shadow-md"
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Show arrow when sidebar hidden */}
        {!showSidebar && (
          <div className="absolute top-6 left-2 z-30">
            <button
              onClick={() => setShowSidebar(true)}
              className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600 shadow-lg transition"
              title="Show sidebar"
            >
              →
            </button>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 bg-white h-full overflow-y-auto py-8 transition-all duration-300
          px-4 sm:px-6 md:px-10 lg:px-16
          ${showSidebar ? "md:ml-72" : "ml-0"}`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;
