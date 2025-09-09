import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { 
  FaUserCircle, 
  FaRegIdBadge, 
  FaUserEdit, 
  FaUsers, 
  FaLayerGroup 
} from "react-icons/fa";
import CollegeNavbar from "./CollegeNavbar.jsx";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    if (window.innerWidth < 768) setShowSidebar(false);
  }, []);

  const tabsside = [
    { name: "Register Instructor", label: "Register Instructor", link: "teacher-registration", icon: <FaRegIdBadge /> },
    { name: "Assign Instructor", label: "Assign Instructor", link: "teacher", icon: <FaUserEdit /> },
    { name: "Assigned Instructor", label: "Assigned Instructor", link: "assigned-teacher", icon: <FaUsers /> },
    { name: "All Instructors", label: "All Instructors", link: "all-teachers", icon: <FaLayerGroup /> },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      <CollegeNavbar />
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-15 left-0 transition-transform duration-300 ease-in-out z-20 ${
            showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
          }`}
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
              <p className="font-bold text-lg mt-2">
                {user?.firstName || "User"} {user?.fatherName || ""}
              </p>
              <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
                {user?.role || "Role"}
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200 p-4">
              {tabsside.map((tab) => {
                const path = location.pathname.replace(/\/$/, ""); // remove trailing slash
                const tabPath = `/${tab.link}`;
                const isActive = path === tabPath || path.endsWith(`/${tab.link}`);

                return (
                  <Link
                    key={tab.name}
                    to={tab.link}
                    onClick={() => {
                      if (window.innerWidth < 768) setShowSidebar(false);
                    }}
                  >
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

          {/* Footer */}
          <div className="p-6 border-t border-orange-300 flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
          
              <div></div>
            </div>
            <button className="flex items-center gap-2 text-red-200 hover:text-red-100 mt-2 font-medium">
              {/* Add logout action if needed */}
            </button>
          </div>
        </div>

        {/* Sidebar toggle */}
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
          className={`flex-1 bg-white h-full px-4 sm:px-6 md:px-10 lg:px-16 overflow-y-auto py-8 transition-all duration-300 ${
            showSidebar ? "md:ml-72" : "ml-0"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;
