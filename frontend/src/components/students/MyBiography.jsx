import React, { useEffect, useState, useRef } from "react";
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaFlag, FaPrayingHands, 
  FaVenusMars, FaIdBadge, FaSchool, FaLayerGroup, FaDownload 
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MyBiography() {
  const [user, setUser] = useState(null);
  const biographyRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

 const downloadPDF = async () => {
  if (!biographyRef.current || !user) return;

  const element = biographyRef.current;
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgProps = { width: canvas.width, height: canvas.height };
  const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

  let position = 0;
  let pageNumber = 1;

  while (position < pdfImgHeight) {
    const pageHeight = Math.min(pdfHeight - 25, pdfImgHeight - position);

    // Canvas for page slice
    const canvasPage = document.createElement("canvas");
    canvasPage.width = canvas.width;
    canvasPage.height = (pageHeight * canvas.width) / pdfWidth;
    const ctx = canvasPage.getContext("2d");
    ctx.drawImage(
      canvas,
      0,
      (position * canvas.height) / pdfImgHeight,
      canvas.width,
      canvasPage.height,
      0,
      0,
      canvas.width,
      canvasPage.height
    );

    if (pageNumber > 1) pdf.addPage();

    // Header
    const headerHeight = 25; 
    pdf.setFillColor(255, 165, 0);
    pdf.rect(0, 0, pdfWidth, headerHeight, "F");

    // Circular profile image in header
    const profileCanvas = document.createElement("canvas");
    const size = 40; // mm
    profileCanvas.width = 100;
    profileCanvas.height = 100;
    const pctx = profileCanvas.getContext("2d");

    const profileImg = new Image();
    profileImg.crossOrigin = "anonymous";
    profileImg.src = `http://127.0.0.1:8000${user.picture}`;
    await new Promise((res) => { profileImg.onload = res; });

    // Draw circular mask
    pctx.save();
    pctx.beginPath();
    pctx.arc(50, 50, 50, 0, Math.PI * 2, true);
    pctx.closePath();
    pctx.clip();
    pctx.drawImage(profileImg, 0, 0, 100, 100);
    pctx.restore();

    pdf.addImage(profileCanvas.toDataURL("image/png"), "PNG", 10, 2, 15, 15);

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text("Debre Berhan University", pdfWidth / 2, 10, { align: "center" });
    pdf.setFontSize(10);
    pdf.text("Official Student Biography", pdfWidth / 2, 18, { align: "center" });

    // Main content image
    pdf.addImage(canvasPage.toDataURL("image/png"), "PNG", 0, headerHeight, pdfWidth, (canvasPage.height * pdfWidth) / canvas.width);

    // Footer page number
    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(`Page ${pageNumber}`, pdfWidth - 20, pdfHeight - 10);

    pageNumber++;
    position += pageHeight;
  }

  pdf.save(`${user.firstName}_Biography.pdf`);
};


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading biography...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-16">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8" ref={biographyRef}>

        {/* Download Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            <FaDownload /> Download PDF
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src={`http://127.0.0.1:8000${user.picture}`}
            alt="profile"
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-orange-400 shadow-lg object-cover mb-4"
          />
          <h2 className="text-3xl font-bold">{user.firstName} {user.fatherName} {user.grandFatherName}</h2>
          <p className="text-lg font-medium text-orange-500 uppercase tracking-wider">{user.role}</p>
        </div>

        {/* Personal Info */}
        <div className="mb-8 border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaUser /> Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2"><FaIdBadge className="text-orange-400"/> <strong>User ID:</strong> {user.userId}</div>
            <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Username:</strong> {user.username}</div>
            <div className="flex items-center gap-2"><FaBirthdayCake className="text-orange-400"/> <strong>DOB:</strong> {user.dob}</div>
            <div className="flex items-center gap-2"><FaVenusMars className="text-orange-400"/> <strong>Gender:</strong> {user.gender}</div>
            <div className="flex items-center gap-2"><FaPhone className="text-orange-400"/> <strong>Phone:</strong> {user.phoneNumber}</div>
            <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-400"/> <strong>Address:</strong> {user.region}, {user.zone_or_special_wereda}, {user.city_or_town}, House {user.house_number}</div>
            <div className="flex items-center gap-2"><FaFlag className="text-orange-400"/> <strong>Nationality:</strong> {user.nationality}</div>
            <div className="flex items-center gap-2"><FaPrayingHands className="text-orange-400"/> <strong>Religion:</strong> {user.religion}</div>
          </div>
        </div>

        {/* Academic Info */}
        <div className="mb-8 border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaSchool /> Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Batch:</strong> {user.batch}</div>
            <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Category:</strong> {user.catagory}</div>
            <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Entrance Exam:</strong> {user.entrance_exam}</div>
            <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Handicap Status:</strong> {user.handicap}</div>
          </div>
        </div>

        {/* Family Info */}
        <div className="mb-8 border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaUser /> Family Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Father’s Name:</strong> {user.fatherName}</div>
            <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Mother’s Name:</strong> {user.motherName} ({user.mothersFatherName})</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm border-t pt-4">
          <p>© 2025 Debre Berhan University. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
