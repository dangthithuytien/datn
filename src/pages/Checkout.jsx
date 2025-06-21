import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import "../components/style/Checkout.css";

const provinces = [
  { id: 1, name: "Hồ Chí Minh" },
  { id: 2, name: "Hà Nội" },
  { id: 3, name: "Đà Nẵng" },
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
  const [shipping, setShipping] = useState("store_pickup");
  const [payment, setPayment] = useState("cod");
  const [totalAmount, setTotalAmount] = useState(0);
  const [momoCode, setMomoCode] = useState("");
  const [momoTimer, setMomoTimer] = useState(0);
  const [bank, setBank] = useState("vcb");

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
    if (value !== "momo") setMomoCode("");
  };

  const handlePlaceOrder = () => {
    const name = document.querySelector('input[placeholder="Họ tên"]').value;
    const phone = document.querySelector('input[placeholder="Số điện thoại"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const addressDetail = document.querySelector('input[placeholder="Địa chỉ cụ thể"]').value;

    const products = JSON.parse(localStorage.getItem("cartBuy")) || [];
    if (products.length === 0) {
      alert("Giỏ hàng trống!");
      return;
    }

    const order = {
      id: Date.now(),
      date: new Date().toLocaleString("vi-VN"),
      status: "Đã đặt",
      total: totalAmount,
      shipping,
      payment,
      customer: {
        name,
        phone,
        email,
        province: provinces.find((p) => p.id == selectedProvince)?.name || "",
        district: districtsData[selectedProvince]?.find((d) => d.id == selectedDistrict)?.name || "",
        ward: wardsData[selectedProvince]?.[selectedDistrict]?.find((w) => w.id == selectedWard)?.name || "",
        addressDetail,
      },
      products,
    };

    const storedOrders = JSON.parse(localStorage.getItem("sellOrders")) || [];
    localStorage.setItem("sellOrders", JSON.stringify([...storedOrders, order]));

    localStorage.removeItem("cartBuy");
    localStorage.removeItem("checkoutTotal");

    alert("Đặt hàng thành công!");
    window.location.href = "/"; // hoặc chuyển đến trang đơn hàng
  };

  return (
    <div className="container mt-4">
      {/* Thông tin khách hàng */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Thông tin khách hàng</h3>
        <div className="checkout-input-group">
          <input type="text" placeholder="Họ tên" className="checkout-input" />
          <input type="tel" placeholder="Số điện thoại" className="checkout-input" />
          <input type="email" placeholder="Email" className="checkout-input" />

          <select value={selectedProvince} onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict("");
            setSelectedWard("");
          }} className="checkout-input">
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select value={selectedDistrict} onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedWard("");
          }} className="checkout-input">
            <option value="">Chọn Quận/Huyện</option>
            {selectedProvince &&
              districtsData[selectedProvince]?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
          </select>

          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="checkout-input">
            <option value="">Chọn Phường/Xã</option>
            {selectedDistrict &&
              wardsData[selectedProvince]?.[selectedDistrict]?.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
          </select>

          <input type="text" placeholder="Địa chỉ cụ thể" className="checkout-input" style={{ flex: "1 1 100%" }} />
        </div>
      </div>

      {/* Phương thức vận chuyển */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức vận chuyển</h3>
        <label><input type="radio" name="shipping" value="store_pickup" checked={shipping === "store_pickup"} onChange={() => setShipping("store_pickup")} /> Đến cửa hàng lấy</label>
        <label><input type="radio" name="shipping" value="home_delivery" checked={shipping === "home_delivery"} onChange={() => setShipping("home_delivery")} /> Giao tận nơi</label>
      </div>

      {/* Phương thức thanh toán */}
      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức thanh toán</h3>
        <label><input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => handlePaymentChange("cod")} /> COD</label>
        <label><input type="radio" name="payment" value="momo" checked={payment === "momo"} onChange={() => handlePaymentChange("momo")} /> MoMo</label>
        <label><input type="radio" name="payment" value="bank" checked={payment === "bank"} onChange={() => handlePaymentChange("bank")} /> Internet Banking</label>

        {payment === "momo" && (
          <div className="qr-code-container">
            {!momoCode ? (
              <button onClick={generateMomoCode}>Gửi mã MoMo (60 giây)</button>
            ) : (
              <>
                <p>Vui lòng thanh toán mã sau trong 60 giây:</p>
                <QRCode value={getMomoQRData()} size={128} />
                <h4>{momoCode}</h4>
                <p>Thời gian còn lại: {momoTimer} giây</p>
                <button onClick={generateMomoCode}>Gửi lại mã</button>
              </>
            )}
          </div>
        )}

        {payment === "bank" && (
          <div>
            <label>Ngân hàng:
              <select value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="vcb">Vietcombank</option>
                <option value="tpbank">TPBank</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Tổng hóa đơn + Mã giảm giá */}
      <div className="checkout-section checkout-footer">
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input type="text" placeholder="Nhập mã giảm giá" value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} className="discount-input" />
          <button className="btn btn-success">Áp dụng</button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <strong>Tổng hóa đơn: <span style={{ color: "#28a745" }}>{totalAmount.toLocaleString()}đ</span></strong>
          <button className="btn btn-success ms-3" onClick={handlePlaceOrder}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
