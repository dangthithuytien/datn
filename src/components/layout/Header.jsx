import React, { useState, useRef } from "react";
import {
  FaBookOpen,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaPhoneAlt,
  FaBlog,
  FaTags,
  FaTruck,
  FaNewspaper,
  FaBox,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/css.css";

const Header = () => {
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [traCuuDropdownOpen, setTraCuuDropdownOpen] = useState(false);

  const accountTimeout = useRef(null);
  const categoryTimeout = useRef(null);
  const traCuuTimeout = useRef(null);

  const handleMouseEnter = (setOpen, timeoutRef) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = (setOpen, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

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
                <button className="btn btn-light">
                  <FaSearch />
                </button>
              </div>
            </div>
          </div>

          <div className="col-4 d-flex justify-content-end align-items-center gap-3">
            <div
              className="icon-text text-center position-relative"
              onMouseEnter={() => handleMouseEnter(setCategoryOpen, categoryTimeout)}
              onMouseLeave={() => handleMouseLeave(setCategoryOpen, categoryTimeout)}
              style={{ cursor: "pointer" }}
            >
              <FaTags />
              <div className="small-text">Danh mục</div>
              {categoryOpen && (
                <div className="category-dropdown">
                  <div className="category-column">
                    <h6>Thể loại</h6>
                    <ul>
                      <li><a href="#">Truyện ngắn</a></li>
                      <li><a href="#">Kỹ năng sống</a></li>
                      <li><a href="#">Tâm lý học</a></li>
                      <li><a href="#">Kinh doanh</a></li>
                    </ul>
                  </div>
                  <div className="category-column">
                    <h6>Tác giả</h6>
                    <ul>
                      <li><a href="#">Nguyễn Nhật Ánh</a></li>
                      <li><a href="#">Dale Carnegie</a></li>
                      <li><a href="#">Paulo Coelho</a></li>
                      <li><a href="#">Tony Buổi Sáng</a></li>
                    </ul>
                  </div>
                  <div className="category-column">
                    <h6>Nhà xuất bản</h6>
                    <ul>
                      <li><a href="#">NXB Kim Đồng</a></li>
                      <li><a href="#">NXB Trẻ</a></li>
                      <li><a href="#">NXB Văn Học</a></li>
                      <li><a href="#">NXB Tổng hợp TP.HCM</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div
              className="icon-text text-center position-relative tra-cuu-dropdown-toggle"
              onMouseEnter={() => handleMouseEnter(setTraCuuDropdownOpen, traCuuTimeout)}
              onMouseLeave={() => handleMouseLeave(setTraCuuDropdownOpen, traCuuTimeout)}
              style={{ cursor: "pointer" }}
            >
              <FaBookOpen />
              <div className="small-text">Tra cứu</div>
              {traCuuDropdownOpen && (
                <div className="tra-cuu-dropdown">
                  <div className="tra-cuu-column">
                    <h6>Sách</h6>
                    <ul>
                      <li><a href="/sach-moi">Sách mới</a></li>
                      <li><a href="/sach-ban-chay">Sách bán chạy</a></li>
                      <li><a href="/sach-khuyen-mai">Sách khuyến mãi</a></li>
                    </ul>
                  </div>
                  <div className="tra-cuu-column">
                    <h6>Đánh giá</h6>
                    <ul>
                      <li><a href="/danh-gia-cao">Đánh giá cao</a></li>
                      <li><a href="/danh-gia-moi">Đánh giá mới</a></li>
                    </ul>
                  </div>
                  <div className="tra-cuu-column">
                    <h6>Tác giả</h6>
                    <ul>
                      <li><a href="/tac-gia-noi-bat">Tác giả nổi bật</a></li>
                      <li><a href="/tac-gia-moi">Tác giả mới</a></li>
                    </ul>
                  </div>
                  <div className="tra-cuu-column">
                    <h6>Khuyến mãi</h6>
                    <ul>
                      <li><a href="/khuyen-mai-dac-biet">Đặc biệt</a></li>
                      <li><a href="/khuyen-mai-theo-tuan">Theo tuần</a></li>
                    </ul>
                  </div>
                  <div className="tra-cuu-column">
                    <h6>Dịch vụ</h6>
                    <ul>
                      <li><a href="/giao-hang">Giao hàng</a></li>
                      <li><a href="/doi-tra">Đổi trả</a></li>
                      <li><a href="/ho-tro">Hỗ trợ</a></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="icon-text text-center position-relative">
              <FaShoppingCart />
              <div className="small-text">Giỏ hàng</div>
              <span className="badge bg-danger cart-badge">0</span>
            </div>

            <div
              className="icon-text text-center position-relative account-dropdown-toggle"
              onMouseEnter={() => handleMouseEnter(setAccountDropdownOpen, accountTimeout)}
              onMouseLeave={() => handleMouseLeave(setAccountDropdownOpen, accountTimeout)}
              style={{ cursor: "pointer" }}
            >
              <FaUser />
              <div className="small-text">Tài khoản</div>
              {accountDropdownOpen && (
                <ul className="dropdown-menu dropdown-menu-custom show">
                  <li><a className="dropdown-item" href="/register">Đăng ký</a></li>
                  <li><a className="dropdown-item" href="/login">Đăng nhập</a></li>
                  <li><a className="dropdown-item" href="/user-profile">Thông tin cá nhân</a></li>
                  <li><a className="dropdown-item" href="/login">Đơn hàng của Bạn</a></li>
                  <li><hr className="dropdown-divider" /></li>
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

            <div className="icon-text text-center">
              <FaPhoneAlt />
              <div className="small-text">Liên hệ</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-secondary bg-opacity-10 py-1 border-top">
        <div className="container-xxl">
          <nav className="bottom-nav-grid">
            <a href="/" className="bottom-nav-link">
              <FaBookOpen />
              <span>Trang chủ</span>
            </a>
            <div className="bottom-nav-item">
              <FaNewspaper className="truck-icon" />
              <span>Tin Tức</span>
            </div>
            <div className="bottom-nav-item">
              <FaBox className="truck-icon" />
              <span>Sản Phẩm Đã Xem</span>
            </div>
            <div className="bottom-nav-item">
              <FaTruck className="truck-icon" />
              <span>Ship COD Toàn Quốc</span>
            </div>
            <div className="bottom-nav-item">
              <FaPhoneAlt />
              <span>0989 849 396</span>
            </div>
            <a href="/blog" className="bottom-nav-link">
              <FaBlog />
              <span>Blog</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
