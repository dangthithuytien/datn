import React, { useEffect, useState } from "react";
import "../components/style/commentsection.css";

const CommentSection = ({ bookId, storageKeyPrefix = "comments" }) => {
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [filterMode, setFilterMode] = useState("all");
  const [showComments, setShowComments] = useState(true);

  const localStorageKey = `${storageKeyPrefix}-${bookId}`;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setComments(saved);
  }, [localStorageKey]);

  const handleSendComment = () => {
    if (username.trim() === "" || comment.trim() === "") return;

    const newComment = {
      user: username,
      text: comment,
      time: Date.now(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&rounded=true`,
    };

    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(localStorageKey, JSON.stringify(updated));
    setUsername("");
    setComment("");
  };

  const filteredComments =
    filterMode === "latest"
      ? [...comments].sort((a, b) => b.time - a.time)
      : comments;

  return (
    <div className="details-comments mt-5">
      <h4>Bình luận về sách</h4>

      <div className="comment-box mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Tên của bạn"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Nhập bình luận của bạn..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSendComment}>
          Gửi bình luận
        </button>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label className="me-3">
            <input
              type="radio"
              name="filter"
              value="all"
              checked={filterMode === "all"}
              onChange={() => setFilterMode("all")}
            />{" "}
            Tất cả
          </label>
          <label>
            <input
              type="radio"
              name="filter"
              value="latest"
              checked={filterMode === "latest"}
              onChange={() => setFilterMode("latest")}
            />{" "}
            Mới nhất
          </label>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "👁️ Ẩn bình luận" : "🗨️ Hiện bình luận"}
        </button>
      </div>

      {showComments && (
        <div className="comment-list mt-3">
          {filteredComments.length === 0 ? (
            <p>Chưa có bình luận nào.</p>
          ) : (
            filteredComments.map((cmt, index) => (
              <div key={index} className="comment-item d-flex gap-3 align-items-start mb-3">
                <img
                  src={cmt.avatar}
                  alt="avatar"
                  className="comment-avatar"
                />
                <div>
                  <p className="comment-username fw-bold mb-1">{cmt.user}</p>
                  <p className="mb-1">{cmt.text}</p>
                  <small className="text-muted">
                    {new Date(cmt.time).toLocaleString("vi-VN")}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
