import React from "react";
import FavoriteSaleBooks from "./FavoriteSaleBooks";
import FavoriteRentBooks from "./FavoriteRentBooks";
import "../components/style/favorite.css"; // Đảm bảo CSS tổng vẫn được import

const FavoriteBooks = () => {
  return (
    <div className="container mt-4">
    

      {/* Sách bán */}
      <div className="mb-5">
        
        <FavoriteSaleBooks />
      </div>

      {/* Sách thuê */}
      <div>
       
        <FavoriteRentBooks />
      </div>
    </div>
  );
};

export default FavoriteBooks;
