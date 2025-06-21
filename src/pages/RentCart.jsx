import React, { useState, useEffect } from "react";

// Hàm tính số ngày giữa 2 ngày
const calculateDays = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)));
};

const RentCart = () => {
  const [rentCart, setRentCart] = useState(() => {
    const saved = localStorage.getItem("rentCart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("rentCart", JSON.stringify(rentCart));
  }, [rentCart]);

  const handleRemove = (id) => {
    const updatedCart = rentCart.filter((item) => item.id !== id);
    setRentCart(updatedCart);
  };

  const total = rentCart.reduce((acc, item) => {
    const days = calculateDays(item.rentDate, item.returnDate);
    const cost = days * item.rentPrice * item.quantity + item.deposit;
    return acc + cost;
  }, 0);

  return (
    <div className="container mt-4">
      <h2>📚 Giỏ hàng thuê sách</h2>

      {rentCart.length === 0 ? (
        <p>🚫 Chưa có sách nào trong giỏ thuê.</p>
      ) : (
        <div>
          {rentCart.map((item) => {
            const days = calculateDays(item.rentDate, item.returnDate);
            const subtotal =
              days * item.rentPrice * item.quantity + item.deposit;

            return (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px 0",
                  padding: 10,
                  borderRadius: 8,
                  display: "flex",
                  gap: 16,
                }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: 100, height: 140, objectFit: "cover" }}
                />
                <div>
                  <p>
                    <strong>{item.title}</strong> - {item.author}
                  </p>
                  <p>📅 Ngày thuê: {item.rentDate}</p>
                  <p>📅 Ngày trả: {item.returnDate}</p>
                  <p>🔢 Số lượng: {item.quantity}</p>
                  <p>💰 Giá thuê/ngày: {item.rentPrice.toLocaleString()}₫</p>
                  <p>💵 Tiền cọc: {item.deposit.toLocaleString()}₫</p>
                  <p>
                    🧮 Tạm tính ({days} ngày):{" "}
                    <strong>{subtotal.toLocaleString()}₫</strong>
                  </p>
                  <button onClick={() => handleRemove(item.id)}>❌ Xoá</button>
                </div>
              </div>
            );
          })}

          <h4 className="mt-4">💰 Tổng tiền: {total.toLocaleString()}₫</h4>
        </div>
      )}
    </div>
  );
};

export default RentCart;
