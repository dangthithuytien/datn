// src/services/FavoriteSaleBookService.js
import apiClient from "./AxiosConfig"; // đúng tên đã import

const FavoriteSaleBookService = {
  // Lấy danh sách sách bán yêu thích
  getAll: () => {
    return apiClient.get("/FavoriteBook");
  },

  // Xoá sách khỏi yêu thích (dựa vào saleBookId)
  delete: (saleBookId) => {
    return apiClient.delete("/FavoriteBook", {
      params: { saleBookId },
    });
  },

  // (Sau này) Thêm sách vào yêu thích
  add: (saleBookId) => {
    return apiClient.post("/FavoriteBook", { saleBookId });
  },
};

export default FavoriteSaleBookService;
