import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/style/booksPage.css"; // Dùng chung CSS với BooksPage

const mockRentBooks = [
  {
    id: 101,
    title: "Sách Thuê - Lập trình React",
    author: "Tác giả X",
    rentPrice: 30000,
    image: "https://th.bing.com/th/id/OIP.YFcOB54Boqrk5K3pPwzI-QHaD4?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 102,
    title: "Sách Thuê - UX/UI Design",
    author: "Tác giả Y",
    rentPrice: 25000,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
  },
  {
    id: 103,
    title: "Sách Thuê - Kiến thức Startup",
    author: "Tác giả Z",
    rentPrice: 28000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 104,
    title: "Sách Thuê - Tư duy nhanh và chậm",
    author: "Daniel Kahneman",
    rentPrice: 35000,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  },
];

const RentBookPage = () => {
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const navigate = useNavigate();

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "1") setPriceRange([0, 40000]);
    else if (value === "2") setPriceRange([40000, 70000]);
    else if (value === "3") setPriceRange([70000, 1000000]);
    else setPriceRange([0, 1000000]);
  };

  const filteredBooks = mockRentBooks.filter((book) => {
    return (
      (category === "" || book.category === category) &&
      (author === "" || book.author.toLowerCase().includes(author.toLowerCase())) &&
      (title === "" || book.title.toLowerCase().includes(title.toLowerCase())) &&
      book.rentPrice >= priceRange[0] &&
      book.rentPrice <= priceRange[1]
    );
  });

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  return (
    <div className="container">
      <h2 className="section-title">Thuê sách</h2>

      {/* Bộ lọc */}
      <div className="filter-buttons" style={{ flexWrap: "wrap", gap: "12px" }}>
        <select className="filter-btn" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          <option value="Tiểu thuyết">Tiểu thuyết</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Kỹ năng">Kỹ năng</option>
          <option value="Thiếu nhi">Thiếu nhi</option>
        </select>

        <select className="filter-btn" onChange={handlePriceChange}>
          <option value="0">Tất cả giá</option>
          <option value="1">Dưới 40.000₫</option>
          <option value="2">40.000₫ - 70.000₫</option>
          <option value="3">Trên 70.000₫</option>
        </select>

        <input className="filter-btn" type="text" placeholder="Tên sách" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="filter-btn" type="text" placeholder="Tác giả" value={author} onChange={(e) => setAuthor(e.target.value)} />
      </div>

      {/* Danh sách sách thuê */}
      <div className="book-list">
        {filteredBooks.length === 0 ? (
          <p>Không tìm thấy sách phù hợp.</p>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book)} style={{ cursor: "pointer" }}>
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-title">{book.title}</div>
              <div className="book-price">{book.rentPrice.toLocaleString()}₫</div>
              <div className="button-group">
                <button>Thuê ngay</button>
                <button>Giỏ hàng</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RentBookPage;
