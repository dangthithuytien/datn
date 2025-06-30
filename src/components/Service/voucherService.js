import axios from "axios";

const baseURL = "https://localhost:7003"; // Cập nhật đúng URL API backend

// Hàm lấy token từ localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Lấy danh sách các mã giảm giá khả dụng
export const getAvailableVouchers = async () => {
  const res = await axios.get(`${baseURL}/api/Voucher/available-discounts`, getAuthHeaders());
  return res.data;
};

// Đổi mã giảm giá theo DiscountCodeId
export const redeemVoucherById = async (discountCodeId) => {
  const res = await axios.post(
    `${baseURL}/api/Voucher/exchange-discount/${discountCodeId}`,
    {},
    getAuthHeaders()
  );
  return res.data;
};
