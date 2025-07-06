import React, { useState, useEffect } from "react";

const CheckoutRent = () => {
  const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [shipping, setShipping] = useState("store_pickup");
  const [payment, setPayment] = useState("cod");
  const [startDate, setStartDate] = useState(""); // auto today
  const [endDate, setEndDate] = useState("");

  const [rentCart, setRentCart] = useState([]);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);

    const cart = JSON.parse(localStorage.getItem("rentCartBuy")) || [];
   
    setRentCart(cart);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo({
        name: storedUser.UserName || "",
        phone: storedUser.PhonNumber || "",
        email: storedUser.Email || "",
      });
    }

    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) setProvinces(data.data);
      });
  }, []);

  useEffect(() => {
    setShippingFee(shipping === "home_delivery" ? 30000 : 0);
  }, [shipping]);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error === 0) setDistricts(data.data);
        });
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]);
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error === 0) setWards(data.data);
        });
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedDistrict]);

  const calculateRentalFee = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24))); // ít nhất 1 ngày

    if (diffDays <= 60) return 30000;
    return 30000 + (diffDays - 60) * 1000;
  };

  const totalBookFee = rentCart.reduce((sum, item) => sum + item.BookPrice, 0);
  const rentalPeriodFee = calculateRentalFee();
  const totalAmount = totalBookFee + shippingFee + rentalPeriodFee;

  const createCashOrder = async (order) => {
    const token = localStorage.getItem("accessToken");
const res = await fetch("https://localhost:7003/api/CashOrder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      const errorDetail = await res.text(); // response chứ không phải response.text()
  throw new Error("Lỗi khi tạo đơn hàng: " + errorDetail);
    }

    return res.json();
  };
  const handleCheckout = async () => {
    if (!userInfo.phone || !selectedProvince || !selectedDistrict || !selectedWard || !startDate || !endDate) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const addressDetail = document.querySelector('input[placeholder="Địa chỉ cụ thể"]').value;
    if (!addressDetail) {
      alert("⚠️ Vui lòng nhập địa chỉ cụ thể!");
      return;
    }

    const provinceName = provinces.find((p) => p.id.toString() === selectedProvince)?.full_name || "";
    const districtName = districts.find((d) => d.id.toString() === selectedDistrict)?.full_name || "";
    const wardName = wards.find((w) => w.id.toString() === selectedWard)?.full_name || "";
    const fullAddress = `${addressDetail}, ${wardName}, ${districtName}, ${provinceName}`;

    const order = {
      UserId: "string",
      StartDate: startDate,
      EndDate: endDate,
      HasShippingFee: shipping === "home_delivery",
      Address: fullAddress,
      Phone: userInfo.phone,
      PaymentMethod: "string",
      CartItems: rentCart,
    };

    try {
     await createCashOrder(order)
     console.log("yyyyyy",order)
      alert("✅ Đặt thuê sách thành công!");
      localStorage.removeItem("rentCartBuy");
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>📘 Thanh toán đơn thuê sách</h3>

      <div className="checkout-section">
        <h5>Thông tin khách hàng</h5>
        <input type="text" className="checkout-input" value={userInfo.name} readOnly />
        <input type="tel" className="checkout-input" value={userInfo.phone} readOnly />
        <input type="email" className="checkout-input" value={userInfo.email} readOnly />

        <select className="checkout-input" value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
          <option value="">Thành phố</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name}</option>
          ))}
        </select>

        <select className="checkout-input" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedProvince}>
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.full_name}</option>
          ))}
        </select>
<select className="checkout-input" value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict}>
          <option value="">Chọn Phường/Xã</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>{w.full_name}</option>
          ))}
        </select>

        <input type="text" placeholder="Địa chỉ cụ thể" className="checkout-input" />
      </div>

      <div className="checkout-section">
        <h5>Ngày thuê:</h5>
        <input type="date" className="checkout-input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <h5>Ngày trả:</h5>
        <input type="date" className="checkout-input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <div className="checkout-section">
        <h5>Phương thức vận chuyển</h5>
        <label>
          <input type="radio" name="shipping" value="store_pickup" checked={shipping === "store_pickup"} onChange={() => setShipping("store_pickup")} />
          Nhận tại cửa hàng
        </label>
        <label>
          <input type="radio" name="shipping" value="home_delivery" checked={shipping === "home_delivery"} onChange={() => setShipping("home_delivery")} />
          Giao tận nơi (+30.000đ)
        </label>
      </div>

      <div className="checkout-section">
        <h5>Phương thức thanh toán</h5>
        <label><input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} /> COD</label>
        <label><input type="radio" name="payment" value="momo" checked={payment === "momo"} onChange={() => setPayment("momo")} /> Ví MoMo</label>
        <label><input type="radio" name="payment" value="bank" checked={payment === "bank"} onChange={() => setPayment("bank")} /> Chuyển khoản ngân hàng</label>
      </div>

      <div className="checkout-section checkout-footer">
        <p>Tiền sách: {totalBookFee.toLocaleString()}đ</p>
        {shippingFee > 0 && <p>Phí vận chuyển: {shippingFee.toLocaleString()}đ</p>}
        {startDate && endDate && <p>Phí thuê ({startDate} → {endDate}): {rentalPeriodFee.toLocaleString()}đ</p>}
        <h5>Tổng thanh toán: <span style={{ color: "#28a745" }}>{totalAmount.toLocaleString()}đ</span></h5>
        <button className="btn btn-success mt-2" onClick={handleCheckout}>Đặt thuê</button>
      </div>
    </div>
  );
};

export default CheckoutRent;