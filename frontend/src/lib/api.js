import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/api`, 
  withCredentials: true, 
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    // Add any request interceptors here if needed
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);



export default api;

