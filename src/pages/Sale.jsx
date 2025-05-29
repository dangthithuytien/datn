import React, { useState, useEffect } from "react";
import "../components/style/sale.css"; // Đường dẫn đúng đến file CSS của bạn

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

const Sale = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 giờ
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Chuyển đổi giây thành chuỗi 6 số (hhmmss)
  const formatTimeDigits = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return h + m + s;
  };

  // Dùng để render timer: chèn dấu ':' giữa các số giờ, phút, giây
  const renderTimer = () => {
    const digits = formatTimeDigits(timeLeft).split("");
    return (
      <>
        <span>{digits[0]}</span>
        <span>{digits[1]}</span>
        <span className="colon">:</span>
        <span>{digits[2]}</span>
        <span>{digits[3]}</span>
        <span className="colon">:</span>
        <span>{digits[4]}</span>
        <span>{digits[5]}</span>
      </>
    );
  };

  const productsToShow = showAll ? productsOnSale : productsOnSale.slice(0, 5);

  return (
    <div className="flashsale-container">
      <div className="flashsale-header">
        <div className="flashsale-left">
          <h2 className="flashsale-title">Flash Sale</h2>
          <div className="timer">{renderTimer()}</div>
        </div>

        <div
          className="view-all-btn"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Thu gọn" : "Xem tất cả"}
        </div>
      </div>

      <div className="products-list">
        {productsToShow.map((product) => {
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

export default Sale;
