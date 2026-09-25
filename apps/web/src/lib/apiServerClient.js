import { buildApiUrl } from "./api.js";

const apiServerClient = {
  fetch: (path, options = {}) => {
    const token = localStorage.getItem("authToken");

    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const normalizedPath = path.startsWith("/")
      ? path
      : `/${path}`;

    return fetch(
      buildApiUrl(`/api${normalizedPath}`),
      {
        ...options,
        headers,
      }
    );
  },
};

export default apiServerClient;
