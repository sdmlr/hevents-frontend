import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"; // Fallback to localhost if VITE_API_URL is not set

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
