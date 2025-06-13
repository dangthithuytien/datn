import React from "react";
import "../components/style/saleall.css";

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
  {
    id: 7,
    name: "Thắt lưng da",
    oldPrice: 400000,
    newPrice: 300000,
    image: "sach.jpg",
  },
];

const calcDiscountPercent = (oldPrice, newPrice) =>
  Math.round(((oldPrice - newPrice) / oldPrice) * 100);

const SaleAll = () => {
  const handleAddToCart = (product) => {
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleBuyNow = (product) => {
    alert(`Mua ngay: ${product.name}`);
  };

  return (
    <div className="saleall-container">
      <h2 className="saleall-title">Tất cả sản phẩm giảm giá</h2>
      <div className="saleall-products-grid">
        {productsOnSale.map((product) => {
          const discountPercent = calcDiscountPercent(
            product.oldPrice,
            product.newPrice
          );
          return (
            <div key={product.id} className="saleall-product-card">
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
              <div className="product-buttons">
                <button
                  className="btn-buy"
                  onClick={() => handleBuyNow(product)}
                >
                  Mua ngay
                </button>
                <button
                  className="btn-add"
                  onClick={() => handleAddToCart(product)}
                >
                  Giỏ hàng
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SaleAll;
