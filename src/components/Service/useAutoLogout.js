import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokenUtils } from "../Cookie/cookieUtils"; // chỉnh lại path nếu cần
import { cookieUtils } from "../Cookie/cookieUtils"; 
export const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const token = tokenUtils.getAccessToken();
      if (tokenUtils.isTokenExpired(token)) {
        tokenUtils.removeAccessToken();
        // Có thể xóa thêm refreshToken nếu bạn dùng
        cookieUtils.deleteCookie("refreshToken");
      }
    }, 60 * 1000); // Kiểm tra mỗi 60 giây

    return () => clearInterval(interval); // Dọn dẹp
  }, [navigate]);
};
