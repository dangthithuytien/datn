// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile, changePassword } from "../components/Service/userService";
import "../components/style/UserProfile.css";


const UserProfile = () => {
  const [user, setUser] = useState({
    userName: "",
    phoneNumber: "",  
    address: "",
    dateOfBirth: "",
    imageUser: "",
    email: "",
    point: 0,
    gender: "",
    role: "",
    currentPassword: "",
    newPassword: "",
  });

  const [previewImage, setPreviewImage] = useState("/default-avatar.png");
  const [imageFile, setImageFile] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserProfile();
        console.log("✅ API trả về:", data);

        // ⚠️ Map đúng tên trường
        setUser({
          userName: data.UserName || "",
          phoneNumber: data.PhonNumber || "",
          address: data.Address || "",
          dateOfBirth: data.DateOfBirth || "",
          imageUser: data.ImageUser || "",
          email: data.Email || "",
          point: data.Points || 0,

        });

        if (data.ImageUser) {
          setPreviewImage(`https://localhost:7003${data.ImageUser}`);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("UserName", user.userName);
      formData.append("PhoneNumber", user.phoneNumber);
      formData.append("Address", user.address);
      formData.append("DateOfBirth", new Date(user.dateOfBirth).toISOString());
      if (imageFile) formData.append("ImageUser", imageFile);

      await updateUserProfile(formData);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="user-profile-container">
      <h1 className="main-title">THÔNG TIN NGƯuỜI DÙNG</h1>
      <div className="grid-layout-v2">
        {/* Cột trái */}
        <div className="quick-access">
          <div className="quick-links">
            <h3>Truy cập nhanh</h3>
<button className="quick-link-button" onClick={() => setActiveTab("profile")}>👤 Thông tin cá nhân</button>
            <button className="quick-link-button" onClick={() => setActiveTab("password")}>🔑 Đổi mật khẩu</button>
            <a href="/favorite" className="quick-link-button">📚 Sách yêu thích</a>
            <a href="/orders-all" className="quick-link-button">🛒 Lịch sử đơn mua</a>
            <a href="/orders-rent" className="quick-link-button">📦 Lịch sử đơn thuê</a>
          </div>
        </div>

        {/* Cột phải */}
        <div className="profile-info-section">
          {activeTab === "profile" && (
            <div className="section personal-info">
              <h2 className="section-title">Thông tin cá nhân</h2>

              <div className="avatar-section">
                <img
                  src={previewImage}
                  alt="Ảnh đại diện"
                  width={100}
                  height={100}
                  style={{ borderRadius: "10%", objectFit: "cover" }}
                />
                <label htmlFor="avatar-upload" className="update-avatar-button">
                  Cập nhật ảnh
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
                    <label>Họ & Tên</label>
                    <input
                      value={user.userName}
                      onChange={(e) => handleChange("userName", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input value={user.email} disabled />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      value={user.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Điểm tích lũy</label>
                    <input value={user.point} disabled />
                  </div>
                </div>

                <div className="column">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      value={user.dateOfBirth?.slice(0, 10)}
                      onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    />
                  </div>
<div className="form-group">
                    <label>Địa chỉ</label>
                    <input
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
          )}

          {activeTab === "password" && (
            <div className="section change-password">
              <h2 className="section-title">Đổi mật khẩu</h2>

              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <input
                  type="password"
                  autoComplete="new-password" // <- Dòng quan trọng
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button
              onClick={async () => {
                try {
                  if (!currentPassword || !newPassword) {
                    alert("Vui lòng nhập đầy đủ mật khẩu.");
                    return;
                  }
              
                  await changePassword({
                    CurrentPassword: currentPassword,
                    NewPassword: newPassword,
                  });
              
                  alert("✅ Đổi mật khẩu thành công!");
                  setCurrentPassword("");
                  setNewPassword("");
                  setActiveTab("profile");
                } catch (err) {
                  console.error("❌ Đổi mật khẩu lỗi:", err);
                  alert("❌ Mật khẩu hiện tại không đúng hoặc lỗi hệ thống.");
                }
              }}
              >
                Đổi mật khẩu
              </button>
            </div>
          )}

        </div>

      </div>
    </div>

  );
};

export default UserProfile;