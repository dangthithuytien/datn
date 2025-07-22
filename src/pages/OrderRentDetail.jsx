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
      const resOrder = await apiClient.get(`/admin/rentorders`);
      const matchedOrder = resOrder.data.find(order => order.OrderId === id); 
      setOrderInfo(matchedOrder);
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
  const getStatusText = (Status) => {
    switch (Status) {
      case 0:
        return "Chờ xác nhận";
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
        return "Quá hạn";
      default:
        return "Không rõ";
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h3>📘 Chi tiết đơn thuê</h3>
      <p>Mã đơn thuê: <strong>#{id?.substring(0, 6).toUpperCase() || 'N/A'}</strong></p>
      <Link to="/orders-rent" className="btn btn-secondary mb-3">← Quay lại danh sách</Link>
     
      {orderInfo && (
        <div className="mb-3">
        <p><strong>📅 Ngày thuê:</strong> {new Date(orderInfo.StartDate).toLocaleDateString()}</p>
        <p><strong>📅 Ngày trả:</strong> {new Date(orderInfo.EndDate).toLocaleDateString()}</p>
        <p><strong>🕒 Số ngày thuê:</strong> {orderInfo.RentalDays} ngày</p>
        <p><strong>🚚 Phí vận chuyển:</strong> {orderInfo.HasShippingFee ? formatCurrency(orderInfo.ShippingFee) : "0đ"}</p>
        <p><strong>💰 Tiền cọc:</strong> {formatCurrency(orderInfo.TotalDeposit)}</p>
        <p><strong>💵 Tổng phí:</strong> {formatCurrency(orderInfo.TotalFee)}</p>
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
            <th>Giá sách</th>
            <th>Tình trạng khi giao (%)</th>
            <th>Tình trạng khi trả (%)</th>
            <th>Phí thuê</th>
            <th>Tổng phí</th>
            <th>Hoàn tiền thực tế</th>
            <th>Ngày trả thực tế</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item) => (
            <tr key={item.Id}>
              <td>{item.BookTitle}</td>
              <td>{formatCurrency(item.BookPrice)}</td>
              <td>{item.Condition}%</td>
              <td>{item.ReturnCondition !== null ? `${item.ReturnCondition}%` : "Chưa trả"}</td>
              <td>{formatCurrency(item.RentalFee)}</td>
              <td>{formatCurrency(item.TotalFee)}</td>
              <td>
                {item.ActualRefundAmount !== null
                  ? formatCurrency(item.ActualRefundAmount)
                  : "Chưa hoàn"}
              </td>
              <td>
                {item.ActualReturnDate
                  ? new Date(item.ActualReturnDate).toLocaleDateString()
                  : "Chưa trả"}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="7"><strong>Tổng cộng</strong></td>
            <td><strong>{formatCurrency(totalAmount)}</strong></td>
          </tr>
        </tbody>
      </table>
      
      )}
    </div>
  );
};

export default OrderRentDetail;
