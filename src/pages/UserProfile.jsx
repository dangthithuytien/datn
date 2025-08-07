import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from "../components/Service/userService";
import "../components/style/UserProfile.css";
import { useMyAlert } from "../components/MyAlertContext";
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [specificAddress, setSpecificAddress] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const { showAlert } = useMyAlert();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserProfile();
        const userData = res?.data || res; // tuỳ backend trả về
        console.log("UserData từ backend:", userData);

        if (!userData) {
          console.error("Không có dữ liệu người dùng.");
          return;
        }

        // set full object
        setUser({
          userName: userData.UserName || "",
          phoneNumber: userData.PhoneNumber || userData.PhonNumber || "",
          address: userData.Address || "",
          dateOfBirth: userData.DateOfBirth || "",
          imageUser: userData.ImageUser || "",
          email: userData.Email || "",
          point: userData.Points || 0,
          gender: userData.Gender || "",
          role: userData.Role || "",
          currentPassword: "",
          newPassword: "",
        });

        // address cụ thể
        const fullAddress =
          typeof userData.Address === "string" ? userData.Address : "";
        const addressPart = fullAddress.split(",")[0]?.trim() || "";
        setSpecificAddress(addressPart);

        // địa chỉ hành chính
        setSelectedProvince(userData.provinceName || "");
        setSelectedDistrict(userData.districtName || "");
        setSelectedWard(userData.wardName || "");

        // ảnh đại diện
        if (userData.ImageUser) {
          setPreviewImage(userData.ImageUser); // là URL đầy đủ từ Cloudinary
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin người dùng:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const parseAddressAndSetSelections = async () => {
if (!user.address) return;

      const parts = user.address.split(",").map((p) => p.trim());

      const wardPart = parts.find(
        (p) =>
          p.startsWith("Phường") ||
          p.startsWith("Xã") ||
          p.startsWith("Thị trấn")
      );
      const districtPart = parts.find(
        (p) =>
          p.startsWith("Quận") ||
          p.startsWith("Huyện") ||
          p.startsWith("Thành phố")
      );
      const provincePart = parts.find(
        (p) => p.startsWith("Tỉnh") || p.startsWith("Thành phố")
      );

      // Tìm tỉnh
      const matchedProvince = provinces.find(
        (p) => provincePart && p.full_name.includes(provincePart)
      );
      if (matchedProvince) {
        setSelectedProvince(matchedProvince.id.toString());

        // Lấy danh sách huyện theo tỉnh
        const districtRes = await fetch(
          `https://esgoo.net/api-tinhthanh/2/${matchedProvince.id}.htm`
        );
        const districtData = await districtRes.json();
        if (districtData.error === 0) {
          setDistricts(districtData.data);
          const matchedDistrict = districtData.data.find(
            (d) => districtPart && d.full_name.includes(districtPart)
          );
          if (matchedDistrict) {
            setSelectedDistrict(matchedDistrict.id.toString());

            // Lấy danh sách xã theo huyện
            const wardRes = await fetch(
              `https://esgoo.net/api-tinhthanh/3/${matchedDistrict.id}.htm`
            );
            const wardData = await wardRes.json();
            if (wardData.error === 0) {
              setWards(wardData.data);
              const matchedWard = wardData.data.find(
                (w) => wardPart && w.full_name.includes(wardPart)
              );
              if (matchedWard) {
                setSelectedWard(matchedWard.id.toString());
              }
            }
          }
        }
      }
    };

    if (provinces.length > 0 && user.address) {
      parseAddressAndSetSelections();
    }
  }, [provinces, user.address]);

  useEffect(() => {
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((res) => res.json())
      .then((data) => {
        if (data.error === 0) setProvinces(data.data);
      });
  }, []);
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://esgoo.net/api-tinhthanh/2/${selectedProvince}.htm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error === 0) setDistricts(data.data);
        });
    } else {
      setDistricts([]);
    }
    setSelectedDistrict("");
    setSelectedWard("");
    setWards([]);
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error === 0) setWards(data.data);
        });
    } else {
      setWards([]);
    }
setSelectedWard("");
  }, [selectedDistrict]);

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
      const provinceName =
        provinces.find((p) => p.id.toString() === selectedProvince)
          ?.full_name || "";
      const districtName =
        districts.find((d) => d.id.toString() === selectedDistrict)
          ?.full_name || "";
      const wardName =
        wards.find((w) => w.id.toString() === selectedWard)?.full_name || "";
      const fullAddress = `${specificAddress}, ${wardName}, ${districtName}, ${provinceName}`;
      const formData = new FormData();
      formData.append("UserName", user.userName);
      formData.append("PhoneNumber", user.phoneNumber);
      formData.append("Address", fullAddress);
      formData.append("DateOfBirth", new Date(user.dateOfBirth).toISOString());
      if (imageFile) formData.append("ImageUser", imageFile);
      await updateUserProfile(formData);
      showAlert("Cập nhật thành công!");
      setUser((prev) => ({
        ...prev,
        address: fullAddress,
      }));
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      showAlert("Cập nhật thất bại!", "error");
    }
  };

  return (
    <div className="user-profile-container">
      <h1 className="main-title">THÔNG TIN NGƯỜI DÙNG</h1>
      <div className="grid-layout-v2">
        <div className="quick-access">
          <div className="quick-links">
            <h3>Truy cập nhanh</h3>
            <button
              className="quick-link-button"
              onClick={() => setActiveTab("profile")}
            >
              👤 Thông tin cá nhân
            </button>
            <button
              className="quick-link-button"
              onClick={() => setActiveTab("password")}
            >
              🔑 Đổi mật khẩu
            </button>
            <a href="/favorite" className="quick-link-button">
              📚 Sách yêu thích
            </a>
            <a href="/orders-all" className="quick-link-button">
              🛒 Lịch sử đơn mua
            </a>
            <a href="/orders-rent" className="quick-link-button">
              📦 Lịch sử đơn thuê
            </a>
          </div>
        </div>

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
                      onChange={(e) =>
                        handleChange("phoneNumber", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Tỉnh/Thành phố</label>
                    <select
                      className="checkout-input"
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                    >
                      <option value="">Chọn Tỉnh/Thành phố</option>
                      {provinces.map((p) => (
                        <option key={p.id} value={p.id.toString()}>
                          {p.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Quận/Huyện</label>
                    <select
                      className="checkout-input"
value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      disabled={!selectedProvince}
                    >
                      <option value="">Chọn Quận/Huyện</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.id.toString()}>
                          {d.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phường/Xã</label>
                    <select
                      className="checkout-input"
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      disabled={!selectedDistrict}
                    >
                      <option value="">Chọn Phường/Xã</option>
                      {wards.map((w) => (
                        <option key={w.id} value={w.id.toString()}>
                          {w.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Địa chỉ cụ thể</label>
                    <input
                      value={specificAddress}
                      onChange={(e) => setSpecificAddress(e.target.value)}
                      placeholder="Số nhà, tên đường..."
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
                  autoComplete="new-password"
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
                      showAlert("Vui lòng nhập đầy đủ mật khẩu.", "error");
                      return;
                    }
                    await changePassword({
CurrentPassword: currentPassword,
                      NewPassword: newPassword,
                    });
                    showAlert("✅ Đổi mật khẩu thành công!");
                    setCurrentPassword("");
                    setNewPassword("");
                    setActiveTab("profile");
                  } catch (err) {
                    console.error("❌ Đổi mật khẩu lỗi:", err);
                    showAlert(
                      "❌ Mật khẩu hiện tại không đúng hoặc lỗi hệ thống.",
                      "error"
                    );
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