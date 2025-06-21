import React, { useEffect, useState } from "react";
import "../components/style/favorite.css"; // Tạo file CSS này nếu cần

const FavoriteBooks = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    setFavoriteBooks(data);
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center text-success">Sách yêu thích</h3>
      {favoriteBooks.length === 0 ? (
        <p className="text-center">Bạn chưa có sách yêu thích nào.</p>
      ) : (
        <div className="row">
          {favoriteBooks.map((book, index) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4" key={index}>
              <div className="card h-100 favorite-card">
                <img
                  src={book.image || "/no-image.jpg"}
                  className="card-img-top"
                  alt={book.title}
                  style={{ height: "180px", objectFit: "cover" }}
                />
                <div className="card-body p-2">
                  <h6 className="card-title">{book.title}</h6>
                  <p className="card-text text-danger fw-bold">{book.price} đ</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteBooks;
