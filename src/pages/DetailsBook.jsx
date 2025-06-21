import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../components/style/detailsbook.css";

const DetailsBook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [book] = useState(location.state?.book || null);
  const [quantity, setQuantity] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleAddToCart = () => {
    if (!book) return;
    const cart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    const existingItem = cart.find((item) => item.id === book.id);

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
            src={book.image}
            alt={book.title}
            className="img-fluid details-image"
            style={{
              transformOrigin: `${mousePosition.x}px ${mousePosition.y}px`,
              transform: mousePosition.x ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.2s ease-out",
            }}
          />
        </div>

        <div className="col-md-7 details-info">
          <h2 className="details-title">{book.title}</h2>
          <p>
            <strong>Tác giả:</strong> {book.author}
          </p>
          <p>
            <strong>Giá:</strong> {book.price.toLocaleString()}đ
          </p>
          <div className="quantity-control d-flex align-items-center my-2 gap-2">
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
          <div className="d-flex gap-3 mt-3">
            <button
              className="btn btn-outline-primary"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ
            </button>
            <button className="btn btn-success">Mua ngay</button>
          </div>
        </div>
      </div>

      <div className="row mt-5 details-bottom">
        <div className="col-md-7">
          <h4>Mô tả sách</h4>
          <p>{book.description || "Không có mô tả."}</p>
        </div>
        <div className="col-md-5">
          <h4>Thông tin chi tiết</h4>
          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>Tiêu đề</th>
                <td>{book.title}</td>
              </tr>
              <tr>
                <th>Tác giả</th>
                <td>{book.author}</td>
              </tr>
              <tr>
                <th>Giá</th>
                <td>{book.price.toLocaleString()}đ</td>
              </tr>
              <tr>
                <th>Số lượng</th>
                <td>{quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsBook;
