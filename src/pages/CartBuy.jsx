import React, { useEffect, useState } from "react";
import { getCartSale, removeFromCartSale, increaseQuantity, decreaseQuantity, clearCartSale } from "../components/Service/cartService";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMyAlert } from "../components/MyAlertContext";
const CartSale = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const { showAlert } = useMyAlert();
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const data = await getCartSale();
    setCartItems(data);
    setSelectedItems(data.map((item) => item.ProductId)); // chọn tất cả mặc định
  };

  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.ProductId));
    }
  };

  const handleIncrease = async (id) => {
    try {
      // lấy item cũ trong giỏ
      const oldItem = cartItems.find((x) => x.ProductId === id);
      const oldQuantity = oldItem?.Quantity ?? 0;
  
      // gọi API tăng số lượng
      await increaseQuantity(id);
  
      // gọi lại giỏ hàng mới
      const newCart = await getCartSale();
      setCartItems(newCart);
  
      // lấy item mới sau khi gọi API
      const newItem = newCart.find((x) => x.ProductId === id);
      const newQuantity = newItem?.Quantity ?? 0;
  
      // nếu số lượng KHÔNG tăng → báo
      if (newQuantity === oldQuantity) {
        showAlert("Số lượng sách không thể tăng thêm!", );
      }
    } catch (error) {
      console.error("Lỗi khi tăng số lượng:", error);
      showAlert("Không thể tăng số lượng sản phẩm!", "error");
    }
  };
  

  const handleDecrease = async (id) => {
    await decreaseQuantity(id);
    fetchCart();
  };

  const handleRemove = async (id) => {
    await removeFromCartSale(id);
    fetchCart();
  };
const handleClear = async () => {
  const confirmed = await showAlert("Bạn có chắc muốn xóa toàn bộ giỏ hàng?", "warning");
  if (!confirmed) return;

  await clearCartSale();
  fetchCart();
};


  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.ProductId))
      .reduce((total, item) => total + item.UnitPrice * item.Quantity, 0);
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("accessToken"); 
    if (!token) {
      showAlert("Vui lòng đăng nhập để tiếp tục thanh toán!", "error");
      navigate("/login"); 
      return;
    }
    if (selectedItems.length === 0) {
      showAlert("Vui lòng chọn sản phẩm để thanh toán!","error");
      return;
    }

    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.ProductId)
    );

    localStorage.setItem("cartBuy", JSON.stringify(selectedProducts));
    localStorage.setItem("checkoutTotal", JSON.stringify(calculateSelectedTotal()));
    localStorage.removeItem("isBuyNow");
    navigate("/checkout");
  };

  return (
    <div className="container mt-4">
      <h3>🛒 Giỏ Hàng Bán</h3>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <table className="table table-bordered text-center align-middle mt-3">
            <thead className="table-light">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === cartItems.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th>Thao tác</th>
              </tr>
</thead>
<tbody>
              {cartItems.map((item) => (
                <tr key={item.ProductId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.ProductId)}
                      onChange={() => toggleSelect(item.ProductId)}
                    />
                  </td>
                  <td>
                    <img
                      src={item.ImageUrl}
                      alt={item.ProductName}
                      width={50}
                      height="auto"
                      style={{ borderRadius: "10%", objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.ProductName}</td>
                  <td>{item.UnitPrice.toLocaleString()}đ</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleDecrease(item.ProductId)}>
                        <FaMinus />
                      </button>
                      <span>{item.Quantity}</span>
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => handleIncrease(item.ProductId)}>
                        <FaPlus />
                      </button>
                    </div>
                  </td>
                  <td>{(item.UnitPrice * item.Quantity).toLocaleString()}đ</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.ProductId)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-danger" onClick={handleClear}>
              Xoá toàn bộ giỏ hàng
            </button>
            <h5>
              Tổng tiền đã chọn:{" "}
              <span style={{ color: "green" }}>
                {calculateSelectedTotal().toLocaleString()}đ
              </span>
            </h5>
            <button className="btn btn-success" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartSale;
