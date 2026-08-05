import axios from "axios";

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;
  if (configured && configured !== "undefined" && configured !== "") {
    return configured;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:3001";
    }

    if (host.includes("takeonbnb") || host.includes("netlify") || host.includes("horizons")) {
      return "https://takeonbnb29.onrender.com";
    }
  }

  return "https://takeonbnb29.onrender.com";
};

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${normalizedPath}` : normalizedPath;
};

const api = axios.create({
  baseURL: getApiBaseUrl() || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
