import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "../style/css.css";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#319740",
        paddingLeft: "1cm",
        paddingRight: "1cm",
      }}
      className="pt-4"
    >
      <div className="container-xxl text-white">
        <div className="row">
          {/* Cột 1: Logo + thông tin */}
          <div className="col-md-3 mb-3 text-center text-md-start">
            <div
              className="footer-store-name fw-bold mb-2"
              style={{ fontSize: "1.2rem" }}
            >
              CHỢ SÁCH ONLINE
            </div>
            <p
              className="footer-col1-text mb-1"
              style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
            >
              <FaMapMarkerAlt className="me-2" /> M5 15 Thái Bình, P.19, TP.HCM
            </p>
            <p
              className="footer-col1-text mb-1"
              style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
            >
              <FaPhoneAlt className="me-2" /> 0965 163 855
            </p>
            <p
              className="footer-col1-text mb-1"
              style={{ fontSize: "0.9rem", lineHeight: "1.5" }}
            >
              <FaEnvelope className="me-2" /> csth@hexaclover.com
            </p>
          </div>

          {/* Cột 2: Dịch vụ */}
          <div className="col-md-3 mb-3 text-center text-md-start">
            <div
              className="footer-section-title fw-bold mb-3"
              style={{ fontSize: "1rem" }}
            >
              DỊCH VỤ
            </div>
            <ul
              className="list-unstyled mb-0"
              style={{ lineHeight: "1.5", fontSize: "0.9rem" }}
            >
              <li>
                <a href="/mua-sach" className="text-white text-decoration-none">
                  Mua sách
                </a>
              </li>
              <li>
                <a
                  href="/thue-sach"
                  className="text-white text-decoration-none"
                >
                  Thuê sách
                </a>
              </li>
              <li>
                <a
                  href="/giao-hang"
                  className="text-white text-decoration-none"
                >
                  Giao hàng nhanh
                </a>
              </li>
              <li>
                <a
                  href="/hoan-tien"
                  className="text-white text-decoration-none"
                >
                  Hoàn tiền
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="col-md-3 mb-3 text-center text-md-start">
            <div
              className="footer-section-title fw-bold mb-3"
              style={{ fontSize: "1rem" }}
            >
              HỖ TRỢ KHÁCH HÀNG
            </div>
            <ul
              className="list-unstyled mb-0"
              style={{ lineHeight: "1.5", fontSize: "0.9rem" }}
            >
              <li>
                <a href="/news" className="text-white text-decoration-none">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="/faq" className="text-white text-decoration-none">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="/policy" className="text-white text-decoration-none">
                  Chính sách đổi trả
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Theo dõi */}
          <div className="col-md-3 mb-3 text-center text-md-start">
            <div
              className="footer-section-title fw-bold mb-3"
              style={{ fontSize: "1rem" }}
            >
              THEO DÕI CHÚNG TÔI
            </div>
            <div className="d-flex gap-3 fs-4 justify-content-center justify-content-md-start">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <FaFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-3 border-white-50" />

        <div className="text-center small text-white-50">
          Hotline: 0965 163 855
        </div>
        <div className="text-center small text-white-50">
          © {new Date().getFullYear()} Cửa Hàng Sách Online. Đã đăng ký bản
          quyền.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
