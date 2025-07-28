import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";



const formatPrice = (price) => `${price.toLocaleString("vi-VN")} đ`;

const TopCategorySection = ({ categoryName }) => {
  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <span>Danh mục: {categoryName}</span>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {dummyItems.map((item) => (
          <div
            key={item.id}
            style={{ width: "19%", position: "relative" }}
            className="mb-4"
          >
            <div className="book-card position-relative">
              <FaHeart className="heart-icon" />
              <Link
                to="#"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="image-container">
                  <img
                    src={item.ImageUrl}
                    alt={item.Title}
                    className="book-image"
                  />
                </div>
                <h5 className="book-title">{item.Title}</h5>
              </Link>
              <p className="book-price">{formatPrice(item.Price)}</p>
              <p style={{ fontSize: "13px", color: "#555", marginBottom: "8px" }}>
                Kích thước: {item.PackagingSize}
              </p>
              <div className="button-group">
                <button className="btn btn-outline-primary btn-sm">
                  Giỏ thuê
                </button>
                <Link to="/rent-cart" className="btn btn-success btn-sm">
                  Thuê ngay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCategorySection;
