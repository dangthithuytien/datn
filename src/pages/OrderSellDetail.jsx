import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../components/style/OrderSellDetail.css"; // <-- CSS riêng

const OrderSellDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sellOrders")) || [];
    const found = stored.find((o) => o.id.toString() === id);
    if (found) setOrder(found);
  }, [id]);

  if (!order) return <div className="container mt-4">Không tìm thấy đơn hàng.</div>;

  return (
    <div className="container order-detail-container mt-4">
      <h2>Chi tiết đơn hàng #{order.id}</h2>

      {/* 1. Thông tin khách hàng */}
      <div className="order-section">
        <h5>👤 Thông tin khách hàng</h5>
        <div className="info-box">
          <p><strong>Họ tên:</strong> {order.customer.name}</p>
          <p><strong>Điện thoại:</strong> {order.customer.phone}</p>
          <p><strong>Email:</strong> {order.customer.email}</p>
          <p><strong>Địa chỉ:</strong> {order.customer.addressDetail}, {order.customer.ward}, {order.customer.district}, {order.customer.province}</p>
        </div>
      </div>

      {/* 2. Thông tin giao hàng và thanh toán */}
      <div className="order-section">
        <h5>🚚 Giao hàng & Thanh toán</h5>
        <div className="info-box">
          <p><strong>Phương thức giao hàng:</strong> {order.shipping === "home_delivery" ? "Giao tận nơi" : "Nhận tại cửa hàng"}</p>
          <p><strong>Phương thức thanh toán:</strong> {order.payment.toUpperCase()}</p>
          <p><strong>Trạng thái:</strong> {order.status}</p>
          <p><strong>Ngày đặt:</strong> {order.date}</p>
          {order.status === "Đã hủy" && order.cancelReason && (
            <p><strong>Lý do hủy:</strong> {order.cancelReason}</p>
          )}
        </div>
      </div>

      {/* 3. Danh sách sản phẩm */}
      <div className="order-section">
        <h5>📚 Sản phẩm đã mua</h5>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-success">
              <tr>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Số lượng</th>
                <th>Giá mỗi cuốn</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img src={item.image} alt={item.title} width="60" height="80" />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Tổng tiền */}
      <div className="order-section text-end">
        <h5>
          Tổng thanh toán: <span style={{ color: "#28a745" }}>{order.total.toLocaleString()}đ</span>
        </h5>
        <button className="btn btn-outline-secondary mt-3" onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    </div>
  );
};

export default OrderSellDetail;
