
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../components/style/ForgetPass.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    // Simulate API call
    setIsSubmitted(true);
    setMessage('Yêu cầu đặt lại mật khẩu đã được gửi đến email của bạn!');
    setEmail('');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Quên mật khẩu</h2>
        <p>Nhập địa chỉ email để đặt lại mật khẩu</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Địa chỉ email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {message && <div className={`message ${isSubmitted ? 'success' : 'error'}`}>{message}</div>}

          <button type="submit" className="submit-btn">
            Gửi yêu cầu
          </button>
        </form>

        <div className="back-to-login">
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;