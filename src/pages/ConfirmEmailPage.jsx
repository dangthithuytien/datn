import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../components/Service/authService';

const ConfirmEmailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email] = useState(state?.email || '');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await authService.confirmEmail({ Email: email, Code: code });
      setMessage(res.message || 'Xác nhận thành công!');
       navigate('/login'); 
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Xác nhận thất bại';
      setError(msg);
    }
  };
  const handleResendOtp = async () => {
    setMessage('');
    setError('');   
    try {
      const res = await authService.resendOtp(email);
      setMessage(res.message || '✅ Đã gửi lại mã xác nhận');
    } catch (err) {
      setError(err.message || '❌ Gửi lại thất bại');   
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleConfirm} className="p-4 bg-white shadow rounded" style={{ maxWidth: 500, margin: '0 auto' }}>
        <h4 className="mb-4">Xác nhận Email</h4>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" value={email} disabled className="form-control" />
        </div>

        <div className="mb-3">
          <label>Mã xác nhận</label>
          <input
            type="text"
            className="form-control"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">Xác nhận</button>

        <button type="button" className="btn btn-link mt-2" onClick={handleResendOtp}>
          🔄 Gửi lại mã
        </button>
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default ConfirmEmailPage;