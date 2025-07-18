import React, { useState, useEffect } from 'react';
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    const provinceName =
    provinces.find((p) => p.id.toString() === selectedProvince)?.full_name || "";
  const districtName =
    districts.find((d) => d.id.toString() === selectedDistrict)?.full_name || "";
  const wardName =
    wards.find((w) => w.id.toString() === selectedWard)?.full_name || "";
    const fullAddress = `${address}, ${wardName}, ${districtName}, ${provinceName}`;

  
    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận không khớp");
      return;
    }
   

    const formattedDOB = new Date(dob).toISOString().split("T")[0]; // "yyyy-MM-dd"

    const payload = {
      UserName: userName,
      Email: email,
      Password: password,
      ConfirmPassword: confirmPassword,
      Address: fullAddress,
      DateOfBirth: formattedDOB,
    };

    try {
      const res = await authService.register(payload);
      setMessage(res.message || 'Đăng ký thành công!');
      navigate('/confirm-email', { state: { email } });
    } catch (err) {
      console.error("🔥 Lỗi từ server:", err?.response?.data);
      const msg = err?.response?.data?.message || 'Đăng ký thất bại';
      setError(msg);
    }
  };
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

        <div className="form-group">
          <label>Tỉnh/Thành phố</label>
          <select
            className="checkout-input"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id.toString()}>{p.full_name}</option>
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
              <option key={d.id} value={d.id.toString()}>{d.full_name}</option>
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
              <option key={w.id} value={w.id.toString()}>{w.full_name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
  <label className="form-label">Địa chỉ cụ thể (số nhà, tên đường...)</label>
  <input
    type="text"
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
