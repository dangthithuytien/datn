import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import "../components/style/rentbook.css";

const FavoriteRentBooks = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("favoriteRentBooks")) || [];
    setFavoriteBooks(data);
  }, []);

  const removeFromFavorites = (id) => {
    const updated = favoriteBooks.filter((b) => b.id !== id);
    setFavoriteBooks(updated);
    localStorage.setItem("favoriteRentBooks", JSON.stringify(updated));
  };

  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    if (existingCart.some((item) => item.id === book.id)) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      ...book,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    localStorage.setItem("rentCart", JSON.stringify([...existingCart, rentItem]));
    alert("Đã thêm sách vào giỏ thuê!");
  };

  // ==== SẮP XẾP ====
  const sortedBooks = [...favoriteBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "price") {
    sortedBooks.sort((a, b) => a.rentPrice - b.rentPrice);
  }

  // ==== PHÂN TRANG ====
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  return (
    <div className="container my-4 p-3 border rounded bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4
          style={{ fontSize: "1.4rem", color: "#1b5e20", fontWeight: "bold" }}
        >
          📗 Sách thuê yêu thích
        </h4>
        <div className="position-relative">
          <button
            className="btn btn-light btn-sm"
            onClick={() => setShowFilter(!showFilter)}
            title="Lọc sách"
          >
            <FaFilter />
          </button>
          {showFilter && (
            <div className="filter-dropdown shadow-sm p-2 bg-white rounded">
              <div
                className={`filter-option ${sortBy === "name" ? "fw-bold" : ""}`}
                onClick={() => {
                  setSortBy("name");
                  setShowFilter(false);
                }}
              >
                Lọc theo Tên
              </div>
              <div
                className={`filter-option ${sortBy === "price" ? "fw-bold" : ""}`}
                onClick={() => {
                  setSortBy("price");
                  setShowFilter(false);
                }}
              >
                Lọc theo Giá
              </div>
            </div>
          )}
        </div>
      </div>

      {favoriteBooks.length === 0 ? (
        <p>Bạn chưa có sách thuê yêu thích nào.</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              justifyContent: "flex-start",
            }}
          >
            {currentBooks.map((book) => (
              <div
                key={book.id}
                style={{
                  flex: "0 0 calc(20% - 13px)",
                  boxSizing: "border-box",
                }}
              >
                <div className="book-card position-relative">
                  <button
                    onClick={() => removeFromFavorites(book.id)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  >
                    &times;
                  </button>

                  <div className="image-container">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="book-image"
                    />
                  </div>

                  <h6 className="book-title">{book.title}</h6>
                  <p className="book-price">
                    Thuê: {book.rentPrice?.toLocaleString()} đ
                  </p>

                  <div className="button-group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAddToRentCart(book)}
                    >
                      Giỏ thuê
                    </button>
                    <Link to="/rent-cart" className="btn btn-success btn-sm">
                      Thuê ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination pagination-sm">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${
                        currentPage === i + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoriteRentBooks;
