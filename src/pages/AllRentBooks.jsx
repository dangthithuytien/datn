import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import {
  getAllRentBooks,
  getAllRentBookItems,
} from "../components/Service/rentBookService";
import { addToRentCart } from "../components/Service/CartRentService";
import FavoriteRentBookService from "../components/Service/FavoriteRentBookService";
import { tokenUtils } from "../components/Cookie/cookieUtils";
import "../components/style/rentbook.css";
import { useMyAlert } from "../components/MyAlertContext";
const baseURL = "https://chosachonline-datn.onrender.com";

const AllRentBooks = () => {
  const [items, setItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [conditionRange, setConditionRange] = useState({ min: 0, max: 100 });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { showAlert } = useMyAlert();
  const booksPerPage = 15;
  const navigate = useNavigate();

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
          const parent = booksMap[item.RentBookId];
          const price = parent ? parent.Price  : 0;
          return {
            ...item,
            Title: parent?.Title || "Unknown",
            ImageUrl: parent?.ImageUrl || "",
            Price: price,
            PackagingSize: parent?.PackagingSize || "Không rõ",
          };
        });

        setItems(flattenedItems);
        await fetchFavorites();
      } catch (error) {
        console.error("❌ Lỗi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const fetchFavorites = async () => {
    try {
      const token = tokenUtils.getAccessToken();
      if (!token || tokenUtils.isTokenExpired(token)) {
        setFavoriteIds([]);
        return;
      }
      const res = await FavoriteRentBookService.getAll();
      setFavoriteIds(res.map((f) => String(f.RentBookId)));
    } catch (err) {
      console.error("❌ Lỗi yêu thích:", err);
    }
  };

  const handleAddToFavorites = async (item) => {
    const token = tokenUtils.getAccessToken();
    if (!token || tokenUtils.isTokenExpired(token)) {
      showAlert("Vui lòng đăng nhập để yêu thích!","error");
      return;
    }

    try {
      await FavoriteRentBookService.toggleFavorite(item.RentBookId);
      await fetchFavorites();
    } catch (err) {
      console.error("Lỗi yêu thích:", err);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addToRentCart(item.RentBookItemId);
      showAlert("Đã thêm vào giỏ thuê!");
    } catch (err) {
      showAlert("Sách đã được thuê","warning");
    }
  };

  // ==== Lọc và sắp xếp ====
  const filtered = items.filter(
    (i) =>
      i.IsHidden === true &&
    i.status === "Available" && 
      i.Condition >= conditionRange.min &&
      i.Condition <= conditionRange.max
  );

  const sorted = [...filtered];
  if (sortBy === "name") sorted.sort((a, b) => a.Title.localeCompare(b.Title));
  else if (sortBy === "priceAsc") sorted.sort((a, b) => a.Price - b.Price);
  else if (sortBy === "priceDesc") sorted.sort((a, b) => b.Price - a.Price);

  const indexOfLast = currentPage * booksPerPage;
  const indexOfFirst = indexOfLast - booksPerPage;
  const currentItems = sorted.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sorted.length / booksPerPage);
  const placeholders = (5 - (currentItems.length % 5)) % 5;

  return (
    <div className="container mt-4">
      <h4 className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <span>Tất cả sách thuê</span>
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">-- Sắp xếp --</option>
            <option value="name">Tên A-Z</option>
            <option value="priceAsc">Giá thuê tăng dần</option>
            <option value="priceDesc">Giá thuê giảm dần</option>
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
              setCurrentPage(1);
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
        {currentItems.map((item) => (
          <div key={item.RentBookItemId} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${favoriteIds.includes(String(item.RentBookId)) ? "active" : ""}`}
                onClick={() => handleAddToFavorites(item)}
                title="Yêu thích"
              />
              <div onClick={() => navigate(`/rent-item-details/${item.RentBookItemId}`)} style={{ cursor: "pointer" }}>
                <img
                  src={item.ImageUrl}
                  alt={item.Title}
                  className="book-image"
                />
                <div className="book-title">{item.Title}</div>
                <div className="book-price">{item.Price.toLocaleString("vi-VN")}₫</div>
                <p className="book-size">
                Tình trạng: {item.Condition}
              </p>
              </div>
              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToCart(item)}
                >
                  Giỏ thuê
                </button>
             
              </div>
            </div>
          </div>
        ))}

        {Array.from({ length: placeholders }).map((_, idx) => (
          <div key={`placeholder-${idx}`} style={{ width: "19%" }} className="mb-4 invisible">
            <div className="book-card" />
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                &laquo;
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AllRentBooks;