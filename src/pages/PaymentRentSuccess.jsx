import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiClient from "../components/Service/AxiosConfig";

const PaymentRentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [orderInfo, setOrderInfo] = useState(null);

  useEffect(() => {
    const checkVnPayResult = async () => {
      try {
        const response = await apiClient.get("/CashOrder/payment-callback-vnpay", {
          params: Object.fromEntries([...searchParams])
        });

        if (response.data?.success) {
          setStatus("success");
          setOrderInfo(response.data);
          setMessage("🎉 Thanh toán và tạo đơn thuê thành công!");
          localStorage.removeItem("rentCartBuy");
        } else {
          setStatus("fail");
          setMessage(response.data?.message || "Thanh toán thất bại.");
        }
      } catch (err) {
        setStatus("fail");
        setMessage("❌ Lỗi xử lý callback thanh toán.");
      }
    };

    checkVnPayResult();
  }, [searchParams]);

  return (
    <div className="container mt-5">
      {status === "loading" && <p>⏳ Đang xử lý kết quả thanh toán...</p>}
      {status === "success" && (
        <div>
          <h3>{message}</h3>
          <p>Mã đơn hàng: {orderInfo?.orderId || "(Không rõ)"}</p>
          <p>Cảm ơn bạn đã thuê sách tại hệ thống của chúng tôi.</p>
        </div>
      )}
      {status === "fail" && (
        <div>
          <h3 style={{ color: "red" }}>{message}</h3>
          <p>Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentRentSuccess;
