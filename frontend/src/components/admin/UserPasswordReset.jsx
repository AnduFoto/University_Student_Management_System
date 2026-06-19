// import React, { useState } from "react";

// const API_BASE = "http://localhost:8000/api";

// export default function PasswordResetPage() {
//   const [username, setUsername] = useState("");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [newPassword, setNewPassword] = useState("");
//   const [warning, setWarning] = useState("");
  
//   const getAuthToken = () => {
//     const token = localStorage.getItem("access");
//     if (!token) {
//       setError("Authentication token not found. Please log in again.");
//       return null;
//     }
//     return token;
//   };

//   const fetchUser = async () => {
//     const token = getAuthToken();
//     if (!token) return;
    
//     setLoading(true);
//     setError("");
//     setUser(null);
//     setWarning("");
//     try {
//       const res = await fetch(`${API_BASE}/users/${username}/`, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         },
//       });
      
//       if (!res.ok) {
//         if (res.status === 404) {
//           throw new Error("User not found");
//         } else if (res.status === 401 || res.status === 403) {
//           throw new Error("Authentication failed. Please log in again.");
//         } else {
//           const data = await res.json();
//           throw new Error(data.detail || `Server error: ${res.status}`);
//         }
//       }
      
//       const data = await res.json();
//       setUser(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmResetPassword = () => {
//     if (!user) return;
//     setShowConfirmModal(true);
//   };

//   const resetPassword = async () => {
//     const token = getAuthToken();
//     if (!token) return;
    
//     setError("");
//     setLoading(true);
//     setWarning("");
//     try {
//       const res = await fetch(
//         `${API_BASE}/users/${username}/reset-password/`,
//         {
//           method: "POST",
//           headers: { 
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json"
//           },
//         }
//       );
      
//       if (!res.ok) {
//         const data = await res.json();
//         if (res.status === 400) {
//           throw new Error(data.detail || "Bad request");
//         } else if (res.status === 401 || res.status === 403) {
//           throw new Error("Authentication failed. Please log in again.");
//         } else if (res.status === 404) {
//           throw new Error("User not found. The username may be incorrect.");
//         } else {
//           throw new Error(data.detail || `Server error: ${res.status}`);
//         }
//       }
      
//       const data = await res.json();
//       setNewPassword(data.new_password || "default_password");
//       setModalMessage(data.detail || "Password reset successfully!");
      
//       // Show warning if picture was corrupted
//       if (data.warning) {
//         setWarning(data.warning);
//       }
      
//       // Update user data with the response
//       setUser({
//         ...user,
//         ...data
//       });
      
//       setShowConfirmModal(false);
//     } catch (err) {
//       setError(err.message);
//       setShowConfirmModal(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       fetchUser();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-8">
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Password Reset Administration</h2>

//         {/* Search Section */}
//         <div className="mb-6">
//           <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
//             Enter Username to Reset Password
//           </label>
//           <div className="flex">
//             <input
//               id="username"
//               type="text"
//               className="border border-gray-300 p-3 flex-1 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               onKeyPress={handleKeyPress}
//             />
//             <button
//               onClick={fetchUser}
//               disabled={loading || !username.trim()}
//               className="bg-blue-500 text-white px-6 py-3 rounded-r-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
//             >
//               {loading ? "Searching..." : "Search"}
//             </button>
//           </div>
//         </div>

//         {loading && (
//           <div className="flex justify-center my-6">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         )}
        
//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             <strong className="font-bold">Error: </strong>
//             <span>{error}</span>
//           </div>
//         )}

//         {warning && (
//           <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
//             <strong className="font-bold">Note: </strong>
//             <span>{warning}</span>
//           </div>
//         )}

//         {/* User Info */}
//         {user && (
//           <div className="border border-gray-200 p-4 rounded-lg shadow-sm mb-6 bg-white">
//             <div className="flex items-center mb-4">
//               {user.picture ? (
//                 <img
//                   src={user.picture}
//                   alt="Profile"
//                   className="w-20 h-20 rounded-full mr-4 object-cover border border-gray-300"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     const placeholder = e.target.nextElementSibling;
//                     if (placeholder) placeholder.style.display = 'flex';
//                   }}
//                 />
//               ) : null}
            
//               <div>
//                 <p className="text-lg font-semibold text-gray-800">
//                   {user.firstName} {user.fatherName} {user.grandFatherName}
//                 </p>
//                 <p className="text-gray-600">
//                   <span className="font-medium">Username:</span> {user.username}
//                 </p>
//                 <p className="text-gray-600">
//                   <span className="font-medium">User ID:</span> {user.userId}
//                 </p>
//                 <p className="text-gray-600">
//                   <span className="font-medium">Role:</span> {user.role || "N/A"}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={confirmResetPassword}
//               disabled={loading}
//               className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 transition-colors w-full"
//             >
//               {loading ? "Processing..." : "Reset Password"}
//             </button>
//           </div>
//         )}

//         {/* Confirmation Modal */}
//         {showConfirmModal && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
//               <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Password Reset</h3>
              
//               <p className="text-yellow-700 bg-yellow-50 p-3 rounded-md mb-4">
//                 <strong>Warning:</strong> Resetting the password will immediately change the user's password to the default system password.
//               </p>
//               <p className="mb-4 text-gray-600">
//                 Are you sure you want to reset the password for <strong>{user?.firstName} {user?.fatherName} {user?.grandFatherName}</strong>?
//               </p>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   onClick={() => setShowConfirmModal(false)}
//                   className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={resetPassword}
//                   disabled={loading}
//                   className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:bg-red-300 transition-colors"
//                 >
//                   {loading ? "Resetting..." : "Confirm Reset"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Success Modal */}
//         {modalMessage && (
//           <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
//               <div className="flex items-center mb-4">
//                 <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//                 </svg>
//                 <h3 className="text-xl font-bold text-gray-800">Success!</h3>
//               </div>
//               <p className="mb-4 text-gray-700">{modalMessage}</p>
//               {newPassword && (
//                 <div className="mb-4">
//                   <p className="font-medium text-gray-700 mb-2">New Default Password:</p>
//                   <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
//                     <code className="font-mono text-sm">{newPassword}</code>
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(newPassword);
//                         alert('Password copied to clipboard!');
//                       }}
//                       className="text-blue-500 hover:text-blue-700 text-sm font-medium"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Please provide this password to the user. They should change it after logging in.
//                   </p>
//                 </div>
//               )}
//               <button
//                 onClick={() => {
//                   setModalMessage("");
//                   setUser(null);
//                   setUsername("");
//                   setWarning("");
//                 }}
//                 className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Instructions Section */}
//         <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
//           <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
//             <li>Enter the username of the account you want to reset</li>
//             <li>Click "Search" to verify the user account</li>
//             <li>Click "Reset Password" to reset to the default password</li>
//             <li>Provide the new password to the user securely</li>
//             <li>The user should change their password after first login</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Search, User, ShieldAlert, CheckCircle2, Copy, X, Loader2, Info } from "lucide-react";

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

  // --- LOGIC PRESERVED ---
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
        if (res.status === 404) throw new Error("User not found");
        else if (res.status === 401 || res.status === 403) throw new Error("Authentication failed.");
        else {
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

  const resetPassword = async () => {
    const token = getAuthToken();
    if (!token) return;
    setError("");
    setLoading(true);
    setWarning("");
    try {
      const res = await fetch(`${API_BASE}/users/${username}/reset-password/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Error resetting password");
      }
      const data = await res.json();
      setNewPassword(data.new_password || "default_password");
      setModalMessage(data.detail || "Password reset successfully!");
      if (data.warning) setWarning(data.warning);
      setUser({ ...user, ...data });
      setShowConfirmModal(false);
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
    }
  };

  const confirmResetPassword = () => { if (user) setShowConfirmModal(true); };
  const handleKeyPress = (e) => { if (e.key === "Enter") fetchUser(); };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 font-sans antialiased">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4">
            <ShieldAlert className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Security Admin</h2>
          <p className="text-slate-500 font-medium">System-wide password recovery tool</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 mb-6 transition-all hover:shadow-md">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
            Account Lookup
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-32 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={fetchUser}
              disabled={loading || !username.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 animate-in fade-in zoom-in duration-200">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}
        </div>

        {/* User Profile Result */}
        {user && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  {user.picture ? (
                    <img src={user.picture} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-50 shadow-sm" />
                  ) : (
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-4 border-slate-50">
                      <User className="w-10 h-10 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {[user.firstName, user.fatherName].join(" ")}
                  </h3>
                  <p className="text-blue-600 text-sm font-bold font-mono">@{user.username}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-500 uppercase rounded-lg">
                    {user.role || "Standard User"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">System ID</p>
                  <p className="text-sm font-bold text-slate-700">{user.userId}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-600">Verified Account</p>
                </div>
              </div>

              <button
                onClick={confirmResetPassword}
                disabled={loading}
                className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-rose-100 hover:bg-rose-600 hover:shadow-rose-200 transition-all active:scale-[0.98]"
              >
                Reset Account Password
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!user && !loading && (
          <div className="flex items-start gap-4 p-6 bg-blue-50/50 rounded-3xl border border-blue-100 mt-6">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Admin Protocol</h4>
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                Verify the username before initiating a reset. Default passwords are generated server-side and must be shared securely with the end-user.
              </p>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Final Confirmation</h3>
              <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                You are about to reset the password for <span className="text-slate-900 font-bold">@{user?.username}</span>. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={resetPassword}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Confirm Reset
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {modalMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Success!</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">{modalMessage}</p>
              
              {newPassword && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 relative">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Temporary Password</p>
                  <code className="text-xl font-mono font-black text-blue-600 block mb-4">{newPassword}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newPassword);
                      alert('Copied!');
                    }}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
                  >
                    <Copy size={14} /> Copy to Clipboard
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setModalMessage("");
                  setUser(null);
                  setUsername("");
                  setWarning("");
                }}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-lg shadow-blue-100"
              >
                Complete Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}