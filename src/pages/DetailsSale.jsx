import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleBookById } from "../components/Service/saleBookService";
import "../components/style/detailsSale.css";
import CommentSection from "./CommentSection";
import { addToCartSale } from "../components/Service/cartService";


import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa";
import FavoriteSaleBookService from "../components/Service/FavoriteSaleBookService"; // ✅ THÊM: Service yêu thích
import { tokenUtils } from "../components/Cookie/cookieUtils"; // ✅ THÊM: Quản lý token





const DetailsSale = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const baseURL = "https://localhost:7003";

  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích (đồng bộ server)
 
  const [accessToken, setAccessToken] = useState(tokenUtils.getAccessToken()); // Token đồng bộ
  
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
    const fetchBook = async () => {
      try {
        const data = await getSaleBookById(id);
        const originalPrice = data.Price;
        const finalPrice = data.FinalPrice;
        const discountPercent =
          data.DiscountPercentage !== undefined
            ? data.DiscountPercentage
            : originalPrice && finalPrice
            ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
            : null;

        setBook({ ...data, finalPrice, discountPercent });
      } catch (error) {
        console.error("Không thể lấy chi tiết sách khuyến mãi:", error);
      }
    };

    fetchBook();
    // ✅ THÊM MỚI: Kiểm tra trạng thái yêu thích và bookmark khi load
    if (accessToken) {
      checkFavoriteStatus();
    }
   
  }, [id, accessToken]);
  
  const checkFavoriteStatus = async () => {
    try {
      const favorites = await FavoriteSaleBookService.getFavorites();
      const isBookFavorited = favorites.some(f => String(f.SaleBookId) === String(id));
      setIsFavorite(isBookFavorited);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra trạng thái yêu thích:", error);
    }
  };
  const toggleFavorite = async () => {
    if (!accessToken) {
      alert("❌ Vui lòng đăng nhập để yêu thích sách!");
      return;
    }

    try {
      if (isFavorite) {
        await FavoriteSaleBookService.removeFavorite(String(id));
        setIsFavorite(false);
        alert("💔 Đã bỏ khỏi danh sách yêu thích!");
      } else {
        await FavoriteSaleBookService.addFavorite(String(id));
        setIsFavorite(true);
        alert("❤️ Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("❌ Lỗi xử lý yêu thích:", error);
      alert("Không thể xử lý yêu thích!");
    }
  };
  // ✅ SỬA: Thêm accessToken dependency
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
  if (!book) return;
  try {
    await addToCartSale(book.SaleBookId, quantity); // ✅ Gọi API
    alert("✅ Đã thêm vào giỏ hàng!");
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng:", err);
    alert("❌ Không thể thêm vào giỏ hàng. Bạn đã đăng nhập chưa?");
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
    ProductId: book.SaleBookId,
    ProductName: book.Title,
    Quantity: 1,
    UnitPrice: book.FinalPrice || book.Price,
    ImageUrl: book.ImageUrl,
  };

  localStorage.setItem("cartBuy", JSON.stringify([selectedProduct]));
  
  localStorage.setItem("checkoutTotal", JSON.stringify(book.FinalPrice || book.Price));
  localStorage.setItem("isBuyNow", "true"); 

  navigate("/checkout");
};

  if (!book) {
    return (
      <div className="container mt-4">
        <h3>Không tìm thấy sách khuyến mãi</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 details-container">
      <div className="row">
        {/* Hình ảnh */}
        <div
          className="col-md-5 details-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="book-sale-box position-relative">
            <img
              src={`${baseURL}${book.ImageUrl}`}
              alt={book.Title}
              className="img-fluid details-image"
              style={{
                transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
                transform: mousePosition.x ? "scale(1.3)" : "scale(1)",
                transition: "transform 0.2s ease-out",
              }}
            />
          </div>
        </div>

        {/* Thông tin sách */}
        <div className="col-md-7 details-info">
          <h2 className="details-title d-flex align-items-center gap-2">
            {book.Title}
            {book.discountPercent > 0 && (
              <span className="flame-badge-inline">
                🔥 <span className="discount">-{book.discountPercent}%</span>
              </span>
            )}
          </h2>

          <div className="price-section mb-3">
            <span
              className="sale-price text-danger fw-bold"
              style={{ fontSize: "28px" }}
            >
              {(book.finalPrice ).toLocaleString("vi-VN")}đ
            </span>
            <span
              style={{ fontSize: "20px" }}
              className="original-price text-muted text-decoration-line-through ms-3"
            >
              {(book.Price ).toLocaleString("vi-VN")}đ
            </span>
          </div>

          <div className="mb-3">
            <p>
              <strong>Nhà xuất bản:</strong> {book.Publisher || "Không có"}
            </p>
            <p>
              <strong>Dịch giả:</strong> {book.Translator || "Không có"}
            </p>
            <p>
              <strong>Số trang:</strong> {book.PageCount || "Không rõ"}
            </p>
            <p>
              <strong>Kích thước:</strong> {book.PackagingSize || "Không rõ"}
            </p>
          </div>

          {/* Số lượng */}
          <div className="quantity-control d-flex align-items-center mb-3 gap-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleDecrease}
            >
              -
            </button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="form-control form-control-sm text-center"
              style={{ width: "50px" }}
            />
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <div className="details-buttons d-flex gap-3 mt-3">
            <button className="btn-add-to-cart" onClick={handleAddToCart}>
              🛒 Thêm vào giỏ
            </button>
            <button className="btn-buy-now"   onClick={() => handleBuyNow(book)}>⚡ Mua ngay</button>
            <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                onClick={toggleFavorite}
                title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              >
                {isFavorite ? (
                  <>
                    <FaHeart style={{ color: "red" }} />
                    <span className="d-none d-md-inline">Đã thích</span>
                  </>
                ) : (
                  <>
                    <FaRegHeart />
                    <span className="d-none d-md-inline">Yêu thích</span>
                  </>
                )}
              </button>

          </div>
        </div>
      </div>

      {/* Mô tả và chi tiết */}
      <div className="row mt-5 details-bottom">
        <div className="col-md-7">
          <h4>Mô tả sách</h4>
          <p>{book.Description || "Không có mô tả."}</p>
        </div>
        <div className="col-md-5">
          <h4>Thông tin chi tiết</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Tiêu đề</th>
                <td>{book.Title}</td>
              </tr>
              <tr>
                <th>Giá bán</th>
                <td>{book.Price}</td>
              </tr>
              <tr>
                <th>NXB</th>
                <td>{book.Publisher}</td>
              </tr>
              <tr>
                <th>Số lượng</th>
                <td>{book.Quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== BÌNH LUẬN ==== */}
      <CommentSection
        bookId={book.SaleBookId}
        storageKeyPrefix="comments-sale"
      />
    </div>
  );
};

export default DetailsSale;
