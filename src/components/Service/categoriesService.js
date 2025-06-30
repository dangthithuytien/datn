import apiClient from "./AxiosConfig";

const CATEGORY_ENDPOINT = "/Category";

// Lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(CATEGORY_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh mục:", error);
    throw error;
  }
};

// Lấy danh mục theo ID
export const getCategoryById = (categoryId) =>
  apiClient.get(`${CATEGORY_ENDPOINT}/${categoryId}`).then((res) => res.data);

// Thêm danh mục mới
export const createCategory = (categoryData) =>
  apiClient.post(CATEGORY_ENDPOINT, categoryData).then((res) => res.data);

// Cập nhật danh mục
export const updateCategory = (categoryId, categoryData) =>
  apiClient.put(`${CATEGORY_ENDPOINT}/${categoryId}`, categoryData).then((res) => res.data);

// Xóa danh mục
export const deleteCategory = (categoryId) =>
  apiClient.delete(`${CATEGORY_ENDPOINT}/${categoryId}`).then((res) => res.data);
