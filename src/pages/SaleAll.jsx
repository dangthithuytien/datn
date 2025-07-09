import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import "../components/style/sale.css"; // dùng chung CSS với Sale.jsx

const SaleAll = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const booksPerPage = 15;
  const baseURL = "https://localhost:7003";
  const navigate = useNavigate();

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

      const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
      setFavoriteIds(favorites.map((b) => b.SaleBookId || b.id));
    };

    fetchBooks();
  }, []);

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

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const exists = favorites.some((item) => item.id === book.id || item.SaleBookId === book.id);
    if (!exists) {
      favorites.push(book);
      localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
      setFavoriteIds([...favoriteIds, book.id]);
      alert("Đã thêm vào yêu thích!");
    } else {
      alert("Sách đã có trong danh sách yêu thích.");
    }
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
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
              <FaHeart
                className={`heart-icon ${favoriteIds.includes(book.id) ? "active" : ""}`}
                onClick={() => handleAddToFavorites(book)}
              />
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
                    {(book.price * 1000).toLocaleString("vi-VN")}₫
                  </span>
                )}
                <span className="final-price">
                  {(book.finalPrice * 1000).toLocaleString("vi-VN")}₫
                </span>
              </p>

              <p className="book-size">Kích thước: {book.packagingSize || "Không rõ"}</p>

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
