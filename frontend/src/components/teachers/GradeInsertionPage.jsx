
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';

// const GradeInsertionPage = ({ course }) => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
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
//     if (!course) return;
    
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
        
//         // Get student ID for uniqueness check
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

//   // Fallback method: Create a simple grade form without components
//   const createSimpleGradeForm = async () => {
//     if (!course) return;
    
//     try {
//       const user = getUserData();
      
//       // Validate form data
//       if (!gradeForm.title.trim()) {
//         setError('Form title is required');
//         return;
//       }

//       // Generate a unique title
//       const timestamp = new Date().getTime();
//       const uniqueTitle = `${gradeForm.title} - ${timestamp}`;
      
//       // Create a simple payload without components
//       const payload = {
//         course: course.course_id,
//         teacher: user.userId,
//         batch: `${course.course_taken_year}-${course.course_taken_semester}`,
//         title: uniqueTitle,
//         description: gradeForm.description
//       };

//       console.log('Creating simple grade form:', payload);
//       const response = await api.post('grades/grade-form-templates/', payload);
      
//       // Extract the form template ID from the response
//       let formId = null;
//       if (response.data.id !== undefined) {
//         formId = response.data.id;
//       } else if (response.data.pk !== undefined) {
//         formId = response.data.pk;
//       } else if (response.data.form_id !== undefined) {
//         formId = response.data.form_id;
//       }
      
//       // If we still don't have an ID, try to fetch the created form template
//       if (!formId) {
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
//             formId = foundTemplate.id || foundTemplate.pk;
//             console.log('Found form template with ID:', formId);
//           }
//         } catch (searchError) {
//           console.error('Error searching for form template:', searchError);
//         }
//       }
      
//       // Store component information in localStorage for later use
//       const formData = {
//         formId: formId,
//         components: gradeForm.components,
//         courseId: course.course_id
//       };
//       localStorage.setItem('gradeFormData', JSON.stringify(formData));
      
//       setSuccess('Grade form created successfully! You can now download the template.');
//       setActiveTab('download');
//     } catch (error) {
//       console.error('Error creating simple grade form:', error);
//       setError('Failed to create grade form: ' + (error.response?.data?.message || error.message));
//     }
//   };

// const downloadExcelTemplate = async () => {
//   if (!course) return;
  
//   try {
//     const workbook = XLSX.utils.book_new();
    
//     // Create grade template sheet with proper header row
//     const gradeTemplateData = [
//       // Header row
//       {
//         'Student ID': 'Student ID',
//         'Full Name': 'Full Name',
//         ...gradeForm.components.reduce((acc, component) => {
//           acc[component.name] = component.name;
//           return acc;
//         }, {})
//       },
//       // Data rows with example values
//       ...students.map(student => ({
//         'Student ID': student.username || student.username_id,
//         'Full Name': `${student.user_details?.firstName || student.firstName || student.first_name || ''} ${student.user_details?.fatherName || student.fatherName || student.father_name || ''}`.trim(),
//         ...gradeForm.components.reduce((acc, component) => {
//           acc[component.name] = ''; // Empty cell for user to fill
//           return acc;
//         }, {})
//       }))
//     ];

//     const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
//     XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

//     // Create an instructions sheet
//     const instructionsData = [
//       ['IMPORTANT INSTRUCTIONS:'],
//       ['1. Fill in the grades in the "Grades Template" sheet'],
//       ['2. Do not modify the "Student ID" column'],
//       ['3. Enter numeric scores for each student'],
//       ['4. Save the file after filling all grades'],
//       ['5. Upload the completed file in the Upload Grades tab'],
//       [''],
//       ['Example:'],
//       ['Student ID', 'Full Name', 'grade'],
//       ['bereket-583780', 'Bereket Mamo', '85'],
//       ['bedilu-212024', 'Bedilu Belete', '90']
//     ];
    
//     const instructionWs = XLSX.utils.json_to_sheet(instructionsData);
//     XLSX.utils.book_append_sheet(workbook, instructionWs, 'Instructions');

//     // Save the workbook
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
//     saveAs(data, `${course.course_name}_Grade_Template.xlsx`);
//     setSuccess('Excel template downloaded successfully!');
    
//   } catch (error) {
//     console.error('Error creating Excel template:', error);
//     setError('Failed to create Excel template: ' + error.message);
//   }
// };

//   const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onload = (e) => {
//     try {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
      
//       // Try to find the correct sheet
//       let worksheet = null;
//       let sheetName = '';
      
//       if (workbook.SheetNames.includes('Grades Template')) {
//         sheetName = 'Grades Template';
//         worksheet = workbook.Sheets['Grades Template'];
//       } else if (workbook.SheetNames.includes('Sheet1')) {
//         sheetName = 'Sheet1';
//         worksheet = workbook.Sheets['Sheet1'];
//       } else {
//         sheetName = workbook.SheetNames[0];
//         worksheet = workbook.Sheets[sheetName];
//       }
      
//       console.log('Using sheet:', sheetName);
      
//       // Get the range of the worksheet
//       const range = XLSX.utils.decode_range(worksheet['!ref']);
//       console.log('Worksheet range:', range);
      
//       // Get headers from the first row
//       const headers = [];
//       for (let C = range.s.c; C <= range.e.c; ++C) {
//         const cellAddress = { c: C, r: range.s.r };
//         const cellRef = XLSX.utils.encode_cell(cellAddress);
//         const cell = worksheet[cellRef];
//         if (cell && cell.v) {
//           headers.push(cell.v.toString().trim());
//         }
//       }
//       console.log('Detected headers:', headers);
      
//       // Convert to JSON, skipping the header row
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, {
//         header: headers,
//         defval: '',
//         raw: false,
//         range: 1 // Skip the first row (headers)
//       });
      
//       console.log('Parsed Excel data (without headers):', jsonData);
//       console.log('First data row:', jsonData[0] || {});
      
//       // Validate that we have data rows
//       if (jsonData.length === 0) {
//         setError('No data found in the Excel file. Please make sure there are student records below the header row.');
//         return;
//       }
      
//       // Check if the required columns exist in the first data row
//       const firstRow = jsonData[0];
//       const requiredColumns = ['Student ID', ...gradeForm.components.map(c => c.name)];
//       const missingColumns = requiredColumns.filter(col => 
//         !Object.keys(firstRow).some(key => key.trim() === col.trim())
//       );
      
//       if (missingColumns.length > 0) {
//         setError(`Missing required columns: ${missingColumns.join(', ')}. Found columns: ${Object.keys(firstRow).join(', ')}`);
//         return;
//       }
      
//       setExcelData(jsonData);
//       setError(''); // Clear any previous errors
      
//     } catch (error) {
//       console.error('Error parsing Excel file:', error);
//       setError('Failed to parse Excel file. Please make sure it\'s a valid Excel file and contains the correct columns.');
//     }
//   };
//   reader.readAsArrayBuffer(file);
// };

// const uploadGrades = async () => {
//   if (!course || !excelData) {
//     setError('Please upload an Excel file first');
//     return;
//   }

//   try {
//     setUploading(true);
//     setError('');
//     const user = getUserData();

//     // Map Excel student IDs to actual student objects using username
//     const studentsMap = {};
//     students.forEach(st => {
//       const studentUsername = st.username || st.username_id;
//       if (studentUsername) {
//         studentsMap[studentUsername] = st;
//       }
//     });

//     console.log('Students map:', studentsMap);
//     console.log('Excel data sample:', excelData);
//     console.log('First data row:', excelData[0] || {});

//     const gradesPayload = [];
//     const issues = [];

//     for (const row of excelData) {
//       const studentUsername = row['Student ID'];
//       if (!studentUsername) {
//         issues.push(`Row missing Student ID: ${JSON.stringify(row)}`);
//         continue;
//       }

//       // Skip if this is a header row (contains column names as data)
//       if (studentUsername === 'Student ID') {
//         console.log('Skipping header row:', row);
//         continue;
//       }

//       if (!studentsMap[studentUsername]) {
//         issues.push(`Student not found: ${studentUsername}`);
//         continue;
//       }

//       const studentObj = studentsMap[studentUsername];

//       // Build grade components object
//       const gradeComponents = {};
//       let hasValidComponents = false;

//       gradeForm.components.forEach(component => {
//         const componentName = component.name;
//         const scoreValue = row[componentName];
        
//         console.log(`Processing ${studentUsername} - ${componentName}:`, scoreValue);

//         // Handle empty or missing scores
//         if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
//           issues.push(`Empty score for ${componentName} - student ${studentUsername}`);
//           return;
//         }

//         const numericScore = parseFloat(scoreValue);
//         if (isNaN(numericScore)) {
//           issues.push(`Invalid score '${scoreValue}' for ${componentName} - student ${studentUsername}`);
//           return;
//         }

//         gradeComponents[componentName] = {
//           score: numericScore,
//           max_score: parseFloat(component.max_score) || 100,
//           weight: parseFloat(component.weight) || 1.0
//         };
//         hasValidComponents = true;
//       });

//       if (hasValidComponents) {
//         // Use student ID instead of username
//         const studentId = studentObj.id || studentObj.user_id || studentObj.pk;
        
//         if (!studentId) {
//           issues.push(`No ID found for student: ${studentUsername}`);
//           return;
//         }

//         gradesPayload.push({
//           student: studentId, // Use ID instead of username
//           course: course.course_id,
//           teacher: user?.userId || user?.id,
//           grade_components: gradeComponents
//         });
//       }
//     }

//     // Log any issues found
//     if (issues.length > 0) {
//       console.warn('Processing issues:', issues);
//     }

//     if (gradesPayload.length === 0) {
//       const errorMsg = issues.length > 0 
//         ? `Issues found: ${issues.slice(0, 3).join('; ')}${issues.length > 3 ? '...' : ''}`
//         : 'No valid grade data found. Please check the Excel file format.';
//       setError(errorMsg);
//       setUploading(false);
//       return;
//     }

//     console.log('Final grades payload for API:', gradesPayload);

//     // Test with single creation first to debug
//     if (gradesPayload.length > 0) {
//       console.log('Testing with first student:', gradesPayload[0]);
      
//       try {
//         const testResponse = await api.post('grades/dynamic-grades/', gradesPayload[0]);
//         console.log('Single grade test successful:', testResponse.data);
//       } catch (singleError) {
//         console.error('Single grade test failed:', singleError.response?.data);
//         throw new Error(`Single grade test failed: ${JSON.stringify(singleError.response?.data)}`);
//       }
//     }

//     // If single test passes, try bulk upload
//     const response = await api.post('grades/dynamic-grades/bulk_create/', {
//       grades: gradesPayload
//     });

//     setSuccess(`✅ Grades uploaded successfully for ${gradesPayload.length} students!`);
//     if (issues.length > 0) {
//       setSuccess(prev => prev + ` (${issues.length} issues were ignored)`);
//     }
//     setExcelData(null);
    
//   } catch (error) {
//     console.error('Error uploading grades:', error);
    
//     let errorMessage = 'Failed to upload grades';
//     if (error.response?.data) {
//       if (error.response.data.grades) {
//         // Handle bulk create errors
//         errorMessage = `Bulk create error: ${JSON.stringify(error.response.data.grades)}`;
//       } else if (error.response.data.student) {
//         errorMessage = `Student field error: ${error.response.data.student}`;
//       } else {
//         errorMessage = `Server error: ${JSON.stringify(error.response.data)}`;
//       }
//     } else if (error.message) {
//       errorMessage = error.message;
//     }
    
//     setError(errorMessage);
//   } finally {
//     setUploading(false);
//   }
// };


//   // Show loading if course is not available yet
//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading students...</p>
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
//           <p className="text-sm text-gray-500">Total Students: {students.length}</p>
//           <button 
//             onClick={fetchStudents}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//           >
//             Refresh Students
//           </button>
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
//           <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
//           <p className="text-yellow-700 text-sm">
//             Course Department ID: {course.department_id}, Year: {course.course_taken_year}, Semester: {course.course_taken_semester}
//           </p>
//           <p className="text-yellow-700 text-sm">
//             Found {students.length} students matching these criteria.
//           </p>
//           <button 
//             onClick={() => console.log('API Response:', apiResponse, 'Students:', students)}
//             className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs"
//           >
//             View Debug Data in Console
//           </button>
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
                  
//                   <div className="flex space-x-4">
//                     <button
//                       onClick={createGradeForm}
//                       disabled={!gradeForm.title || gradeForm.components.length === 0}
//                       className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Create Grade Form 
//                     </button>
                    
//                     <button
//                       onClick={createSimpleGradeForm}
//                       disabled={!gradeForm.title}
//                       className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Create Form Only (No Components)
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Download Template Tab */}
//            {/* Download Template Tab */}
// {activeTab === 'download' && (
//   <div>
//     <h2 className="text-lg font-semibold mb-4">Download Excel Template</h2>
//     <p className="text-gray-600 mb-4">
//       Download an Excel template with all students and the grade components you created.
//       Fill in the grades and upload the file in the next step.
//     </p>
    
//     {/* Show what columns will be included */}
//     {gradeForm.components.length > 0 && (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//         <h4 className="font-semibold text-blue-800 mb-1">Template will include columns:</h4>
//         <div className="text-sm text-blue-700">
//           <span className="font-mono">Student ID, Full Name, </span>
//           {gradeForm.components.map((comp, index) => (
//             <span key={index} className="font-mono">
//               {comp.name}
//               {index < gradeForm.components.length - 1 ? ', ' : ''}
//             </span>
//           ))}
//         </div>
//       </div>
//     )}
    
//     <button
//       onClick={downloadExcelTemplate}
//       disabled={students.length === 0 || gradeForm.components.length === 0}
//       className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
//     >
//       Download Excel Template
//     </button>
    
//     {students.length === 0 && (
//       <p className="text-red-500 mt-2">No students available to create a template.</p>
//     )}
//     {gradeForm.components.length === 0 && (
//       <p className="text-red-500 mt-2">No grade components defined. Please create components first.</p>
//     )}
//   </div>
//    ) }

//             {/* Upload Grades Tab */}
// {activeTab === 'upload' && (
//   <div>
//     <h2 className="text-lg font-semibold mb-4">Upload Grades</h2>
    
//     {/* Debug Info */}
//     {excelData && (
//       <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//         <h4 className="font-semibold text-blue-800 mb-2">File Analysis:</h4>
//         <div className="text-sm text-blue-700">
//           <p>Columns detected: {Object.keys(excelData[0] || {}).join(', ')}</p>
//           <p>Expected components: {gradeForm.components.map(c => c.name).join(', ')}</p>
//           <p>First row sample: {JSON.stringify(excelData[0])}</p>
//         </div>
//       </div>
//     )}
    
//     <div className="mb-6">
//       <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
//       <input
//         type="file"
//         accept=".xlsx,.xls"
//         onChange={handleFileUpload}
//         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//     </div>
                
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
//             <span className="text-sm text-gray-500">{students.length} students</span>
//           </div>
//           {students.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p>No students found for this course.</p>
//               <p className="mt-2 text-sm">Course criteria: Department ID {course.department_id}, Year {course.course_taken_year}, Semester {course.course_taken_semester}</p>
//               <button 
//                 onClick={() => console.log('API Response:', apiResponse)}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//               >
//                 Check API Response in Console
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
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student, index) => (
//                     <tr key={student.username || student.username_id || index}>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.username || student.username_id}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {`${student.user_details?.firstName || student.firstName || student.first_name || ''} ${student.user_details?.fatherName || student.fatherName || student.father_name || ''}`.trim()}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.department_id || student.department?.name || ''}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.year || student.user_details?.year || student.academic_year || student.current_year || ''}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || ''}
//                       </td>
//                     </tr>
//                   ))}
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
//   const [loading, setLoading] = useState(true);
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
//     if (!course) return;
    
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
        
//         // Get student ID for uniqueness check
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

//   // Helper function to get student ID (primary key)
//   const getStudentId = (student) => {
//     // Try different possible ID field locations
//     if (student.id) {
//       return student.id; // Direct ID field
//     }
//     if (student.pk) {
//       return student.pk; // Primary key field
//     }
//     if (student.user_details?.id) {
//       return student.user_details.id; // ID in user_details
//     }
//     return null;
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
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = component.name;
//             return acc;
//           }, {})
//         },
//         // Data rows with example values
//         ...students.map(student => ({
//           'Student ID': student.username || student.username_id,
//           'Full Name': getStudentFullName(student),
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = ''; // Empty cell for user to fill
//             return acc;
//           }, {})
//         }))
//       ];

//       const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
//       XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

//       // Create an instructions sheet
//       const instructionsData = [
//         ['IMPORTANT INSTRUCTIONS:'],
//         ['1. Fill in the grades in the "Grades Template" sheet'],
//         ['2. Do not modify the "Student ID" column'],
//         ['3. Enter numeric scores for each student'],
//         ['4. Save the file after filling all grades'],
//         ['5. Upload the completed file in the Upload Grades tab'],
//         [''],
//         ['Example:'],
//         ['Student ID', 'Full Name', 'grade'],
//         ['bereket-583780', 'Bereket Mamo', '85'],
//         ['bedilu-212024', 'Bedilu Belete', '90']
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
//     if (!course || !excelData) {
//       setError('Please upload an Excel file first');
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');
//       const user = getUserData();

//       // Map Excel student IDs to actual student objects using username
//       const studentsMap = {};
//       students.forEach(st => {
//         const studentUsername = st.username || st.username_id;
//         if (studentUsername) {
//           studentsMap[studentUsername] = st;
//         }
//       });

//       console.log('Students map:', studentsMap);
//       console.log('Excel data sample:', excelData);
//       console.log('First data row:', excelData[0] || {});

//       const gradesPayload = [];
//       const issues = [];

//       for (const row of excelData) {
//         const studentUsername = row['Student ID'];
//         if (!studentUsername) {
//           issues.push(`Row missing Student ID: ${JSON.stringify(row)}`);
//           continue;
//         }

//         // Skip if this is a header row (contains column names as data)
//         if (studentUsername === 'Student ID') {
//           console.log('Skipping header row:', row);
//           continue;
//         }

//         if (!studentsMap[studentUsername]) {
//           issues.push(`Student not found: ${studentUsername}`);
//           continue;
//         }

//         const studentObj = studentsMap[studentUsername];

//         // Build grade components object
//         const gradeComponents = {};
//         let hasValidComponents = false;

//         gradeForm.components.forEach(component => {
//           const componentName = component.name;
//           const scoreValue = row[componentName];
          
//           console.log(`Processing ${studentUsername} - ${componentName}:`, scoreValue);

//           // Handle empty or missing scores
//           if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
//             issues.push(`Empty score for ${componentName} - student ${studentUsername}`);
//             return;
//           }

//           const numericScore = parseFloat(scoreValue);
//           if (isNaN(numericScore)) {
//             issues.push(`Invalid score '${scoreValue}' for ${componentName} - student ${studentUsername}`);
//             return;
//           }

//           gradeComponents[componentName] = {
//             score: numericScore,
//             max_score: parseFloat(component.max_score) || 100,
//             weight: parseFloat(component.weight) || 1.0
//           };
//           hasValidComponents = true;
//         });

//         if (hasValidComponents) {
//           // Use student ID instead of username
//           const studentId = getStudentId(studentObj);
          
//           if (!studentId) {
//             issues.push(`No ID found for student: ${studentUsername}. Please ensure the student API returns the primary key ID.`);
//             continue;
//           }

//           gradesPayload.push({
//             student: studentId, // Use ID instead of username
//             course: course.course_id,
//             teacher: user?.userId || user?.id,
//             grade_components: gradeComponents
//           });
//         }
//       }

//       // Log any issues found
//       if (issues.length > 0) {
//         console.warn('Processing issues:', issues);
//       }

//       if (gradesPayload.length === 0) {
//         const errorMsg = issues.length > 0 
//           ? `Issues found: ${issues.slice(0, 3).join('; ')}${issues.length > 3 ? '...' : ''}`
//           : 'No valid grade data found. Please check the Excel file format.';
//         setError(errorMsg);
//         setUploading(false);
//         return;
//       }

//       console.log('Final grades payload for API:', gradesPayload);

//       // Test with single creation first to debug
//       if (gradesPayload.length > 0) {
//         console.log('Testing with first student:', gradesPayload[0]);
        
//         try {
//           const testResponse = await api.post('grades/dynamic-grades/', gradesPayload[0]);
//           console.log('Single grade test successful:', testResponse.data);
//         } catch (singleError) {
//           console.error('Single grade test failed:', singleError.response?.data);
//           throw new Error(`Single grade test failed: ${JSON.stringify(singleError.response?.data)}`);
//         }
//       }

//       // If single test passes, try bulk upload
//       const response = await api.post('grades/dynamic-grades/bulk_create/', {
//         grades: gradesPayload
//       });

//       setSuccess(`✅ Grades uploaded successfully for ${gradesPayload.length} students!`);
//       if (issues.length > 0) {
//         setSuccess(prev => prev + ` (${issues.length} issues were ignored)`);
//       }
//       setExcelData(null);
      
//     } catch (error) {
//       console.error('Error uploading grades:', error);
      
//       let errorMessage = 'Failed to upload grades';
//       if (error.response?.data) {
//         if (error.response.data.grades) {
//           // Handle bulk create errors
//           errorMessage = `Bulk create error: ${JSON.stringify(error.response.data.grades)}`;
//         } else if (error.response.data.student) {
//           errorMessage = `Student field error: ${JSON.stringify(error.response.data.student)}`;
//         } else {
//           errorMessage = `Server error: ${JSON.stringify(error.response.data)}`;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Show loading if course is not available yet
//   if (!course) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading course information...</p>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading students...</p>
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
//           <p className="text-sm text-gray-500">Total Students: {students.length}</p>
//           <button 
//             onClick={fetchStudents}
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//           >
//             Refresh Students
//           </button>
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
//           <h3 className="font-semibold text-yellow-800 mb-2">Debug Information:</h3>
//           <p className="text-yellow-700 text-sm">
//             Course Department ID: {course.department_id}, Year: {course.course_taken_year}, Semester: {course.course_taken_semester}
//           </p>
//           <p className="text-yellow-700 text-sm">
//             Found {students.length} students matching these criteria.
//           </p>
//           <button 
//             onClick={() => console.log('API Response:', apiResponse, 'Students:', students)}
//             className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-xs"
//           >
//             View Debug Data in Console
//           </button>
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
//                   Fill in the grades and upload the file in the next step.
//                 </p>
                
//                 {/* Show what columns will be included */}
//                 {gradeForm.components.length > 0 && (
//                   <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//                     <h4 className="font-semibold text-blue-800 mb-1">Template will include columns:</h4>
//                     <div className="text-sm text-blue-700">
//                       <span className="font-mono">Student ID, Full Name, </span>
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
//             <span className="text-sm text-gray-500">{students.length} students</span>
//           </div>
//           {students.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p>No students found for this course.</p>
//               <p className="mt-2 text-sm">Course criteria: Department ID {course.department_id}, Year {course.course_taken_year}, Semester {course.course_taken_semester}</p>
//               <button 
//                 onClick={() => console.log('API Response:', apiResponse)}
//                 className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//               >
//                 Check API Response in Console
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
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {students.map((student, index) => (
//                     <tr key={student.username || student.username_id || index}>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.username || student.username_id}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {getStudentFullName(student)}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.department_id || student.department?.name || ''}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.year || student.user_details?.year || student.academic_year || student.current_year || ''}
//                       </td>
//                       <td className="px-4 py-2 border-b border-gray-200 text-sm">
//                         {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || ''}
//                       </td>
//                     </tr>
//                   ))}
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
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [activeTab, setActiveTab] = useState('create');
//   const [gradeForm, setGradeForm] = useState({
//     title: '',
//     components: []
//   });
//   const [excelData, setExcelData] = useState(null);
//   const [uploading, setUploading] = useState(false);

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
//     if (!course) return;
    
//     try {
//       setLoading(true);
//       setError('');
      
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
//         description: ''
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
//       setActiveTab('download');
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

//   const downloadExcelTemplate = async () => {
//     if (!course) return;
    
//     try {
//       const workbook = XLSX.utils.book_new();
      
//       const gradeTemplateData = [
//         {
//           'Student ID': 'Student ID',
//           'Full Name': 'Full Name',
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = component.name;
//             return acc;
//           }, {})
//         },
//         ...students.map(student => ({
//           'Student ID': student.username || student.username_id,
//           'Full Name': getStudentFullName(student),
//           ...gradeForm.components.reduce((acc, component) => {
//             acc[component.name] = '';
//             return acc;
//           }, {})
//         }))
//       ];

//       const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
//       XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

//       const instructionsData = [
//         ['IMPORTANT INSTRUCTIONS:'],
//         ['1. Fill in the grades in the "Grades Template" sheet'],
//         ['2. Do not modify the "Student ID" column'],
//         ['3. Enter numeric scores for each student'],
//         ['4. Save the file after filling all grades'],
//         ['5. Upload the completed file in the Upload Grades tab'],
//         [''],
//         ['Example:'],
//         ['Student ID', 'Full Name', 'grade'],
//         ['bereket-583780', 'Bereket Mamo', '85'],
//         ['bedilu-212024', 'Bedilu Belete', '90']
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
//     if (!course || !excelData) {
//       setError('Please upload an Excel file first');
//       return;
//     }

//     try {
//       setUploading(true);
//       setError('');
//       const user = getUserData();

//       const studentsMap = {};
//       students.forEach(st => {
//         const studentUsername = st.username || st.username_id;
//         if (studentUsername) {
//           studentsMap[studentUsername] = st;
//         }
//       });

//       const gradesPayload = [];
//       const issues = [];

//       for (const row of excelData) {
//         const studentUsername = row['Student ID'];
//         if (!studentUsername) {
//           issues.push(`Row missing Student ID: ${JSON.stringify(row)}`);
//           continue;
//         }

//         if (studentUsername === 'Student ID') {
//           continue;
//         }

//         if (!studentsMap[studentUsername]) {
//           issues.push(`Student not found: ${studentUsername}`);
//           continue;
//         }

//         const studentObj = studentsMap[studentUsername];

//         const gradeComponents = {};
//         let hasValidComponents = false;

//         const excelColumns = Object.keys(row).filter(key => 
//           key !== 'Student ID' && 
//           key !== 'Full Name' && 
//           key !== '__rowNum__'
//         );

//         if (gradeForm.components.length === 0) {
//           for (const columnName of excelColumns) {
//             const scoreValue = row[columnName];
            
//             if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
//               issues.push(`Empty score for ${columnName} - student ${studentUsername}`);
//               continue;
//             }

//             const numericScore = parseFloat(scoreValue);
//             if (isNaN(numericScore)) {
//               issues.push(`Invalid score '${scoreValue}' for ${columnName} - student ${studentUsername}`);
//               continue;
//             }

//             gradeComponents[columnName] = {
//               score: numericScore,
//               max_score: 100,
//               weight: 1.0
//             };
//             hasValidComponents = true;
//           }
//         } else {
//           gradeForm.components.forEach(component => {
//             const componentName = component.name;
            
//             let scoreValue = row[componentName];
//             if (scoreValue === undefined) {
//               const matchingKey = Object.keys(row).find(key => 
//                 key.toLowerCase() === componentName.toLowerCase()
//               );
//               if (matchingKey) {
//                 scoreValue = row[matchingKey];
//               }
//             }
            
//             if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
//               issues.push(`Empty score for ${componentName} - student ${studentUsername}`);
//               return;
//             }

//             const numericScore = parseFloat(scoreValue);
//             if (isNaN(numericScore)) {
//               issues.push(`Invalid score '${scoreValue}' for ${componentName} - student ${studentUsername}`);
//               return;
//             }

//             gradeComponents[componentName] = {
//               score: numericScore,
//               max_score: parseFloat(component.max_score) || 100,
//               weight: parseFloat(component.weight) || 1.0
//             };
//             hasValidComponents = true;
//           });
//         }

//         if (hasValidComponents) {
//           const studentId = getStudentId(studentObj);
          
//           if (!studentId) {
//             issues.push(`No ID found for student: ${studentUsername}`);
//             continue;
//           }

//           gradesPayload.push({
//             student: studentId,
//             course: course.course_id,
//             teacher: user?.userId || user?.id,
//             grade_components: gradeComponents
//           });
//         } else {
//           issues.push(`No valid grade components found for student: ${studentUsername}`);
//         }
//       }

//       if (issues.length > 0) {
//         const displayIssues = issues.slice(0, 1000);
//         setError(`Some issues found: ${displayIssues.join('; ')}${issues.length > 1000 ? `... and ${issues.length - 1000} more` : ''}`);
//       }

//       if (gradesPayload.length === 0) {
//         setError('No valid grade data found. Please check your Excel file and try again.');
//         setUploading(false);
//         return;
//       }

//       let successCount = 0;
//       let updateCount = 0;
//       let errorCount = 0;

//       for (const gradeData of gradesPayload) {
//         try {
//           const response = await api.post('grades/dynamic-grades/', gradeData);
//           successCount++;
//         } catch (error) {
//           if (error.response?.status === 400 && 
//               error.response.data.non_field_errors && 
//               error.response.data.non_field_errors[0].includes('unique')) {
            
//             try {
//               const searchResponse = await api.get('grades/dynamic-grades/', {
//                 params: {
//                   student: gradeData.student,
//                   course: gradeData.course
//                 }
//               });
              
//               if (searchResponse.data && searchResponse.data.length > 0) {
//                 const existingGrade = searchResponse.data[0];
//                 const gradeId = existingGrade.id || existingGrade.grade_id;
                
//                 await api.patch(`grades/dynamic-grades/${gradeId}/`, {
//                   grade_components: gradeData.grade_components,
//                   teacher: gradeData.teacher
//                 });
                
//                 updateCount++;
//               } else {
//                 errorCount++;
//               }
//             } catch (updateError) {
//               errorCount++;
//             }
//           } else {
//             errorCount++;
//           }
//         }
//       }

//       if (successCount > 0 || updateCount > 0) {
//         let message = '✅ ';
//         if (successCount > 0) {
//           message += `Created grades for ${successCount} students. `;
//         }
//         if (updateCount > 0) {
//           message += `Updated grades for ${updateCount} students. `;
//         }
//         if (errorCount > 0) {
//           message += `Failed for ${errorCount} students. `;
//         }
        
//         setSuccess(message);
//         setExcelData(null);
//       } else {
//         setError(`All grade operations failed. Please try again.`);
//       }
      
//     } catch (error) {
//       console.error('Error uploading grades:', error);
      
//       let errorMessage = 'Failed to upload grades';
//       if (error.response?.data) {
//         if (error.response.data.grades) {
//           errorMessage = `Bulk create error: ${JSON.stringify(error.response.data.grades)}`;
//         } else if (error.response.data.student) {
//           errorMessage = `Student field error: ${JSON.stringify(error.response.data.student)}`;
//         } else if (error.response.data.grade_components) {
//           errorMessage = `Grade components error: ${JSON.stringify(error.response.data.grade_components)}`;
//         } else {
//           errorMessage = `Server error: ${JSON.stringify(error.response.data)}`;
//         }
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

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
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
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
//             <button 
//               onClick={fetchStudents}
//               className="mt-4 lg:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
//             >
//               Refresh Students
//             </button>
//           </div>
//         </div>

//         {/* Error/Success Messages */}
//         {error && (
//           <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
//                 <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <div className="ml-3 flex-1">
//                 <p className="text-green-800 font-medium">{success}</p>
//               </div>
//               <button 
//                 onClick={() => setSuccess('')}
//                 className="ml-4 text-green-400 hover:text-green-600 transition-colors"
//               >
//                 <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
//             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">Grade Management</h2>
//               <nav className="space-y-2">
//                 {[
//                   { id: 'create', label: 'Create Grade Form', icon: '📝' },
//                   { id: 'download', label: 'Download Template', icon: '📥' },
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
//             <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//               {/* Create Grade Form Tab */}
//               {activeTab === 'create' && (
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
//                       <p className="text-xs text-gray-500 mt-2">A unique timestamp will be automatically added</p>
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
//               )}

//               {/* Download Template Tab */}
//               {activeTab === 'download' && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-green-100 rounded-lg">
//                       <span className="text-2xl">📥</span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">Download Excel Template</h2>
//                       <p className="text-gray-600">Get a pre-formatted Excel template for grade entry</p>
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     {gradeForm.components.length > 0 && (
//                       <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
//                         <h4 className="font-semibold text-blue-800 mb-3">Template Structure</h4>
//                         <div className="bg-white rounded-xl p-4 border border-blue-100">
//                           <div className="text-sm text-blue-700 font-mono">
//                             <div className="flex flex-wrap gap-2">
//                               <span className="bg-blue-100 px-3 py-1 rounded-lg">Student ID</span>
//                               <span className="bg-blue-100 px-3 py-1 rounded-lg">Full Name</span>
//                               {gradeForm.components.map((comp, index) => (
//                                 <span key={index} className="bg-green-100 px-3 py-1 rounded-lg">
//                                   {comp.name}
//                                 </span>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}
                    
//                     <button
//                       onClick={downloadExcelTemplate}
//                       disabled={students.length === 0 || gradeForm.components.length === 0}
//                       className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
//                     >
//                       <span>📥</span>
//                       Download Excel Template
//                     </button>
                    
//                     {students.length === 0 && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
//                         <p className="text-yellow-800 text-center">No students available to create a template</p>
//                       </div>
//                     )}
//                     {gradeForm.components.length === 0 && (
//                       <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
//                         <p className="text-yellow-800 text-center">No grade components defined. Please create components first.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Upload Grades Tab */}
//               {activeTab === 'upload' && (
//                 <div>
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-2 bg-purple-100 rounded-lg">
//                       <span className="text-2xl">📤</span>
//                     </div>
//                     <div>
//                       <h2 className="text-2xl font-bold text-gray-900">Upload Grades</h2>
//                       <p className="text-gray-600">Upload completed Excel template with student grades</p>
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
//                       <div className="text-4xl mb-4">📄</div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Upload Excel File
//                       </label>
//                       <input
//                         type="file"
//                         accept=".xlsx,.xls"
//                         onChange={handleFileUpload}
//                         className="w-full max-w-md mx-auto px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                       />
//                       <p className="text-gray-500 text-sm mt-2">Supported formats: .xlsx, .xls</p>
//                     </div>
                    
//                     {excelData && (
//                       <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
//                         <h3 className="font-semibold text-gray-900 mb-4">File Preview (First 3 rows)</h3>
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
                    
//                     <button
//                       onClick={uploadGrades}
//                       disabled={!excelData || uploading}
//                       className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
//                     >
//                       {uploading ? (
//                         <>
//                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                           Uploading...
//                         </>
//                       ) : (
//                         <>
//                           <span>📤</span>
//                           Upload Grades
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Students List */}
//         <div className="mt-8 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
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
//           </div>
          
//           {students.length === 0 ? (
//             <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50">
//               <div className="text-4xl mb-4">🎓</div>
//               <p className="text-gray-500 text-lg">No students found for this course</p>
//               <p className="text-gray-400 text-sm mt-2">Course criteria: Year {course.course_taken_year}, Semester {course.course_taken_semester}</p>
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
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Year
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Semester
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {students.map((student, index) => (
//                     <tr key={student.username || student.username_id || index} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {student.username || student.username_id}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 font-medium">
//                           {getStudentFullName(student)}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
//                           {student.year || student.user_details?.year || student.academic_year || student.current_year || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                           {student.semester || student.user_details?.semester || student.academic_semester || student.current_semester || 'N/A'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
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



// components/GradeInsertionPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { 
  FaArrowLeft, FaDownload, FaUpload, FaPlus, FaTrash, 
  FaSave, FaFileExcel, FaUsers, FaBook, FaIdCard, 
  FaGraduationCap, FaCalendarAlt, FaUniversity, FaCheckCircle,
  FaExclamationCircle, FaSpinner, FaTable, FaEye, FaEyeSlash,
  FaClipboardList, FaFileAlt, FaInfoCircle, FaBookOpen
} from 'react-icons/fa';

const GradeInsertionPage = ({ course, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [gradeForm, setGradeForm] = useState({
    title: '',
    components: []
  });
  const [excelData, setExcelData] = useState(null);
  const [uploading, setUploading] = useState(false);
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
    if (!course) return;
    
    try {
      setLoading(true);
      setError('');
      
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

  const addGradeComponent = () => {
    setGradeForm({
      ...gradeForm,
      components: [
        ...gradeForm.components,
        { name: '', max_score: 0, weight: 0 }
      ]
    });
  };

  const updateGradeComponent = (index, field, value) => {
    const updatedComponents = [...gradeForm.components];
    
    if (field === 'name') {
      updatedComponents[index][field] = value;
    } else {
      const numericValue = value === '' ? 0 : parseFloat(value);
      updatedComponents[index][field] = isNaN(numericValue) ? 0 : numericValue;
    }
    
    setGradeForm({
      ...gradeForm,
      components: updatedComponents
    });
  };

  const removeGradeComponent = (index) => {
    const updatedComponents = gradeForm.components.filter((_, i) => i !== index);
    setGradeForm({
      ...gradeForm,
      components: updatedComponents
    });
  };

  const createGradeForm = async () => {
    if (!course) return;
    
    try {
      const user = getUserData();
      
      if (!gradeForm.title.trim()) {
        setError('Form title is required');
        return;
      }
      
      if (gradeForm.components.length === 0) {
        setError('At least one grade component is required');
        return;
      }
      
      for (const component of gradeForm.components) {
        if (!component.name.trim()) {
          setError('All grade components must have a name');
          return;
        }
        if (component.max_score <= 0) {
          setError('Max score must be greater than 0');
          return;
        }
        if (component.weight >= 100) {
          setError('Weight must be less than 100%');
          return;
        }
      }

      const timestamp = new Date().getTime();
      const uniqueTitle = `${gradeForm.title} - ${timestamp}`;
      
      const formPayload = {
        course: course.course_id,
        teacher: user.userId,
        batch: `${course.course_taken_year}-${course.course_taken_semester}`,
        title: uniqueTitle,
        description: ''
      };

      const formResponse = await api.post('grades/grade-form-templates/', formPayload);
      const formTemplate = formResponse.data;
      
      if (!formTemplate) {
        throw new Error('Failed to create form template: Empty response');
      }

      let formTemplateId = null;
      
      if (formTemplate.id !== undefined) {
        formTemplateId = formTemplate.id;
      } else if (formTemplate.pk !== undefined) {
        formTemplateId = formTemplate.pk;
      } else if (formTemplate.form_id !== undefined) {
        formTemplateId = formTemplate.form_id;
      } else if (formResponse.headers && formResponse.headers.location) {
        const location = formResponse.headers.location;
        const idMatch = location.match(/\/(\d+)\/$/) || location.match(/\/([a-f0-9-]+)\/$/);
        if (idMatch && idMatch[1]) {
          formTemplateId = idMatch[1];
        }
      }
      
      if (!formTemplateId) {
        try {
          const searchResponse = await api.get('grades/grade-form-templates/', {
            params: {
              course: course.course_id,
              title: uniqueTitle
            }
          });
          
          if (searchResponse.data && searchResponse.data.length > 0) {
            const foundTemplate = searchResponse.data[0];
            formTemplateId = foundTemplate.id || foundTemplate.pk;
          }
        } catch (searchError) {
          console.error('Error searching for form template:', searchError);
        }
      }
      
      if (!formTemplateId) {
        throw new Error('Failed to create form template: No ID returned in response');
      }

      for (const [index, component] of gradeForm.components.entries()) {
        const componentPayload = {
          form_template: formTemplateId,
          name: component.name,
          max_score: component.max_score,
          weight: Math.min(component.weight, 99.99),
          field_type: 'number',
          required: true,
          order: index
        };
        
        await api.post('grades/grade-components/', componentPayload);
      }

      setSuccess('Grade form created successfully!');
      setActiveTab('download');
    } catch (error) {
      console.error('Error creating grade form:', error);
      
      let errorMessage = 'Failed to create grade form';
      
      if (error.response?.data) {
        if (error.response.data.form_template) {
          errorMessage = 'Failed to create form template. Please check if the form template was created successfully.';
        }
        else if (error.response.data.non_field_errors && error.response.data.non_field_errors[0].includes('unique')) {
          errorMessage = 'A grade form with this title already exists for this course. Please use a different title.';
        } 
        else if (error.response.data.weight) {
          errorMessage = 'Weight must be less than 100 and have no more than 2 decimal places.';
        }
        else {
          errorMessage = Object.values(error.response.data).flat().join(', ');
        }
      } else {
        errorMessage = error.message || 'Failed to create grade form';
      }
      
      setError(errorMessage);
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

  const downloadExcelTemplate = async () => {
    if (!course) return;
    
    try {
      const workbook = XLSX.utils.book_new();
      
      const gradeTemplateData = [
        {
          'Student ID': 'Student ID',
          'Full Name': 'Full Name',
          ...gradeForm.components.reduce((acc, component) => {
            acc[component.name] = component.name;
            return acc;
          }, {})
        },
        ...students.map(student => ({
          'Student ID': student.username || student.username_id,
          'Full Name': getStudentFullName(student),
          ...gradeForm.components.reduce((acc, component) => {
            acc[component.name] = '';
            return acc;
          }, {})
        }))
      ];

      const gradeWs = XLSX.utils.json_to_sheet(gradeTemplateData, { skipHeader: true });
      XLSX.utils.book_append_sheet(workbook, gradeWs, 'Grades Template');

      const instructionsData = [
        ['IMPORTANT INSTRUCTIONS:'],
        ['1. Fill in the grades in the "Grades Template" sheet'],
        ['2. Do not modify the "Student ID" column'],
        ['3. Enter numeric scores for each student'],
        ['4. Save the file after filling all grades'],
        ['5. Upload the completed file in the Upload Grades tab'],
        [''],
        ['Example:'],
        ['Student ID', 'Full Name', 'grade'],
        ['bereket-583780', 'Bereket Mamo', '85'],
        ['bedilu-212024', 'Bedilu Belete', '90']
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
    if (!course || !excelData) {
      setError('Please upload an Excel file first');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const user = getUserData();

      const studentsMap = {};
      students.forEach(st => {
        const studentUsername = st.username || st.username_id;
        if (studentUsername) {
          studentsMap[studentUsername] = st;
        }
      });

      const gradesPayload = [];
      const issues = [];

      for (const row of excelData) {
        const studentUsername = row['Student ID'];
        if (!studentUsername) {
          issues.push(`Row missing Student ID: ${JSON.stringify(row)}`);
          continue;
        }

        if (studentUsername === 'Student ID') {
          continue;
        }

        if (!studentsMap[studentUsername]) {
          issues.push(`Student not found: ${studentUsername}`);
          continue;
        }

        const studentObj = studentsMap[studentUsername];

        const gradeComponents = {};
        let hasValidComponents = false;

        const excelColumns = Object.keys(row).filter(key => 
          key !== 'Student ID' && 
          key !== 'Full Name' && 
          key !== '__rowNum__'
        );

        if (gradeForm.components.length === 0) {
          for (const columnName of excelColumns) {
            const scoreValue = row[columnName];
            
            if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
              issues.push(`Empty score for ${columnName} - student ${studentUsername}`);
              continue;
            }

            const numericScore = parseFloat(scoreValue);
            if (isNaN(numericScore)) {
              issues.push(`Invalid score '${scoreValue}' for ${columnName} - student ${studentUsername}`);
              continue;
            }

            gradeComponents[columnName] = {
              score: numericScore,
              max_score: 100,
              weight: 1.0
            };
            hasValidComponents = true;
          }
        } else {
          gradeForm.components.forEach(component => {
            const componentName = component.name;
            
            let scoreValue = row[componentName];
            if (scoreValue === undefined) {
              const matchingKey = Object.keys(row).find(key => 
                key.toLowerCase() === componentName.toLowerCase()
              );
              if (matchingKey) {
                scoreValue = row[matchingKey];
              }
            }
            
            if (scoreValue === '' || scoreValue === null || scoreValue === undefined) {
              issues.push(`Empty score for ${componentName} - student ${studentUsername}`);
              return;
            }

            const numericScore = parseFloat(scoreValue);
            if (isNaN(numericScore)) {
              issues.push(`Invalid score '${scoreValue}' for ${componentName} - student ${studentUsername}`);
              return;
            }

            gradeComponents[componentName] = {
              score: numericScore,
              max_score: parseFloat(component.max_score) || 100,
              weight: parseFloat(component.weight) || 1.0
            };
            hasValidComponents = true;
          });
        }

        if (hasValidComponents) {
          const studentId = getStudentId(studentObj);
          
          if (!studentId) {
            issues.push(`No ID found for student: ${studentUsername}`);
            continue;
          }

          gradesPayload.push({
            student: studentId,
            course: course.course_id,
            teacher: user?.userId || user?.id,
            grade_components: gradeComponents
          });
        } else {
          issues.push(`No valid grade components found for student: ${studentUsername}`);
        }
      }

      if (issues.length > 0) {
        const displayIssues = issues.slice(0, 1000);
        setError(`Some issues found: ${displayIssues.join('; ')}${issues.length > 1000 ? `... and ${issues.length - 1000} more` : ''}`);
      }

      if (gradesPayload.length === 0) {
        setError('No valid grade data found. Please check your Excel file and try again.');
        setUploading(false);
        return;
      }

      let successCount = 0;
      let updateCount = 0;
      let errorCount = 0;

      for (const gradeData of gradesPayload) {
        try {
          const response = await api.post('grades/dynamic-grades/', gradeData);
          successCount++;
        } catch (error) {
          if (error.response?.status === 400 && 
              error.response.data.non_field_errors && 
              error.response.data.non_field_errors[0].includes('unique')) {
            
            try {
              const searchResponse = await api.get('grades/dynamic-grades/', {
                params: {
                  student: gradeData.student,
                  course: gradeData.course
                }
              });
              
              if (searchResponse.data && searchResponse.data.length > 0) {
                const existingGrade = searchResponse.data[0];
                const gradeId = existingGrade.id || existingGrade.grade_id;
                
                await api.patch(`grades/dynamic-grades/${gradeId}/`, {
                  grade_components: gradeData.grade_components,
                  teacher: gradeData.teacher
                });
                
                updateCount++;
              } else {
                errorCount++;
              }
            } catch (updateError) {
              errorCount++;
            }
          } else {
            errorCount++;
          }
        }
      }

      if (successCount > 0 || updateCount > 0) {
        let message = '';
        if (successCount > 0) {
          message += `Created grades for ${successCount} students. `;
        }
        if (updateCount > 0) {
          message += `Updated grades for ${updateCount} students. `;
        }
        if (errorCount > 0) {
          message += `Failed for ${errorCount} students. `;
        }
        
        setSuccess(message);
        setExcelData(null);
      } else {
        setError(`All grade operations failed. Please try again.`);
      }
      
    } catch (error) {
      console.error('Error uploading grades:', error);
      
      let errorMessage = 'Failed to upload grades';
      if (error.response?.data) {
        if (error.response.data.grades) {
          errorMessage = `Bulk create error: ${JSON.stringify(error.response.data.grades)}`;
        } else if (error.response.data.student) {
          errorMessage = `Student field error: ${JSON.stringify(error.response.data.student)}`;
        } else if (error.response.data.grade_components) {
          errorMessage = `Grade components error: ${JSON.stringify(error.response.data.grade_components)}`;
        } else {
          errorMessage = `Server error: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

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
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200">
          <FaCheckCircle className="flex-shrink-0 text-lg" />
          <span>{success}</span>
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
              {[
                { id: 'create', label: 'Create Grade Form', icon: <FaFileAlt className="text-sm" />, color: 'blue' },
                { id: 'download', label: 'Download Template', icon: <FaDownload className="text-sm" />, color: 'green' },
                { id: 'upload', label: 'Upload Grades', icon: <FaUpload className="text-sm" />, color: 'purple' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-700 border border-orange-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-orange-600' : 'text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-semibold">{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="ml-auto w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Create Grade Form Tab */}
            {activeTab === 'create' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-orange-100 rounded-xl">
                    <FaFileAlt className="text-orange-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Create Grade Form</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Define assessment structure and components</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={gradeForm.title}
                      onChange={(e) => setGradeForm({...gradeForm, title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none text-sm font-medium text-slate-700"
                      placeholder="e.g., Final Assessment - Semester I"
                    />
                    <p className="text-[11px] text-slate-400 mt-1.5">A unique timestamp will be automatically appended</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700">Grade Components</h3>
                        <p className="text-xs text-slate-400">Assessment items with weights</p>
                      </div>
                      <button
                        onClick={addGradeComponent}
                        className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                      >
                        <FaPlus className="text-xs" />
                        Add Component
                      </button>
                    </div>
                    
                    {gradeForm.components.map((component, index) => (
                      <div key={index} className="bg-slate-50 rounded-xl p-4 mb-3 border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                          <div className="md:col-span-5">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Component Name
                            </label>
                            <input
                              type="text"
                              value={component.name}
                              onChange={(e) => updateGradeComponent(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                              placeholder="e.g., Quiz, Assignment"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Max Score
                            </label>
                            <input
                              type="number"
                              value={component.max_score || ''}
                              onChange={(e) => updateGradeComponent(index, 'max_score', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                              min="0"
                              step="0.1"
                            />
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                              Weight (%)
                            </label>
                            <input
                              type="number"
                              value={component.weight || ''}
                              onChange={(e) => updateGradeComponent(index, 'weight', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                              min="0"
                              max="99.99"
                              step="0.01"
                            />
                          </div>
                          <div className="md:col-span-1 flex items-end">
                            <button
                              onClick={() => removeGradeComponent(index)}
                              className="w-full px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-1"
                            >
                              <FaTrash className="text-xs" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {gradeForm.components.length === 0 && (
                      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="text-slate-500 text-sm font-medium">No grade components added yet</p>
                        <p className="text-slate-400 text-xs mt-1">Click "Add Component" to begin</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={createGradeForm}
                    disabled={!gradeForm.title || gradeForm.components.length === 0}
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-orange-600/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaSave className="text-sm" />
                    Create Grade Form
                  </button>
                </div>
              </div>
            )}

            {/* Download Template Tab */}
            {activeTab === 'download' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100">
                  <div className="p-2 bg-emerald-100 rounded-xl">
                    <FaDownload className="text-emerald-600 text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Download Excel Template</h2>
                    <p className="text-xs text-slate-500 mt-0.5">Get pre-formatted spreadsheet for grade entry</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {gradeForm.components.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <FaInfoCircle className="text-blue-600 text-sm" />
                        <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Template Structure</h4>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-blue-100">
                        <div className="flex flex-wrap gap-2">
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">Student ID</span>
                          <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md text-xs font-semibold">Full Name</span>
                          {gradeForm.components.map((comp, index) => (
                            <span key={index} className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                              {comp.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={downloadExcelTemplate}
                    disabled={students.length === 0 || gradeForm.components.length === 0}
                    className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-emerald-600/10 flex items-center justify-center gap-2 text-sm"
                  >
                    <FaFileExcel className="text-lg" />
                    Download Excel Template
                  </button>
                  
                  {students.length === 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-amber-700 text-sm text-center">No students available to create template</p>
                    </div>
                  )}
                  {gradeForm.components.length === 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-amber-700 text-sm text-center">Create grade components first in the "Create Grade Form" tab</p>
                    </div>
                  )}
                </div>
              </div>
            )}

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
              <p className="text-xs text-slate-400">Course participants list</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
              {students.length}
            </span>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {students.map((student, index) => (
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
                      </tr>
                    ))}
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