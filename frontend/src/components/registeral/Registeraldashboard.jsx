import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import RegisteralNavbar from './RegisteralNavbar'
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
import { createPortal } from "react-dom";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("registration");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // update dropdown position relative to button
  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      });
    }
  }, [showDropdown]);

  const tabs = [
    { name: "registration", label: "Registration", dropdown: true },
    { name: "biography", label: "Fill Biography", link: "biography-edit" },
    { name: "security", label: "Security", link: "security" },
    { name: "metadata", label: "Metadata", link: "metadata" },
    { name: "associations", label: "Associations", link: "associations" },
    { name: "groups", label: "Groups", link: "groups" },
    { name: "identifiers", label: "Identifiers", link: "identifiers" },
    { name: "medical", label: "Medical", link: "medical" }
  ];

  const tabsside = [
    { name: "Registered Student", label: "Registered Student", link: "registratered/student", icon: <FaRegIdBadge /> },
    { name: "Student", label: "Fill Biography", link: "biography-edit", icon: <FaUserEdit /> },
    { name: "Seting", label: "Security", link: "security", icon: <FaLock /> },
    { name: "Data", label: "Metadata", link: "metadata", icon: <FaTags /> },
    { name: "Teachers", label: "Associations", link: "associations", icon: <FaUsers /> },
    { name: "Class", label: "Groups", link: "groups", icon: <FaLayerGroup /> },
    { name: "Dorm", label: "Identifiers", link: "identifiers", icon: <FaIdCard /> },
    { name: "medical", label: "Medical", link: "medical", icon: <FaBriefcaseMedical /> }
  ];

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      <RegisteralNavbar />
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        
        {/* Sidebar */}
        <div
          className={`bg-gradient-to-b from-slate-500 to-slate-700 text-white shadow-lg h-full flex flex-col justify-between fixed top-20 left-0 transition-transform duration-300 ease-in-out z-20 ${
            showSidebar ? "translate-x-0 w-72" : "-translate-x-full w-72"
          }`}
        >
          {/* Profile & Sidebar Navigation */}
          <div className="flex flex-col flex-1 overflow-hidden">
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
                {user?.firstName || "User"}{" "}
                {user?.fatherName}
              </p>
              <span className="text-xs bg-white text-orange-500 px-3 py-1 rounded-full font-semibold shadow">
                {user?.role || "Role"}
              </span>
            </div>

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

          <div className="p-6 border-t border-orange-300 flex flex-col gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-4xl" />
            </div>
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
          className={`flex-1 bg-white h-full px-16 overflow-y-auto py-8 transition-all top-2 duration-300 ${
            showSidebar ? "ml-72" : "ml-0"
          }`}
        >
          {/* Tabs with Dropdown */}
          <div className="border-b border-gray-200">
            <div className="flex text-sm font-medium overflow-x-auto whitespace-nowrap gap-2 p-2 relative">
              {tabs.map((tab) =>
                tab.dropdown ? (
                  <div key={tab.name} className="relative">
                    <button
                      ref={buttonRef}
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                        activeTab === tab.name
                          ? "bg-orange-500 text-white shadow"
                          : "bg-gray-100 hover:bg-orange-100 text-gray-700"
                      }`}
                    >
                      {tab.label} ▼
                    </button>
                  </div>
                ) : tab.link ? (
                  <Link key={tab.name} to={tab.link}>
                    <button
                      onClick={() => setActiveTab(tab.name)}
                      className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                        activeTab === tab.name
                          ? "bg-orange-500 text-white shadow"
                          : "bg-gray-100 hover:bg-orange-100 text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  </Link>
                ) : (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                      activeTab === tab.name
                        ? "bg-orange-500 text-white shadow"
                        : "bg-gray-100 hover:bg-orange-100 text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              )}
            </div>
          </div>

          <Outlet />
        </div>
      </div>

      {/* Dropdown rendered via portal */}
      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left
            }}
            className="w-40 bg-white shadow-lg rounded-lg overflow-hidden border z-[9999]"
          >
            <Link
              to="registration/freshman"
              onClick={() => {
                setActiveTab("registration");
                setShowDropdown(false);
              }}
              className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            >
              Freshman
            </Link>
            <Link
              to="registration"
              onClick={() => {
                setActiveTab("registration");
                setShowDropdown(false);
              }}
              className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            >
              Regular
            </Link>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Registeraldashboard;


