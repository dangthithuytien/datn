// src/services/CommentService.js
import apiClient from './AxiosConfig';

const commentService = {
  // Lấy danh sách comment theo bookId
  getCommentsByBookId: async (bookId) => {
    try {
      const response = await apiClient.get(`/Comment/book/${bookId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy comment:", error);
      throw error;
    }
  },

  // Gửi một bình luận hoặc phản hồi
  postComment: async (content, bookId, parentCommentId = null) => {
    try {
      const response = await apiClient.post('/Comment', {
        Content: content,
        BookId: bookId,
        ParentCommentId: parentCommentId,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi gửi comment:", error);
      throw error;
    }
  },

  // Xóa comment (nếu cần)
  deleteComment: async (id) => {
    try {
      await apiClient.delete(`/Comment/${id}`);
    } catch (error) {
      console.error("Lỗi khi xóa comment:", error);
      throw error;
    }
  },
};

export default commentService;
