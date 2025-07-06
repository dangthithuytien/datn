import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/Orders.css";

// Icons
import { HiOutlineSearch } from "react-icons/hi";
import { MdCancel, MdArrowBack, MdShoppingCartCheckout } from "react-icons/md";
import { BsBoxSeam, BsCheck2 } from "react-icons/bs";

const OrderStatusTabs = ["Tất cả", "Đã đặt", "Đang giao", "Đã giao", "Đã hủy"];
const cancelReasons = ["Thay đổi ý định", "Đặt nhầm", "Tìm được chỗ khác rẻ hơn", "Khác"];

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [showReasonInput, setShowReasonInput] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const currentUser = JSON.parse(localStorage.getItem("user")); // 👈 user hiện tại
  
        const res = await fetch("https://localhost:7003/api/admin/saleorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const allOrders = await res.json();
        console.log("Dữ liệu người dùng:", currentUser);
        console.log("Dữ liệu đơn hàng:", allOrders);
        // ⚠️ Kiểm tra key chính xác: 'userId' hay 'UserId' hay 'UserID'
        const userOrders = allOrders.filter(
          (order) => order.UserId == currentUser?.UserId// hoặc currentUser?.UserId nếu tên khác
        );
  
        setOrders(userOrders);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng người dùng:", error);
      }
    };
  
    fetchOrders();
  }, []);
  

  const handleCancelOrder = (orderId, reason) => {
    const updated = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: "Đã hủy", cancelReason: reason } : o
    );
    setOrders(updated);
    setShowReasonInput(null);
  };

  const handleConfirmReceived = (orderId) => {
    const updated = orders.map((o) =>
      o.orderId === orderId ? { ...o, status: "Đã giao" } : o
    );
    setOrders(updated);
  };

  const handleBuyAgain = (products) => {
    localStorage.setItem("cartBuy", JSON.stringify(products));
    window.location.href = "/cart";
  };

  const filteredOrders =
    statusFilter === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

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
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.OrderId}>
                <td>#{order.OrderId}</td>
          
                <td>
                {order.OrderDate}
                </td>
                <td>{order.PaymentMethod}</td>
                <td>{order.DiscountAmount}đ</td>
                <td>{order.TotalAmount}đ</td>
              
                <td>
                  <div className="action-icons d-flex flex-wrap gap-1 justify-content-center">
                    <button
                      className="btn btn-info btn-sm"
                      title="Xem chi tiết"
                      onClick={() => navigate(`/orders-sell/${order.OrderId}`)}


                    >
                      <HiOutlineSearch />
                    </button>

                    {order.status === "Đã đặt" && (
                      <>
                        {showReasonInput === order.orderId ? (
                          <div style={{ width: "100%" }}>
                            <select
                              className="form-select mb-1"
                              onChange={(e) =>
                                handleCancelOrder(order.orderId, e.target.value)
                              }
                              defaultValue=""
                            >
                              <option value="" disabled>Chọn lý do hủy</option>
                              {cancelReasons.map((r, i) => (
                                <option key={i} value={r}>{r}</option>
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
                            onClick={() => setShowReasonInput(order.orderId)}
                          >
                            <MdCancel />
</button>
                        )}
                      </>
                    )}

                    {order.status === "Đang giao" && (
                      <button
                        className="btn btn-primary btn-sm"
                        title="Đã nhận hàng"
                        onClick={() => handleConfirmReceived(order.orderId)}
                      >
                        <BsBoxSeam className="me-1" />
                        <BsCheck2 />
                      </button>
                    )}

                    {order.status === "Đã hủy" && (
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        title="Mua lại"
                        onClick={() => handleBuyAgain(order.products)}
                      >
                        <MdShoppingCartCheckout />
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
