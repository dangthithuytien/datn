import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import "../components/style/sale.css";

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

        setBooks(mapped.slice(0, 10));
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

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Sách khuyến mãi</span>
        <Link
          to="/sale-all"
          className="ms-auto text-success"
          style={{ fontSize: "1rem", fontWeight: 600 }}
        >
          Xem tất cả
        </Link>
      </h4>

      <div className="sale-grid-container">
        {books.map((book) => (
          <div key={book.id} className="sale-grid-item">
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${
                  favoriteIds.includes(book.id) ? "active" : ""
                }`}
                onClick={() => handleAddToFavorites(book)}
              />
              {book.discountPercent !== null && (
                <div className="flame-badge">
                  🔥
                  <span className="discount-text">-{book.discountPercent}%</span>
                </div>
              )}
              <Link to={`/sale-book/${book.id}`} state={{ book }}>
                <img src={book.image} alt={book.title} className="book-image" />
                <h5 className="book-title">{book.title}</h5>
              </Link>

              <p className="book-price">
              <span className="final-price">
                  {(book.finalPrice * 1000).toLocaleString("vi-VN")}đ
                </span>
                {/* <span className="original-price">
                  {(book.price * 1000).toLocaleString("vi-VN")}đ
                </span> */}
                
              </p>

              <p className="book-size">
                Kích thước: {book.packagingSize}
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
    </div>
  );
};

export default Sale;
