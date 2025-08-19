// export default Mainbar;
import React, { useState } from "react";

// Helper to get random marks within a given max
const getRandomMark = (max) => Math.floor(Math.random() * (max - (max * 0.8) + 1)) + Math.floor(max * 0.8);

const faqs = [
  { course: "Java", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "Python", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "Flutter", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "Machine Learning", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "React JS", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "Deep Learning", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
  { course: "Artificial Intelligence", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
    { course: "Artificial Intelligence", grades: { Quiz: [getRandomMark(10), 10], Mid: [getRandomMark(20), 20], Final: [getRandomMark(50), 50], Assignment: [getRandomMark(20), 20] } },
];

// Function to calculate total, grade, and color
const getGradeInfo = (grades) => {
  // Convert each mark to percentage of its own max, then sum
  const total =
    (grades.Quiz[0] / grades.Quiz[1]) * 100 * 0.1 + // Quiz = 10% of total
    (grades.Mid[0] / grades.Mid[1]) * 100 * 0.2 + // Mid = 20% of total
    (grades.Final[0] / grades.Final[1]) * 100 * 0.5 + // Final = 50% of total
    (grades.Assignment[0] / grades.Assignment[1]) * 100 * 0.2; // Assignment = 20% of total

  let letterGrade = "B";
  let color = "bg-red-500";

  if (total > 90) {
    letterGrade = "A+";
    color = "bg-green-500";
  } else if (total > 85) {
    letterGrade = "A";
    color = "bg-blue-500";
  }

  return { total: total.toFixed(2), letterGrade, color };
};

export default function Grade() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="max-w-5xl w-full grid grid-cols- md:grid-cols- gap-8">
        

        <div className="md:col-span-2 space-y-4">
          {faqs.map((faq, index) => {
            const { total, letterGrade, color } = getGradeInfo(faq.grades);
            return (
              <div
                key={index}
                className="rounded-lg shadow-md overflow-hidden transition-all bg-white"
              >
                <button
                  className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-gray-800">{faq.course}</span>
                  <span className="flex items-center justify-center w-6 h-6 rounded-full border border-pink-400 text-pink-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 whitespace-pre-line">
                    <p>Quiz: {faq.grades.Quiz[0]} / {faq.grades.Quiz[1]}</p>
                    <p>Mid: {faq.grades.Mid[0]} / {faq.grades.Mid[1]}</p>
                    <p>Final: {faq.grades.Final[0]} / {faq.grades.Final[1]}</p>
                    <p>Assignment: {faq.grades.Assignment[0]} / {faq.grades.Assignment[1]}</p>
                    <p className="mt-2 font-semibold">Total: {total} / 100</p>
                    <p>Grade: {letterGrade}</p>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                      <div
                        className={`${color} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${total}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <h1>GPA 3.8</h1>
        </div>
      </div>
    </div>
  );
}