
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";
const MEDIA_BASE_URL = "http://127.0.0.1:8000";


const SECTION_COLORS = {
  basic: "from-blue-100 to-blue-200 border-blue-300",
  mother: "from-orange-100 to-orange-200 border-orange-300",
  contact: "from-gray-100 to-gray-200 border-gray-300",
  education: "from-purple-100 to-purple-200 border-purple-300",
  address: "from-indigo-100 to-indigo-200 border-indigo-300",
  other: "from-gray-300 to-gray-400 border-gray-300",
};

export default function UseBiography() {
  const { userId } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({

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
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
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

  // Fetch user biography
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/register/${userId}/`);
        const user = res.data;

        setFormData({
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
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, picture: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Submit updated data
 const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({});

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
      `${API_BASE_URL}/register/${userId}/`,
      payload,
      {
        headers: {
      
          "Accept": "application/json",
        },
      }
    );
      setSuccessMessage('Registration successful!');
      setTimeout(() => setSuccessMessage(''), 5000);
      navigate("/registeraldashboard/biography-edit");
    // alert("User updated successfully!");
    console.log("Updated:", res.data);
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // setErrors(err.response.data);
     setErrorMessage('Registration failed. Check your network or input.');
     setTimeout(() => setErrorMessage(''), 5000);
      console.error("Validation errors:", err.response.data);
    } else {
      console.error("Error updating user:", err);
    }
  }
};


  if (loading) return <p className="p-6">Loading user data...</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Edit User Biography</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border">
            {preview ? (
              <img
                src={preview}
                alt="avatar preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <input type="file" name="picture" onChange={handleChange} />
        </div>

        {/* Sections */}
        {renderSection(
          "Basic Info",
          "basic",
          SECTION_COLORS.basic,
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />
            <Input
              name="fatherName"
              label="Father Name"
              value={formData.fatherName}
              onChange={handleChange}
              error={errors.fatherName}
            />
            <Input
              name="grandFatherName"
              label="Grand Father Name"
              value={formData.grandFatherName}
              onChange={handleChange}
              error={errors.grandFatherName}
            />
            <Select
              name="gender"
              label="Gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female"]}
              error={errors.gender}
            />
          </div>
        )}

        {renderSection(
          "Mother Info",
          "mother",
          SECTION_COLORS.mother,
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="motherName"
              label="Mother Name"
              value={formData.motherName}
              onChange={handleChange}
              error={errors.motherName}
            />
            <Input
              name="mothersFatherName"
              label="Mother's Father Name"
              value={formData.mothersFatherName}
              onChange={handleChange}
              error={errors.mothersFatherName}
            />
          </div>
        )}

        {renderSection(
          "Contact Info",
          "contact",
          SECTION_COLORS.contact,
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
            />
            <Input
              type="date"
              name="dob"
              label="Date of Birth"
              value={formData.dob}
              onChange={handleChange}
              error={errors.dob}
            />
          </div>
        )}

        {renderSection(
          "Education / Personal",
          "education",
          SECTION_COLORS.education,
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="religion"
              label="Religion"
              value={formData.religion}
              onChange={handleChange}
              error={errors.religion}
            />
            <Input
              name="catagory"
              label="Field / Category"
              value={formData.catagory}
              onChange={handleChange}
              error={errors.catagory}
            />
            <Input
              name="batch"
              label="Batch"
              value={formData.batch}
              onChange={handleChange}
              error={errors.batch}
            />
            <Input
              name="entrance_exam"
              label="Entrance Exam"
              value={formData.entrance_exam}
              onChange={handleChange}
              error={errors.entrance_exam}
            />
          </div>
        )}

        {renderSection(
          "Address",
          "address",
          SECTION_COLORS.address,
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="nationality"
              label="Nationality"
              value={formData.nationality}
              onChange={handleChange}
              error={errors.nationality}
            />
            <Input
              name="region"
              label="Region"
              value={formData.region}
              onChange={handleChange}
              error={errors.region}
            />
            <Input
              name="zone_or_special_wereda"
              label="Zone / Special Wereda"
              value={formData.zone_or_special_wereda}
              onChange={handleChange}
              error={errors.zone_or_special_wereda}
            />
            <Input
              name="city_or_town"
              label="City / Town"
              value={formData.city_or_town}
              onChange={handleChange}
              error={errors.city_or_town}
            />
            <Input
              name="house_number"
              label="House Number"
              value={formData.house_number}
              onChange={handleChange}
              error={errors.house_number}
            />
          </div>
        )}

        {renderSection(
          "Other",
          "other",
          SECTION_COLORS.other,
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="handicap"
              label="Handicap"
              value={formData.handicap}
              onChange={handleChange}
              error={errors.handicap}
            />
            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="mr-2"
              />
              <label>Is Active</label>
            </div>
          </div>
        )}

         {successMessage && (
          <div className="mb-6 p-3 bg-green-200 text-green-800 rounded text-center font-medium">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-200 text-red-800 rounded text-center font-medium">{errorMessage}</div>
        )}

      <div className="bg-orange-600 hover:bg-orange-700 flex items-center justify-center rounded">
          <button
          type="submit"
          className=" text-white px-80 py-2 rounded "
       

        >
          Save Changes
        </button>
      </div>
      </form>
    </div>
  );

  // Helper to render collapsible sections
  function renderSection(title, key, colorClasses, content) {
    return (
      <div className={`bg-gradient-to-r ${colorClasses} p-4 rounded shadow-md hover:shadow-lg transition duration-200`}>
        <div
          className="flex justify-between cursor-pointer mb-2"
          onClick={() => toggleSection(key)}
        >
          <h2 className="text-lg font-semibold">{title}</h2>
          <span>{openSections[key] ? "▲" : "▼"}</span>
        </div>
        {openSections[key] && <div>{content}</div>}
      </div>
    );
  }
}

// Reusable Input component
function Input({ label, name, value, onChange, error, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}

// Reusable Select component
function Select({ label, name, value, onChange, options, error }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border px-3 py-2 rounded w-full focus:outline-none focus:ring focus:border-blue-300"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}