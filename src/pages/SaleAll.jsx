import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import "../components/style/sale.css"; // dùng chung CSS với Sale.jsx
import FavoriteSaleBookService from "../components/Service/FavoriteSaleBookService";
import { tokenUtils } from "../components/Cookie/cookieUtils";
const SaleAll = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [accessToken, setAccessToken] = useState(tokenUtils.getAccessToken());

  const booksPerPage = 15;
  const baseURL = "https://localhost:7003";
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = tokenUtils.getAccessToken();
      if (newToken !== accessToken) {
        setAccessToken(newToken);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);
  const loadFavorites = async () => {
    try {
      const favorites = await FavoriteSaleBookService.getFavorites();
      const ids = favorites.map((f) => String(f.SaleBookId));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách yêu thích:", error);
    }
  };
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getPromotedBooks();
  
        const mapped = response.map((book) => {
          const originalPrice = book.Price;
          const finalPrice = book.FinalPrice;
          const discountPercent =
            book.DiscountPercentage !== undefined
              ? book.DiscountPercentage
              : originalPrice && finalPrice
                ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
                : null;
  
          return {
            ...book,
            id: book.SaleBookId,
            title: book.Title,
            image: book.ImageUrl?.startsWith("/")
              ? `${baseURL}${book.ImageUrl}`
              : book.ImageUrl,
            price: originalPrice,
            finalPrice,
            discountPercent,
            packagingSize: book.PackagingSize,
          };
        });
  
        setBooks(mapped);
      } catch (err) {
        console.error("Lỗi lấy sách khuyến mãi:", err);
      }
    };
  
    fetchBooks();
    if (accessToken) loadFavorites();
  }, [accessToken]);
  

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    const index = cart.findIndex((item) => item.id === book.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cartBuy", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };
  const isFavorite = (id) => favoriteIds.includes(String(id));

  const toggleFavorite = async (book) => {
    if (!accessToken) {
      alert("❌ Vui lòng đăng nhập để yêu thích sách!");
      return;
    }

    try {
      const bookId = String(book.id);
      if (isFavorite(bookId)) {
        await FavoriteSaleBookService.removeFavorite(bookId);
      } else {
        await FavoriteSaleBookService.addFavorite(bookId);
      }
      await loadFavorites();
    } catch (error) {
      console.error("❌ Lỗi xử lý yêu thích:", error);
      alert("Không thể xử lý yêu thích!");
    }
  };

  const handleBuyNow = (book) => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      alert("Vui lòng đăng nhập để tiếp tục mua hàng.");
      navigate("/login"); // Hoặc mở modal đăng nhập
      return;
    }
    const selectedProduct = {
      ProductId: book.id,
      ProductName: book.title, // sửa từ book.Title
      Quantity: 1,
      UnitPrice: book.finalPrice, // sửa từ book.FinalPrice
      ImageUrl: book.image, // sửa từ book.ImageUrl
    };

    localStorage.setItem("cartBuy", JSON.stringify([selectedProduct]));
    localStorage.setItem("checkoutTotal", JSON.stringify(book.finalPrice));
    localStorage.setItem("isBuyNow", "true");
    navigate("/checkout");
  };
  // ==== Phân trang ====
  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentBooks = books.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const placeholders = (5 - (currentBooks.length % 5)) % 5;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Tất cả sách khuyến mãi</h2>

      <div className="sale-grid-container">
        {currentBooks.map((book) => (
          <div key={book.id} className="sale-grid-item">
            <div className="book-card position-relative">
              {isFavorite(book.id) ? (
                <FaHeart
                  className="heart-icon"
                  style={{ color: "red" }}
                  onClick={() => toggleFavorite(book)}
                  title="Bỏ khỏi yêu thích"
                />
              ) : (
                <FaRegHeart
                  className="heart-icon"
                  style={{ color: "#ccc" }}
                  onClick={() => toggleFavorite(book)}
                  title="Thêm vào yêu thích"
                />
              )}

              {book.discountPercent !== null && (
                <div className="flame-badge">
                  🔥 <span className="discount-text">-{book.discountPercent}%</span>
                </div>
              )}
              <div onClick={() => handleBookClick(book)} style={{ cursor: "pointer" }}>
                <img src={book.image} alt={book.title} className="book-image" />
                <h5 className="book-title">{book.title}</h5>
              </div>

              <p className="book-price">
                {book.price !== book.finalPrice && (
                  <span className="original-price">
                    {(book.price).toLocaleString("vi-VN")}₫
                  </span>
                )}
                <span className="final-price">
                  {(book.finalPrice).toLocaleString("vi-VN")}₫
                </span>
              </p>

              <p className="book-size">   Số lượng: {book.Quantity}</p>

              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToCart(book)}
                >
                  Giỏ hàng
                </button>
                <button className="btn btn-primary btn-sm"
                  onClick={() => handleBuyNow(book)}>
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Chèn khung trống giữ layout nếu không đủ 5 quyển */}
        {Array.from({ length: placeholders }).map((_, idx) => (
          <div key={`placeholder-${idx}`} className="sale-grid-item" style={{ visibility: "hidden" }}>
            <div className="book-card" />
          </div>
        ))}
      </div>

      {/* ==== PHÂN TRANG ==== */}
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default SaleAll;
