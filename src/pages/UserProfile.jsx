import React, { useState } from "react";
import "../components/style/UserProfile.css";

const UserProfile = () => {
  const [user, setUser] = useState({
    avatar: "https://i.imgur.com/Xn1fXEf.png",
    fullName: "Trần Minh Anh",
    role: "Khách hàng",
    email: "minhanh@example.com",
    password: "",
    phone: "0375136762",
    birthday: "2000-07-15",
    gender: "Nữ",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    point: 320,
  });

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("Thông tin đã lưu:", user);
    alert("Thông tin đã được lưu!");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser((prev) => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuickLink = (text) => {
    alert(`Bạn đã chọn: ${text}`);
  };

  return (
    <div className="user-profile-container">
      <h1 className="main-title">THÔNG TIN NGƯỜI DÙNG</h1>

      <div className="grid-layout-v2">
        {/* Truy cập nhanh (cột trái) */}
        <div className="quick-access">
          <div className="quick-links">
            <h3>Truy cập nhanh</h3>
            <button
              className="quick-link-button"
              onClick={() => handleQuickLink("📚 Sách yêu thích")}
            >
              📚 Sách yêu thích
            </button>
            <button
              className="quick-link-button"
              onClick={() => handleQuickLink("🛒 Lịch sử đơn hàng")}
            >
              🛒 Lịch sử đơn hàng
            </button>
            <a href="/orders-rent" className="quick-link-button">
              📦 Lịch sử đơn thuê
            </a>{" "}
          </div>
        </div>

        {/* Thông tin cá nhân (cột phải) */}
        <div className="profile-info-section">
          <div className="section personal-info">
            <div className="section-header">
              <h2 className="section-title">Thông tin cá nhân</h2>
            </div>

            <div className="avatar-section">
              <img src={user.avatar} alt="avatar" className="avatar" />
              <label htmlFor="avatar-upload" className="update-avatar-button">
                Cập nhật
              </label>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <div className="two-column-form">
              <div className="column">
                <div className="form-group">
                  <label htmlFor="fullName">Họ & Tên</label>
                  <input
                    id="fullName"
                    value={user.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input id="email" value={user.email} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    id="phone"
                    value={user.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Giới tính</label>
                  <div className="gender-options">
                    {["Nam", "Nữ", "Khác"].map((option) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name="gender"
                          value={option}
                          checked={user.gender === option}
                          onChange={(e) =>
                            handleChange("gender", e.target.value)
                          }
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="point">Điểm tích lũy</label>
                  <input id="point" value={user.point} disabled />
                </div>
              </div>

              <div className="column">
                <div className="form-group">
                  <label htmlFor="role">Vai trò</label>
                  <input id="role" value={user.role} disabled />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={user.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="birthday">Ngày sinh</label>
                  <input
                    type="date"
                    id="birthday"
                    value={user.birthday}
                    onChange={(e) => handleChange("birthday", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Địa chỉ</label>
                  <input
                    id="address"
                    value={user.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button className="save-button" onClick={handleSubmit}>
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
