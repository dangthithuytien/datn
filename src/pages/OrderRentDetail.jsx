import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components/style/OrderRentDetail.css"; // <-- Tạo file này

const OrderRentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rentOrders")) || [];
    const found = stored.find((o) => o.id.toString() === id);
    if (found) setOrder(found);
  }, [id]);

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
  };

  if (!order) return <div className="container mt-4">Đơn hàng không tồn tại.</div>;

  return (
    <div className="container order-detail-container mt-4">
      <h2>Chi tiết đơn thuê #{order.id}</h2>

      {/* Thông tin khách hàng */}
      <div className="order-section">
        <h5>👤 Thông tin khách hàng</h5>
        <div className="info-box">
          <p><strong>Họ tên:</strong> {order.customer.name}</p>
          <p><strong>Điện thoại:</strong> {order.customer.phone}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Địa chỉ:</strong> {order.customer.addressDetail}, {order.customer.ward}, {order.customer.district}, {order.customer.province}</p>
        </div>
      </div>

      {/* Thông tin giao hàng & thanh toán */}
      <div className="order-section">
        <h5>🚚 Giao hàng & Thanh toán</h5>
        <div className="info-box">
          <p><strong>Phương thức giao hàng:</strong> {order.shipping === "store_pickup" ? "Nhận tại cửa hàng" : "Giao tận nơi"}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.payment.toUpperCase()}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Ngày đặt:</strong> {order.date}</p>
        </div>
      </div>

      {/* Danh sách sách thuê */}
      <div className="order-section">
        <h5>📚 Sách đã thuê</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Ngày thuê</th>
                <th>Ngày trả</th>
                <th>Số lượng</th>
                <th>Giá thuê/ngày</th>
                <th>Tiền cọc</th>
                <th>Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => {
                const days = calculateDays(item.rentDate, item.returnDate);
                const subtotal = item.rentPrice * days * item.quantity + item.deposit;
                return (
                  <tr key={index}>
                    <td>
                      <img src={item.image} alt={item.title} width="60" height="80" />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.rentDate}</td>
                    <td>{item.returnDate}</td>
                    <td>{item.quantity}</td>
                    <td>{item.rentPrice.toLocaleString()}đ</td>
                    <td>{item.deposit.toLocaleString()}đ</td>
                    <td>{subtotal.toLocaleString()}đ</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tổng thanh toán */}
      <div className="order-section text-end">
        <h5>
          Tổng thanh toán:{" "}
          <span style={{ color: "#28a745" }}>{order.total.toLocaleString()}đ</span>
        </h5>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default OrderRentDetail;
