import React, { useEffect, useState } from "react";
import commentService from "../components/Service/commentService";
import apiClient from "../components/Service/AxiosConfig";
import { useMyAlert } from "../components/MyAlertContext";
import {
  FaReply,
  FaChevronRight,
  FaChevronDown,
  FaTrash,
} from "react-icons/fa";
import "../components/style/commentsection.css";

const CommentSection = ({ bookId }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");
  const [expandedComments, setExpandedComments] = useState([]);
  const { showAlert } = useMyAlert();
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const fetchComments = async () => {
    try {
      const [commentRes, userRes] = await Promise.all([
        commentService.getCommentsByBookId(bookId),
        apiClient.get("/UserManager"),
      ]);

      const users = userRes.data;

      const merged = commentRes.map((cmt) => {
        const userInfo = users.find((u) => u.Id === cmt.CreatedById);
        return {
          ...cmt,
          UserName: userInfo?.UserName || "Chủ Shop",
          ImageUser: userInfo?.ImageUser || null,
        };
      });

      setComments(merged);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bookId]);

  const handleSendComment = async () => {
    if (!user) return showAlert("Bạn cần đăng nhập để bình luận!");
    if (comment.trim() === "") return;
    try {
      await commentService.postComment(comment, bookId);
      setComment("");
      fetchComments();
    } catch (error) {
      console.error("Gửi comment lỗi:", error);
    }
  };

  const handleSendReply = async (parentId) => {
    if (!user) return showAlert("Bạn cần đăng nhập để phản hồi!", "error");
    if (replyContent.trim() === "") return;
    try {
      await commentService.postComment(replyContent, bookId, parentId);
      setReplyingTo(null);
      setReplyContent("");
      fetchComments();
    } catch (error) {
      console.error("Gửi phản hồi lỗi:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirm = await showAlert("Bạn có chắc muốn xóa bình luận này?", "warning");
    if (!confirm) return;


    try {
      await commentService.deleteComment(commentId);
      showAlert("Xóa Bình luận thành công");
      fetchComments();

    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
      showAlert("Xóa bình luận thất bại.", "error");
    }
  };

  const toggleExpand = (commentId) => {
    setExpandedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  const renderComments = (parentId = null, level = 0) => {
    let filtered = comments.filter((c) => c.ParentCommentId === parentId);

    if (filter === "newest") {
      filtered = filtered.sort(
        (a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)
      );
    }

    return filtered.map((cmt) => {
      const hasReplies = comments.some(
        (child) => child.ParentCommentId === cmt.CommentId
      );
      const isExpanded = expandedComments.includes(cmt.CommentId);

      return (
        <div
          key={cmt.CommentId}
          className={`comment-item comment-indent-${level} mb-3`}
        >
          <div className="d-flex gap-3 align-items-start">
            <img
              src={
                cmt.ImageUser
              }
              alt="avatar"
              className="comment-avatar"
            />
            <div className="comment-content w-100 position-relative">
              {/* Nút thùng rác */}
              {user?.UserId === cmt.CreatedById && (
                <button
                  className="delete-comment-btn"
                  onClick={() => handleDeleteComment(cmt.CommentId)}
                  title="Xóa bình luận"
                >
                  <FaTrash />
                </button>
              )}

              <p className="comment-username fw-bold">{cmt.UserName}</p>
              <p>{cmt.Content}</p>
              <small className="text-muted">
                {new Date(cmt.CreatedDate).toLocaleString("vi-VN")}
              </small>

              <div className="comment-actions mt-1 d-flex gap-3">
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === cmt.CommentId ? null : cmt.CommentId
                    )
                  }
                >
                  <FaReply /> Phản hồi
                </button>

                {hasReplies && (
                  <button onClick={() => toggleExpand(cmt.CommentId)}>
                    {isExpanded ? <FaChevronDown /> : <FaChevronRight />}{" "}
                    {isExpanded ? "Ẩn phản hồi" : "Hiện phản hồi"}
                  </button>
                )}
              </div>

              {/* Form phản hồi */}
              {replyingTo === cmt.CommentId && (
                <div className="reply-form mt-2">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nhập phản hồi..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleSendReply(cmt.CommentId)}
                    >
                      Gửi phản hồi
                    </button>
                  </div>
                </div>
              )}

              {/* Hiển thị phản hồi con nếu mở */}
              {isExpanded && renderComments(cmt.CommentId, level + 1)}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="details-comments mt-5">
      <h4>Bình luận về sách</h4>

      <div className="comment-box mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder={
            user
              ? "Nhập bình luận của bạn..."
              : "Bạn cần đăng nhập để bình luận"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user}
        />
        <button
          className="btn btn-success"
          onClick={handleSendComment}
          disabled={!user}
        >
          Gửi bình luận
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="comment-filter mb-3 d-flex align-items-center gap-4">
        <div className="form-check">
          <input
            type="radio"
            id="filterAll"
            name="commentFilter"
            value="all"
            className="form-check-input"
            checked={filter === "all"}
            onChange={(e) => setFilter(e.target.value)}
          />
          <label htmlFor="filterAll" className="form-check-label">
            Tất cả
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            id="filterNewest"
            name="commentFilter"
            value="newest"
            className="form-check-input"
            checked={filter === "newest"}
            onChange={(e) => setFilter(e.target.value)}
          />
          <label htmlFor="filterNewest" className="form-check-label">
            Mới nhất
          </label>
        </div>
      </div>

      {/* Danh sách bình luận */}
      <div className="comment-list mt-3">
        {comments.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          renderComments()
        )}
      </div>
    </div>
  );
};

export default CommentSection;
