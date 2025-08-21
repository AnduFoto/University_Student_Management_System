// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const UserRegistration = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     fatherName: "",
//     grandFatherName: "",
//     motherName: "",
//     mothersFatherName: "",
//     phoneNumber: "",
//     batch: "",
//     entrance_exam: "",
//     catagory: "",
//     role: "student",
//     gender: "",
//     nationality: "",
//     dob: "",
//     userId: "",
//     is_active: true,
//     is_staff: false,
//     region: "",
//     zone_or_special_wereda: "",
//     city_or_town: "",
//     house_number: "",
//     religion: "",
//     handicap: "normal",
//     position: "",
//     picture: null,
//   });

//   const [choices, setChoices] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch dynamic choices for department/college head
//   useEffect(() => {
//     const fetchChoices = async () => {
//       const token = localStorage.getItem("access");
//       if (!token) return;

//       try {
//         if (formData.role === "college Head") {
//           const res = await axios.get("http://127.0.0.1:8000/api/collages/", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setChoices(res.data.results || []);
//         } else if (formData.role === "department Head") {
//           const res = await axios.get("http://127.0.0.1:8000/api/departments/", {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           setChoices(res.data.results || []);
//         } else {
//           setChoices([]);
//           // For roles with fixed position, automatically set position
//           if (["teacher", "student", "registeral", "president"].includes(formData.role)) {
//             setFormData((prev) => ({ ...prev, position: formData.role }));
//           } else {
//             setFormData((prev) => ({ ...prev, position: "" }));
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching choices:", err);
//         setChoices([]);
//       }
//     };

//     fetchChoices();
//   }, [formData.role]);

//   const handleChange = (e) => {
//     const { name, value, files, type, checked } = e.target;
//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//     } else if (type === "checkbox") {
//       setFormData({ ...formData, [name]: checked });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       // Ensure position is always correctly set
//       let positionValue = formData.position;
//       if (["student", "teacher", "registeral", "president"].includes(formData.role)) {
//         positionValue = formData.role;
//       }
//       if ((formData.role === "department Head" || formData.role === "college Head") && !formData.position) {
//         setMessage("❌ Please select a department or college for this role.");
//         setLoading(false);
//         return;
//       }

//       const data = new FormData();
//       Object.keys(formData).forEach((key) => {
//         if (key === "position") {
//           data.append(key, positionValue);
//         } else if (formData[key] !== null && formData[key] !== undefined) {
//           data.append(key, formData[key]);
//         }
//       });

//       const token = localStorage.getItem("access");

//       await axios.post("http://127.0.0.1:8000/api/register/", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setMessage("✅ Registration successful!");
//       setFormData({
//         firstName: "",
//         fatherName: "",
//         grandFatherName: "",
//         motherName: "",
//         mothersFatherName: "",
//         phoneNumber: "",
//         batch: "",
//         entrance_exam: "",
//         catagory: "",
//         role: "student",
//         gender: "",
//         nationality: "",
//         dob: "",
//         userId: "",
//         is_active: true,
//         is_staff: false,
//         region: "",
//         zone_or_special_wereda: "",
//         city_or_town: "",
//         house_number: "",
//         religion: "",
//         handicap: "normal",
//         position: "student",
//         picture: null,
//       });
//     } catch (err) {
//       console.error("Full error:", err.response?.data || err);
//       setMessage("❌ Registration failed. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fields = [
//     { name: "firstName", label: "First Name", type: "text", required: true },
//     { name: "fatherName", label: "Father Name", type: "text", required: true },
//     { name: "grandFatherName", label: "Grandfather Name", type: "text", required: true },
//     { name: "motherName", label: "Mother Name", type: "text" },
//     { name: "mothersFatherName", label: "Mother's Father Name", type: "text" },
//     { name: "phoneNumber", label: "Phone Number", type: "text" },
//     { name: "batch", label: "Batch", type: "text" },
//     { name: "entrance_exam", label: "Entrance Exam", type: "text" },
//     { name: "catagory", label: "Category", type: "select", options: ["Natural Science", "Social Science", "Other"] },
//     { name: "role", label: "Role", type: "select", options: ["student","registeral","teacher","department Head","college Head","president","admin"] },
//     { name: "gender", label: "Gender", type: "select", options: ["Male","Female","Other"] },
//     { name: "nationality", label: "Nationality", type: "text" },
//     { name: "dob", label: "Date of Birth", type: "date" },
//     { name: "userId", label: "User ID", type: "text" },
//     { name: "region", label: "Region", type: "text" },
//     { name: "zone_or_special_wereda", label: "Zone / Special Wereda", type: "text" },
//     { name: "city_or_town", label: "City / Town", type: "text" },
//     { name: "house_number", label: "House Number", type: "text" },
//     { name: "religion", label: "Religion", type: "text" },
//     { name: "handicap", label: "Handicap", type: "select", options: ["normal","case"] },
//     { name: "is_active", label: "Active User", type: "checkbox" },
//     { name: "is_staff", label: "Staff User", type: "checkbox" },
//     { name: "picture", label: "Profile Picture", type: "file" },
//   ];

//   return (
//     <div className="max-w-5xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
//       <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">User Registration</h2>
//       {message && <div className="mb-4 p-3 text-center bg-gray-100 rounded text-lg">{message}</div>}
//       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {fields.map((field) => {
//           if (field.type === "select") {
//             return (
//               <div key={field.name} className="flex flex-col">
//                 <label className="mb-1 font-medium">{field.label}</label>
//                 <select
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   className="p-2 border rounded-lg"
//                   required={field.required || false}
//                 >
//                   <option value="">Select {field.label}</option>
//                   {field.options.map((opt) => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>
//             );
//           } else if (field.type === "checkbox") {
//             return (
//               <div key={field.name} className="flex items-center gap-2 col-span-2">
//                 <input
//                   type="checkbox"
//                   name={field.name}
//                   checked={formData[field.name]}
//                   onChange={handleChange}
//                   className="h-4 w-4"
//                 />
//                 <label>{field.label}</label>
//               </div>
//             );
//           } else if (field.type === "file") {
//             return (
//               <div key={field.name} className="flex flex-col col-span-2">
//                 <label className="mb-1 font-medium">{field.label}</label>
//                 <input
//                   type="file"
//                   name={field.name}
//                   onChange={handleChange}
//                   className="p-2 border rounded-lg"
//                 />
//               </div>
//             );
//           } else {
//             return (
//               <div key={field.name} className="flex flex-col">
//                 <label className="mb-1 font-medium">{field.label}</label>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   className="p-2 border rounded-lg"
//                   required={field.required || false}
//                 />
//               </div>
//             );
//           }
//         })}

//         {/* Department/College dropdown for heads */}
//         {choices.length > 0 && (
//           <div className="flex flex-col col-span-2">
//             <label className="mb-1 font-medium">
//               Select {formData.role === "college Head" ? "College" : "Department"}
//             </label>
//             <select
//               name="position"
//               value={formData.position}
//               onChange={handleChange}
//               className="p-2 border rounded-lg"
//               required
//             >
//               <option value="">Select</option>
//               {choices.map((choice) => (
//                 <option key={choice.college_code || choice.department_code} value={choice.college_code || choice.department_code}>
//                   {choice.name || choice.department_name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         <div className="col-span-2 text-center bg-orange-600">
//           <button
//             type="submit"
//             className={`px-6 py-2 rounded-lg font-semibold text-white ${loading ? "bg-gray-400" : "bg-blue-700"}`}
//             disabled={loading}
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UserRegistration;






import React, { useState, useEffect } from "react";
import axios from "axios";

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
          const res = await axios.get("http://127.0.0.1:8000/api/collages/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setChoices(res.data.results || []);
        } else if (formData.role === "department Head") {
          const res = await axios.get("http://127.0.0.1:8000/api/departments/", {
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
  const validateField = (name, value) => {
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
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email format";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    let fieldValue;
    
    if (type === "file") fieldValue = files[0];
    else if (type === "checkbox") fieldValue = checked;
    else fieldValue = value;
    
    setFormData({ ...formData, [name]: fieldValue });
    
    // Validate the field as user types
    if (type !== "file") {
      const error = validateField(name, fieldValue);
      setErrors({ ...errors, [name]: error });
    }
  };

  // Validate entire tab
  const validateTab = (tabId) => {
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
  };

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
    const allTabs = ["personal", "contact", "role", "account"];
    let allValid = true;
    let newErrors = {};
    
    allTabs.forEach(tab => {
      const tabErrors = {};
      
      if (tab === "personal") {
        const requiredFields = ["firstName", "fatherName", "grandFatherName", "gender", "nationality", "dob"];
        requiredFields.forEach(field => {
          const error = validateField(field, formData[field]);
          if (error) tabErrors[field] = error;
        });
      }
      
      if (tab === "contact") {
        const error = validateField("phoneNumber", formData.phoneNumber);
        if (error) tabErrors.phoneNumber = error;
        
        if (!formData.region.trim()) tabErrors.region = "Region is required";
      }
      
      if (tab === "role") {
        if (!formData.catagory) tabErrors.catagory = "Category is required";
        
        if ((formData.role === "department Head" || formData.role === "college Head") && !formData.position) {
          tabErrors.position = `Please select a ${formData.role === "college Head" ? "college" : "department"}`;
        }
      }
      
      if (tab === "account") {
        const error = validateField("userId", formData.userId);
        if (error) tabErrors.userId = error;
      }
      
      if (Object.keys(tabErrors).length > 0) {
        allValid = false;
        newErrors = { ...newErrors, ...tabErrors };
      }
    });
    
    if (!allValid) {
      setErrors(newErrors);
      // Switch to the first tab with errors
      const firstErrorTab = allTabs.find(tab => {
        const tabFields = {
          personal: ["firstName", "fatherName", "grandFatherName", "gender", "nationality", "dob"],
          contact: ["phoneNumber", "region"],
          role: ["catagory", "position"],
          account: ["userId"]
        };
        
        return tabFields[tab].some(field => newErrors[field]);
      });
      
      if (firstErrorTab) {
        setActiveTab(firstErrorTab);
      }
      
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        setTimeout(() => {
          const element = document.querySelector(`[name="${firstErrorField}"]`);
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      
      setMessage("❌ Please fix the errors in the form.");
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
      await axios.post("http://127.0.0.1:8000/api/register/", data, {
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
        setMessage("❌ Please fix the errors in the form.");
      } else {
        setMessage("❌ Registration failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if all tabs are completed
  const allTabsCompleted = Object.values(completedTabs).every(tab => tab);

  // Tabs
  const tabs = [
    { id: "personal", label: "Personal Info" },
    { id: "contact", label: "Contact Info" },
    { id: "role", label: "Role & Position" },
    { id: "account", label: "Account Settings" },
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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6 text-center">User Registration Dashboard</h1>

      {message && (
        <div className={`mb-6 p-4 text-center rounded-xl shadow ${
          message.startsWith("✅") 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-6 ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 rounded-xl font-medium transition flex items-center  ${
              activeTab === tab.id
                ? "bg-indigo-600 text-black shadow-lg"
                : completedTabs[tab.id]
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-white text-gray-700 border border-orange-300 hover:bg-indigo-50"
            }`}
          >
            {completedTabs[tab.id] && (
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info */}
        {activeTab === "personal" && (
          <div className="p-6 bg-white rounded-2xl shadow-md grid md:grid-cols-2 gap-6">
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
                      className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                  </div>
                ) : (
                  <div>
                    <input
                      type={field === "dob" ? "date" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
                        errors[field] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Contact Info */}
        {activeTab === "contact" && (
          <div className="p-6 bg-white rounded-2xl shadow-md grid md:grid-cols-2 gap-6">
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
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
                      errors[field] ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors[field] && <p className="mt-1 text-sm text-red-500">{errors[field]}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Role & Position */}
        {activeTab === "role" && (
          <div className="p-6 bg-white rounded-2xl shadow-md grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
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
                    className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
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
                  {errors.position && <p className="mt-1 text-sm text-red-500">{errors.position}</p>}
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
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
                    errors.catagory ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  {["Natural Science", "Social Science", "Other"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.catagory && <p className="mt-1 text-sm text-red-500">{errors.catagory}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === "account" && (
          <div className="p-6 bg-white rounded-2xl shadow-md grid md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">User ID <span className="text-red-500">*</span></label>
              <div>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={`p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition w-full ${
                    errors.userId ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.userId && <p className="mt-1 text-sm text-red-500">{errors.userId}</p>}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-semibold text-gray-700">Handicap</label>
              <select
                name="handicap"
                value={formData.handicap}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              >
                {["normal","case"].map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 col-span-2">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="text-gray-700 font-medium">Active User</label>
            </div>

            <div className="flex items-center gap-3 col-span-2">
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
              <input
                type="file"
                name="picture"
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-lg"
                accept="image/*"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {activeTab !== "personal" && (
            <button
              type="button"
              onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) - 1].id)}
              className="px-6 py-2 bg-orange-500 text-gray-700 rounded-xl font-medium hover:bg-orange-600 transition"
            >
              Previous
            </button>
          )}
          
          {activeTab !== "account" ? (
            <button
              type="button"
              onClick={() => handleTabChange(tabs[tabs.findIndex(tab => tab.id === activeTab) + 1].id)}
              className="px-6 py-2 bg-orange-600 text-black rounded-xl font-medium hover:bg-orange-600 transition ml-auto"
            >
              Next
            </button>
          ) : (
            <div className="bg-orange-500">
            <button
              type="submit"
              disabled={loading || !allTabsCompleted}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transform transition ml-auto ${
                loading 
                  ? "bg-gray-400" 
                  : !allTabsCompleted
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 hover:scale-105"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationDashboard;

