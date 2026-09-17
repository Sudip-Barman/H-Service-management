// patients.js

import { apiRequest } from "./api";

export const getPatients = () => {
  return apiRequest("/api/patients");
};

export const createPatient = (data) => {
  return apiRequest("/api/patients", {
    method: "POST",
    body: JSON.stringify(data),
  });
};