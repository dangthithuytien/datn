import apiClient from "./AxiosConfig";

const SALE_BOOK_ENDPOINT = "/SaleBooks";

// Lấy toàn bộ sách giảm giá
export const getAllSaleBooks = async () => {
  try {
    const response = await apiClient.get(SALE_BOOK_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy danh sách SaleBook:", error);
    throw error;
  }
};

// Lấy chi tiết sách theo ID
export const getSaleBookById = async (id) => {
  try {
    const response = await apiClient.get(`${SALE_BOOK_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết sách:", error);
    throw error;
  }
};

// Lấy sách có khuyến mãi (nếu PromotionIds có phần tử)
export const getPromotedBooks = async () => {
  try {
    const response = await apiClient.get(SALE_BOOK_ENDPOINT);
    return response.data.filter(
      (book) => Array.isArray(book.PromotionIds) && book.PromotionIds.length > 0
    );
  } catch (error) {
    console.error("Lỗi lấy sách khuyến mãi:", error);
    throw error;
  }
};
