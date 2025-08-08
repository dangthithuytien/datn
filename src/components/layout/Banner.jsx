import React, { useState, useEffect } from "react";
import apiClient from "../Service/AxiosConfig";
import "../style/banner.css";

const Banner = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await apiClient.get("/Slide");
        setSlides(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu banner:", error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  if (slides.length === 0) {
    return <div className="text-center py-5">Đang tải banner...</div>;
  }

  const prevIndex = (current - 1 + slides.length) % slides.length;
  const nextIndex = (current + 1) % slides.length;

  const getImageUrl = (path) => `${path}`;

  // Điều hướng thủ công
  const goToPrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="banner-wrapper">
      <button className="nav-button left" onClick={goToPrev}>❮</button>

      <div className="banner-container">
        {/* Ảnh bên trái */}
        <a href={slides[prevIndex].LinkUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={getImageUrl(slides[prevIndex].imageUrl || slides[prevIndex].ImageUrl)}
            alt={`Slide ${prevIndex + 1}`}
            className="side-image left"
          />
        </a>

        {/* Ảnh chính giữa */}
        <a href={slides[current].LinkUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={getImageUrl(slides[current].imageUrl || slides[current].ImageUrl)}
            alt={`Slide ${current + 1}`}
            className="banner-image"
          />
        </a>

        {/* Ảnh bên phải */}
        <a href={slides[nextIndex].LinkUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={getImageUrl(slides[nextIndex].imageUrl || slides[nextIndex].ImageUrl)}
            alt={`Slide ${nextIndex + 1}`}
            className="side-image right"
          />
        </a>
      </div>

      <button className="nav-button right" onClick={goToNext}>❯</button>
    </div>
  );
};

export default Banner;
