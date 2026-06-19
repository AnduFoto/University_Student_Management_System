
// import React, { useState } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const countries =
//  ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
//   "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
//   "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
//   "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
//   "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
//   "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
//   "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark",
//   "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
//   "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
//   "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
//   "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
//   "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
//   "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
//   "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
//   "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
//   "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
//   "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
//   "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
//   "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
//   "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
//   "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
//   "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
//   "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
//   "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
//   "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
//   "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
//   "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
//   "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
//   "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
//   "Zambia", "Zimbabwe"];

// const Registration = () => {
  
//   const [firstName, setFirstName] = useState('');
//   const [fatherName, setFatherName] = useState('');
//   const [grandFatherName, setGrandFatherName] = useState('');
//   const [gender, setGender] = useState('');
//   const [nationality, setNationality] = useState('');
//   const [dob, setDob] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [batch, setBatch] = useState('');
//   const [catagory, setCatagory] = useState('');
//   const [pictureFile, setPictureFile] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formData = new FormData();
     
//       formData.append("firstName", firstName);
//       formData.append("fatherName", fatherName);
//       formData.append("grandFatherName", grandFatherName);
//       formData.append("phoneNumber", phoneNumber);
//       formData.append("gender", gender);
//       formData.append("nationality", nationality);
//       formData.append("batch", batch);
//       formData.append("catagory", catagory);
//       if (dob) formData.append("dob", dob.toISOString().split('T')[0]);
//       if (pictureFile) formData.append("picture", pictureFile);

//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/register/`,
//         formData
//       );

//       setSuccessMessage('Registration successful!');
//       setTimeout(() => setSuccessMessage(''), 5000);

//       // Reset form
    
//       setFirstName('');
//       setFatherName('');
//       setGrandFatherName('');
//       setPhoneNumber('');
//       setGender('');
//       setNationality('');
//       setBatch('');
//       setCatagory('');
//       setDob(null);
//       setPictureFile(null);
//       setErrors({});
//     } catch (error) {
//       setErrors(error.response?.data || {});
//       setErrorMessage('Registration failed. Check your network or input.');
//       setTimeout(() => setErrorMessage(''), 5000);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
//       <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-8 md:p-12">
//         <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Registration Form</h2>

//         {successMessage && (
//           <div className="mb-6 p-3 bg-green-200 text-green-800 rounded text-center font-medium">{successMessage}</div>
//         )}
//         {errorMessage && (
//           <div className="mb-6 p-3 bg-red-200 text-red-800 rounded text-center font-medium">{errorMessage}</div>
//         )}

//         <form className="space-y-8" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
//             <InputField label="First Name" value={firstName} onChange={setFirstName} error={errors.firstName} required placeholder="Enter First Name" />
//             <InputField label="Father Name" value={fatherName} onChange={setFatherName} error={errors.fatherName} required placeholder="Enter Father Name" />
//             <InputField label="Grandfather Name" value={grandFatherName} onChange={setGrandFatherName} error={errors.grandFatherName} placeholder="Enter Grandfather Name" />
//             <InputField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} error={errors.phoneNumber} required placeholder="+251..." />
//             <InputField label="Batch" value={batch} onChange={setBatch} error={errors.batch} required placeholder="Enter Batch" />

//             <SelectField label="Gender" value={gender} onChange={setGender} error={errors.gender} required options={["Male","Female","Other"]} />
//             <SelectField label="Catagory" value={catagory} onChange={setCatagory} error={errors.catagory} required options={["Natural Science","Social Science","Other"]} />
//             <SelectField label="Nationality" value={nationality} onChange={setNationality} error={errors.nationality} required options={countries} />

//             <div className="col-span-1 md:col-span-2 lg:col-span-1">
//               <label className="block mb-1 font-medium">Date of Birth *</label>
//               <DatePicker
//                 selected={dob}
//                 onChange={(date) => setDob(date)}
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="Select Date"
//                 showMonthDropdown
//                 showYearDropdown
//                 dropdownMode="select"
//                 className={`w-full px-3 py-2 border-2 rounded ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
//                 maxDate={new Date()}
//               />
//               {errors.dob && <small className="text-red-500">{errors.dob}</small>}
//             </div>

//             {/* <div>
//               <label  className="block mb-1 font-medium invisible  ">Profile Picture</label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setPictureFile(e.target.files[0])}
//                 className={`w-full invisible px-3 py-2 border-2 rounded ${errors.picture ? 'border-red-500' : 'border-gray-300'}`}
//               />
//               {errors.picture && <small className="text-red-500">{errors.picture}</small>}
//             </div> */}
//           </div>

//           <div className="bg-orange-500 rounded-lg text-center flex items-center justify-center">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-80 py-3 bg-gray-600 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-3"
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-100" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
//                   </svg>
//                   Please wait...
//                 </>
//               ) : "Register"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, value, onChange, error, placeholder, required=false }) => (
//   <div>
//     <label className="block mb-1 font-medium">{label}{required && ' *'}</label>
//     <input
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       className={`w-full px-3 py-2 border-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
//       required={required}
//     />
//     {error && <small className="text-red-500">{error}</small>}
//   </div>
// );

// const SelectField = ({ label, value, onChange, error, options, required=false }) => (
//   <div>
//     <label className="block mb-1 font-medium">{label}{required && ' *'}</label>
//     <select
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className={`w-full px-3 py-2 border-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
//       required={required}
//     >
//       <option value="">-- Select {label} --</option>
//       {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
//     </select>
//     {error && <small className="text-red-500">{error}</small>}
//   </div>
// );

// export default Registration;




import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaUserPlus, FaCalendarAlt, FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
  "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
  "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
  "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso",
  "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic",
  "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark",
  "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador",
  "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland",
  "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos",
  "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania",
  "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta",
  "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova",
  "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
  "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine",
  "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
  "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe",
  "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore",
  "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland",
  "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
  "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
  "Zambia", "Zimbabwe"
];

const Registration = () => {
  const [firstName, setFirstName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [grandFatherName, setGrandFatherName] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [dob, setDob] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [batch, setBatch] = useState('');
  const [catagory, setCatagory] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("fatherName", fatherName);
      formData.append("grandFatherName", grandFatherName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("gender", gender);
      formData.append("nationality", nationality);
      formData.append("batch", batch);
      formData.append("catagory", catagory);
      if (dob) formData.append("dob", dob.toISOString().split('T')[0]);
      if (pictureFile) formData.append("picture", pictureFile);

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register/`, formData);

      setSuccessMessage('Student record registered successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset form controls
      setFirstName('');
      setFatherName('');
      setGrandFatherName('');
      setPhoneNumber('');
      setGender('');
      setNationality('');
      setBatch('');
      setCatagory('');
      setDob(null);
      setPictureFile(null);
      setErrors({});
    } catch (error) {
      setErrors(error.response?.data || {});
      setErrorMessage('Registration pipeline failed. Verify all required attributes.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-sm border border-gray-200 rounded-2xl border-t-4 border-orange-500 overflow-hidden animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="px-6 py-6 border-b border-gray-100 bg-slate-50/50 flex items-center gap-4">
        <div className="bg-orange-500 p-3 rounded-xl text-white shadow-md shadow-orange-500/20">
          <FaUserPlus className="text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Intake Registration Portal</h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Deploy new student profiles cleanly to system catalog</p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
            <FaCheckCircle className="text-green-500 text-base flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in duration-300">
            <FaExclamationCircle className="text-red-500 text-base flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Main Attributes Fields Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
            
            <InputField label="First Name" value={firstName} onChange={setFirstName} error={errors.firstName} required placeholder="e.g. Samuel" />
            <InputField label="Father Name" value={fatherName} onChange={setFatherName} error={errors.fatherName} required placeholder="e.g. Kebede" />
            <InputField label="Grandfather Name" value={grandFatherName} onChange={setGrandFatherName} error={errors.grandFatherName} placeholder="e.g. Alemu" />
            <InputField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} error={errors.phoneNumber} required placeholder="e.g. +251911223344" />
            <InputField label="Batch" value={batch} onChange={setBatch} error={errors.batch} required placeholder="e.g. 2026" />

            <SelectField label="Gender" value={gender} onChange={setGender} error={errors.gender} required options={["Male", "Female"]} />
            <SelectField label="Classification Category" value={catagory} onChange={setCatagory} error={errors.catagory} required options={["Natural Science", "Social Science"]} />
            <SelectField label="Nationality" value={nationality} onChange={setNationality} error={errors.nationality} required options={countries} />

            {/* Date Picker Section Layout */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Date of Birth <span className="text-orange-500">*</span></label>
              <div className="relative">
                <DatePicker
                  selected={dob}
                  onChange={(date) => setDob(date)}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="YYYY-MM-DD"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  className={`w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all ${errors.dob ? 'border-red-500 bg-red-50/30' : ''}`}
                  maxDate={new Date()}
                />
                <FaCalendarAlt className="absolute right-3.5 top-3.5 text-gray-400 pointer-events-none text-sm" />
              </div>
              {errors.dob && <small className="text-red-500 font-medium text-[11px] mt-1">{errors.dob}</small>}
            </div>
          </div>

          {/* Premium Profile Picture Document Dropzone Block */}
          <div className="border border-gray-200 rounded-xl p-6 bg-slate-50/50">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-3">Institutional Profile Portrait</label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white hover:border-orange-500 transition-colors group relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPictureFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FaCloudUploadAlt className="text-3xl text-gray-400 group-hover:text-orange-500 transition-colors mb-2" />
              <p className="text-xs font-bold text-gray-600">
                {pictureFile ? <span className="text-orange-500 font-black">{pictureFile.name}</span> : "Click or drag portrait image to attach"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tight">PNG, JPG format up to 5MB</p>
            </div>
            {errors.picture && <small className="text-red-500 font-medium text-[11px] block mt-1">{errors.picture}</small>}
          </div>

          {/* Action Trigger Block */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-10 py-3.5 bg-[#343a40] text-gray-900 rounded-xl hover:bg-purple-400 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Commit Registry</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, error, placeholder, required = false }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 ${error ? 'border-red-500 bg-red-50/30' : ''}`}
      required={required}
    />
    {error && <small className="text-red-500 font-medium text-[11px] mt-1">{error}</small>}
  </div>
);

const SelectField = ({ label, value, onChange, error, options, required = false }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
      {label} {required && <span className="text-orange-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all cursor-pointer text-gray-700 ${error ? 'border-red-500 bg-red-50/30' : ''}`}
      required={required}
    >
      <option value="" className="text-gray-400">Select {label}</option>
      {options.map((opt, idx) => <option key={idx} value={opt} className="text-gray-800">{opt}</option>)}
    </select>
    {error && <small className="text-red-500 font-medium text-[11px] mt-1">{error}</small>}
  </div>
);

export default Registration;