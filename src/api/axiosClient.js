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

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      // Token invalid/expired — clear and refresh
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      // Optional: redirect to login
      // window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
