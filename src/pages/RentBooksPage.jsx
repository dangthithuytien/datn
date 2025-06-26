import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaAngleDown, FaHeart } from "react-icons/fa";
import { getAllRentBooks } from "../components/Service/rentBookService";
import "../components/style/rentbook.css";

const baseURL = "https://localhost:7003";

const RentBooksPage = () => {
  const [books, setBooks] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getAllRentBooks();
        setBooks(data);
      } catch (error) {
        console.error("Lỗi khi tải sách thuê:", error);
      }
    };

    fetchBooks();
  }, []);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "name") return a.Title.localeCompare(b.Title);
    if (sortBy === "price") return a.Price - b.Price;
    return 0;
  });

  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    if (existingCart.find((item) => item.id === (book.id || book.RentBookId))) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      id: book.id || book.RentBookId,
      title: book.Title,
      rentPrice: book.Price,
      image: `${baseURL}${book.ImageUrl}`,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    localStorage.setItem("rentCart", JSON.stringify([...existingCart, rentItem]));
    alert("✅ Đã thêm vào giỏ thuê!");
  };

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRentBooks")) || [];
    const isExist = favorites.some((item) => item.id === (book.id || book.RentBookId));
    if (!isExist) {
      favorites.push({
        id: book.id || book.RentBookId,
        title: book.Title,
        rentPrice: book.Price,
        image: `${baseURL}${book.ImageUrl}`,
      });
      localStorage.setItem("favoriteRentBooks", JSON.stringify(favorites));
      alert("❤️ Đã thêm vào yêu thích!");
    } else {
      alert("Sách đã có trong danh sách yêu thích.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Danh mục Sách thuê</span>
        <Link to="/rent-books/all" className="btn btn-link ms-2" style={{ textDecoration: "none", fontSize: "18px", color: "#007bff" }}>
          <FaAngleDown />
        </Link>
        <div className="ms-auto position-relative">
          <button className="btn btn-light filter-icon-btn" onClick={() => setShowFilter(!showFilter)} title="Lọc sách">
            <FaFilter />
          </button>
          {showFilter && (
            <div className="filter-dropdown shadow-sm">
              <div className={`filter-option ${sortBy === "name" ? "active" : ""}`} onClick={() => { setSortBy("name"); setShowFilter(false); }}>
                Lọc theo Tên
              </div>
              <div className={`filter-option ${sortBy === "price" ? "active" : ""}`} onClick={() => { setSortBy("price"); setShowFilter(false); }}>
                Lọc theo Giá
              </div>
            </div>
          )}
        </div>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {sortedBooks.slice(0, 10).map((book, index) => (
          <div key={index} style={{ width: "19%", position: "relative" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart className="heart-icon" onClick={() => handleAddToFavorites(book)} title="Thêm vào yêu thích" />
              <Link to={`/rent/${book.RentBookId}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="image-container">
                  <img src={`${baseURL}${book.ImageUrl}`} alt={book.Title} className="book-image" />
                </div>
                <h5 className="book-title">{book.Title}</h5>
              </Link>
              <p className="book-price">
                Thuê: {(book.Price || 0).toLocaleString("vi-VN")}đ/ngày
              </p>
              <div className="button-group">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleAddToRentCart(book)}>
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