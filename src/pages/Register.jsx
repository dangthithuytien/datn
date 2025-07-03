import React, { useState } from 'react';
import authService from '../components/Service/authService';
import { useNavigate } from "react-router-dom";


const RegisterPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dob, setDob] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận không khớp");
      return;
    }

    const payload = {
      UserName: userName,
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
      Address: address,
      DateOfBirth: new Date(dob).toISOString()
    };

    try {
      const res = await authService.register(payload);
      setMessage(res.message || 'Đăng ký thành công!');
      navigate('/confirm-email', { state: { email } });
    } catch (err) {
      console.error("🔥 Lỗi từ server:", err?.response?.data)
      const msg = err?.message || err?.response?.data?.message || 'Đăng ký thất bại';
      setError(msg);
    }
  };


  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white" style={{ maxWidth: 500, margin: '0 auto' }}>
        <h4 className="mb-4">Đăng ký tài khoản</h4>

        <div className="mb-3">
          <label className="form-label">Tên đăng nhập</label>
          <input type="text" name="userName" className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Mật khẩu</label>
          <input type="password" name="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu</label>
          <input type="password" name="confirmPassword" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Địa chỉ</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
/>
        </div>

        <div className="mb-3">
          <label className="form-label">Ngày sinh</label>
          <input type="date" name="dateOfBirth" className="form-control" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">Đăng ký</button>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default RegisterPage;
