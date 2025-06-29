import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaFilter } from "react-icons/fa";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import "../components/style/booksPage.css";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();
  const baseURL = "https://localhost:7003";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllSaleBooks();
        setBooks(response);
      } catch (err) {
        console.error("Lỗi lấy sách:", err);
      }
    };

    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    setFavoriteIds(favorites.map((b) => b.SaleBookId));

    fetchBooks();
  }, []);

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const exists = favorites.some((b) => b.SaleBookId === book.SaleBookId);

    if (exists) {
      alert("Sách đã có trong danh sách yêu thích.");
      return;
    }

    favorites.push(book);
    localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
    setFavoriteIds([...favoriteIds, book.SaleBookId]);
    alert("Đã thêm vào yêu thích!");
  };

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    const index = cart.findIndex((item) => item.SaleBookId === book.SaleBookId);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cartBuy", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.SaleBookId}`, { state: { book } });
  };

  const sortedBooks = [...books];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "price") {
    sortedBooks.sort(
      (a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price)
    );
  }

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Tất cả sách bán</span>
        <div className="ms-auto position-relative">
          <button
            className="btn btn-light filter-icon-btn"
            onClick={() => setShowFilter(!showFilter)}
            title="Lọc sách"
          >
            <FaFilter />
          </button>
          {showFilter && (
            <div className="filter-dropdown shadow-sm">
              <div
                className={`filter-option ${sortBy === "name" ? "active" : ""}`}
                onClick={() => {
                  setSortBy("name");
                  setShowFilter(false);
                }}
              >
                Lọc theo Tên
              </div>
              <div
                className={`filter-option ${
                  sortBy === "price" ? "active" : ""
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
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {sortedBooks.map((book) => (
          <div key={book.SaleBookId} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${
                  favoriteIds.includes(book.SaleBookId) ? "active" : ""
                }`}
                onClick={() => handleAddToFavorites(book)}
                title="Yêu thích"
              />
              <div
                onClick={() => handleBookClick(book)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`${baseURL}${book.ImageUrl}`}
                  alt={book.Title}
                  className="book-image"
                />
                <div className="book-title">{book.Title}</div>
                <div className="book-price">
                  {(book.FinalPrice * 1000).toLocaleString("vi-VN")}₫
                </div>
                <div className="book-size">
                  Kích thước: {book.PackagingSize}
                </div>
              </div>

              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToCart(book)}
                >
                  Giỏ hàng
                </button>
                <button className="btn btn-success btn-sm">Mua ngay</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;