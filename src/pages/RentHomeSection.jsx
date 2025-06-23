// RentHomeSection.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../components/style/rentbook.css";
import { FaArrowRight } from "react-icons/fa";

const RentHomeSection = ({ books }) => {
  const top8Books = books.slice(0, 8);

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span className="fw-bold">Sách thuê</span>
        <Link to="/rent-books" className="ms-auto text-success d-flex align-items-center text-decoration-none">
          <span>Xem tất cả</span>
          <FaArrowRight className="ms-1" />
        </Link>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {top8Books.map((book) => (
          <div key={book.id} style={{ width: "19%" }} className="mb-4">
            <div className="book-card">
              <div className="image-container">
                <img src={book.image} alt={book.title} className="book-image" />
              </div>
              <h5 className="book-title">{book.title}</h5>
              <p className="book-price">Thuê: {book.rentPrice.toLocaleString()}đ</p>
              <div className="button-group">
                <button className="btn btn-outline-primary btn-sm" onClick={() => alert("Giỏ thuê")}>Giỏ thuê</button>
                <Link to="/rent-cart" className="btn btn-success btn-sm">Thuê ngay</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentHomeSection;
