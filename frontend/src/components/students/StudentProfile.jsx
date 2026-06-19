// import React, { useState, useEffect } from "react";
// import {
//   FaUserGraduate,
//   FaChalkboardTeacher,
//   FaRegClock,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaBookOpen,
//   FaClipboardList,
//   FaBell,
//   FaGraduationCap,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// // Sample static data (schedule, news, courses)
// const schedule = [
//   {
//     day: "MONDAY",
//     date: "01.09.2013",
//     events: [{ time: "09:00", subject: "Python", teacher: "Abiy", room: "CL 01" }],
//   },
//   {
//     day: "TUESDAY",
//     date: "02.09.2013",
//     events: [{ time: "09:00", subject: "Advanced Java", teacher: "Side", room: "SE 02" }],
//   },
// ];

// const news = [
//   { title: "Campus Library Opens New Section", date: "15 Aug 2025" },
//   { title: "Hackathon 2025 Registration", date: "20 Aug 2025" },
//   { title: "Guest Lecture: AI in Education", date: "25 Aug 2025" },
// ];

// const courses = [
//   { name: "Python", progress: 70 },
//   { name: "Java", progress: 40 },
//   { name: "React", progress: 55 },
// ];

// export default function StudentDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [user, setUser] = useState({ name: "User", profileImage: "" });
//   const [notifications] = useState(3);

//   // Load user data from localStorage on component mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Update profile image and persist to localStorage
//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const reader = new FileReader();
//       reader.onload = (ev) => {
//         const updatedUser = { ...user, profileImage: ev.target.result };
//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       };
//       reader.readAsDataURL(e.target.files[0]);
//     }
//   };

//   return (
//     <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen font-sans">
//       {/* Header */}
//       <div className="relative flex flex-col items-center pt-12 pb-10 px-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-3xl shadow-lg">
//         <motion.div
//           initial={{ y: -20, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="relative"
//         >
//           <img
//             src={`http://127.0.0.1:8000${user.picture}`}
//             alt={user.name}
//             className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl object-cover hover:scale-105 transition-transform"
//           />
//           <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
//             <FaUserGraduate className="text-orange-500 w-5 h-5" />
//             <input type="file" className="hidden" onChange={handleImageChange} />
//           </label>
//         </motion.div>

//         <motion.h1
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="text-4xl sm:text-5xl font-bold text-white mt-4 drop-shadow-md"
//         >
//           Welcome, {user.firstName}!
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.5 }}
//           className="text-white mt-2 text-sm sm:text-base flex items-center gap-2"
//         >
//           <FaBell /> You have {notifications} new notifications
//         </motion.p>
//       </div>

//       {/* Quick Stats Cards */}
//       <div className="mt-6 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
//           <FaGraduationCap className="text-orange-500 w-8 h-8 mb-2" />
//           <h2 className="font-bold text-gray-800 text-xl">GPA</h2>
//           <p className="text-gray-500 mt-1">3.75</p>
//         </motion.div>
//         <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
//           <FaBookOpen className="text-orange-500 w-8 h-8 mb-2" />
//           <h2 className="font-bold text-gray-800 text-xl">Credits</h2>
//           <p className="text-gray-500 mt-1">120</p>
//         </motion.div>
//         <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
//           <FaClipboardList className="text-orange-500 w-8 h-8 mb-2" />
//           <h2 className="font-bold text-gray-800 text-xl">Assignments</h2>
//           <p className="text-gray-500 mt-1">5 Pending</p>
//         </motion.div>
//         <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
//           <FaRegClock className="text-orange-500 w-8 h-8 mb-2" />
//           <h2 className="font-bold text-gray-800 text-xl">Upcoming Exam</h2>
//           <p className="text-gray-500 mt-1">02 Sep 2025</p>
//         </motion.div>
//       </div>

//       {/* Tabs */}
//       <div className="mt-8 px-6 sm:px-12">
//         <div className="flex justify-center gap-6 border-b-2 border-gray-200 pb-2">
//           {["dashboard", "schedule", "news"].map((tab) => (
//             <span
//               key={tab}
//               className={`cursor-pointer font-semibold px-4 py-1 rounded-full transition ${
//                 activeTab === tab ? "bg-orange-500 text-white shadow-md" : "text-gray-400 hover:text-orange-500"
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </span>
//           ))}
//         </div>

//         <AnimatePresence exitBeforeEnter>
//           {/* Dashboard Overview */}
//           {activeTab === "dashboard" && (
//             <motion.div
//               key="dashboard"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6 space-y-6"
//             >
//               <h3 className="text-gray-700 text-xl font-semibold mb-3">Course Progress</h3>
//               <div className="space-y-4">
//                 {courses.map((course, i) => (
//                   <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
//                     <div className="flex justify-between mb-2 font-semibold text-gray-800">{course.name} <span>{course.progress}%</span></div>
//                     <div className="w-full bg-orange-100 rounded-full h-3">
//                       <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${course.progress}%` }}></div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {/* Schedule Tab */}
//           {activeTab === "schedule" && (
//             <motion.div
//               key="schedule"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6 space-y-6 overflow-x-auto flex gap-4 pb-4"
//             >
//               {schedule.map((day, i) => (
//                 <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow p-4 min-w-[280px] hover:shadow-lg transition flex-shrink-0">
//                   <div className="flex items-center gap-2 mb-2 text-gray-600 font-semibold">
//                     <FaCalendarAlt /> {day.day} - {day.date}
//                   </div>
//                   {day.events.map((event, j) => (
//                     <div key={j} className="flex flex-col gap-1 bg-orange-50/50 rounded-lg p-3 mb-2 hover:bg-orange-50 transition">
//                       <div className="flex items-center gap-2 text-orange-600">
//                         <FaRegClock /> {event.time}
//                       </div>
//                       <div className="font-semibold text-gray-800">{event.subject}</div>
//                       <div className="flex items-center gap-1 text-gray-600">
//                         <FaChalkboardTeacher /> {event.teacher}
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-500">
//                         <FaMapMarkerAlt /> {event.room}
//                       </div>
//                     </div>
//                   ))}
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}

//           {/* News Tab */}
//           {activeTab === "news" && (
//             <motion.div
//               key="news"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//             >
//               {news.map((item, i) => (
//                 <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
//                   <div className="font-semibold text-gray-800 mb-2">{item.title}</div>
//                   <div className="text-gray-500 text-sm">{item.date}</div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaCamera,
  FaUserGraduate,
  FaNewspaper,
  FaChalkboardTeacher,
  FaRegClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaArrowLeft,
  FaIdBadge,
  FaShieldAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const schedule = [
  {
    day: "MONDAY",
    date: "Sep 01",
    events: [
      { time: "09:00 AM", subject: "Python Pro", teacher: "Abiy", room: "CL 01" },
      { time: "10:50 AM", subject: "Asp.NET Core", teacher: "Temesgen.W", room: "CL 01" },
    ],
  },
  {
    day: "TUESDAY",
    date: "Sep 02",
    events: [
      { time: "09:00 AM", subject: "Advanced Java", teacher: "Side", room: "SE 02" },
      { time: "12:30 PM", subject: "React Native", teacher: "John", room: "SE 04" },
    ],
  },
];

const news = [
  {
    title: "Library Digital Access",
    description: "The central library has launched a new portal for e-books and journals.",
    date: "15 Aug",
    category: "Academic",
  },
  {
    title: "Internship Seminar",
    description: "Join us this Friday for a session on securing industrial internships.",
    date: "22 Aug",
    category: "Career",
  },
];

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f4f6f9]">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-20 font-sans text-slate-800">
      
      {/* --- OFFICIAL TOP BAR --- */}
      <div className="bg-[#343a40] pt-10 pb-20 px-6 rounded-b-[3.5rem] shadow-2xl relative border-b-4 border-orange-500">
        <div className="flex justify-between items-center mb-8">
          <Link to="/studentdashboard">
            <button className="p-3 bg-gray-700/50 hover:bg-orange-500 text-white rounded-2xl transition-all shadow-lg">
              <FaArrowLeft />
            </button>
          </Link>
          <div className="text-center">
            <h2 className="text-orange-500 font-black text-[10px] uppercase tracking-[0.2em]">University Identity</h2>
            <p className="text-gray-400 text-[9px] flex items-center justify-center gap-1 mt-1 font-bold uppercase">
              <FaShieldAlt className="text-green-500" /> Verified Student
            </p>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative group">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 rounded-[2.5rem] border-4 border-[#343a40] shadow-2xl overflow-hidden bg-gray-800 ring-4 ring-orange-500/20"
            >
              <img
                src={`http://127.0.0.1:8000${user.picture}`}
                alt="profile"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </motion.div>
            <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-orange-600 active:scale-90 transition-all border-4 border-[#343a40]">
              <FaCamera size={14} />
              <input type="file" className="hidden" />
            </label>
          </div>

          <h2 className="text-2xl font-black text-white mt-6 tracking-tight">
            {user.firstName} <span className="text-orange-500 font-light uppercase tracking-tighter">{user.fatherName}</span>
          </h2>
          
          <div className="flex gap-2 mt-4">
            <div className="flex items-center gap-1.5 bg-gray-700/50 border border-gray-600 text-gray-300 text-[10px] font-black px-4 py-2 rounded-xl">
              <FaIdBadge className="text-orange-500" /> {user.catagory}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-700/50 border border-gray-600 text-gray-300 text-[10px] font-black px-4 py-2 rounded-xl">
              <FaUserGraduate className="text-orange-500" /> Batch {user.batch}
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION NAVIGATION --- */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[2rem] p-1.5 shadow-xl shadow-slate-200/50 flex gap-1 border border-gray-100">
          {["schedule", "news"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.1em] transition-all duration-300 ${
                activeTab === tab 
                  ? "bg-[#343a40] text-white shadow-lg" 
                  : "text-gray-400 hover:text-orange-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="mt-10 px-6 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {schedule.map((day, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center gap-3 ml-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{day.day} • {day.date}</h3>
                  </div>
                  
                  {day.events.map((event, j) => (
                    <div key={j} className="bg-white rounded-[2.2rem] p-6 shadow-sm border border-gray-100 hover:border-orange-500 transition-colors group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-[#343a40] text-lg leading-tight group-hover:text-orange-500 transition-colors">{event.subject}</h4>
                          <div className="flex flex-wrap gap-4 mt-3">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                              <FaChalkboardTeacher size={12} className="text-orange-500" /> {event.teacher}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase">
                              <FaMapMarkerAlt size={12} className="text-red-500" /> Room {event.room}
                            </span>
                          </div>
                        </div>
                        <div className="bg-orange-50 text-orange-600 font-black text-[10px] px-3 py-2 rounded-xl border border-orange-100 shadow-sm">
                          <FaRegClock className="inline mr-1" /> {event.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {news.map((item, i) => (
                <div key={i} className="bg-white rounded-[2.2rem] p-7 shadow-sm border border-gray-100 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-5">
                    <span className="bg-[#343a40] text-white text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-orange-500">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="font-black text-[#343a40] text-xl pr-16">{item.title}</h4>
                  <p className="text-gray-500 text-sm mt-3 leading-relaxed">{item.description}</p>
                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                      <FaCalendarAlt className="text-orange-500" /> {item.date} 2026
                    </span>
                    <button className="text-[9px] font-black text-orange-500 uppercase hover:underline">Read Memo</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}