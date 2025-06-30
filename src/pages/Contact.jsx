import React, { useState } from "react";
import {
  FaFacebookMessenger,
  FaPhoneAlt,
  FaEnvelope,
  FaComments,
} from "react-icons/fa";
import "../components/style/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    confirm: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Thông tin liên hệ:", formData);
    alert("Cảm ơn bạn đã liên hệ với chúng tôi!");
  };

  return (
    <div className="container contact-page mt-5">
      <h2 className="mb-4 text-success">Liên hệ với cửa hàng sách</h2>
      <div className="row">
        {/* Form liên hệ */}
        <div className="col-md-7">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Nội dung liên hệ</label>
              <textarea
                className="form-control"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                name="confirm"
                checked={formData.confirm}
                onChange={handleChange}
                required
              />
              <label className="form-check-label">
                Tôi xác nhận tôi không phải robot.
              </label>
            </div>
            <button type="submit" className="btn btn-success">
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* Thông tin liên hệ nhanh */}
        <div className="col-md-5">
          <div className="contact-info p-3">
            <h5>Thông tin liên hệ nhanh</h5>

            <p>
              <FaPhoneAlt className="me-2" />
              0123 456 789
            </p>

            <p>
              <FaEnvelope className="me-2" />
              <a href="hexaclovershop@gmail.com">
                lienhe@cuahangsach.vn
              </a>
            </p>

            <p>
              <FaComments className="me-2" />
              <a
                href="https://zalo.me/0987654321"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat qua Zalo
              </a>
            </p>

            <p>
              <FaFacebookMessenger className="me-2" />
              <a
                href="https://m.me/61577203287082"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nhắn tin qua Messenger
              </a>
            </p>

            {/* Chat box nhấn nút */}
            <div className="chat-box-demo mt-4">
              <strong>Hỗ trợ trực tuyến</strong>
              <p>Bạn cần hỗ trợ? Chat trực tiếp với nhân viên ngay!</p>
              <a
                href="https://zalo.me/0987654321"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success btn-sm me-2"
              >
                Chat Zalo
              </a>
              <a
                href="https://m.me/61577203287082"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                Chat Messenger
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
