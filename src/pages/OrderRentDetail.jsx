import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../components/Service/AxiosConfig";
const OrderRentDetail = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  // Hàm format tiền tệ an toàn
  const formatCurrency = (value) => {
    if (typeof value !== "number") return "0";
    return value.toLocaleString() + "đ";
  };

 
useEffect(() => {
  const fetchOrderData = async () => {
    try {
      // Gọi API chi tiết đơn thuê
      const resDetails = await apiClient.get(`/admin/rentorders/${id}/details`);
      setDetails(resDetails.data);
      console.log("Chi tiết đơn thuê:", resDetails.data);

      // Gọi API thông tin đơn thuê
      const resOrder = await apiClient.get(`/admin/rentorders/${id}`);
      setOrderInfo(resOrder.data);
      console.log("Thông tin đơn thuê:", resOrder.data);
    } catch (err) {
      alert("Lỗi khi lấy dữ liệu đơn thuê");
      console.error(err);
    }
  };

  fetchOrderData();
}, [id]);

  const totalAmount = orderInfo?.TotalFee || 0;

  // Hàm hiển thị trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Quá hạn";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đã giao";
      case 3:
        return "Đã trả";
      case 4:
        return "Thất bại";
      case 5:
        return "Đã hủy";
      case 6:
        return "Chờ xác nhận";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h3>📘 Chi tiết đơn thuê</h3>
      <p>Mã đơn thuê: <strong>#{id}</strong></p>
      <Link to="/orders-rent" className="btn btn-secondary mb-3">← Quay lại danh sách</Link>

      {orderInfo && (
        <div className="mb-3">
          <p><strong>📍 Địa chỉ nhận sách:</strong> {orderInfo.Address}</p>
          <p><strong>📞 Số điện thoại:</strong> {orderInfo.Phone}</p>
          <p><strong>📅 Ngày thuê:</strong> {new Date(orderInfo.StartDate).toLocaleDateString()}</p>
          <p><strong>📅 Ngày trả:</strong> {new Date(orderInfo.EndDate).toLocaleDateString()}</p>
          <p><strong>💰 Tiền cọc:</strong> {formatCurrency(orderInfo.TotalDeposit)}</p>
          <p><strong>🚚 Trạng thái:</strong> {getStatusText(orderInfo.Status)}</p>
        </div>
      )}

      {details.length === 0 ? (
        <p>Không có dữ liệu chi tiết.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Tên sách</th>
              <th>Số lượng</th>
              <th>Tiền thuê/ngày</th>
              <th>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {details.map((item) => (
              <tr key={item.Id}>
                <td>{item.BookTitle}</td>
                <td>{item.Quantity}</td>
                <td>{formatCurrency(item.UnitPrice)}</td>
                <td>{formatCurrency(item.SubTotal)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"><strong>Tổng cộng</strong></td>
              <td><strong>{formatCurrency(totalAmount)}</strong></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderRentDetail;
