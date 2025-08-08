import React, { useState, useEffect } from "react";
import { FaAngleDown, FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import { getAllCategories } from "../components/Service/categoriesService";
import { addToCartSale } from "../components/Service/cartService";
import FavoriteSaleBookService from "../components/Service/FavoriteSaleBookService";
import { tokenUtils } from "../components/Cookie/cookieUtils";
import "../components/style/allbook.css";
import { useNavigate } from "react-router-dom"; // thêm ở đầu file
import { useMyAlert } from "../components/MyAlertContext";

const AllBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(tokenUtils.getAccessToken());
  const { showAlert } = useMyAlert();
  const baseURL = "https://chosachonline-datn.onrender.com";
  const navigate = useNavigate();
  // Theo dõi token thay đổi
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = tokenUtils.getAccessToken();
      if (newToken !== accessToken) {
        setAccessToken(newToken);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // Lấy dữ liệu sách + danh mục + favorite
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [books, cats] = await Promise.all([
          getAllSaleBooks(),
          getAllCategories(),
        ]);
        setAllBooks(books);
        setCategories(cats);

        if (accessToken) {
          await loadFavorites();
        } else {
          setFavoriteIds([]);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  const loadFavorites = async () => {
    try {
      const favorites = await FavoriteSaleBookService.getFavorites();
      const ids = favorites.map((f) => String(f.SaleBookId));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách yêu thích:");
      setFavoriteIds([]);
    }
  };

  const handleToggleFavorite = async (book) => {
    if (!accessToken) {
      showAlert("❌ Vui lòng đăng nhập để yêu thích sách!", "error");
      return;
    }

    try {
      const bookIdStr = String(book.SaleBookId);
      const isFav = favoriteIds.includes(bookIdStr);

      if (isFav) {
        await FavoriteSaleBookService.removeFavorite(bookIdStr);
      } else {
        await FavoriteSaleBookService.addFavorite(bookIdStr);
}

      await loadFavorites();
    } catch (error) {
      console.error("❌ Lỗi khi xử lý yêu thích:", error);
      showAlert("Lỗi khi xử lý yêu thích!", "error");
    }
  };

  const isFavorite = (bookId) => favoriteIds.includes(String(bookId));

  const handleAddToCart = async (book) => {
    try {
      await addToCartSale(book.SaleBookId, 1);
      showAlert("✅ Đã thêm vào giỏ hàng!");
    } catch (err) {
      console.error("❌ Lỗi khi thêm vào giỏ hàng:", err);
      showAlert("Không thể thêm vào giỏ hàng.", "error");
    }
  };

  // =========== FILTER + SORT ===========
  const filteredBooks = allBooks
    .filter((book) => book.IsHidden === true)
    .filter((book) =>
      selectedCategory ? book.CategoryIds?.includes(selectedCategory) : true
    )
    .filter((book) => {
      const price = book.FinalPrice || book.Price;
      return price >= priceRange.min && price <= priceRange.max;
    });

  const sortedBooks = [...filteredBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortBy === "priceAsc") {
    sortedBooks.sort(
      (a, b) => (a.FinalPrice || a.Price) - (b.FinalPrice || b.Price)
    );
  } else if (sortBy === "priceDesc") {
    sortedBooks.sort(
      (a, b) => (b.FinalPrice || b.Price) - (a.FinalPrice || a.Price)
    );
  }
  const handleBuyNow = (book) => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      showAlert("Vui lòng đăng nhập để tiếp tục mua hàng.", "error");
      navigate("/login"); // Hoặc mở modal đăng nhập
      return;
    }

    const selectedProduct = {
      ProductId: book.SaleBookId,
      ProductName: book.Title,
      Quantity: 1,
      UnitPrice: book.FinalPrice || book.Price,
      ImageUrl: book.ImageUrl,
    };

    localStorage.setItem("cartBuy", JSON.stringify([selectedProduct]));
    localStorage.setItem(
      "checkoutTotal",
      JSON.stringify(book.FinalPrice || book.Price)
    );
    localStorage.setItem("isBuyNow", "true");
    navigate("/checkout");
  };

  const getRandomBooks = (books, count) => {
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const displayedBooks = getRandomBooks(sortedBooks, 8);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-3 mb-4">
          <h4 className="category-title">Danh mục sản phẩm</h4>
          <div
            className="category-list-wrapper"
            style={{ maxHeight: "630px", overflowY: "auto" }}
          >
            <ul className="list-group category-list">
              <li
                className={`list-group-item category-item ${
                  !selectedCategory ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                Tất cả
              </li>
{categories.map((cat) => (
                <li
                  key={cat.CategoryId}
                  className={`list-group-item category-item ${
                    selectedCategory === cat.CategoryId ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat.CategoryId)}
                >
                  {cat.CategoryName}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* DANH SÁCH SÁCH */}
        <div className="col-md-9">
          <h4 className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <span className="d-flex align-items-center">
              Danh mục Sách Bán{" "}
              <Link to="/books-page" className="ms-2 text-success">
                <FaAngleDown />
              </Link>
            </span>

            {/* Bộ lọc & sắp xếp */}
            <div className="d-flex gap-2" style={{ width: "300px" }}>
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="">-- Sắp xếp --</option>
                <option value="name">Tên A-Z</option>
                <option value="priceAsc">Giá tăng dần</option>
                <option value="priceDesc">Giá giảm dần</option>
              </select>

              <select
                className="form-select"
                onChange={(e) => {
                  const value = e.target.value;
                  switch (value) {
                    case "0-50":
                      setPriceRange({ min: 0, max: 50000 });
                      break;
                    case "50-100":
                      setPriceRange({ min: 50000, max: 100000 });
                      break;
                    case "100-200":
                      setPriceRange({ min: 100000, max: 200000 });
                      break;
                    case "200+":
                      setPriceRange({ min: 200000, max: Infinity });
                      break;
                    default:
                      setPriceRange({ min: 0, max: Infinity });
                  }
                }}
              >
                <option value="">-- Khoảng giá --</option>
                <option value="0-50">0 - 50.000đ</option>
                <option value="50-100">50.000đ - 100.000đ</option>
                <option value="100-200">100.000đ - 200.000đ</option>
                <option value="200+">Trên 200.000đ</option>
              </select>
            </div>
          </h4>

          {loading ? (
            <p>Đang tải sách...</p>
          ) : (
            <div className="row">
              {displayedBooks.map((book) => (
                <div key={book.SaleBookId} className="col-6 col-md-3 mb-4">
                  <div className="book-card position-relative">
                    {/* ❤️ ICON */}
{isFavorite(book.SaleBookId) ? (
                      <FaHeart
                        className="heart-icon"
                        style={{ color: "red" }}
                        onClick={() => handleToggleFavorite(book)}
                        title="Bỏ khỏi yêu thích"
                      />
                    ) : (
                      <FaRegHeart
                        className="heart-icon"
                        style={{ color: "#ccc" }}
                        onClick={() => handleToggleFavorite(book)}
                        title="Thêm vào yêu thích"
                      />
                    )}

                    <Link to={`/sale-book/${book.SaleBookId}`} state={{ book }}>
                      <div className="image-container">
                        <img
                          src={book.ImageUrl}
                          alt={book.Title}
                          className="book-image"
                        />
                      </div>
                      <h5 className="book-title">{book.Title}</h5>
                    </Link>

                    <p className="book-price">
                      {book.Price.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-muted" style={{ fontSize: "13px" }}>
                      Số lượng: {book.Quantity}
                    </p>

                    <div className="button-group">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleAddToCart(book)}
                      >
                        Giỏ hàng
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleBuyNow(book)}
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBook;