// File: DetailsBook.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleBookById } from "../components/Service/saleBookService";
import CommentSection from "./CommentSection";
import "../components/style/detailsbook.css";

const DetailsBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const baseURL = "https://localhost:7003";

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getSaleBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Không thể lấy chi tiết sách:", error);
      }
    };
    fetchBook();
  }, [id]);

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
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

  const handleAddToCart = () => {
    if (!book) return;
    const cart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    const existingItem = cart.find((item) => item.SaleBookId === book.SaleBookId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...book, quantity });
    }

    localStorage.setItem("cartBuy", JSON.stringify(cart));
    alert("✅ Đã thêm vào giỏ hàng!");
  };

  if (!book) {
    return (
      <div className="container mt-4">
        <h3>Không tìm thấy sách</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 details-container">
      <div className="row">
        <div
          className="col-md-5 details-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
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

        <div className="col-md-7 details-info">
          <h2 className="details-title">{book.Title}</h2>
          <p className="book-price-lg text-danger fw-bold" style={{ fontSize: "28px" }}>
            {(book.Price * 1000).toLocaleString("vi-VN")}đ
          </p>

          <div className="mb-3">
            <p><strong>Nhà xuất bản:</strong> {book.Publisher || "Không có"}</p>
            <p><strong>Dịch giả:</strong> {book.Translator || "Không có"}</p>
            <p><strong>Số trang:</strong> {book.PageCount || "Không rõ"}</p>
            <p><strong>Kích thước:</strong> {book.PackagingSize || "Không rõ"}</p>
          </div>

          <div className="quantity-control d-flex align-items-center mb-3 gap-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={handleDecrease}>-</button>
            <input
              type="text"
              readOnly
              value={quantity}
              className="form-control form-control-sm text-center"
              style={{ width: "50px" }}
            />
            <button className="btn btn-sm btn-outline-secondary" onClick={handleIncrease}>+</button>
          </div>

          <div className="details-buttons d-flex gap-3 mt-3">
            <button className="btn-add-to-cart" onClick={handleAddToCart}>🛒 Thêm vào giỏ</button>
            <button className="btn-buy-now">⚡ Mua ngay</button>
          </div>
        </div>
      </div>

      {/* Mô tả & chi tiết */}
      <div className="row mt-5 details-bottom">
        <div className="col-md-7">
          <h4>Mô tả sách</h4>
          <p>{book.Description || "Không có mô tả."}</p>
        </div>
        <div className="col-md-5">
          <h4>Thông tin chi tiết</h4>
          <table className="table table-bordered">
            <tbody>
              <tr><th>Tiêu đề</th><td>{book.Title}</td></tr>
              <tr><th>Giá</th><td>{(book.Price * 1000).toLocaleString("vi-VN")}đ</td></tr>
              <tr><th>NXB</th><td>{book.Publisher || "Không có"}</td></tr>
              <tr><th>Số lượng</th><td>{book.Quantity}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ==== BÌNH LUẬN ==== */}
      <CommentSection bookId={book.SaleBookId} storageKeyPrefix="comments-sale" />
    </div>
  );
};

export default DetailsBook;
