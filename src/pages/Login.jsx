import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
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
        <button className="social-button google-button btn btn-outline-danger w-100 mb-2">
          <i className="bi bi-google me-2"></i>ĐĂNG NHẬP GOOGLE
        </button>
        <button className="social-button facebook-button btn btn-outline-primary w-100">
          <i className="bi bi-facebook me-2"></i>ĐĂNG NHẬP FACEBOOK
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
