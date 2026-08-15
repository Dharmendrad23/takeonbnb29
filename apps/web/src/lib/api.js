import axios from "axios";

const PRODUCTION_API_URL = "https://takeonbnb29.onrender.com";

export const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (
    configuredUrl &&
    configuredUrl !== "undefined" &&
    configuredUrl.trim() !== ""
  ) {
    return configuredUrl.replace(/\/$/, "");
  }

  return PRODUCTION_API_URL;
};

export const buildApiUrl = (path = "") => {
  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
};

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

const normalizeRecord = (record) => {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return record;
  }

  if (record._id && !record.id) {
    return {
      ...record,
      id: record._id,
    };
  }

  return record;
};

api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (Array.isArray(data)) {
      response.data = data.map(normalizeRecord);
    } else if (data && typeof data === "object") {
      if (Array.isArray(data.properties)) {
        response.data = {
          ...data,
          properties: data.properties.map(normalizeRecord),
        };
      } else if (Array.isArray(data.items)) {
        response.data = {
          ...data,
          items: data.items.map(normalizeRecord),
        };
      } else if (Array.isArray(data.data)) {
        response.data = {
          ...data,
          data: data.data.map(normalizeRecord),
        };
      } else {
        response.data = normalizeRecord(data);
      }
    }

    return response;
  },

  (error) => {
    console.error(
      "[TakeOnBNB API Error]",
      error.response?.status || "NETWORK ERROR",
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;