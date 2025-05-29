import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import "../components/style/allbook.css";

// Danh mục sản phẩm với danh mục con
const categories = [
  { name: "Tiểu thuyết" },
  {
    name: "Khoa học",
    subcategories: ["Nhân tạo", "Viễn tưởng", "Chiêm nghiệm"],
  },
  { name: "Lịch sử" },
  { name: "Tâm lý học" },
  { name: "Công nghệ" },
  { name: "Nấu ăn" },
];

// Dữ liệu sách mẫu
// Dữ liệu sách
const allBooks = [
  {
    id: 1,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 2,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 3,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 4,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 5,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 6,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 7,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 8,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 9,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 120000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
];
const AllBook = () => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState(""); // "" | "name" | "price"
  const [openCategory, setOpenCategory] = useState(null); // Danh mục đang mở

  // Clone và sắp xếp danh sách
  const sortedBooks = [...allBooks];
  if (sortBy === "name") {
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "price") {
    sortedBooks.sort((a, b) => a.price - b.price);
  }

  const displayedBooks = showAll ? sortedBooks : sortedBooks.slice(0, 8);

  return (
    <div className="container mt-3">
      <div className="row">
        {/* Danh mục */}
        <div className="col-md-3 mb-4">
          <h4>Danh mục sản phẩm</h4>
          <ul className="list-group">
            {categories.map((cat, idx) => {
              const hasSub = cat.subcategories && cat.subcategories.length > 0;
              const isOpen = openCategory === idx;

              return (
                <React.Fragment key={idx}>
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    onClick={() =>
                      hasSub && setOpenCategory(isOpen ? null : idx)
                    }
                    style={{ cursor: hasSub ? "pointer" : "default" }}
                  >
                    {cat.name}
                    {hasSub && (isOpen ? <FaAngleUp /> : <FaAngleDown />)}
                  </li>

                  {hasSub && isOpen && (
                    <ul className="list-group ms-3">
                      {cat.subcategories.map((sub, subIdx) => (
                        <li key={subIdx} className="list-group-item">
                          {sub}
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        {/* Hiển thị sách */}
        <div className="col-md-9">
          <h4 style={{ display: "flex", alignItems: "center" }}>
            <span>Tất cả sách</span>

            {allBooks.length > 8 && (
              <span
                style={{
                  cursor: "pointer",
                  color: "#28a745",
                  fontSize: "1.2rem",
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: 8,
                }}
                onClick={() => setShowAll(!showAll)}
                title={showAll ? "Thu gọn" : "Xem thêm"}
              >
                {showAll ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            )}

            {/* Bộ lọc */}
            <div className="filter-buttons ms-auto d-flex gap-2">
              <button
                className={`filter-btn ${sortBy === "name" ? "active" : ""}`}
                onClick={() => setSortBy("name")}
                title="Lọc theo tên"
              >
                Tên
              </button>
              <button
                className={`filter-btn ${sortBy === "price" ? "active" : ""}`}
                onClick={() => setSortBy("price")}
                title="Lọc theo giá"
              >
                Giá
              </button>
            </div>
          </h4>

          <div className="row">
            {displayedBooks.map((book) => (
              <div key={book.id} className="col-6 col-md-3 mb-4">
                <div className="book-card">
                  <div className="image-container">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="book-image"
                    />
                  </div>
                  <h5 className="book-title">{book.title}</h5>
                  <p className="book-price">{book.price.toLocaleString()}đ</p>
                  <div className="button-group">
                    <button className="btn btn-outline-primary btn-sm">
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
