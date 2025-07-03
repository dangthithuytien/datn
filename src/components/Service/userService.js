import apiClient from "./AxiosConfig"; // <-- axios đã cấu hình sẵn token, baseURL

// Lấy thông tin người dùng
export const getUserProfile = async () => {
  const response = await apiClient.get("/User/profile");
  return response.data;
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (formData) => {
  const response = await apiClient.put("/User/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};