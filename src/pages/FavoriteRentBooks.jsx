import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaTimes } from "react-icons/fa";
import FavoriteRentBookService from "../components/Service/FavoriteRentBookService";
import "../components/style/rentbook.css";

const baseURL = "https://localhost:7003";

const FavoriteRentBooks = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const data = await FavoriteRentBookService.getAll();
      setFavoriteBooks(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy sách yêu thích:", error);
    }
  };

  const handleRemoveFavorite = async (RentBookId) => {
    try {
      await FavoriteRentBookService.deleteFavorite(RentBookId);
      await fetchFavorites(); // Refresh sau khi xóa
    } catch (error) {
      console.error("❌ Lỗi khi xóa khỏi yêu thích:", error);
      alert("Lỗi khi xóa khỏi yêu thích.");
    }
  };

  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    const exists = existingCart.some((item) => item.id === book.RentBookId);
    if (exists) {
      alert("⚠️ Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      id: book.RentBookId,
      Title: book.Title,
      rentPrice: book.Price,
      image: `${baseURL}${book.ImageUrl}`,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    localStorage.setItem("rentCart", JSON.stringify([...existingCart, rentItem]));
    alert("✅ Đã thêm sách vào giỏ thuê!");
  };

  // ==== SẮP XẾP ====
  const sortedBooks = [...favoriteBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "price") {
    sortedBooks.sort((a, b) => (a.Price || 0) - (b.Price || 0));
  }

  // ==== PHÂN TRANG ====
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

  return (
    <div className="container my-4 p-3 border rounded bg-light">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold text-success">📗 Sách thuê yêu thích</h4>
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
        <p className="text-muted">Bạn chưa có sách thuê yêu thích nào.</p>
      ) : (
        <>
          <div className="d-flex flex-wrap gap-3">
            {currentBooks.map((book) => (
              <div
                key={book.RentBookId}
                style={{ flex: "0 0 calc(20% - 12px)" }}
              >
                <div className="book-card position-relative">
                  {/* Nút Xóa yêu thích */}
                  <div
                    className="heart-icon"
                    onClick={() => handleRemoveFavorite(book.RentBookId)}
                    style={{ cursor: "pointer" }}
                    title="Xóa khỏi yêu thích"
                  >
                    <FaTimes style={{ color: "red", fontWeight: "bold" }} />
                  </div>

                  <div className="image-container">
                    <img
                      src={`${baseURL}${book.ImageUrl}`}
                      alt={book.Title}
                      className="book-image"
                    />
                  </div>

                  <h6 className="book-title mt-2">{book.Title}</h6>
                  <p className="book-price">
                    Thuê: {book.Price?.toLocaleString()} đ
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
