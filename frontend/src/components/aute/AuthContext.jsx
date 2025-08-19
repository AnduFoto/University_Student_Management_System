import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    token: localStorage.getItem("access"),
    role: localStorage.getItem("role"),
  });

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, role: null });
    window.location.href = "/login";
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return; // do nothing if no refresh token
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/token/refresh/`, { refresh });
      localStorage.setItem("access", res.data.access);
      setUser(prev => ({ ...prev, token: res.data.access }));
    } catch (err) {
      console.error("Refresh token failed:", err);
      // Do NOT logout immediately; wait for next retry
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("access");
      const refresh = localStorage.getItem("refresh");
      if (!token || !refresh) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiresIn = payload.exp - Math.floor(Date.now() / 1000);

        if (expiresIn < 20) { // refresh if less than 20 sec remaining
          await refreshToken();
        }
      } catch (err) {
        console.error("Error parsing token:", err);
        // Do NOT logout here
      }
    }, 10000); // check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
