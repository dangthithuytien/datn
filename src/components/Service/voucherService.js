import axios from "axios";
import { getAuthHeaders } from "../Cookie/authUtils";

const baseURL = "https://localhost:7003";

export const getDiscountCodes = async () => {
  const res = await axios.get(`${baseURL}/api/DiscountCode`, getAuthHeaders());
  return res.data;
};

export const redeemVoucher = async (discountCodeId) => {
  const res = await axios.post(
    `${baseURL}/api/Voucher/exchange-discount/${discountCodeId}`,
    {},
    getAuthHeaders()
  );
  return res.data;
};

export const getVoucherHistory = async () => {
  const res = await axios.get(`${baseURL}/api/Voucher/history`, getAuthHeaders());
  return res.data;
};
