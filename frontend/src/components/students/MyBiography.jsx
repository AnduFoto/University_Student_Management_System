// import React, { useEffect, useState, useRef } from "react";
// import { 
//   FaUser, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaFlag, FaPrayingHands, 
//   FaVenusMars, FaIdBadge, FaSchool, FaLayerGroup, FaDownload 
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// export default function MyBiography() {
//   const [user, setUser] = useState(null);
//   const biographyRef = useRef();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//  const downloadPDF = async () => {
//   if (!biographyRef.current || !user) return;

//   const element = biographyRef.current;
//   const canvas = await html2canvas(element, { scale: 2, useCORS: true, allowTaint: true });
//   const imgData = canvas.toDataURL("image/png");

//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth();
//   const pdfHeight = pdf.internal.pageSize.getHeight();
//   const imgProps = { width: canvas.width, height: canvas.height };
//   const pdfImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

//   let position = 0;
//   let pageNumber = 1;

//   while (position < pdfImgHeight) {
//     const pageHeight = Math.min(pdfHeight - 25, pdfImgHeight - position);

//     // Canvas for page slice
//     const canvasPage = document.createElement("canvas");
//     canvasPage.width = canvas.width;
//     canvasPage.height = (pageHeight * canvas.width) / pdfWidth;
//     const ctx = canvasPage.getContext("2d");
//     ctx.drawImage(
//       canvas,
//       0,
//       (position * canvas.height) / pdfImgHeight,
//       canvas.width,
//       canvasPage.height,
//       0,
//       0,
//       canvas.width,
//       canvasPage.height
//     );

//     if (pageNumber > 1) pdf.addPage();

//     // Header
//     const headerHeight = 25; 
//     pdf.setFillColor(255, 165, 0);
//     pdf.rect(0, 0, pdfWidth, headerHeight, "F");

//     // Circular profile image in header
//     const profileCanvas = document.createElement("canvas");
//     const size = 40; // mm
//     profileCanvas.width = 100;
//     profileCanvas.height = 100;
//     const pctx = profileCanvas.getContext("2d");

//     const profileImg = new Image();
//     profileImg.crossOrigin = "anonymous";
//     profileImg.src = `http://127.0.0.1:8000${user.picture}`;
//     await new Promise((res) => { profileImg.onload = res; });

//     // Draw circular mask
//     pctx.save();
//     pctx.beginPath();
//     pctx.arc(50, 50, 50, 0, Math.PI * 2, true);
//     pctx.closePath();
//     pctx.clip();
//     pctx.drawImage(profileImg, 0, 0, 100, 100);
//     pctx.restore();

//     pdf.addImage(profileCanvas.toDataURL("image/png"), "PNG", 10, 2, 15, 15);

//     // Header text
//     pdf.setTextColor(255, 255, 255);
//     pdf.setFontSize(14);
//     pdf.text("Debre Berhan University", pdfWidth / 2, 10, { align: "center" });
//     pdf.setFontSize(10);
//     pdf.text("Official Student Biography", pdfWidth / 2, 18, { align: "center" });

//     // Main content image
//     pdf.addImage(canvasPage.toDataURL("image/png"), "PNG", 0, headerHeight, pdfWidth, (canvasPage.height * pdfWidth) / canvas.width);

//     // Footer page number
//     pdf.setFontSize(10);
//     pdf.setTextColor(100);
//     pdf.text(`Page ${pageNumber}`, pdfWidth - 20, pdfHeight - 10);

//     pageNumber++;
//     position += pageHeight;
//   }

//   pdf.save(`${user.firstName}_Biography.pdf`);
// };


//   if (!user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-gray-500 text-lg">Loading biography...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-16">
//       <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8" ref={biographyRef}>

//         {/* Download Button */}
//         <div className="flex justify-end mb-6">
//           <button
//             onClick={downloadPDF}
//             className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition"
//           >
//             <FaDownload /> Download PDF
//           </button>
//         </div>

//         {/* Profile Header */}
//         <div className="flex flex-col items-center text-center mb-10">
//           <img
//             src={`http://127.0.0.1:8000${user.picture}`}
//             alt="profile"
//             className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-orange-400 shadow-lg object-cover mb-4"
//           />
//           <h2 className="text-3xl font-bold">{user.firstName} {user.fatherName} {user.grandFatherName}</h2>
//           <p className="text-lg font-medium text-orange-500 uppercase tracking-wider">{user.role}</p>
//         </div>

//         {/* Personal Info */}
//         <div className="mb-8 border rounded-2xl p-6 shadow-sm">
//           <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaUser /> Personal Information</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//             <div className="flex items-center gap-2"><FaIdBadge className="text-orange-400"/> <strong>User ID:</strong> {user.userId}</div>
//             <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Username:</strong> {user.username}</div>
//             <div className="flex items-center gap-2"><FaBirthdayCake className="text-orange-400"/> <strong>DOB:</strong> {user.dob}</div>
//             <div className="flex items-center gap-2"><FaVenusMars className="text-orange-400"/> <strong>Gender:</strong> {user.gender}</div>
//             <div className="flex items-center gap-2"><FaPhone className="text-orange-400"/> <strong>Phone:</strong> {user.phoneNumber}</div>
//             <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-orange-400"/> <strong>Address:</strong> {user.region}, {user.zone_or_special_wereda}, {user.city_or_town}, House {user.house_number}</div>
//             <div className="flex items-center gap-2"><FaFlag className="text-orange-400"/> <strong>Nationality:</strong> {user.nationality}</div>
//             <div className="flex items-center gap-2"><FaPrayingHands className="text-orange-400"/> <strong>Religion:</strong> {user.religion}</div>
//           </div>
//         </div>

//         {/* Academic Info */}
//         <div className="mb-8 border rounded-2xl p-6 shadow-sm">
//           <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaSchool /> Academic Information</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//             <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Batch:</strong> {user.batch}</div>
//             <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Category:</strong> {user.catagory}</div>
//             <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Entrance Exam:</strong> {user.entrance_exam}</div>
//             <div className="flex items-center gap-2"><FaLayerGroup className="text-orange-400"/> <strong>Handicap Status:</strong> {user.handicap}</div>
//           </div>
//         </div>

//         {/* Family Info */}
//         <div className="mb-8 border rounded-2xl p-6 shadow-sm">
//           <h3 className="text-xl font-bold text-orange-500 mb-4 flex items-center gap-2"><FaUser /> Family Information</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
//             <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Father’s Name:</strong> {user.fatherName}</div>
//             <div className="flex items-center gap-2"><FaUser className="text-orange-400"/> <strong>Mother’s Name:</strong> {user.motherName} ({user.mothersFatherName})</div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="mt-6 text-center text-gray-500 text-sm border-t pt-4">
//           <p>© 2025 Debre Berhan University. All rights reserved.</p>
//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState, useRef } from "react";
import { 
  FaUser, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaFlag, FaPrayingHands, 
  FaVenusMars, FaIdBadge, FaSchool, FaLayerGroup, FaDownload, FaShieldAlt,
  FaGraduationCap, FaUsers, FaCheckDouble
} from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MyBiography() {
  const [user, setUser] = useState(null);
  const biographyRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            setUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Failed to parse user data", e);
        }
    }
  }, []);

  const downloadPDF = async () => {
    if (!biographyRef.current || !user) return;

    const element = biographyRef.current;
    // Hide the download button during capture
    const btn = element.querySelector('.download-btn-container');
    if(btn) btn.style.display = 'none';

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    if(btn) btn.style.display = 'flex';

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfImgHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfImgHeight);
    pdf.save(`${user.firstName}_Official_Biography.pdf`);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f4f6f9]">
        <div className="animate-pulse text-gray-400 font-black uppercase tracking-widest">Loading Dossier...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] py-12 px-4 sm:px-8">
      <div 
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-200" 
        ref={biographyRef}
      >
        {/* TOP BRANDING BAR */}
        <div className="bg-[#343a40] text-white px-8 py-4 flex justify-between items-center border-b-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded">
              <FaGraduationCap className="text-xl" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter leading-none">Infolink University College </h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Office of the Registrar</p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-orange-500 uppercase italic">Official Student Record</p>
            <p className="text-[9px] text-gray-500 uppercase tracking-widest">Verified: 2026</p>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-col md:flex-row">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-72 bg-gray-50 border-r border-gray-100 p-8 flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={`http://127.0.0.1:8000${user.picture}`}
                alt="profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl object-cover"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              <div className="absolute bottom-2 right-2 bg-green-500 p-1.5 rounded-full border-2 border-white shadow-sm">
                <FaShieldAlt className="text-white text-xs" />
              </div>
            </div>

            <div className="text-center w-full">
              <h3 className="text-xl font-black text-gray-800 leading-tight mb-1 uppercase">
                {user.firstName} <br /> {user.fatherName}
              </h3>
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-6">
                {user.role || "STUDENT"}
              </p>
              
              <div className="space-y-4 text-left">
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Student ID</p>
                  <p className="text-xs font-bold text-gray-700">{user.userId}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Username</p>
                  <p className="text-xs font-bold text-gray-700">@{user.username}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 w-full download-btn-container">
              <button
                onClick={downloadPDF}
                className="w-full flex items-center justify-center gap-2 bg-[#343a40] hover:bg-orange-500 text-white px-4 py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                <FaDownload /> Generate PDF
              </button>
            </div>
          </div>

          {/* RIGHT DETAILS COLUMN */}
          <div className="flex-1 p-8 sm:p-10">
            
            {/* Section: Personal */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gray-100"></div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <FaUser className="text-orange-500"/> Personal Dossier
                </h4>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <InfoItem icon={<FaBirthdayCake />} label="Date of Birth" value={user.dob} />
                <InfoItem icon={<FaVenusMars />} label="Gender" value={user.gender} />
                <InfoItem icon={<FaPhone />} label="Phone Number" value={user.phoneNumber} />
                <InfoItem icon={<FaFlag />} label="Nationality" value={user.nationality} />
                <InfoItem icon={<FaPrayingHands />} label="Religion" value={user.religion} />
                <InfoItem icon={<FaMapMarkerAlt />} label="Address" value={`${user.city_or_town || ''}, ${user.region || ''}`} />
              </div>
            </section>

            {/* Section: Academic */}
            <section className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gray-100"></div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <FaSchool className="text-orange-500"/> Academic Standing
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <InfoItem icon={<FaLayerGroup />} label="Current Batch" value={user.batch} />
                <InfoItem icon={<FaLayerGroup />} label="Category" value={user.catagory} />
                <InfoItem icon={<FaShieldAlt />} label="Handicap Status" value={user.handicap} />
                <InfoItem icon={<FaCheckDouble />} label="Entrance Exam" value={user.entrance_exam} />
              </div>
            </section>

            {/* Section: Family */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gray-100"></div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <FaUsers className="text-orange-500"/> Lineage Info
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <InfoItem icon={<FaUser />} label="Father's Name" value={`${user.fatherName || ''} ${user.grandFatherName || ''}`} />
                <InfoItem icon={<FaUser />} label="Mother's Name" value={user.motherName} />
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-100 px-8 py-4 text-center">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            This is a system-generated document and is valid only with the university's digital verification stamp.
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper component inside the same file
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-orange-400 text-xs">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-800">{value || "NOT PROVIDED"}</p>
      </div>
    </div>
  );
}