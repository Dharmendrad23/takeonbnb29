import axios from "axios";

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;

  if (
    configured &&
    configured !== "undefined" &&
    configured !== ""
  ) {
    return configured.replace(/\/$/, "");
  }

  // LOCAL BACKEND
  return "http://localhost:3001";
};

export const buildApiUrl = (path = "") => {
  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `${getApiBaseUrl()}${normalizedPath}`;
};

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeRecord = (record) => {
  if (
    record &&
    typeof record === "object" &&
    !Array.isArray(record) &&
    record._id &&
    !record.id
  ) {
    return {
      ...record,
      id: record._id,
    };
  }

  return record;
};

api.interceptors.response.use(
  (response) => {
    if (Array.isArray(response.data)) {
      response.data = response.data.map(normalizeRecord);
    } else if (
      response.data &&
      typeof response.data === "object"
    ) {
      response.data = normalizeRecord(response.data);

      if (Array.isArray(response.data.items)) {
        response.data.items =
          response.data.items.map(normalizeRecord);
      }
    }

    return response;
  },
  (error) => {
    console.error(
      "[API ERROR]",
      error.response?.status,
      error.response?.data || error.message
    );

    return Promise.reject(error);
  }
);

export default api;