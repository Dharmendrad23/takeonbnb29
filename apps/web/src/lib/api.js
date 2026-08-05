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
  baseURL: `${(getApiBaseUrl() || "").replace(/\/$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// MongoDB documents come back as `_id`; a lot of the app (React Router links,
// favorites, edit/delete actions) was written against PocketBase's `id` field.
// Alias `_id` -> `id` on every response so both keep working.
const normalizeRecord = (record) => {
  if (record && typeof record === "object" && !Array.isArray(record) && record._id && !record.id) {
    return { ...record, id: record._id };
  }
  return record;
};

api.interceptors.response.use((response) => {
  if (Array.isArray(response.data)) {
    response.data = response.data.map(normalizeRecord);
  } else if (response.data && typeof response.data === "object") {
    response.data = normalizeRecord(response.data);
    if (Array.isArray(response.data.items)) {
      response.data.items = response.data.items.map(normalizeRecord);
    }
  }
  return response;
});

export default api;
