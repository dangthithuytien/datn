import React, { useState } from "react";
import { FaAngleDown, FaFilter, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import AllRent from "./AllRent";
import "../components/style/allbook.css";

const categories = [
  { name: "Tiểu thuyết" },
  { name: "Khoa học" },
  { name: "Lịch sử" },
  { name: "Tâm lý học" },
  { name: "Công nghệ" },
  { name: "Nấu ăn" },
  { name: "Thiếu nhi" },
  { name: "Y học" },
  { name: "Tôn giáo" }, { name: "Tiểu thuyết" },
  { name: "Khoa học" },
  { name: "Lịch sử" },
  { name: "Tâm lý học" },
  { name: "Công nghệ" },
  { name: "Nấu ăn" },
  { name: "Thiếu nhi" },
  { name: "Y học" },
  { name: "Tôn giáo" }
];

const allBooks = [
  {
    id: 1,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    category: "Tiểu thuyết",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
    description: "Cuốn tiểu thuyết này mở ra một thế giới đầy màu sắc..."
  },
  {
    id: 2,
    title: "Sách Khoa học 1",
    author: "Tác giả B",
    price: 140000,
    category: "Khoa học",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 3,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 4,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 5,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 6,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 7,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 8,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
  {
    id: 9,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s"
  },
];

const AllBook = () => {
  const [sortBy, setSortBy] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cartBuy")) || [];
    const index = cart.findIndex((item) => item.id === book.id);

    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cartBuy", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
  };

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const isExist = favorites.some((item) => item.id === book.id);
    if (!isExist) {
      favorites.push(book);
      localStorage.setItem("favoriteBooks", JSON.stringify(favorites));
      alert("Đã thêm vào yêu thích!");
    } else {
      alert("Sách đã có trong danh sách yêu thích.");
    }
  };

  const filteredBooks = selectedCategory
    ? allBooks.filter((book) => book.category === selectedCategory)
    : allBooks;

  const sortedBooks = [...filteredBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "price") {
    sortedBooks.sort((a, b) => a.price - b.price);
  }

  const displayedBooks = sortedBooks.slice(0, 8);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-md-3 mb-4">
          <h4 className="category-title">Danh mục sản phẩm</h4>
          <div className="category-list-wrapper">
            <ul className="list-group category-list">
              <li
                className={`list-group-item category-item ${!selectedCategory ? "active" : ""}`}
                onClick={() => setSelectedCategory(null)}
              >
                Tất cả
              </li>
              {categories.map((cat, idx) => (
                <li
                  key={idx}
                  className={`list-group-item category-item ${selectedCategory === cat.name ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-md-9">
          <h4 className="d-flex align-items-center">
            <span>Danh mục Sách Bán</span>
            {allBooks.length > 8 && (
              <Link
                to="/books-page"
                className="ms-2 text-success"
                title="Xem tất cả sách"
                style={{ fontSize: "1.2rem" }}
              >
                <FaAngleDown />
              </Link>
            )}
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

          <div className="row">
            {displayedBooks.map((book) => (
              <div key={book.id} className="col-6 col-md-3 mb-4">
                <div className="book-card position-relative">
                  <FaHeart
                    className="heart-icon"
                    onClick={() => handleAddToFavorites(book)}
                    title="Thêm vào yêu thích"
                  />
                  <Link to={`/book/${book.id}`} state={{ book }}>
                    <div className="image-container">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="book-image"
                      />
                    </div>
                    <h5 className="book-title">{book.title}</h5>
                  </Link>
                  <p className="book-price">
                    {book.price.toLocaleString()}đ
                  </p>
                  <div className="button-group">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleAddToCart(book)}
                    >
                      Giỏ hàng
                    </button>
                    <button className="btn btn-primary btn-sm">Mua ngay</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AllBook;
