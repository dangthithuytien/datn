import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const OrderSellDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null); // Thêm để chứa Address, Phone

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        // Gọi chi tiết sản phẩm
        const resDetails = await fetch(`https://localhost:7003/api/admin/saleorders/${id}/details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resDetails.ok) throw new Error("Không thể lấy chi tiết đơn hàng");
        const detailData = await resDetails.json();
        setDetails(detailData);

        // Gọi thông tin đơn hàng chính
        const resOrder = await fetch(`https://localhost:7003/api/admin/saleorders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resOrder.ok) throw new Error("Không thể lấy thông tin đơn hàng");
        const orderData = await resOrder.json();
        setOrderInfo(orderData);

      } catch (err) {
        alert(err.message);
      }
    };

    fetchOrderData();
  }, [id]);

  const totalAmount = details.reduce((sum, item) => sum + item.SubTotal, 0);

  return (
    <div className="container mt-4">
      <h3>📦 Chi tiết đơn hàng</h3>
      <p>Mã đơn hàng: <strong>{id}</strong></p>
      <Link to="/orders-all" className="btn btn-secondary mb-3">← Quay lại danh sách</Link>

      {orderInfo && (
        <div className="mb-3">
          <p><strong>📍 Địa chỉ nhận hàng:</strong> {orderInfo.Address}</p>
          <p><strong>📞 Số điện thoại:</strong> {orderInfo.Phone}</p>
        </div>
      )}

      {details.length === 0 ? (
        <p>Không có dữ liệu chi tiết.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item) => (
              <tr key={item.Id}>
                <td>{item.ProductName}</td>
                <td>{item.Quantity}</td>
                <td>{item.UnitPrice.toLocaleString()}đ</td>
                <td>{item.SubTotal.toLocaleString()}đ</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Tổng cộng</strong></td>
              <td><strong>{totalAmount.toLocaleString()}đ</strong></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderSellDetails;
