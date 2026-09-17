import { apiRequest } from "./api";

export const login = async ({
  email,
  password,
  role,
}) => {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      role,
    }),
  });
};

export const getCurrentUser = async () => {
  return apiRequest("/api/auth/me");
};