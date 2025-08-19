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
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const schedule = [
  {
    day: "MONDAY",
    date: "01.09.2013",
    events: [
      { time: "09:00", subject: "Python", teacher: "Abiy", room: "CL 01" },
      { time: "10:50", subject: "Asp.NET", teacher: "Temesgen.W", room: "CL 01" },
    ],
  },
  {
    day: "TUESDAY",
    date: "02.09.2013",
    events: [
      { time: "09:00", subject: "Advanced Java", teacher: "Side", room: "SE 02" },
      { time: "10:50", subject: "Data Structuer and Algorithim", teacher: "Bekele", room: "CL 02" },
      { time: "12:30", subject: "React", teacher: "Jhon", room: "SE 04" },
    ],
  },
  {
    day: "WEDNESDAY",
    date: "03.09.2013",
    events: [
      { time: "09:00", subject: "Django", teacher: "Mike", room: "SE 03" },
      { time: "10:50", subject: "Spring Boot", teacher: "Mosh", room: "SE 01" },
    ],
  },
];

const news = [
  {
    title: "Campus Library Opens New Section",
    description:
      "A new digital library section is now available for students to access online journals and e-books.",
    date: "15 Aug 2025",
  },
  {
    title: "Hackathon 2025 Registration",
    description:
      "Students are invited to register for the upcoming inter-college hackathon. Exciting prizes await!",
    date: "20 Aug 2025",
  },
  {
    title: "Guest Lecture: AI in Education",
    description:
      "Join us for an interactive lecture on AI applications in modern education by Dr. Selam Tesfaye.",
    date: "25 Aug 2025",
  },
];

export default function StudentProfile() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // fetch stored user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="font-sans bg-gradient-to-b from-orange-50 to-white min-h-screen">
      {/* Profile Header */}
      <div className="relative flex flex-col items-center pt-12 pb-6 px-4 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-3xl shadow-lg">
        <div className="relative">
          <img
            src={`http://127.0.0.1:8000${user.picture}`}
            alt="profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover hover:scale-105 transition-transform"
          />
          <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition">
            <FaCamera className="text-orange-500 w-5 h-5" />
            <input type="file" className="hidden" />
          </label>
        </div>
        <h2 className="text-3xl font-bold text-white mt-4 drop-shadow-md">
          {user.firstName} {user.fatherName}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 mt-3 text-white text-sm">
          <div className="flex items-center gap-1 bg-white/20 px-4 py-1 rounded-full backdrop-blur-md shadow-sm">
            <FaUserGraduate /> {user.catagory}
          </div>
          <div className="flex items-center gap-1 bg-white/20 px-4 py-1 rounded-full backdrop-blur-md shadow-sm">
            {user.batch} Batch
          </div>
        </div>
        <Link to="/studentdashboard/student-profile">
          <button className="mt-4 bg-white text-orange-500 font-semibold px-6 py-2 rounded-full shadow hover:shadow-lg transition">
            Dashboard
          </button>
        </Link>
      </div>

      {/* Tabs Section */}
      <div className="mt-8 px-6 sm:px-12">
        <div className="flex justify-center gap-6 border-b-2 border-gray-200 pb-2">
          {["schedule", "news"].map((tab) => (
            <span
              key={tab}
              className={`cursor-pointer font-semibold px-4 py-1 rounded-full transition ${
                activeTab === tab
                  ? "bg-orange-500 text-white shadow-md"
                  : "text-gray-400 hover:text-orange-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-6"
            >
              {schedule.map((day, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <FaCalendarAlt className="text-orange-400" />
                    <div className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full font-semibold text-sm w-fit">
                      {day.day} - {day.date}
                    </div>
                  </div>
                  {day.events.map((event, j) => (
                    <div
                      key={j}
                      className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center bg-orange-50/50 rounded-lg p-3 mb-2 hover:bg-orange-50 transition"
                    >
                      <div className="flex items-center gap-2 text-orange-600 w-full sm:w-1/6">
                        <FaRegClock /> {event.time}
                      </div>
                      <div className="font-semibold text-gray-800 w-full sm:w-2/6">
                        {event.subject}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 w-full sm:w-2/6">
                        <FaChalkboardTeacher /> {event.teacher}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 w-full sm:w-1/6">
                        <FaMapMarkerAlt /> {event.room}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {news.map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition flex flex-col justify-between"
                >
                  <h4 className="font-bold text-lg text-orange-500 mb-2 flex items-center gap-2">
                    <FaNewspaper /> {item.title}
                  </h4>
                  <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                  <span className="text-gray-400 text-xs flex items-center gap-1">
                    <FaCalendarAlt /> {item.date}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
