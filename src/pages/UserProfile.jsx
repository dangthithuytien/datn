import React from 'react';
import '../components/style/UserProfile.css';

const UserProfile = () => {
  return (
    <div className="user-profile-container">
      <h1 className="main-title">THÔNG TIN NGƯỜI DÙNG</h1>

      {/* Phần Thông tin cá nhân */}
      <div className="section personal-info">
        <h2 className="section-title">Thông tin cá nhân</h2>
        <div className="info-row">
          <span className="info-label">Họ & Tên</span>
          <span className="info-value">Trần Minh Anh</span>
        </div>
        <div className="info-row">
          <span className="info-label">Nhóm mức</span>
          <span className="info-value">---</span>
        </div>
        <button className="add-button">Thêm nickname</button>
      </div>

      {/* Phần Ngày sinh */}
      <div className="section birth-section">
        <h2 className="section-title">Ngày sinh</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Giới tính</span>
            <select className="info-select">
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          <div className="info-item">
            <span className="info-label">Quốc tịch</span>
            <button className="select-button">Chọn quốc tịch</button>
          </div>
        </div>
      </div>

      {/* Phần Liên hệ */}
      <div className="section contact-section">
        <h2 className="section-title">Số điện thoại và Email</h2>
        <div className="contact-item">
          <span className="contact-label">Số điện thoại</span>
          <div className="contact-value">
            <span>0375136762</span>
            <button className="update-button">Cập nhật</button>
          </div>
        </div>
        <div className="contact-item">
          <span className="contact-label">Địa chỉ email</span>
          <div className="contact-value">
            <button className="add-email-button">Thêm địa chỉ email</button>
          </div>
        </div>
      </div>

      {/* Phần Bảo mật */}
      <div className="section security-section">
        <h2 className="section-title">Bảo mật</h2>
        <div className="security-item">
          <span className="security-label">Đổi mật khẩu</span>
          <button className="security-button">Cập nhật</button>
        </div>
        <div className="security-item">
          <span className="security-label">Thiết lập mã PIN</span>
          <button className="security-button">Thiết lập</button>
        </div>
        <div className="security-item">
          <span className="security-label">Yêu cầu xóa tài khoản</span>
          <button className="delete-button">Yêu cầu</button>
        </div>
      </div>

      {/* Phần Liên kết MXH */}
      <div className="section social-section">
        <h2 className="section-title">Liên kết mạng xã hội</h2>
        <div className="social-buttons">
          <button className="social-button facebook">
            <i className="bi bi-facebook"></i>
            Facebook
          </button>
          <button className="social-button google">
            <i className="bi bi-google"></i>
            Google
          </button>
        </div>
      </div>

      <button className="save-button">Lưu thay đổi</button>
    </div>
  );
};

export default UserProfile;