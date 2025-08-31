import React, { useState } from "react";

const API_BASE = "http://localhost:8000/api";

export default function PasswordResetPage() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [warning, setWarning] = useState("");
  
  const getAuthToken = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return null;
    }
    return token;
  };

  const fetchUser = async () => {
    const token = getAuthToken();
    if (!token) return;
    
    setLoading(true);
    setError("");
    setUser(null);
    setWarning("");
    try {
      const res = await fetch(`${API_BASE}/users/${username}/`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("User not found");
        } else if (res.status === 401 || res.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          const data = await res.json();
          throw new Error(data.detail || `Server error: ${res.status}`);
        }
      }
      
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmResetPassword = () => {
    if (!user) return;
    setShowConfirmModal(true);
  };

  const resetPassword = async () => {
    const token = getAuthToken();
    if (!token) return;
    
    setError("");
    setLoading(true);
    setWarning("");
    try {
      const res = await fetch(
        `${API_BASE}/users/${username}/reset-password/`,
        {
          method: "POST",
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 400) {
          throw new Error(data.detail || "Bad request");
        } else if (res.status === 401 || res.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        } else if (res.status === 404) {
          throw new Error("User not found. The username may be incorrect.");
        } else {
          throw new Error(data.detail || `Server error: ${res.status}`);
        }
      }
      
      const data = await res.json();
      setNewPassword(data.new_password || "default_password");
      setModalMessage(data.detail || "Password reset successfully!");
      
      // Show warning if picture was corrupted
      if (data.warning) {
        setWarning(data.warning);
      }
      
      // Update user data with the response
      setUser({
        ...user,
        ...data
      });
      
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchUser();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Password Reset Administration</h2>

        {/* Search Section */}
        <div className="mb-6">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Username to Reset Password
          </label>
          <div className="flex">
            <input
              id="username"
              type="text"
              className="border border-gray-300 p-3 flex-1 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={fetchUser}
              disabled={loading || !username.trim()}
              className="bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        {warning && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Note: </strong>
            <span>{warning}</span>
          </div>
        )}

        {/* User Info */}
        {user && (
          <div className="border border-gray-200 p-4 rounded-lg shadow-sm mb-6 bg-white">
            <div className="flex items-center mb-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mr-4 object-cover border border-gray-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              {/* <div className="w-20 h-20 rounded-full mr-4 bg-blue-100 flex items-center justify-center border border-gray-300">
                <span className="text-blue-600 font-medium text-2xl">
                  {user.firstName?.charAt(0) || 'U'}
                </span>
              </div> */}
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {user.firstName} {user.fatherName} {user.grandFatherName}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Username:</span> {user.username}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">User ID:</span> {user.userId}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Role:</span> {user.role || "N/A"}
                </p>
              </div>
            </div>

            <button
              onClick={confirmResetPassword}
              disabled={loading}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 transition-colors w-full"
            >
              {loading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Password Reset</h3>
              
              <p className="text-yellow-700 bg-yellow-50 p-3 rounded-md mb-4">
                <strong>Warning:</strong> Resetting the password will immediately change the user's password to the default system password.
              </p>
              <p className="mb-4 text-gray-600">
                Are you sure you want to reset the password for <strong>{user?.firstName} {user?.fatherName} {user?.grandFatherName}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={resetPassword}
                  disabled={loading}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 transition-colors"
                >
                  {loading ? "Resetting..." : "Confirm Reset"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {modalMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Success!</h3>
              </div>
              <p className="mb-4 text-gray-700">{modalMessage}</p>
              {newPassword && (
                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">New Default Password:</p>
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                    <code className="font-mono text-sm">{newPassword}</code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(newPassword);
                        alert('Password copied to clipboard!');
                      }}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Please provide this password to the user. They should change it after logging in.
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setModalMessage("");
                  setUser(null);
                  setUsername("");
                  setWarning("");
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Instructions Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
            <li>Enter the username of the account you want to reset</li>
            <li>Click "Search" to verify the user account</li>
            <li>Click "Reset Password" to reset to the default password</li>
            <li>Provide the new password to the user securely</li>
            <li>The user should change their password after first login</li>
          </ul>
        </div>
      </div>
    </div>
  );
}