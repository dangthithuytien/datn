import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenUtils } from "../components/Cookie/tokenUtils";
import apiClient from "../components/Service/AxiosConfig"; // ✅ Import apiClient nếu bạn chưa có

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const refreshToken = params.get('refreshToken'); // nếu backend có gửi

      if (token) {
        tokenUtils.setAccessToken(token);

        if (refreshToken) {
          document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
        }

        try {
          const userRes = await apiClient.get("/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userRes.data) {
            localStorage.setItem("user", JSON.stringify(userRes.data));
          }

          navigate('/');
        } catch (err) {
          console.error("Lỗi khi lấy thông tin người dùng:", err);
          navigate('/login?error=user_info_failed');
        }
      } else {
        navigate('/login?error=oauth_failed');
      }
    };

    handleOAuthCallback();
  }, [navigate]);

  return <p>Đang xác thực...</p>;
};

export default OAuthCallback;
