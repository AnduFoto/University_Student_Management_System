import { useState } from "react";
import portfolioabout from "../../assets/portfolioabout.png";
import Navbar from "../comman/Navbar";
import { Link, Outlet } from "react-router-dom";

const Registeraldashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="h-screen w-full bg-gray-100 overflow-hidden">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)] mt-16 relative">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-full sm:w-1/3 md:w-1/4 bg-white border-r border-gray-200 p-4 flex flex-col items-center relative h-full overflow-y-auto">
            {/* Hide Sidebar Button */}
            <button
              onClick={() => setShowSidebar(false)}
              className="absolute top-4 right-3 z-10 bg-gray-600 rounded-full w-11 h-9 text-white flex items-center justify-center text-lg font-bold hover:bg-gray-400 transition"
              title="Hide sidebar"
            >
              ←
            </button>

            {/* Profile Section */}
            <img
              src={portfolioabout}
              alt="Profile"
              className="rounded-full w-24 h-24 mb-2"
            />
            <div className="text-center">
              <p className="font-semibold">Andualem Lafebo</p>
              <p className="text-sm text-gray-500">Collage</p>
            </div>

            <div className="flex gap-2 mt-4">
         
            </div>

            <button className="mt-4 bg-gray-200 text-black px-4 py-2 rounded">
             View Ditails
            </button>

            {/* Contact & Info */}
  

            {/* Form Section */}
            <div className="mt-6 w-full space-y-4 text-sm">
              <div>
                <label>First Name*</label>
                <input type="text" className={inputClass} defaultValue="Julie" />
              </div>
              <div>
                <label>Last Name*</label>
                <input type="text" className={inputClass} defaultValue="Beatson" />
              </div>
              <div>
                <label>Email*</label>
                <input
                  type="email"
                  className={inputClass}
                  defaultValue="brian@reachboarding.com"
                />
              </div>
              <div>
                <label>Mobile*</label>
                <input type="text" className={inputClass} defaultValue="0466 999 405" />
              </div>
              <div>
                <label>DOB</label>
                <input type="date" className={inputClass} defaultValue="2004-05-01" />
              </div>
              <div>
                <label>Gender</label>
                <select className={inputClass}>
                  <option>Female</option>
                  <option>Male</option>
                </select>
              </div>
              <div>
                <label>Deleted</label>
                <select className={inputClass}>
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Show Button if Sidebar is Hidden */}
        {!showSidebar && (
          <div className="absolute top-0 left-2 z-10">
            <button
              onClick={() => setShowSidebar(true)}
              className="bg-gray-800 text-white rounded-full w-12 h-7 flex items-center justify-center text-lg font-bold hover:bg-gray-600 transition"
              title="Show sidebar"
            >
              →
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 bg-white h-full px-8 overflow-y-auto py-6">
          <div className="text-lg font-semibold text-gray-700 mb-4 p-4 bg-gray-200 flex items-center justify-center">
           Collage
          </div>

          <hr />

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4 p-4">
            <div className="flex text-sm font-medium overflow-x-auto whitespace-nowrap gap-4">
              <Link to="registration">
                <button className="pb-2 border-b-2 border-blue-500">Registration</button>
              </Link>
              <button className="border border-gray-200 px-3 py-2">Address</button>
              <button className="border border-gray-200 px-3 py-2">Security</button>
              <button className="border border-gray-200 px-3 py-2">Metadata</button>
              <button className="border border-gray-200 px-3 py-2">Associations</button>
              <button className="border border-gray-200 px-3 py-2">Groups</button>
              <button className="border border-gray-200 px-3 py-2">Identifiers</button>
              <button className="border border-gray-200 px-3 py-2">Medical</button>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Registeraldashboard;
