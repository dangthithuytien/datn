// src/components/Common/FavoriteHeart.jsx
import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoriteHeart = ({ isFavorite, onToggle }) => {
  return isFavorite ? (
    <FaHeart
      className="heart-icon"
      style={{ color: "red" }}
      onClick={onToggle}
      title="Bỏ khỏi yêu thích"
    />
  ) : (
    <FaRegHeart
      className="heart-icon"
      style={{ color: "#ccc" }}
      onClick={onToggle}
      title="Thêm vào yêu thích"
    />
  );
};

export default FavoriteHeart;
