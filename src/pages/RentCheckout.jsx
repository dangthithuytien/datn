import React, { useState, useEffect } from "react";
import "../components/style/rentcheckout.css";
import apiClient from "../components/Service/AxiosConfig";
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
  const [startDate, setStartDate] = useState("");
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
    const hcmProvince = {
      id: 79,
      full_name: "Thành phố Hồ Chí Minh"
    };
    setProvinces([hcmProvince]);
    setSelectedProvince("79"); // id TP.HCM
  }, []);
  useEffect(() => {
    setShippingFee(shipping === "home_delivery" ? 20000 : 0);
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
    const diffDays = Math.max(
      1,
      Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    );
    return diffDays <= 60 ? 10000 : 10000 + (diffDays - 60) * 1000;
  };

  const totalBookFee = rentCart.reduce((sum, item) => sum + Number(item.BookPrice  || 0), 0);

  const rentalPeriodFee = calculateRentalFee();
  const totalAmount = totalBookFee + shippingFee + rentalPeriodFee;

  
const createCashOrder = async (order) => {
  try {
    const res = await apiClient.post("/CashOrder/create", order); // Không cần stringify
    console.log("Order to submit:", order);

    return res.data; // Axios tự động parse JSON
  } catch (error) {
    const errorDetail = error.response?.data?.message || error.message || "Không xác định";

    throw new Error("Lỗi khi tạo đơn hàng: " + errorDetail);
  }
};

  const handleCheckout = async () => {
    if (
      !userInfo.phone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !startDate ||
      !endDate
    ) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const addressDetail = document.querySelector(
      'input[placeholder="Địa chỉ cụ thể"]'
    ).value;
    if (!addressDetail) {
      alert("⚠️ Vui lòng nhập địa chỉ cụ thể!");
      return;
    }
    const provinceName =
      provinces.find((p) => p.id.toString() === selectedProvince)?.full_name ||
      "";
    const districtName =
      districts.find((d) => d.id.toString() === selectedDistrict)?.full_name ||
      "";
    const wardName =
      wards.find((w) => w.id.toString() === selectedWard)?.full_name || "";
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
      await createCashOrder(order);
      console.log("Order to submit:", order);
      alert("✅ Đặt thuê sách thành công!");
      localStorage.removeItem("rentCartBuy");
      window.location.href = "/";
    } catch (err) {
      console.log("Order to submitsssss:", order);
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4">
  <div className="checkout-section">
  <h5 className="checkout-section-title">Thông tin khách hàng</h5>
  <div className="checkout-input-group">
    <input
      type="text"
      value={userInfo.name}
      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
      className="checkout-input"
      placeholder="Họ tên"
    />
    <input
      type="tel"
      value={userInfo.phone}
      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
      className="checkout-input"
      placeholder="Số điện thoại"
    />
    <input
      type="email"
      value={userInfo.email}
      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
      className="checkout-input"
      placeholder="Email"
    />
    <select
      value={selectedProvince}
      disabled
      onChange={(e) => setSelectedProvince(e.target.value)}
      className="checkout-input"
    >
      <option value="">Chọn Tỉnh/Thành phố</option>
      {provinces.map((p) => (
        <option key={p.id} value={p.id}>{p.full_name}</option>
      ))}
    </select>
    <select
      value={selectedDistrict}
      onChange={(e) => setSelectedDistrict(e.target.value)}
      className="checkout-input"
      disabled={!selectedProvince}
    >
      <option value="">Chọn Quận/Huyện</option>
      {districts.map((d) => (
        <option key={d.id} value={d.id}>{d.full_name}</option>
      ))}
    </select>
    <select
      value={selectedWard}
      onChange={(e) => setSelectedWard(e.target.value)}
      className="checkout-input"
      disabled={!selectedDistrict}
    >
      <option value="">Chọn Phường/Xã</option>
      {wards.map((w) => (
        <option key={w.id} value={w.id}>{w.full_name}</option>
      ))}
    </select>
    <input
      type="text"
      placeholder="Địa chỉ cụ thể"
      className="checkout-input"
      style={{ flex: "1 1 100%" }}
      id="addressDetail"
    />
  </div>
</div>

      <div className="checkout-section">
        <h5>Ngày thuê:</h5>
        <input
          type="date"
          className="checkout-input"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <h5>Ngày trả:</h5>
        <input
          type="date"
          className="checkout-input"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="checkout-section">
        <h5>Phương thức vận chuyển</h5>
        <label>
          <input
            type="radio"
            name="shipping"
            value="store_pickup"
            checked={shipping === "store_pickup"}
            onChange={() => setShipping("store_pickup")}
          />
          Nhận tại cửa hàng
        </label>
        <label>
          <input
            type="radio"
            name="shipping"
            value="home_delivery"
            checked={shipping === "home_delivery"}
            onChange={() => setShipping("home_delivery")}
          />
          Giao tận nơi (+20.000đ)
        </label>
      </div>

      <div className="checkout-section">
        <h5>Phương thức thanh toán</h5>
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
        <label>
          <input
            type="radio"
            name="payment"
            value="momo"
            checked={payment === "momo"}
            onChange={() => setPayment("momo")}
          />{" "}
          Ví MoMo
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="bank"
            checked={payment === "bank"}
            onChange={() => setPayment("bank")}
          />{" "}
          Chuyển khoản ngân hàng
        </label>
      </div>

     <div className="checkout-section checkout-footer">
  <div className="checkout-total">
    <strong>Tổng thanh toán: </strong>
    <span>{totalAmount.toLocaleString()}đ</span>
  </div>
  <button className="btn btn-success" onClick={handleCheckout}>
    Đặt thuê
  </button>
</div>

    </div>
  );
};

export default CheckoutRent;
