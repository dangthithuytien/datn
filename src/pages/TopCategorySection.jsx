import React from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const baseURL = "https://via.placeholder.com/200";

// Dữ liệu giả
const dummyItems = [
  { id: 1, Title: "Sách A", ImageUrl: baseURL, Price: 75000, PackagingSize: "20x13 cm" },
  { id: 2, Title: "Sách B", ImageUrl: baseURL, Price: 90000, PackagingSize: "18x12 cm" },
  { id: 3, Title: "Sách C", ImageUrl: baseURL, Price: 120000, PackagingSize: "22x14 cm" },
  { id: 4, Title: "Sách D", ImageUrl: baseURL, Price: 50000, PackagingSize: "19x13 cm" },
  { id: 5, Title: "Sách E", ImageUrl: baseURL, Price: 65000, PackagingSize: "21x15 cm" },
];

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
