
// import React, { useState } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
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
//   const [userId, setUserId] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [fatherName, setFatherName] = useState('');
//   const [grandFatherName, setGrandFatherName] = useState('');
//   const [gender, setGender] = useState('');
//   const [nationality, setNationality] = useState('');
//   const [dob, setDob] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [batch, setBatch] = useState('');
//   const [catagory, setCatagory] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const formData = {
//       userId,
//       firstName,
//       fatherName,
//       grandFatherName,
//       phoneNumber,
//       gender,
//       nationality,
//       batch,
//       catagory,
//       dob: dob ? dob.toISOString().split('T')[0] : null
//     };

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/register/`,
//         formData,
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       console.log('Success:', response.data);
//      setSuccessMessage('Registration successful!');
//      setTimeout(() => setSuccessMessage(''), 5000);
   
//       setUserId('');
//       setFirstName('');
//       setFatherName('');
//       setGrandFatherName('');
//       setGender('');
//       setNationality('');
//       setPhoneNumber('');
//       setDob(null);
//       setBatch('');
//       setCatagory('');
//       setErrors({});
//     } catch (error) {
//       console.error('Registration error:', error.response?.data || error.message);
//       setErrors(error.response?.data || {});
//         setErrorMessage('Registration failed. Please check Network Connection or Input Field.');
//         setTimeout(() =>  setErrorMessage(''), 5000);
//     } finally {
//     setIsLoading(false);
//   }
//   };

//   return (
//     <div className="flex px- py- sm:px-6 lg:px-8 bg-gray-00">
//       <div className="w-full max-w-4xl bg-white shadow- rounded-lg p-6 sm:p-10">
//         <h2 className="text-2xl font-semibold mb-12 text-black  py- rounded-t-md">
//           Registration
//         </h2>

//         <form className="space-y-16 bg-gray-0" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* First Name */}
//               <div>
//               <label htmlFor="userId" className="block mb-1">UserId *</label>
//               <input
//                 type="text"
//                 id="userId"
//                 placeholder='Enter user id'
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded border-2 border-gray-200 ${errors.userId ? 'border-red-500' : ''}`}
//                 required
//               />
//               {errors.userId && <small className="text-red-500">{errors.userId}</small>}
//             </div>
//             <div>
//               <label htmlFor="firstName" className="block mb-1">First Name *</label>
//               <input
//                 type="text"
//                 id="firstName"
//                 placeholder='Enter First Name'
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded border-2 border-gray-200 ${errors.firstName ? 'border-red-500' : ''}`}
//                 required
//               />
//               {errors.firstName && <small className="text-red-500">{errors.firstName}</small>}
//             </div>

//             {/* Father Name */}
//             <div>
//               <label htmlFor="fatherName" className="block mb-1 ">Father Name *</label>
//               <input
//                 type="text"
//                 id="fatherName"
//                 value={fatherName}
//                 placeholder='Enter Father Name'
//                 onChange={(e) => setFatherName(e.target.value)}
//                 className={`w-full px-3 py-2 rounded  border-2 border-gray-200 ${errors.fatherName ? 'border-red-500' : ''}`}
//                 required
//               />
//               {errors.fatherName && <small className="text-red-500">{errors.fatherName}</small>}
//             </div>

//             {/* Grandfather Name */}
//             <div>
//               <label htmlFor="grandFatherName" className="block mb-1">Grandfather Name</label>
//               <input
//                 type="text"
//                 id="grandFatherName"
//                 placeholder='Enter G/Father Name'
//                 value={grandFatherName}
//                 onChange={(e) => setGrandFatherName(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded  border-2 border-gray-200 ${errors.grandFatherName ? 'border-red-500' : ''}`}required
//               />
//               {errors.grandFatherName && <small className="text-red-500">{errors.grandFatherName}</small>}
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label htmlFor="phoneNumber" className="block mb-1">Phone Number *</label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 placeholder="+251..."
//                 className={`w-full px-3 py-2 rounded  border-2 border-gray-200 ${errors.phoneNumber ? 'border-red-500' : ''}`}
//                 required
//               />
//               {errors.phoneNumber && <small className="text-red-500">{errors.phoneNumber}</small>}
//             </div>

//               <div>
//               <label htmlFor="batch" className="block mb-1">Batch</label>
//               <input
//                 type="text"
//                 id="batch"
//                 value={batch}
//                 placeholder='Enter Batch'
//                 onChange={(e) => setBatch(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded  border-2 border-gray-200 ${errors.batch ? 'border-red-500' : ''}`} required
//               />
//               {errors.batch && <small className="text-red-500">{errors.batch}</small>}
//             </div>
//             {/* Gender */}
//             <div>
//               <label htmlFor="gender" className="block mb-1">Gender *</label>
//               <select
//                 id="gender"
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded  border-2 border-gray-200 ${errors.gender ? 'border-red-500' : ''}`}
//                 required
//               >
//                 <option value="">-- Select Gender --</option>
//                 <option value="Male">Male</option>
//                 <option value="Female">Female</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.gender && <small className="text-red-500">{errors.gender}</small>}
//             </div>

//               <div>
//               <label htmlFor="catagory" className="block mb-1">Catagory *</label>
//               <select
//                 id="catagory"
//                 value={catagory}
//                 onChange={(e) => setCatagory(e.target.value)}
//                 className={`w-full  px-3 py-2 rounded  border-2 border-gray-200 ${errors.catagory ? 'border-red-500' : ''}`}
//                 required
//               >
//                 <option value="">-- Select catagory --</option>
//                 <option value="Natural Science">Natural Science</option>
//                 <option value="Social Science">Social Science</option>
//                 <option value="Other">Other</option>
//               </select>
//               {errors.catagory && <small className="text-red-500">{errors.catagory}</small>}
//             </div>

//             {/* Nationality */}
//             <div>
//               <label htmlFor="nationality" className="block mb-1">Nationality *</label>
//               <select
//                 id="nationality"
//                 value={nationality}
//                 onChange={(e) => setNationality(e.target.value)}
//                 className={`w-full px-3 py-2 rounded  border-2 border-gray-200 ${errors.nationality ? 'border-red-500' : ''}`}
//                 required
//               >
//                 <option value="">-- Select Country --</option>
//                 {countries.map((country, index) => (
//                   <option key={index} value={country}>{country}</option>
//                 ))}
//               </select>
//               {errors.nationality && <small className="text-red-500">{errors.nationality}</small>}
//             </div>

//             {/* Date of Birth */}
//             <div>
//               <label htmlFor="dob" className="block mb-1">Date of Birth *</label>
//               <DatePicker
//                 selected={dob}
//                 onChange={(date) => setDob(date)}
//                 dateFormat="yyyy-MM-dd"
//                 placeholderText="Select Date"
//                 showMonthDropdown
//                 showYearDropdown
//                 dropdownMode="select"
//                 className={`w-full  px-3 py-2 rounded  border-2 border-gray-200 ${errors.dob ? 'border-red-500' : ''}`}
//                 maxDate={new Date()}
//                 id="dob"
//                 required
//               />
//               {errors.dob && <small className="text-red-500">{errors.dob}</small>}
//             </div>
//           </div>

//                         {successMessage && (
//                 <div className="mb-4 text-black font-medium bg-green-300 flex items-center p-2 justify-center">
//                   {successMessage}
//                 </div>
//               )}
          
//             {errorMessage && (
//            <div className="mb-4 text-black font-normal items-center flex  p-2 justify-center bg-red-300 ">
//              {errorMessage}
//            </div>
//              )}
           
//           <div className="text-center bg-gray-200 px-80 rounded-b-md hover:bg-gray-300 ">
          
//                     <button
//             type="submit"
//             className=" text-black px-4 py-2 rounded hover:bg-gray-300 flex items-center justify-center gap-2"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="animate-spin h-5 w-5 text-black "
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-100"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   />
//                 </svg>
//                   <span className="text-xl">Please wait...</span>
//               </>
//             ) : (   <span className="text-xl">Register</span>
              
//             )}
            
//           </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Registration;



// import React, { useState } from 'react';
// import axios from 'axios';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
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
//   const [userId, setUserId] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [fatherName, setFatherName] = useState('');
//   const [grandFatherName, setGrandFatherName] = useState('');
//   const [gender, setGender] = useState('');
//   const [nationality, setNationality] = useState('');
//   const [dob, setDob] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [batch, setBatch] = useState('');
//   const [catagory, setCatagory] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const formData = {
//       userId,
//       firstName,
//       fatherName,
//       grandFatherName,
//       phoneNumber,
//       gender,
//       nationality,
//       batch,
//       catagory,
//       dob: dob ? dob.toISOString().split('T')[0] : null
//     };

//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/register/`,
//         formData,
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       setSuccessMessage('Registration successful!');
//       setTimeout(() => setSuccessMessage(''), 5000);

//       // Reset form
//       setUserId('');
//       setFirstName('');
//       setFatherName('');
//       setGrandFatherName('');
//       setGender('');
//       setNationality('');
//       setPhoneNumber('');
//       setDob(null);
//       setBatch('');
//       setCatagory('');
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
//         <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
//           Registration Form
//         </h2>

//         {successMessage && (
//           <div className="mb-6 p-3 bg-green-200 text-green-800 rounded text-center font-medium">
//             {successMessage}
//           </div>
//         )}

//         {errorMessage && (
//           <div className="mb-6 p-3 bg-red-200 text-red-800 rounded text-center font-medium">
//             {errorMessage}
//           </div>
//         )}

//         <form className="space-y-8" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             <InputField 
//               label="User ID" 
//               value={userId} 
//               onChange={setUserId} 
//               error={errors.userId} 
//               required 
//               placeholder="Enter user id" 
//             />
//             <InputField 
//               label="First Name" 
//               value={firstName} 
//               onChange={setFirstName} 
//               error={errors.firstName} 
//               required 
//               placeholder="Enter First Name" 
//             />
//             <InputField 
//               label="Father Name" 
//               value={fatherName} 
//               onChange={setFatherName} 
//               error={errors.fatherName} 
//               required 
//               placeholder="Enter Father Name" 
//             />
//             <InputField 
//               label="Grandfather Name" 
//               value={grandFatherName} 
//               onChange={setGrandFatherName} 
//               error={errors.grandFatherName} 
//               placeholder="Enter Grandfather Name" 
//             />
//             <InputField 
//               label="Phone Number" 
//               value={phoneNumber} 
//               onChange={setPhoneNumber} 
//               error={errors.phoneNumber} 
//               required 
//               placeholder="+251..." 
//             />
//             <InputField 
//               label="Batch" 
//               value={batch} 
//               onChange={setBatch} 
//               error={errors.batch} 
//               required 
//               placeholder="Enter Batch" 
//             />

//             <SelectField 
//               label="Gender" 
//               value={gender} 
//               onChange={setGender} 
//               error={errors.gender} 
//               required 
//               options={["Male","Female","Other"]} 
//             />

//             <SelectField 
//               label="Catagory" 
//               value={catagory} 
//               onChange={setCatagory} 
//               error={errors.catagory} 
//               required 
//               options={["Natural Science","Social Science","Other"]} 
//             />

//             <SelectField 
//               label="Nationality" 
//               value={nationality} 
//               onChange={setNationality} 
//               error={errors.nationality} 
//               required 
//               options={countries} 
//             />

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
//           </div>

//           <div className="  bg-orange-500 rounded-lg text-center flex items-center justify-center">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="px-80 py-3 bg-gray-600 text-center text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-3"
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin h-5 w-5 text-center  text-black"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-100"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     />
//                   </svg>
//                   Please wait...
//                 </>
//               ) : (
//                 "Register"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // Input component
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

// // Select component
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
//       {options.map((opt, idx) => (
//         <option key={idx} value={opt}>{opt}</option>
//       ))}
//     </select>
//     {error && <small className="text-red-500">{error}</small>}
//   </div>
// );

// export default Registration;



import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const countries =
 ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
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
  "Zambia", "Zimbabwe"];

const Registration = () => {
  const [userId, setUserId] = useState('');
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
      formData.append("userId", userId);
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/`,
        formData
      );

      setSuccessMessage('Registration successful!');
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset form
      setUserId('');
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
      setErrorMessage('Registration failed. Check your network or input.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Registration Form</h2>

        {successMessage && (
          <div className="mb-6 p-3 bg-green-200 text-green-800 rounded text-center font-medium">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-200 text-red-800 rounded text-center font-medium">{errorMessage}</div>
        )}

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="User ID" value={userId} onChange={setUserId} error={errors.userId} required placeholder="Enter user id" />
            <InputField label="First Name" value={firstName} onChange={setFirstName} error={errors.firstName} required placeholder="Enter First Name" />
            <InputField label="Father Name" value={fatherName} onChange={setFatherName} error={errors.fatherName} required placeholder="Enter Father Name" />
            <InputField label="Grandfather Name" value={grandFatherName} onChange={setGrandFatherName} error={errors.grandFatherName} placeholder="Enter Grandfather Name" />
            <InputField label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} error={errors.phoneNumber} required placeholder="+251..." />
            <InputField label="Batch" value={batch} onChange={setBatch} error={errors.batch} required placeholder="Enter Batch" />

            <SelectField label="Gender" value={gender} onChange={setGender} error={errors.gender} required options={["Male","Female","Other"]} />
            <SelectField label="Catagory" value={catagory} onChange={setCatagory} error={errors.catagory} required options={["Natural Science","Social Science","Other"]} />
            <SelectField label="Nationality" value={nationality} onChange={setNationality} error={errors.nationality} required options={countries} />

            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block mb-1 font-medium">Date of Birth *</label>
              <DatePicker
                selected={dob}
                onChange={(date) => setDob(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select Date"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                className={`w-full px-3 py-2 border-2 rounded ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                maxDate={new Date()}
              />
              {errors.dob && <small className="text-red-500">{errors.dob}</small>}
            </div>

            <div>
              <label  className="block mb-1 font-medium invisible  ">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPictureFile(e.target.files[0])}
                className={`w-full invisible px-3 py-2 border-2 rounded ${errors.picture ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.picture && <small className="text-red-500">{errors.picture}</small>}
            </div>
          </div>

          <div className="bg-orange-500 rounded-lg text-center flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-80 py-3 bg-gray-600 text-white rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-100" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                  </svg>
                  Please wait...
                </>
              ) : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, error, placeholder, required=false }) => (
  <div>
    <label className="block mb-1 font-medium">{label}{required && ' *'}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      required={required}
    />
    {error && <small className="text-red-500">{error}</small>}
  </div>
);

const SelectField = ({ label, value, onChange, error, options, required=false }) => (
  <div>
    <label className="block mb-1 font-medium">{label}{required && ' *'}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border-2 rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
      required={required}
    >
      <option value="">-- Select {label} --</option>
      {options.map((opt, idx) => <option key={idx} value={opt}>{opt}</option>)}
    </select>
    {error && <small className="text-red-500">{error}</small>}
  </div>
);

export default Registration;
