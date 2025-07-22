import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../components/Service/AxiosConfig";

const OrderSellDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const resDetails = await apiClient.get(`/admin/saleorders/${id}/details`);
        setDetails(resDetails.data);

         const resOrder = await apiClient.get(`/admin/saleorders`);
         setOrderInfo(resOrder.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
      }
    };

    fetchOrderData();
  }, [id]);

  const totalAmount = details.reduce((sum, item) => sum + item.SubTotal, 0);

  return (
    <div className="container mt-4">
      <h3>📦 Chi tiết đơn hàng</h3>
      <p>
        Mã đơn hàng:{" "}
        <strong>#{id?.substring(0, 6).toUpperCase() || "N/A"}</strong>
      </p>
      <Link to="/orders-all" className="btn btn-secondary mb-3">
        ← Quay lại danh sách
      </Link>

       {orderInfo && (
        <div className="mb-3">
          <p>
            <strong>📍 Địa chỉ nhận hàng:</strong> {orderInfo.Address}
          </p>
          <p>
            <strong>📞 Số điện thoại:</strong> {orderInfo.Phone}
          </p>
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
              <td colSpan="3">
                <strong>Tổng cộng</strong>
              </td>
              <td>
                <strong>{totalAmount.toLocaleString()}đ</strong>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderSellDetails;
