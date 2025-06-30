import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaAngleDown, FaHeart } from "react-icons/fa";
import {
  getAllRentBooks,
  getAllRentBookItems,
} from "../components/Service/rentBookService";
import "../components/style/rentbook.css"; // Đảm bảo CSS của bạn vẫn ổn

const baseURL = "https://localhost:7003";

const RentBooksPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, itemsData] = await Promise.all([
          getAllRentBooks(),
          getAllRentBookItems(),
        ]);

        const booksMap = booksData.reduce((acc, book) => {
          acc[book.RentBookId] = book;
          return acc;
        }, {});

        const flattenedItems = itemsData.map((item) => {
          const parentBook = booksMap[item.RentBookId];
          const price = parentBook ? parentBook.Price : 0;

          return {
            ...item,
            Title: parentBook ? parentBook.Title : "Unknown Title",
            ImageUrl: parentBook ? parentBook.ImageUrl : "",
            Price: price,
            id: item.RentBookItemId,
          };
        });

        setDisplayItems(flattenedItems);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const sortedItems = [...displayItems].sort((a, b) => {
    if (sortBy === "name") return a.Title.localeCompare(b.Title);
    if (sortBy === "price") return (a.Price || 0) - (b.Price || 0);
    return 0;
  });

  // ĐÃ SỬA HÀM formatPrice: Chỉ dùng toLocaleString
  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) {
        return "N/A đ";
    }
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleAddToRentCart = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    if (existingCart.find((cartItem) => cartItem.id === item.id)) {
      alert("Mục sách này đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      id: item.id,
      title: item.Title,
      rentPrice: item.Price,
      image: `${baseURL}${item.ImageUrl}`,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      status: item.status,
      condition: item.Condition,
    };

    localStorage.setItem("rentCart", JSON.stringify([...existingCart, rentItem]));
    alert("✅ Đã thêm vào giỏ thuê!");
  };

  const handleAddToFavorites = (item) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteRentBooks")) || [];
    const isExist = favorites.some((favItem) => favItem.id === item.id);
    if (!isExist) {
      favorites.push({
        id: item.id,
        title: item.Title,
        rentPrice: item.Price,
        image: `${baseURL}${item.ImageUrl}`,
        status: item.status,
        condition: item.Condition,
      });
      localStorage.setItem("favoriteRentBooks", JSON.stringify(favorites));
      alert("❤️ Đã thêm vào yêu thích!");
    } else {
      alert("Mục sách này đã có trong danh sách yêu thích.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Danh mục Sách thuê</span>
        <Link
          to="/rent-books/all"
          className="btn btn-link ms-2"
          style={{ textDecoration: "none", fontSize: "18px", color: "#007bff" }}
        >
          <FaAngleDown />
        </Link>
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
        {sortedItems.slice(0, 10).map((item) => (
          <div key={item.id} style={{ width: "19%", position: "relative" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart className="heart-icon" onClick={() => handleAddToFavorites(item)} title="Thêm vào yêu thích" />
              <Link to={`/rent-item-details/${item.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="image-container">
                  <img src={`${baseURL}${item.ImageUrl}`} alt={item.Title} className="book-image" />
                </div>
                <h5 className="book-title">{item.Title}</h5>
              </Link>
              <p className="book-price">
                Thuê: {formatPrice(item.Price)}/ngày
              </p>
              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToRentCart(item)}
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