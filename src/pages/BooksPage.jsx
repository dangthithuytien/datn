import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/booksPage.css";

const mockBooks = [
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
  {
    id: 10,
    title: "Sách Tiểu thuyết 1",
    author: "Tác giả A",
    price: 120000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
];

const BooksPage = () => {
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const navigate = useNavigate(); // 👈 dùng để chuyển trang

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "1") setPriceRange([0, 100000]);
    else if (value === "2") setPriceRange([100000, 200000]);
    else if (value === "3") setPriceRange([200000, 1000000]);
    else setPriceRange([0, 1000000]);
  };

  const filteredBooks = mockBooks.filter((book) => {
    return (
      (category === "" || book.category === category) &&
      (author === "" ||
        book.author.toLowerCase().includes(author.toLowerCase())) &&
      (title === "" ||
        book.title.toLowerCase().includes(title.toLowerCase())) &&
      book.price >= priceRange[0] &&
      book.price <= priceRange[1]
    );
  });

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  return (
    <div className="container">
      <h2 className="section-title">Tất cả sách</h2>

      {/* Bộ lọc */}
      <div
        className="filter-buttons"
        style={{
          flexWrap: "wrap",
          gap: "12px",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <select
          className="filter-btn"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          <option value="Tiểu thuyết">Tiểu thuyết</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Kỹ năng">Kỹ năng</option>
          <option value="Thiếu nhi">Thiếu nhi</option>
        </select>

        <select className="filter-btn" onChange={handlePriceChange}>
          <option value="0">Tất cả giá</option>
          <option value="1">Dưới 100.000₫</option>
          <option value="2">100.000₫ - 200.000₫</option>
          <option value="3">Trên 200.000₫</option>
        </select>

        <input
          className="filter-btn"
          type="text"
          placeholder="Tên sách"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="filter-btn"
          type="text"
          placeholder="Tác giả"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      {/* Danh sách sách */}
      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p>Không tìm thấy sách phù hợp.</p>
        ) : (
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="book-card"
              onClick={() => handleBookClick(book)}
              style={{ cursor: "pointer" }}
            >
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-title">{book.title}</div>
              <div className="book-price">{book.price.toLocaleString()}₫</div>
              <div className="button-group">
                <button>Mua ngay</button>
                <button>Giỏ hàng</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BooksPage;
