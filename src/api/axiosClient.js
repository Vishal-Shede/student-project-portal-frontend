import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8080/api
  withCredentials: false, // we use JWT header, not cookies
});

// Optional: add token automatically (we'll wire real token in Phase 2)
axiosClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("token"); // temporary; later we’ll switch to context/in-memory
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
