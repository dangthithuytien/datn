import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../components/Service/AxiosConfig"; // <-- Đường dẫn đúng tới Axios config
import { tokenUtils } from "../components/Cookie/tokenUtils"; // <-- Đường dẫn đúng tới tokenUtils
import "../components/style/Login.css";
import authService from "../components/Service/authService"; 
import { useMyAlert } from "../components/MyAlertContext";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { showAlert } = useMyAlert();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/Auth/login", {
        Email: email,
        Password: password,
      });

      if (res.data?.IsSuccess && res.data?.Token) {
        const accessToken = res.data.Token;
        tokenUtils.setAccessToken(accessToken);
        document.cookie = `refreshToken=${res.data.RefreshToken}; path=/; secure; samesite=strict`;
        document.cookie = `Token=${res.data.Token}; path=/; secure; samesite=strict`;
        // 🟢 Gọi API lấy thông tin người dùng sau khi đăng nhập thành công
        const userRes = await apiClient.get("/user/profile", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (userRes.data) {
          localStorage.setItem("user", JSON.stringify(userRes.data)); // ✅ Lưu thông tin người dùng
        }
        const payload = tokenUtils.getTokenPayload(accessToken);
        console.log("🔒 Token payload:", payload);
        console.log("⏰ Token expires at:", new Date(payload.exp * 1000).toLocaleString());
        showAlert("✅ Đăng nhập thành công!");
        navigate("/");
      } else {
        showAlert("❌ Sai thông tin đăng nhập!", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("❌ Lỗi hệ thống hoặc mạng!", "error");
    }
  };
  const handleGoogleLogin = async () => {
    try {
      const response = await apiClient.get('/Auth/external-login');
      const loginUrl = response.data?.loginUrl;
      if (loginUrl) {
        window.location.href = loginUrl;
      // Chuyển hướng tới Google
      } else {
        showAlert('❌ Không lấy được link đăng nhập Google', "error");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      showAlert("❌ Lỗi khi đăng nhập bằng Google!", "error");
    }
  };
  return (
    <div className="login-container container-md bg-white rounded-3 shadow-sm p-4 p-md-5">
      <h1 className="text-center mb-3">ĐĂNG NHẬP</h1>
      <p className="login-subtitle text-center text-muted mb-4">
        Vui lòng nhập Email và Mật khẩu
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        {/* Phần Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="emailInput"><i className="bi bi-envelope me-2"></i>Email</label>
        </div>

        {/* Phần Mật khẩu */}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="passwordInput"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="passwordInput"><i className="bi bi-lock me-2"></i>Mật khẩu</label>
        </div>
        <div className="forgot-password-link">
          <Link to="/reset-password">Quên mật khẩu?</Link></div>
        <button type="submit" className="btn btn-success w-100 py-2">
          <i className="bi bi-box-arrow-in-right me-2"></i>
          ĐĂNG NHẬP
        </button>
      </form>
      <div className="social-login my-4">
        <div className="divider d-flex align-items-center my-3">
          <hr className="w-100" />
          <span className="px-3 text-muted">HOẶC</span>
          <hr className="w-100" />
        </div>
        <button
          className="social-button google-button btn btn-outline-danger w-100 mb-2"
          onClick={handleGoogleLogin}
        >
          <i className="bi bi-google me-2"></i>ĐĂNG NHẬP GOOGLE
        </button>
     
      </div>

      <div className="text-center mt-3">
        <span className="register-prompt text-muted">
          Dành cho khách hàng mới -{" "}
          <Link to="/register" className="register-link text-decoration-none">
            Đăng ký
          </Link>
        </span>
      </div>
    </div>
  );
}