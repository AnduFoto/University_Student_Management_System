import { useState, useEffect } from "react";

import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import AdminNavbar from './AdminNavbar'
import { 
  FaUsers,        // plural users
  FaPlusCircle,   // for adding items (like Add Course)
  FaBook,         // for courses
  FaUniversity,   // for departments / academics
  FaSchool,       // for colleges
  FaLayerGroup,   // for dept list
  FaClipboardList,// for college list
  FaUserPlus,     // for user registration
  FaUsersCog,     // for user management
  FaKey           // for password reset
} from "react-icons/fa";


const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("registration");
   const [user, setUser] = useState(null);
  const location = useLocation();

useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const tabs = [
    { name: "registration", label: "Registration", link: "registration" },
    { name: "biography", label: "Fill Biography", link: "biography-edit" },
    { name: "security", label: "Security" },
    { name: "metadata", label: "Metadata" },
    { name: "associations", label: "Associations" },
    { name: "groups", label: "Groups" },
    { name: "identifiers", label: "Identifiers" },
    { name: "medical", label: "Medical" }
  ];




const tabsside = [
  { name: "Users", label: "Users", link: "users-list", icon: <FaUsers /> },
  { name: "Add Course", label: "Add Course", link: "addcourse", icon: <FaPlusCircle /> },
  { name: "Course List", label: "Course List", link: "courseslist", icon: <FaBook /> },
  { name: "Add Departments", label: "Add Departments", link: "add-departmrnt", icon: <FaUniversity /> },
  { name: "Add Colleges", label: "Add Colleges", link: "add-collage", icon: <FaSchool /> },
  { name: "Departments List", label: "Departments List", link: "departments-list", icon: <FaLayerGroup /> },
  { name: "Colleges List", label: "Colleges List", link: "collages-list", icon: <FaClipboardList /> },
  { name: "User Registration", label: "User Registration", link: "userregistration", icon: <FaUserPlus /> },
  { name: "User Management", label: "User Management", link: "usermanagement", icon: <FaUsersCog /> },
  { name: "Password Reset", label: "Password Reset", link: "password-reset", icon: <FaKey /> },
];

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
     <AdminNavbar/>
      <div className="flex h-[calc(100vh-4rem)]  mt-16 relative">
        
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b   from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-20 left-0 transition-transform duration-300 ease-in-out z-20 ${
            showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
          }`}
        >
          {/* Top section (Profile + Navigation) */}
          <div className="flex flex-col flex-1 overflow-hidden">
            
            {/* Profile (fixed at top) */}
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
                             className="w-24 h-24  object-cover border-2 border-black shadow-lg hover:scal  transiion-transform durtion-300"
                           />
                         ) : (
                           <FaUserCircle className="text-3xl sm:text-4xl text-black" />
                         )}
              <p className="font-bold text-lg mt-2">{user?.firstName  || "User"}{' '+ user?.fatherName}</p>
              <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
              {user?.role || "Role"}
              </span>
            </div>

            {/* Navigation (scrollable) */}
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

          {/* Footer (Logout always visible) */}
          <div className="p-6 border-t border-orange-300  flex flex-col gap-3 flex-shrink-0">
           
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl" />
              <div>
               
              </div>
            </div>
            <button
             
              className="flex items-center gap-2 text-red-200 hover:text-red-100 mt-2 font-medium"
            >
             
            </button>
          </div>
        </div>

        {/* Sidebar toggle */}
        {!showSidebar && (
          <div className="absolute top-6 left-2 z-30">
            <button
              onClick={() => setShowSidebar(true)}
              className="bg-orange-500 text-white rounded-full w-10 h-10  flex items-center justify-center hover:bg-orange-600 shadow-lg transition"
              title="Show sidebar"
            >
              →
            </button>
          </div>
        )}

        {/* Main Content */}
        <div
          className={`flex-1 bg-white h-full px-16 overflow-y-auto py-8 transition-all top-2 duration-300 ${
            showSidebar ? "ml-72" : "ml-0"
          }`}
         >
          

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;
