import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown, FaHeart, FaRegHeart } from "react-icons/fa";
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

const RentBooksPage = () => {
  const [displayItems, setDisplayItems] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [conditionRange, setConditionRange] = useState({ min: 0, max: 100 });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { showAlert } = useMyAlert();
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

          let imgUrl = parentBook?.ImageUrl || "";
          if (imgUrl && !imgUrl.startsWith("/")) imgUrl = "/" + imgUrl;

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
        await fetchFavorites();
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
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
      setFavoriteIds(res.map((item) => String(item.RentBookId)));
    } catch (err) {
      console.error("❌ Lỗi khi tải yêu thích:", err);
    }
  };

  const isFavorite = (rentBookId) => favoriteIds.includes(String(rentBookId));

  const toggleFavorite = async (item) => {
    const token = tokenUtils.getAccessToken();
    if (!token || tokenUtils.isTokenExpired(token)) {
      showAlert("❗ Bạn cần đăng nhập để yêu thích sách.", "error");
      return;
    }

    try {
      await FavoriteRentBookService.toggleFavorite(item.RentBookId);
      await fetchFavorites();
    } catch (error) {
      console.error("Lỗi toggle yêu thích:", error);
      showAlert("❌ Không thể cập nhật yêu thích.", "error");
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) return "N/A đ";
    return `${price.toLocaleString("vi-VN")} đ`;
  };

  const handleAddToRentCart = async (item) => {
    try {
      await addToRentCart(item.id);
      showAlert("✅ Đã thêm sách thuê vào giỏ!");
    } catch (error) {
      console.error("Lỗi thêm vào giỏ thuê:", error);
      showAlert("Sách đã được thuê", "error");
    }
  };

  // ==== Lọc theo tình trạng ====
  const filteredByCondition = displayItems.filter(
    (item) =>
      item.IsHidden === true &&
      item.status === "Available" &&
      item.Condition >= conditionRange.min &&
      item.Condition <= conditionRange.max
  );

  // ==== Sắp xếp ====
  const sortedItems = [...filteredByCondition].sort((a, b) => {
    if (sortBy === "name") return a.Title.localeCompare(b.Title);
    if (sortBy === "price") return (a.Price || 0) - (b.Price || 0);
    if (sortBy === "priceDesc") return (b.Price || 0) - (a.Price || 0);
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
            <option value="priceDesc">Giá thuê giảm dần</option>
          </select>

          <div className="d-flex align-items-center gap-2">
            <label htmlFor="minCondition" className="form-label mb-0">Tình trạng:</label>
            <input
              type="number"
              id="minCondition"
              className="form-control"
              style={{ width: "80px" }}
              placeholder="Từ"
              min={0}
              max={100}
              value={conditionRange.min}
              onChange={(e) =>
                setConditionRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }))
              }
            />
            <span>-</span>
            <input
              type="number"
              className="form-control"
              style={{ width: "80px" }}
              placeholder="Đến"
              min={0}
              max={100}
              value={conditionRange.max}
              onChange={(e) =>
                setConditionRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }))
              }
            />
          </div>

        </div>
      </h4>

      <div className="d-flex flex-wrap justify-content-between">
        {sortedItems.slice(0, 10).map((item) => (
          <div key={item.id} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              {/* ❤️ Toggle yêu thích */}
              {isFavorite(item.RentBookId) ? (
                <FaHeart
                  className="heart-icon active"
                  onClick={() => toggleFavorite(item)}
                  title="Bỏ khỏi yêu thích"
                />
              ) : (
                <FaRegHeart
                  className="heart-icon"
                  onClick={() => toggleFavorite(item)}
                  title="Thêm vào yêu thích"
                />
              )}

              <Link
                to={`/rent-item-details/${item.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="image-container">
                  <img
                    src={item.ImageUrl}
                    alt={item.Title}
                    className="book-image"
                  />
                </div>
                <h5 className="book-title">{item.Title}</h5>
              </Link>

              <p className="book-price">{formatPrice(item.Price)}</p>
              <p className="book-size">
                Tình trạng: {item.Condition}
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
