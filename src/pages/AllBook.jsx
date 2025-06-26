import React, { useState, useEffect } from "react";
import { FaAngleDown, FaFilter, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import { getAllCategories } from "../components/Service/categoriesService";
import "../components/style/allbook.css";

const AllBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = "https://localhost:7003";

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getAllSaleBooks();
        setAllBooks(response);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách sách:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
      }
    };

    fetchBooks();
    fetchCategories();

    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    setFavoriteIds(favorites.map((b) => b.SaleBookId));
  }, []);

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

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const isExist = favorites.some((item) => item.SaleBookId === book.SaleBookId);
    if (!isExist) {
      favorites.push(book);
      localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
      setFavoriteIds([...favoriteIds, book.SaleBookId]);
      alert("Đã thêm vào yêu thích!");
    } else {
      alert("Sách đã có trong danh sách yêu thích.");
    }
  };

  const isFavorite = (bookId) => favoriteIds.includes(bookId);

  const filteredBooks = selectedCategory
    ? allBooks.filter((book) =>
        book.CategoryIds?.some((id) => id === selectedCategory)
      )
    : allBooks;

  const sortedBooks = [...filteredBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "price") {
    sortedBooks.sort((a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price));
  }

  const displayedBooks = sortedBooks.slice(0, 8);

  return (
    <div className="container mt-3">
      <div className="row">
        {/* DANH MỤC */}
        <div className="col-md-3 mb-4">
          <h4 className="category-title">Danh mục sản phẩm</h4>
          <div className="category-list-wrapper">
            <ul className="list-group category-list">
              <li
                className={`list-group-item category-item ${
                  !selectedCategory ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Tất cả
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.CategoryId}
                  className={`list-group-item category-item ${
                    selectedCategory === cat.CategoryId ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat.CategoryId)}
                >
                  {cat.CategoryName}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SÁCH */}
        <div className="col-md-9">
          <h4 className="d-flex align-items-center">
            <span>Danh mục Sách Bán</span>
            {allBooks.length > 8 && (
              <Link
                to="/books-page"
                className="ms-2 text-success"
                title="Xem tất cả sách"
                style={{ fontSize: "1.2rem" }}
              >
                <FaAngleDown />
              </Link>
            )}
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
                    className={`filter-option ${sortBy === "price" ? "active" : ""}`}
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

          {loading ? (
            <p>Đang tải sách...</p>
          ) : (
            <div className="row">
              {displayedBooks.map((book) => (
                <div key={book.SaleBookId} className="col-6 col-md-3 mb-4">
                  <div className="book-card position-relative">
                    <FaHeart
                      className={`heart-icon ${
                        isFavorite(book.SaleBookId) ? "active" : ""
                      }`}
                      onClick={() => handleAddToFavorites(book)}
                      title="Thêm vào yêu thích"
                    />
                    <Link to={`/book/${book.SaleBookId}`} state={{ book }}>
                      <div className="image-container">
                        <img
                          src={`${baseURL}${book.ImageUrl}`}
                          alt={book.Title}
                          className="book-image"
                        />
                      </div>
                      <h5 className="book-title">{book.Title}</h5>
                    </Link>
                    <p className="book-price">
                     {(book.Price * 1000).toLocaleString("vi-VN")}đ

                    </p>
                    <p style={{ fontSize: "13px", marginBottom: "8px", color: "#555" }}>
                      Kích thước: {book.PackagingSize}
                    </p>
                    <div className="button-group">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleAddToCart(book)}
                      >
                        Giỏ hàng
                      </button>
                      <button className="btn btn-primary btn-sm">Mua ngay</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBook;
