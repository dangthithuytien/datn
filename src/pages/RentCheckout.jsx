import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import "../components/style/rentcheckout.css";

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

const RentCheckout = () => {
  const navigate = useNavigate();

  // Thông tin khách hàng
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  // Ngày thuê và trả
  const [rentStartDate, setRentStartDate] = useState("");
  const [rentEndDate, setRentEndDate] = useState("");

  // Phương thức vận chuyển & thanh toán
  const [shipping, setShipping] = useState("home_delivery");
  const [payment, setPayment] = useState("cod");

  // QR Code & Timer cho MoMo
  const [momoCode, setMomoCode] = useState("");
  const [momoTimer, setMomoTimer] = useState(0);

  // Dữ liệu giỏ thuê
  const [rentItems, setRentItems] = useState([]);

  const shippingFee = 30000;

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = endDate - startDate;
    if (diffTime < 0) return 0;
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateTotalAmount = () => {
    if (rentItems.length === 0) return 0;
    if (!rentStartDate || !rentEndDate) return 0;

    const days = calculateDays(rentStartDate, rentEndDate);
    if (days === 0) return 0;

    const baseDays = 60;
    const basePrice = 60000;
    const extraDayPrice = 1000;

    let total = 0;
    rentItems.forEach((item) => {
      let priceForItem = 0;
      if (days <= baseDays) {
        priceForItem = basePrice * item.quantity;
      } else {
        const extraDays = days - baseDays;
        priceForItem = (basePrice + extraDays * extraDayPrice) * item.quantity;
      }
      total += priceForItem + item.deposit;
    });

    if (shipping === "home_delivery") total += shippingFee;

    return total;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("rentCart")) || [];
    setRentItems(data);
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

  const handlePlaceOrder = () => {
    if (!name || !phone || !email) {
      alert("Vui lòng nhập đầy đủ thông tin khách hàng.");
      return;
    }
    if (!rentStartDate || !rentEndDate) {
      alert("Vui lòng chọn ngày thuê và ngày trả.");
      return;
    }
    if (calculateDays(rentStartDate, rentEndDate) === 0) {
      alert("Ngày trả phải sau ngày thuê.");
      return;
    }
    if (rentItems.length === 0) {
      alert("Giỏ thuê sách đang trống.");
      return;
    }

    const rentOrder = {
      id: Date.now(),
      date: new Date().toLocaleString("vi-VN"),
      status: "Đã đặt",
      total: calculateTotalAmount(),
      shipping,
      payment,
      rentStartDate,
      rentEndDate,
      customer: {
        name,
        phone,
        email,
        province: provinces.find((p) => p.id == province)?.name || "",
        district:
          districtsData[province]?.find((d) => d.id == district)?.name || "",
        ward: wardsData[province]?.[district]?.find((w) => w.id == ward)?.name || "",
        addressDetail,
      },
      products: rentItems,
    };

    const stored = JSON.parse(localStorage.getItem("rentOrders")) || [];
    localStorage.setItem("rentOrders", JSON.stringify([...stored, rentOrder]));
    localStorage.removeItem("rentCart");

    alert("Đơn hàng thuê đã được đặt!");
    navigate("/orders-rent");
  };

  return (
    <div className="container mt-4">
      <h3>📘 Thanh toán đơn thuê sách</h3>

      <div className="checkout-section">
        <h3 className="checkout-section-title">Thông tin khách hàng</h3>
        <div className="checkout-input-group">
          <input
            type="text"
            placeholder="Họ tên"
            className="checkout-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="checkout-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="checkout-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setDistrict("");
              setWard("");
            }}
            className="checkout-input"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setWard("");
            }}
            disabled={!province}
            className="checkout-input"
          >
            <option value="">Chọn Quận/Huyện</option>
            {province &&
              districtsData[province]?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
          </select>

          <select
            value={ward}
            onChange={(e) => setWard(e.target.value)}
            disabled={!district}
            className="checkout-input"
          >
            <option value="">Chọn Phường/Xã</option>
            {district &&
              wardsData[province]?.[district]?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
          </select>

          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            className="checkout-input"
            style={{ flex: "1 1 100%" }}
            value={addressDetail}
            onChange={(e) => setAddressDetail(e.target.value)}
          />
        </div>
      </div>

      {/* Chọn ngày thuê và trả */}
      <div className="checkout-section">
        <label>Ngày thuê:</label>
        <input
          type="date"
          className="form-control mb-2"
          value={rentStartDate}
          onChange={(e) => setRentStartDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
        />
        <label>Ngày trả:</label>
        <input
          type="date"
          className="form-control mb-2"
          value={rentEndDate}
          onChange={(e) => setRentEndDate(e.target.value)}
          min={rentStartDate || new Date().toISOString().split("T")[0]}
        />
      </div>

      {/* Phương thức vận chuyển */}
      <div className="checkout-section">
        <h4>Phương thức vận chuyển</h4>
        <label>
          <input
            type="radio"
            value="store_pickup"
            checked={shipping === "store_pickup"}
            onChange={() => setShipping("store_pickup")}
          />{" "}
          Nhận tại cửa hàng
        </label>
        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            value="home_delivery"
            checked={shipping === "home_delivery"}
            onChange={() => setShipping("home_delivery")}
          />{" "}
          Giao tận nơi (+{shippingFee.toLocaleString()}đ)
        </label>
      </div>

      {/* Phương thức thanh toán */}
      <div className="checkout-section">
        <h4>Phương thức thanh toán</h4>
        <label>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />{" "}
          COD
        </label>
        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            name="payment"
            value="momo"
            checked={payment === "momo"}
            onChange={() => setPayment("momo")}
          />{" "}
          Ví MoMo
        </label>
        <label style={{ marginLeft: "15px" }}>
          <input
            type="radio"
            name="payment"
            value="bank"
checked={payment === "bank"}
onChange={() => setPayment("bank")}
/>{" "}
Chuyển khoản ngân hàng
</label>

php-template
Copy
Edit
    {payment === "momo" && (
      <div className="qr-code-container mt-3">
        {!momoCode ? (
          <button className="btn btn-outline-primary" onClick={generateMomoCode}>
            Gửi mã MoMo (60 giây)
          </button>
        ) : (
          <>
            <p>Vui lòng quét mã QR để thanh toán:</p>
            <QRCode value={`https://momo.vn/pay/${momoCode}`} size={128} />
            <p className="mt-2">Mã: {momoCode}</p>
            <p>Thời gian còn lại: {momoTimer}s</p>
          </>
        )}
      </div>
    )}
  </div>

  {/* Tổng thanh toán */}
  <div className="checkout-footer d-flex align-items-center gap-3 flex-wrap mt-4">
    <div className="total-shipping">
      <strong>
        Tổng thanh toán:{" "}
        <span style={{ color: "#28a745" }}>
          {calculateTotalAmount().toLocaleString()}đ
        </span>
      </strong>
      {shipping === "home_delivery" && (
        <div style={{ fontSize: "0.9rem", color: "#777" }}>
          Phí vận chuyển: {shippingFee.toLocaleString()}đ
        </div>
      )}
    </div>
    <button className="btn btn-success" onClick={handlePlaceOrder}>
      Thanh toán
    </button>
  </div>
</div>
);
};

export default RentCheckout;
