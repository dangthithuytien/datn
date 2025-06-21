import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/Orders.css";

const OrderStatusTabs = ["Tất cả", "Đã đặt", "Đang giao", "Đã giao", "Đã hủy"];

const OrdersRent = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rentOrders")) || [];
    setOrders(stored);
  }, []);

  const updateOrderStatus = (id, newStatus) => {
    const updated = orders.map((o) =>
      o.id === id ? { ...o, status: newStatus } : o
    );
    setOrders(updated);
    localStorage.setItem("rentOrders", JSON.stringify(updated));
  };

  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="container mt-4 mb-5">
      <h2>📘 Danh sách đơn thuê</h2>

      <div className="status-filter">
        {OrderStatusTabs.map((tab) => (
          <button
            key={tab}
            className={`btn ${
              statusFilter === tab ? "btn-success" : "btn-outline-success"
            }`}
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
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Phương thức</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const firstItem = order.products[0];
                return (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <img
                        src={firstItem.image}
                        alt="ảnh"
                        width="60"
                        height="80"
                      />
                    </td>
                    <td>{firstItem.title}</td>
                    <td>{order.payment}</td>
                    <td>{order.total.toLocaleString()}đ</td>
                    <td>{order.status}</td>
                    <td>
                      {order.status === "Đã đặt" && (
                        <button
                          className="btn btn-sm btn-danger mb-1"
                          onClick={() =>
                            updateOrderStatus(order.id, "Đã hủy")
                          }
                        >
                          Hủy đơn
                        </button>
                      )}
                      {order.status === "Đang giao" && (
                        <button
                          className="btn btn-sm btn-primary mb-1"
                          onClick={() =>
                            updateOrderStatus(order.id, "Đã giao")
                          }
                        >
                          Đã nhận hàng
                        </button>
                      )}
                      <br />
                      <button
                        className="btn btn-sm btn-outline-secondary mt-1"
                        onClick={() =>
                          navigate(`/orders-rent/${order.id}`)
                        }
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersRent;
