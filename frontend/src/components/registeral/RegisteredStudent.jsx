
import React, { useState, useEffect, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  DocumentArrowDownIcon,
  ArrowLeftIcon,
  EyeIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { CSVLink } from "react-csv";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptSearch, setDeptSearch] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);
  const [accordionOpen, setAccordionOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  const BASE_URL = "http://localhost:8000/api";
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Start loading
        const [studentsRes, departmentsRes, usersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/students/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/departments/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setStudents(studentsRes.data.results || studentsRes.data);
        setDepartments(departmentsRes.data.results || departmentsRes.data);
        setUsers(usersRes.data.results || usersRes.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false); // Stop loading regardless of success or error
      }
    };
    fetchData();
  }, []);

  // Get available batches for the selected department
  const availableBatches = useMemo(() => {
    if (!activeDepartment) return [];
    
    // Get all students in the selected department
    const deptStudents = students.filter(
      (s) => s.department_id === activeDepartment.department_id
    );
    
    // Get batch information from user details
    const batchSet = new Set();
    deptStudents.forEach((s) => {
      const user = users.find(u => u.username === s.username);
      if (user && user.batch) {
        batchSet.add(user.batch);
      }
    });
    
    return Array.from(batchSet).sort();
  }, [students, users, activeDepartment]);

  // Get available semesters for the selected department and batch
  const availableSemesters = useMemo(() => {
    if (!activeDepartment || !selectedBatch) return [];
    
    // Get all students in the selected department and batch
    const deptBatchStudents = students.filter((s) => {
      const user = users.find(u => u.username === s.username);
      return s.department_id === activeDepartment.department_id && 
             user && user.batch === selectedBatch;
    });
    
    const semesterSet = new Set();
    deptBatchStudents.forEach((s) =>
      Object.keys(s.semesters || {}).forEach((sem) => semesterSet.add(sem))
    );
    return Array.from(semesterSet).sort();
  }, [students, users, activeDepartment, selectedBatch]);

  // Filter students based on department, batch, semester and search term - FIXED
  const filteredStudents = useMemo(() => {
    if (!activeDepartment || !selectedBatch || !selectedSemester) return [];
    
    // Use a Map to ensure each student appears only once
    const studentMap = new Map();
    
    students.forEach((s) => {
      // Check if student belongs to the selected department and batch
      const user = users.find(u => u.username === s.username);
      const matchesDeptBatch = 
        s.department_id === activeDepartment.department_id && 
        user && user.batch === selectedBatch;
      
      // Check if student has courses in the selected semester
      const hasSelectedSemester = s.semesters && s.semesters[selectedSemester];
      
      if (matchesDeptBatch && hasSelectedSemester) {
        // Use username as key to ensure uniqueness
        studentMap.set(s.username, s);
      }
    });
    
    // Convert Map back to array
    const uniqueStudents = Array.from(studentMap.values());
    
    // Apply search filter if needed
    if (!searchTerm) return uniqueStudents;
    
    return uniqueStudents.filter((s) => {
      const fields = [
        s.username,
        s.user_details?.firstName,
        s.user_details?.fatherName,
      ];
      return fields.filter(Boolean).some((f) =>
        f.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [students, users, activeDepartment, selectedBatch, selectedSemester, searchTerm]);

  const filteredDepartments = useMemo(() => {
    if (!deptSearch) return departments;
    return departments.filter((d) =>
      d.department_name.toLowerCase().includes(deptSearch.toLowerCase())
    );
  }, [departments, deptSearch]);

  const csvData = filteredStudents.map((s) => ({
    Username: s.username,
    Name: `${s.user_details?.firstName || ""} ${
      s.user_details?.fatherName || ""
    }`,
    Batch: selectedBatch,
    Department: s.department_details?.department_name,
    Semester: selectedSemester,
    Courses: s.semesters[selectedSemester]
      .map((c) => `${c.course_name} (${c.course_credit}cr)`)
      .join("; "),
  }));

  // ✅ Registration Slip PDF (A5 size + orange theme)
  const downloadSlip = (student, semester) => {
    const doc = new jsPDF({ format: "a5" });

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Debre Berhan University Registration Slip", 74, 20, { align: "center" });
    doc.setFontSize(9);
    doc.text("Generated by Student Management Portal", 74, 26, {
      align: "center",
    });
    doc.setDrawColor(255, 102, 0);
    doc.setLineWidth(0.5);
    doc.line(20, 30, 135, 30);

    // Student Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Name: ${student.user_details?.firstName || ""} ${
        student.user_details?.fatherName || ""
      }`,
      20,
      42
    );
    doc.text(`Username: ${student.username}`, 20, 48);
    doc.text(`Batch: ${selectedBatch}`, 20, 54);
    doc.text(
      `Department: ${student.department_details?.department_name}`,
      20,
      60
    );
    doc.text(`Semester: ${semester}`, 20, 66);

    // Courses table
    const courseData = student.semesters[semester].map((c, i) => [
      i + 1,
      c.course_id,
      c.course_name,
      `${c.course_credit} credits`,
    ]);

    autoTable(doc, {
      startY: 78,
      head: [["#", "Course ID", "Course Name", "Credits"]],
      body: courseData,
      theme: "striped",
      headStyles: { fillColor: [255, 102, 0] }, // orange header
      alternateRowStyles: { fillColor: [250, 250, 250] },
    });

    // Footer
    const date = new Date().toLocaleDateString();
    doc.setFontSize(9);
    doc.text(`Issued on: ${date}`, 20, doc.internal.pageSize.height - 20);
    doc.text(
      "Authorized Signature: ___________________",
      60,
      doc.internal.pageSize.height - 20
    );

    doc.save(`${student.username}_${semester}_registration_slip.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="text-center mb-8 pt-4">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg inline-flex mb-4">
          <AcademicCapIcon className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Student Management Portal
        </h1>
        <p className="text-gray-600 mt-2">View and manage student registrations</p>
      </div>

      {/* Loading spinner */}
{isLoading && (
  <div className="flex flex-col justify-center items-center h-96">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
      <div className="w-16 h-16 border-4 border-t-transparent border-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-spin absolute top-0 left-0"></div>
    </div>
    <p className="mt-6 text-lg font-medium text-gray-700">Loading Departments</p>
  </div>
)}
      {/* Department selection */}
      {!isLoading && !activeDepartment ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <BuildingLibraryIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Select Department</h2>
            </div>
            
            {/* Department search */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search Departments..."
                value={deptSearch}
                onChange={(e) => setDeptSearch(e.target.value)}
                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredDepartments.length === 0 ? (
                <div className="col-span-2 text-center py-10 text-gray-500">
                  <BuildingLibraryIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No departments found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              ) : (
                filteredDepartments.map((dept) => (
                  <button
                    key={dept.department_id}
                    onClick={() => setActiveDepartment(dept)}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200 text-left"
                  >
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {dept.department_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Click to choose Batch
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : !isLoading && !selectedBatch ? (
        // Batch selection
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
          <button
            onClick={() => setActiveDepartment(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back to Departments
          </button>
          
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeDepartment.department_name} – Select Batch
            </h2>
          </div>
          
          {availableBatches.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <UserGroupIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No batches found</p>
              <p className="text-sm mt-1">No students with batch information in this department</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {availableBatches.map((batch) => (
                <button
                  key={batch}
                  onClick={() => setSelectedBatch(batch)}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 border border-gray-200 text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-800">
                    Batch {batch}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Click to choose Semester
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : !isLoading && !selectedSemester ? (
        // Semester selection
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl mx-auto">
          <button
            onClick={() => setSelectedBatch(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" /> Back to Batches
          </button>
          
          <div className="flex items-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <CalendarDaysIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {activeDepartment.department_name} – Batch {selectedBatch} – Select Semester
            </h2>
          </div>
          
          {availableSemesters.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <CalendarDaysIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No semesters found</p>
              <p className="text-sm mt-1">No registered students for this department and batch</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {availableSemesters.map((sem) => (
                <div key={sem} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setAccordionOpen(accordionOpen === sem ? null : sem)
                    }
                    className="flex justify-between items-center w-full px-5 py-3 bg-blue-50 hover:bg-blue-100 transition"
                  >
                    <span className="font-medium">{sem}</span>
                    {accordionOpen === sem ? (
                      <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </button>
                  {accordionOpen === sem && (
                    <div className="p-4 bg-blue-50 flex justify-center">
                      <button
                        onClick={() => setSelectedSemester(sem)}
                        className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-600 text-white rounded-lg hover:from-orange-700 hover:to-orange-700 transition shadow-md"
                      >
                        Select {sem}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : !isLoading ? (
        // Student table
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setSelectedSemester(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" /> Back to Semester
            </button>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800">
                {activeDepartment.department_name} – Batch {selectedBatch} – {selectedSemester}
              </h2>
              <p className="text-sm text-gray-500">
                {filteredStudents.length} student(s) registered
              </p>
            </div>
            
            <CSVLink
              data={csvData}
              filename={`${activeDepartment.department_name}_batch_${selectedBatch}_${selectedSemester}_students.csv`}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl flex items-center gap-2 hover:from-green-700 hover:to-emerald-700 transition shadow-md"
            >
              <DocumentArrowDownIcon className="h-5 w-5" /> Export CSV
            </CSVLink>
          </div>

          {/* Student search */}
          <div className="relative mb-6">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto relative rounded-xl border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No students found</p>
                      <p className="text-sm mt-1">
                        {searchTerm 
                          ? "Try a different search term" 
                          : "No students registered for the selected criteria"
                        }
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <React.Fragment key={s.username}>
                      <tr className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {s.user_details?.firstName} {s.user_details?.fatherName} {s.user_details?.grandFatherName}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{s.username}</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {selectedBatch}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() =>
                              setViewingStudent(
                                viewingStudent === s.username ? null : s.username
                              )
                            }
                            className="bg-gradient-to-r from-orange-600 to-orange-600 px-3 py-1.5 rounded-lg text-white hover:from-orange-700 hover:to-orange-700 transition flex items-center gap-1 shadow-sm"
                          >
                            <EyeIcon className="h-4 w-4" /> Details
                          </button>
                          <button
                            onClick={() => downloadSlip(s, selectedSemester)}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 rounded-lg text-white hover:from-orange-600 hover:to-amber-600 transition flex items-center gap-1 shadow-sm"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            Slip
                          </button>
                        </td>
                      </tr>

                      {viewingStudent === s.username && (
                        <tr>
                          <td colSpan={4} className="bg-gray-50 p-4">
                            <div className="bg-white rounded-xl shadow-inner p-6 relative border border-gray-200">
                              <button
                                onClick={() => setViewingStudent(null)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                              >
                                <XMarkIcon className="h-5 w-5" />
                              </button>
                              <h3 className="text-lg font-bold mb-4 text-gray-800">
                                Student Details
                              </h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Username:</strong> {s.username}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Name:</strong> {s.user_details?.firstName} {s.user_details?.fatherName} {s.user_details?.grandFatherName}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Batch:</strong> {selectedBatch}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Email:</strong> {s.user_details?.email || "N/A"}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Department:</strong> {s.department_details?.department_name}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Semester:</strong> {selectedSemester}
                                </div>
                                <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg">
                                  <strong className="text-gray-700">Courses:</strong>
                                  <ul className="mt-2 space-y-1">
                                    {s.semesters[selectedSemester].map((c) => (
                                      <li key={c.course_id} className="flex justify-between">
                                        <span>{c.course_name}</span>
                                        <span className="text-gray-500">{c.course_credit} credits</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StudentManagement;