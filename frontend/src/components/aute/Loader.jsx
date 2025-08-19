// loaders.js
import axios from "axios";

export const fetchUser = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    const response = await axios.get("http://127.0.0.1:8000/api/users/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
};
