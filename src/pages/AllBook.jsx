import React from "react";
import "../components/style/allbook.css"; // Đường dẫn CSS đúng

// Dữ liệu danh mục
const categories = [
  "Tiểu thuyết",
  "Khoa học",
  "Lịch sử",
  "Tâm lý học",
  "Công nghệ",
  "Nấu ăn",
];

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
];

const AllBook = () => {
  return (
    <div className="container mt-3">
      <div className="row">
        {/* Danh mục */}
        <div className="col-md-3 mb-4">
          <h4>Danh mục sản phẩm</h4>
          <ul className="list-group">
            {categories.map((cat, idx) => (
              <li key={idx} className="list-group-item">
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Hiển thị sách */}
        <div className="col-md-9">
          <h4>Tất cả sách</h4>
          <div className="row">
            {allBooks.map((book) => (
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
