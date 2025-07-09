import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaChevronDown } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import "../components/style/sale.css";
import { addToCartSale } from "../components/Service/cartService";

const Sale = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const baseURL = "https://localhost:7003";

  useEffect(() => {
    const fetchPromotedBooks = async () => {
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
            id: book.SaleBookId,
            title: book.Title,
            image: book.ImageUrl?.startsWith("/")
              ? `${baseURL}${book.ImageUrl}`
              : book.ImageUrl,
            price: originalPrice,
            finalPrice: finalPrice,
            discountPercent: discountPercent,
            packagingSize: book.PackagingSize,
          };
        });

        setBooks(mapped.slice(0, 5)); // chỉ lấy 5 quyển
      } catch (err) {
        console.error("Lỗi lấy sách khuyến mãi:", err);
      }

      const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
      setFavoriteIds(favorites.map((b) => b.SaleBookId));
    };

    fetchPromotedBooks();
  }, []);

  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng.");
    }
  };

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const isExist = favorites.some((item) => item.SaleBookId === book.id);
    if (!isExist) {
      favorites.push(book);
      localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
      setFavoriteIds([...favoriteIds, book.id]);
      alert("Đã thêm vào yêu thích!");
    } else {
      alert("Sách đã có trong danh sách yêu thích.");
    }
  };

  const placeholderCount = 5 - books.length;

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Sách khuyến mãi</span>
        <Link
          to="/sale-all"
          className="ms-2"
          title="Xem tất cả sách khuyến mãi"
          style={{ color: "#2e7d32" }}
        >
          <FaChevronDown size={18} />
        </Link>
      </h4>

      <div className="sale-grid-container">
        {books.map((book) => (
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
              <Link to={`/sale-book/${book.id}`} state={{ book }}>
                <img src={book.image} alt={book.title} className="book-image" />
                <h5 className="book-title">{book.title}</h5>
              </Link>

              <p className="book-price">
                <span className="final-price">
                  {(book.finalPrice * 1000).toLocaleString("vi-VN")}₫
                </span>
              </p>

              <p className="book-size">Kích thước: {book.packagingSize}</p>

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

        {/* Khung trống giữ layout nếu thiếu */}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="sale-grid-item"
            style={{ visibility: "hidden" }}
          >
            <div className="book-card"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sale;
