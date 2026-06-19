
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

// const GradeInsertionPage = ({ course }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [activeTab, setActiveTab] = useState('create');
//   const [gradeForm, setGradeForm] = useState({
//     title: '',
//     description: '',
//     components: []
//   });
//   const [excelData, setExcelData] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [apiResponse, setApiResponse] = useState(null);
//   const [existingGrades, setExistingGrades] = useState({});
//   const [checkingGrades, setCheckingGrades] = useState(false);
//   const [pageReady, setPageReady] = useState(false);

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Axios instance
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     // Set a small delay to ensure course prop is loaded
//     const timer = setTimeout(() => {
//       setPageReady(true);
//     }, 100);

//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (course && pageReady) {
//       console.log('Course loaded:', course);
//       fetchStudents();
//     }
//   }, [course, pageReady]);

//   // FIXED: Enhanced function to find existing grade with strict course filtering
//   const findExistingGrade = async (studentId, courseId) => {
//     try {
//       console.log(`🔍 Searching grade for student ${studentId} in course ${courseId}`);
      
//       // STRATEGY 1: Direct search with both student and course
//       try {
//         const response = await api.get('grades/dynamic-grades/', {
//           params: {
//             student: studentId,
//             course: courseId,
//             limit: 1 // Get only one result
//           }
//         });
        
//         let grades = [];
//         if (response.data) {
//           if (Array.isArray(response.data)) {
//             grades = response.data;
//           } else if (response.data.results && Array.isArray(response.data.results)) {
//             grades = response.data.results;
//           } else if (response.data.grades && Array.isArray(response.data.grades)) {
//             grades = response.data.grades;
//           }
//         }
        
//         if (grades.length > 0) {
//           const grade = grades[0];
//           console.log(`✅ Found grade via direct search: ${grade.id}`);
          
//           // DOUBLE VERIFICATION: Ensure the grade actually belongs to this course
//           const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
//           if (gradeCourseId == courseId) {
//             return grade;
//           } else {
//             console.warn(`⚠️ Grade course mismatch: Expected ${courseId}, found ${gradeCourseId}`);
//           }
//         }
//       } catch (searchError) {
//         console.log('Direct search failed, trying alternative methods...');
//       }
      
//       // STRATEGY 2: Get all grades for course and filter by student
//       try {
//         const courseGradesResponse = await api.get('grades/dynamic-grades/', {
//           params: { course: courseId }
//         });
        
//         let allCourseGrades = [];
//         if (courseGradesResponse.data) {
//           if (Array.isArray(courseGradesResponse.data)) {
//             allCourseGrades = courseGradesResponse.data;
//           } else if (courseGradesResponse.data.results && Array.isArray(courseGradesResponse.data.results)) {
//             allCourseGrades = courseGradesResponse.data.results;
//           }
//         }
        
//         const matchingGrade = allCourseGrades.find(grade => {
//           // Multiple ways to match student
//           const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
//           return gradeStudentId == studentId;
//         });
        
//         if (matchingGrade) {
//           console.log(`✅ Found grade via course filtering: ${matchingGrade.id}`);
//           return matchingGrade;
//         }
//       } catch (courseError) {
//         console.log('Course-based search failed:', courseError);
//       }
      
//       console.log(`❌ No grade found for student ${studentId} in course ${courseId}`);
//       return null;
      
//     } catch (error) {
//       console.error(`Error finding grade for student ${studentId}:`, error);
//       return null;
//     }
//   };

//   // Function to check existing grades for students
//   const checkExistingGrades = async () => {
//     if (!course || students.length === 0) return;
    
//     try {
//       setCheckingGrades(true);
//       const gradesMap = {};
//       const courseId = course.course_id;
      
//       console.log(`🔍 Checking grades for course: ${courseId}`);
      
//       // Get all grades for this specific course first
//       let courseGrades = [];
//       try {
//         const response = await api.get('grades/dynamic-grades/', {
//           params: { course: courseId }
//         });
        
//         if (response.data) {
//           if (Array.isArray(response.data)) {
//             courseGrades = response.data;
//           } else if (response.data.results && Array.isArray(response.data.results)) {
//             courseGrades = response.data.results;
//           }
//         }
//         console.log(`📋 Found ${courseGrades.length} grades for course ${courseId}`);
//       } catch (error) {
//         console.error('Error fetching course grades:', error);
//       }
      
//       // Check grades for each student using our course-specific list
//       for (const student of students) {
//         const studentId = getStudentId(student);
//         if (studentId) {
//           try {
//             // First, try to find in our course-specific grades
//             const existingGrade = courseGrades.find(grade => {
//               const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
//               return gradeStudentId == studentId;
//             });
            
//             if (existingGrade) {
//               gradesMap[studentId] = {
//                 id: existingGrade.id,
//                 grade_components: existingGrade.grade_components,
//                 total_score: existingGrade.total_score,
//                 final_grade: existingGrade.final_grade,
//                 is_approved: existingGrade.is_approved,
//                 can_edit: !existingGrade.is_approved
//               };
//             }
//           } catch (error) {
//             console.log(`No existing grade found for student ${studentId} in course ${courseId}`);
//           }
//         }
//       }
      
//       setExistingGrades(gradesMap);
//       console.log('Course-specific grades map:', gradesMap);
//     } catch (error) {
//       console.error('Error checking existing grades:', error);
//     } finally {
//       setCheckingGrades(false);
//     }
//   };

//   // Function to normalize semester values for comparison
//   const normalizeSemester = (semester) => {
//     if (!semester) return null;
    
//     const semStr = semester.toString().toLowerCase().trim();
    
//     // Handle Roman numerals and other formats
//     if (semStr.includes('1') || semStr.includes('i') || semStr.includes('first') || semStr === '1') {
//       return 'I';
//     }
//     if (semStr.includes('2') || semStr.includes('ii') || semStr.includes('second') || semStr === '2') {
//       return 'II';
//     }
//     if (semStr.includes('3') || semStr.includes('iii') || semStr.includes('third') || semStr === '3') {
//       return 'III';
//     }
//     if (semStr.includes('4') || semStr.includes('iv') || semStr.includes('fourth') || semStr === '4') {
//       return 'IV';
//     }
    
//     return semester;
//   };

//   // Function to normalize year values for comparison
//   const normalizeYear = (year) => {
//     if (!year) return null;
    
//     const yearStr = year.toString().toLowerCase().trim();
    
//     if (yearStr.includes('1') || yearStr.includes('first') || yearStr === '1') {
//       return '1';
//     }
//     if (yearStr.includes('2') || yearStr.includes('second') || yearStr === '2') {
//       return '2';
//     }
//     if (yearStr.includes('3') || yearStr.includes('third') || yearStr === '3') {
//       return '3';
//     }
//     if (yearStr.includes('4') || yearStr.includes('fourth') || yearStr === '4') {
//       return '4';
//     }
//     if (yearStr.includes('5') || yearStr.includes('fifth') || yearStr === '5') {
//       return '5';
//     }
    
//     return year;
//   };

//   const fetchStudents = async () => {
//     if (!course) {
//       setError('Course information is not available');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       // Get all students and filter by course criteria
//       const response = await api.get('students/');
      
//       // Store response for debugging
//       setApiResponse(response.data);
//       console.log('API Response:', response.data);
      
//       // Extract students from results array
//       let studentsData = [];
      
//       if (response.data && Array.isArray(response.data.results)) {
//         studentsData = response.data.results;
//       } else if (Array.isArray(response.data)) {
//         studentsData = response.data;
//       } else if (response.data && Array.isArray(response.data.students)) {
//         studentsData = response.data.students;
//       } else {
//         console.error('Unexpected response format:', response.data);
//         setError('Unexpected response format from server');
//         setStudents([]);
//         return;
//       }
      
//       console.log('All students data:', studentsData);
//       console.log('Course criteria:', {
//         department_id: course.department_id,
//         year: course.course_taken_year,
//         semester: course.course_taken_semester
//       });
      
//       // Normalize course criteria for comparison
//       const normalizedCourseDept = course.department_id ? course.department_id.toString() : null;
//       const normalizedCourseYear = normalizeYear(course.course_taken_year);
//       const normalizedCourseSemester = normalizeSemester(course.course_taken_semester);
      
//       console.log('Normalized course criteria:', {
//         dept: normalizedCourseDept,
//         year: normalizedCourseYear,
//         semester: normalizedCourseSemester
//       });
      
//       // Track unique students to avoid duplicates
//       const uniqueStudentIds = new Set();
      
//       // Filter students by course department, year, and semester
//       const filteredStudents = studentsData.filter(student => {
//         // Check if student has the required properties
//         if (!student) return false;
        
//         // Get student ID for uniqueness check - FIXED: Use username as primary identifier
//         const studentId = student.username || student.username_id || student.id;
//         if (!studentId) return false;
        
//         // Skip if we've already processed this student
//         if (uniqueStudentIds.has(studentId)) {
//           console.log('Skipping duplicate student:', studentId);
//           return false;
//         }
        
//         // Extract department - could be department_id, department, or nested object
//         let studentDept = null;
//         if (student.department_id) {
//           studentDept = student.department_id.toString();
//         } else if (student.department) {
//           // Handle both string and object department
//           studentDept = typeof student.department === 'object' 
//             ? (student.department.id || student.department.department_id || '').toString()
//             : student.department.toString();
//         } else if (student.departmentId) {
//           studentDept = student.departmentId.toString();
//         }
        
//         // Extract year and semester - check different possible locations
//         let studentYear = null;
//         let studentSemester = null;
        
//         // Check various possible locations for year and semester
//         if (student.year) {
//           studentYear = student.year.toString();
//         } else if (student.user_details && student.user_details.year) {
//           studentYear = student.user_details.year.toString();
//         } else if (student.academic_year) {
//           studentYear = student.academic_year.toString();
//         } else if (student.current_year) {
//           studentYear = student.current_year.toString();
//         } else if (student.year_of_study) {
//           studentYear = student.year_of_study.toString();
//         }
        
//         if (student.semester) {
//           studentSemester = student.semester.toString();
//         } else if (student.user_details && student.user_details.semester) {
//           studentSemester = student.user_details.semester.toString();
//         } else if (student.academic_semester) {
//           studentSemester = student.academic_semester.toString();
//         } else if (student.current_semester) {
//           studentSemester = student.current_semester.toString();
//         } else if (student.semester_of_study) {
//           studentSemester = student.semester_of_study.toString();
//         }
        
//         // If still not found, try to extract from semesters object
//         if ((!studentYear || !studentSemester) && student.semesters) {
//           // Try to find a semester that matches our course criteria
//           const semesterKeys = Object.keys(student.semesters);
//           for (const key of semesterKeys) {
//             const yearMatch = key.match(/(\d+)(?:st|nd|rd|th) Year/);
//             const semesterMatch = key.match(/I Semester|II Semester|III Semester|IV Semester/);
            
//             if (yearMatch && semesterMatch) {
//               const yearFromKey = yearMatch[1];
//               const semesterFromKey = semesterMatch[0].includes('I') ? 'I' : 
//                                     semesterMatch[0].includes('II') ? 'II' :
//                                     semesterMatch[0].includes('III') ? 'III' : 'IV';
              
//               // If we don't have values yet, use these
//               if (!studentYear) studentYear = yearFromKey;
//               if (!studentSemester) studentSemester = semesterFromKey;
              
//               // If these match our course criteria, use them
//               const normalizedYearFromKey = normalizeYear(yearFromKey);
//               const normalizedSemesterFromKey = normalizeSemester(semesterFromKey);
              
//               if (normalizedYearFromKey === normalizedCourseYear && 
//                   normalizedSemesterFromKey === normalizedCourseSemester) {
//                 studentYear = yearFromKey;
//                 studentSemester = semesterFromKey;
//                 break;
//               }
//             }
//           }
//         }
        
//         // Normalize student values for comparison
//         const normalizedStudentYear = normalizeYear(studentYear);
//         const normalizedStudentSemester = normalizeSemester(studentSemester);
        
//         console.log('Student details:', {
//           username: student.username || student.username_id,
//           dept: studentDept,
//           year: studentYear,
//           normalizedYear: normalizedStudentYear,
//           semester: studentSemester,
//           normalizedSemester: normalizedStudentSemester,
//           courseDept: normalizedCourseDept,
//           courseYear: normalizedCourseYear,
//           courseSemester: normalizedCourseSemester,
//           matchesDept: studentDept === normalizedCourseDept,
//           matchesYear: normalizedStudentYear === normalizedCourseYear,
//           matchesSemester: normalizedStudentSemester === normalizedCourseSemester
//         });
        
//         // Check if student matches the criteria
//         const matchesCriteria = studentDept === normalizedCourseDept &&
//                normalizedStudentYear === normalizedCourseYear &&
//                normalizedStudentSemester === normalizedCourseSemester;
        
//         // If student matches, add to unique set and return true
//         if (matchesCriteria) {
//           uniqueStudentIds.add(studentId);
//           return true;
//         }
        
//         return false;
//       });
      
//       console.log('Filtered students:', filteredStudents);
//       setStudents(filteredStudents);
      
//       // Check existing grades after students are loaded
//       if (filteredStudents.length > 0) {
//         await checkExistingGrades();
//       }
      
//       if (filteredStudents.length === 0) {
//         setError('No students found matching the course criteria. Check console for details.');
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       setError('Failed to fetch students. Please try again.');
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addGradeComponent = () => {
//     setGradeForm({
//       ...gradeForm,
//       components: [
//         ...gradeForm.components,
//         { name: '', max_score: 0, weight: 0 }
//       ]
//     });
//   };

//   const updateGradeComponent = (index, field, value) => {
//     const updatedComponents = [...gradeForm.components];
    
//     // Handle empty values and prevent NaN
//     if (field === 'name') {
//       updatedComponents[index][field] = value;
//     } else {
//       // Convert to number, use 0 if empty or invalid
//       const numericValue = value === '' ? 0 : parseFloat(value);
//        updatedComponents[index][field] = isNaN(numericValue) ? 0 : numericValue;
//     }
    
//     setGradeForm({
//       ...gradeForm,
//       components: updatedComponents
//     });
//   };

//   const removeGradeComponent = (index) => {
//     const updatedComponents = gradeForm.components.filter((_, i) => i !== index);
//     setGradeForm({
//       ...gradeForm,
//       components: updatedComponents
//     });
//   };

//   const createGradeForm = async () => {
//     if (!course) return;
    
//     try {
//       const user = getUserData();
      
//       // Validate form data
//       if (!gradeForm.title.trim()) {
//         setError('Form title is required');
//         return;
//       }
      
//       if (gradeForm.components.length === 0) {
//         setError('At least one grade component is required');
//         return;
//       }
      
//       // Validate each component
//       for (const component of gradeForm.components) {
//         if (!component.name.trim()) {
//           setError('All grade components must have a name');
//           return;
//         }
//         if (component.max_score <= 0) {
//           setError('Max score must be greater than 0');
//           return;
//         }
//         // Validate weight format (max 2 digits before decimal)
//         if (component.weight >= 100) {
//           setError('Weight must be less than 100%');
//           return;
//         }
//       }

//       // Generate a truly unique title with timestamp
//       const timestamp = new Date().getTime();
//       const uniqueTitle = `${gradeForm.title} - ${timestamp}`;
      
//       const formPayload = {
//         course: course.course_id,
//         teacher: user.userId,
//         batch: `${course.course_taken_year}-${course.course_taken_semester}`,
//         title: uniqueTitle,
//         description: gradeForm.description
//       };

//       console.log('Creating form template:', formPayload);
//       const formResponse = await api.post('grades/grade-form-templates/', formPayload);
//       const formTemplate = formResponse.data;
      
//       // Debug the response to see what's being returned
//       console.log('Form template response:', formResponse);
//       console.log('Form template data:', formTemplate);
      
//       // Check if form template was created successfully
//       if (!formTemplate) {
//         console.error('Invalid form template response:', formTemplate);
//         throw new Error('Failed to create form template: Empty response');
//       }

//       // Extract the form template ID from the response
//       let formTemplateId = null;
      
//       // Check common ID field names
//       if (formTemplate.id !== undefined) {
//         formTemplateId = formTemplate.id;
//       } else if (formTemplate.pk !== undefined) {
//         formTemplateId = formTemplate.pk;
//       } else if (formTemplate.form_id !== undefined) {
//         formTemplateId = formTemplate.form_id;
//       } else if (formResponse.headers && formResponse.headers.location) {
//         // Try to extract ID from location header
//         const location = formResponse.headers.location;
//         const idMatch = location.match(/\/(\d+)\/$/) || location.match(/\/([a-f0-9-]+)\/$/);
//         if (idMatch && idMatch[1]) {
//           formTemplateId = idMatch[1];
//         }
//       }
      
//       // If we still don't have an ID, try to fetch the created form template
//       if (!formTemplateId) {
//         console.warn('Could not extract form template ID from response, trying to fetch it...');
        
//         // Try to fetch the form template by title and course
//         try {
//           const searchResponse = await api.get('grades/grade-form-templates/', {
//             params: {
//               course: course.course_id,
//               title: uniqueTitle
//             }
//           });
          
//           if (searchResponse.data && searchResponse.data.length > 0) {
//             const foundTemplate = searchResponse.data[0];
//             formTemplateId = foundTemplate.id || foundTemplate.pk;
//             console.log('Found form template with ID:', formTemplateId);
//           }
//         } catch (searchError) {
//           console.error('Error searching for form template:', searchError);
//         }
//       }
      
//       if (!formTemplateId) {
//         console.error('Could not extract form template ID from response:', formTemplate);
//         throw new Error('Failed to create form template: No ID returned in response');
//       }

//       console.log('Form template created with ID:', formTemplateId);
      
//       // Then create components individually with proper weight format
//       for (const [index, component] of gradeForm.components.entries()) {
//         const componentPayload = {
//           form_template: formTemplateId,
//           name: component.name,
//           max_score: component.max_score,
//           weight: Math.min(component.weight, 99.99),
//           field_type: 'number',
//           required: true,
//           order: index
//         };
        
//         console.log('Creating component:', componentPayload);
//         await api.post('grades/grade-components/', componentPayload);
//       }

//       setSuccess('Grade form created successfully!');
//       setActiveTab('download');
//     } catch (error) {
//       console.error('Error creating grade form:', error);
//       console.error('Error response:', error.response?.data);
      
//       let errorMessage = 'Failed to create grade form';
      
//       if (error.response?.data) {
//         // Handle form_template required error
//         if (error.response.data.form_template) {
//           errorMessage = 'Failed to create form template. Please check if the form template was created successfully.';
//         }
//         // Handle unique constraint error
//         else if (error.response.data.non_field_errors && error.response.data.non_field_errors[0].includes('unique')) {
//           errorMessage = 'A grade form with this title already exists for this course. Please use a different title.';
//         } 
//         // Handle weight validation error
//         else if (error.response.data.weight) {
//           errorMessage = 'Weight must be less than 100 and have no more than 2 decimal places.';
//         }
//         // Handle other validation errors
//         else {
//           errorMessage = Object.values(error.response.data).flat().join(', ');
//         }
//       } else {
//         errorMessage = error.message || 'Failed to create grade form';
//       }
      
//       setError(errorMessage);
//     }
//   };

//   // Helper function to get student full name
//   const getStudentFullName = (student) => {
//     // Try different possible name field locations
//     if (student.firstName && student.fatherName) {
//       return `${student.firstName} ${student.fatherName}`;
//     }
//     if (student.first_name && student.father_name) {
//       return `${student.first_name} ${student.father_name}`;
//     }
//     if (student.user_details?.firstName && student.user_details?.fatherName) {
//       return `${student.user_details.firstName} ${student.user_details.fatherName}`;
//     }
//     if (student.name) {
//       return student.name;
//     }
//     return 'Unknown Name';
//   };

//   // FIXED: Helper function to get student ID (primary key)
//   const getStudentId = (student) => {
//     // Try different possible ID field locations - prioritize the actual student ID
//     if (student.id) {
//       return student.id; // Direct ID field
//     }
//     if (student.pk) {
//       return student.pk; // Primary key field
//     }
//     // If no direct ID, use username as identifier (this is what the backend likely expects)
//     if (student.username) {
//       return student.username;
//     }
//     if (student.username_id) {
//       return student.username_id;
//     }
//     if (student.user_details?.id) {
//       return student.user_details.id; // ID in user_details
//     }
//     if (student.user_details?.username) {
//       return student.user_details.username;
//     }
    
//     console.warn('No ID found for student:', student);
//     return null;
//   };

//   // Helper function to check if grade can be edited for a student
//   const canEditGrade = (student) => {
//     const studentId = getStudentId(student);
//     const existingGrade = existingGrades[studentId];
//     return !existingGrade || existingGrade.can_edit;
//   };

//   // Helper function to get grade status for a student
//   const getGradeStatus = (student) => {
//     const studentId = getStudentId(student);
//     const existingGrade = existingGrades[studentId];
    
//     if (!existingGrade) {
//       return { status: 'No Grade', color: 'gray' };
//     }
    
//     if (existingGrade.is_approved) {
//       return { status: 'Approved', color: 'green' };
//     } else {
//       return { status: 'Pending Approval', color: 'yellow' };
//     }
//   };

//   const downloadExcelTemplate = async () => {
//     if (!course) return;
    
//     try {
//       const workbook = XLSX.utils.book_new();
      
//       // Create grade template sheet with proper header row
//       const gradeTemplateData = [
//         // Header row
//         {
//           'Student ID': 'Student ID',
//           'Full Name': 'Full Name',
//           'Grade Status': 'Grade Status',
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = component.name;
//             return acc;
//           }, {})
//         },
//         // Data rows with example values and existing grades if available
//         ...students.map(student => {
//           const studentId = getStudentId(student);
//           const existingGrade = existingGrades[studentId];
//           const gradeStatus = getGradeStatus(student);
          
//           // If grade exists and is not approved, pre-fill the data
//           const existingComponents = existingGrade ? existingGrade.grade_components : {};
          
//           return {
//             'Student ID': student.username || student.username_id,
//             'Full Name': getStudentFullName(student),
//             'Grade Status': gradeStatus.status,
//             ...gradeForm.components.reduce((acc, component) => {
//               // Pre-fill with existing grade data if available and editable
//               if (existingComponents[component.name]) {
//                 acc[component.name] = existingComponents[component.name].score;
//               } else {
//                 acc[component.name] = ''; // Empty cell for user to fill
//               }
//               return acc;
//             }, {})
//           };
//         })
//       ];

//       const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
//       XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

//       // Create an instructions sheet
//       const instructionsData = [
//         ['IMPORTANT INSTRUCTIONS:'],
//         ['1. Fill in the grades in the "Grades Template" sheet'],
//         ['2. Do not modify the "Student ID" and "Grade Status" columns'],
//         ['3. Enter numeric scores for each student'],
//         ['4. Approved grades cannot be modified - they will be skipped during upload'],
//         ['5. Save the file after filling all grades'],
//         ['6. Upload the completed file in the Upload Grades tab'],
//         [''],
//         ['Example:'],
//         ['Student ID', 'Full Name', 'Grade Status', 'Quiz 1', 'Final Exam'],
//         ['bereket-583780', 'Bereket Mamo', 'Pending Approval', '85', '90'],
//         ['bedilu-212024', 'Bedilu Belete', 'Approved', '90', '95']
//       ];
      
//       const instructionWs = XLSX.utils.json_to_sheet(instructionsData);
//       XLSX.utils.book_append_sheet(workbook, instructionWs, 'Instructions');

//       // Save the workbook
//       const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//       const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
//       saveAs(data, `${course.course_name}_Grade_Template.xlsx`);
//       setSuccess('Excel template downloaded successfully!');
      
//     } catch (error) {
//       console.error('Error creating Excel template:', error);
//       setError('Failed to create Excel template: ' + error.message);
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
        
//         // Try to find the correct sheet
//         let worksheet = null;
//         let sheetName = '';
        
//         if (workbook.SheetNames.includes('Grades Template')) {
//           sheetName = 'Grades Template';
//           worksheet = workbook.Sheets['Grades Template'];
//         } else if (workbook.SheetNames.includes('Sheet1')) {
//           sheetName = 'Sheet1';
//           worksheet = workbook.Sheets['Sheet1'];
//         } else {
//           sheetName = workbook.SheetNames[0];
//           worksheet = workbook.Sheets[sheetName];
//         }
        
//         console.log('Using sheet:', sheetName);
        
//         // Get the range of the worksheet
//         const range = XLSX.utils.decode_range(worksheet['!ref']);
//         console.log('Worksheet range:', range);
        
//         // Get headers from the first row
//         const headers = [];
//         for (let C = range.s.c; C <= range.e.c; ++C) {
//           const cellAddress = { c: C, r: range.s.r };
//           const cellRef = XLSX.utils.encode_cell(cellAddress);
//           const cell = worksheet[cellRef];
//           if (cell && cell.v) {
//             headers.push(cell.v.toString().trim());
//           }
//         }
//         console.log('Detected headers:', headers);
        
//         // Convert to JSON, skipping the header row
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//           header: headers,
//           defval: '',
//           raw: false,
//           range: 1 // Skip the first row (headers)
//         });
        
//         console.log('Parsed Excel data (without headers):', jsonData);
//         console.log('First data row:', jsonData[0] || {});
        
//         // Validate that we have data rows
//         if (jsonData.length === 0) {
//           setError('No data found in the Excel file. Please make sure there are student records below the header row.');
//           return;
//         }
        
//         // Check if the required columns exist in the first data row
//         const firstRow = jsonData[0];
//         const requiredColumns = ['Student ID', ...gradeForm.components.map(c => c.name)];
//         const missingColumns = requiredColumns.filter(col => 
//           !Object.keys(firstRow).some(key => key.trim() === col.trim())
//         );
        
//         if (missingColumns.length > 0) {
//           setError(`Missing required columns: ${missingColumns.join(', ')}. Found columns: ${Object.keys(firstRow).join(', ')}`);
//           return;
//         }
        
//         setExcelData(jsonData);
//         setError(''); // Clear any previous errors
        
//       } catch (error) {
//         console.error('Error parsing Excel file:', error);
//         setError('Failed to parse Excel file. Please make sure it\'s a valid Excel file and contains the correct columns.');
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const uploadGrades = async () => {
//   if (!course || !excelData) {
//     setError('Please upload an Excel file first');
//     return;
//   }

//   try {
//     setUploading(true);
//     setError('');
//     const user = getUserData();
//     const courseId = course.course_id;

//     // Create students map using username as key
//     const studentsMap = {};
//     students.forEach(st => {
//       const studentUsername = st.username || st.username_id;
//       if (studentUsername) {
//         studentsMap[studentUsername] = st;
//       }
//     });

//     console.log('=== UPLOAD GRADES - COURSE-SPECIFIC FIX ===');
//     console.log('Target Course ID:', courseId);
//     console.log('Students in this course:', students.length);

//     const results = {
//       created: 0,
//       updated: 0,
//       skipped: 0,
//       errors: []
//     };

//     // STEP 1: Get ALL grades for this course first
//     let allCourseGrades = [];
//     try {
//       console.log('📋 Getting all grades for course...');
//       const courseGradesResponse = await api.get('grades/dynamic-grades/', {
//         params: { course: courseId }
//       });
      
//       // Handle different response formats
//       if (courseGradesResponse.data) {
//         if (Array.isArray(courseGradesResponse.data)) {
//           allCourseGrades = courseGradesResponse.data;
//         } else if (courseGradesResponse.data.results && Array.isArray(courseGradesResponse.data.results)) {
//           allCourseGrades = courseGradesResponse.data.results;
//         } else if (courseGradesResponse.data.grades && Array.isArray(courseGradesResponse.data.grades)) {
//           allCourseGrades = courseGradesResponse.data.grades;
//         }
//       }
      
//       console.log(`📋 Found ${allCourseGrades.length} grades for this course:`, allCourseGrades);
//     } catch (error) {
//       console.error('Error getting course grades:', error);
//     }

//     // STEP 2: Process each student in Excel
//     for (const row of excelData) {
//       const studentIdentifier = row['Student ID'];
      
//       if (!studentIdentifier || studentIdentifier === 'Student ID') {
//         continue;
//       }

//       console.log(`\n🎯 Processing: ${studentIdentifier} for course ${courseId}`);

//       // Find student in our course-specific list
//       const studentObj = studentsMap[studentIdentifier];
//       if (!studentObj) {
//         results.errors.push(`Student not found in this course: ${studentIdentifier}`);
//         continue;
//       }

//       const studentId = getStudentId(studentObj);
//       console.log(`Student ID: ${studentId}, Course ID: ${courseId}`);

//       // Extract grade data from Excel
//       const gradeComponents = {};
//       const gradeColumns = Object.keys(row).filter(col => 
//         !['Student ID', 'Full Name', 'Grade Status'].includes(col)
//       );

//       for (const column of gradeColumns) {
//         const scoreValue = row[column];
//         if (scoreValue !== '' && scoreValue !== null && scoreValue !== undefined) {
//           const numericScore = parseFloat(scoreValue);
//           if (!isNaN(numericScore)) {
//             gradeComponents[column] = {
//               score: numericScore,
//               max_score: 100,
//               weight: 1.0
//             };
//             console.log(`✅ ${column}: ${numericScore}`);
//           }
//         }
//       }

//       if (Object.keys(gradeComponents).length === 0) {
//         results.errors.push(`No valid grade data for: ${studentIdentifier}`);
//         continue;
//       }

//       // STEP 3: Find existing grade - ONLY from current course
//       let existingGrade = null;

//       // Strategy 1: Look in our pre-fetched course grades (course-specific)
//       if (Array.isArray(allCourseGrades) && allCourseGrades.length > 0) {
//         existingGrade = allCourseGrades.find(grade => {
//           // Check different student identifier formats
//           const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
//           const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
          
//           // Only match if both student AND course match
//           return gradeStudentId == studentId && gradeCourseId == courseId;
//         });
        
//         if (existingGrade) {
//           console.log(`📋 Found grade in pre-fetched list: ${existingGrade.id}`);
//         }
//       }

//       // Strategy 2: If not found, search specifically for this student IN THIS COURSE
//       if (!existingGrade) {
//         try {
//           console.log(`🔍 Searching specifically for student ${studentId} in course ${courseId}...`);
//           const specificSearch = await api.get('grades/dynamic-grades/', {
//             params: {
//               student: studentId,
//               course: courseId  // IMPORTANT: Only search in current course
//             }
//           });
          
//           // Handle different response formats for specific search
//           let searchData = [];
//           if (specificSearch.data) {
//             if (Array.isArray(specificSearch.data)) {
//               searchData = specificSearch.data;
//             } else if (specificSearch.data.results && Array.isArray(specificSearch.data.results)) {
//               searchData = specificSearch.data.results;
//             }
//           }
          
//           if (searchData.length > 0) {
//             existingGrade = searchData[0];
//             console.log(`🔍 Found grade via specific search: ${existingGrade.id}`);
            
//             // Verify the grade belongs to our course
//             const foundCourseId = existingGrade.course?.id || existingGrade.course_id || existingGrade.course;
//             if (foundCourseId != courseId) {
//               console.warn(`⚠️ Grade course mismatch in search: Expected ${courseId}, found ${foundCourseId}`);
//               existingGrade = null; // Don't use this grade
//             }
//           } else {
//             console.log('🔍 No grade found via specific search in this course');
//           }
//         } catch (searchError) {
//           console.log('Specific search failed:', searchError);
//         }
//       }

//       // STEP 4: Update or create grade
//       try {
//         if (existingGrade) {
//           // UPDATE existing grade - we already verified it's for the right course
//           console.log(`✏️ Updating existing grade ID: ${existingGrade.id}`);
          
//           const updatePayload = {
//             grade_components: gradeComponents,
//             teacher: user?.userId || user?.id
//           };

//           const response = await api.patch(`grades/dynamic-grades/${existingGrade.id}/`, updatePayload);
//           results.updated++;
//           console.log(`✅ Updated grade for ${studentIdentifier} in course ${courseId}`);
          
//         } else {
//           // CREATE new grade - no existing grade found for this course
//           console.log(`🆕 Creating new grade for ${studentIdentifier} in course ${courseId}`);
          
//           const createPayload = {
//             student: studentId,
//             course: courseId, // Explicit course ID
//             teacher: user?.userId || user?.id,
//             grade_components: gradeComponents
//           };

//           try {
//             const response = await api.post('grades/dynamic-grades/', createPayload);
//             results.created++;
//             console.log(`✅ Created new grade for ${studentIdentifier} in course ${courseId}`);
//           } catch (createError) {
//             // Handle unique constraint errors
//             if (createError.response?.status === 400 && 
//                 createError.response.data.non_field_errors?.[0]?.includes('unique')) {
              
//               console.log('🔄 Grade exists but not found in our search, trying to locate it...');
              
//               // Final attempt: Search more broadly but filter by course
//               try {
//                 const finalSearch = await api.get('grades/dynamic-grades/', {
//                   params: { student: studentId }
//                 });
                
//                 let finalGrades = [];
//                 if (finalSearch.data) {
//                   if (Array.isArray(finalSearch.data)) {
//                     finalGrades = finalSearch.data;
//                   } else if (finalSearch.data.results && Array.isArray(finalSearch.data.results)) {
//                     finalGrades = finalSearch.data.results;
//                   }
//                 }
                
//                 // Filter to only grades for this course
//                 const courseSpecificGrade = finalGrades.find(g => {
//                   const gradeCourseId = g.course?.id || g.course_id || g.course;
//                   return gradeCourseId == courseId;
//                 });

//                 if (courseSpecificGrade) {
//                   console.log(`🚨 Found course-specific grade: ${courseSpecificGrade.id}`);
//                   await api.patch(`grades/dynamic-grades/${courseSpecificGrade.id}/`, {
//                     grade_components: gradeComponents,
//                     teacher: user?.userId || user?.id
//                   });
//                   results.updated++;
//                   console.log(`✅ Updated course-specific grade for ${studentIdentifier}`);
//                 } else {
//                   // Grade exists but in different course - create new one
//                   console.log(`🆕 Grade exists in different course, creating new grade for current course`);
//                   const retryResponse = await api.post('grades/dynamic-grades/', createPayload);
//                   results.created++;
//                   console.log(`✅ Created new grade for ${studentIdentifier} in course ${courseId}`);
//                 }
//               } catch (finalError) {
//                 console.error('Final search failed:', finalError);
//                 results.errors.push(`Failed for ${studentIdentifier}: Grade exists but cannot be updated`);
//               }
//             } else {
//               // Other creation errors
//               throw createError;
//             }
//           }
//         }
//       } catch (error) {
//         console.error(`❌ Error for ${studentIdentifier}:`, error.response?.data || error.message);
//         results.errors.push(`Failed for ${studentIdentifier}: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
//       }
//     }

//     // Show results
//     let message = `Grade upload completed for ${course.course_name}!\n\n`;
//     message += `✅ Created: ${results.created} grades\n`;
//     message += `✏️ Updated: ${results.updated} grades\n`;
//     message += `⏭️ Skipped: ${results.skipped} grades\n`;
    
//     if (results.errors.length > 0) {
//       message += `\n❌ Errors: ${results.errors.length}\n`;
//       message += results.errors.slice(0, 5).join('\n');
//       if (results.errors.length > 5) {
//         message += `\n... and ${results.errors.length - 5} more errors`;
//       }
//     }

//     setSuccess(message);
//     setExcelData(null);

//     // Refresh grades for this specific course
//     await checkExistingGrades();

//   } catch (error) {
//     console.error('Upload failed:', error);
//     setError(`Upload failed: ${error.message}`);
//   } finally {
//     setUploading(false);
//   }
// };

//   // Show loading if course is not available yet - FIXED VERSION
//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course information...</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Please wait while we load the course details.
//           </p>
//           <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md max-w-md">
//             <p className="text-blue-700 text-sm">
//               If this takes too long, please check:
//             </p>
//             <ul className="text-blue-600 text-sm mt-2 text-left">
//               <li>• You have selected a valid course</li>
//               <li>• You have proper permissions to access this course</li>
//               <li>• The course exists in the system</li>
//             </ul>
//             <button 
//               onClick={() => window.history.back()}
//               className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading students for {course.course_name}...</p>
//           <p className="text-sm text-gray-500 mt-2">
//             Course ID: {course.course_id}
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6">
//       <div className="max-w-6xl mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//           <h1 className="text-2xl font-bold text-gray-800 mb-2">Grade Management - {course.course_name}</h1>
//           <p className="text-gray-600">Course ID: {course.course_id} | {course.course_taken_year} Year - Semester {course.course_taken_semester}</p>
//           <div className="flex items-center justify-between mt-2">
//             <p className="text-sm text-gray-500">Total Students: {students.length}</p>
//             <div className="flex space-x-2">
//               <button 
//                 onClick={fetchStudents}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//               >
//                 Refresh Students
//               </button>
//               <button 
//                 onClick={checkExistingGrades}
//                 disabled={checkingGrades}
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:bg-gray-400"
//               >
//                 {checkingGrades ? 'Checking...' : 'Check Grades'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error/Success Messages */}
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//             {error}
//             <button 
//               onClick={() => setError('')}
//               className="float-right text-red-800 font-bold"
//             >
//               ×
//             </button>
//           </div>
//         )}
//         {success && (
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
//             {success}
//             <button 
//               onClick={() => setSuccess('')}
//               className="float-right text-green-800 font-bold"
//             >
//               ×
//             </button>
//           </div>
//         )}

//         {/* Debug Info */}
//         <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
//           <h3 className="font-semibold text-yellow-800 mb-2">Course Information:</h3>
//           <p className="text-yellow-700 text-sm">
//             Course Department ID: {course.department_id}, Year: {course.course_taken_year}, Semester: {course.course_taken_semester}
//           </p>
//           <p className="text-yellow-700 text-sm">
//             Found {students.length} students matching these criteria.
//           </p>
//           <p className="text-yellow-700 text-sm">
//             Grades Status: {Object.values(existingGrades).filter(g => g.is_approved).length} approved, 
//             {Object.values(existingGrades).filter(g => !g.is_approved).length} pending approval
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-md mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => setActiveTab('create')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'create'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Create Grade Form
//               </button>
//               <button
//                 onClick={() => setActiveTab('download')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'download'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Download Template
//               </button>
//               <button
//                 onClick={() => setActiveTab('upload')}
//                 className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
//                   activeTab === 'upload'
//                     ? 'border-blue-500 text-blue-600'
//                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                 }`}
//               >
//                 Upload Grades
//               </button>
//             </nav>
//           </div>

//           <div className="p-6">
//             {/* Create Grade Form Tab */}
//             {activeTab === 'create' && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Create Grade Form</h2>
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Form Title</label>
//                     <input
//                       type="text"
//                       value={gradeForm.title}
//                       onChange={(e) => setGradeForm({...gradeForm, title: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       placeholder="e.g., Final Grades - Semester I"
//                     />
//                     <p className="text-xs text-gray-500 mt-1">A unique timestamp will be automatically added to ensure uniqueness</p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
//                     <textarea
//                       value={gradeForm.description}
//                       onChange={(e) => setGradeForm({...gradeForm, description: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       rows={3}
//                       placeholder="Describe this grade form..."
//                     />
//                   </div>
                  
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-md font-medium text-gray-700">Grade Components</h3>
//                       <button
//                         onClick={addGradeComponent}
//                         className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
//                       >
//                         Add Component
//                       </button>
//                     </div>
                    
//                     {gradeForm.components.map((component, index) => (
//                       <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-md">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                           <input
//                             type="text"
//                             value={component.name}
//                             onChange={(e) => updateGradeComponent(index, 'name', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                             placeholder="e.g., Quiz 1"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
//                           <input
//                             type="number"
//                             value={component.max_score || ''}
//                             onChange={(e) => updateGradeComponent(index, 'max_score', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                             min="0"
//                             step="0.1"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-2">Weight (%)</label>
//                           <input
//                             type="number"
//                             value={component.weight || ''}
//                             onChange={(e) => updateGradeComponent(index, 'weight', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
//                             min="0"
//                             max="99.99"
//                             step="0.01"
//                           />
//                           <p className="text-xs text-gray-500 mt-1">Must be less than 100%</p>
//                         </div>
//                         <div className="flex items-end">
//                           <button
//                             onClick={() => removeGradeComponent(index)}
//                             className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     ))}
                    
//                     {gradeForm.components.length === 0 && (
//                       <div className="text-center py-8 text-gray-500">
//                         <p>No grade components added yet. Click "Add Component" to get started.</p>
//                       </div>
//                     )}
//                   </div>
                  
//                   <button
//                     onClick={createGradeForm}
//                     disabled={!gradeForm.title || gradeForm.components.length === 0}
//                     className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Create Grade Form 
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Download Template Tab */}
//             {activeTab === 'download' && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Download Excel Template</h2>
//                 <p className="text-gray-600 mb-4">
//                   Download an Excel template with all students and the grade components you created.
//                   Fill in the grades and upload the file in the next step. Approved grades cannot be modified.
//                 </p>
                
//                 {/* Show what columns will be included */}
//                 {gradeForm.components.length > 0 && (
//                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                     <h4 className="font-semibold text-blue-800 mb-1">Template will include columns:</h4>
//                     <div className="text-sm text-blue-700">
//                       <span className="font-mono">Student ID, Full Name, Grade Status, </span>
//                       {gradeForm.components.map((comp, index) => (
//                         <span key={index} className="font-mono">
//                           {comp.name}
//                           {index < gradeForm.components.length - 1 ? ', ' : ''}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
                
//                 <button
//                   onClick={downloadExcelTemplate}
//                   disabled={students.length === 0 || gradeForm.components.length === 0}
//                   className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Download Excel Template
//                 </button>
                
//                 {students.length === 0 && (
//                   <p className="text-red-500 mt-2">No students available to create a template.</p>
//                 )}
//                 {gradeForm.components.length === 0 && (
//                   <p className="text-red-500 mt-2">No grade components defined. Please create components first.</p>
//                 )}
//               </div>
//             )}

//             {/* Upload Grades Tab */}
//             {activeTab === 'upload' && (
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Upload Grades</h2>
                
//                 {/* Debug Info */}
//                 {excelData && (
//                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                     <h4 className="font-semibold text-blue-800 mb-2">File Analysis:</h4>
//                     <div className="text-sm text-blue-700">
//                       <p>Columns detected: {Object.keys(excelData[0] || {}).join(', ')}</p>
//                       <p>Expected components: {gradeForm.components.map(c => c.name).join(', ')}</p>
//                       <p>First row sample: {JSON.stringify(excelData[0])}</p>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
//                   <input
//                     type="file"
//                     accept=".xlsx,.xls"
//                     onChange={handleFileUpload}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 {excelData && (
//                   <div className="mb-6">
//                     <h3 className="font-semibold mb-2">Preview (First 5 rows):</h3>
//                     <div className="overflow-x-auto">
//                       <table className="min-w-full bg-white border border-gray-200">
//                         <thead>
//                           <tr>
//                             {Object.keys(excelData[0]).map((key) => (
//                               <th key={key} className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                                 {key}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {excelData.slice(0, 5).map((row, index) => (
//                             <tr key={index}>
//                               {Object.values(row).map((value, i) => (
//                                 <td key={i} className="px-4 py-2 border-b border-gray-200 text-sm">
//                                   {value}
//                                 </td>
//                               ))}
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 )}
                
//                 <button
//                   onClick={uploadGrades}
//                   disabled={!excelData || uploading}
//                   className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {uploading ? 'Uploading...' : 'Upload Grades'}
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Students List */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Students in this Course</h2>
//             <div className="flex items-center space-x-4">
//               <span className="text-sm text-gray-500">{students.length} students</span>
//               <div className="flex space-x-2 text-xs">
//                 <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Approved: {Object.values(existingGrades).filter(g => g.is_approved).length}</span>
//                 <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending: {Object.values(existingGrades).filter(g => !g.is_approved).length}</span>
//                 <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">No Grade: {students.length - Object.keys(existingGrades).length}</span>
//               </div>
//             </div>
//           </div>
//           {students.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p>No students found for this course.</p>
//               <p className="mt-2 text-sm">Course criteria: Department ID {course.department_id}, Year {course.course_taken_year}, Semester {course.course_taken_semester}</p>
//               <button 
//                 onClick={fetchStudents}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//               >
//                 Try Again
//               </button>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Student ID
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Name
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Department
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Year
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Semester
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Grade Status
//                     </th>
//                     <th className="px-4 py-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
//                       Can Edit
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student, index) => {
//                     const gradeStatus = getGradeStatus(student);
//                     const editable = canEditGrade(student);
                    
//                     return (
//                       <tr key={student.username || student.username_id || index}>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           {student.username || student.username_id}
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           {getStudentFullName(student)}
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           {student.department_id || student.department?.name || ''}
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           {student.year || student.user_details?.year || student.academic_year || student.current_year || ''}
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || ''}
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${gradeStatus.color}-100 text-${gradeStatus.color}-800`}>
//                             {gradeStatus.status}
//                           </span>
//                         </td>
//                         <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                           <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${editable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {editable ? 'Yes' : 'No'}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GradeInsertionPage;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

// const GradeInsertionPage = ({ course }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [activeTab, setActiveTab] = useState('create');
//   const [gradeForm, setGradeForm] = useState({
//     title: '',
//     description: '',
//     components: []
//   });
//   const [excelData, setExcelData] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [existingGrades, setExistingGrades] = useState({});
//   const [checkingGrades, setCheckingGrades] = useState(false);
//   const [gradesApproved, setGradesApproved] = useState(false);

//   // Get user data from localStorage
//   const getUserData = () => {
//     try {
//       const userData = localStorage.getItem('user');
//       return userData ? JSON.parse(userData) : null;
//     } catch (error) {
//       console.error('Error parsing user data:', error);
//       return null;
//     }
//   };

//   // Get token from localStorage
//   const getAuthToken = () => {
//     return localStorage.getItem('access');
//   };

//   // Axios instance
//   const api = axios.create({
//     baseURL: '/api/',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   });

//   // Add request interceptor
//   api.interceptors.request.use(
//     (config) => {
//       const token = getAuthToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );

//   useEffect(() => {
//     if (course) {
//       fetchStudents();
//     }
//   }, [course]);

//   // Function to check if any grade is approved for THIS SPECIFIC COURSE
//   const checkGradesApprovalStatus = async () => {
//     if (!course) return;
    
//     try {
//       const response = await api.get('grades/dynamic-grades/', {
//         params: { 
//           course: course.course_id,
//           limit: 1000
//         }
//       });
      
//       let grades = [];
//       if (response.data) {
//         if (Array.isArray(response.data)) {
//           grades = response.data;
//         } else if (response.data.results && Array.isArray(response.data.results)) {
//           grades = response.data.results;
//         } else if (response.data.grades && Array.isArray(response.data.grades)) {
//           grades = response.data.grades;
//         }
//       }
      
//       const courseSpecificGrades = grades.filter(grade => {
//         const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
//         return gradeCourseId == course.course_id;
//       });
      
//       const approvedGrades = courseSpecificGrades.filter(grade => grade.is_approved === true);
//       const hasApprovedGrades = approvedGrades.length > 0;
      
//       setGradesApproved(hasApprovedGrades);
      
//     } catch (error) {
//       console.error('Error checking grade approval status:', error);
//       setGradesApproved(false);
//     }
//   };

//   // Function to check existing grades for students in THIS COURSE
//   const checkExistingGrades = async () => {
//     if (!course || students.length === 0) return;
    
//     try {
//       setCheckingGrades(true);
//       const gradesMap = {};
//       const courseId = course.course_id;
      
//       let courseGrades = [];
//       try {
//         const response = await api.get('grades/dynamic-grades/', {
//           params: { 
//             course: courseId,
//             limit: 1000
//           }
//         });
        
//         if (response.data) {
//           if (Array.isArray(response.data)) {
//             courseGrades = response.data;
//           } else if (response.data.results && Array.isArray(response.data.results)) {
//             courseGrades = response.data.results;
//           }
//         }
        
//         courseGrades = courseGrades.filter(grade => {
//           const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
//           return gradeCourseId == courseId;
//         });
        
//       } catch (error) {
//         console.error('Error fetching course grades:', error);
//       }
      
//       const hasApprovedGrades = courseGrades.some(grade => grade.is_approved === true);
//       setGradesApproved(hasApprovedGrades);
      
//       for (const student of students) {
//         const studentId = getStudentId(student);
//         if (studentId) {
//           try {
//             const existingGrade = courseGrades.find(grade => {
//               const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
//               return gradeStudentId == studentId;
//             });
            
//             if (existingGrade) {
//               gradesMap[studentId] = {
//                 id: existingGrade.id,
//                 grade_components: existingGrade.grade_components,
//                 total_score: existingGrade.total_score,
//                 final_grade: existingGrade.final_grade,
//                 is_approved: existingGrade.is_approved
//               };
//             }
//           } catch (error) {
//             console.log(`No existing grade found for student ${studentId}`);
//           }
//         }
//       }
      
//       setExistingGrades(gradesMap);
      
//     } catch (error) {
//       console.error('Error checking existing grades:', error);
//     } finally {
//       setCheckingGrades(false);
//     }
//   };

//   // Function to normalize semester values for comparison
//   const normalizeSemester = (semester) => {
//     if (!semester) return null;
    
//     const semStr = semester.toString().toLowerCase().trim();
    
//     if (semStr.includes('1') || semStr.includes('i') || semStr.includes('first') || semStr === '1') {
//       return 'I';
//     }
//     if (semStr.includes('2') || semStr.includes('ii') || semStr.includes('second') || semStr === '2') {
//       return 'II';
//     }
//     if (semStr.includes('3') || semStr.includes('iii') || semStr.includes('third') || semStr === '3') {
//       return 'III';
//     }
//     if (semStr.includes('4') || semStr.includes('iv') || semStr.includes('fourth') || semStr === '4') {
//       return 'IV';
//     }
    
//     return semester;
//   };

//   // Function to normalize year values for comparison
//   const normalizeYear = (year) => {
//     if (!year) return null;
    
//     const yearStr = year.toString().toLowerCase().trim();
    
//     if (yearStr.includes('1') || yearStr.includes('first') || yearStr === '1') {
//       return '1';
//     }
//     if (yearStr.includes('2') || yearStr.includes('second') || yearStr === '2') {
//       return '2';
//     }
//     if (yearStr.includes('3') || yearStr.includes('third') || yearStr === '3') {
//       return '3';
//     }
//     if (yearStr.includes('4') || yearStr.includes('fourth') || yearStr === '4') {
//       return '4';
//     }
//     if (yearStr.includes('5') || yearStr.includes('fifth') || yearStr === '5') {
//       return '5';
//     }
    
//     return year;
//   };

//   const fetchStudents = async () => {
//     if (!course) {
//       setError('Course information is not available');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError('');
      
//       await checkGradesApprovalStatus();
      
//       const response = await api.get('students/');
      
//       let studentsData = [];
      
//       if (response.data && Array.isArray(response.data.results)) {
//         studentsData = response.data.results;
//       } else if (Array.isArray(response.data)) {
//         studentsData = response.data;
//       } else if (response.data && Array.isArray(response.data.students)) {
//         studentsData = response.data.students;
//       } else {
//         setError('Unexpected response format from server');
//         setStudents([]);
//         return;
//       }
      
//       const normalizedCourseDept = course.department_id ? course.department_id.toString() : null;
//       const normalizedCourseYear = normalizeYear(course.course_taken_year);
//       const normalizedCourseSemester = normalizeSemester(course.course_taken_semester);
      
//       const uniqueStudentIds = new Set();
      
//       const filteredStudents = studentsData.filter(student => {
//         if (!student) return false;
        
//         const studentId = student.username || student.username_id || student.id;
//         if (!studentId) return false;
        
//         if (uniqueStudentIds.has(studentId)) {
//           return false;
//         }
        
//         let studentDept = null;
//         if (student.department_id) {
//           studentDept = student.department_id.toString();
//         } else if (student.department) {
//           studentDept = typeof student.department === 'object' 
//             ? (student.department.id || student.department.department_id || '').toString()
//             : student.department.toString();
//         } else if (student.departmentId) {
//           studentDept = student.departmentId.toString();
//         }
        
//         let studentYear = null;
//         let studentSemester = null;
        
//         if (student.year) {
//           studentYear = student.year.toString();
//         } else if (student.user_details && student.user_details.year) {
//           studentYear = student.user_details.year.toString();
//         } else if (student.academic_year) {
//           studentYear = student.academic_year.toString();
//         } else if (student.current_year) {
//           studentYear = student.current_year.toString();
//         } else if (student.year_of_study) {
//           studentYear = student.year_of_study.toString();
//         }
        
//         if (student.semester) {
//           studentSemester = student.semester.toString();
//         } else if (student.user_details && student.user_details.semester) {
//           studentSemester = student.user_details.semester.toString();
//         } else if (student.academic_semester) {
//           studentSemester = student.academic_semester.toString();
//         } else if (student.current_semester) {
//           studentSemester = student.current_semester.toString();
//         } else if (student.semester_of_study) {
//           studentSemester = student.semester_of_study.toString();
//         }
        
//         if ((!studentYear || !studentSemester) && student.semesters) {
//           const semesterKeys = Object.keys(student.semesters);
//           for (const key of semesterKeys) {
//             const yearMatch = key.match(/(\d+)(?:st|nd|rd|th) Year/);
//             const semesterMatch = key.match(/I Semester|II Semester|III Semester|IV Semester/);
            
//             if (yearMatch && semesterMatch) {
//               const yearFromKey = yearMatch[1];
//               const semesterFromKey = semesterMatch[0].includes('I') ? 'I' : 
//                                     semesterMatch[0].includes('II') ? 'II' :
//                                     semesterMatch[0].includes('III') ? 'III' : 'IV';
              
//               if (!studentYear) studentYear = yearFromKey;
//               if (!studentSemester) studentSemester = semesterFromKey;
              
//               const normalizedYearFromKey = normalizeYear(yearFromKey);
//               const normalizedSemesterFromKey = normalizeSemester(semesterFromKey);
              
//               if (normalizedYearFromKey === normalizedCourseYear && 
//                   normalizedSemesterFromKey === normalizedCourseSemester) {
//                 studentYear = yearFromKey;
//                 studentSemester = semesterFromKey;
//                 break;
//               }
//             }
//           }
//         }
        
//         const normalizedStudentYear = normalizeYear(studentYear);
//         const normalizedStudentSemester = normalizeSemester(studentSemester);
        
//         const matchesCriteria = studentDept === normalizedCourseDept &&
//                normalizedStudentYear === normalizedCourseYear &&
//                normalizedStudentSemester === normalizedCourseSemester;
        
//         if (matchesCriteria) {
//           uniqueStudentIds.add(studentId);
//           return true;
//         }
        
//         return false;
//       });
      
//       setStudents(filteredStudents);
      
//       if (filteredStudents.length > 0) {
//         await checkExistingGrades();
//       }
      
//       if (filteredStudents.length === 0) {
//         setError('No students found matching the course criteria.');
//       }
//     } catch (error) {
//       console.error('Error fetching students:', error);
//       setError('Failed to fetch students. Please try again.');
//       setStudents([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addGradeComponent = () => {
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot modify grade components.');
//       return;
//     }
//     setGradeForm({
//       ...gradeForm,
//       components: [
//         ...gradeForm.components,
//         { name: '', max_score: 0, weight: 0 }
//       ]
//     });
//   };

//   const updateGradeComponent = (index, field, value) => {
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot modify grade components.');
//       return;
//     }
//     const updatedComponents = [...gradeForm.components];
    
//     if (field === 'name') {
//       updatedComponents[index][field] = value;
//     } else {
//       const numericValue = value === '' ? 0 : parseFloat(value);
//        updatedComponents[index][field] = isNaN(numericValue) ? 0 : numericValue;
//     }
    
//     setGradeForm({
//       ...gradeForm,
//       components: updatedComponents
//     });
//   };

//   const removeGradeComponent = (index) => {
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot modify grade components.');
//       return;
//     }
//     const updatedComponents = gradeForm.components.filter((_, i) => i !== index);
//     setGradeForm({
//       ...gradeForm,
//       components: updatedComponents
//     });
//   };

//   const createGradeForm = async () => {
//     if (!course) return;
    
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot create new grade forms.');
//       return;
//     }
    
//     try {
//       const user = getUserData();
      
//       if (!gradeForm.title.trim()) {
//         setError('Form title is required');
//         return;
//       }
      
//       if (gradeForm.components.length === 0) {
//         setError('At least one grade component is required');
//         return;
//       }
      
//       for (const component of gradeForm.components) {
//         if (!component.name.trim()) {
//           setError('All grade components must have a name');
//           return;
//         }
//         if (component.max_score <= 0) {
//           setError('Max score must be greater than 0');
//           return;
//         }
//         if (component.weight >= 100) {
//           setError('Weight must be less than 100%');
//           return;
//         }
//       }

//       const timestamp = new Date().getTime();
//       const uniqueTitle = `${gradeForm.title} - ${timestamp}`;
      
//       const formPayload = {
//         course: course.course_id,
//         teacher: user.userId,
//         batch: `${course.course_taken_year}-${course.course_taken_semester}`,
//         title: uniqueTitle,
//         description: gradeForm.description
//       };

//       const formResponse = await api.post('grades/grade-form-templates/', formPayload);
//       const formTemplate = formResponse.data;
      
//       if (!formTemplate) {
//         throw new Error('Failed to create form template: Empty response');
//       }

//       let formTemplateId = null;
      
//       if (formTemplate.id !== undefined) {
//         formTemplateId = formTemplate.id;
//       } else if (formTemplate.pk !== undefined) {
//         formTemplateId = formTemplate.pk;
//       } else if (formTemplate.form_id !== undefined) {
//         formTemplateId = formTemplate.form_id;
//       } else if (formResponse.headers && formResponse.headers.location) {
//         const location = formResponse.headers.location;
//         const idMatch = location.match(/\/(\d+)\/$/) || location.match(/\/([a-f0-9-]+)\/$/);
//         if (idMatch && idMatch[1]) {
//           formTemplateId = idMatch[1];
//         }
//       }
      
//       if (!formTemplateId) {
//         try {
//           const searchResponse = await api.get('grades/grade-form-templates/', {
//             params: {
//               course: course.course_id,
//               title: uniqueTitle
//             }
//           });
          
//           if (searchResponse.data && searchResponse.data.length > 0) {
//             const foundTemplate = searchResponse.data[0];
//             formTemplateId = foundTemplate.id || foundTemplate.pk;
//           }
//         } catch (searchError) {
//           console.error('Error searching for form template:', searchError);
//         }
//       }
      
//       if (!formTemplateId) {
//         throw new Error('Failed to create form template: No ID returned in response');
//       }

//       for (const [index, component] of gradeForm.components.entries()) {
//         const componentPayload = {
//           form_template: formTemplateId,
//           name: component.name,
//           max_score: component.max_score,
//           weight: Math.min(component.weight, 99.99),
//           field_type: 'number',
//           required: true,
//           order: index
//         };
        
//         await api.post('grades/grade-components/', componentPayload);
//       }

//       setSuccess('Grade form created successfully!');
//       setActiveTab('upload');
//     } catch (error) {
//       console.error('Error creating grade form:', error);
      
//       let errorMessage = 'Failed to create grade form';
      
//       if (error.response?.data) {
//         if (error.response.data.form_template) {
//           errorMessage = 'Failed to create form template. Please check if the form template was created successfully.';
//         }
//         else if (error.response.data.non_field_errors && error.response.data.non_field_errors[0].includes('unique')) {
//           errorMessage = 'A grade form with this title already exists for this course. Please use a different title.';
//         } 
//         else if (error.response.data.weight) {
//           errorMessage = 'Weight must be less than 100 and have no more than 2 decimal places.';
//         }
//         else {
//           errorMessage = Object.values(error.response.data).flat().join(', ');
//         }
//       } else {
//         errorMessage = error.message || 'Failed to create grade form';
//       }
      
//       setError(errorMessage);
//     }
//   };

//   // Helper function to get student full name
//   const getStudentFullName = (student) => {
//     if (student.firstName && student.fatherName) {
//       return `${student.firstName} ${student.fatherName}`;
//     }
//     if (student.first_name && student.father_name) {
//       return `${student.first_name} ${student.father_name}`;
//     }
//     if (student.user_details?.firstName && student.user_details?.fatherName) {
//       return `${student.user_details.firstName} ${student.user_details.fatherName}`;
//     }
//     if (student.name) {
//       return student.name;
//     }
//     return 'Unknown Name';
//   };

//   // Helper function to get student ID
//   const getStudentId = (student) => {
//     if (student.id) {
//       return student.id;
//     }
//     if (student.pk) {
//       return student.pk;
//     }
//     if (student.username) {
//       return student.username;
//     }
//     if (student.username_id) {
//       return student.username_id;
//     }
//     if (student.user_details?.id) {
//       return student.user_details.id;
//     }
//     if (student.user_details?.username) {
//       return student.user_details.username;
//     }
    
//     return null;
//   };

//   // Helper function to check if grade can be edited for a student
//   const canEditGrade = (student) => {
//     return !gradesApproved;
//   };

//   // Helper function to get grade status for a student
//   const getGradeStatus = (student) => {
//     const studentId = getStudentId(student);
//     const existingGrade = existingGrades[studentId];
    
//     if (!existingGrade) {
//       return { status: 'No Grade', color: 'gray' };
//     }
    
//     if (existingGrade.is_approved) {
//       return { status: 'Approved', color: 'green' };
//     } else {
//       return { status: 'Pending Approval', color: 'yellow' };
//     }
//   };

//   const downloadExcelTemplate = async () => {
//     if (!course) return;
    
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot download templates.');
//       return;
//     }
    
//     try {
//       const workbook = XLSX.utils.book_new();
      
//       const gradeTemplateData = [
//         {
//           'Student ID': 'Student ID',
//           'Full Name': 'Full Name',
//           'Grade Status': 'Grade Status',
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = component.name;
//             return acc;
//           }, {})
//         },
//         ...students.map(student => {
//           const studentId = getStudentId(student);
//           const existingGrade = existingGrades[studentId];
//           const gradeStatus = getGradeStatus(student);
//           const editable = canEditGrade(student);
          
//           const existingComponents = existingGrade ? existingGrade.grade_components : {};
          
//           return {
//             'Student ID': student.username || student.username_id,
//             'Full Name': getStudentFullName(student),
//             'Grade Status': gradeStatus.status,
//             ...gradeForm.components.reduce((acc, component) => {
//               if (existingComponents[component.name] && editable) {
//                 acc[component.name] = existingComponents[component.name].score;
//               } else {
//                 acc[component.name] = '';
//               }
//               return acc;
//             }, {})
//           };
//         })
//       ];

//       const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
//       XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

//       const instructionsData = [
//         ['IMPORTANT INSTRUCTIONS:'],
//         ['1. Fill in the grades in the "Grades Template" sheet'],
//         ['2. Do not modify the "Student ID" and "Grade Status" columns'],
//         ['3. Enter numeric scores for each student'],
//         ['4. Approved grades cannot be modified - they will be skipped during upload'],
//         ['5. Save the file after filling all grades'],
//         ['6. Upload the completed file in the Upload Grades tab'],
//         [''],
//         ['Example:'],
//         ['Student ID', 'Full Name', 'Grade Status', 'Quiz 1', 'Final Exam'],
//         ['bereket-583780', 'Bereket Mamo', 'Pending Approval', '85', '90'],
//         ['bedilu-212024', 'Bedilu Belete', 'Approved', '90', '95']
//       ];
      
//       const instructionWs = XLSX.utils.json_to_sheet(instructionsData);
//       XLSX.utils.book_append_sheet(workbook, instructionWs, 'Instructions');

//       const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//       const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
//       saveAs(data, `${course.course_name}_Grade_Template.xlsx`);
//       setSuccess('Excel template downloaded successfully!');
      
//     } catch (error) {
//       console.error('Error creating Excel template:', error);
//       setError('Failed to create Excel template: ' + error.message);
//     }
//   };

//   const handleFileUpload = (event) => {
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot upload new grades.');
//       return;
//     }
    
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
        
//         let worksheet = null;
//         let sheetName = '';
        
//         if (workbook.SheetNames.includes('Grades Template')) {
//           sheetName = 'Grades Template';
//           worksheet = workbook.Sheets['Grades Template'];
//         } else if (workbook.SheetNames.includes('Sheet1')) {
//           sheetName = 'Sheet1';
//           worksheet = workbook.Sheets['Sheet1'];
//         } else {
//           sheetName = workbook.SheetNames[0];
//           worksheet = workbook.Sheets[sheetName];
//         }
        
//         const range = XLSX.utils.decode_range(worksheet['!ref']);
        
//         const headers = [];
//         for (let C = range.s.c; C <= range.e.c; ++C) {
//           const cellAddress = { c: C, r: range.s.r };
//           const cellRef = XLSX.utils.encode_cell(cellAddress);
//           const cell = worksheet[cellRef];
//           if (cell && cell.v) {
//             headers.push(cell.v.toString().trim());
//           }
//         }
        
//         const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//           header: headers,
//           defval: '',
//           raw: false,
//           range: 1
//         });
        
//         if (jsonData.length === 0) {
//           setError('No data found in the Excel file.');
//           return;
//         }
        
//         const firstRow = jsonData[0];
//         const requiredColumns = ['Student ID', ...gradeForm.components.map(c => c.name)];
//         const missingColumns = requiredColumns.filter(col => 
//           !Object.keys(firstRow).some(key => key.trim() === col.trim())
//         );
        
//         if (missingColumns.length > 0) {
//           setError(`Missing required columns: ${missingColumns.join(', ')}`);
//           return;
//         }
        
//         setExcelData(jsonData);
//         setError('');
        
//       } catch (error) {
//         console.error('Error parsing Excel file:', error);
//         setError('Failed to parse Excel file. Please make sure it\'s a valid Excel file.');
//       }
//     };
//     reader.readAsArrayBuffer(file);
//   };

//   const uploadGrades = async () => {
//     if (gradesApproved) {
//       setError('Grades are already approved. You cannot upload new grades.');
//       return;
//     }
    
//     if (!course || !excelData) {
//       setError('Please upload an Excel file first');
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');
//       const user = getUserData();
//       const courseId = course.course_id;

//       const studentsMap = {};
//       students.forEach(st => {
//         const studentUsername = st.username || st.username_id;
//         if (studentUsername) {
//           studentsMap[studentUsername] = st;
//         }
//       });

//       const results = {
//         created: 0,
//         updated: 0,
//         skipped: 0,
//         errors: []
//       };

//       let allCourseGrades = [];
//       try {
//         const courseGradesResponse = await api.get('grades/dynamic-grades/', {
//           params: { 
//             course: courseId,
//             limit: 1000
//           }
//         });
        
//         if (courseGradesResponse.data) {
//           if (Array.isArray(courseGradesResponse.data)) {
//             allCourseGrades = courseGradesResponse.data;
//           } else if (courseGradesResponse.data.results && Array.isArray(courseGradesResponse.data.results)) {
//             allCourseGrades = courseGradesResponse.data.results;
//           } else if (courseGradesResponse.data.grades && Array.isArray(courseGradesResponse.data.grades)) {
//             allCourseGrades = courseGradesResponse.data.grades;
//           }
//         }
        
//         allCourseGrades = allCourseGrades.filter(grade => {
//           const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
//           return gradeCourseId == courseId;
//         });
        
//       } catch (error) {
//         console.error('Error getting course grades:', error);
//       }

//       for (const row of excelData) {
//         const studentIdentifier = row['Student ID'];
        
//         if (!studentIdentifier || studentIdentifier === 'Student ID') {
//           continue;
//         }

//         const studentObj = studentsMap[studentIdentifier];
//         if (!studentObj) {
//           results.errors.push(`Student not found in this course: ${studentIdentifier}`);
//           continue;
//         }

//         const studentId = getStudentId(studentObj);

//         const gradeComponents = {};
//         const gradeColumns = Object.keys(row).filter(col => 
//           !['Student ID', 'Full Name', 'Grade Status'].includes(col)
//         );

//         for (const column of gradeColumns) {
//           const scoreValue = row[column];
//           if (scoreValue !== '' && scoreValue !== null && scoreValue !== undefined) {
//             const numericScore = parseFloat(scoreValue);
//             if (!isNaN(numericScore)) {
//               gradeComponents[column] = {
//                 score: numericScore,
//                 max_score: 100,
//                 weight: 1.0
//               };
//             }
//           }
//         }

//         if (Object.keys(gradeComponents).length === 0) {
//           results.errors.push(`No valid grade data for: ${studentIdentifier}`);
//           continue;
//         }

//         let existingGrade = null;

//         if (Array.isArray(allCourseGrades) && allCourseGrades.length > 0) {
//           existingGrade = allCourseGrades.find(grade => {
//             const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
//             const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
            
//             return gradeStudentId == studentId && gradeCourseId == courseId;
//           });
//         }

//         if (!existingGrade) {
//           try {
//             const specificSearch = await api.get('grades/dynamic-grades/', {
//               params: {
//                 student: studentId,
//                 course: courseId
//               }
//             });
            
//             let searchData = [];
//             if (specificSearch.data) {
//               if (Array.isArray(specificSearch.data)) {
//                 searchData = specificSearch.data;
//               } else if (specificSearch.data.results && Array.isArray(specificSearch.data.results)) {
//                 searchData = specificSearch.data.results;
//               }
//             }
            
//             searchData = searchData.filter(grade => {
//               const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
//               return gradeCourseId == courseId;
//             });
            
//             if (searchData.length > 0) {
//               existingGrade = searchData[0];
//             }
//           } catch (searchError) {
//             console.log('Specific search failed:', searchError);
//           }
//         }

//         try {
//           if (existingGrade) {
//             const updatePayload = {
//               grade_components: gradeComponents,
//               teacher: user?.userId || user?.id
//             };

//             await api.patch(`grades/dynamic-grades/${existingGrade.id}/`, updatePayload);
//             results.updated++;
            
//           } else {
//             const createPayload = {
//               student: studentId,
//               course: courseId,
//               teacher: user?.userId || user?.id,
//               grade_components: gradeComponents
//             };

//             try {
//               await api.post('grades/dynamic-grades/', createPayload);
//               results.created++;
//             } catch (createError) {
//               if (createError.response?.status === 400 && 
//                   createError.response.data.non_field_errors?.[0]?.includes('unique')) {
                
//                 try {
//                   const finalSearch = await api.get('grades/dynamic-grades/', {
//                     params: { student: studentId }
//                   });
                  
//                   let finalGrades = [];
//                   if (finalSearch.data) {
//                     if (Array.isArray(finalSearch.data)) {
//                       finalGrades = finalSearch.data;
//                     } else if (finalSearch.data.results && Array.isArray(finalSearch.data.results)) {
//                       finalGrades = finalSearch.data.results;
//                     }
//                   }
                  
//                   const courseSpecificGrade = finalGrades.find(g => {
//                     const gradeCourseId = g.course?.id || g.course_id || g.course;
//                     return gradeCourseId == courseId;
//                   });

//                   if (courseSpecificGrade) {
//                     await api.patch(`grades/dynamic-grades/${courseSpecificGrade.id}/`, {
//                       grade_components: gradeComponents,
//                       teacher: user?.userId || user?.id
//                     });
//                     results.updated++;
//                   } else {
//                     await api.post('grades/dynamic-grades/', createPayload);
//                     results.created++;
//                   }
//                 } catch (finalError) {
//                   results.errors.push(`Failed for ${studentIdentifier}: Grade exists but cannot be updated`);
//                 }
//               } else {
//                 throw createError;
//               }
//             }
//           }
//         } catch (error) {
//           results.errors.push(`Failed for ${studentIdentifier}: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
//         }
//       }

//       let message = `Grade upload completed for ${course.course_name}!\n\n`;
//       // message += `✅ Created: ${results.created} grades\n`;
//       // message += ` Updated: ${results.updated} grades\n`;
//       message += ` Grade Updated Successfully\n`;
      
//       if (results.errors.length > 0) {
//         message += `\n❌ Errors: ${results.errors.length}\n`;
//         message += results.errors.slice(0, 3).join('\n');
//         if (results.errors.length > 3) {
//           message += `\n... and ${results.errors.length - 3} more errors`;
//         }
//       }

//       setSuccess(message);
//       setExcelData(null);

//       await checkExistingGrades();

//     } catch (error) {
//       console.error('Upload failed:', error);
//       setError(`Upload failed: ${error.message}`);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Show approval message if grades are approved for this course
//   if (gradesApproved) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Grades Already Approved</h2>
//           <p className="text-gray-600 mb-2">
//             The grades for <strong className="text-blue-600">{course?.course_name}</strong> have been approved.
//           </p>
//           <p className="text-gray-500 text-sm mb-6">
//             You cannot edit or modify the marks as they are already finalized.
//           </p>
//           <button 
//             onClick={() => window.history.back()}
//             className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg font-medium">Loading course information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-700 text-lg font-medium">Loading students...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex-1">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                 Grade Management
//               </h1>
//               <div className="flex flex-wrap items-center gap-4 text-gray-600">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">Course:</span>
//                   <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {course.course_name}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">ID:</span>
//                   <span>{course.course_id}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">Students:</span>
//                   <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                     {students.length}
//                   </span>
//                 </div>
//               </div>
//             </div>
//             <div className="flex gap-3 mt-4 lg:mt-0">
//               <button 
//                 onClick={fetchStudents}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//                 </svg>
//                 Refresh
//               </button>
//               {/* <button 
//                 onClick={checkExistingGrades}
//                 disabled={checkingGrades}
//                 className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center gap-2"
//               >
//                 {checkingGrades ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Checking...
//                   </>
//                 ) : (
//                   <>
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     Check Grades
//                   </>
//                 )}
//               </button> */}
//             </div>
//           </div>
//         </div>

//         {/* Error/Success Messages */}
//         {error && (
//           <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-3 flex-1">
//                 <p className="text-red-800 font-medium">{error}</p>
//               </div>
//               <button 
//                 onClick={() => setError('')}
//                 className="ml-4 text-red-400 hover:text-red-600 transition-colors"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}
        
//         {success && (
//           <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-3 flex-1">
//                 <p className="text-green-800 font-medium whitespace-pre-line">{success}</p>
//               </div>
//               <button 
//                 onClick={() => setSuccess('')}
//                 className="ml-4 text-green-400 hover:text-green-600 transition-colors"
//               >
//                 <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Sidebar Navigation */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Management</h2>
//               <nav className="space-y-2">
//                 {[
//                   // { id: 'create', label: 'Create Grade Form', icon: '📝' },
//                   { id: 'upload', label: 'Upload Grades', icon: '📤' }
//                 ].map((tab) => (
//                   <button
//                     key={tab.id}
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
//                       activeTab === tab.id
//                         ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
//                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                     }`}
//                   >
//                     <span className="text-lg">{tab.icon}</span>
//                     <span className="font-medium">{tab.label}</span>
//                   </button>
//                 ))}
//               </nav>
//             </div>
//           </div>

//           {/* Main Content Area */}
//           <div className="lg:col-span-3">
//             {/* <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"> */}
//               {/* Create Grade Form Tab */}
//               {/* {activeTab === 'create' && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <span className="text-2xl">📝</span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">Create Grade Form</h2>
//                       <p className="text-gray-600">Define the structure for your grade assessment</p>
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">Form Title</label>
//                       <input
//                         type="text"
//                         value={gradeForm.title}
//                         onChange={(e) => setGradeForm({...gradeForm, title: e.target.value})}
//                         className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
//                         placeholder="e.g., Final Grades - Semester I"
//                       />
//                     </div>
                    
//                     <div>
//                       <div className="flex items-center justify-between mb-4">
//                         <div>
//                           <h3 className="text-lg font-semibold text-gray-900">Grade Components</h3>
//                           <p className="text-gray-600 text-sm">Define the assessment components and their weights</p>
//                         </div>
//                         <button
//                           onClick={addGradeComponent}
//                           className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors duration-200 font-medium flex items-center gap-2"
//                         >
//                           <span>+</span>
//                           Add Component
//                         </button>
//                       </div>
                      
//                       {gradeForm.components.map((component, index) => (
//                         <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4 p-6 border border-gray-200 rounded-xl bg-gray-50">
//                           <div className="md:col-span-4">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Component Name</label>
//                             <input
//                               type="text"
//                               value={component.name}
//                               onChange={(e) => updateGradeComponent(index, 'name', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               placeholder="e.g., Quiz 1, Assignment"
//                             />
//                           </div>
//                           <div className="md:col-span-3">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
//                             <input
//                               type="number"
//                               value={component.max_score || ''}
//                               onChange={(e) => updateGradeComponent(index, 'max_score', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               min="0"
//                               step="0.1"
//                             />
//                           </div>
//                           <div className="md:col-span-3">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Weight (%)</label>
//                             <input
//                               type="number"
//                               value={component.weight || ''}
//                               onChange={(e) => updateGradeComponent(index, 'weight', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                               min="0"
//                               max="99.99"
//                               step="0.01"
//                             />
//                           </div>
//                           <div className="md:col-span-2 flex items-end">
//                             <button
//                               onClick={() => removeGradeComponent(index)}
//                               className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       ))}
                      
//                       {gradeForm.components.length === 0 && (
//                         <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
//                           <div className="text-4xl mb-4">📊</div>
//                           <p className="text-gray-500 text-lg">No grade components added yet</p>
//                           <p className="text-gray-400 text-sm mt-2">Click "Add Component" to get started</p>
//                         </div>
//                       )}
//                     </div>
                    
//                     <button
//                       onClick={createGradeForm}
//                       disabled={!gradeForm.title || gradeForm.components.length === 0}
//                       className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl"
//                     >
//                       Create Grade Form
//                     </button>
//                   </div>
//                 </div>
//               )} */}

//               {/* Upload Grades Tab */}
//               {activeTab === 'upload' && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-purple-100 rounded-lg">
//                       <span className="text-2xl">📤</span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">Upload Updated Grades</h2>
//                       <p className="text-gray-600">Upload completed Excel template with student grades</p>
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     {/* File Upload */}
//                     <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50">
//                       <div className="text-4xl mb-4">📄</div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Upload Excel File
//                       </label>
//                       <p className="text-gray-500 text-sm mb-4">Supported formats: .xlsx, .xls</p>
//                       <input
//                         type="file"
//                         accept=".xlsx,.xls"
//                         onChange={handleFileUpload}
//                         className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
//                       />
//                     </div>
                    
//                     {/* File Preview */}
//                     {excelData && (
//                       <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//                         <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                           <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                           </svg>
//                           File Preview (First 3 rows)
//                         </h3>
//                         <div className="overflow-x-auto rounded-xl border border-gray-200">
//                           <table className="min-w-full bg-white">
//                             <thead>
//                               <tr className="bg-gray-50">
//                                 {Object.keys(excelData[0]).map((key) => (
//                                   <th key={key} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
//                                     {key}
//                                   </th>
//                                 ))}
//                               </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-200">
//                               {excelData.slice(0, 1000).map((row, index) => (
//                                 <tr key={index} className="hover:bg-gray-50">
//                                   {Object.values(row).map((value, i) => (
//                                     <td key={i} className="px-4 py-3 text-sm text-gray-900">
//                                       {value}
//                                     </td>
//                                   ))}
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </div>
//                     )}
                    
//                     {/* Upload Button */}
//                     <button
//                       onClick={uploadGrades}
//                       disabled={!excelData || uploading}
//                       className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
//                     >
//                       {uploading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                           Uploading Grades...
//                         </>
//                       ) : (
//                         <>
//                           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
//                           </svg>
//                           Upload Grades
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             {/* </div> */}
//           </div>
//         </div>

//         {/* Students List */}
//         <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
//             <div className="flex items-center gap-3 mb-4 sm:mb-0">
//               <div className="p-2 bg-indigo-100 rounded-lg">
//                 <span className="text-xl">👥</span>
//               </div>
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900">Students in this Course</h2>
//                 <p className="text-gray-600">Total: {students.length} students</p>
//               </div>
//             </div>
//             <div className="flex space-x-2">
//               <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Approved: {Object.values(existingGrades).filter(g => g.is_approved).length}
//               </span>
//               <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Pending: {Object.values(existingGrades).filter(g => !g.is_approved).length}
//               </span>
//               {/* <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
//                 No Grade: {students.length - Object.keys(existingGrades).length}
//               </span> */}
//             </div>
//           </div>
          
//           {students.length === 0 ? (
//             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
//               <div className="text-4xl mb-4">🎓</div>
//               <p className="text-gray-500 text-lg">No students found for this course</p>
//             </div>
//           ) : (
//             <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Student ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Full Name
//                     </th>
//                     {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Year
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Semester
//                     </th> */}
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Grade Status
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Can Edit
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {students.map((student, index) => {
//                     const gradeStatus = getGradeStatus(student);
//                     const editable = canEditGrade(student);
                    
//                     return (
//                       <tr key={student.username || student.username_id || index} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="text-sm font-medium text-gray-900">
//                             {student.username || student.username_id}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900 font-medium">
//                             {getStudentFullName(student)}
//                           </div>
//                         </td>
//                         {/* <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                             {student.year || student.user_details?.year || student.academic_year || student.current_year || 'N/A'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                             {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || 'N/A'}
//                           </span>
//                         </td> */}
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           {/* <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
//                             gradeStatus.color === 'green' ? 'bg-green-100 text-green-800' :
//                             gradeStatus.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
//                             'bg-gray-100 text-gray-800'
//                           }`}>
//                             {gradeStatus.status}
//                           </span> */} <p>Panding</p>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
//                             editable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                           }`}>
//                             {editable ? 'Yes' : 'No'}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GradeInsertionPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { 
  FaArrowLeft, FaDownload, FaUpload, FaUsers, FaBook, FaIdCard, 
  FaGraduationCap, FaCalendarAlt, FaUniversity, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaTable, FaEye, FaEyeSlash,
  FaClipboardList, FaFileExcel, FaInfoCircle, FaBookOpen,
  FaTimesCircle, FaHourglassHalf, FaEdit, FaBan
} from 'react-icons/fa';

const GradeInsertionPage = ({ course, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [gradeForm, setGradeForm] = useState({
    title: '',
    description: '',
    components: []
  });
  const [excelData, setExcelData] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [existingGrades, setExistingGrades] = useState({});
  const [checkingGrades, setCheckingGrades] = useState(false);
  const [gradesApproved, setGradesApproved] = useState(false);
  const [showStudentList, setShowStudentList] = useState(true);

  // Get user data from localStorage
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access');
  };

  // Axios instance
  const api = axios.create({
    baseURL: '/api/',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  useEffect(() => {
    if (course) {
      fetchStudents();
    }
  }, [course]);

  // Function to check if any grade is approved for THIS SPECIFIC COURSE
  const checkGradesApprovalStatus = async () => {
    if (!course) return;
    
    try {
      const response = await api.get('grades/dynamic-grades/', {
        params: { 
          course: course.course_id,
          limit: 1000
        }
      });
      
      let grades = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          grades = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          grades = response.data.results;
        } else if (response.data.grades && Array.isArray(response.data.grades)) {
          grades = response.data.grades;
        }
      }
      
      const courseSpecificGrades = grades.filter(grade => {
        const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
        return gradeCourseId == course.course_id;
      });
      
      const approvedGrades = courseSpecificGrades.filter(grade => grade.is_approved === true);
      const hasApprovedGrades = approvedGrades.length > 0;
      
      setGradesApproved(hasApprovedGrades);
      
    } catch (error) {
      console.error('Error checking grade approval status:', error);
      setGradesApproved(false);
    }
  };

  // Function to check existing grades for students in THIS COURSE
  const checkExistingGrades = async () => {
    if (!course || students.length === 0) return;
    
    try {
      setCheckingGrades(true);
      const gradesMap = {};
      const courseId = course.course_id;
      
      let courseGrades = [];
      try {
        const response = await api.get('grades/dynamic-grades/', {
          params: { 
            course: courseId,
            limit: 1000
          }
        });
        
        if (response.data) {
          if (Array.isArray(response.data)) {
            courseGrades = response.data;
          } else if (response.data.results && Array.isArray(response.data.results)) {
            courseGrades = response.data.results;
          }
        }
        
        courseGrades = courseGrades.filter(grade => {
          const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
          return gradeCourseId == courseId;
        });
        
      } catch (error) {
        console.error('Error fetching course grades:', error);
      }
      
      const hasApprovedGrades = courseGrades.some(grade => grade.is_approved === true);
      setGradesApproved(hasApprovedGrades);
      
      for (const student of students) {
        const studentId = getStudentId(student);
        if (studentId) {
          try {
            const existingGrade = courseGrades.find(grade => {
              const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
              return gradeStudentId == studentId;
            });
            
            if (existingGrade) {
              gradesMap[studentId] = {
                id: existingGrade.id,
                grade_components: existingGrade.grade_components,
                total_score: existingGrade.total_score,
                final_grade: existingGrade.final_grade,
                is_approved: existingGrade.is_approved
              };
            }
          } catch (error) {
            console.log(`No existing grade found for student ${studentId}`);
          }
        }
      }
      
      setExistingGrades(gradesMap);
      
    } catch (error) {
      console.error('Error checking existing grades:', error);
    } finally {
      setCheckingGrades(false);
    }
  };

  // Function to normalize semester values for comparison
  const normalizeSemester = (semester) => {
    if (!semester) return null;
    
    const semStr = semester.toString().toLowerCase().trim();
    
    if (semStr.includes('1') || semStr.includes('i') || semStr.includes('first') || semStr === '1') {
      return 'I';
    }
    if (semStr.includes('2') || semStr.includes('ii') || semStr.includes('second') || semStr === '2') {
      return 'II';
    }
    if (semStr.includes('3') || semStr.includes('iii') || semStr.includes('third') || semStr === '3') {
      return 'III';
    }
    if (semStr.includes('4') || semStr.includes('iv') || semStr.includes('fourth') || semStr === '4') {
      return 'IV';
    }
    
    return semester;
  };

  // Function to normalize year values for comparison
  const normalizeYear = (year) => {
    if (!year) return null;
    
    const yearStr = year.toString().toLowerCase().trim();
    
    if (yearStr.includes('1') || yearStr.includes('first') || yearStr === '1') {
      return '1';
    }
    if (yearStr.includes('2') || yearStr.includes('second') || yearStr === '2') {
      return '2';
    }
    if (yearStr.includes('3') || yearStr.includes('third') || yearStr === '3') {
      return '3';
    }
    if (yearStr.includes('4') || yearStr.includes('fourth') || yearStr === '4') {
      return '4';
    }
    if (yearStr.includes('5') || yearStr.includes('fifth') || yearStr === '5') {
      return '5';
    }
    
    return year;
  };

  const fetchStudents = async () => {
    if (!course) {
      setError('Course information is not available');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await checkGradesApprovalStatus();
      
      const response = await api.get('students/');
      
      let studentsData = [];
      
      if (response.data && Array.isArray(response.data.results)) {
        studentsData = response.data.results;
      } else if (Array.isArray(response.data)) {
        studentsData = response.data;
      } else if (response.data && Array.isArray(response.data.students)) {
        studentsData = response.data.students;
      } else {
        setError('Unexpected response format from server');
        setStudents([]);
        return;
      }
      
      const normalizedCourseDept = course.department_id ? course.department_id.toString() : null;
      const normalizedCourseYear = normalizeYear(course.course_taken_year);
      const normalizedCourseSemester = normalizeSemester(course.course_taken_semester);
      
      const uniqueStudentIds = new Set();
      
      const filteredStudents = studentsData.filter(student => {
        if (!student) return false;
        
        const studentId = student.username || student.username_id || student.id;
        if (!studentId) return false;
        
        if (uniqueStudentIds.has(studentId)) {
          return false;
        }
        
        let studentDept = null;
        if (student.department_id) {
          studentDept = student.department_id.toString();
        } else if (student.department) {
          studentDept = typeof student.department === 'object' 
            ? (student.department.id || student.department.department_id || '').toString()
            : student.department.toString();
        } else if (student.departmentId) {
          studentDept = student.departmentId.toString();
        }
        
        let studentYear = null;
        let studentSemester = null;
        
        if (student.year) {
          studentYear = student.year.toString();
        } else if (student.user_details && student.user_details.year) {
          studentYear = student.user_details.year.toString();
        } else if (student.academic_year) {
          studentYear = student.academic_year.toString();
        } else if (student.current_year) {
          studentYear = student.current_year.toString();
        } else if (student.year_of_study) {
          studentYear = student.year_of_study.toString();
        }
        
        if (student.semester) {
          studentSemester = student.semester.toString();
        } else if (student.user_details && student.user_details.semester) {
          studentSemester = student.user_details.semester.toString();
        } else if (student.academic_semester) {
          studentSemester = student.academic_semester.toString();
        } else if (student.current_semester) {
          studentSemester = student.current_semester.toString();
        } else if (student.semester_of_study) {
          studentSemester = student.semester_of_study.toString();
        }
        
        if ((!studentYear || !studentSemester) && student.semesters) {
          const semesterKeys = Object.keys(student.semesters);
          for (const key of semesterKeys) {
            const yearMatch = key.match(/(\d+)(?:st|nd|rd|th) Year/);
            const semesterMatch = key.match(/I Semester|II Semester|III Semester|IV Semester/);
            
            if (yearMatch && semesterMatch) {
              const yearFromKey = yearMatch[1];
              const semesterFromKey = semesterMatch[0].includes('I') ? 'I' : 
                                    semesterMatch[0].includes('II') ? 'II' :
                                    semesterMatch[0].includes('III') ? 'III' : 'IV';
              
              if (!studentYear) studentYear = yearFromKey;
              if (!studentSemester) studentSemester = semesterFromKey;
              
              const normalizedYearFromKey = normalizeYear(yearFromKey);
              const normalizedSemesterFromKey = normalizeSemester(semesterFromKey);
              
              if (normalizedYearFromKey === normalizedCourseYear && 
                  normalizedSemesterFromKey === normalizedCourseSemester) {
                studentYear = yearFromKey;
                studentSemester = semesterFromKey;
                break;
              }
            }
          }
        }
        
        const normalizedStudentYear = normalizeYear(studentYear);
        const normalizedStudentSemester = normalizeSemester(studentSemester);
        
        const matchesCriteria = studentDept === normalizedCourseDept &&
               normalizedStudentYear === normalizedCourseYear &&
               normalizedStudentSemester === normalizedCourseSemester;
        
        if (matchesCriteria) {
          uniqueStudentIds.add(studentId);
          return true;
        }
        
        return false;
      });
      
      setStudents(filteredStudents);
      
      if (filteredStudents.length > 0) {
        await checkExistingGrades();
      }
      
      if (filteredStudents.length === 0) {
        setError('No students found matching the course criteria.');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to fetch students. Please try again.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get student full name
  const getStudentFullName = (student) => {
    if (student.firstName && student.fatherName) {
      return `${student.firstName} ${student.fatherName}`;
    }
    if (student.first_name && student.father_name) {
      return `${student.first_name} ${student.father_name}`;
    }
    if (student.user_details?.firstName && student.user_details?.fatherName) {
      return `${student.user_details.firstName} ${student.user_details.fatherName}`;
    }
    if (student.name) {
      return student.name;
    }
    return 'Unknown Name';
  };

  // Helper function to get student ID
  const getStudentId = (student) => {
    if (student.id) {
      return student.id;
    }
    if (student.pk) {
      return student.pk;
    }
    if (student.username) {
      return student.username;
    }
    if (student.username_id) {
      return student.username_id;
    }
    if (student.user_details?.id) {
      return student.user_details.id;
    }
    if (student.user_details?.username) {
      return student.user_details.username;
    }
    
    return null;
  };

  // Helper function to check if grade can be edited for a student
  const canEditGrade = (student) => {
    return !gradesApproved;
  };

  // Helper function to get grade status for a student
  const getGradeStatus = (student) => {
    const studentId = getStudentId(student);
    const existingGrade = existingGrades[studentId];
    
    if (!existingGrade) {
      return { status: 'No Grade', color: 'gray', icon: <FaTimesCircle className="text-slate-400" /> };
    }
    
    if (existingGrade.is_approved) {
      return { status: 'Approved', color: 'green', icon: <FaCheckCircle className="text-emerald-500" /> };
    } else {
      return { status: 'Pending', color: 'yellow', icon: <FaHourglassHalf className="text-amber-500" /> };
    }
  };

  const downloadExcelTemplate = async () => {
    if (!course) return;
    
    if (gradesApproved) {
      setError('Grades are already approved. You cannot download templates.');
      return;
    }
    
    try {
      const workbook = XLSX.utils.book_new();
      
      const gradeTemplateData = [
        {
          'Student ID': 'Student ID',
          'Full Name': 'Full Name',
          'Grade Status': 'Grade Status',
          ...gradeForm.components.reduce((acc, component) => {
            acc[component.name] = component.name;
            return acc;
          }, {})
        },
        ...students.map(student => {
          const studentId = getStudentId(student);
          const existingGrade = existingGrades[studentId];
          const gradeStatus = getGradeStatus(student);
          const editable = canEditGrade(student);
          
          const existingComponents = existingGrade ? existingGrade.grade_components : {};
          
          return {
            'Student ID': student.username || student.username_id,
            'Full Name': getStudentFullName(student),
            'Grade Status': gradeStatus.status,
            ...gradeForm.components.reduce((acc, component) => {
              if (existingComponents[component.name] && editable) {
                acc[component.name] = existingComponents[component.name].score;
              } else {
                acc[component.name] = '';
              }
              return acc;
            }, {})
          };
        })
      ];

      const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
      XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

      const instructionsData = [
        ['IMPORTANT INSTRUCTIONS:'],
        ['1. Fill in the grades in the "Grades Template" sheet'],
        ['2. Do not modify the "Student ID" and "Grade Status" columns'],
        ['3. Enter numeric scores for each student'],
        ['4. Approved grades cannot be modified - they will be skipped during upload'],
        ['5. Save the file after filling all grades'],
        ['6. Upload the completed file in the Upload Grades tab']
      ];
      
      const instructionWs = XLSX.utils.json_to_sheet(instructionsData);
      XLSX.utils.book_append_sheet(workbook, instructionWs, 'Instructions');

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      saveAs(data, `${course.course_name}_Grade_Template.xlsx`);
      setSuccess('Excel template downloaded successfully!');
      
    } catch (error) {
      console.error('Error creating Excel template:', error);
      setError('Failed to create Excel template: ' + error.message);
    }
  };

  const handleFileUpload = (event) => {
    if (gradesApproved) {
      setError('Grades are already approved. You cannot upload new grades.');
      return;
    }
    
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let worksheet = null;
        let sheetName = '';
        
        if (workbook.SheetNames.includes('Grades Template')) {
          sheetName = 'Grades Template';
          worksheet = workbook.Sheets['Grades Template'];
        } else if (workbook.SheetNames.includes('Sheet1')) {
          sheetName = 'Sheet1';
          worksheet = workbook.Sheets['Sheet1'];
        } else {
          sheetName = workbook.SheetNames[0];
          worksheet = workbook.Sheets[sheetName];
        }
        
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        
        const headers = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = { c: C, r: range.s.r };
          const cellRef = XLSX.utils.encode_cell(cellAddress);
          const cell = worksheet[cellRef];
          if (cell && cell.v) {
            headers.push(cell.v.toString().trim());
          }
        }
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: headers,
          defval: '',
          raw: false,
          range: 1
        });
        
        if (jsonData.length === 0) {
          setError('No data found in the Excel file.');
          return;
        }
        
        const firstRow = jsonData[0];
        const requiredColumns = ['Student ID', ...gradeForm.components.map(c => c.name)];
        const missingColumns = requiredColumns.filter(col => 
          !Object.keys(firstRow).some(key => key.trim() === col.trim())
        );
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }
        
        setExcelData(jsonData);
        setError('');
        
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        setError('Failed to parse Excel file. Please make sure it\'s a valid Excel file.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const uploadGrades = async () => {
    if (gradesApproved) {
      setError('Grades are already approved. You cannot upload new grades.');
      return;
    }
    
    if (!course || !excelData) {
      setError('Please upload an Excel file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const user = getUserData();
      const courseId = course.course_id;

      const studentsMap = {};
      students.forEach(st => {
        const studentUsername = st.username || st.username_id;
        if (studentUsername) {
          studentsMap[studentUsername] = st;
        }
      });

      const results = {
        created: 0,
        updated: 0,
        skipped: 0,
        errors: []
      };

      let allCourseGrades = [];
      try {
        const courseGradesResponse = await api.get('grades/dynamic-grades/', {
          params: { 
            course: courseId,
            limit: 1000
          }
        });
        
        if (courseGradesResponse.data) {
          if (Array.isArray(courseGradesResponse.data)) {
            allCourseGrades = courseGradesResponse.data;
          } else if (courseGradesResponse.data.results && Array.isArray(courseGradesResponse.data.results)) {
            allCourseGrades = courseGradesResponse.data.results;
          } else if (courseGradesResponse.data.grades && Array.isArray(courseGradesResponse.data.grades)) {
            allCourseGrades = courseGradesResponse.data.grades;
          }
        }
        
        allCourseGrades = allCourseGrades.filter(grade => {
          const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
          return gradeCourseId == courseId;
        });
        
      } catch (error) {
        console.error('Error getting course grades:', error);
      }

      for (const row of excelData) {
        const studentIdentifier = row['Student ID'];
        
        if (!studentIdentifier || studentIdentifier === 'Student ID') {
          continue;
        }

        const studentObj = studentsMap[studentIdentifier];
        if (!studentObj) {
          results.errors.push(`Student not found in this course: ${studentIdentifier}`);
          continue;
        }

        const studentId = getStudentId(studentObj);

        const gradeComponents = {};
        const gradeColumns = Object.keys(row).filter(col => 
          !['Student ID', 'Full Name', 'Grade Status'].includes(col)
        );

        for (const column of gradeColumns) {
          const scoreValue = row[column];
          if (scoreValue !== '' && scoreValue !== null && scoreValue !== undefined) {
            const numericScore = parseFloat(scoreValue);
            if (!isNaN(numericScore)) {
              gradeComponents[column] = {
                score: numericScore,
                max_score: 100,
                weight: 1.0
              };
            }
          }
        }

        if (Object.keys(gradeComponents).length === 0) {
          results.errors.push(`No valid grade data for: ${studentIdentifier}`);
          continue;
        }

        let existingGrade = null;

        if (Array.isArray(allCourseGrades) && allCourseGrades.length > 0) {
          existingGrade = allCourseGrades.find(grade => {
            const gradeStudentId = grade.student?.id || grade.student_id || grade.student;
            const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
            
            return gradeStudentId == studentId && gradeCourseId == courseId;
          });
        }

        if (!existingGrade) {
          try {
            const specificSearch = await api.get('grades/dynamic-grades/', {
              params: {
                student: studentId,
                course: courseId
              }
            });
            
            let searchData = [];
            if (specificSearch.data) {
              if (Array.isArray(specificSearch.data)) {
                searchData = specificSearch.data;
              } else if (specificSearch.data.results && Array.isArray(specificSearch.data.results)) {
                searchData = specificSearch.data.results;
              }
            }
            
            searchData = searchData.filter(grade => {
              const gradeCourseId = grade.course?.id || grade.course_id || grade.course;
              return gradeCourseId == courseId;
            });
            
            if (searchData.length > 0) {
              existingGrade = searchData[0];
            }
          } catch (searchError) {
            console.log('Specific search failed:', searchError);
          }
        }

        try {
          if (existingGrade) {
            const updatePayload = {
              grade_components: gradeComponents,
              teacher: user?.userId || user?.id
            };

            await api.patch(`grades/dynamic-grades/${existingGrade.id}/`, updatePayload);
            results.updated++;
            
          } else {
            const createPayload = {
              student: studentId,
              course: courseId,
              teacher: user?.userId || user?.id,
              grade_components: gradeComponents
            };

            try {
              await api.post('grades/dynamic-grades/', createPayload);
              results.created++;
            } catch (createError) {
              if (createError.response?.status === 400 && 
                  createError.response.data.non_field_errors?.[0]?.includes('unique')) {
                
                try {
                  const finalSearch = await api.get('grades/dynamic-grades/', {
                    params: { student: studentId }
                  });
                  
                  let finalGrades = [];
                  if (finalSearch.data) {
                    if (Array.isArray(finalSearch.data)) {
                      finalGrades = finalSearch.data;
                    } else if (finalSearch.data.results && Array.isArray(finalSearch.data.results)) {
                      finalGrades = finalSearch.data.results;
                    }
                  }
                  
                  const courseSpecificGrade = finalGrades.find(g => {
                    const gradeCourseId = g.course?.id || g.course_id || g.course;
                    return gradeCourseId == courseId;
                  });

                  if (courseSpecificGrade) {
                    await api.patch(`grades/dynamic-grades/${courseSpecificGrade.id}/`, {
                      grade_components: gradeComponents,
                      teacher: user?.userId || user?.id
                    });
                    results.updated++;
                  } else {
                    await api.post('grades/dynamic-grades/', createPayload);
                    results.created++;
                  }
                } catch (finalError) {
                  results.errors.push(`Failed for ${studentIdentifier}: Grade exists but cannot be updated`);
                }
              } else {
                throw createError;
              }
            }
          }
        } catch (error) {
          results.errors.push(`Failed for ${studentIdentifier}: ${error.response?.data ? JSON.stringify(error.response.data) : error.message}`);
        }
      }

      let message = `✅ Grade upload completed for ${course.course_name}!\n`;
      if (results.updated > 0) {
        message += `📝 Updated grades for ${results.updated} student(s)\n`;
      }
      
      if (results.errors.length > 0) {
        message += `\n⚠️ ${results.errors.length} issue(s):\n`;
        message += results.errors.slice(0, 3).join('\n');
        if (results.errors.length > 3) {
          message += `\n... and ${results.errors.length - 3} more`;
        }
      }

      setSuccess(message);
      setExcelData(null);

      await checkExistingGrades();

    } catch (error) {
      console.error('Upload failed:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Show approval message if grades are approved for this course
  if (gradesApproved) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-3">Grades Already Approved</h2>
          <p className="text-slate-600 text-sm mb-2">
            The grades for <strong className="text-orange-600">{course?.course_name}</strong> have been approved.
          </p>
          <p className="text-slate-500 text-xs mb-6">
            You cannot edit or modify the marks as they are already finalized.
          </p>
          <button 
            onClick={onBack}
            className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-all duration-200 text-sm shadow-sm"
          >
            Go Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto shadow-md"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500 tracking-wide uppercase">Loading course information...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-xl h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto shadow-md"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500 tracking-wide uppercase">Loading student registry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* Back Button Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 group"
          >
            <FaArrowLeft className="text-slate-500 group-hover:text-orange-600 text-lg" />
          </button>
          <div>
            <span className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <FaBookOpen className="text-xs" /> Grade Management Portal
            </span>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Grade Entry System</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-slate-500">
              <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                <FaBook className="text-orange-500" /> {course.course_name}
              </span>
              <span className="flex items-center gap-1"><FaIdCard className="text-slate-400" /> Code: {course.course_id}</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-xl flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
            <p className="text-xs font-medium text-slate-600 mt-0.5">Total Registered</p>
          </div>
          <div className="text-3xl font-black text-orange-600 tracking-tight">
            {students.length}
          </div>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200">
          <FaExclamationCircle className="flex-shrink-0 text-lg" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-rose-400 hover:text-rose-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200 whitespace-pre-line">
          <FaCheckCircle className="flex-shrink-0 text-lg" />
          <span className="whitespace-pre-line">{success}</span>
          <button 
            onClick={() => setSuccess('')}
            className="ml-auto text-emerald-400 hover:text-emerald-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-8">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FaClipboardList /> Workflow Steps
              </h2>
            </div>
            <nav className="p-3 space-y-1.5">
              <button
                onClick={() => setActiveTab('upload')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === 'upload'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className={`${activeTab === 'upload' ? 'text-orange-600' : 'text-slate-400'}`}>
                  <FaUpload className="text-sm" />
                </span>
                <span className="text-sm font-semibold">Upload Grades</span>
                {activeTab === 'upload' && (
                  <span className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Upload Grades Tab */}
            {activeTab === 'upload' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <FaUpload className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Upload Grades</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Submit completed Excel file with student scores</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center transition-all hover:border-orange-300">
                    <div className="text-4xl mb-3">📄</div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 cursor-pointer">
                      Select Excel File
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="w-full max-w-md mx-auto text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                    />
                    <p className="text-slate-400 text-xs mt-2">Supported: .xlsx, .xls formats</p>
                  </div>
                  
                  {excelData && (
                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaTable className="text-slate-500 text-sm" />
                          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Data Preview</h3>
                        </div>
                        <span className="text-[10px] text-slate-400">{excelData.length} rows loaded</span>
                      </div>
                      <div className="overflow-x-auto p-4">
                        <table className="min-w-full bg-white text-sm">
                          <thead>
                            <tr className="border-b border-slate-200">
                              {Object.keys(excelData[0]).map((key) => (
                                <th key={key} className="px-3 py-2 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {excelData.slice(0, 5).map((row, index) => (
                              <tr key={index} className="hover:bg-slate-50">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="px-3 py-2 text-xs text-slate-600">
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {excelData.length > 5 && (
                          <p className="text-center text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100">
                            + {excelData.length - 5} more rows
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={uploadGrades}
                    disabled={!excelData || uploading}
                    className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-purple-600/10 flex items-center justify-center gap-2 text-sm"
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="animate-spin text-sm" />
                        Processing Upload...
                      </>
                    ) : (
                      <>
                        <FaUpload className="text-sm" />
                        Upload Grades to System
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Students List Section - Toggle */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <button
          onClick={() => setShowStudentList(!showStudentList)}
          className="w-full px-6 py-4 flex items-center justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <FaUsers className="text-orange-600 text-sm" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-slate-700">Enrolled Students Registry</h2>
              <p className="text-xs text-slate-400">Course participants with grade status</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                ✅ Approved: {Object.values(existingGrades).filter(g => g.is_approved).length}
              </span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                ⏳ Pending: {Object.values(existingGrades).filter(g => !g.is_approved).length}
              </span>
            </div>
            {showStudentList ? <FaEyeSlash className="text-slate-400" /> : <FaEye className="text-slate-400" />}
          </div>
        </button>
        
        {showStudentList && (
          <div className="p-6 border-t border-slate-100">
            {students.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                <div className="text-4xl mb-3">🎓</div>
                <p className="text-slate-500 text-sm font-medium">No students enrolled</p>
                <p className="text-slate-400 text-xs mt-1">Year {course.course_taken_year}, Semester {course.course_taken_semester}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaIdCard className="inline mr-1.5" /> Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaGraduationCap className="inline mr-1.5" /> Full Name
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaCalendarAlt className="inline mr-1.5" /> Year
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaUniversity className="inline mr-1.5" /> Semester
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaCheckCircle className="inline mr-1.5" /> Grade Status
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <FaEdit className="inline mr-1.5" /> Can Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {students.map((student, index) => {
                      const gradeStatus = getGradeStatus(student);
                      const editable = canEditGrade(student);
                      
                      return (
                        <tr key={student.username || student.username_id || index} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-xs font-mono text-slate-600">
                            {student.username || student.username_id}
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-800">
                            {getStudentFullName(student)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-700">
                              {student.year || student.user_details?.year || student.academic_year || student.current_year || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700">
                              {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || 'N/A'}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              gradeStatus.color === 'green' ? 'bg-emerald-100 text-emerald-700' :
                              gradeStatus.color === 'yellow' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {gradeStatus.icon}
                              {gradeStatus.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              editable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {editable ? <FaCheckCircle className="text-xs" /> : <FaBan className="text-xs" />}
                              {editable ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GradeInsertionPage;