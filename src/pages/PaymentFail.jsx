import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFail = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000); // quay về sau 5 giây

    return () => clearTimeout(timer); // cleanup khi component bị unmount
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50 text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Thanh toán thất bại</h1>
      <p className="text-gray-700 mb-2 text-lg">
        Có lỗi xảy ra trong quá trình thanh toán.
      </p>
      <p className="text-gray-500 mb-6">
        Bạn sẽ được chuyển về trang chủ sau vài giây...
      </p>
      
    </div>
  );
};

export default PaymentFail;
