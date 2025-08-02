import axios from "axios";
import { tokenUtils, cookieUtils } from "../Cookie/cookieUtils.js";

// Sử dụng proxy thay vì direct URL để tránh CORS
const API_BASE_URL = "https://chosachonline-datn.onrender.com/api";

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Quan trọng: để gửi cookie
});

// Interceptor để xử lý request
apiClient.interceptors.request.use(
  (config) => {
    // Tự động thêm Authorization header nếu có token
    const token = tokenUtils.getAccessToken();
    if (token && !tokenUtils.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response và auto refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = cookieUtils.getCookie("refreshToken");
      const accessToken = tokenUtils.getAccessToken("Token");

      if (refreshToken && accessToken) {
        try {
          // Gọi API refresh token
          const response = await axios.post(
            `${API_BASE_URL}/Auth/refresh-token`,
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
            {
              withCredentials: true,
            }
          );

          if (response.data.isSuccess) {
            // Lưu token mới
            tokenUtils.setAccessToken(response.data.token);

            // Thử lại request ban đầu với token mới
            originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error("Auto refresh token failed:", refreshError);
          // Redirect đến trang login hoặc xóa token
          tokenUtils.removeAccessToken();
          cookieUtils.deleteCookie("refreshToken");
          window.location.href = "/";
        }
      }
    }

    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
