const API = "http://127.0.0.1:8000";

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

  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });
  } catch (networkError) {
    // The server is unreachable (not running, wrong port, etc.)
    throw new Error(
      "Unable to connect to the server. Please make sure the backend is running at http://127.0.0.1:8000"
    );
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
        throw new Error("Invalid JSON response from server");
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
    throw new Error(
      data?.detail ||
      data?.message ||
      "Something went wrong"
    );
  }

  return data;
};

export default API;