import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaRegClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBookOpen,
  FaClipboardList,
  FaBell,
  FaGraduationCap,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Sample static data (schedule, news, courses)
const schedule = [
  {
    day: "MONDAY",
    date: "01.09.2013",
    events: [{ time: "09:00", subject: "Python", teacher: "Abiy", room: "CL 01" }],
  },
  {
    day: "TUESDAY",
    date: "02.09.2013",
    events: [{ time: "09:00", subject: "Advanced Java", teacher: "Side", room: "SE 02" }],
  },
];

const news = [
  { title: "Campus Library Opens New Section", date: "15 Aug 2025" },
  { title: "Hackathon 2025 Registration", date: "20 Aug 2025" },
  { title: "Guest Lecture: AI in Education", date: "25 Aug 2025" },
];

const courses = [
  { name: "Python", progress: 70 },
  { name: "Java", progress: 40 },
  { name: "React", progress: 55 },
];

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState({ name: "User", profileImage: "" });
  const [notifications] = useState(3);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Update profile image and persist to localStorage
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const updatedUser = { ...user, profileImage: ev.target.result };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen font-sans">
      {/* Header */}
      <div className="relative flex flex-col items-center pt-12 pb-10 px-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-3xl shadow-lg">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src={`http://127.0.0.1:8000${user.picture}`}
            alt={user.name}
            className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-xl object-cover hover:scale-105 transition-transform"
          />
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
            <FaUserGraduate className="text-orange-500 w-5 h-5" />
            <input type="file" className="hidden" onChange={handleImageChange} />
          </label>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold text-white mt-4 drop-shadow-md"
        >
          Welcome, {user.firstName}!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white mt-2 text-sm sm:text-base flex items-center gap-2"
        >
          <FaBell /> You have {notifications} new notifications
        </motion.p>
      </div>

      {/* Quick Stats Cards */}
      <div className="mt-6 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
          <FaGraduationCap className="text-orange-500 w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-xl">GPA</h2>
          <p className="text-gray-500 mt-1">3.75</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
          <FaBookOpen className="text-orange-500 w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-xl">Credits</h2>
          <p className="text-gray-500 mt-1">120</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
          <FaClipboardList className="text-orange-500 w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-xl">Assignments</h2>
          <p className="text-gray-500 mt-1">5 Pending</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center">
          <FaRegClock className="text-orange-500 w-8 h-8 mb-2" />
          <h2 className="font-bold text-gray-800 text-xl">Upcoming Exam</h2>
          <p className="text-gray-500 mt-1">02 Sep 2025</p>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-8 px-6 sm:px-12">
        <div className="flex justify-center gap-6 border-b-2 border-gray-200 pb-2">
          {["dashboard", "schedule", "news"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer font-semibold px-4 py-1 rounded-full transition ${
                activeTab === tab ? "bg-orange-500 text-white shadow-md" : "text-gray-400 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          ))}
        </div>

        <AnimatePresence exitBeforeEnter>
          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              <h3 className="text-gray-700 text-xl font-semibold mb-3">Course Progress</h3>
              <div className="space-y-4">
                {courses.map((course, i) => (
                  <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                    <div className="flex justify-between mb-2 font-semibold text-gray-800">{course.name} <span>{course.progress}%</span></div>
                    <div className="w-full bg-orange-100 rounded-full h-3">
                      <div className="bg-orange-500 h-3 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6 overflow-x-auto flex gap-4 pb-4"
            >
              {schedule.map((day, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow p-4 min-w-[280px] hover:shadow-lg transition flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2 text-gray-600 font-semibold">
                    <FaCalendarAlt /> {day.day} - {day.date}
                  </div>
                  {day.events.map((event, j) => (
                    <div key={j} className="flex flex-col gap-1 bg-orange-50/50 rounded-lg p-3 mb-2 hover:bg-orange-50 transition">
                      <div className="flex items-center gap-2 text-orange-600">
                        <FaRegClock /> {event.time}
                      </div>
                      <div className="font-semibold text-gray-800">{event.subject}</div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaChalkboardTeacher /> {event.teacher}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <FaMapMarkerAlt /> {event.room}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {news.map((item, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
                  <div className="font-semibold text-gray-800 mb-2">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.date}</div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
