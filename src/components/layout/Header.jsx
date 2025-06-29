import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen, FaSearch, FaShoppingCart, FaUser, FaBlog, FaTags,
  FaNewspaper, FaBox, FaHeart, FaCoins
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/css.css";
import ExchangePointsModal from "../../pages/ExchangePointsModal";
import { getAllCategories } from "../Service/categoriesService";

const Header = () => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi khi gọi API danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleMouseEnter = (setOpen) => setOpen(true);
  const handleMouseLeave = (setOpen) => setOpen(false);
  const toggleExchangeModal = () => setIsExchangeModalOpen(!isExchangeModalOpen);

  return (
    <header className="bg-light shadow-md">
      <div className="custom-container custom-bg-green text-white py-3 px-4" style={{ paddingInline: "2cm" }}>
        <div className="row align-items-center">
          <div className="col-3 d-flex align-items-center">
            <img src="/logodatn.png" alt="Logo" className="logo-img" style={{ maxHeight: "60px", width: "auto" }} />
          </div>

          <div className="col-5 d-flex align-items-center ps-4">
            <div className="d-flex align-items-stretch w-100">
              <div className="input-group ms-2 flex-grow-1">
                <input type="text" className="form-control" placeholder="Tìm kiếm..." />
                <button className="btn btn-light"><FaSearch /></button>
              </div>
            </div>
          </div>

          <div className="col-4 d-flex justify-content-end align-items-center gap-3">
            {/* === Danh mục === */}
            <div
              className="icon-text text-center position-relative"
              onMouseEnter={() => handleMouseEnter(setCategoryOpen)}
              onMouseLeave={() => handleMouseLeave(setCategoryOpen)}
              style={{ cursor: "pointer" }}
            >
              <FaTags />
              <div className="small-text">Danh mục</div>
              {categoryOpen && (
                <div className="category-dropdown">
                  <div className="category-column">
                    <h6>Danh sách danh mục</h6>
                    <ul>
                      {categories.map((cat) => (
                        <li key={cat.CategoryId}>
                          <Link to={`/category/${cat.CategoryId}`}>{cat.CategoryName}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* === Đổi điểm === */}
            <div className="icon-text text-center" onClick={toggleExchangeModal} style={{ cursor: "pointer" }}>
              <FaCoins style={{ color: "white" }} />
              <div className="small-text">Đổi điểm</div>
            </div>

            {/* === Giỏ hàng === */}
            <div
              className="icon-text text-center position-relative"
              onMouseEnter={() => handleMouseEnter(setCartDropdownOpen)}
              onMouseLeave={() => handleMouseLeave(setCartDropdownOpen)}
              style={{ cursor: "pointer" }}
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

            {/* === Tài khoản === */}
            <div
              className="icon-text text-center position-relative"
              onMouseEnter={() => handleMouseEnter(setAccountDropdownOpen)}
              onMouseLeave={() => handleMouseLeave(setAccountDropdownOpen)}
              style={{ cursor: "pointer" }}
            >
              <FaUser />
              <div className="small-text">Tài khoản</div>
              {accountDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-custom show p-0">
                  <li><Link className="dropdown-item" to="/register">Đăng ký</Link></li>
                  <li><Link className="dropdown-item" to="/login">Đăng nhập</Link></li>
                  <li><Link className="dropdown-item" to="/user-profile">Thông tin cá nhân</Link></li>
                  <li className="position-relative">
                    <div className="dropdown-item d-flex justify-content-between align-items-center"
                      onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}>
                      Đơn hàng của bạn <span>{orderDropdownOpen ? "▲" : "▼"}</span>
                    </div>
                    {orderDropdownOpen && (
                      <ul className="dropdown-submenu list-unstyled m-0">
                        <li><Link className="dropdown-item" to="/orders-all">Đơn hàng mua</Link></li>
                        <li><Link className="dropdown-item" to="/orders-rent">Đơn hàng thuê</Link></li>
                      </ul>
                    )}
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={() => {
                      alert("Đăng xuất thành công!");
                      setAccountDropdownOpen(false);
                    }}>Đăng xuất</button>
                  </li>
                </ul>
              )}
            </div>

            {/* === Yêu thích === */}
            <Link to="/favorite" className="icon-text text-center" style={{ textDecoration: "none", color: "inherit" }}>
              <FaHeart style={{ color: "white" }} />
              <div className="small-text">Yêu thích</div>
            </Link>
          </div>
        </div>
      </div>

      {/* === NAV BOTTOM === */}
      <div className="bg-secondary bg-opacity-10 py-1 border-top">
        <div className="container-xxl">
          <nav className="bottom-nav-grid">
            <a href="/" className="bottom-nav-link"><FaBookOpen /><span>Trang chủ</span></a>
            <a href="/news" className="bottom-nav-link"><FaNewspaper /><span>Tin Tức</span></a>
            <a href="/viewed-products" className="bottom-nav-link"><FaBox /><span>Đã Xem</span></a>
            <a href="/about" className="bottom-nav-link"><FaTags /><span>Giới Thiệu</span></a>
            <a href="/contact" className="bottom-nav-link"><FaBlog /><span>Blog</span></a>
          </nav>
        </div>
      </div>

      {/* === Modal đổi điểm === */}
      <ExchangePointsModal isOpen={isExchangeModalOpen} onClose={toggleExchangeModal} />
    </header>
  );
};

export default Header;
