import React, { useState, useEffect } from "react";
import "../components/style/Checkout.css";
import { getCartSale } from "../components/Service/cartService";

const Checkout = () => {
  const [discountValue, setDiscountValue] = useState(0);
  const [shipping, setShipping] = useState("store_pickup");
  const [payment, setPayment] = useState("cod");
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const rawTotal = totalAmount + shippingFee;
  const discountAmount = (rawTotal * discountValue) / 100;
  const finalAmount = rawTotal - discountAmount;

  useEffect(() => {
    const storedTotal = JSON.parse(localStorage.getItem("checkoutTotal")) || 0;
    setTotalAmount(storedTotal);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserInfo({
        name: storedUser.UserName || "",
        phone: storedUser.PhonNumber || "",
        email: storedUser.Email || ""
      });
    }
  }, []);

  useEffect(() => {
    setShippingFee(shipping === "home_delivery" ? 20000 : 0);
  }, [shipping]);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then(res => res.json())
      .then(data => {
        if (data.error === 0) setProvinces(data.data);
      });

    const fetchVouchers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch("https://localhost:7003/api/Voucher/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        const unused = data.filter(v => !v.IsUsed);
        setAvailableVouchers(unused);
      } catch (err) {
        console.error("Lỗi khi lấy voucher:", err);
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then(res => res.json())
        .then(data => {
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
        .then(res => res.json())
.then(data => {
          if (data.error === 0) setWards(data.data);
        });
    } else {
      setWards([]);
    }
    setSelectedWard("");
  }, [selectedDistrict]);

  const addToCartSession = async (product) => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("https://localhost:7003/api/CartSale/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ProductId: product.ProductId,
        Quantity: product.Quantity,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("❌ Lỗi khi thêm sản phẩm vào session: " + errorText);
    }
  };

  const createCashOrder = async (orderData) => {
    const token = localStorage.getItem("accessToken");

    const response = await fetch("https://localhost:7003/api/SaleOrders/create-cash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      throw new Error("Lỗi khi tạo đơn hàng: " + errorDetail);
    }

    return response.json();
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePlaceOrder = async () => {
    const addressDetail = document.querySelector('input[placeholder="Địa chỉ cụ thể"]').value;
    const products = JSON.parse(localStorage.getItem("cartBuy")) || [];

    if (products.length === 0) {
      alert("🛒 Giỏ hàng trống!");
      return;
    }

    if (!userInfo.phone || !selectedProvince || !selectedDistrict || !selectedWard || !addressDetail) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin người nhận.");
      return;
    }

    const provinceName = provinces.find((p) => p.id.toString() === selectedProvince)?.full_name || "";
    const districtName = districts.find((d) => d.id.toString() === selectedDistrict)?.full_name || "";
    const wardName = wards.find((w) => w.id.toString() === selectedWard)?.full_name || "";
    const fullAddress = `${addressDetail}, ${wardName}, ${districtName}, ${provinceName}`;

    const orderData = {
      UserId: "string",
      Address: fullAddress,
      Phone: userInfo.phone,
      HasShippingFee: shipping === "home_delivery",
      VoucherCode: selectedVoucher?.Code || "",
      SelectedProductIds: products.map(p => p.ProductId),
    };

    try {
      for (const product of products) {
        await addToCartSession(product);
      }

      await delay(300);

      const sessionCart = await getCartSale();
      if (!sessionCart || sessionCart.length === 0) {
        alert("❌ Đặt hàng thất bại: Giỏ hàng session rỗng.");
        return;
      }

      await createCashOrder(orderData);
alert("✅ Đặt hàng thành công!");
      localStorage.removeItem("cartBuy");
      localStorage.removeItem("checkoutTotal");
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("❌ Đặt hàng thất bại: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="checkout-section">
        <h3 className="checkout-section-title">Thông tin khách hàng</h3>
        <div className="checkout-input-group">
          <input type="text" value={userInfo.name} className="checkout-input" readOnly />
          <input type="tel" value={userInfo.phone} className="checkout-input" readOnly />
          <input type="email" value={userInfo.email} className="checkout-input" readOnly />
          <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)} className="checkout-input">
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id.toString()}>{p.full_name}</option>
            ))}
          </select>
          <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="checkout-input" disabled={!selectedProvince}>
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id.toString()}>{d.full_name}</option>
            ))}
          </select>
          <select value={selectedWard} onChange={(e) => setSelectedWard(e.target.value)} className="checkout-input" disabled={!selectedDistrict}>
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w) => (
              <option key={w.id} value={w.id.toString()}>{w.full_name}</option>
            ))}
          </select>
          <input type="text" placeholder="Địa chỉ cụ thể" className="checkout-input" style={{ flex: "1 1 100%" }} />
        </div>
      </div>

      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức vận chuyển</h3>
        <label>
          <input type="radio" name="shipping" value="store_pickup" checked={shipping === "store_pickup"} onChange={() => setShipping("store_pickup")} />
          Đến cửa hàng lấy
        </label>
        <label>
          <input type="radio" name="shipping" value="home_delivery" checked={shipping === "home_delivery"} onChange={() => setShipping("home_delivery")} />
          Giao tận nơi
        </label>
      </div>

      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức thanh toán</h3>
        <label>
          <input type="radio" name="payment" value="cod" checked={payment === "cod"} onChange={() => setPayment("cod")} />
          COD
        </label>
        <label>
          <input type="radio" name="payment" value="momo" disabled />
          MoMo
        </label>
        <label>
<input type="radio" name="payment" value="bank" disabled />
          Internet Banking
        </label>
      </div>

      <div className="checkout-section checkout-footer">
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <select
            className="discount-input"
            value={selectedVoucher?.Code || ""}
            onChange={(e) => {
              const selected = availableVouchers.find(v => v.Code === e.target.value);
              setSelectedVoucher(selected || null);
              setDiscountValue(selected ? selected.DiscountValue : 0);
            }}
          >
            <option value="">-- Chọn mã giảm giá --</option>
            {availableVouchers.map(voucher => (
              <option key={voucher.Code} value={voucher.Code}>
                {voucher.DiscountCodeName} - Giảm {voucher.DiscountValue}%
              </option>
            ))}
          </select>
        </div>

        {selectedVoucher && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Đã áp dụng mã: <strong>{selectedVoucher.Code}</strong> - Giảm {discountValue}%
          </p>
        )}

        <div style={{ marginTop: "10px" }}>
          <strong>
            Tổng hóa đơn: <span style={{ color: "#28a745" }}>{finalAmount.toLocaleString()}đ</span>
            {discountAmount > 0 && <small> (đã giảm {discountAmount.toLocaleString()}đ)</small>}
          </strong>
          <button className="btn btn-success ms-3" onClick={handlePlaceOrder}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;