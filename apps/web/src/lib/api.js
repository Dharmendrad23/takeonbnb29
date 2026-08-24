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
  if (
    !record ||
    typeof record !== "object" ||
    Array.isArray(record)
  ) {
    return record;
  }

  if (record._id && !record.id) {
    return {
      ...record,
      id: String(record._id),
    };
  }

  return record;
};


/* =========================================
   ADMIN AUTH TOKEN
========================================= */

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("adminToken")

    if (adminToken) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${adminToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)
api.interceptors.response.use(
  (response) => {
    const data = response.data;
    const url = String(response.config?.url || "");

    const isPropertyCollection =
      /^\/properties(?:\?.*)?$/.test(url);

    if (
      isPropertyCollection &&
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      if (Array.isArray(data.properties)) {
        response.data =
          data.properties.map(normalizeRecord);

        return response;
      }

      if (Array.isArray(data.items)) {
        response.data =
          data.items.map(normalizeRecord);

        return response;
      }

      if (Array.isArray(data.data)) {
        response.data =
          data.data.map(normalizeRecord);

        return response;
      }
    }

    if (Array.isArray(data)) {
      response.data = data.map(normalizeRecord);
      return response;
    }

    if (
      data &&
      typeof data === "object" &&
      !Array.isArray(data)
    ) {
      if (Array.isArray(data.properties)) {
        response.data = {
          ...data,
          properties:
            data.properties.map(normalizeRecord),
        };
      } else if (Array.isArray(data.items)) {
        response.data = {
          ...data,
          items:
            data.items.map(normalizeRecord),
        };
      } else if (Array.isArray(data.data)) {
        response.data = {
          ...data,
          data:
            data.data.map(normalizeRecord),
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
