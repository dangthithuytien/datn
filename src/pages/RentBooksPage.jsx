import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown, FaHeart } from "react-icons/fa";
import {
  getAllRentBooks,
  getAllRentBookItems,
} from "../components/Service/rentBookService";
import "../components/style/rentbook.css";
import { addToRentCart } from "../components/Service/CartRentService";

const baseURL = "https://localhost:7003";

const RentBooksPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [conditionRange, setConditionRange] = useState({ min: 0, max: 100 });

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
          const price = parentBook ? parentBook.Price * 1000 : 0;

          return {
            ...item,
            Title: parentBook?.Title || "Unknown Title",
            ImageUrl: parentBook?.ImageUrl || "",
            Price: price,
            id: item.RentBookItemId,
            PackagingSize: parentBook?.PackagingSize || "Không rõ",
          };
        });

        setDisplayItems(flattenedItems);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A đ";
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleAddToRentCart = async (item) => {
    try {
      await addToRentCart(item.id);
      alert("✅ Đã thêm sách thuê vào giỏ!");
    } catch (error) {
      console.error("Lỗi thêm vào giỏ thuê:", error);
      alert("❌ Không thể thêm sách vào giỏ thuê.");
    }
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

  // ==== Lọc theo tình trạng ====
  const filteredByCondition = displayItems.filter(
    (item) =>
      item.IsHidden === true &&
      item.Condition >= conditionRange.min &&
      item.Condition <= conditionRange.max
  );

  // ==== Sắp xếp ====
  const sortedItems = [...filteredByCondition].sort((a, b) => {
    if (sortBy === "name") return a.Title.localeCompare(b.Title);
    if (sortBy === "price") return (a.Price || 0) - (b.Price || 0);
    if (sortBy === "priceDesc") return (b.Price || 0) - (a.Price || 0); // ✅ Thêm dòng này
    return 0;
  });

  return (
    <div className="container mt-4">
      <h4 className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div className="d-flex align-items-center">
          <span>Danh mục Sách thuê</span>
          <Link
            to="/rent-books/all"
            className="btn btn-link ms-2"
            style={{ textDecoration: "none", fontSize: "18px", color: "#007bff" }}
          >
            <FaAngleDown />
          </Link>
        </div>

        {/* Dropdown lọc */}
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">-- Sắp xếp --</option>
            <option value="name">Tên A-Z</option>
            <option value="price">Giá thuê tăng dần</option>
             <option value="priceDesc">Giá thuê giảm dần</option> {/* ✅ Thêm dòng này */}
          </select>

          <select
            className="form-select"
            onChange={(e) => {
              const value = e.target.value;
              switch (value) {
                case "80-90":
                  setConditionRange({ min: 80, max: 90 });
                  break;
                case "91-95":
                  setConditionRange({ min: 91, max: 95 });
                  break;
                case "96-100":
                  setConditionRange({ min: 96, max: 100 });
                  break;
                default:
                  setConditionRange({ min: 0, max: 100 });
              }
            }}
          >
            <option value="">-- Tình trạng sách --</option>
            <option value="80-90">80% - 90%</option>
            <option value="91-95">91% - 95%</option>
            <option value="96-100">96% - 100%</option>
          </select>
        </div>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {sortedItems.slice(0, 10).map((item) => (
          <div key={item.id} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart
                className="heart-icon"
                onClick={() => handleAddToFavorites(item)}
                title="Thêm vào yêu thích"
              />
              <Link
                to={`/rent-item-details/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="image-container">
                  <img
                    src={`${baseURL}${item.ImageUrl}`}
                    alt={item.Title}
                    className="book-image"
                  />
                </div>
                <h5 className="book-title">{item.Title}</h5>
              </Link>
              <p className="book-price">{formatPrice(item.Price)}</p>
              <p className="book-size">Kích thước: {item.PackagingSize}</p>
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

        {/* Placeholder giữ chỗ nếu < 10 quyển */}
        {Array.from({ length: 10 - sortedItems.slice(0, 10).length }).map((_, idx) => (
          <div
            key={`placeholder-${idx}`}
            style={{ width: "19%", visibility: "hidden" }}
            className="mb-4"
          >
            <div className="book-card"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentBooksPage;
