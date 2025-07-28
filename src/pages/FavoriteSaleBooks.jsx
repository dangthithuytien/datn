import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import FavoriteSaleBookService from "../components/Service/FavoriteSaleBookService";
import { tokenUtils } from "../components/Cookie/cookieUtils";
import "../components/style/favorite.css";
import { useMyAlert } from "../components/MyAlertContext";
import { addToCartSale } from "../components/Service/cartService";
const FavoriteSaleBooks = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;

  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useMyAlert();
  useEffect(() => {
    const loadFavoriteBooks = async () => {
      const token = tokenUtils.getAccessToken();
      if (!token) {
        showAlert("❌ Vui lòng đăng nhập để xem sách yêu thích.", "error");
        navigate("/login");
        return;
      }

      try {
        const data = await FavoriteSaleBookService.getFavorites();
        setFavoriteBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Lỗi khi tải sách yêu thích:", error);
        setFavoriteBooks([]);
      }
    };

    loadFavoriteBooks();
  }, [navigate]);

  const removeFromFavorites = async (saleBookId) => {
  
    try {
      await FavoriteSaleBookService.removeFavorite(saleBookId);
      setFavoriteBooks((prev) =>
        prev.filter((b) => String(b.SaleBookId) !== String(saleBookId))
      );
    } catch (err) {
      console.error("❌ Lỗi xoá yêu thích:", err);
    }
  };

  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.SaleBookId, 1);
      showAlert("✅ Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      showAlert("Không thể thêm vào giỏ hàng.","error");
    }
  };

  // ===== SORTING =====
  const sortedBooks = [...favoriteBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "price") {
    sortedBooks.sort(
      (a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price)
    );
  }

  // ===== PAGINATION =====
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
          📘 Sách bán yêu thích
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
                className={`filter-option ${
                  sortBy === "name" ? "fw-bold" : ""
                }`}
                onClick={() => {
                  setSortBy("name");
                  setShowFilter(false);
                }}
              >
                Lọc theo Tên
              </div>
              <div
                className={`filter-option ${
                  sortBy === "price" ? "fw-bold" : ""
                }`}
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
        <p>Bạn chưa có sách bán yêu thích nào.</p>
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
                key={book.SaleBookId}
                style={{
                  flex: "0 0 calc(20% - 13px)",
                  boxSizing: "border-box",
                }}
              >
                <div className="book-card position-relative">
                  <button
                    onClick={() => removeFromFavorites(book.SaleBookId)}
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  >
                    &times;
                  </button>
                  <div className="image-container">
                    <img
                      src={
                        book.ImageUrl?.startsWith("/")
                          ? `https://localhost:7003${book.ImageUrl}`
                          : book.ImageUrl || "/no-image.jpg"
                      }
                      alt={book.Title}
                      className="book-image"
                    />
                  </div>
                  <h6 className="book-title">{book.Title}</h6>
                  <p className="book-price text-danger fw-bold">
                    {(book.FinalPrice ).toLocaleString("vi-VN")} đ
                    {book.PromotionName && (
                      <span className="text-muted text-decoration-line-through ms-2">
                        {(book.Price ).toLocaleString("vi-VN")} đ
                      </span>
                    )}
                  </p>
                  <div className="button-group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAddToCart(book)}
                    >
                      Giỏ hàng
                    </button>
                    <Link to="/cart" className="btn btn-success btn-sm">
                      Mua ngay
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

export default FavoriteSaleBooks;
