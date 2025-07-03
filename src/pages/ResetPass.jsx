import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../components/Service/authService';

const ResetPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: ""
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await authService.resetPassword({
        Email: formData.email,
        Code: formData.code,
        NewPassword: formData.newPassword,
      });

      setMessage({ text: '✅ Đặt lại mật khẩu thành công!', type: 'success' });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Lỗi reset mật khẩu:", err);
      setMessage({ 
        text: err.response?.data?.message || '❌ Mã xác nhận không đúng hoặc lỗi hệ thống.', 
        type: 'danger' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!formData.email) {
      setMessage({ text: '❌ Vui lòng nhập email', type: 'danger' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await authService.forgotPassword(formData.email);
      setMessage({ 
        text: res.message || '✅ Đã gửi lại mã xác nhận', 
        type: 'success' 
      });
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.message || '❌ Gửi lại thất bại', 
        type: 'danger' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">🔐 Đặt Lại Mật Khẩu</h2>
      {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}
      
      <form onSubmit={handleResetPassword}>
        <div className="mb-3">
          <label>Email đã đăng ký</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Nhập email"
          />
        </div>
        <div className="mb-3">
          <label>Mã xác nhận (OTP)</label>
          <input
            type="text"
            className="form-control"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="Nhập mã xác nhận"
          />
        </div>
        <div className="mb-3">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            placeholder="Nhập mật khẩu mới"
            minLength="6"
          />
        </div>
        <div className="d-grid gap-2">
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={handleResendEmail}
            disabled={isLoading}
          >
            {isLoading ? 'Đang gửi...' : '🔄 Gửi mã'}
          </button>
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận & Đổi mật khẩu'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPass;