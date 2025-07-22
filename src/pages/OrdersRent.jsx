import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/Orders.css";
import apiClient from "../components/Service/AxiosConfig";

const RENTAL_STATUSES = {
  0: "Chờ xác nhận",
  1: "Đã xác nhận",
  2: "Đang giao",
  3: "Hoàn thành",
  4: "Đang thuê",
  5: "Quá hạn",
  6: "Đã hủy",
};
const OrderStatusTabs = [
  "Tất cả",
  "Chờ xác nhận", 
  "Đã xác nhận",
  "Đang giao",
  "Đang thuê",
  "Quá hạn",
  "Hoàn thành",
  "Đã hủy",
];

const OrdersRent = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
        const res = await apiClient.get("/admin/rentorders");
        const allOrders = res.data;

        const userOrders = allOrders.filter(
          (o) => o.UserId == currentUser?.UserId
        );

        setOrders(userOrders);
      } catch (err) {
        console.error("Lỗi lấy danh sách đơn thuê:", err);
        alert("Không thể lấy danh sách đơn thuê");
      }
    };

    fetchOrders();
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    const updated = orders.map((o) =>
      o.OrderId === id ? { ...o, Status: newStatus } : o
    );
    setOrders(updated);
  };

  const getStatusText = (status) => RENTAL_STATUSES[status] || "Không xác định";

  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => getStatusText(order.Status) === statusFilter);

  return (
    <div className="container mt-4 mb-5">
      <h2>📘 Danh sách đơn thuê</h2>

      <div className="status-filter mb-3">
        {OrderStatusTabs.map((tab) => (
          <button
            key={tab}
            className={`btn ${
              statusFilter === tab ? "btn-success" : "btn-outline-success"
            } me-2`}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Ngày thuê</th>
                <th>Ngày trả</th>
                <th>Tổng tiền</th>
                <th>Tiền cọc</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
         
              {filteredOrders.map((order) => (
                <tr key={order.OrderId}>
                  <td>#{order.OrderId?.substring(0, 6).toUpperCase() || 'N/A'}</td>
                  <td>{new Date(order.StartDate).toLocaleDateString()}</td>
                  <td>{new Date(order.EndDate).toLocaleDateString()}</td>
                  <td>{order.TotalFee.toLocaleString()}đ</td>
                  <td>{order.TotalDeposit.toLocaleString()}đ</td>
                  <td>{getStatusText(order.Status)}</td>
                  <td>
                    {order.Status === 1 && (
                      <button
                        className="btn btn-sm btn-danger mb-1"
                        onClick={() => updateOrderStatus(order.OrderId, 5)} // Hủy
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.Status === 2 && (
                      <button
                        className="btn btn-sm btn-primary mb-1"
                        onClick={() => updateOrderStatus(order.OrderId, 3)} // Trả
                      >
                        Đã trả sách
                      </button>
                    )}
                    <br />
                    <button
                      className="btn btn-sm btn-outline-secondary mt-1"
                      onClick={() => navigate(`/orders-rent/${order.OrderId}`)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersRent;
