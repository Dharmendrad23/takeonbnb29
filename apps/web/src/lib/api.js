import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  console.error("VITE_API_URL is not set. Please configure it in your .env file.");
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
