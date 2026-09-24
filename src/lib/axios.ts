import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ─── Request interceptor: attach auth token ────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Only run in browser
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: centralised error handling ──────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't process cancelled requests
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 401 — token expired / invalid → clear auth and redirect
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Normalise the error message
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject({
      message,
      status,
      original: error,
    });
  }
);

export default apiClient;
