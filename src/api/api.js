const API = "http://127.0.0.1:8000";

export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

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