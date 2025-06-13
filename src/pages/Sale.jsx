import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/sale.css";

const productsOnSale = [
  {
    id: 1,
    name: "Áo sơ mi nam",
    oldPrice: 500000,
    newPrice: 350000,
    image: "sach.jpg",
  },
  {
    id: 2,
    name: "Giày thể thao nữ",
    oldPrice: 1200000,
    newPrice: 900000,
    image: "sach.jpg",
  },
  {
    id: 3,
    name: "Balo thời trang",
    oldPrice: 800000,
    newPrice: 600000,
    image: "sach.jpg",
  },
  {
    id: 4,
    name: "Túi đeo chéo",
    oldPrice: 600000,
    newPrice: 450000,
    image: "sach.jpg",
  },
  {
    id: 5,
    name: "Áo khoác mùa đông",
    oldPrice: 1500000,
    newPrice: 1100000,
    image: "sach.jpg",
  },
  {
    id: 6,
    name: "Đồng hồ thời trang",
    oldPrice: 2000000,
    newPrice: 1500000,
    image: "sach.jpg",
  },
];

const calcDiscountPercent = (oldPrice, newPrice) =>
  Math.round(((oldPrice - newPrice) / oldPrice) * 100);

const Sale = () => {
  const navigate = useNavigate();
  const handleViewAllClick = () => navigate("/sale-all");

  return (
    <div className="flashsale-container">
      <div className="flashsale-header">
        <div className="flashsale-left">
          <h2 className="flashsale-title">Flash Sale</h2>
        </div>
        <div className="view-all-btn" onClick={handleViewAllClick}>
          Xem tất cả
        </div>
      </div>

      <div className="flashsale-products-list">
        {productsOnSale.map((product) => {
          const discountPercent = calcDiscountPercent(
            product.oldPrice,
            product.newPrice
          );
          return (
            <div key={product.id} className="flashsale-product-card">
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <div className="prices">
                <span className="old-price">
                  {product.oldPrice.toLocaleString()}₫
                </span>
                <span className="new-price">
                  {product.newPrice.toLocaleString()}₫
                </span>
              </div>
              <div className="discount-percent">-{discountPercent}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sale;
