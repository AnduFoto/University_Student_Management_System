// // components/StudentCoursesGrades.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { 
//   AcademicCapIcon, 
//   ChevronDownIcon, 
//   ChevronUpIcon, 
//   ArrowPathIcon,
//   ChartBarIcon,
//   BookOpenIcon,
//   DocumentTextIcon,
//   UserIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   TrophyIcon,
//   StarIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   DocumentArrowDownIcon
// } from '@heroicons/react/24/outline';

// const StudentCoursesGrades = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [studentCourses, setStudentCourses] = useState([]);
//   const [courseDetails, setCourseDetails] = useState([]);
//   const [grades, setGrades] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [activeView, setActiveView] = useState('grid');
//   const [showStatistics, setShowStatistics] = useState(true);
//   const [selectedSemester, setSelectedSemester] = useState('all');
//   const [exportingPDF, setExportingPDF] = useState(false);

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Create axios instance with auth headers
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor to include auth token
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const safeApiCall = async (url, options = {}) => {
//     try {
//       const response = await api.get(url, options);
//       return response.data;
//     } catch (err) {
//       if (err.response?.status === 404) {
//         return null;
//       }
//       console.error(`Error calling ${url}:`, err);
//       throw err;
//     }
//   };

//   // Get current student username from localStorage
//   const getCurrentStudentUsername = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       return userData.username;
//     } catch (error) {
//       console.error('Error getting user data from localStorage:', error);
//       return null;
//     }
//   };

//   // Get current student ID
//   const getCurrentStudentId = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       return userData.id || userData.userId || userData.student_id || userData.username;
//     } catch (error) {
//       console.error('Error getting student ID from localStorage:', error);
//       return null;
//     }
//   };

//   // Fetch student data
//   const fetchStudentData = async () => {
//     try {
//       setError('');
//       setLoading(true);
      
//       const username = getCurrentStudentUsername();
//       const studentId = getCurrentStudentId();
      
//       if (!username) {
//         setError('No user logged in. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       // Fetch student information
//       const studentResponse = await safeApiCall(`students/${username}/`);
//       if (!studentResponse) {
//         setError('Student data not found. Please check your account.');
//         setLoading(false);
//         return;
//       }
//       setStudentData(studentResponse);

//       // Fetch student's enrolled courses
//       const coursesResponse = await safeApiCall(`students/${username}/courses/`);
      
//       let studentCoursesData = [];
//       if (Array.isArray(coursesResponse)) {
//         studentCoursesData = coursesResponse;
//       } else if (coursesResponse?.courses && Array.isArray(coursesResponse.courses)) {
//         studentCoursesData = coursesResponse.courses;
//       } else if (coursesResponse?.results && Array.isArray(coursesResponse.results)) {
//         studentCoursesData = coursesResponse.results;
//       }
      
//       setStudentCourses(studentCoursesData);

//       // Fetch all courses to get complete course details
//       const allCourses = await safeApiCall('courses/courses/') || [];

//       // Merge student courses with full course details
//       const mergedCourseDetails = studentCoursesData.map(studentCourse => {
//         const fullCourse = allCourses.find(course => 
//           course.course_id === studentCourse.course_id || 
//           course.id === studentCourse.course_id
//         );
//         return {
//           ...studentCourse,
//           ...fullCourse
//         };
//       });

//       setCourseDetails(mergedCourseDetails);
//       await fetchAllStudentGrades(username, studentId, mergedCourseDetails);

//     } catch (err) {
//       console.error('Error in fetchStudentData:', err);
//       if (err.response?.status === 401) {
//         setError('Authentication failed. Please log in again.');
//       } else if (err.response?.status !== 404) {
//         setError('Failed to fetch student data. Please check your connection.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch ALL grades for the student
//   const fetchAllStudentGrades = async (username, studentId, courses) => {
//     try {
//       const gradeEndpoints = [
//         `grades/dynamic-grades/?student=${username}`,
//         `grades/dynamic-grades/?student=${studentId}`,
//         `students/${username}/grades/`,
//         `grades/dynamic-grades/`
//       ];

//       let allGrades = [];
      
//       for (const endpoint of gradeEndpoints) {
//         try {
//           const response = await safeApiCall(endpoint);
//           if (response?.results && Array.isArray(response.results)) {
//             allGrades = response.results;
//             break;
//           } else if (Array.isArray(response)) {
//             allGrades = response;
//             break;
//           } else if (response?.grades && Array.isArray(response.grades)) {
//             allGrades = response.grades;
//             break;
//           }
//         } catch (err) {
//           continue;
//         }
//       }

//       // Create a grades map by course ID
//       const gradesData = {};
//       courses.forEach(course => {
//         const courseId = course.course_id || course.id;
//         const courseGrade = allGrades.find(grade => 
//           grade.course === courseId ||
//           grade.course_id === courseId ||
//           (grade.course && grade.course.course_id === courseId) ||
//           (grade.course && grade.course.id === courseId)
//         );
//         gradesData[courseId] = courseGrade || null;
//       });

//       setGrades(gradesData);
//     } catch (err) {
//       console.error('Error fetching all grades:', err);
//       const gradesData = {};
//       courseDetails.forEach(course => {
//         const courseId = course.course_id || course.id;
//         gradesData[courseId] = null;
//       });
//       setGrades(gradesData);
//     }
//   };

//   // Generate PDF Transcript without external dependencies
//   const generatePDFTranscript = async () => {
//     setExportingPDF(true);
//     try {
//       // Create a printable HTML content
//       const transcriptContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Academic Transcript - ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</title>
//           <style>
//             body { 
//               font-family: 'Arial', sans-serif; 
//               margin: 0; 
//               padding: 20px; 
//               color: #333;
//             }
//             .header { 
//               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//               color: white; 
//               padding: 30px; 
//               text-align: center;
//               border-radius: 10px;
//               margin-bottom: 30px;
//             }
//             .student-info { 
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 20px;
//               margin-bottom: 30px;
//               padding: 20px;
//               background: #f8fafc;
//               border-radius: 10px;
//             }
//             .stats { 
//               background: white;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//               margin-bottom: 30px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             }
//             th {
//               background: #3b82f6;
//               color: white;
//               padding: 12px;
//               text-align: left;
//             }
//             td {
//               padding: 12px;
//               border-bottom: 1px solid #e2e8f0;
//             }
//             tr:nth-child(even) {
//               background: #f8fafc;
//             }
//             .grade-A { background: #dcfce7; color: #166534; }
//             .grade-B { background: #dbeafe; color: #1e40af; }
//             .grade-C { background: #fef3c7; color: #92400e; }
//             .grade-D { background: #fed7aa; color: #c2410c; }
//             .grade-F { background: #fecaca; color: #dc2626; }
//             .footer {
//               text-align: center;
//               margin-top: 40px;
//               color: #64748b;
//               font-size: 12px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>ACADEMIC TRANSCRIPT</h1>
//             <p>University Official Document</p>
//           </div>
          
//           <div class="student-info">
//             <div>
//               <h3>Student Information</h3>
//               <p><strong>Name:</strong> ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</p>
//               <p><strong>Student ID:</strong> ${studentData?.username}</p>
//               <p><strong>Batch:</strong> ${studentData?.username?.batch || 'N/A'}</p>
//             </div>
//             <div>
//               <h3>Academic Information</h3>
//               <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
//               <p><strong>Total Courses:</strong> ${courseDetails.length}</p>
//               <p><strong>Status:</strong> Active Student</p>
//             </div>
//           </div>

//           ${(() => {
//             const stats = calculateStatistics();
//             if (stats) {
//               return `
//                 <div class="stats">
//                   <h3>Academic Summary</h3>
//                   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px;">
//                     <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.gpa}</div>
//                       <div style="font-size: 12px; color: #64748b;">GPA</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${stats.completedCourses}/${stats.totalCourses}</div>
//                       <div style="font-size: 12px; color: #64748b;">Completed</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #faf5ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${stats.averagePercentage}%</div>
//                       <div style="font-size: 12px; color: #64748b;">Average</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #fff7ed; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #ea580c;">${stats.totalCredits}</div>
//                       <div style="font-size: 12px; color: #64748b;">Credits</div>
//                     </div>
//                   </div>
//                 </div>
//               `;
//             }
//             return '';
//           })()}

//           <table>
//             <thead>
//               <tr>
//                 <th>Course Name</th>
//                 <th>Course ID</th>
//                 <th>Credits</th>
//                 <th>Year</th>
//                 <th>Semester</th>
//                 <th>Grade</th>
//                 <th>Percentage</th>
//                 <th>Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${courseDetails.map(course => {
//                 const courseId = course.course_id || course.id;
//                 const grade = grades[courseId];
//                 const gradeClass = grade?.final_grade ? `grade-${grade.final_grade}` : '';
//                 return `
//                   <tr>
//                     <td>${course.course_name || course.course_id}</td>
//                     <td>${courseId}</td>
//                     <td>${course.course_credit || 0}</td>
//                     <td>${course.course_taken_year || 'N/A'}</td>
//                     <td>${course.course_taken_semester || 'N/A'}</td>
//                     <td class="${gradeClass}">${grade?.final_grade || 'N/A'}</td>
//                     <td>${grade?.percentage ? `${grade.percentage}%` : 'N/A'}</td>
//                     <td>${grade ? `${grade.total_score}/${grade.max_possible_score}` : 'N/A'}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>

//           <div class="footer">
//             <p>Official Transcript - Generated by University Academic System</p>
//             <p>This document is computer-generated and requires no signature</p>
//           </div>
//         </body>
//         </html>
//       `;

//       // Open print dialog
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(transcriptContent);
//       printWindow.document.close();
      
//       // Wait for content to load then print
//       printWindow.onload = () => {
//         printWindow.print();
//         printWindow.onafterprint = () => {
//           printWindow.close();
//           setExportingPDF(false);
//         };
//       };

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       setExportingPDF(false);
//       alert('Error generating transcript. Please try again.');
//     }
//   };

//   // Toggle course accordion
//   const toggleCourse = (courseId) => {
//     setExpandedCourses(prev => ({
//       ...prev,
//       [courseId]: !prev[courseId]
//     }));
//   };

//   // Calculate statistics
//   const calculateStatistics = () => {
//     const coursesWithGrades = courseDetails.filter(course => {
//       const courseId = course.course_id || course.id;
//       return grades[courseId] && grades[courseId].final_grade;
//     });
    
//     if (coursesWithGrades.length === 0) return null;

//     const gradePoints = {
//       'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0
//     };

//     let totalCredits = 0;
//     let totalGradePoints = 0;
//     let completedCourses = 0;
//     let totalPercentage = 0;
//     let gradeDistribution = { 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0 };

//     coursesWithGrades.forEach(course => {
//       const courseId = course.course_id || course.id;
//       const grade = grades[courseId];
//       if (grade && grade.final_grade) {
//         const credits = course.course_credit || 3;
//         const gradePoint = gradePoints[grade.final_grade] || 0;
        
//         totalCredits += credits;
//         totalGradePoints += gradePoint * credits;
//         completedCourses++;
//         totalPercentage += parseFloat(grade.percentage || 0);
        
//         if (gradeDistribution[grade.final_grade] !== undefined) {
//           gradeDistribution[grade.final_grade]++;
//         }
//       }
//     });

//     const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
//     const averagePercentage = completedCourses > 0 ? (totalPercentage / completedCourses).toFixed(1) : 0;

//     return {
//       totalCourses: courseDetails.length,
//       completedCourses,
//       gpa,
//       averagePercentage,
//       totalCredits,
//       gradeDistribution
//     };
//   };

//   // Get grade badge with color and animation
//   const GradeBadge = ({ grade }) => {
//     if (!grade || !grade.final_grade) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 animate-pulse border border-gray-300">
//           <StarIcon className="h-4 w-4 mr-1" />
//           Pending
//         </span>
//       );
//     }

//     const colorClasses = {
//       'A': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border border-green-600',
//       'B': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border border-blue-600',
//       'C': 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg border border-yellow-600',
//       'D': 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border border-orange-600',
//       'F': 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg border border-red-600'
//     };

//     return (
//       <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transform hover:scale-105 transition-all duration-200 ${colorClasses[grade.final_grade] || 'bg-gray-100 text-gray-800'}`}>
//         {grade.final_grade}
//       </span>
//     );
//   };

//   // Get course display name
//   const getCourseName = (course) => {
//     return course.course_name || course.name || course.course_id || 'Unknown Course';
//   };

//   // Get course ID
//   const getCourseId = (course) => {
//     return course.course_id || course.id;
//   };

//   // Get available semesters for filter
//   const getAvailableSemesters = () => {
//     const semesters = new Set();
//     courseDetails.forEach(course => {
//       if (course.course_taken_year && course.course_taken_semester) {
//         semesters.add(`${course.course_taken_year}-${course.course_taken_semester}`);
//       }
//     });
//     return ['all', ...Array.from(semesters)];
//   };

//   // Filter courses by semester
//   const getFilteredCourses = () => {
//     if (selectedSemester === 'all') return courseDetails;
//     return courseDetails.filter(course => 
//       `${course.course_taken_year}-${course.course_taken_semester}` === selectedSemester
//     );
//   };

//   // Get grade progress percentage
//   const getGradeProgress = (grade) => {
//     if (!grade || !grade.percentage) return 0;
//     return Math.min(100, Math.max(0, grade.percentage));
//   };

//   // Get grade color for progress bar
//   const getProgressColor = (percentage) => {
//     if (percentage >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
//     if (percentage >= 80) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
//     if (percentage >= 70) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
//     if (percentage >= 60) return 'bg-gradient-to-r from-orange-500 to-red-500';
//     return 'bg-gradient-to-r from-red-500 to-pink-600';
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const statistics = calculateStatistics();
//   const filteredCourses = getFilteredCourses();
//   const availableSemesters = getAvailableSemesters();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-96">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600 text-lg font-semibold">Loading your academic journey...</p>
//               <p className="text-gray-500 text-sm mt-2">Preparing your courses and grades</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md mx-auto">
//             <div className="text-red-500 text-center mb-4">
//               <TrophyIcon className="h-16 w-16 mx-auto" />
//             </div>
//             <h3 className="text-xl font-bold text-red-800 text-center mb-2">Oops! Something went wrong</h3>
//             <p className="text-red-600 text-center mb-6">{error}</p>
//             <button 
//               onClick={fetchStudentData}
//               className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
//                 <AcademicCapIcon className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Academic Portfolio
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {studentData?.username?.firstName} {studentData?.username?.fatherName}
//                   {studentData?.username?.batch && ` • Batch ${studentData.username.batch}`}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowStatistics(!showStatistics)}
//                 className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-gray-200/50"
//               >
//                 {showStatistics ? <EyeSlashIcon className="h-4 w-4 mr-2" /> : <EyeIcon className="h-4 w-4 mr-2" />}
//                 {showStatistics ? 'Hide Stats' : 'Show Stats'}
//               </button>
              
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Semesters</option>
//                 {availableSemesters.filter(s => s !== 'all').map(semester => (
//                   <option key={semester} value={semester}>
//                     {semester.replace('-', ' - Semester ')}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
//                 <button
//                   onClick={() => setActiveView('grid')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'grid' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Grid
//                 </button>
//                 <button
//                   onClick={() => setActiveView('list')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'list' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   List
//                 </button>
//               </div>

//               <button
//                 onClick={generatePDFTranscript}
//                 disabled={exportingPDF}
//                 className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {exportingPDF ? (
//                   <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
//                 )}
//                 {exportingPDF ? 'Generating...' : 'Export PDF'}
//               </button>
              
//               <button
//                 onClick={fetchStudentData}
//                 className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//               >
//                 <ArrowPathIcon className="h-4 w-4 mr-2" />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Statistics */}
//           {showStatistics && statistics && (
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-blue-100 text-sm font-medium">Cumulative GPA</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.gpa}/4.0</h3>
//                   </div>
//                   <TrophyIcon className="h-8 w-8 text-blue-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-blue-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(parseFloat(statistics.gpa) / 4.0) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-green-100 text-sm font-medium">Course Progress</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.completedCourses}/{statistics.totalCourses}</h3>
//                   </div>
//                   <BookOpenIcon className="h-8 w-8 text-green-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-green-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(statistics.completedCourses / statistics.totalCourses) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-purple-100 text-sm font-medium">Average Score</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.averagePercentage}%</h3>
//                   </div>
//                   <ChartBarIcon className="h-8 w-8 text-purple-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-purple-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${statistics.averagePercentage}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-orange-100 text-sm font-medium">Total Credits</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.totalCredits}</h3>
//                   </div>
//                   <CreditCardIcon className="h-8 w-8 text-orange-200" />
//                 </div>
//                 <p className="text-orange-200 text-sm mt-2 font-medium">Completed this semester</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Courses Section */}
//         <div className={`${activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}`}>
//           {filteredCourses.length === 0 ? (
//             <div className="col-span-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
//               <div className="text-gray-400 mb-4">
//                 <AcademicCapIcon className="mx-auto h-16 w-16" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
//               <p className="text-gray-500 text-lg">No courses match your current filters.</p>
//             </div>
//           ) : (
//             filteredCourses.map((course) => {
//               const courseId = getCourseId(course);
//               const grade = grades[courseId];
//               const isExpanded = expandedCourses[courseId];
//               const progress = getGradeProgress(grade);

//               return (
//                 <div key={courseId} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
//                   activeView === 'list' ? 'flex flex-col' : ''
//                 }`}>
                  
//                   {/* Course Header */}
//                   <div className={`p-6 ${activeView === 'list' ? 'flex-1' : ''}`}>
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className={`w-3 h-3 rounded-full ${grade ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                           <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
//                             {getCourseName(course)}
//                           </h3>
//                         </div>
//                         <p className="text-gray-600 text-sm mb-3">
//                           {courseId} • {course.course_credit || 0} Credits
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {course.course_taken_year && (
//                             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
//                               <CalendarIcon className="h-3 w-3 mr-1" />
//                               {course.course_taken_year}
//                             </span>
//                           )}
//                           {course.course_taken_semester && (
//                             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
//                               {course.course_taken_semester}
//                             </span>
//                           )}
//                           {course.course_category && (
//                             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
//                               {course.course_category}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end space-y-2">
//                         <GradeBadge grade={grade} />
//                         <button
//                           onClick={() => toggleCourse(courseId)}
//                           className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
//                         >
//                           {isExpanded ? 
//                             <ChevronUpIcon className="h-5 w-5" /> : 
//                             <ChevronDownIcon className="h-5 w-5" />
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     {/* Progress Bar */}
//                     {grade && (
//                       <div className="mt-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
//                           <span>Course Progress</span>
//                           <span>{grade.percentage}%</span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-2">
//                           <div 
//                             className={`h-2 rounded-full transition-all duration-1000 ease-out ${getProgressColor(progress)}`}
//                             style={{ width: `${progress}%` }}
//                           ></div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Course Details */}
//                   {isExpanded && (
//                     <div className="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
//                       {grade ? (
//                         <div className="space-y-6">
//                           {/* Grade Overview */}
//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {grade.total_score}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Score</div>
//                             </div>
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {grade.max_possible_score}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Max Score</div>
//                             </div>
//                           </div>

//                           {/* Grade Components */}
//                           {Object.entries(grade.grade_components || {}).length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                                 <BookOpenIcon className="h-4 w-4 mr-2" />
//                                 Assessment Breakdown
//                               </h4>
//                               <div className="space-y-3">
//                                 {Object.entries(grade.grade_components || {}).map(([component, data]) => (
//                                   <div key={component} className="bg-white p-4 rounded-xl border border-gray-200">
//                                     <div className="flex justify-between items-center mb-2">
//                                       <span className="font-medium text-gray-900 capitalize">{component}</span>
//                                       <span className="text-sm font-semibold text-blue-600">
//                                         {((data.score / data.max_score) * 100).toFixed(1)}%
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                       <span>Score: {data.score}/{data.max_score}</span>
//                                       <span>Weight: {data.weight}</span>
//                                     </div>
//                                     <div className="w-full bg-gray-200 rounded-full h-2">
//                                       <div 
//                                         className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
//                                         style={{ width: `${(data.score / data.max_score) * 100}%` }}
//                                       ></div>
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-center py-6">
//                           <div className="text-gray-400 mb-3">
//                             <StarIcon className="mx-auto h-12 w-12" />
//                           </div>
//                           <h4 className="text-lg font-medium text-gray-900 mb-2">Awaiting Assessment</h4>
//                           <p className="text-gray-500">Your performance in this course is yet to be evaluated.</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCoursesGrades;








// // components/StudentCoursesGrades.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { 
//   AcademicCapIcon, 
//   ChevronDownIcon, 
//   ChevronUpIcon, 
//   ArrowPathIcon,
//   ChartBarIcon,
//   BookOpenIcon,
//   DocumentTextIcon,
//   UserIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   TrophyIcon,
//   StarIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   DocumentArrowDownIcon
// } from '@heroicons/react/24/outline';

// const StudentCoursesGrades = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [studentCourses, setStudentCourses] = useState([]);
//   const [courseDetails, setCourseDetails] = useState([]);
//   const [grades, setGrades] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [activeView, setActiveView] = useState('grid');
//   const [showStatistics, setShowStatistics] = useState(true);
//   const [selectedSemester, setSelectedSemester] = useState('all');
//   const [exportingPDF, setExportingPDF] = useState(false);

//   // Calculate final grade based on total_score only
//   const calculateGradeFromTotalScore = (grade) => {
//     if (!grade || !grade.total_score) return null;
    
//     const totalScore = parseFloat(grade.total_score);
    
//     // Define your grading scale based on total_score only
//     if (totalScore >= 90) return { finalGrade: 'A+', totalScore };
//     if (totalScore >= 85) return { finalGrade: 'A', totalScore };
//     if (totalScore >= 80) return { finalGrade: 'A-', totalScore };
//     if (totalScore >= 75) return { finalGrade: 'B+', totalScore };
//     if (totalScore >= 70) return { finalGrade: 'B', totalScore };
//     if (totalScore >= 65) return { finalGrade: 'B-', totalScore };
//     if (totalScore >= 60) return { finalGrade: 'C+', totalScore };
//     if (totalScore >= 50) return { finalGrade: 'C', totalScore };
//     if (totalScore >= 45) return { finalGrade: 'C-', totalScore };
//     if (totalScore >= 40) return { finalGrade: 'D', totalScore };
//     return { finalGrade: 'F', totalScore };
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Create axios instance with auth headers
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor to include auth token
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const safeApiCall = async (url, options = {}) => {
//     try {
//       const response = await api.get(url, options);
//       return response.data;
//     } catch (err) {
//       if (err.response?.status === 404) {
//         return null;
//       }
//       console.error(`Error calling ${url}:`, err);
//       throw err;
//     }
//   };

//   // Get current student username from localStorage
//   const getCurrentStudentUsername = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       return userData.username;
//     } catch (error) {
//       console.error('Error getting user data from localStorage:', error);
//       return null;
//     }
//   };

//   // Get current student ID
//   // Get current student ID - UPDATED
// const getCurrentStudentId = () => {
//   try {
//     const userData = JSON.parse(localStorage.getItem('user') || '{}');
//     // Prefer userId from user data as it's the correct student ID (DBU12021)
//     return userData.userId || userData.id || userData.student_id || userData.username;
//   } catch (error) {
//     console.error('Error getting student ID from localStorage:', error);
//     return null;
//   }
// };

//   // Fetch student data
//   const fetchStudentData = async () => {
//     try {
//       setError('');
//       setLoading(true);
      
//       const username = getCurrentStudentUsername();
//       const studentId = getCurrentStudentId();
      
//       if (!username) {
//         setError('No user logged in. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       // Fetch student information
//       const studentResponse = await safeApiCall(`students/${username}/`);
//       if (!studentResponse) {
//         setError('Student data not found. Please check your account.');
//         setLoading(false);
//         return;
//       }
//       setStudentData(studentResponse);

//       // Fetch student's enrolled courses
//       const coursesResponse = await safeApiCall(`students/${username}/courses/`);
      
//       let studentCoursesData = [];
//       if (Array.isArray(coursesResponse)) {
//         studentCoursesData = coursesResponse;
//       } else if (coursesResponse?.courses && Array.isArray(coursesResponse.courses)) {
//         studentCoursesData = coursesResponse.courses;
//       } else if (coursesResponse?.results && Array.isArray(coursesResponse.results)) {
//         studentCoursesData = coursesResponse.results;
//       }
      
//       setStudentCourses(studentCoursesData);

//       // Fetch all courses to get complete course details
//       const allCourses = await safeApiCall('courses/courses/') || [];

//       // Merge student courses with full course details
//       const mergedCourseDetails = studentCoursesData.map(studentCourse => {
//         const fullCourse = allCourses.find(course => 
//           course.course_id === studentCourse.course_id || 
//           course.id === studentCourse.course_id
//         );
//         return {
//           ...studentCourse,
//           ...fullCourse
//         };
//       });

//       setCourseDetails(mergedCourseDetails);
//       await fetchAllStudentGrades(username, studentId, mergedCourseDetails);

//     } catch (err) {
//       console.error('Error in fetchStudentData:', err);
//       if (err.response?.status === 401) {
//         setError('Authentication failed. Please log in again.');
//       } else if (err.response?.status !== 404) {
//         setError('Failed to fetch student data. Please check your connection.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch ALL grades for the student
//   // Fetch ALL grades for the student - FIXED VERSION
// // Fetch ALL grades for the student - PROPERLY FILTERED VERSION
// const fetchAllStudentGrades = async (username, studentId, courses) => {
//   try {
//     console.log('=== STARTING GRADE FETCH ===');
//     console.log('Username:', username);
//     console.log('Student ID:', studentId);
//     console.log('Number of courses:', courses.length);

//     const correctStudentId = studentData?.userId || studentData?.id || studentId;
//     console.log('Using student ID for filtering:', correctStudentId);

//     // Get ALL grades first
//     const response = await safeApiCall('grades/dynamic-grades/');
    
//     if (response?.results) {
//       const allGrades = response.results;
//       console.log('All grades from API:', allGrades.length);
      
//       // FILTER GRADES BY CURRENT STUDENT
//       const studentGrades = allGrades.filter(grade => {
//         const gradeStudentId = grade.student; // This is the numeric ID from the database
//         const gradeStudentUsername = grade.student_username; // This is the display name
        
//         console.log(`Grade student ID: ${gradeStudentId}, Username: ${gradeStudentUsername}`);
        
//         // Check if this grade belongs to the current student
//         // We need to match by either the numeric ID or the username
//         const matches = (
//           gradeStudentUsername?.includes(correctStudentId) || 
//           gradeStudentUsername?.includes(username) ||
//           (studentData?.id && gradeStudentId === studentData.id)
//         );
        
//         if (matches) {
//           console.log(`✅ Grade matches current student:`, grade);
//         }
        
//         return matches;
//       });

//       console.log(`Filtered to ${studentGrades.length} grades for current student ${correctStudentId}`);
//       console.log('Student grades:', studentGrades);

//       // Create a grades map by course ID
//       const gradesData = {};
//       courses.forEach(course => {
//         const courseId = course.course_id || course.id;
//         const courseName = course.course_name || courseId;
        
//         const courseGrade = studentGrades.find(grade => {
//           const gradeCourse = grade.course || grade.course_id;
//           return gradeCourse === courseId;
//         });
        
//         gradesData[courseId] = courseGrade || null;
        
//         if (courseGrade) {
//           console.log(`✅ Found grade for course ${courseId}:`, courseGrade);
//         } else {
//           console.log(`❌ No grade found for course ${courseId}`);
//         }
//       });

//       console.log('Final grades data:', gradesData);
//       setGrades(gradesData);
//     } else {
//       console.log('No grades response from API');
//       // Initialize with null grades
//       const gradesData = {};
//       courses.forEach(course => {
//         const courseId = course.course_id || course.id;
//         gradesData[courseId] = null;
//       });
//       setGrades(gradesData);
//     }

//   } catch (err) {
//     console.error('Error fetching all grades:', err);
//     // Initialize with null grades for all courses
//     const gradesData = {};
//     courses.forEach(course => {
//       const courseId = course.course_id || course.id;
//       gradesData[courseId] = null;
//     });
//     setGrades(gradesData);
//   }
// };

//   // Generate PDF Transcript without external dependencies
//   const generatePDFTranscript = async () => {
//     setExportingPDF(true);
//     try {
//       // Create a printable HTML content
//       const transcriptContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Academic Transcript - ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</title>
//           <style>
//             body { 
//               font-family: 'Arial', sans-serif; 
//               margin: 0; 
//               padding: 20px; 
//               color: #333;
//             }
//             .header { 
//               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//               color: white; 
//               padding: 30px; 
//               text-align: center;
//               border-radius: 10px;
//               margin-bottom: 30px;
//             }
//             .student-info { 
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 20px;
//               margin-bottom: 30px;
//               padding: 20px;
//               background: #f8fafc;
//               border-radius: 10px;
//             }
//             .stats { 
//               background: white;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//               margin-bottom: 30px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             }
//             th {
//               background: #3b82f6;
//               color: white;
//               padding: 12px;
//               text-align: left;
//             }
//             td {
//               padding: 12px;
//               border-bottom: 1px solid #e2e8f0;
//             }
//             tr:nth-child(even) {
//               background: #f8fafc;
//             }
//             .grade-A { background: #dcfce7; color: #166534; }
//             .grade-B { background: #dbeafe; color: #1e40af; }
//             .grade-C { background: #fef3c7; color: #92400e; }
//             .grade-D { background: #fed7aa; color: #c2410c; }
//             .grade-F { background: #fecaca; color: #dc2626; }
//             .footer {
//               text-align: center;
//               margin-top: 40px;
//               color: #64748b;
//               font-size: 12px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>ACADEMIC TRANSCRIPT</h1>
//             <p>University Official Document</p>
//           </div>
          
//           <div class="student-info">
//             <div>
//               <h3>Student Information</h3>
//               <p><strong>Name:</strong> ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</p>
//               <p><strong>Student ID:</strong> ${studentData?.username}</p>
//               <p><strong>Batch:</strong> ${studentData?.username?.batch || 'N/A'}</p>
//             </div>
//             <div>
//               <h3>Academic Information</h3>
//               <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
//               <p><strong>Total Courses:</strong> ${courseDetails.length}</p>
//               <p><strong>Status:</strong> Active Student</p>
//             </div>
//           </div>

//           ${(() => {
//             const stats = calculateStatistics();
//             if (stats) {
//               return `
//                 <div class="stats">
//                   <h3>Academic Summary</h3>
//                   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px;">
//                     <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.gpa}</div>
//                       <div style="font-size: 12px; color: #64748b;">GPA</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${stats.completedCourses}/${stats.totalCourses}</div>
//                       <div style="font-size: 12px; color: #64748b;">Completed</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #faf5ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${stats.averageScore}</div>
//                       <div style="font-size: 12px; color: #64748b;">Avg Score</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #fff7ed; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #ea580c;">${stats.totalCredits}</div>
//                       <div style="font-size: 12px; color: #64748b;">Credits</div>
//                     </div>
//                   </div>
//                 </div>
//               `;
//             }
//             return '';
//           })()}

//           <table>
//             <thead>
//               <tr>
//                 <th>Course Name</th>
//                 <th>Course ID</th>
//                 <th>Credits</th>
//                 <th>Year</th>
//                 <th>Semester</th>
//                 <th>Grade</th>
//                 <th>Total Score</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${courseDetails.map(course => {
//                 const courseId = course.course_id || course.id;
//                 const grade = grades[courseId];
//                 const calculatedGrade = calculateGradeFromTotalScore(grade);
//                 const finalGrade = calculatedGrade ? calculatedGrade.finalGrade : 'N/A';
//                 const gradeClass = finalGrade !== 'N/A' ? `grade-${finalGrade.charAt(0)}` : '';
//                 return `
//                   <tr>
//                     <td>${course.course_name || course.course_id}</td>
//                     <td>${courseId}</td>
//                     <td>${course.course_credit || 0}</td>
//                     <td>${course.course_taken_year || 'N/A'}</td>
//                     <td>${course.course_taken_semester || 'N/A'}</td>
//                     <td class="${gradeClass}">${finalGrade}</td>
//                     <td>${grade?.total_score || 'N/A'}</td>
//                     <td>${grade ? 'Completed' : 'In Progress'}</td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>

//           <div class="footer">
//             <p>Official Transcript - Generated by University Academic System</p>
//             <p>This document is computer-generated and requires no signature</p>
//           </div>
//         </body>
//         </html>
//       `;

//       // Open print dialog
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(transcriptContent);
//       printWindow.document.close();
      
//       // Wait for content to load then print
//       printWindow.onload = () => {
//         printWindow.print();
//         printWindow.onafterprint = () => {
//           printWindow.close();
//           setExportingPDF(false);
//         };
//       };

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       setExportingPDF(false);
//       alert('Error generating transcript. Please try again.');
//     }
//   };

//   // Toggle course accordion
//   const toggleCourse = (courseId) => {
//     setExpandedCourses(prev => ({
//       ...prev,
//       [courseId]: !prev[courseId]
//     }));
//   };

//   // Calculate statistics
//   const calculateStatistics = () => {
//     const coursesWithGrades = courseDetails.filter(course => {
//       const courseId = course.course_id || course.id;
//       return grades[courseId] && grades[courseId].total_score;
//     });
    
//     if (coursesWithGrades.length === 0) return null;

//     const gradePoints = {
//       'A+': 4.0, 'A': 4.0, 'A-': 3.7,
//       'B+': 3.3, 'B': 3.0, 'B-': 2.7,
//       'C+': 2.3, 'C': 2.0, 'C-': 1.7,
//       'D': 1.0, 'F': 0.0
//     };

//     let totalCredits = 0;
//     let totalGradePoints = 0;
//     let completedCourses = 0;
//     let totalScoreSum = 0;
//     let gradeDistribution = { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'D': 0, 'F': 0 };

//     coursesWithGrades.forEach(course => {
//       const courseId = course.course_id || course.id;
//       const grade = grades[courseId];
//       if (grade && grade.total_score) {
//         const calculatedGrade = calculateGradeFromTotalScore(grade);
//         if (calculatedGrade) {
//           const { finalGrade, totalScore } = calculatedGrade;
//           const credits = course.course_credit || 3;
//           const gradePoint = gradePoints[finalGrade] || 0;
          
//           totalCredits += credits;
//           totalGradePoints += gradePoint * credits;
//           completedCourses++;
//           totalScoreSum += totalScore;
          
//           if (gradeDistribution[finalGrade] !== undefined) {
//             gradeDistribution[finalGrade]++;
//           }
//         }
//       }
//     });

//     const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
//     const averageScore = completedCourses > 0 ? (totalScoreSum / completedCourses).toFixed(1) : 0;

//     return {
//       totalCourses: courseDetails.length,
//       completedCourses,
//       gpa,
//       averageScore,
//       totalCredits,
//       gradeDistribution
//     };
//   };

//   // Get grade badge with color and animation
//   const GradeBadge = ({ grade }) => {
//     if (!grade || !grade.total_score) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 animate-pulse border border-gray-300">
//           <StarIcon className="h-4 w-4 mr-1" />
//           Pending
//         </span>
//       );
//     }

//     const calculatedGrade = calculateGradeFromTotalScore(grade);
//     if (!calculatedGrade) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
//           N/A
//         </span>
//       );
//     }

//     const { finalGrade, totalScore } = calculatedGrade;
    
//     const colorClasses = {
//       'A+': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border border-green-600',
//       'A': 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg border border-green-500',
//       'A-': 'bg-gradient-to-r from-green-300 to-green-500 text-white shadow-lg border border-green-400',
//       'B+': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg border border-blue-500',
//       'B': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border border-blue-600',
//       'B-': 'bg-gradient-to-r from-blue-300 to-blue-500 text-white shadow-lg border border-blue-400',
//       'C+': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg border border-yellow-500',
//       'C': 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg border border-yellow-600',
//       'C-': 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white shadow-lg border border-yellow-400',
//       'D': 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border border-orange-600',
//       'F': 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg border border-red-600'
//     };

//     return (
//       <div className="flex flex-col items-end space-y-1">
//         <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transform hover:scale-105 transition-all duration-200 ${colorClasses[finalGrade] || 'bg-gray-100 text-gray-800'}`}>
//           {finalGrade}
//         </span>
//         <span className="text-xs text-gray-500 font-medium">
//           Score: {totalScore}
//         </span>
//       </div>
//     );
//   };

//   // Get course display name
//   const getCourseName = (course) => {
//     return course.course_name || course.name || course.course_id || 'Unknown Course';
//   };

//   // Get course ID
//   const getCourseId = (course) => {
//     return course.course_id || course.id;
//   };

//   // Get available semesters for filter
//   const getAvailableSemesters = () => {
//     const semesters = new Set();
//     courseDetails.forEach(course => {
//       if (course.course_taken_year && course.course_taken_semester) {
//         semesters.add(`${course.course_taken_year}-${course.course_taken_semester}`);
//       }
//     });
//     return ['all', ...Array.from(semesters)];
//   };

//   // Filter courses by semester
//   const getFilteredCourses = () => {
//     if (selectedSemester === 'all') return courseDetails;
//     return courseDetails.filter(course => 
//       `${course.course_taken_year}-${course.course_taken_semester}` === selectedSemester
//     );
//   };

//   // Get progress color for score display
//   const getScoreColor = (totalScore) => {
//     if (totalScore >= 90) return 'text-green-600';
//     if (totalScore >= 80) return 'text-blue-600';
//     if (totalScore >= 70) return 'text-yellow-600';
//     if (totalScore >= 60) return 'text-orange-600';
//     return 'text-red-600';
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const statistics = calculateStatistics();
//   const filteredCourses = getFilteredCourses();
//   const availableSemesters = getAvailableSemesters();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-96">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600 text-lg font-semibold">Loading your academic journey...</p>
//               <p className="text-gray-500 text-sm mt-2">Preparing your courses and grades</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md mx-auto">
//             <div className="text-red-500 text-center mb-4">
//               <TrophyIcon className="h-16 w-16 mx-auto" />
//             </div>
//             <h3 className="text-xl font-bold text-red-800 text-center mb-2">Oops! Something went wrong</h3>
//             <p className="text-red-600 text-center mb-6">{error}</p>
//             <button 
//               onClick={fetchStudentData}
//               className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
//                 <AcademicCapIcon className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Academic Portfolio
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {studentData?.username?.firstName} {studentData?.username?.fatherName}
//                   {studentData?.username?.batch && ` • Batch ${studentData.username.batch}`}
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowStatistics(!showStatistics)}
//                 className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-gray-200/50"
//               >
//                 {showStatistics ? <EyeSlashIcon className="h-4 w-4 mr-2" /> : <EyeIcon className="h-4 w-4 mr-2" />}
//                 {showStatistics ? 'Hide Stats' : 'Show Stats'}
//               </button>
              
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Semesters</option>
//                 {availableSemesters.filter(s => s !== 'all').map(semester => (
//                   <option key={semester} value={semester}>
//                     {semester.replace('-', ' - Semester ')}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
//                 <button
//                   onClick={() => setActiveView('grid')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'grid' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Grid
//                 </button>
//                 <button
//                   onClick={() => setActiveView('list')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'list' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   List
//                 </button>
//               </div>

//               <button
//                 onClick={generatePDFTranscript}
//                 disabled={exportingPDF}
//                 className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {exportingPDF ? (
//                   <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
//                 )}
//                 {exportingPDF ? 'Generating...' : 'Export PDF'}
//               </button>
              
//               <button
//                 onClick={fetchStudentData}
//                 className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//               >
//                 <ArrowPathIcon className="h-4 w-4 mr-2" />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Statistics */}
//           {showStatistics && statistics && (
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-blue-100 text-sm font-medium">Cumulative GPA</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.gpa}/4.0</h3>
//                   </div>
//                   <TrophyIcon className="h-8 w-8 text-blue-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-blue-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(parseFloat(statistics.gpa) / 4.0) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-green-100 text-sm font-medium">Course Progress</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.completedCourses}/{statistics.totalCourses}</h3>
//                   </div>
//                   <BookOpenIcon className="h-8 w-8 text-green-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-green-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(statistics.completedCourses / statistics.totalCourses) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-purple-100 text-sm font-medium">Average Score</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.averageScore}</h3>
//                   </div>
//                   <ChartBarIcon className="h-8 w-8 text-purple-200" />
//                 </div>
//                 <p className="text-purple-200 text-sm mt-2 font-medium">Based on total scores</p>
//               </div>

//               <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-orange-100 text-sm font-medium">Total Credits</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.totalCredits}</h3>
//                   </div>
//                   <CreditCardIcon className="h-8 w-8 text-orange-200" />
//                 </div>
//                 <p className="text-orange-200 text-sm mt-2 font-medium">Completed this semester</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Courses Section */}
//         <div className={`${activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}`}>
//           {filteredCourses.length === 0 ? (
//             <div className="col-span-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
//               <div className="text-gray-400 mb-4">
//                 <AcademicCapIcon className="mx-auto h-16 w-16" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
//               <p className="text-gray-500 text-lg">No courses match your current filters.</p>
//             </div>
//           ) : (
//             filteredCourses.map((course) => {
//               const courseId = getCourseId(course);
//               const grade = grades[courseId];
//               const isExpanded = expandedCourses[courseId];
//               const calculatedGrade = calculateGradeFromTotalScore(grade);

//               return (
//                 <div key={courseId} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
//                   activeView === 'list' ? 'flex flex-col' : ''
//                 }`}>
                  
//                   {/* Course Header */}
//                   <div className={`p-6 ${activeView === 'list' ? 'flex-1' : ''}`}>
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className={`w-3 h-3 rounded-full ${grade ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                           <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
//                             {getCourseName(course)}
//                           </h3>
//                         </div>
//                         <p className="text-gray-600 text-sm mb-3">
//                           {courseId} • {course.course_credit || 0} Credits
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {course.course_taken_year && (
//                             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
//                               <CalendarIcon className="h-3 w-3 mr-1" />
//                               {course.course_taken_year}
//                             </span>
//                           )}
//                           {course.course_taken_semester && (
//                             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
//                               {course.course_taken_semester}
//                             </span>
//                           )}
//                           {course.course_category && (
//                             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
//                               {course.course_category}
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end space-y-2">
//                         <GradeBadge grade={grade} />
//                         <button
//                           onClick={() => toggleCourse(courseId)}
//                           className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
//                         >
//                           {isExpanded ? 
//                             <ChevronUpIcon className="h-5 w-5" /> : 
//                             <ChevronDownIcon className="h-5 w-5" />
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     {/* Score Display */}
//                     {grade && grade.total_score && (
//                       <div className="mt-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
//                           <span>Total Score</span>
//                           <span className={getScoreColor(parseFloat(grade.total_score))}>
//                             {grade.total_score} points
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Course Details */}
//                   {isExpanded && (
//                     <div className="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
//                       {grade ? (
//                         <div className="space-y-6">
//                           {/* Grade Overview */}
//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {grade.total_score}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Total Score</div>
//                             </div>
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {calculatedGrade ? calculatedGrade.finalGrade : 'N/A'}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Final Grade</div>
//                             </div>
//                           </div>

//                           {/* Grade Components */}
//                           {Object.entries(grade.grade_components || {}).length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                                 <BookOpenIcon className="h-4 w-4 mr-2" />
//                                 Assessment Breakdown
//                               </h4>
//                               <div className="space-y-3">
//                                 {Object.entries(grade.grade_components || {}).map(([component, data]) => (
//                                   <div key={component} className="bg-white p-4 rounded-xl border border-gray-200">
//                                     <div className="flex justify-between items-center mb-2">
//                                       <span className="font-medium text-gray-900 capitalize">{component}</span>
//                                       <span className="text-sm font-semibold text-blue-600">
//                                         {data.score} points
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                       <span>Score: {data.score}</span>
//                                       {data.max_score && <span>Max: {data.max_score}</span>}
//                                       {data.weight && <span>Weight: {data.weight}</span>}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-center py-6">
//                           <div className="text-gray-400 mb-3">
//                             <StarIcon className="mx-auto h-12 w-12" />
//                           </div>
//                           <h4 className="text-lg font-medium text-gray-900 mb-2">Awaiting Assessment</h4>
//                           <p className="text-gray-500">Your performance in this course is yet to be evaluated.</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCoursesGrades;




// // components/StudentCoursesGrades.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { 
//   AcademicCapIcon, 
//   ChevronDownIcon, 
//   ChevronUpIcon, 
//   ArrowPathIcon,
//   ChartBarIcon,
//   BookOpenIcon,
//   DocumentTextIcon,
//   UserIcon,
//   CalendarIcon,
//   CreditCardIcon,
//   TrophyIcon,
//   StarIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   DocumentArrowDownIcon,
//   CheckBadgeIcon,
//   ClockIcon
// } from '@heroicons/react/24/outline';

// const StudentCoursesGrades = () => {
//   const [studentData, setStudentData] = useState(null);
//   const [studentCourses, setStudentCourses] = useState([]);
//   const [courseDetails, setCourseDetails] = useState([]);
//   const [grades, setGrades] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [activeView, setActiveView] = useState('grid');
//   const [showStatistics, setShowStatistics] = useState(true);
//   const [selectedSemester, setSelectedSemester] = useState('all');
//   const [exportingPDF, setExportingPDF] = useState(false);

//   // Calculate final grade based on total_score only
//   const calculateGradeFromTotalScore = (grade) => {
//     if (!grade || !grade.total_score) return null;
    
//     const totalScore = parseFloat(grade.total_score);
    
//     // Define your grading scale based on total_score only
//     if (totalScore >= 90) return { finalGrade: 'A+', totalScore };
//     if (totalScore >= 85) return { finalGrade: 'A', totalScore };
//     if (totalScore >= 80) return { finalGrade: 'A-', totalScore };
//     if (totalScore >= 75) return { finalGrade: 'B+', totalScore };
//     if (totalScore >= 70) return { finalGrade: 'B', totalScore };
//     if (totalScore >= 65) return { finalGrade: 'B-', totalScore };
//     if (totalScore >= 60) return { finalGrade: 'C+', totalScore };
//     if (totalScore >= 50) return { finalGrade: 'C', totalScore };
//     if (totalScore >= 45) return { finalGrade: 'C-', totalScore };
//     if (totalScore >= 40) return { finalGrade: 'D', totalScore };
//     return { finalGrade: 'F', totalScore };
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Create axios instance with auth headers
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor to include auth token
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   const safeApiCall = async (url, options = {}) => {
//     try {
//       const response = await api.get(url, options);
//       return response.data;
//     } catch (err) {
//       if (err.response?.status === 404) {
//         return null;
//       }
//       console.error(`Error calling ${url}:`, err);
//       throw err;
//     }
//   };

//   // Get current student username from localStorage
//   const getCurrentStudentUsername = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       return userData.username;
//     } catch (error) {
//       console.error('Error getting user data from localStorage:', error);
//       return null;
//     }
//   };

//   // Get current student ID - UPDATED
//   const getCurrentStudentId = () => {
//     try {
//       const userData = JSON.parse(localStorage.getItem('user') || '{}');
//       // Prefer userId from user data as it's the correct student ID (DBU12021)
//       return userData.userId || userData.id || userData.student_id || userData.username;
//     } catch (error) {
//       console.error('Error getting student ID from localStorage:', error);
//       return null;
//     }
//   };

//   // Fetch student data
//   const fetchStudentData = async () => {
//     try {
//       setError('');
//       setLoading(true);
      
//       const username = getCurrentStudentUsername();
//       const studentId = getCurrentStudentId();
      
//       if (!username) {
//         setError('No user logged in. Please log in again.');
//         setLoading(false);
//         return;
//       }

//       // Fetch student information
//       const studentResponse = await safeApiCall(`students/${username}/`);
//       if (!studentResponse) {
//         setError('Student data not found. Please check your account.');
//         setLoading(false);
//         return;
//       }
//       setStudentData(studentResponse);

//       // Fetch student's enrolled courses
//       const coursesResponse = await safeApiCall(`students/${username}/courses/`);
      
//       let studentCoursesData = [];
//       if (Array.isArray(coursesResponse)) {
//         studentCoursesData = coursesResponse;
//       } else if (coursesResponse?.courses && Array.isArray(coursesResponse.courses)) {
//         studentCoursesData = coursesResponse.courses;
//       } else if (coursesResponse?.results && Array.isArray(coursesResponse.results)) {
//         studentCoursesData = coursesResponse.results;
//       }
      
//       setStudentCourses(studentCoursesData);

//       // Fetch all courses to get complete course details
//       const allCourses = await safeApiCall('courses/courses/') || [];

//       // Merge student courses with full course details
//       const mergedCourseDetails = studentCoursesData.map(studentCourse => {
//         const fullCourse = allCourses.find(course => 
//           course.course_id === studentCourse.course_id || 
//           course.id === studentCourse.course_id
//         );
//         return {
//           ...studentCourse,
//           ...fullCourse
//         };
//       });

//       setCourseDetails(mergedCourseDetails);
//       await fetchAllStudentGrades(username, studentId, mergedCourseDetails);

//     } catch (err) {
//       console.error('Error in fetchStudentData:', err);
//       if (err.response?.status === 401) {
//         setError('Authentication failed. Please log in again.');
//       } else if (err.response?.status !== 404) {
//         setError('Failed to fetch student data. Please check your connection.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch ALL grades for the student - PROPERLY FILTERED VERSION
//   const fetchAllStudentGrades = async (username, studentId, courses) => {
//     try {
//       console.log('=== STARTING GRADE FETCH ===');
//       console.log('Username:', username);
//       console.log('Student ID:', studentId);
//       console.log('Number of courses:', courses.length);

//       const correctStudentId = studentData?.userId || studentData?.id || studentId;
//       console.log('Using student ID for filtering:', correctStudentId);

//       // Get ALL grades first
//       const response = await safeApiCall('grades/dynamic-grades/');
      
//       if (response?.results) {
//         const allGrades = response.results;
//         console.log('All grades from API:', allGrades.length);
        
//         // FILTER GRADES BY CURRENT STUDENT AND APPROVAL STATUS
//         const studentGrades = allGrades.filter(grade => {
//           const gradeStudentId = grade.student; // This is the numeric ID from the database
//           const gradeStudentUsername = grade.student_username; // This is the display name
          
//           console.log(`Grade student ID: ${gradeStudentId}, Username: ${gradeStudentUsername}, Approved: ${grade.is_approved}`);
          
//           // Check if this grade belongs to the current student AND is approved
//           const matchesStudent = (
//             gradeStudentUsername?.includes(correctStudentId) || 
//             gradeStudentUsername?.includes(username) ||
//             (studentData?.id && gradeStudentId === studentData.id)
//           );
          
//           // ONLY include grades that are approved (is_approved === true)
//           const isApproved = grade.is_approved === true;
          
//           if (matchesStudent && isApproved) {
//             console.log(`✅ Grade matches current student and is approved:`, grade);
//           } else if (matchesStudent && !isApproved) {
//             console.log(`⏳ Grade matches but not approved yet:`, grade);
//           }
          
//           return matchesStudent && isApproved;
//         });

//         console.log(`Filtered to ${studentGrades.length} approved grades for current student ${correctStudentId}`);
//         console.log('Approved student grades:', studentGrades);

//         // Create a grades map by course ID
//         const gradesData = {};
//         courses.forEach(course => {
//           const courseId = course.course_id || course.id;
//           const courseName = course.course_name || courseId;
          
//           const courseGrade = studentGrades.find(grade => {
//             const gradeCourse = grade.course || grade.course_id;
//             return gradeCourse === courseId;
//           });
          
//           gradesData[courseId] = courseGrade || null;
          
//           if (courseGrade) {
//             console.log(`✅ Found approved grade for course ${courseId}:`, courseGrade);
//           } else {
//             console.log(`❌ No approved grade found for course ${courseId}`);
//           }
//         });

//         console.log('Final approved grades data:', gradesData);
//         setGrades(gradesData);
//       } else {
//         console.log('No grades response from API');
//         // Initialize with null grades
//         const gradesData = {};
//         courses.forEach(course => {
//           const courseId = course.course_id || course.id;
//           gradesData[courseId] = null;
//         });
//         setGrades(gradesData);
//       }

//     } catch (err) {
//       console.error('Error fetching all grades:', err);
//       // Initialize with null grades for all courses
//       const gradesData = {};
//       courses.forEach(course => {
//         const courseId = course.course_id || course.id;
//         gradesData[courseId] = null;
//       });
//       setGrades(gradesData);
//     }
//   };

//   // Generate PDF Transcript without external dependencies - UPDATED to only show approved grades
//   const generatePDFTranscript = async () => {
//     setExportingPDF(true);
//     try {
//       // Filter courses to only include those with approved grades
//       const coursesWithApprovedGrades = courseDetails.filter(course => {
//         const courseId = course.course_id || course.id;
//         const grade = grades[courseId];
//         return grade && grade.is_approved === true;
//       });

//       // Create a printable HTML content
//       const transcriptContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <title>Academic Transcript - ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</title>
//           <style>
//             body { 
//               font-family: 'Arial', sans-serif; 
//               margin: 0; 
//               padding: 20px; 
//               color: #333;
//             }
//             .header { 
//               background: linear-gradient(135deg, #3b82f6, #1d4ed8);
//               color: white; 
//               padding: 30px; 
//               text-align: center;
//               border-radius: 10px;
//               margin-bottom: 30px;
//             }
//             .student-info { 
//               display: grid;
//               grid-template-columns: 1fr 1fr;
//               gap: 20px;
//               margin-bottom: 30px;
//               padding: 20px;
//               background: #f8fafc;
//               border-radius: 10px;
//             }
//             .stats { 
//               background: white;
//               padding: 20px;
//               border-radius: 10px;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//               margin-bottom: 30px;
//             }
//             table {
//               width: 100%;
//               border-collapse: collapse;
//               margin: 20px 0;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             }
//             th {
//               background: #3b82f6;
//               color: white;
//               padding: 12px;
//               text-align: left;
//             }
//             td {
//               padding: 12px;
//               border-bottom: 1px solid #e2e8f0;
//             }
//             tr:nth-child(even) {
//               background: #f8fafc;
//             }
//             .grade-A { background: #dcfce7; color: #166534; }
//             .grade-B { background: #dbeafe; color: #1e40af; }
//             .grade-C { background: #fef3c7; color: #92400e; }
//             .grade-D { background: #fed7aa; color: #c2410c; }
//             .grade-F { background: #fecaca; color: #dc2626; }
//             .footer {
//               text-align: center;
//               margin-top: 40px;
//               color: #64748b;
//               font-size: 12px;
//             }
//             .approval-badge {
//               background: #10b981;
//               color: white;
//               padding: 4px 8px;
//               border-radius: 12px;
//               font-size: 10px;
//               font-weight: bold;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>ACADEMIC TRANSCRIPT</h1>
//             <p>University Official Document - Approved Grades Only</p>
//           </div>
          
//           <div class="student-info">
//             <div>
//               <h3>Student Information</h3>
//               <p><strong>Name:</strong> ${studentData?.username?.firstName} ${studentData?.username?.fatherName}</p>
//               <p><strong>Student ID:</strong> ${studentData?.username}</p>
//               <p><strong>Batch:</strong> ${studentData?.username?.batch || 'N/A'}</p>
//             </div>
//             <div>
//               <h3>Academic Information</h3>
//               <p><strong>Date Generated:</strong> ${new Date().toLocaleDateString()}</p>
//               <p><strong>Approved Courses:</strong> ${coursesWithApprovedGrades.length}</p>
//               <p><strong>Status:</strong> Active Student</p>
//             </div>
//           </div>

//           ${(() => {
//             const stats = calculateStatistics();
//             if (stats) {
//               return `
//                 <div class="stats">
//                   <h3>Academic Summary (Approved Grades Only)</h3>
//                   <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 15px;">
//                     <div style="text-align: center; padding: 15px; background: #eff6ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">${stats.gpa}</div>
//                       <div style="font-size: 12px; color: #64748b;">GPA</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #f0fdf4; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${stats.completedCourses}/${stats.totalCourses}</div>
//                       <div style="font-size: 12px; color: #64748b;">Approved</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #faf5ff; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${stats.averageScore}</div>
//                       <div style="font-size: 12px; color: #64748b;">Avg Score</div>
//                     </div>
//                     <div style="text-align: center; padding: 15px; background: #fff7ed; border-radius: 8px;">
//                       <div style="font-size: 24px; font-weight: bold; color: #ea580c;">${stats.totalCredits}</div>
//                       <div style="font-size: 12px; color: #64748b;">Credits</div>
//                     </div>
//                   </div>
//                 </div>
//               `;
//             }
//             return '';
//           })()}

//           <table>
//             <thead>
//               <tr>
//                 <th>Course Name</th>
//                 <th>Course ID</th>
//                 <th>Credits</th>
//                 <th>Year</th>
//                 <th>Semester</th>
//                 <th>Grade</th>
//                 <th>Total Score</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${coursesWithApprovedGrades.map(course => {
//                 const courseId = course.course_id || course.id;
//                 const grade = grades[courseId];
//                 const calculatedGrade = calculateGradeFromTotalScore(grade);
//                 const finalGrade = calculatedGrade ? calculatedGrade.finalGrade : 'N/A';
//                 const gradeClass = finalGrade !== 'N/A' ? `grade-${finalGrade.charAt(0)}` : '';
//                 return `
//                   <tr>
//                     <td>${course.course_name || course.course_id}</td>
//                     <td>${courseId}</td>
//                     <td>${course.course_credit || 0}</td>
//                     <td>${course.course_taken_year || 'N/A'}</td>
//                     <td>${course.course_taken_semester || 'N/A'}</td>
//                     <td class="${gradeClass}">${finalGrade}</td>
//                     <td>${grade?.total_score || 'N/A'}</td>
//                     <td>
//                       <span class="approval-badge">APPROVED</span>
//                     </td>
//                   </tr>
//                 `;
//               }).join('')}
//             </tbody>
//           </table>

//           <div class="footer">
//             <p>Official Transcript - Generated by University Academic System</p>
//             <p>This document contains only department-approved grades and requires no signature</p>
//           </div>
//         </body>
//         </html>
//       `;

//       // Open print dialog
//       const printWindow = window.open('', '_blank');
//       printWindow.document.write(transcriptContent);
//       printWindow.document.close();
      
//       // Wait for content to load then print
//       printWindow.onload = () => {
//         printWindow.print();
//         printWindow.onafterprint = () => {
//           printWindow.close();
//           setExportingPDF(false);
//         };
//       };

//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       setExportingPDF(false);
//       alert('Error generating transcript. Please try again.');
//     }
//   };

//   // Toggle course accordion
//   const toggleCourse = (courseId) => {
//     setExpandedCourses(prev => ({
//       ...prev,
//       [courseId]: !prev[courseId]
//     }));
//   };

//   // Calculate statistics - UPDATED to only consider approved grades
//   const calculateStatistics = () => {
//     const coursesWithApprovedGrades = courseDetails.filter(course => {
//       const courseId = course.course_id || course.id;
//       const grade = grades[courseId];
//       return grade && grade.is_approved === true && grade.total_score;
//     });
    
//     if (coursesWithApprovedGrades.length === 0) return null;

//     const gradePoints = {
//       'A+': 4.0, 'A': 4.0, 'A-': 3.7,
//       'B+': 3.3, 'B': 3.0, 'B-': 2.7,
//       'C+': 2.3, 'C': 2.0, 'C-': 1.7,
//       'D': 1.0, 'F': 0.0
//     };

//     let totalCredits = 0;
//     let totalGradePoints = 0;
//     let completedCourses = 0;
//     let totalScoreSum = 0;
//     let gradeDistribution = { 'A+': 0, 'A': 0, 'A-': 0, 'B+': 0, 'B': 0, 'B-': 0, 'C+': 0, 'C': 0, 'C-': 0, 'D': 0, 'F': 0 };

//     coursesWithApprovedGrades.forEach(course => {
//       const courseId = course.course_id || course.id;
//       const grade = grades[courseId];
//       if (grade && grade.total_score) {
//         const calculatedGrade = calculateGradeFromTotalScore(grade);
//         if (calculatedGrade) {
//           const { finalGrade, totalScore } = calculatedGrade;
//           const credits = course.course_credit || 3;
//           const gradePoint = gradePoints[finalGrade] || 0;
          
//           totalCredits += credits;
//           totalGradePoints += gradePoint * credits;
//           completedCourses++;
//           totalScoreSum += totalScore;
          
//           if (gradeDistribution[finalGrade] !== undefined) {
//             gradeDistribution[finalGrade]++;
//           }
//         }
//       }
//     });

//     const gpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 0;
//     const averageScore = completedCourses > 0 ? (totalScoreSum / completedCourses).toFixed(1) : 0;

//     return {
//       totalCourses: courseDetails.length,
//       completedCourses,
//       gpa,
//       averageScore,
//       totalCredits,
//       gradeDistribution
//     };
//   };

//   // Get grade badge with color and animation - UPDATED to show approval status
//   const GradeBadge = ({ grade }) => {
//     if (!grade || !grade.total_score) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 animate-pulse border border-gray-300">
//           <ClockIcon className="h-4 w-4 mr-1" />
//           Pending 
//         </span>
//       );
//     }

//     // Only show grade if it's approved
//     if (grade.is_approved !== true) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300">
//           <ClockIcon className="h-4 w-4 mr-1" />
//           Awaiting Approval
//         </span>
//       );
//     }

//     const calculatedGrade = calculateGradeFromTotalScore(grade);
//     if (!calculatedGrade) {
//       return (
//         <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-300">
//           N/A
//         </span>
//       );
//     }

//     const { finalGrade, totalScore } = calculatedGrade;
    
//     const colorClasses = {
//       'A+': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg border border-green-600',
//       'A': 'bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg border border-green-500',
//       'A-': 'bg-gradient-to-r from-green-300 to-green-500 text-white shadow-lg border border-green-400',
//       'B+': 'bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg border border-blue-500',
//       'B': 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg border border-blue-600',
//       'B-': 'bg-gradient-to-r from-blue-300 to-blue-500 text-white shadow-lg border border-blue-400',
//       'C+': 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg border border-yellow-500',
//       'C': 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg border border-yellow-600',
//       'C-': 'bg-gradient-to-r from-yellow-300 to-yellow-500 text-white shadow-lg border border-yellow-400',
//       'D': 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg border border-orange-600',
//       'F': 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg border border-red-600'
//     };

//     return (
//       <div className="flex flex-col items-end space-y-1">
//         <div className="flex items-center space-x-2">
//           <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold transform hover:scale-105 transition-all duration-200 ${colorClasses[finalGrade] || 'bg-gray-100 text-gray-800'}`}>
//             {finalGrade}
//           </span>
//           <CheckBadgeIcon className="h-5 w-5 text-green-500" />
//         </div>
//         <span className="text-xs text-gray-500 font-medium">
//           Score: {totalScore}
//         </span>
//       </div>
//     );
//   };

//   // Get course display name
//   const getCourseName = (course) => {
//     return course.course_name || course.name || course.course_id || 'Unknown Course';
//   };

//   // Get course ID
//   const getCourseId = (course) => {
//     return course.course_id || course.id;
//   };

//   // Get available semesters for filter
//   const getAvailableSemesters = () => {
//     const semesters = new Set();
//     courseDetails.forEach(course => {
//       if (course.course_taken_year && course.course_taken_semester) {
//         semesters.add(`${course.course_taken_year}-${course.course_taken_semester}`);
//       }
//     });
//     return ['all', ...Array.from(semesters)];
//   };

//   // Filter courses by semester
//   const getFilteredCourses = () => {
//     if (selectedSemester === 'all') return courseDetails;
//     return courseDetails.filter(course => 
//       `${course.course_taken_year}-${course.course_taken_semester}` === selectedSemester
//     );
//   };

//   // Get progress color for score display
//   const getScoreColor = (totalScore) => {
//     if (totalScore >= 90) return 'text-green-600';
//     if (totalScore >= 80) return 'text-blue-600';
//     if (totalScore >= 70) return 'text-yellow-600';
//     if (totalScore >= 60) return 'text-orange-600';
//     return 'text-red-600';
//   };

//   // Check if grade is approved and should be displayed
//   const shouldDisplayGrade = (grade) => {
//     return grade && grade.is_approved === true;
//   };

//   useEffect(() => {
//     fetchStudentData();
//   }, []);

//   const statistics = calculateStatistics();
//   const filteredCourses = getFilteredCourses();
//   const availableSemesters = getAvailableSemesters();

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-center items-center h-96">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600 text-lg font-semibold">Loading your academic journey...</p>
//               <p className="text-gray-500 text-sm mt-2">Preparing your courses and approved grades</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md mx-auto">
//             <div className="text-red-500 text-center mb-4">
//               <TrophyIcon className="h-16 w-16 mx-auto" />
//             </div>
//             <h3 className="text-xl font-bold text-red-800 text-center mb-2">Oops! Something went wrong</h3>
//             <p className="text-red-600 text-center mb-6">{error}</p>
//             <button 
//               onClick={fetchStudentData}
//               className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
//       <div className="max-w-7xl mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
//             <div className="flex items-center space-x-4">
//               <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
//                 <AcademicCapIcon className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   Academic Status
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   {studentData?.username?.firstName} {studentData?.username?.fatherName}
//                   {studentData?.username?.batch && ` • Batch ${studentData.username.batch}`}
//                 </p>
//                 <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
//                   <CheckBadgeIcon className="h-4 w-4 mr-1" />
//                   Showing all grades 
//                 </p>
//               </div>
//             </div>
            
//             <div className="flex flex-wrap gap-3">
//               <button
//                 onClick={() => setShowStatistics(!showStatistics)}
//                 className="flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-gray-200/50"
//               >
//                 {showStatistics ? <EyeSlashIcon className="h-4 w-4 mr-2" /> : <EyeIcon className="h-4 w-4 mr-2" />}
//                 {showStatistics ? 'Hide Stats' : 'Show Stats'}
//               </button>
              
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Semesters</option>
//                 {availableSemesters.filter(s => s !== 'all').map(semester => (
//                   <option key={semester} value={semester}>
//                     {semester.replace('-', ' - Semester ')}
//                   </option>
//                 ))}
//               </select>

//               <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200/50">
//                 <button
//                   onClick={() => setActiveView('grid')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'grid' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Grid
//                 </button>
//                 <button
//                   onClick={() => setActiveView('list')}
//                   className={`px-4 py-2 rounded-xl transition-all ${
//                     activeView === 'list' 
//                       ? 'bg-white shadow-md text-blue-600' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   List
//                 </button>
//               </div>

//               <button
//                 onClick={generatePDFTranscript}
//                 disabled={exportingPDF}
//                 className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {exportingPDF ? (
//                   <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
//                 ) : (
//                   <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
//                 )}
//                 {exportingPDF ? 'Generating...' : 'Export PDF'}
//               </button>
              
//               <button
//                 onClick={fetchStudentData}
//                 className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all transform hover:scale-105"
//               >
//                 <ArrowPathIcon className="h-4 w-4 mr-2" />
//                 Refresh
//               </button>
//             </div>
//           </div>

//           {/* Enhanced Statistics */}
//           {showStatistics && statistics && (
//             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-blue-100 text-sm font-medium">Cumulative GPA</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.gpa}/4.0</h3>
//                   </div>
//                   <TrophyIcon className="h-8 w-8 text-blue-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-blue-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(parseFloat(statistics.gpa) / 4.0) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-green-100 text-sm font-medium">Approved Courses</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.completedCourses}/{statistics.totalCourses}</h3>
//                   </div>
//                   <BookOpenIcon className="h-8 w-8 text-green-200" />
//                 </div>
//                 <div className="mt-4 w-full bg-green-400/30 rounded-full h-2">
//                   <div 
//                     className="bg-white rounded-full h-2 transition-all duration-1000 ease-out"
//                     style={{ width: `${(statistics.completedCourses / statistics.totalCourses) * 100}%` }}
//                   ></div>
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-purple-100 text-sm font-medium">Average Score</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.averageScore}</h3>
//                   </div>
//                   <ChartBarIcon className="h-8 w-8 text-purple-200" />
//                 </div>
//                 <p className="text-purple-200 text-sm mt-2 font-medium">Based on approved grades</p>
//               </div>

//               <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg backdrop-blur-sm">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="text-orange-100 text-sm font-medium">Total Credits</p>
//                     <h3 className="text-3xl font-bold mt-2">{statistics.totalCredits}</h3>
//                   </div>
//                   <CreditCardIcon className="h-8 w-8 text-orange-200" />
//                 </div>
//                 <p className="text-orange-200 text-sm mt-2 font-medium">From approved courses</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Courses Section */}
//         <div className={`${activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}`}>
//           {filteredCourses.length === 0 ? (
//             <div className="col-span-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-12 text-center">
//               <div className="text-gray-400 mb-4">
//                 <AcademicCapIcon className="mx-auto h-16 w-16" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
//               <p className="text-gray-500 text-lg">No courses match your current filters.</p>
//             </div>
//           ) : (
//             filteredCourses.map((course) => {
//               const courseId = getCourseId(course);
//               const grade = grades[courseId];
//               const isExpanded = expandedCourses[courseId];
//               const calculatedGrade = calculateGradeFromTotalScore(grade);
//               const hasApprovedGrade = shouldDisplayGrade(grade);

//               return (
//                 <div key={courseId} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
//                   activeView === 'list' ? 'flex flex-col' : ''
//                 }`}>
                  
//                   {/* Course Header */}
//                   <div className={`p-6 ${activeView === 'list' ? 'flex-1' : ''}`}>
//                     <div className="flex justify-between items-start mb-4">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-3 mb-2">
//                           <div className={`w-3 h-3 rounded-full ${hasApprovedGrade ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
//                           <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
//                             {getCourseName(course)}
//                           </h3>
//                         </div>
//                         <p className="text-gray-600 text-sm mb-3">
//                           {courseId} • {course.course_credit || 0} Credits
//                         </p>
//                         <div className="flex flex-wrap gap-2">
//                           {course.course_taken_year && (
//                             <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
//                               <CalendarIcon className="h-3 w-3 mr-1" />
//                               {course.course_taken_year}
//                             </span>
//                           )}
//                           {course.course_taken_semester && (
//                             <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
//                               {course.course_taken_semester}
//                             </span>
//                           )}
//                           {course.course_category && (
//                             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
//                               {course.course_category}
//                             </span>
//                           )}
//                           {hasApprovedGrade && (
//                             <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
//                               <CheckBadgeIcon className="h-3 w-3 mr-1" />
//                               Approved
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                       <div className="flex flex-col items-end space-y-2">
//                         <GradeBadge grade={grade} />
//                         <button
//                           onClick={() => toggleCourse(courseId)}
//                           className="p-2 text-gray-400 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-lg"
//                         >
//                           {isExpanded ? 
//                             <ChevronUpIcon className="h-5 w-5" /> : 
//                             <ChevronDownIcon className="h-5 w-5" />
//                           }
//                         </button>
//                       </div>
//                     </div>

//                     {/* Score Display - Only show for approved grades */}
//                     {hasApprovedGrade && grade.total_score && (
//                       <div className="mt-4">
//                         <div className="flex justify-between text-sm text-gray-600 mb-2 font-medium">
//                           <span>Total Score</span>
//                           <span className={getScoreColor(parseFloat(grade.total_score))}>
//                             {grade.total_score} points
//                           </span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Course Details - Only show grade details for approved grades */}
//                   {isExpanded && (
//                     <div className="px-6 py-4 border-t border-gray-200/50 bg-gradient-to-br from-gray-50/50 to-blue-50/50">
//                       {hasApprovedGrade ? (
//                         <div className="space-y-6">
//                           {/* Grade Overview */}
//                           <div className="grid grid-cols-2 gap-4">
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {grade.total_score}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Total Score</div>
//                             </div>
//                             <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 text-center">
//                               <div className="text-2xl font-bold text-gray-900 mb-1">
//                                 {calculatedGrade ? calculatedGrade.finalGrade : 'N/A'}
//                               </div>
//                               <div className="text-sm text-gray-600 font-medium">Final Grade</div>
//                             </div>
//                           </div>

//                           {/* Grade Components */}
//                           {Object.entries(grade.grade_components || {}).length > 0 && (
//                             <div>
//                               <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
//                                 <BookOpenIcon className="h-4 w-4 mr-2" />
//                                 Assessment Breakdown
//                               </h4>
//                               <div className="space-y-3">
//                                 {Object.entries(grade.grade_components || {}).map(([component, data]) => (
//                                   <div key={component} className="bg-white p-4 rounded-xl border border-gray-200">
//                                     <div className="flex justify-between items-center mb-2">
//                                       <span className="font-medium text-gray-900 capitalize">{component}</span>
//                                       <span className="text-sm font-semibold text-blue-600">
//                                         {data.score} points
//                                       </span>
//                                     </div>
//                                     <div className="flex justify-between text-sm text-gray-600 mb-2">
//                                       <span>Score: {data.score}</span>
//                                       {data.max_score && <span>Max: {data.max_score}</span>}
//                                       {data.weight && <span>Weight: {data.weight}</span>}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-center py-6">
//                           <div className="text-gray-400 mb-3">
//                             <ClockIcon className="mx-auto h-12 w-12" />
//                           </div>
//                           <h4 className="text-lg font-medium text-gray-900 mb-2">Awaiting Department Approval</h4>
//                           <p className="text-gray-500">Your grade for this course is pending approval from the department.</p>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentCoursesGrades;


// components/StudentCoursesGrades.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AcademicCapIcon, 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ArrowPathIcon,
  ChartBarIcon,
  BookOpenIcon,
  CalendarIcon,
  CreditCardIcon,
  TrophyIcon,
  DocumentArrowDownIcon,
  CheckBadgeIcon,
  ClockIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

const StudentCoursesGrades = () => {
  const [studentData, setStudentData] = useState(null);
  const [courseDetails, setCourseDetails] = useState([]);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({});
  const [activeView, setActiveView] = useState('grid'); // 'grid' or 'list'
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [exportingPDF, setExportingPDF] = useState(false);

  // --- LOGIC: Grade Calculations (DO NOT CHANGE) ---
  const calculateGradeFromTotalScore = (grade) => {
    if (!grade || !grade.total_score) return null;
    const totalScore = parseFloat(grade.total_score);
    if (totalScore >= 90) return { finalGrade: 'A+', totalScore };
    if (totalScore >= 85) return { finalGrade: 'A', totalScore };
    if (totalScore >= 80) return { finalGrade: 'A-', totalScore };
    if (totalScore >= 75) return { finalGrade: 'B+', totalScore };
    if (totalScore >= 70) return { finalGrade: 'B', totalScore };
    if (totalScore >= 65) return { finalGrade: 'B-', totalScore };
    if (totalScore >= 60) return { finalGrade: 'C+', totalScore };
    if (totalScore >= 50) return { finalGrade: 'C', totalScore };
    if (totalScore >= 45) return { finalGrade: 'C-', totalScore };
    if (totalScore >= 40) return { finalGrade: 'D', totalScore };
    return { finalGrade: 'F', totalScore };
  };

  // --- API LOGIC (DO NOT CHANGE) ---
  const api = axios.create({
    baseURL: '/api/',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access')}` }
  });

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const username = user.username;
      
      const [sRes, cRes, allC] = await Promise.all([
        api.get(`students/${username}/`),
        api.get(`students/${username}/courses/`),
        api.get('courses/courses/')
      ]);

      setStudentData(sRes.data);
      const studentCourses = cRes.data?.courses || cRes.data || [];
      const merged = studentCourses.map(sc => ({
        ...sc,
        ...(allC.data.find(c => c.course_id === sc.course_id) || {})
      }));
      setCourseDetails(merged);

      const gRes = await api.get('grades/dynamic-grades/');
      const approvedGrades = (gRes.data.results || []).filter(g => g.is_approved === true);
      const gradesMap = {};
      merged.forEach(c => {
        gradesMap[c.course_id] = approvedGrades.find(g => g.course === c.course_id) || null;
      });
      setGrades(gradesMap);
    } catch (err) {
      setError('Connection lost. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    const approved = courseDetails.filter(c => grades[c.course_id]?.is_approved === true);
    if (!approved.length) return null;
    const pointsMap = { 'A+': 4, 'A': 4, 'A-': 3.7, 'B+': 3.3, 'B': 3, 'B-': 2.7, 'C+': 2.3, 'C': 2, 'C-': 1.7, 'D': 1, 'F': 0 };
    let tCredits = 0, tPoints = 0, tScore = 0;
    approved.forEach(c => {
      const g = grades[c.course_id];
      const calc = calculateGradeFromTotalScore(g);
      tCredits += (c.course_credit || 0);
      tPoints += (pointsMap[calc.finalGrade] || 0) * (c.course_credit || 0);
      tScore += calc.totalScore;
    });
    return { gpa: (tPoints / tCredits).toFixed(2), credits: tCredits, avg: (tScore / approved.length).toFixed(1), total: approved.length };
  };

  // PDF Logic (Simplified for demonstration)
  const generatePDFTranscript = () => {
    setExportingPDF(true);
    setTimeout(() => { window.print(); setExportingPDF(false); }, 1000);
  };

  useEffect(() => { fetchStudentData(); }, []);

  const stats = calculateStatistics();
  const filteredCourses = selectedSemester === 'all' ? courseDetails : 
    courseDetails.filter(c => `${c.course_taken_year}-${c.course_taken_semester}` === selectedSemester);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]"><ArrowPathIcon className="h-10 w-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="min-h-screen bg-[#f4f7fe] pb-12">
      {/* Background Decor */}
      <div className="absolute top-0 w-full h-64 bg-gradient-to-r from-blue-700 to-indigo-800 -z-10" />

      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* TOP NAV / HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-gray-900">
            <h1 className="text-3xl font-extrabold tracking-tight">Academic Journey</h1>
            <p className="opacity-80 text-sm font-medium">Manage and track your performance</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20">
            <button onClick={() => setActiveView('grid')} className={`p-2 rounded-xl transition-all ${activeView === 'grid' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}><Squares2X2Icon className="h-5 w-5"/></button>
            <button onClick={() => setActiveView('list')} className={`p-2 rounded-xl transition-all ${activeView === 'list' ? 'bg-white text-blue-600 shadow-lg' : 'text-white hover:bg-white/10'}`}><ListBulletIcon className="h-5 w-5"/></button>
          </div>
        </div>

        {/* STATISTICS CARDS */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Cumulative GPA', val: `${stats.gpa} / 4.0`, icon: TrophyIcon, color: 'from-blue-500 to-blue-600' },
              { label: 'Completed Credits', val: stats.credits, icon: CreditCardIcon, color: 'from-emerald-500 to-teal-600' },
              { label: 'Average Score', val: `${stats.avg}%`, icon: ChartBarIcon, color: 'from-purple-500 to-indigo-600' },
              { label: 'Courses Passed', val: stats.total, icon: CheckBadgeIcon, color: 'from-orange-500 to-red-500' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl transition-all">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{s.label}</p>
                  <h3 className="text-2xl font-black text-slate-800">{s.val}</h3>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-lg`}><s.icon className="h-6 w-6"/></div>
              </div>
            ))}
          </div>
        )}

        {/* ACTION BAR */}
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <select 
              value={selectedSemester} 
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Semesters</option>
              {/* Dynamic semesters would go here */}
            </select>
          </div>
          
          <div className="flex gap-3">
            <button onClick={generatePDFTranscript} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-blue-200 shadow-lg hover:bg-blue-700 transition-all">
              <DocumentArrowDownIcon className="h-4 w-4"/> {exportingPDF ? 'Processing...' : 'Export Transcript'}
            </button>
            <button onClick={fetchStudentData} className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all">
              <ArrowPathIcon className="h-5 w-5"/>
            </button>
          </div>
        </div>

        {/* COURSES LISTING */}
        <div className={activeView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
          {filteredCourses.map(course => {
            const grade = grades[course.course_id];
            const calc = calculateGradeFromTotalScore(grade);
            const isExp = expandedCourses[course.course_id];

            return (
              <div key={course.course_id} className={`bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${activeView === 'list' ? 'flex flex-col' : ''}`}>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md uppercase">{course.course_id}</span>
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-black rounded-md uppercase">{course.course_credit} Credits</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-2">{course.course_name}</h3>
                    </div>

                    {/* Grade Circle UI */}
                    {calc ? (
                      <div className="relative flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-4 border-blue-50 flex items-center justify-center bg-white shadow-inner">
                          <span className="text-lg font-black text-blue-600">{calc.finalGrade}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 text-gray-300"/>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarIcon className="h-4 w-4"/>
                      <span className="text-xs font-bold">SEM {course.course_taken_semester} | {course.course_taken_year}</span>
                    </div>
                    
                    <button 
                      onClick={() => setExpandedCourses(p => ({...p, [course.course_id]: !p[course.course_id]}))}
                      className="text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-all"
                    >
                      {isExp ? <ChevronUpIcon className="h-5 w-5"/> : <ChevronDownIcon className="h-5 w-5"/>}
                    </button>
                  </div>
                </div>

                {/* EXPANDED CONTENT: COMPONENTS */}
                {isExp && (
                  <div className="bg-slate-50/50 p-8 border-t border-gray-100 animate-in fade-in duration-300">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Assessment Breakdown</h4>
                    {grade?.grade_components ? (
                      <div className="space-y-3">
                        {Object.entries(grade.grade_components).map(([name, data]) => (
                          <div key={name} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <div>
                              <p className="text-sm font-bold text-slate-700 capitalize">{name}</p>
                              <p className="text-[10px] text-gray-400">Weight: {data.weight}%</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-black text-blue-600">{data.score}</p>
                              <p className="text-[10px] text-gray-400 font-bold">/ {data.max_score}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-xs text-gray-400 font-medium italic">Pending faculty approval</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentCoursesGrades;