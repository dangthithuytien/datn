import React, { useEffect, useState } from "react";
import { getCartSale, removeFromCartSale, increaseQuantity, decreaseQuantity, clearCartSale } from "../components/Service/cartService";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartSale = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

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
    await increaseQuantity(id);
    fetchCart();
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
    if (window.confirm("Xóa toàn bộ giỏ hàng?")) {
      await clearCartSale();
      fetchCart();
    }
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.ProductId))
      .reduce((total, item) => total + item.UnitPrice * item.Quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.ProductId)
    );

    localStorage.setItem("cartBuy", JSON.stringify(selectedProducts));
    localStorage.setItem("checkoutTotal", JSON.stringify(calculateSelectedTotal()));
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
                      src={item.ImageUrl ? `https://localhost:7003${item.ImageUrl}` : "/default-avatar.png"}
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
