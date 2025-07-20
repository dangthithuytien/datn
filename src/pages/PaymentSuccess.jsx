import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/"); // Quay về trang chủ sau 1 giây
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50 text-center">
      <div className="text-green-600 text-6xl mb-4">✔️</div>
      <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
      {orderId && (
        <p className="text-lg text-gray-700 mb-1">
          Mã đơn hàng: <span className="font-semibold">{orderId}</span>
        </p>
      )}
      <p className="text-gray-600">Bạn sẽ được chuyển về trang chủ trong giây lát...</p>
    </div>
  );
};

export default PaymentSuccess;
