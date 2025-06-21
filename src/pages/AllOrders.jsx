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
    const stored = JSON.parse(localStorage.getItem("sellOrders")) || [];
    setOrders(stored);
  }, []);

  const handleCancelOrder = (orderId, reason) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Đã hủy", cancelReason: reason } : o
    );
    setOrders(updated);
    localStorage.setItem("sellOrders", JSON.stringify(updated));
    setShowReasonInput(null);
  };

  const handleConfirmReceived = (orderId) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status: "Đã giao" } : o
    );
    setOrders(updated);
    localStorage.setItem("sellOrders", JSON.stringify(updated));
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

      {/* Tabs trạng thái */}
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

      {/* Bảng đơn */}
      {filteredOrders.length === 0 ? (
        <p>Không có đơn hàng nào.</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-success">
            <tr>
              <th>Mã đơn</th>
              <th>Sản phẩm</th>
              <th>Phương thức</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>
                  {order.products.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-1">
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{
                          width: "40px",
                          height: "50px",
                          objectFit: "cover",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <div>{item.title}</div>
                        <small>
                          SL: {item.quantity} | Giá:{" "}
                          {(item.price * item.quantity).toLocaleString()}đ
                        </small>
                      </div>
                    </div>
                  ))}
                </td>
                <td>{order.payment}</td>
                <td>{order.total.toLocaleString()}đ</td>
                <td>
                  {order.status}
                  {order.status === "Đã hủy" && order.cancelReason && (
                    <div style={{ fontSize: "small", color: "gray" }}>
                      (Lý do: {order.cancelReason})
                    </div>
                  )}
                </td>
                <td>
                  <div className="action-icons d-flex flex-wrap gap-1 justify-content-center">
                    {/* Xem chi tiết */}
                    <button
                      className="btn btn-info btn-sm"
                      title="Xem chi tiết"
                      onClick={() => navigate(`/orders-sell/${order.id}`)}
                    >
                      <HiOutlineSearch />
                    </button>

                    {/* Hủy đơn */}
                    {order.status === "Đã đặt" && (
                      <>
                        {showReasonInput === order.id ? (
                          <div style={{ width: "100%" }}>
                            <select
                              className="form-select mb-1"
                              onChange={(e) =>
                                handleCancelOrder(order.id, e.target.value)
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
                            onClick={() => setShowReasonInput(order.id)}
                          >
                            <MdCancel />
                          </button>
                        )}
                      </>
                    )}

                    {/* Xác nhận đã nhận */}
                    {order.status === "Đang giao" && (
                      <button
                        className="btn btn-primary btn-sm"
                        title="Đã nhận hàng"
                        onClick={() => handleConfirmReceived(order.id)}
                      >
                        <BsBoxSeam className="me-1" />
                        <BsCheck2 />
                      </button>
                    )}

                    {/* Mua lại */}
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
