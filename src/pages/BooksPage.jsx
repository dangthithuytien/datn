import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaFilter } from "react-icons/fa";
import "../components/style/booksPage.css";

const mockBooks = [
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
    image: "https://i.pinimg.com/originals/5b/af/f3/5baff3a874af2020544b306e34b5b269.jpg"
  },
  {
    id: 3,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://i.pinimg.com/236x/79/e3/f3/79e3f32c79474c41b7588b7247806dbb--wattpad.jpg"
  },
  {
    id: 4,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://lh3.googleusercontent.com/proxy/dshHw9mkAy2iyn9begIzj-4mZjcctNlOQ9QZdvO5pHZGuPWrWUVyPXjoASVBw1xVaPDfOzaviJGtqxNlc-A"
  },
  {
    id: 5,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://vnkings.com/wp-content/uploads/2016/05/hiu4a.png"
  },
  {
    id: 6,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://nukaly11.files.wordpress.com/2020/09/lam-tinh-yeu-nhieu-hon-han.jpg?w=940"
  },
  {
    id: 7,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://cn-e-pic.itoon.org/cartoon-posters/886172437d.webp"
  },
  {
    id: 8,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://cn-e-pic.itoon.org/cartoon-posters/1421672a15.webp"
  },
  {
    id: 9,
    title: "Sách Lịch sử 1",
    author: "Tác giả C",
    price: 160000,
    category: "Lịch sử",
    image: "https://i.pinimg.com/236x/d7/33/b2/d733b2322e36f0b0a29f5ae77e5e33b4.jpg"
  },
];

const BooksPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    setFavoriteIds(favorites.map((b) => b.id));
  }, []);

  const handleAddToFavorites = (book) => {
    const favorites = JSON.parse(localStorage.getItem("favoriteBooks")) || [];
    const exists = favorites.some((b) => b.id === book.id);

    if (exists) {
      alert("Sách đã có trong danh sách yêu thích.");
      return;
    }

    const updatedFavorites = [...favorites, book];
    localStorage.setItem("favoriteBooks", JSON.stringify(updatedFavorites));
    setFavoriteIds([...favoriteIds, book.id]);
    alert("Đã thêm vào yêu thích!");
  };

  const handleBookClick = (book) => {
    navigate(`/book/${book.id}`, { state: { book } });
  };

  const sortedBooks = [...mockBooks];
  if (sortBy === "name") sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "price") sortedBooks.sort((a, b) => a.price - b.price);

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Tất cả sách</span>
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

      <div className="d-flex flex-wrap justify-content-between">
        {sortedBooks.map((book) => (
          <div key={book.id} style={{ width: "19%" }} className="mb-4">
            <div className="book-card position-relative">
              <FaHeart
                className={`heart-icon ${favoriteIds.includes(book.id) ? "active" : ""}`}
                onClick={() => handleAddToFavorites(book)}
                title="Thêm vào yêu thích"
              />
              <div
                onClick={() => handleBookClick(book)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-image"
                />
                <div className="book-title">{book.title}</div>
                <div className="book-price">{book.price.toLocaleString()}₫</div>
              </div>
              <div className="button-group">
                <button className="btn btn-outline-primary btn-sm">Mua ngay</button>
                <button className="btn btn-success btn-sm">Giỏ hàng</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BooksPage;
