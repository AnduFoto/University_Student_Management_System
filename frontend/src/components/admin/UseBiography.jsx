
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  UserIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon
} from "@heroicons/react/24/outline";

const SECTION_COLORS = {
  basic: "from-blue-50 to-blue-100 border-blue-200",
  mother: "from-orange-50 to-orange-100 border-orange-200",
  contact: "from-gray-50 to-gray-100 border-gray-200",
  education: "from-purple-50 to-purple-100 border-purple-200",
  address: "from-indigo-50 to-indigo-100 border-indigo-200",
  other: "from-gray-100 to-gray-200 border-gray-300",
};

// Validation rules
const VALIDATION_RULES = {
  userId: { required: true, minLength: 3, maxLength: 20 },
  firstName: { required: true, minLength: 2, maxLength: 50 },
  fatherName: { required: true, minLength: 2, maxLength: 50 },
  grandFatherName: { required: true, minLength: 2, maxLength: 50 },
  motherName: { required: true, minLength: 2, maxLength: 50 },
  mothersFatherName: { required: true, minLength: 2, maxLength: 50 },
  phoneNumber: { required: true, pattern: /^[0-9+]{10,15}$/ },
  dob: { required: true, isDate: true },
  gender: { required: true },
  religion: { required: true, minLength: 2, maxLength: 30 },
  catagory: { required: true, minLength: 2, maxLength: 50 },
  batch: { required: true, minLength: 2, maxLength: 20 },
  handicap: { maxLength: 100 },
  nationality: { required: true, minLength: 2, maxLength: 30 },
  region: { required: true, minLength: 2, maxLength: 30 },
  zone_or_special_wereda: { required: true, minLength: 2, maxLength: 50 },
  city_or_town: { required: true, minLength: 2, maxLength: 50 },
  house_number: { maxLength: 20 },
  entrance_exam: { maxLength: 50 },
};

export default function UseBiography() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    userId: "",
    firstName: "",
    fatherName: "",
    grandFatherName: "",
    motherName: "",
    mothersFatherName: "",
    phoneNumber: "",
    dob: "",
    gender: "",
    religion: "",
    catagory: "",
    batch: "",
    handicap: "",
    nationality: "",
    region: "",
    zone_or_special_wereda: "",
    city_or_town: "",
    house_number: "",
    entrance_exam: "",
    is_active: false,
    picture: null,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(null);
  const [openSections, setOpenSections] = useState({
    basic: true,
    mother: false,
    contact: false,
    education: false,
    address: false,
    other: false,
  });

  // Persist section open/closed state
  useEffect(() => {
    const savedSections = localStorage.getItem("openSections");
    if (savedSections) setOpenSections(JSON.parse(savedSections));
  }, []);

  useEffect(() => {
    localStorage.setItem("openSections", JSON.stringify(openSections));
  }, [openSections]);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Validation function
  const validateField = (name, value) => {
    const rules = VALIDATION_RULES[name];
    if (!rules) return null;
    
    if (rules.required && (!value || value.trim() === "")) {
      return "This field is required";
    }
    
    if (value && rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
      return `Must be less than ${rules.maxLength} characters`;
    }
    
    if (value && rules.pattern && !rules.pattern.test(value)) {
      return "Invalid format";
    }
    
    if (value && rules.isDate) {
      const date = new Date(value);
      if (isNaN(date.getTime())) return "Invalid date";
      if (date > new Date()) return "Date cannot be in the future";
    }
    
    return null;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "picture" && key !== "is_active") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    return newErrors;
  };

  // Fetch user biography
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/register/${username}/`);
        const user = res.data;

        setFormData({
          userId: user.userId || "",
          firstName: user.firstName || "",
          fatherName: user.fatherName || "",
          grandFatherName: user.grandFatherName || "",
          motherName: user.motherName || "",
          mothersFatherName: user.mothersFatherName || "",
          phoneNumber: user.phoneNumber || "",
          dob: user.dob || "",
          gender: user.gender || "",
          religion: user.religion || "",
          catagory: user.catagory || "",
          batch: user.batch || "",
          handicap: user.handicap || "",
          nationality: user.nationality || "",
          region: user.region || "",
          zone_or_special_wereda: user.zone_or_special_wereda || "",
          city_or_town: user.city_or_town || "",
          house_number: user.house_number || "",
          entrance_exam: user.entrance_exam || "",
          is_active: user.is_active || false,
          picture: null,
        });
        setPreview(user.picture || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue = type === "checkbox" ? checked : value;
    
    if (type === "file") {
      setFormData((prev) => ({ ...prev, picture: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    
    // Validate field on change if it's been touched before
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur events (mark field as touched)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Mark all fields as touched to show all errors
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      if (key !== "picture") allTouched[key] = true;
    });
    setTouched(allTouched);
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setErrorMessage('Please correct the errors below.');
      setSubmitting(false);
      return;
    }
    
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const payload = new FormData();

      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          if (key === "is_active") {
            payload.append(key, formData[key] ? "true" : "false");
          } else if (key === "picture" && formData[key] instanceof File) {
            payload.append("picture", formData[key]);
          } else if (key !== "picture") {
            payload.append(key, formData[key]);
          }
        }
      }

      const res = await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/register/${username}/`,
        payload,
        {
          headers: {
            "Accept": "application/json",
          },
        }
      );
      
      setSuccessMessage('User information updated successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Set field-specific validation errors
        if (err.response.data) {
          setErrors(err.response.data);
        }
        
        setErrorMessage('Please correct the errors below.');
        console.error("Validation errors:", err.response.data);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error("Error updating user:", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate("/registeraldashboard/biography-edit")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mr-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" /> Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Edit User Biography</h1>
        </div>
        
        {/* Status Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-md flex items-center">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md flex items-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Profile Picture</h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {preview ? (
                    <img
                      src={preview}
                      alt="avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <UserIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <label htmlFor="picture" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                  <CameraIcon className="h-4 w-4" />
                  <input 
                    id="picture" 
                    type="file" 
                    name="picture" 
                    onChange={handleChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </label>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">Upload a clear photo. Maximum file size: 5MB</p>
                {errors.picture && (
                  <p className="text-red-500 text-sm">{errors.picture}</p>
                )}
              </div>
            </div>
          </div>

          {/* Sections */}
          {renderSection(
            "Basic Information",
            "basic",
            SECTION_COLORS.basic,
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                name="userId" 
                label="User ID"
                value={formData.userId}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.userId}
                touched={touched.userId}
                required
              />
              <Input
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
                touched={touched.firstName}
                required
              />
              <Input
                name="fatherName"
                label="Father Name"
                value={formData.fatherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.fatherName}
                touched={touched.fatherName}
                required
              />
              <Input
                name="grandFatherName"
                label="Grand Father Name"
                value={formData.grandFatherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.grandFatherName}
                touched={touched.grandFatherName}
                required
              />
              <Select
                name="gender"
                label="Gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                options={["Male", "Female"]}
                error={errors.gender}
                touched={touched.gender}
                required
              />
            </div>
          )}

          {renderSection(
            "Mother's Information",
            "mother",
            SECTION_COLORS.mother,
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="motherName"
                label="Mother Name"
                value={formData.motherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.motherName}
                touched={touched.motherName}
                required
              />
              <Input
                name="mothersFatherName"
                label="Mother's Father Name"
                value={formData.mothersFatherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.mothersFatherName}
                touched={touched.mothersFatherName}
                required
              />
            </div>
          )}

          {renderSection(
            "Contact Information",
            "contact",
            SECTION_COLORS.contact,
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                name="phoneNumber"
                label="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                // onBlur={handleBlur}
                error={errors.phoneNumber}
                touched={touched.phoneNumber}
                placeholder="+251XXXXXXXXX"
                required
              />
              <Input
                type="date"
                name="dob"
                label="Date of Birth"
                value={formData.dob}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.dob}
                touched={touched.dob}
                required
              />
            </div>
          )}

          {renderSection(
            "Education & Personal Details",
            "education",
            SECTION_COLORS.education,
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Input
                name="religion"
                label="Religion"
                value={formData.religion}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.religion}
                touched={touched.religion}
                required
              />
              <Input
                name="catagory"
                label="Field / Category"
                value={formData.catagory}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.catagory}
                touched={touched.catagory}
                required
              />
              <Input
                name="batch"
                label="Batch"
                value={formData.batch}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.batch}
                touched={touched.batch}
                required
              />
              <Input
                name="entrance_exam"
                label="Entrance Exam Score"
                value={formData.entrance_exam}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.entrance_exam}
                touched={touched.entrance_exam}
              />
            </div>
          )}

          {renderSection(
            "Address Information",
            "address",
            SECTION_COLORS.address,
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="nationality"
                label="Nationality"
                value={formData.nationality}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.nationality}
                touched={touched.nationality}
                required
              />
              <Input
                name="region"
                label="Region"
                value={formData.region}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.region}
                touched={touched.region}
                required
              />
              <Input
                name="zone_or_special_wereda"
                label="Zone / Special Wereda"
                value={formData.zone_or_special_wereda}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.zone_or_special_wereda}
                touched={touched.zone_or_special_wereda}
                required
              />
              <Input
                name="city_or_town"
                label="City / Town"
                value={formData.city_or_town}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.city_or_town}
                touched={touched.city_or_town}
                required
              />
              <Input
                name="house_number"
                label="House Number"
                value={formData.house_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.house_number}
                touched={touched.house_number}
              />
            </div>
          )}

          {renderSection(
            "Additional Information",
            "other",
            SECTION_COLORS.other,
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="handicap"
                label="Handicap / Special Needs"
                value={formData.handicap}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.handicap}
                touched={touched.handicap}
                placeholder="If applicable"
              />
              <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm font-medium text-gray-700">
                  Active Account
                </label>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <button
            
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white py-3 px-6 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Helper to render collapsible sections
  function renderSection(title, key, colorClasses, content) {
    return (
      <div className={`bg-gradient-to-r ${colorClasses} rounded-xl shadow-md hover:shadow-lg transition duration-200 overflow-hidden`}>
        <div
          className="flex justify-between items-center cursor-pointer p-4"
          onClick={() => toggleSection(key)}
        >
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <span className="text-gray-500">
            {openSections[key] ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </span>
        </div>
        {openSections[key] && <div className="p-4 bg-white/50">{content}</div>}
      </div>
    );
  }
}

// Enhanced Input component
function Input({ label, name, value, onChange, onBlur, error, touched, required = false, type = "text", placeholder }) {
  const showError = touched && error;
  
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
          showError 
            ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
        } transition-colors`}
      />
      {showError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}

// Enhanced Select component
function Select({ label, name, value, onChange, onBlur, options, error, touched, required = false }) {
  const showError = touched && error;
  
  return (
    <div className="relative">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
          showError 
            ? "border-red-500 focus:border-red-500 focus:ring-red-200" 
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
        } transition-colors`}
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {showError && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}