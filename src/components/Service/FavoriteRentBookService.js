// FavoriteRentBookService.js
import apiClient from "./AxiosConfig";
import { tokenUtils } from "../Cookie/cookieUtils";

const FavoriteRentBookService = {
  getAll: async () => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) {
        console.warn("⚠️ Token hết hạn hoặc không tồn tại.");
        return [];
      }

      const response = await apiClient.get("/FavoriteRentBook/my-favorites");

      return response.data.map((item) => ({
        ...item,
        RentBookId: String(item.RentBookId),
      }));
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách yêu thích sách thuê:", error);
      return [];
    }
  },

  toggleFavorite: async (RentBookId) => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) return;

      return await apiClient.post(
        `/FavoriteRentBook/toggle/${String(RentBookId)}`
      );
    } catch (error) {
      console.error("❌ Lỗi khi toggle yêu thích sách thuê:", error);
      throw error;
    }
  },

  deleteFavorite: async (RentBookId) => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) return;

      return await apiClient.delete(
        `/FavoriteRentBook/${String(RentBookId)}`
      );
    } catch (error) {
      console.error("❌ Lỗi khi xoá khỏi yêu thích sách thuê:", error);
      throw error;
    }
  },
};

export default FavoriteRentBookService;