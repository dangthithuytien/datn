import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"; // Dùng chung CSS với Login

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phonenumber, setPhone] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng ký ở đây
  };

  return (
    <div className="login-container container-md bg-white rounded-3 shadow-sm p-4 p-md-5">
      <h1 className="text-center mb-3">ĐĂNG KÝ</h1>
      <p className="login-subtitle text-center text-muted mb-4">
        Vui lòng nhập thông tin đăng ký
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        {/* Phần Name */}
        <div className="form-floating mb-3">
          <input
            type="Text"
            className="form-control"
            id="registerName"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="registerEmail"><i className="bi bi-person me-2"></i>Họ và Tên</label>
        </div>

        {/* Phần Email */}
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="registerEmail"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="registerEmail"><i className="bi bi-envelope me-2"></i>Email</label>
        </div>

        {/* Phần SDT */}
        <div className="form-floating mb-3">
          <input
            type="tel"
            className="form-control"
            id="registerphonenumber"
            placeholder="Số điện thoại"
            value={phonenumber}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <label htmlFor="registerEmail"><i class="bi bi-telephone me-2"></i>Số điện thoại</label>
        </div>

        {/* Phần Mật khẩu */}
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="registerPassword"><i className="bi bi-lock me-2"></i>Mật khẩu</label>
        </div>

        {/* Xác nhận Mật khẩu */}
        <div className="form-floating mb-4">
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword"><i className="bi bi-lock me-2"></i>Xác nhận mật khẩu</label>
        </div>

        {/* Nút Đăng ký */}
        <button type="submit" className="btn btn-success w-100 py-2">
          <i className="bi bi-person-plus me-2"></i>
          ĐĂNG KÝ
        </button>
      </form>

      {/* Phần chuyển sang Đăng nhập */}
      <div className="text-center mt-3">
        <span className="text-muted">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-decoration-none fw-bold">
            Đăng nhập ngay
          </Link>
        </span>
      </div>
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
    </div>
  );
}
