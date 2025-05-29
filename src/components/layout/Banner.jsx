import React, { useState, useEffect } from "react";
import "../style/banner.css";

const images = [
  "/Banner-HoiSachOnlineThang4-3-1200x628.jpg",
  "/90054AE20DD9E8EFE72C.webp",
  "/image-20250312161817395.png"
];

const Banner = () => {
  const [current, setCurrent] = useState(0);

  // Tự động chuyển ảnh mỗi 4 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Tính chỉ số ảnh bên trái và bên phải so với ảnh hiện tại
  const prevIndex = (current - 1 + images.length) % images.length;
  const nextIndex = (current + 1) % images.length;

  return (
    <div className="banner-container">
      {/* Ảnh bên trái */}
      <img
        src={images[prevIndex]}
        alt={`Banner ${prevIndex + 1}`}
        className="side-image left"
      />

      {/* Ảnh chính giữa */}
      <img
        src={images[current]}
        alt={`Banner ${current + 1}`}
        className="banner-image"
      />

      {/* Ảnh bên phải */}
      <img
        src={images[nextIndex]}
        alt={`Banner ${nextIndex + 1}`}
        className="side-image right"
      />
    </div>
  );
};

export default Banner;
