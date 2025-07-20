import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaChevronDown } from "react-icons/fa";
import { getPromotedBooks } from "../components/Service/saleBookService";
import FavoriteSaleBookService from "../components/Service/FavoriteSaleBookService";
import { tokenUtils } from "../components/Cookie/cookieUtils";
import { addToCartSale } from "../components/Service/cartService";
import "../components/style/sale.css";
import { useNavigate } from "react-router-dom";
const Sale = () => {
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [accessToken, setAccessToken] = useState(tokenUtils.getAccessToken());
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

  useEffect(() => {
    fetchPromotedBooks();
    if (accessToken) loadFavorites();
  }, [accessToken]);

  useEffect(() => {
    const syncFavorites = () => {
      FavoriteSaleBookService.getFavorites()
        .then((favorites) => {
          const ids = favorites.map((f) => String(f.SaleBookId));
          setFavoriteIds(ids);
        })
        .catch(() => setFavoriteIds([]));
    };

    window.addEventListener("favorite-updated", syncFavorites);
    return () => window.removeEventListener("favorite-updated", syncFavorites);
  }, []);
  const fetchPromotedBooks = async () => {
    try {
      const response = await getPromotedBooks();
      const mapped = response.map((book) => {
        const discountPercent =
          book.DiscountPercentage !== undefined
            ? book.DiscountPercentage
            : book.Price && book.FinalPrice
              ? Math.round(((book.Price - book.FinalPrice) / book.Price) * 100)
              : null;

        return {
          id: book.SaleBookId,
          title: book.Title,
          image: book.ImageUrl?.startsWith("/")
            ? `${baseURL}${book.ImageUrl}`
            : book.ImageUrl,
          price: book.Price,
          finalPrice: book.FinalPrice,
          discountPercent: discountPercent,
          packagingSize: book.PackagingSize,
        };
      });

      setBooks(mapped.slice(0, 5)); // chỉ hiển thị 5 sách
    } catch (err) {
      console.error("❌ Lỗi lấy sách khuyến mãi:", err);
    }
  };

  const loadFavorites = async () => {
    try {
      const favorites = await FavoriteSaleBookService.getFavorites();
      const ids = favorites.map((f) => String(f.SaleBookId));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách yêu thích:", error);
    }
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

  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.id, 1);
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("❌ Lỗi thêm vào giỏ hàng:", error);
      alert("Không thể thêm vào giỏ hàng.");
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
        {books
          .filter((book) => book.IsHidden === true)
          .map((book) => (
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

                <Link to={`/sale-book/${book.id}`} state={{ book }}>
                  <img src={book.image} alt={book.title} className="book-image" />
                  <h5 className="book-title">{book.title}</h5>
                </Link>

                <p className="book-price">
                  <span className="final-price">
                    {(book.finalPrice).toLocaleString("vi-VN")}₫
                  </span>
                  {book.price !== book.finalPrice && (
                    <span className="original-price ms-2 text-muted text-decoration-line-through">
                      {(book.price).toLocaleString("vi-VN")}₫
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
                  <button className="btn btn-primary btn-sm"
                    onClick={() => handleBuyNow(book)}>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          ))}

        {/* Placeholder giữ layout nếu < 5 quyển */}
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
