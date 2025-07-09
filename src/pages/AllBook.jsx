import React, { useState, useEffect } from "react";
import { FaAngleDown, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import { getAllCategories } from "../components/Service/categoriesService";
import { addToCartSale } from "../components/Service/cartService";
import "../components/style/allbook.css";

const AllBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

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

  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.SaleBookId, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng.");
    }
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

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const filteredBooks = selectedCategory
    ? allBooks.filter((book) =>
        book.CategoryIds?.some((id) => id === selectedCategory)
      )
    : allBooks;

  const priceFilteredBooks = filteredBooks.filter((book) => {
    const price = (book.FinalPrice || book.Price) * 1000;
    return price >= priceRange.min && price <= priceRange.max;
  });

  let sortedBooks = [...priceFilteredBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "priceAsc") {
    sortedBooks.sort((a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price));
  } else if (sortBy === "priceDesc") {
    sortedBooks.sort((a, b) => (b.FinalPrice || b.Price) - (a.FinalPrice || a.Price));
  } else {
    sortedBooks = shuffleArray(sortedBooks);
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
                className={`list-group-item category-item ${!selectedCategory ? "active" : ""}`}
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
          <h4 className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <span className="me-2">Danh mục Sách Bán</span>
              <Link
                to="/books-page"
                className="btn btn-link p-0"
                style={{ fontSize: "20px", color: "#2e7d32" }}
                title="Xem tất cả sách"
              >
                <FaAngleDown />
              </Link>
            </div>

            <div className="d-flex gap-2">
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">-- Sắp xếp --</option>
                <option value="name">Tên A-Z</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
              </select>

              <select
                className="form-select"
                onChange={(e) => {
                  const value = e.target.value;
                  switch (value) {
                    case "0-50":
                      setPriceRange({ min: 0, max: 50000 });
                      break;
                    case "50-100":
                      setPriceRange({ min: 50000, max: 100000 });
                      break;
                    case "100-200":
                      setPriceRange({ min: 100000, max: 200000 });
                      break;
                    case "200+":
                      setPriceRange({ min: 200000, max: Infinity });
                      break;
                    default:
                      setPriceRange({ min: 0, max: Infinity });
                  }
                }}
              >
                <option value="">-- Khoảng giá --</option>
                <option value="0-50">0 - 50.000đ</option>
                <option value="50-100">50.000đ - 100.000đ</option>
                <option value="100-200">100.000đ - 200.000đ</option>
                <option value="200+">Trên 200.000đ</option>
              </select>
            </div>
          </h4>

          {loading ? (
            <p>Đang tải sách...</p>
          ) : (
            <div className="row">
              {(() => {
                const visibleBooks = displayedBooks.filter((book) => book.IsHidden === true);
                const emptySlots = 8 - visibleBooks.length;

                return (
                  <>
                    {visibleBooks.map((book) => (
                      <div key={book.SaleBookId} className="col-6 col-md-3 mb-4">
                        <div className="book-card position-relative">
                          <FaHeart
                            className={`heart-icon ${isFavorite(book.SaleBookId) ? "active" : ""}`}
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
                          <p className="book-size">
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

                    {Array.from({ length: emptySlots }).map((_, index) => (
                      <div key={`empty-${index}`} className="col-6 col-md-3 mb-4">
                        <div className="book-card placeholder-card" />
                      </div>
                    ))}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBook;
