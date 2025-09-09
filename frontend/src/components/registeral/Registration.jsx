
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

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/register/`,
        formData
      );

      setSuccessMessage('Registration successful!');
      setTimeout(() => setSuccessMessage(''), 5000);

      // Reset form
    
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

            {/* <div>
              <label  className="block mb-1 font-medium invisible  ">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPictureFile(e.target.files[0])}
                className={`w-full invisible px-3 py-2 border-2 rounded ${errors.picture ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.picture && <small className="text-red-500">{errors.picture}</small>}
            </div> */}
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
