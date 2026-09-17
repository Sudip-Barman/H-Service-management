import API from "./api";

export const getStaff = async () => {
  const response = await fetch(`${API}/api/staff`);

  if (!response.ok) {
    throw new Error("Failed to fetch staff");
  }

  return response.json();
};