import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Eye = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M1.5 12s4.5-7.5 10.5-7.5S22.5 12 22.5 12s-4.5 7.5-10.5 7.5S1.5 12 1.5 12z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeOff = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <path
      d="M17.94 17.94A10.94 10.94 0 0112 19.5c-6 0-10.5-7.5-10.5-7.5a20.3 20.3 0 014.58-5.32M9.88 9.88a3 3 0 104.24 4.24M1.5 1.5l21 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Changepassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Password rules
  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const allValid = Object.values(passwordChecks).every(Boolean);

  const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
  const strengthPercent = (strengthScore / 5) * 100;
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-green-400",
    "bg-green-600",
  ];
  const strengthColor =
    strengthColors[strengthScore - 1] || "bg-gray-300";
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Strong",
    "Very Strong",
  ];
  const strengthLabel = strengthLabels[strengthScore - 1] || "";

  // ✅ Border color for password input
  // const borderColors = [
  //   "border-red-500",
  //   "border-orange-500",
  //   "border-yellow-500",
  //   "border-green-400",
  //   "border-green-600",
  // ];
  // const borderColor = newPassword
  //   ? borderColors[strengthScore - 1] || "border-gray-300"
  //   : "border-gray-300";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (!allValid) {
      setError("Password does not meet requirements.");
      return;
    }

    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        setError("You must be logged in to change your password.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/change-password/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            old_password: currentPassword,
            new_password: newPassword,
          }),
        }
      );

      if (!response.ok) {
        let data;
        try {
          data = await response.json();
        } catch {
          data = {};
        }
        setError(data.detail || "Failed to change password.");
      } else {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
      }
    } catch {
      setError("Failed to change password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 sm:p-8 md:p-10">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-center text-gray-800">
            Change Password
          </h2>

          {error && (
            <div className="mb-4 p-3 text-sm sm:text-base text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 text-sm sm:text-base text-green-700 bg-green-100 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Current Password */}
            <div className="relative">
              <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                Current Password
              </label>
              <input
                type={showCurrent ? "text" : "password"}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500"
              >
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                New Password
              </label>
              <input
                type={showNew ? "text" : "password"}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500"
              >
                {showNew ? <EyeOff /> : <Eye />}
              </button>

              {/* Password Strength Meter */}
              {newPassword && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded ${strengthColor}`}
                      style={{ width: `${strengthPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 font-medium text-gray-600">
                    {strengthLabel}
                  </p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li className={passwordChecks.length ? "text-green-600" : "text-gray-500"}>
                      ✔ At least 8 characters
                    </li>
                    <li className={passwordChecks.uppercase ? "text-green-600" : "text-gray-500"}>
                      ✔ At least 1 uppercase letter
                    </li>
                    <li className={passwordChecks.lowercase ? "text-green-600" : "text-gray-500"}>
                      ✔ At least 1 lowercase letter
                    </li>
                    <li className={passwordChecks.number ? "text-green-600" : "text-gray-500"}>
                      ✔ At least 1 number
                    </li>
                    <li className={passwordChecks.special ? "text-green-600" : "text-gray-500"}>
                      ✔ At least 1 special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="relative">
              <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type={showConfirm ? "text" : "password"}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500"
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-2 bg-orange-500 hover:bg-orange-600 rounded">
              <button
                type="submit"
                disabled={loading || !allValid}
                className={`w-full ${
                  loading || !allValid
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-black font-medium py-2 sm:py-3 rounded-md transition-colors duration-200 flex items-center justify-center`}
              >
                {loading && (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {loading ? "Processing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Changepassword;
