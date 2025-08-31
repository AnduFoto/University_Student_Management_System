// import React, { useState } from "react";
// import {
//   ChevronDownIcon,
//   ChevronUpIcon,
//   AcademicCapIcon,
//   PencilSquareIcon,
//   DocumentTextIcon,
//   ClipboardDocumentCheckIcon,
// } from "@heroicons/react/24/outline";

// const semesters = [
//   {
//     semester: "Fall 2018",
//     courses: [
//       {
//         title: "Bachelors in Science",
//         grades: { Quiz: [8, 10], Mid: [15, 20], Final: [40, 50], Assignment: [18, 20] },
//       },
//       {
//         title: "Mathematics",
//         grades: { Quiz: [9, 10], Mid: [18, 20], Final: [45, 50], Assignment: [20, 20] },
//       },
//     ],
//   },
//   {
//     semester: "Spring 2019",
//     courses: [
//       {
//         title: "Physics",
//         grades: { Quiz: [7, 10], Mid: [16, 20], Final: [42, 50], Assignment: [19, 20] },
//       },
//     ],
//   },
// ];

// const getGradeInfo = (grades) => {
//   const total =
//     (grades.Quiz[0] / grades.Quiz[1]) * 100 * 0.1 +
//     (grades.Mid[0] / grades.Mid[1]) * 100 * 0.2 +
//     (grades.Final[0] / grades.Final[1]) * 100 * 0.5 +
//     (grades.Assignment[0] / grades.Assignment[1]) * 100 * 0.2;

//   let letterGrade = "B";
//   let color = "text-red-600";

//   if (total >= 90) {
//     letterGrade = "A+";
//     color = "text-green-600";
//   } else if (total >= 85) {
//     letterGrade = "A";
//     color = "text-blue-600";
//   } else if (total >= 75) {
//     letterGrade = "B+";
//     color = "text-yellow-600";
//   } else if (total >= 65) {
//     letterGrade = "C";
//     color = "text-orange-600";
//   }

//   return { total: total.toFixed(2), letterGrade, color };
// };

// export default function SemesterGrades() {
//   const [openSemester, setOpenSemester] = useState(null);

//   const toggleSemester = (index) => {
//     setOpenSemester(openSemester === index ? null : index);
//   };

//   const gradeIcons = {
//     Quiz: <AcademicCapIcon className="w-5 h-5 text-gray-500" />,
//     Mid: <PencilSquareIcon className="w-5 h-5 text-gray-500" />,
//     Final: <DocumentTextIcon className="w-5 h-5 text-gray-500" />,
//     Assignment: <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500" />,
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Semester Grades</h1>

//       {semesters.map((sem, idx) => (
//         <div
//           key={idx}
//           className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-200 transition-all duration-300"
//         >
//           {/* Semester Header */}
//           <div
//             className="flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50 transition-colors"
//             onClick={() => toggleSemester(idx)}
//           >
//             <h2 className="text-xl font-semibold text-gray-700">{sem.semester}</h2>
//             {openSemester === idx ? (
//               <ChevronUpIcon className="w-6 h-6 text-gray-600" />
//             ) : (
//               <ChevronDownIcon className="w-6 h-6 text-gray-600" />
//             )}
//           </div>

//           {/* Collapsible Content */}
//           <div
//             className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
//               openSemester === idx ? "max-h-screen" : "max-h-0"
//             }`}
//           >
//             <div className="p-6 space-y-5">
//               {sem.courses.map((course, cIdx) => {
//                 const { total, letterGrade, color } = getGradeInfo(course.grades);
//                 return (
//                   <div
//                     key={cIdx}
//                     className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
//                   >
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
//                       <span className={`px-3 py-1 rounded-full font-semibold ${color}`}>
//                         {letterGrade}
//                       </span>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                       {Object.keys(course.grades).map((type) => (
//                         <div key={type} className="flex flex-col text-gray-700">
//                           <div className="flex items-center mb-1">
//                             {gradeIcons[type]}
//                             <span className="ml-2 font-medium text-sm">{type}</span>
//                           </div>
//                           <p className="text-sm font-semibold">
//                             {course.grades[type][0]} / {course.grades[type][1]}
//                           </p>
//                         </div>
//                       ))}
//                     </div>

//                     <div>
//                       <p className="text-gray-500 text-sm mb-1 font-medium">Total: {total}%</p>
//                       <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
//                         <div
//                           className={`h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500`}
//                           style={{ width: `${total}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { UserIcon, AcademicCapIcon, BookOpenIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// const StudentDashboard = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [grades, setGrades] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   const BASE_URL = 'http://localhost:8000/api';

//   // Safe API call function
//   const safeApiCall = async (url, options = {}) => {
//     try {
//       const token = localStorage.getItem('access');
//       const response = await axios({
//         url,
//         headers: { 
//           'Authorization': `Bearer ${token}`,
//           ...options.headers
//         },
//         ...options
//       });
//       return response.data;
//     } catch (err) {
//       if (err.response?.status === 404) {
//         console.warn(`Endpoint not found: ${url}`);
//         return null;
//       }
//       console.error(`Error calling ${url}:`, err);
//       throw err;
//     }
//   };

//   // Fetch student data
//   const fetchStudentData = async () => {
//     try {
//       setError('');
//       setLoading(true);

//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       const username = userData.username;

//       if (!username) {
//         setError('No user logged in');
//         setLoading(false);
//         return;
//       }

//       // Fetch student details
//       const studentResponse = await safeApiCall(`${BASE_URL}/students/${username}/`);
//       setStudentData(studentResponse);

//       // Fetch student courses
//       const coursesResponse = await safeApiCall(`${BASE_URL}/students/${username}/courses/`);
//       setCourses(coursesResponse?.courses || []);

//       // Fetch student grades (fixed endpoint)
//       const gradesResponse = await safeApiCall(`${BASE_URL}/students/${username}/grades/`);
//       setGrades(gradesResponse?.grades || []);

//     } catch (err) {
//       if (err.response?.status !== 404) {
//         setError('Failed to fetch student data. Please check your connection.');
//       }
//       console.error('Error in fetchStudentData:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   // Get grade for a specific course
//   const getCourseGrade = (courseId) => grades.find(grade => grade.course_id === courseId);

//   // Calculate GPA
//   const calculateGPA = () => {
//     if (grades.length === 0) return 0;
    
//     const totalPoints = grades.reduce((sum, grade) => {
//       const finalGrade = Number(grade.final) || 0;
//       return sum + (finalGrade / 20); // Convert 0-100% to 4.0 scale
//     }, 0);
    
//     return (totalPoints / grades.length).toFixed(2);
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   if (!studentData) {
//     return (
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="text-center py-8">
//           <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
//           <p className="text-gray-500">No student data found.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <div className="flex justify-center mb-4">
//           <UserIcon className="h-12 w-12 text-blue-600" />
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
//         <p className="text-gray-600">View your academic information and course grades</p>
//       </div>

//       {/* Student Information */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <UserIcon className="h-5 w-5 mr-2 text-blue-600" />
//           Personal Information
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p><strong>Name:</strong> {studentData.user_details?.first_name} {studentData.user_details?.father_name}</p>
//             <p><strong>Username:</strong> {studentData.username}</p>
//             <p><strong>Email:</strong> {studentData.user_details?.email}</p>
//           </div>
//           <div>
//             <p><strong>Student ID:</strong> {studentData.username}</p>
//             <p><strong>Phone:</strong> {studentData.user_details?.phone_number || 'N/A'}</p>
//             <p><strong>Status:</strong> Active</p>
//           </div>
//         </div>
//       </div>

//       {/* Academic Information */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" />
//           Academic Information
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <p><strong>College:</strong> {studentData.department_details?.college_id?.college_name || 'N/A'}</p>
//             <p><strong>Department:</strong> {studentData.department_details?.department_name}</p>
//             <p><strong>Program:</strong> {studentData.course_category}</p>
//           </div>
//           <div>
//             <p><strong>Year:</strong> {studentData.year}</p>
//             <p><strong>Semester:</strong> {studentData.semester}</p>
//             <p><strong>Current GPA:</strong> {calculateGPA()}/4.0</p>
//           </div>
//         </div>
//       </div>

//       {/* Registered Courses */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-4 flex items-center">
//           <BookOpenIcon className="h-5 w-5 mr-2 text-purple-600" />
//           Registered Courses ({courses.length})
//         </h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {courses.length === 0 && <p className="text-gray-500 text-center py-4">No courses registered.</p>}
//           {courses.map((course) => {
//             const courseGrade = getCourseGrade(course.course_id);
//             return (
//               <div key={course.course_id} className="border border-gray-200 rounded-lg p-4">
//                 <h3 className="font-semibold text-blue-600 mb-2">{course.course_name}</h3>
//                 <p className="text-sm text-gray-600">ID: {course.course_id}</p>
//                 <p className="text-sm">Credits: {course.course_credit}</p>
//                 <p className="text-sm">Category: {course.course_category}</p>
//                 <p className="text-sm">Year/Semester: {course.course_taken_year}, {course.course_taken_semester}</p>
//                 <p className="text-sm">Registered: {new Date(course.registered_at).toLocaleDateString()}</p>
                
//                 {courseGrade && (
//                   <div className="mt-3 pt-3 border-t border-gray-200">
//                     <p className="text-sm font-medium">Grade: {courseGrade.final}%</p>
//                     <p className="text-sm">Status: {courseGrade.final >= 50 ? 'Passed' : 'Failed'}</p>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Grades Summary */}
//       {grades.length > 0 && (
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4 flex items-center">
//             <ChartBarIcon className="h-5 w-5 mr-2 text-orange-600" />
//             Grades Summary
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quiz</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Midterm</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assignment</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Final</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participation</th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {grades.map((grade) => {
//                   const course = courses.find(c => c.course_id === grade.course_id);
//                   return (
//                     <tr key={grade.grade_id} className="hover:bg-gray-50">
//                       <td className="px-4 py-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {course?.course_name || grade.course_id}
//                         </div>
//                         <div className="text-sm text-gray-500">{grade.course_id}</div>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900">{grade.quiz || '-'}</td>
//                       <td className="px-4 py-4 text-sm text-gray-900">{grade.mid || '-'}</td>
//                       <td className="px-4 py-4 text-sm text-gray-900">{grade.assignment || '-'}</td>
//                       <td className="px-4 py-4 text-sm font-semibold text-gray-900">{grade.final || '-'}</td>
//                       <td className="px-4 py-4 text-sm text-gray-900">{grade.participation || '-'}</td>
//                       <td className="px-4 py-4 text-sm">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           grade.final >= 50 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {grade.final >= 50 ? 'Passed' : 'Failed'}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Refresh Button */}
//       <div className="mt-6 text-center">
//         <button
//           onClick={fetchStudentData}
//           className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//         >
//           Refresh Data
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserIcon, AcademicCapIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSemesters, setExpandedSemesters] = useState({});

  const BASE_URL = 'http://localhost:8000/api';

  const safeApiCall = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('access');
      const response = await axios({
        url,
        headers: { 
          'Authorization': `Bearer ${token}`,
          ...options.headers
        },
        ...options
      });
      return response.data;
    } catch (err) {
      if (err.response?.status === 404) return null;
      console.error(`Error calling ${url}:`, err);
      throw err;
    }
  };

  const fetchStudentData = async () => {
    try {
      setError('');
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const username = userData.username;
      if (!username) {
        setError('No user logged in');
        setLoading(false);
        return;
      }

      const studentResponse = await safeApiCall(`${import.meta.env.VITE_API_BASE_URL}/students/${username}/`);
      setStudentData(studentResponse);

      const coursesResponse = await safeApiCall(`${import.meta.env.VITE_API_BASE_URL}/students/${username}/courses/`);
      setCourses(coursesResponse?.courses || []);

      const gradesResponse = await safeApiCall(`${import.meta.env.VITE_API_BASE_URL}/students/${username}/grades/`);
      setGrades(gradesResponse?.grades || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to fetch student data. Please check your connection.');
      }
      console.error('Error in fetchStudentData:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudentData(); }, []);

  const getCourseGrade = (courseId) => grades.find(grade => grade.course_id === courseId);

  const calculateGPA = () => {
    if (!grades.length) return 0;
    const totalPoints = grades.reduce((sum, grade) => sum + ((Number(grade.final) || 0) / 20), 0);
    return (totalPoints / grades.length).toFixed(2);
  };

  const toggleSemester = (semester) => setExpandedSemesters(prev => ({ ...prev, [semester]: !prev[semester] }));

  const coursesBySemester = courses.reduce((acc, course) => {
    const key = `${course.course_taken_year} - Semester ${course.course_taken_semester}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(course);
    return acc;
  }, {});

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
    </div>
  );

  if (!studentData) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
      <AcademicCapIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <p className="text-gray-500">No student data found.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <UserIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Student Dashboard</h1>
        <p className="text-gray-600">View your academic information and course grades</p>
      </div>

      {/* Student Information */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <UserIcon className="h-5 w-5 mr-2 text-blue-600" /> Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Name:</strong> {studentData.user_details?.firstName} {studentData.user_details?.fatherName}</p>
            <p><strong>Username:</strong> {studentData.username}</p>
            <p><strong>Email:</strong> {studentData.user_details?.email}</p>
          </div>
          <div>
            <p><strong>Student ID:</strong> {studentData.userId}</p>
            <p><strong>Phone:</strong> {studentData.user_details?.phoneNumber || 'N/A'}</p>
            <p><strong>Status:</strong> Active</p>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <AcademicCapIcon className="h-5 w-5 mr-2 text-green-600" /> Academic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {/* <p><strong>College:</strong> {studentData.department_details?.college_id?.college_name || 'N/A'}</p> */}
            <p><strong>Department:</strong> {studentData.department_details?.department_name}</p>
            <p><strong>Program:</strong> {studentData.course_category}</p>
          </div>
          <div>
            <p><strong>Year:</strong> {studentData.year}</p>
            <p><strong>Semester:</strong> {studentData.semester}</p>
            <p><strong>Current GPA:</strong> {calculateGPA()}/4.0</p>
          </div>
        </div>
      </div>

      {/* Semester-based Accordion */}
      {Object.entries(coursesBySemester).map(([semester, semesterCourses]) => (
        <div key={semester} className="bg-white rounded-lg shadow-md">
          <button
            onClick={() => toggleSemester(semester)}
            className="w-full px-4 sm:px-6 py-3 text-left flex justify-between items-center bg-gray-100 hover:bg-gray-200 rounded-t-lg focus:outline-none"
          >
            <span className="font-semibold">{semester} ({semesterCourses.length} courses)</span>
            {expandedSemesters[semester] ? <ChevronUpIcon className="h-5 w-5 text-gray-600" /> : <ChevronDownIcon className="h-5 w-5 text-gray-600" />}
          </button>
          {expandedSemesters[semester] && (
            <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {semesterCourses.map(course => {
                const courseGrade = getCourseGrade(course.course_id);
                return (
                  <div key={course.course_id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-600 mb-2 text-lg sm:text-xl">{course.course_name}</h3>
                      <p className="text-sm sm:text-base text-gray-600">ID: {course.course_id}</p>
                      <p className="text-sm sm:text-base">Credits: {course.course_credit}</p>
                      <p className="text-sm sm:text-base">Category: {course.course_category}</p>
                      <p className="text-sm sm:text-base">Registered: {new Date(course.registered_at).toLocaleDateString()}</p>
                    </div>
                    {courseGrade && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm sm:text-base font-medium">Grade: {courseGrade.final}%</p>
                        <p className="text-sm sm:text-base">Status: {courseGrade.final >= 50 ? 'Passed' : 'Failed'}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchStudentData}
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;


