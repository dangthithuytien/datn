// FavoriteSaleBookService.js
import apiClient from "./AxiosConfig";
import { tokenUtils } from "../Cookie/cookieUtils";

const FavoriteSaleBookService = {
  getFavorites: async () => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) {
        console.warn("⚠️ Token hết hạn hoặc không tồn tại.");
        return [];
      }

      const response = await apiClient.get("/FavoriteBook");

      // ✅ Chuẩn hóa SaleBookId là string
      return response.data.map((f) => ({
        ...f,
        SaleBookId: String(f.SaleBookId),
      }));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách yêu thích:", error);
      return [];
    }
  },

  addFavorite: async (saleBookId) => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) return;

      return await apiClient.post("/FavoriteBook", {
        SaleBookId: String(saleBookId),
      });
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào yêu thích:", error);
      throw error;
    }
  },

  removeFavorite: async (saleBookId) => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) return;

      return await apiClient.delete(
        `/FavoriteBook?SaleBookId=${encodeURIComponent(saleBookId)}`
      );
    } catch (error) {
      console.error("❌ Lỗi khi xoá khỏi yêu thích:", error);
      throw error;
    }
  },
};

export default FavoriteSaleBookService;