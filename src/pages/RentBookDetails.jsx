import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRentBookById } from "../components/Service/rentBookService";
import "../components/style/detailsbook.css";

const baseURL = "https://localhost:7003";

const RentBookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getRentBookById(id);
        setBook(data);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết sách thuê:", err);
      }
    };

    fetchBook();
  }, [id]);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePosition({ x: clientX, y: clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  const handleAddToRentCart = () => {
    if (!book) return;

    const rentCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    const exists = rentCart.find((item) => item.id === book.RentBookId);

    if (exists) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      id: book.RentBookId,
      title: book.Title,
      rentPrice: book.Price,
      image: `${baseURL}${book.ImageUrl}`,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    localStorage.setItem("rentCart", JSON.stringify([...rentCart, rentItem]));
    alert("✅ Đã thêm vào giỏ thuê!");
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
        {/* Hình ảnh sách */}
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

        {/* Thông tin sách */}
        <div className="col-md-7 details-info">
          <h2 className="details-title">{book.Title}</h2>

          {/* Giá thuê */}
          <p
            className="book-price-lg text-danger fw-bold"
            style={{ fontSize: "28px", marginBottom: "12px" }}
          >
            {book.Price.toLocaleString("vi-VN")}đ/ngày
          </p>

          {/* Thông tin phụ */}
          <div className="mb-3">
            <p><strong>Nhà xuất bản:</strong> {book.Publisher || "Không có"}</p>
            <p><strong>Dịch giả:</strong> {book.Translator || "Không có"}</p>
            <p><strong>Số trang:</strong> {book.PageCount || "Không rõ"}</p>
            <p><strong>Kích thước:</strong> {book.PackagingSize || "Không rõ"}</p>
          </div>

          
          {/* Nút hành động */}
          <div className="d-flex gap-3 mt-3">
            <button className="btn btn-outline-primary" onClick={handleAddToRentCart}>
              Thêm vào giỏ thuê
            </button>
            <button className="btn btn-success" onClick={() => navigate("/rent-cart")}>
              Thuê ngay
            </button>
          </div>
        </div>
      </div>

      {/* Mô tả & Thông tin chi tiết */}
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
                <th>Giá thuê</th>
                <td>{book.Price.toLocaleString("vi-VN")}đ/ngày</td>
              </tr>
              <tr>
                <th>Tiền cọc</th>
                <td>50.000đ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RentBookDetails;
