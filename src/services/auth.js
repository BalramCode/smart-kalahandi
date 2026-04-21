// 1. Import 'api' (the axios instance), not BASE_URL
import api from "./api"; 

export const loginUser = async (email, password) => {
  try {
    // 2. Use api.post instead of fetch
    // Notice we don't need the full URL or headers anymore
    const res = await api.post("/auth/login", { email, password });

    // 3. Axios puts the server response in .data
    return res.data; 
  } catch (error) {
    // 4. Improved error logging
    console.error("Login error:", error.response?.data?.message || error.message);
    throw error;
  }
};