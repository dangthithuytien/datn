import React, { useState, useEffect, useRef } from "react";
import "../components/style/Checkout.css";
import { getCartSale } from "../components/Service/cartService";
import apiClient from "../components/Service/AxiosConfig";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  const prevPath = useRef(location.pathname);

  const [userInfo, setUserInfo] = useState({
    name: "",
    phone: "",
    email: "",
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
        email: storedUser.Email || "",
      });
    }
  }, []);

  useEffect(() => {
    setShippingFee(shipping === "home_delivery" ? 20000 : 0);
  }, [shipping]);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) setProvinces(data.data);
      });

    const fetchVouchers = async () => {
      try {
        const res = await apiClient.get("/Voucher/history");
        const data = res.data;

        const unused = data.filter((v) => !v.IsUsed);
        setAvailableVouchers(unused);
      } catch (err) {
        console.error("❌ Lỗi khi lấy voucher:", err);
      }
    };

    fetchVouchers();
  }, []);




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

  useEffect(() => {
    const parseAndRestoreAddress = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser || !storedUser.Address || provinces.length === 0) return;

      const parts = storedUser.Address.split(",").map(p => p.trim());

      const wardPart = parts.find(p =>
        p.startsWith("Xã") || p.startsWith("Phường") || p.startsWith("Thị trấn")
      );
      const districtPart = parts.find(p =>
        p.startsWith("Huyện") || p.startsWith("Quận") || p.startsWith("Thành phố")
      );
      const provincePart = parts.find(p =>
        p.startsWith("Tỉnh") || p.startsWith("Thành phố")
      );

      const matchedProvince = provinces.find(p =>
        provincePart && p.full_name.includes(provincePart)
      );

      if (matchedProvince) {
        setSelectedProvince(matchedProvince.id.toString());

        const districtRes = await fetch(
          `https://esgoo.net/api-tinhthanh/2/${matchedProvince.id}.htm`
        );
        const districtData = await districtRes.json();
        if (districtData.error === 0) {
          setDistricts(districtData.data);

          const matchedDistrict = districtData.data.find(d =>
            districtPart && d.full_name.includes(districtPart)
          );
          if (matchedDistrict) {
            setSelectedDistrict(matchedDistrict.id.toString());

            const wardRes = await fetch(
              `https://esgoo.net/api-tinhthanh/3/${matchedDistrict.id}.htm`
            );
            const wardData = await wardRes.json();
            if (wardData.error === 0) {
              setWards(wardData.data);

              const matchedWard = wardData.data.find(w =>
                wardPart && w.full_name.includes(wardPart)
              );
              if (matchedWard) {
                setSelectedWard(matchedWard.id.toString());
              }
            }
          }
        }
      }
    };

    parseAndRestoreAddress();
  }, [provinces]);

  const addToCartSession = async (product) => {
    try {
      await apiClient.post("/CartSale/add", {
        ProductId: product.ProductId,
        Quantity: product.Quantity,
      });
    } catch (error) {
      const errorText =
        error.response?.data?.message || error.message || "Không rõ lỗi";
      throw new Error("❌ Lỗi khi thêm sản phẩm vào session: " + errorText);
    }
  };


  const createCashOrder = async (orderData) => {
    try {
      const response = await apiClient.post("/SaleOrders/create-cash", orderData);
      return response.data;
    } catch (error) {
      const errorDetail = error.response?.data || error.message;
      throw new Error("❌ Lỗi khi tạo đơn hàng: " + errorDetail);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePlaceOrder = async () => {
    const isBuyNow = localStorage.getItem("isBuyNow") === "true";
    const addressDetail = document.querySelector(
      'input[placeholder="Địa chỉ cụ thể"]'
    ).value;
    const products = JSON.parse(localStorage.getItem("cartBuy")) || [];

    if (products.length === 0) {
      alert("🛒 Giỏ hàng trống!");
      return;
    }

    if (
      !userInfo.phone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !addressDetail
    ) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin người nhận.");
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

    const orderData = {
      UserId: "string",
      Address: fullAddress,
      Phone: userInfo.phone,
      HasShippingFee: shipping === "home_delivery",
      VoucherCode: selectedVoucher?.Code || "",
      SelectedProductIds: products.map((p) => p.ProductId),
    };

    try {
      if (isBuyNow) {
        for (const product of products) {
          console.log("Đang thêm vào session:", product);
          await addToCartSession(product);
        }
        await delay(500);
      }

      await delay(300);

      const sessionCart = await getCartSale();
      if (!sessionCart || sessionCart.length === 0) {
        alert("❌ Đặt hàng thất bại: Giỏ hàng session rỗng.");
        return;
      }

      if (payment === "cod") {
        await createCashOrder(orderData);
        alert("✅ Đặt hàng thành công (COD)!");
        window.location.href = "/";
      } else if (payment === "vnpay") {
        const response = await apiClient.post("/SaleOrders/create-vnpay", orderData);
        const paymentUrl = response.data.paymentUrl; // 🟢 Lấy đúng thuộc tính
        window.location.href = paymentUrl;

      }
      
      console.log("sadsadsadaaaaa", orderData);
      alert("✅ Đặt hàng thành công!");
      localStorage.removeItem("cartBuy");
      localStorage.removeItem("checkoutTotal");
      localStorage.removeItem("isBuyNow");
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
            onChange={(e) =>
              setUserInfo({ ...userInfo, phone: e.target.value })
            }
            className="checkout-input"
            placeholder="Số điện thoại"
          />
          <input
            type="email"
            value={userInfo.email}
            onChange={(e) =>
              setUserInfo({ ...userInfo, email: e.target.value })
            }
            className="checkout-input"
            placeholder="Email"
          />
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="checkout-input"
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id.toString()}>
                {p.full_name}
              </option>
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
              <option key={d.id} value={d.id.toString()}>
                {d.full_name}
              </option>
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
              <option key={w.id} value={w.id.toString()}>
                {w.full_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Địa chỉ cụ thể"
            className="checkout-input"
            style={{ flex: "1 1 100%" }}
          />
        </div>
      </div>

      <div className="checkout-section">
        <h3 className="checkout-section-title">Phương thức vận chuyển</h3>
        <label>
          <input
            type="radio"
            name="shipping"
            value="store_pickup"
            checked={shipping === "store_pickup"}
            onChange={() => setShipping("store_pickup")}
          />
          Đến cửa hàng lấy
        </label>
        <label>
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

      <div className="checkout-section">
  <h3 className="checkout-section-title">Phương thức thanh toán</h3>
  <label>
    <input
      type="radio"
      name="payment"
      value="cod"
      checked={payment === "cod"}
      onChange={() => setPayment("cod")}
    />
    COD
  </label>
  <label>
    <input
      type="radio"
      name="payment"
      value="vnpay"
      checked={payment === "vnpay"}
      onChange={() => setPayment("vnpay")}
    />
    VnPay
  </label>
</div>


      <div className="checkout-section checkout-footer">
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <select
            className="discount-input"
            value={selectedVoucher?.Code || ""}
            onChange={(e) => {
              const selected = availableVouchers.find(
                (v) => v.Code === e.target.value
              );
              setSelectedVoucher(selected || null);
              setDiscountValue(selected ? selected.DiscountValue : 0);
            }}
          >
            <option value="">-- Chọn mã giảm giá --</option>
            {availableVouchers.map((voucher) => (
              <option key={voucher.Code} value={voucher.Code}>
                {voucher.DiscountCodeName} - Giảm {voucher.DiscountValue}%
              </option>
            ))}
          </select>
        </div>

        {selectedVoucher && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Đã áp dụng mã: <strong>{selectedVoucher.Code}</strong> - Giảm{" "}
            {discountValue}%
          </p>
        )}

        <div style={{ marginTop: "10px" }}>
          <strong>
            Tổng hóa đơn:{" "}
            <span style={{ color: "#28a745" }}>
              {finalAmount.toLocaleString()}đ
            </span>
            {discountAmount > 0 && (
              <small> (đã giảm {discountAmount.toLocaleString()}đ)</small>
            )}
          </strong>
          <button className="btn btn-success ms-3" onClick={handlePlaceOrder}>
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
