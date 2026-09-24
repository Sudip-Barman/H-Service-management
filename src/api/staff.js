import { apiRequest } from "./api";

export const getStaff = async () => {
  return apiRequest("/api/staff");
};

export default getStaff;