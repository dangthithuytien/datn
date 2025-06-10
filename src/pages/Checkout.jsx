import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code"; // Import thư viện QR Code
import "../components/style/Checkout.css";

// Sample data for provinces, districts, and wards
const provinces = [
  { id: 1, name: "Hồ Chí Minh" },
  { id: 2, name: "Hà Nội" },
  { id: 3, name: "Đà Nẵng" },
  // Add more provinces as needed
];

const districtsData = {
  1: [
    { id: 1, name: "Quận 1" },
    { id: 2, name: "Quận 2" },
  ],
  2: [
    { id: 3, name: "Quận Hoàn Kiếm" },
    { id: 4, name: "Quận Đống Đa" },
  ],
};

const wardsData = {
  1: {
    1: [{ id: 1, name: "Phường Bến Nghé" }],
    2: [{ id: 2, name: "Phường Thủ Thiêm" }],
  },
};

const Checkout = () => {
  const [discountCode, setDiscountCode] = useState("");
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("cod");
  const [totalAmount, setTotalAmount] = useState(0);
  const [momoCode, setMomoCode] = useState("");
  const [momoTimer, setMomoTimer] = useState(0);
  const [bank, setBank] = useState("vcb");

  // Address state
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const storedTotal = JSON.parse(localStorage.getItem("checkoutTotal")) || 0;
    setTotalAmount(storedTotal);
  }, []);

  useEffect(() => {
    let timer;
    if (payment === "momo" && momoCode) {
      setMomoTimer(60);
      timer = setInterval(() => {
        setMomoTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setMomoCode("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [payment, momoCode]);

  const generateMomoCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMomoCode(code);
  };

  const getMomoQRData = () => {
    return momoCode ? `https://momo.vn/pay/${momoCode}` : "";
  };

  const handlePaymentChange = (value) => {
    setPayment(value);
    if (value !== "momo") {
      setMomoCode("");
    }
  };

  const handlePlaceOrder = () => {
    // Logic to handle order placement
    alert("Đơn hàng của bạn đã được đặt!");
  };

  return (
    <div className="container mt-4">
      {/* 1. Thông tin khách hàng */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Thông tin khách hàng</h3>
        <div className="checkout-input-group">
          <div className="checkout-input">
            <input type="text" placeholder="Họ tên" />
          </div>
          <div className="checkout-input">
            <input type="tel" placeholder="Số điện thoại" />
          </div>
          <div className="checkout-input">
            <input type="email" placeholder="Email" />
          </div>

          {/* Tỉnh/Thành phố */}
          <div className="checkout-input">
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value);
                setSelectedDistrict(""); // Reset district
                setSelectedWard(""); // Reset ward
              }}
            >
              <option value="">Chọn Tỉnh/Thành phố</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quận/Huyện */}
          <div className="checkout-input">
            <select
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedWard(""); // Reset ward
              }}
            >
              <option value="">Chọn Quận/Huyện</option>
              {selectedProvince &&
                districtsData[selectedProvince].map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Phường/Xã */}
          <div className="checkout-input">
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="">Chọn Phường/Xã</option>
              {selectedDistrict &&
                wardsData[selectedProvince][selectedDistrict]?.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="checkout-input" style={{ flex: "1 1 100%" }}>
            <input type="text" placeholder="Địa chỉ cụ thể" />
          </div>
        </div>
      </div>

      {/* 2. Phương thức vận chuyển */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức vận chuyển</h3>
        <div className="shipping-methods">
          <label className="shipping-option">
            <input
              type="radio"
              name="shipping"
              value="store_pickup"
              checked={shipping === "store_pickup"}
              onChange={() => setShipping("store_pickup")}
            />
            Đến cửa hàng lấy
          </label>
          <label className="shipping-option">
            <input
              type="radio"
              name="shipping"
              value="home_delivery"
              checked={shipping === "home_delivery"}
              onChange={() => setShipping("home_delivery")}
            />
            Giao tận nơi
          </label>
        </div>
      </div>

      {/* Phương thức thanh toán */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức thanh toán</h3>
        <div className="payment-methods">
          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={payment === "cod"}
              onChange={() => handlePaymentChange("cod")}
            />
            Thanh toán tiền mặt khi nhận hàng (COD)
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="momo"
              checked={payment === "momo"}
              onChange={() => handlePaymentChange("momo")}
            />
            Ví MoMo
          </label>

          <label className="payment-option">
            <input
              type="radio"
              name="payment"
              value="bank"
              checked={payment === "bank"}
              onChange={() => handlePaymentChange("bank")}
            />
            Internet Banking
          </label>
        </div>

        {/* Hiển thị mã QR trước khi có mã hoặc khi đã tạo mã */}
     {payment === "momo" && (
  <div className="qr-code-container">
    {!momoCode ? (
      <button onClick={generateMomoCode}>Gửi mã MoMo (60 giây)</button>
    ) : (
      <>
        <p>Vui lòng thanh toán mã sau trong 60 giây:</p>
        <QRCode value={getMomoQRData()} size={128} /> {/* Ensure this renders as an image */}
        <h4>{momoCode}</h4>
        <p>Thời gian còn lại: {momoTimer} giây</p>
        <button onClick={generateMomoCode}>Gửi lại mã</button>
      </>
    )}
  </div>
)}
        {/* Hiển thị chọn ngân hàng nếu thanh toán qua ngân hàng */}
        {payment === "bank" && (
          <div className="bank-selection">
            <label>
              Ngân hàng:
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="vcb">Vietcombank (VCB)</option>
                <option value="tpbank">TPBank</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* 4. Mã giảm giá + Tổng hóa đơn */}
<div className="checkout-section checkout-footer" style={{ marginTop: "20px" }}>
  <div className="discount-section" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
    <input
      type="text"
      className="discount-input"
      placeholder="Nhập mã giảm giá"
      value={discountCode}
      onChange={(e) => setDiscountCode(e.target.value)}
    />
    <button className="btn btn-success">Áp dụng</button>
  </div>

  <div className="total-bill" style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
    <span style={{ fontWeight: "bold", marginRight: "10px" }}>
      Tổng hóa đơn: <span style={{ color: "#28a745" }}>{totalAmount.toLocaleString()}đ</span>
    </span>
    <button className="btn btn-success" onClick={handlePlaceOrder}>
      Đặt hàng
    </button>
  </div>
</div>
    </div>
  );
};

export default Checkout;
