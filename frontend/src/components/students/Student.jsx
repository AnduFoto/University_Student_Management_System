// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaCamera,
//   FaUserGraduate,
//   FaNewspaper,
//   FaChalkboardTeacher,
//   FaRegClock,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
// } from "react-icons/fa";
// import { motion, AnimatePresence } from "framer-motion";

// const schedule = [
//   {
//     day: "MONDAY",
//     date: "01.09.2013",
//     events: [
//       { time: "09:00", subject: "Python", teacher: "Abiy", room: "CL 01" },
//       { time: "10:50", subject: "Asp.NET", teacher: "Temesgen.W", room: "CL 01" },
//     ],
//   },
//   {
//     day: "TUESDAY",
//     date: "02.09.2013",
//     events: [
//       { time: "09:00", subject: "Advanced Java", teacher: "Side", room: "SE 02" },
//       { time: "10:50", subject: "Data Structuer and Algorithim", teacher: "Bekele", room: "CL 02" },
//       { time: "12:30", subject: "React", teacher: "Jhon", room: "SE 04" },
//     ],
//   },
//   {
//     day: "WEDNESDAY",
//     date: "03.09.2013",
//     events: [
//       { time: "09:00", subject: "Django", teacher: "Mike", room: "SE 03" },
//       { time: "10:50", subject: "Spring Boot", teacher: "Mosh", room: "SE 01" },
//     ],
//   },
// ];

// const news = [
//   {
//     title: "Campus Library Opens New Section",
//     description:
//       "A new digital library section is now available for students to access online journals and e-books.",
//     date: "15 Aug 2025",
//   },
//   {
//     title: "Hackathon 2025 Registration",
//     description:
//       "Students are invited to register for the upcoming inter-college hackathon. Exciting prizes await!",
//     date: "20 Aug 2025",
//   },
//   {
//     title: "Guest Lecture: AI in Education",
//     description:
//       "Join us for an interactive lecture on AI applications in modern education by Dr. Selam Tesfaye.",
//     date: "25 Aug 2025",
//   },
// ];

// export default function StudentProfile() {
//   const [activeTab, setActiveTab] = useState("schedule");
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // fetch stored user from localStorage
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-500">Loading profile...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="font-sans bg-gradient-to-b from-orange-50 to-white min-h-screen">
//       {/* Profile Header */}
//       <div className="relative flex flex-col items-center pt-12 pb-6 px-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-3xl shadow-lg">
//         <div className="relative">
//           <img
//             src={`http://127.0.0.1:8000${user.picture}`}
//             alt="profile"
//             className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover hover:scale-105 transition-transform"
//           />
//           <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
//             <FaCamera className="text-orange-500 w-5 h-5" />
//             <input type="file" className="hidden" />
//           </label>
//         </div>
//         <h2 className="text-3xl font-bold text-white mt-4 drop-shadow-md">
//           {user.firstName} {user.fatherName}
//         </h2>
//         <div className="flex flex-wrap justify-center gap-3 mt-3 text-white text-sm">
//           <div className="flex items-center gap-1 bg-white/20 px-4 py-1 rounded-full backdrop-blur-md shadow-sm">
//             <FaUserGraduate /> {user.catagory}
//           </div>
//           <div className="flex items-center gap-1 bg-white/20 px-4 py-1 rounded-full backdrop-blur-md shadow-sm">
//             {user.batch} Batch
//           </div>
//         </div>
//         <Link to="/studentdashboard/student-profile">
//           <button className="mt-4 bg-white text-orange-500 font-semibold px-6 py-2 rounded-full shadow hover:shadow-lg transition">
//             Dashboard
//           </button>
//         </Link>
//       </div>

//       {/* Tabs Section */}
//       <div className="mt-8 px-6 sm:px-12">
//         <div className="flex justify-center gap-6 border-b-2 border-gray-200 pb-2">
//           {["schedule", "news"].map((tab) => (
//             <span
//               key={tab}
//               className={`cursor-pointer font-semibold px-4 py-1 rounded-full transition ${
//                 activeTab === tab
//                   ? "bg-orange-500 text-white shadow-md"
//                   : "text-gray-400 hover:text-orange-500"
//               }`}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </span>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {activeTab === "schedule" && (
//             <motion.div
//               key="schedule"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6 space-y-6"
//             >
//               {schedule.map((day, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
//                 >
//                   <div className="flex items-center gap-2 mb-3">
//                     <FaCalendarAlt className="text-orange-400" />
//                     <div className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-semibold text-sm w-fit">
//                       {day.day} - {day.date}
//                     </div>
//                   </div>
//                   {day.events.map((event, j) => (
//                     <div
//                       key={j}
//                       className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-orange-50/50 rounded-lg p-3 mb-2 hover:bg-orange-50 transition"
//                     >
//                       <div className="flex items-center gap-2 text-orange-600 w-full sm:w-1/6">
//                         <FaRegClock /> {event.time}
//                       </div>
//                       <div className="font-semibold text-gray-800 w-full sm:w-2/6">
//                         {event.subject}
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-600 w-full sm:w-2/6">
//                         <FaChalkboardTeacher /> {event.teacher}
//                       </div>
//                       <div className="flex items-center gap-1 text-gray-500 w-full sm:w-1/6">
//                         <FaMapMarkerAlt /> {event.room}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </motion.div>
//           )}

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
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition flex flex-col justify-between"
//                 >
//                   <h4 className="font-bold text-lg text-orange-500 mb-2 flex items-center gap-2">
//                     <FaNewspaper /> {item.title}
//                   </h4>
//                   <p className="text-gray-700 text-sm mb-3">{item.description}</p>
//                   <span className="text-gray-400 text-xs flex items-center gap-1">
//                     <FaCalendarAlt /> {item.date}
//                   </span>
//                 </div>
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
  FaCamera, FaUserGraduate, FaNewspaper, FaChalkboardTeacher,
  FaRegClock, FaMapMarkerAlt, FaCalendarAlt, FaArrowLeft, FaShieldAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const schedule = [
  {
    day: "MONDAY",
    date: "Sep 01",
    events: [
      { time: "09:00", subject: "Python", teacher: "Abiy", room: "CL 01" },
      { time: "10:50", subject: "Asp.NET", teacher: "Temesgen.W", room: "CL 01" },
    ],
  },
  {
    day: "TUESDAY",
    date: "Sep 02",
    events: [
      { time: "09:00", subject: "Advanced Java", teacher: "Side", room: "SE 02" },
      { time: "12:30", subject: "React Native", teacher: "John", room: "SE 04" },
    ],
  },
];

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) return <div className="flex items-center justify-center min-h-screen bg-[#f4f6f9] text-orange-500 font-bold">Loading...</div>;

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-10 font-sans text-slate-800">
      
      {/* --- ADMIN-STYLE DARK HEADER --- */}
      <div className="relative bg-[#343a40] pt-10 pb-16 px-6 rounded-b-[3rem] shadow-2xl border-b-4 border-orange-500">
        <div className="flex justify-between items-center mb-8">
          <Link to="/studentdashboard">
            <button className="p-2 bg-gray-700/50 hover:bg-orange-500 text-white rounded-xl transition-all">
              <FaArrowLeft />
            </button>
          </Link>
          <div className="flex flex-col items-center">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Student Portal</span>
             <p className="text-[9px] text-gray-400 flex items-center gap-1 mt-0.5 uppercase font-bold">
               <FaShieldAlt className="text-green-500" /> Secure Connection
             </p>
          </div>
          <div className="w-8"></div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={`http://127.0.0.1:8000${user.picture}`}
              alt="profile"
              className="w-32 h-32 rounded-[2rem] border-4 border-gray-700 shadow-2xl object-cover"
            />
            <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2.5 rounded-xl shadow-lg cursor-pointer hover:bg-orange-600 transition-colors">
              <FaCamera size={16} />
              <input type="file" className="hidden" />
            </label>
          </div>

          <h2 className="text-2xl font-black text-white mt-5">
            {user.firstName} <span className="text-orange-500">{user.fatherName}</span>
          </h2>
          
          <div className="flex gap-2 mt-3">
            <span className="bg-gray-700 text-gray-300 text-[10px] font-bold px-4 py-1.5 rounded-lg border border-gray-600">
              {user.catagory}
            </span>
            <span className="bg-gray-700 text-gray-300 text-[10px] font-bold px-4 py-1.5 rounded-lg border border-gray-600">
              Batch {user.batch}
            </span>
          </div>
        </div>
      </div>

      {/* --- MENU TABS --- */}
      <div className="px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl p-1.5 shadow-xl flex gap-1 border border-gray-100">
          {["schedule", "news"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
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

      {/* --- LIST CONTENT --- */}
      <div className="mt-8 px-6 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {schedule.map((day, i) => (
                <div key={i} className="space-y-3">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2">
                    {day.day} — {day.date}
                  </p>
                  
                  {day.events.map((event, j) => (
                    <div key={j} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 group hover:border-orange-500 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-black text-gray-800 text-lg">{event.subject}</h4>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <FaChalkboardTeacher className="text-orange-500" /> {event.teacher}
                            </span>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                              <FaMapMarkerAlt className="text-orange-500" /> {event.room}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-50 text-[#343a40] font-black text-[11px] px-3 py-1.5 rounded-lg border border-gray-200">
                          <FaRegClock className="inline mr-1 text-orange-500" /> {event.time}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-full w-1.5 bg-orange-500"></div>
                <h4 className="font-black text-gray-800 text-xl">Campus Library Update</h4>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                  Digital library section is now accessible for all students.
                </p>
                <div className="mt-4 text-[10px] font-black text-gray-400 uppercase flex items-center gap-1">
                  <FaCalendarAlt className="text-orange-500" /> 15 Aug 2025
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}