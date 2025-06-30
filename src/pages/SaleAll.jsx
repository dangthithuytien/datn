import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import "../components/style/sale.css"; // CSS giống AllBook

const SaleAll = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();
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

        setBooks(mapped);
      } catch (err) {
        console.error("Lỗi lấy sách khuyến mãi:", err);
      }

      const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
      setFavoriteIds(favorites.map((b) => b.SaleBookId));
    };

    fetchPromotedBooks();
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

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  // Tính số placeholder để đủ 5 sách mỗi hàng
  const placeholderCount = (5 - (books.length % 5)) % 5;

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Tất cả sách khuyến mãi</span>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {books.map((book) => (
          <div key={book.id} className="book-item" style={{ width: "19%" }}>
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${favoriteIds.includes(book.id) ? "active" : ""}`}
                onClick={() => handleAddToFavorites(book)}
              />
              {book.discountPercent !== null && (
                <div className="discount-badge">-{book.discountPercent}%</div>
              )}
              <div onClick={() => handleBookClick(book)} style={{ cursor: "pointer" }}>
                <img src={book.image} alt={book.title} className="book-image" />
                <div className="book-title">{book.title}</div>
                <div className="book-price">
                  <span className="text-muted text-decoration-line-through me-1">
                    {(book.price * 1000).toLocaleString("vi-VN")}₫
                  </span>
                  <br />
                  <span className="text-danger fw-bold">
                    {(book.finalPrice * 1000).toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="text-secondary small">
                  Kích thước: {book.packagingSize || "Không rõ"}
                </div>
              </div>
              <div className="button-group mt-2">
                <button
                  className="btn btn-outline-primary btn-sm me-1"
                  onClick={() => handleAddToCart(book)}
                >
                  Giỏ hàng
                </button>
                <button className="btn btn-success btn-sm">Mua ngay</button>
              </div>
            </div>
          </div>
        ))}

        {/* Chèn ô trống giữ layout nếu thiếu sách */}
        {Array.from({ length: placeholderCount }).map((_, index) => (
          <div
            key={`placeholder-${index}`}
            className="book-item"
            style={{ width: "19%", visibility: "hidden" }}
          >
            <div className="book-card"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleAll;
