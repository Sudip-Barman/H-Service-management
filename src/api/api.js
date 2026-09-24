import { getErrorMessage } from "../utils/errorHandler";

const API = "http://127.0.0.1:8000";

// const API = "https://sonrisehospital.learninghub.ind.in";

export const API_ORIGIN = (
  import.meta.env.VITE_API_URL || API
).replace(/\/api\/?$/, "");

export const getPhotoUrl = (photo) => {
  if (!photo) return "";

  if (
    photo.startsWith("http://") ||
    photo.startsWith("https://") ||
    photo.startsWith("blob:") ||
    photo.startsWith("data:")
  ) {
    return photo;
  }

  return `${API_ORIGIN}${photo.startsWith("/") ? photo : `/${photo}`}`;
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");

  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const path = endpoint.startsWith("/api") || endpoint.startsWith("http")
    ? endpoint
    : `/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // The server is unreachable (not running, wrong port, etc.)
    const netErr = new Error(
      "Unable to connect to the server. Please check your connection or make sure the backend is running."
    );
    netErr.isNetworkError = true;
    throw netErr;
  }


  // Handle empty responses, such as 204 No Content
  const contentType = response.headers.get("content-type");

  let data = null;

  if (contentType && contentType.includes("application/json")) {
    const text = await response.text();

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid response received from the server.");
      }
    }
  } else {
    // Some successful endpoints return no body
    const text = await response.text();

    if (text) {
      data = text;
    }
  }

  if (!response.ok) {
    // Centralized 401 handling: expired / invalid token → redirect to login
    if (response.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("employeeId");
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    const cleanMessage = getErrorMessage({
      status: response.status,
      data,
    });

    const error = new Error(cleanMessage);
    error.status = response.status;
    error.data = data;
    error.response = response;
    throw error;
  }

  // If a mutation succeeds, trigger notifications update instantly across the entire application
  const method = (options.method || "GET").toUpperCase();
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    try {
      window.dispatchEvent(
        new CustomEvent("notifications-updated", { detail: { endpoint: path, data } })
      );
      if (typeof BroadcastChannel !== "undefined") {
        const channel = new BroadcastChannel("carecore_notifications");
        channel.postMessage({ type: "notifications-updated", endpoint: path });
        channel.close();
      }
    } catch { }
  }

  return data;
};

export { getErrorMessage } from "../utils/errorHandler";
export default API;