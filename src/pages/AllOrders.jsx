import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/Orders.css";
import apiClient from "../components/Service/AxiosConfig";
// Icons
import { HiOutlineSearch } from "react-icons/hi";
import { MdCancel, MdArrowBack, MdShoppingCartCheckout } from "react-icons/md";
import { BsBoxSeam, BsCheck2 } from "react-icons/bs";

const OrderStatusTabs = ["Tất cả", "Đã đặt", "Đang giao", "Đã giao", "Đã hủy"];
const cancelReasons = [
  "Thay đổi ý định",
  "Đặt nhầm",
  "Tìm được chỗ khác rẻ hơn",
  "Khác",
];

const getStatusString = (status) => {
  switch (status) {
    case 0:
    case 1:
      return "Đã đặt";
    case 2:
      return "Đang giao";
    case 3:
      return "Đã giao";
    case 4:
      return "Đã hủy";
    case 5:
      return "Thất bại";
    case 6:
      return "Quá hạn";
    default:
      return "Không xác định";
  }
  
};

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showReasonInput, setShowReasonInput] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem("user"));
  
        const res = await apiClient.get("/admin/saleorders");
  
        const allOrders = res.data; // ✅ Đây là cách đúng với axios
  
        const userOrders = allOrders
          .filter((order) => order.UserId === currentUser?.UserId)
          .map((order) => ({
            ...order,
            statusText: getStatusString(order.Status),
          }));
  
        setOrders(userOrders);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng người dùng:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const res = await apiClient.put(`/admin/saleorders/${orderId}/status`, 4); // Gửi status = 4
  
      if (res.status === 200) {
        const updated = orders.map((o) =>
          o.OrderId === orderId
            ? {
                ...o,
                Status: 4,
                statusText: "Đã hủy",
                cancelReason: reason,
              }
            : o
        );
        setOrders(updated);
        setShowReasonInput(null);
      } else {
        alert("Không thể hủy đơn hàng. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      alert("Lỗi mạng khi hủy đơn hàng.");
    }
  };
  
  const handleConfirmReceived = async (orderId) => {
    try {
      const res = await apiClient.put(`/admin/saleorders/${orderId}/status`, 3); // Gửi status = 3
  
      if (res.status === 200) {
        const updated = orders.map((o) =>
          o.OrderId === orderId
            ? {
                ...o,
                Status: 3,
                statusText: "Đã giao",
              }
            : o
        );
        setOrders(updated);
      } else {
        alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Lỗi mạng khi cập nhật trạng thái.");
    }
  };
  
  
  const handleBuyAgain = (products) => {
    localStorage.setItem("cartBuy", JSON.stringify(products));
    window.location.href = "/cart";
  };

  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.statusText === statusFilter);

  return (
    <div className="container mt-4">
      <h2>Danh sách đơn hàng</h2>

      <div className="d-flex mb-3" style={{ width: "100%" }}>
        {OrderStatusTabs.map((tab, index) => (
          <button
            key={tab}
            className={`btn ${
              statusFilter === tab ? "btn-success" : "btn-outline-success"
            }`}
            style={{
              borderRadius: "0",
              borderRight:
                index !== OrderStatusTabs.length - 1 ? "1px solid #dee2e6" : "",
              flex: 1,
              margin: 0,
            }}
            onClick={() => setStatusFilter(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th>Mã đơn</th>
              <th>Ngày tạo</th>
              <th>Phương thức thanh toán</th>
              <th>Tiền giảm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th> 
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.OrderId}>
                <td>#{order.OrderId}</td>
                <td>{order.OrderDate}</td>
                <td>{order.PaymentMethod}</td>
                <td>{order.DiscountAmount}đ</td>
                <td>{order.TotalAmount}đ</td>
                <td>{order.statusText}</td>
                <td>
                  <div className="action-icons d-flex flex-wrap gap-1 justify-content-center">
                    <button
                      className="btn btn-info btn-sm"
                      title="Xem chi tiết"
                      onClick={() => navigate(`/orders-sells/${order.OrderId}`)}
                    >
                      <HiOutlineSearch />
                    </button>

                    {order.statusText === "Đã đặt" && (
                      <>
                        {showReasonInput === order.OrderId ? (
                          <div style={{ width: "100%" }}>
                            <select
                              className="form-select mb-1"
                              onChange={(e) =>
                                handleCancelOrder(order.OrderId, e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="" disabled>
                                Chọn lý do hủy
                              </option>
                              {cancelReasons.map((r, i) => (
                                <option key={i} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-secondary btn-sm"
                              title="Hủy bỏ"
                              onClick={() => setShowReasonInput(null)}
                            >
                              <MdArrowBack />
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            title="Hủy đơn"
                            onClick={() => setShowReasonInput(order.OrderId)}
                          >
                            <MdCancel />
                          </button>
                        )}
                      </>
                    )}

                    {order.statusText === "Đang giao" && (
                      <button
                        className="btn btn-primary btn-sm"
                        title="Đã nhận hàng"
                        onClick={() => handleConfirmReceived(order.OrderId)}
                      >
                        <BsBoxSeam className="me-1" />
                        <BsCheck2 />
                      </button>
                    )}

                
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrders;
