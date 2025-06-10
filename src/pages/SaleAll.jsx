import React from "react";
import "../components/style/sale.css"; // Đường dẫn file CSS của bạn

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
    id: 44,
    name: "Balo thời trang",
    oldPrice: 800000,
    newPrice: 600000,
    image: "sach.jpg",
  },
  {
    id: 55,
    name: "Balo thời trang",
    oldPrice: 800000,
    newPrice: 600000,
    image: "sach.jpg",
  },
  {
    id: 66,
    name: "Balo thời trang",
    oldPrice: 800000,
    newPrice: 600000,
    image: "sach.jpg",
  },
  {
    id: 7,
    name: "Balo thời trang",
    oldPrice: 800000,
    newPrice: 600000,
    image: "sach.jpg",
  },
];

const calcDiscountPercent = (oldPrice, newPrice) =>
  Math.round(((oldPrice - newPrice) / oldPrice) * 100);

const SaleAll = () => {
  return (
    <div className="flashsale-container">
      <h2 className="flashsale-title">Tất cả sản phẩm giảm giá</h2>
      <div className="products-list">
        {productsOnSale.map((product) => {
          const discountPercent = calcDiscountPercent(
            product.oldPrice,
            product.newPrice
          );
          return (
            <div key={product.id} className="product-card">
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

export default SaleAll;
