import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash } from "react-icons/fa";
import "../components/style/CartBuy.css";

const CartBuy = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    setCartItems(storedCart);
    setSelectedItems(storedCart.map((item) => item.id));
  }, []);

  const shippingFee = 30000;

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const updateQuantity = (id, type) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
          }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartBuy", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartBuy", JSON.stringify(updatedCart));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const calculateSelectedTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "SALE10") {
      const discountValue = calculateSelectedTotal() * 0.1;
      setDiscountAmount(discountValue);
      alert(`Áp dụng mã giảm giá thành công: Giảm ${discountValue.toLocaleString()}đ`);
    } else {
      setDiscountAmount(0);
      alert("Mã giảm giá không hợp lệ");
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }

    const selectedProducts = cartItems.filter((item) => selectedItems.includes(item.id));
    const totalAmount = calculateSelectedTotal() - discountAmount + shippingFee;

    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    localStorage.setItem("checkoutDiscount", JSON.stringify(discountAmount));
    localStorage.setItem("checkoutTotal", JSON.stringify(totalAmount));
    navigate("/checkout");
  };

  return (
    <div className="container mt-4">
      {cartItems.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          <table className="table mt-3 align-middle no-border-table text-center">
            <thead className="table-header-box">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="custom-checkbox"
                    onChange={toggleSelectAll}
                    checked={selectedItems.length === cartItems.length}
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
                <tr key={item.id} className="border-bottom-row">
                  <td>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td>
                    <img src={item.image} alt={item.title} width="60" />
                  </td>
                  <td>{item.title}</td>
                  <td>{item.price.toLocaleString()}đ</td>
                  <td>
                    <div className="d-flex align-items-center gap-2 justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, "decrease")}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, "increase")}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Xem chi tiết"
                        onClick={() => navigate(`/book/${item.id}`, { state: { book: item } })}
                      >
                        <FaSearch style={{ color: "#2e7d32" }} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Xóa"
                        onClick={() => removeItem(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-footer d-flex align-items-center gap-3 flex-wrap mt-3">
            <div className="total-shipping">
              <strong>
                Tổng thanh toán:{" "}
                {(calculateSelectedTotal() - discountAmount + shippingFee).toLocaleString()}đ
              </strong>
              <div
                className="shipping-fee mt-1"
                style={{ fontSize: "0.9rem", color: "#555" }}
              >
                Phí vận chuyển: {shippingFee.toLocaleString()}đ
              </div>
            </div>

            <div className="discount-section">
              <input
                type="text"
                className="form-control discount-input"
                placeholder="Nhập mã giảm giá"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button className="btn btn-outline-primary" onClick={applyDiscount}>
                Áp dụng
              </button>
            </div>

            <button className="btn btn-success" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartBuy;
