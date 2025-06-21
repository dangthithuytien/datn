import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  setSelectedItems(storedCart.map((_, i) => i));
}, []);

  const calculateSelectedTotal = () => {
    return selectedItems.reduce((total, idx) => {
      const item = cartItems[idx];
      if (item) return total + item.price * item.quantity;
      return total;
    }, 0);
  };

  const shippingFee = 30000;

  const toggleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((_, i) => i));
    } else {
      setSelectedItems([]);
    }
  };

  const toggleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((i) => i !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const updateQuantity = (index, type) => {
    const updatedCart = [...cartItems];
    if (type === "increase") {
      updatedCart[index].quantity += 1;
    } else if (type === "decrease" && updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    }
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSelectedItems(selectedItems.filter((i) => i !== index));
  };

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === "SALE10") {
      const discountValue = calculateSelectedTotal() * 0.1;
      setDiscountAmount(discountValue);
      alert(
        `Áp dụng mã giảm giá thành công: Giảm ${discountValue.toLocaleString()}đ`
      );
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

  const selectedProducts = selectedItems.map((i) => cartItems[i]);
  const totalAmount = calculateSelectedTotal() - discountAmount + shippingFee;

  localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
  localStorage.setItem("checkoutDiscount", JSON.stringify(discountAmount));
  localStorage.setItem("checkoutTotal", JSON.stringify(totalAmount)); // Save total amount
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
                  <div className="d-flex align-items-center gap-2 justify-content-center">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      onChange={toggleSelectAll}
                      checked={selectedItems.length === cartItems.length}
                    />
                  </div>
                </th>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index} className="border-bottom-row">
                  <td>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      checked={selectedItems.includes(index)}
                      onChange={() => toggleSelectItem(index)}
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
                        onClick={() => updateQuantity(index, "decrease")}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(index, "increase")}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toLocaleString()}đ</td>
                  <td className="action-buttons">
                   <button
  className="btn btn-info btn-sm me-1"
  onClick={() => navigate(`/book/${item.id}`, { state: { book: item } })}
>
  Xem chi tiết
</button>


                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeItem(index)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-footer d-flex align-items-center gap-3 flex-wrap mt-3">
            <div className="total-shipping">
              <strong>
                Tổng thanh toán:{" "}
                {(
                  calculateSelectedTotal() -
                  discountAmount +
                  shippingFee
                ).toLocaleString()}
                đ
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
              <button
                className="btn btn-outline-primary"
                onClick={applyDiscount}
              >
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
