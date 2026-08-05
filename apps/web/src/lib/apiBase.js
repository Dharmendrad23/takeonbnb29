const normalizeBaseUrl = (value) => {
  const trimmed = value.trim().replace(/\/+$/, "");

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const fallbackBaseUrl = import.meta.env.DEV ? "http://127.0.0.1:8090" : "";
const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim() || fallbackBaseUrl;

if (!configuredBaseUrl) {
  throw new Error("VITE_API_URL is not configured.");
}

export const API_BASE_URL = normalizeBaseUrl(configuredBaseUrl);

export const buildApiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  return path.startsWith("/")
    ? `${API_BASE_URL}${path}`
    : `${API_BASE_URL}/${path}`;
};
