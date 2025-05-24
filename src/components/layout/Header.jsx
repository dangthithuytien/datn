import React, { useState } from "react";
import {
  FaBookOpen,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaPhoneAlt,
  FaList,
  FaBlog,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/css.css";

const Header = () => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setAccountDropdownOpen(!accountDropdownOpen);
  };

  return (
    <header className="bg-light shadow-md">
      {/* Top header */}
      <div className="container-xxxl custom-bg-green text-white py-3">
        <div className="row align-items-center">
          {/* Logo */}
          <div className="col-2 d-flex align-items-center">
            <img
              src="/logodatn.png"
              alt="Logo"
              className="img-fluid logo-img"
            />
          </div>

          {/* Show All Icon + Search */}
          <div className="col-6 d-flex align-items-center ps-4">
            {/* Show All */}
            <button className="btn btn-light btn-show-all d-flex align-items-center">
              <FaList className="me-1" />
            </button>

            {/* Search */}
            <div className="input-group input-search">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
              />
              <button className="btn btn-light">
                <FaSearch />
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="col-2 d-flex justify-content-end align-items-center">
            <div className="icon-text">
              <FaBookOpen />
              <div className="small-text">Tra cứu</div>
            </div>
            <div className="icon-text position-relative">
              <FaShoppingCart />
              <div className="small-text">Giỏ hàng</div>
              <span className="badge bg-danger cart-badge">0</span>
            </div>

            {/* Tài khoản với dropdown */}
            <div
              className="icon-text account-dropdown-toggle"
              onClick={toggleDropdown}
            >
              <FaUser />
              <div className="small-text">Tài khoản</div>

              {accountDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-custom show">
                  <li>
                    <a className="dropdown-item" href="/register">
                      Đăng ký
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/login">
                      Đăng nhập
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/user-profile">
                      Thông tin cá nhân
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        alert("Đăng xuất thành công!");
                        setAccountDropdownOpen(false);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </div>

            <div className="icon-text">
              <FaPhoneAlt />
              <div className="small-text">Liên hệ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-secondary bg-opacity-10 py-1 border-top">
        <div className="container-xxl">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* Left nav */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <a href="/" className="bottom-nav-link">
                <FaBookOpen />
                <span>Trang chủ</span>
              </a>
              <a href="/categories" className="bottom-nav-link">
                <FaList />
                <span>DANH MỤC SÁCH</span>
              </a>
              <span className="px-2 py-1">Sản phẩm đã xem</span>
              <div className="d-flex align-items-center px-2 py-1">
                <img src="/truck.svg" alt="" className="truck-icon" />
                <span>Ship COD Toàn Quốc</span>
              </div>
              <div className="d-flex align-items-center px-2 py-1">
                <img src="/truck.svg" alt="" className="truck-icon" />
                <span>Free ship đơn hàng trên 300k</span>
              </div>
            </div>

            {/* Right nav */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center px-2 py-1">
                <FaPhoneAlt className="me-1" />
                <span>0989 849 396</span>
              </div>
              <div className="d-flex align-items-center px-2 py-1">
                <FaBlog className="me-1" />
                <span>Blog</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
