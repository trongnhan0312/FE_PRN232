import axiosInstance from "../config/axiosConfig";
import { API_ENDPOINT } from "../config/apiConfig";

export const getEmployeeProfile = async (id) => {
  try {
    const res = await axiosInstance.get(
      `${API_ENDPOINT.EMPLOYEE.DETAIL.replace("{id}", id)}`
    );
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching employee profile:", err);
    throw err;
  }
};

export const updateEmployeeProfile = async (formData) => {
  try {
    const response = await axiosInstance.put(
      API_ENDPOINT.EMPLOYEE.UPDATE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("❌ Error updating doctor profile:", err);
    throw err;
  }
};
