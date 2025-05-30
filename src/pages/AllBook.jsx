import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../components/style/allbook.css";

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

const allBooks = [
  {
    id: 1,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 150000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
    description:
      "Cuốn tiểu thuyết này mở ra một thế giới đầy màu sắc với những câu chuyện phong phú về cuộc sống, tình yêu và số phận con người. Nhân vật chính trải qua nhiều thử thách cam go, từ những mất mát đến những niềm vui bất ngờ, khiến người đọc không thể rời mắt khỏi từng trang sách. Tác giả khéo léo xây dựng các tình tiết và cảnh vật sống động, phản ánh sâu sắc các giá trị đạo đức và những khía cạnh tâm lý phức tạp của con người.",
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
  const [sortBy, setSortBy] = useState("");
  const [openCategory, setOpenCategory] = useState(null);

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

        {/* Danh sách sách */}
        <div className="col-md-9">
          <h4 className="d-flex align-items-center">
            <span>Tất cả sách</span>

            {allBooks.length > 8 && (
              <span
                onClick={() => setShowAll(!showAll)}
                title={showAll ? "Thu gọn" : "Xem thêm"}
                className="ms-2 text-success"
                style={{ cursor: "pointer", fontSize: "1.2rem" }}
              >
                {showAll ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            )}

            <div className="ms-auto d-flex gap-2">
              <button
                className={`filter-btn ${sortBy === "name" ? "active" : ""}`}
                onClick={() => setSortBy("name")}
              >
                Tên
              </button>
              <button
                className={`filter-btn ${sortBy === "price" ? "active" : ""}`}
                onClick={() => setSortBy("price")}
              >
                Giá
              </button>
            </div>
          </h4>

          <div className="row">
            {displayedBooks.map((book) => (
              <div key={book.id} className="col-6 col-md-3 mb-4">
                <div className="book-card">
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
