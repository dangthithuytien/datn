import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import "../components/style/rentbook.css";

const rentBooks = [
  {
    id: 101,
    title: "Sách Thuê - Lập trình React",
    author: "Tác giả X",
    rentPrice: 30000,
    image: "https://th.bing.com/th/id/OIP.YFcOB54Boqrk5K3pPwzI-QHaD4?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 102,
    title: "Sách Thuê - UX/UI Design",
    author: "Tác giả Y",
    rentPrice: 25000,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
  },
  {
    id: 103,
    title: "Sách Thuê - Kiến thức Startup",
    author: "Tác giả Z",
    rentPrice: 28000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 104,
    title: "Sách Thuê - Tư duy nhanh và chậm",
    author: "Daniel Kahneman",
    rentPrice: 35000,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
  {
    id: 105,
    title: "Sách Thuê - Marketing căn bản",
    author: "Tác giả A",
    rentPrice: 26000,
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136",
  },
  {
    id: 106,
    title: "Sách Thuê - Quản trị kinh doanh",
    author: "Tác giả B",
    rentPrice: 27000,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
  },
  {
    id: 107,
    title: "Sách Thuê - Kỹ năng mềm",
    author: "Tác giả C",
    rentPrice: 29000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 108,
    title: "Sách Thuê - Tài chính cá nhân",
    author: "Tác giả D",
    rentPrice: 32000,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
  {
    id: 109,
    title: "Sách Thuê - Machine Learning",
    author: "Tác giả E",
    rentPrice: 40000,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk9otPCKjvW8rFR1OfL0yiP90EWj2aCcEh0w&s",
  },
  {
    id: 110,
    title: "Sách Thuê - Deep Work",
    author: "Cal Newport",
    rentPrice: 30000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
];

const RentBooksPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // Sắp xếp sách
  const sortedBooks = [...rentBooks];
  if (sortBy === "name") sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "price") sortedBooks.sort((a, b) => a.rentPrice - b.rentPrice);

  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    const alreadyExists = existingCart.find((item) => item.id === book.id);
    if (alreadyExists) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const rentItem = {
      ...book,
      rentDate: today.toISOString().split("T")[0],
      returnDate: threeDaysLater.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    const newCart = [...existingCart, rentItem];
    localStorage.setItem("rentCart", JSON.stringify(newCart));
    alert("Đã thêm sách vào giỏ thuê!");
  };

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Tất cả sách thuê</span>
        <div className="ms-auto position-relative">
          <button
            className="btn btn-light filter-icon-btn"
            onClick={() => setShowFilter(!showFilter)}
            title="Lọc sách"
          >
            <FaFilter />
          </button>
          {showFilter && (
            <div className="filter-dropdown shadow-sm">
              <div
                className={`filter-option ${sortBy === "name" ? "active" : ""}`}
                onClick={() => {
                  setSortBy("name");
                  setShowFilter(false);
                }}
              >
                Lọc theo Tên
              </div>
              <div
                className={`filter-option ${sortBy === "price" ? "active" : ""}`}
                onClick={() => {
                  setSortBy("price");
                  setShowFilter(false);
                }}
              >
                Lọc theo Giá
              </div>
            </div>
          )}
        </div>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {sortedBooks.map((book) => (
          <div key={book.id} style={{ width: "19%" }} className="mb-4">
            <div className="book-card">
              <div className="image-container">
                <img src={book.image} alt={book.title} className="book-image" />
              </div>
              <h5 className="book-title">{book.title}</h5>
              <p className="book-price">
                Thuê: {book.rentPrice.toLocaleString()}đ
              </p>
              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToRentCart(book)}
                >
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

export default RentBooksPage;
