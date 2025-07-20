import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import "../components/style/booksPage.css";
import { addToCartSale } from "../components/Service/cartService";

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 15;
  const baseURL = "https://localhost:7003";
  const navigate = useNavigate();

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
  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.SaleBookId, 1);
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng. Vui lòng đăng nhập hoặc thử lại sau.");
    }
  };
  
  const handleBookClick = (book) => {
    navigate(`/book/${book.SaleBookId}`, { state: { book } });
  };

  // ==== Lọc và sắp xếp ====
  const priceFiltered = books.filter((book) => {
    if (!book.IsHidden) return false;
  
    const price = book.FinalPrice || book.Price;
    return price >= priceRange.min && price <= priceRange.max;
  });
  

  const sortedBooks = [...priceFiltered];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "priceAsc") {
    sortedBooks.sort((a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price));
  } else if (sortBy === "priceDesc") {
    sortedBooks.sort((a, b) => (b.FinalPrice || b.Price) - (a.FinalPrice || a.Price));
  }

  // ==== Phân trang ====
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedBooks.length / booksPerPage);
  const placeholders = (5 - (currentBooks.length % 5)) % 5;
  const handleBuyNow = (book) => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
  
    if (!token || !user) {
      alert("Vui lòng đăng nhập để tiếp tục mua hàng.");
      navigate("/login"); // Hoặc mở modal đăng nhập
      return;
    }
  
    const selectedProduct = {
      ProductId: book.SaleBookId,
      ProductName: book.Title,
      Quantity: 1,
      UnitPrice: book.FinalPrice || book.Price,
      ImageUrl: book.ImageUrl,
    };
  
    localStorage.setItem("cartBuy", JSON.stringify([selectedProduct]));
    localStorage.setItem("checkoutTotal", JSON.stringify(book.FinalPrice || book.Price));
  
    navigate("/checkout");
  };
  
  return (
    <div className="container mt-4">
      <h4 className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <span>Tất cả sách bán</span>

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
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
              setCurrentPage(1);
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

      <div className="d-flex flex-wrap justify-content-between">
        {currentBooks.map((book) => (
          <div key={book.SaleBookId} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${favoriteIds.includes(book.SaleBookId) ? "active" : ""}`}
                onClick={() => handleAddToFavorites(book)}
                title="Yêu thích"
              />
              <div onClick={() => handleBookClick(book)} style={{ cursor: "pointer" }}>
                <img
                  src={`${baseURL}${book.ImageUrl}`}
                  alt={book.Title}
                  className="book-image"
                />
                <div className="book-title">{book.Title}</div>
                <div className="book-price">
                  {(book.FinalPrice ).toLocaleString("vi-VN")}₫
                </div>
                <div className="book-size">   Số lượng: {book.Quantity}</div>
              </div>
              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToCart(book)}
                >
                  Giỏ hàng
                </button>
                <button className="btn btn-success btn-sm" onClick={() => handleBuyNow(book)}>Mua ngay</button>
              </div>
            </div>
          </div>
        ))}

        {Array.from({ length: placeholders }).map((_, idx) => (
          <div key={`placeholder-${idx}`} style={{ width: "19%" }} className="mb-4 invisible">
            <div className="book-card" />
          </div>
        ))}
      </div>

      {/* PHÂN TRANG */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                &laquo;
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default BooksPage;
