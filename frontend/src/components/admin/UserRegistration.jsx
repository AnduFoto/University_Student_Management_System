import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  UserIcon,
  IdentificationIcon,
  AcademicCapIcon,
  CogIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";

const UserRegistrationDashboard = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    fatherName: "",
    grandFatherName: "",
    motherName: "",
    mothersFatherName: "",
    phoneNumber: "",
    batch: "",
    entrance_exam: "",
    catagory: "",
    role: "student",
    gender: "",
    nationality: "",
    dob: "",
    userId: "",
    is_active: true,
    is_staff: false,
    region: "",
    zone_or_special_wereda: "",
    city_or_town: "",
    house_number: "",
    religion: "",
    handicap: "normal",
    position: "",
    picture: null,
  });

  const [choices, setChoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("personal");
  const [errors, setErrors] = useState({});
  const [visitedTabs, setVisitedTabs] = useState(new Set(["personal"]));
  const [touchedFields, setTouchedFields] = useState({});
  const [allTabsCompleted, setAllTabsCompleted] = useState(false);

  // Track which tabs have been completed
  const [completedTabs, setCompletedTabs] = useState({
    personal: false,
    contact: false,
    role: false,
    account: false
  });

  useEffect(() => {
    const fetchChoices = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      try {
        if (formData.role === "college Head") {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collages/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChoices(res.data.results || []);
        } else if (formData.role === "department Head") {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/departments/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChoices(res.data.results || []);
        } else {
          setChoices([]);
          if (["teacher", "student", "registeral", "president"].includes(formData.role)) {
            setFormData((prev) => ({ ...prev, position: formData.role }));
          } else {
            setFormData((prev) => ({ ...prev, position: "" }));
          }
        }
      } catch (err) {
        console.error(err);
        setChoices([]);
      }
    };

    fetchChoices();
  }, [formData.role]);

  // Validation rules for each field
  const validateField = useCallback((name, value) => {
    let error = "";
    
    switch(name) {
      case "firstName":
      case "fatherName":
      case "grandFatherName":
      case "motherName":
      case "mothersFatherName":
        if (!value.trim()) error = "This field is required";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters and spaces allowed";
        break;
      case "phoneNumber":
        if (!value.trim()) error = "Phone number is required";
        else if (!/^\+?[0-9]{10,15}$/.test(value)) error = "Invalid phone number format";
        break;
      case "userId":
        if (!value.trim()) error = "User ID is required";
        break;
      case "gender":
      case "nationality":
      case "dob":
      case "region":
        if (!value.trim()) error = "This field is required";
        break;
      default:
        break;
    }
    
    return error;
  }, []);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    let fieldValue;
    
    if (type === "file") fieldValue = files[0];
    else if (type === "checkbox") fieldValue = checked;
    else fieldValue = value;
    
    setFormData({ ...formData, [name]: fieldValue });
    
    // Mark field as touched
    setTouchedFields({ ...touchedFields, [name]: true });
    
    // Validate the field as user types
    if (type !== "file") {
      const error = validateField(name, fieldValue);
      setErrors({ ...errors, [name]: error });
    }
  };

  // Validate entire tab
  const validateTab = useCallback((tabId) => {
    const newErrors = {};
    
    if (tabId === "personal") {
      const requiredFields = ["firstName", "fatherName", "grandFatherName", "gender", "nationality", "dob"];
      requiredFields.forEach(field => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      });
    }
    
    if (tabId === "contact") {
      const error = validateField("phoneNumber", formData.phoneNumber);
      if (error) newErrors.phoneNumber = error;
      
      if (!formData.region.trim()) newErrors.region = "Region is required";
    }
    
    if (tabId === "role") {
      if (!formData.catagory) newErrors.catagory = "Category is required";
      
      if ((formData.role === "department Head" || formData.role === "college Head") && !formData.position) {
        newErrors.position = `Please select a ${formData.role === "college Head" ? "college" : "department"}`;
      }
    }
    
    if (tabId === "account") {
      const error = validateField("userId", formData.userId);
      if (error) newErrors.userId = error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Check if all tabs are completed
  const checkAllTabsCompleted = useCallback(() => {
    const personalValid = validateTab("personal");
    const contactValid = validateTab("contact");
    const roleValid = validateTab("role");
    const accountValid = validateTab("account");
    
    return personalValid && contactValid && roleValid && accountValid;
  }, [validateTab]);

  // Update allTabsCompleted state when form data changes
  useEffect(() => {
    const completed = checkAllTabsCompleted();
    setAllTabsCompleted(completed);
  }, [formData, checkAllTabsCompleted]);

  const handleTabChange = (tabId) => {
    // Validate current tab before allowing navigation
    if (activeTab !== tabId) {
      const isValid = validateTab(activeTab);
      
      if (isValid) {
        setCompletedTabs({ ...completedTabs, [activeTab]: true });
        setActiveTab(tabId);
        setVisitedTabs(new Set([...visitedTabs, tabId]));
      } else {
        // Scroll to first error
        const firstErrorField = Object.keys(errors)[0];
        if (firstErrorField) {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all tabs before submission
    const allValid = checkAllTabsCompleted();
    
    if (!allValid) {
      setMessage("Please fix the errors in the form.");
      
      // Find the first tab with errors and switch to it
      const tabsToCheck = ["personal", "contact", "role", "account"];
      for (const tab of tabsToCheck) {
        const tabValid = validateTab(tab);
        if (!tabValid) {
          setActiveTab(tab);
          break;
        }
      }
      
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      let positionValue = formData.position;
      if (["student", "teacher", "registeral", "president"].includes(formData.role)) {
        positionValue = formData.role;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "position") data.append(key, positionValue);
        else if (formData[key] !== null && formData[key] !== undefined) data.append(key, formData[key]);
      });

      const token = localStorage.getItem("access");
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/register/`, data, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Registration successful!");
      setFormData({
        firstName: "",
        fatherName: "",
        grandFatherName: "",
        motherName: "",
        mothersFatherName: "",
        phoneNumber: "",
        batch: "",
        entrance_exam: "",
        catagory: "",
        role: "student",
        gender: "",
        nationality: "",
        dob: "",
        userId: "",
        is_active: true,
        is_staff: false,
        region: "",
        zone_or_special_wereda: "",
        city_or_town: "",
        house_number: "",
        religion: "",
        handicap: "normal",
        position: "student",
        picture: null,
      });
      
      // Reset completion status
      setCompletedTabs({
        personal: false,
        contact: false,
        role: false,
        account: false
      });
      
      // Reset touched fields
      setTouchedFields({});
    } catch (err) {
      console.error(err.response?.data || err);
      
      // Handle server-side validation errors
      if (err.response?.data) {
        const serverErrors = {};
        Object.keys(err.response.data).forEach(key => {
          serverErrors[key] = Array.isArray(err.response.data[key]) 
            ? err.response.data[key].join(" ") 
            : err.response.data[key];
        });
        setErrors(serverErrors);
        setMessage("Please fix the errors in the form.");
      } else {
        setMessage("Registration failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Tabs
  const tabs = [
    { id: "personal", label: "Personal Info", icon: UserIcon },
    { id: "contact", label: "Contact Info", icon: IdentificationIcon },
    { id: "role", label: "Role & Position", icon: AcademicCapIcon },
    { id: "account", label: "Account Settings", icon: CogIcon },
  ];

  // Format field name for display
  const formatFieldName = (field) => {
    return field
      .replace(/_/g, " ")
      .replace(/([A-Z])/g, " $1")
      .replace(/^\w/, c => c.toUpperCase())
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">User Registration Dashboard</h1>
          <p className="text-gray-600">Register new users with a simple multi-step process</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl shadow-lg ${
            message.startsWith("✅") 
              ? "bg-green-100 text-green-800 border border-green-200" 
              : "bg-red-100 text-red-800 border border-red-200"
          }`}>
            <div className="flex items-center justify-center">
              {message.startsWith("✅") ? (
                <CheckCircleIcon className="h-5 w-5 mr-2" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              )}
              {message}
            </div>
          </div>
        )}

        {/* Progress Tabs */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-6 py-4 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-white text-indigo-600 shadow-lg border-2 border-indigo-200"
                    : completedTabs[tab.id]
                    ? "bg-green-50 text-green-700 border-2 border-green-200"
                    : "bg-white text-gray-600 border-2 border-gray-200 hover:border-indigo-300"
                }`}
              >
                <div className={`rounded-full p-2 mr-3 ${
                  activeTab === tab.id
                    ? "bg-indigo-100 text-indigo-600"
                    : completedTabs[tab.id]
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                <span className="font-medium">{tab.label}</span>
                {completedTabs[tab.id] && (
                  <CheckCircleIcon className="h-5 w-5 ml-2 text-green-500" />
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Personal Info */}
            {activeTab === "personal" && (
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold text-gray-800 md:col-span-2 flex items-center">
                  <UserIcon className="h-6 w-6 mr-2 text-indigo-600" />
                  Personal Information
                </h2>
                
                {["firstName","fatherName","grandFatherName","motherName","mothersFatherName","dob","gender","nationality"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">
                      {formatFieldName(field)} {["firstName", "fatherName", "grandFatherName", "gender", "nationality", "dob"].includes(field) && <span className="text-red-500">*</span>}
                    </label>
                    {field === "gender" ? (
                      <div>
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                            errors[field] ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors[field] && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors[field]}</p>}
                      </div>
                    ) : (
                      <div>
                        <input
                          type={field === "dob" ? "date" : "text"}
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                            errors[field] ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors[field] && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors[field]}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Contact Info */}
            {activeTab === "contact" && (
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold text-gray-800 md:col-span-2 flex items-center">
                  <IdentificationIcon className="h-6 w-6 mr-2 text-indigo-600" />
                  Contact Information
                </h2>
                
                {["phoneNumber","region","zone_or_special_wereda","city_or_town","house_number","religion"].map((field) => (
                  <div key={field} className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">
                      {formatFieldName(field)} {["phoneNumber", "region"].includes(field) && <span className="text-red-500">*</span>}
                    </label>
                    <div>
                      <input
                        type="text"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                          errors[field] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[field] && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors[field]}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Role & Position */}
            {activeTab === "role" && (
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold text-gray-800 md:col-span-2 flex items-center">
                  <AcademicCapIcon className="h-6 w-6 mr-2 text-indigo-600" />
                  Role & Position
                </h2>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  >
                    {["student","registeral","teacher","department Head","college Head","president","admin"].map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {choices.length > 0 && (
                  <div className="flex flex-col">
                    <label className="mb-2 font-semibold text-gray-700">
                      Select {formData.role === "college Head" ? "College" : "Department"} <span className="text-red-500">*</span>
                    </label>
                    <div>
                      <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                          errors.position ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select</option>
                        {choices.map((c) => (
                          <option key={c.college_code || c.department_code} value={c.college_code || c.department_code}>
                            {c.name || c.department_name}
                          </option>
                        ))}
                      </select>
                      {errors.position && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors.position}</p>}
                    </div>
                  </div>
                )}

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">Category <span className="text-red-500">*</span></label>
                  <div>
                    <select
                      name="catagory"
                      value={formData.catagory}
                      onChange={handleChange}
                      className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                        errors.catagory ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Category</option>
                      {["Natural Science", "Social Science", "Other"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.catagory && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors.catagory}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="p-8 grid md:grid-cols-2 gap-6">
                <h2 className="text-2xl font-bold text-gray-800 md:col-span-2 flex items-center">
                  <CogIcon className="h-6 w-6 mr-2 text-indigo-600" />
                  Account Settings
                </h2>
                
                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">User ID <span className="text-red-500">*</span></label>
                  <div>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition w-full ${
                        errors.userId ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.userId && <p className="mt-1 text-sm text-red-500 flex items-center"><ExclamationCircleIcon className="h-4 w-4 mr-1" /> {errors.userId}</p>}
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-2 font-semibold text-gray-700">Handicap</label>
                  <select
                    name="handicap"
                    value={formData.handicap}
                    onChange={handleChange}
                    className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
                  >
                    {["normal","case"].map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-gray-700 font-medium">Active User</label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg col-span-2">
                  <input
                    type="checkbox"
                    name="is_staff"
                    checked={formData.is_staff}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-gray-700 font-medium">Staff User</label>
                </div>

                <div className="flex flex-col col-span-2">
                  <label className="mb-2 font-semibold text-gray-700">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors">
                      <PhotoIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 text-center">Upload Photo</span>
                      <input
                        type="file"
                        name="picture"
                        onChange={handleChange}
                        className="hidden"
                        accept="image/*"
                      />
                    </label>
                    {formData.picture && (
                      <span className="text-sm text-green-600">File selected</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {activeTab !== "personal" && (
              <button
                type="button"
                onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) - 1].id)}
                className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 transition shadow-md"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Previous
              </button>
            )}
            
            {activeTab !== "account" ? (
              <button
                type="button"
                onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) + 1].id)}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition shadow-md ml-auto"
              >
                Next
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || !allTabsCompleted}
                className={`flex items-center px-8 py-3 rounded-xl font-bold text-white shadow-lg transform transition ml-auto ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : !allTabsCompleted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Register User
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegistrationDashboard;