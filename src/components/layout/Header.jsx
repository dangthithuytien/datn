import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen, FaSearch, FaShoppingCart, FaUser, FaBlog,
  FaNewspaper, FaHeart, FaCoins, FaTags
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/css.css";
import ExchangePointsModal from "../../pages/ExchangePointsModal";
import { tokenUtils } from "../Cookie/cookieUtils";
import { cookieUtils } from "../Cookie/cookieUtils";
import SearchBar from "../../pages/SearchBar"
import { useMyAlert } from "../MyAlertContext";
const Header = () => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { showAlert } = useMyAlert();
  useEffect(() => {
    setIsLoggedIn(!!tokenUtils.getAccessToken());
  }, [accountDropdownOpen]);

  const handleMouseEnter = (setOpen) => setOpen(true);
  const handleMouseLeave = (setOpen) => setOpen(false);
  const toggleExchangeModal = () => setIsExchangeModalOpen(!isExchangeModalOpen);
  const handleLogout = () => {
    tokenUtils.removeAccessToken();
    cookieUtils.deleteCookie("refreshToken");
    showAlert("Đăng xuất thành công!");
    setAccountDropdownOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="bg-light shadow-md">
      <div className="custom-container custom-bg-green text-white py-3 px-4">

        <div className="row align-items-center">
          <div className="col-3 d-flex align-items-center">
            <Link to="/">
              <img src="/logo.png" alt="Logo" className="logo-img" />
            </Link>
          </div>


          <div className="col-5 d-flex align-items-center ps-4">
            <SearchBar />
          </div>

          <div className="col-4 d-flex justify-content-end align-items-center gap-3">
            <div className="icon-text text-center" title="Đổi điểm" onClick={toggleExchangeModal}>
              <FaCoins />
              <div className="small-text">Đổi điểm</div>
            </div>

            <div
              className="icon-text text-center position-relative"
              onMouseEnter={() => handleMouseEnter(setCartDropdownOpen)}
              onMouseLeave={() => handleMouseLeave(setCartDropdownOpen)}
            >
              <FaShoppingCart />
              <div className="small-text">Giỏ hàng</div>
              {cartDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-custom show text-start">
                  <Link to="/cart" className="dropdown-item">🛒 Giỏ hàng mua sách</Link>
                  <Link to="/rent-cart" className="dropdown-item">📚 Giỏ hàng thuê sách</Link>
                </div>
              )}
            </div>

            <div
              className="position-relative"
              onMouseEnter={() => handleMouseEnter(setAccountDropdownOpen)}
              onMouseLeave={() => handleMouseLeave(setAccountDropdownOpen)}
            >
              <div className="icon-text text-center">
                <FaUser />
                <div className="small-text">Tài khoản</div>
              </div>

              {accountDropdownOpen && (
                <div className="dropdown-menu dropdown-menu-custom show text-start">
                  {!isLoggedIn ? (
                    <>
                      <Link className="dropdown-item" to="/register">Đăng ký</Link>
                      <Link className="dropdown-item" to="/login">Đăng nhập</Link>
                    </>
                  ) : (
                    <>
                      <Link className="dropdown-item" to="/user-profile">👤 Thông tin cá nhân</Link>
                      <div
                        className="dropdown-item d-flex justify-content-between align-items-center"
                        onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}
                      >
                        🧾 Đơn hàng <span>{orderDropdownOpen ? "▲" : "▼"}</span>
                      </div>
                      {orderDropdownOpen && (
                        <div className="ps-3 pe-2">
                          <Link className="dropdown-item" to="/orders-all">🛍 Đơn hàng mua</Link>
                          <Link className="dropdown-item" to="/orders-rent">📚 Đơn hàng thuê</Link>
                        </div>
                      )}
                      <hr className="dropdown-divider" />
                      <button className="dropdown-item" onClick={handleLogout}>🚪 Đăng xuất</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/favorite"
              className="icon-text text-center"
              style={{ textDecoration: "none" }}
            >
              <FaHeart />
              <div className="small-text">Yêu thích</div>
            </Link>

          </div>
        </div>
      </div>

      <div className="container-xxl rounded-bottom-nav">
        <nav className="bottom-nav-grid">
          <Link to="/" className="bottom-nav-link"><FaBookOpen /><span>Trang chủ</span></Link>
          <Link to="/news" className="bottom-nav-link"><FaNewspaper /><span>Tin Tức</span></Link>
          <Link to="/about" className="bottom-nav-link"><FaTags /><span>Giới Thiệu</span></Link>
          <Link to="/contact" className="bottom-nav-link"><FaBlog /><span>Blog</span></Link>
        </nav>
      </div>


      <ExchangePointsModal isOpen={isExchangeModalOpen} onClose={toggleExchangeModal} />
    </header>
  );
};

export default Header;
