import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  AcademicCapIcon,
  PencilSquareIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

const semesters = [
  {
    semester: "Fall 2018",
    courses: [
      {
        title: "Bachelors in Science",
        grades: { Quiz: [8, 10], Mid: [15, 20], Final: [40, 50], Assignment: [18, 20] },
      },
      {
        title: "Mathematics",
        grades: { Quiz: [9, 10], Mid: [18, 20], Final: [45, 50], Assignment: [20, 20] },
      },
    ],
  },
  {
    semester: "Spring 2019",
    courses: [
      {
        title: "Physics",
        grades: { Quiz: [7, 10], Mid: [16, 20], Final: [42, 50], Assignment: [19, 20] },
      },
    ],
  },
];

const getGradeInfo = (grades) => {
  const total =
    (grades.Quiz[0] / grades.Quiz[1]) * 100 * 0.1 +
    (grades.Mid[0] / grades.Mid[1]) * 100 * 0.2 +
    (grades.Final[0] / grades.Final[1]) * 100 * 0.5 +
    (grades.Assignment[0] / grades.Assignment[1]) * 100 * 0.2;

  let letterGrade = "B";
  let color = "text-red-600";

  if (total >= 90) {
    letterGrade = "A+";
    color = "text-green-600";
  } else if (total >= 85) {
    letterGrade = "A";
    color = "text-blue-600";
  } else if (total >= 75) {
    letterGrade = "B+";
    color = "text-yellow-600";
  } else if (total >= 65) {
    letterGrade = "C";
    color = "text-orange-600";
  }

  return { total: total.toFixed(2), letterGrade, color };
};

export default function SemesterGrades() {
  const [openSemester, setOpenSemester] = useState(null);

  const toggleSemester = (index) => {
    setOpenSemester(openSemester === index ? null : index);
  };

  const gradeIcons = {
    Quiz: <AcademicCapIcon className="w-5 h-5 text-gray-500" />,
    Mid: <PencilSquareIcon className="w-5 h-5 text-gray-500" />,
    Final: <DocumentTextIcon className="w-5 h-5 text-gray-500" />,
    Assignment: <ClipboardDocumentCheckIcon className="w-5 h-5 text-gray-500" />,
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Semester Grades</h1>

      {semesters.map((sem, idx) => (
        <div
          key={idx}
          className="bg-white rounded-2xl shadow-md mb-6 overflow-hidden border border-gray-200 transition-all duration-300"
        >
          {/* Semester Header */}
          <div
            className="flex justify-between items-center cursor-pointer p-6 hover:bg-gray-50 transition-colors"
            onClick={() => toggleSemester(idx)}
          >
            <h2 className="text-xl font-semibold text-gray-700">{sem.semester}</h2>
            {openSemester === idx ? (
              <ChevronUpIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {/* Collapsible Content */}
          <div
            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
              openSemester === idx ? "max-h-screen" : "max-h-0"
            }`}
          >
            <div className="p-6 space-y-5">
              {sem.courses.map((course, cIdx) => {
                const { total, letterGrade, color } = getGradeInfo(course.grades);
                return (
                  <div
                    key={cIdx}
                    className="bg-gray-50 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">{course.title}</h3>
                      <span className={`px-3 py-1 rounded-full font-semibold ${color}`}>
                        {letterGrade}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {Object.keys(course.grades).map((type) => (
                        <div key={type} className="flex flex-col text-gray-700">
                          <div className="flex items-center mb-1">
                            {gradeIcons[type]}
                            <span className="ml-2 font-medium text-sm">{type}</span>
                          </div>
                          <p className="text-sm font-semibold">
                            {course.grades[type][0]} / {course.grades[type][1]}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm mb-1 font-medium">Total: {total}%</p>
                      <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                        <div
                          className={`h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500`}
                          style={{ width: `${total}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
