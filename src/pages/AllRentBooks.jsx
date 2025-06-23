import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFilter, FaHeart } from "react-icons/fa";
import "../components/style/rentbook.css";

const rentBooks = [
  {
    id: 101,
    title: "Sách Thuê - Lập trình React",
    author: "Tác giả X",
    rentPrice: 30000,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUMhRkLozAdMwukKjYEX0DxcnW1z4qVLaZA&s",
  },
  {
    id: 102,
    title: "Sách Thuê - UX/UI Design",
    author: "Tác giả Y",
    rentPrice: 25000,
    image:
      "https://lh3.googleusercontent.com/proxy/dshHw9mkAy2iyn9begIzj-4mZjcctNlOQ9QZdvO5pHZGuPWrWUVyPXjoASVBw1xVaPDfOzaviJGtqxNlc-A",
  },
  {
    id: 103,
    title: "Sách Thuê - Kiến thức Startup",
    author: "Tác giả Z",
    rentPrice: 28000,
    image:
      "https://i.pinimg.com/originals/5b/af/f3/5baff3a874af2020544b306e34b5b269.jpg",
  },
  {
    id: 104,
    title: "Sách Thuê - Tư duy nhanh và chậm",
    author: "Daniel Kahneman",
    rentPrice: 35000,
    image:
      "https://i.pinimg.com/236x/79/e3/f3/79e3f32c79474c41b7588b7247806dbb--wattpad.jpg",
  },
  {
    id: 105,
    title: "Sách Thuê - Marketing căn bản",
    author: "Tác giả A",
    rentPrice: 26000,
    image: "https://vnkings.com/wp-content/uploads/2016/05/hiu4a.png",
  },
  {
    id: 106,
    title: "Sách Thuê - Quản trị kinh doanh",
    author: "Tác giả B",
    rentPrice: 27000,
    image:
      "https://nukaly11.files.wordpress.com/2020/09/lam-tinh-yeu-nhieu-hon-han.jpg?w=940",
  },
  {
    id: 107,
    title: "Sách Thuê - Kỹ năng mềm",
    author: "Tác giả C",
    rentPrice: 29000,
    image: "https://cn-e-pic.itoon.org/cartoon-posters/886172437d.webp",
  },
  {
    id: 108,
    title: "Sách Thuê - Tài chính cá nhân",
    author: "Tác giả D",
    rentPrice: 32000,
    image: "https://cn-e-pic.itoon.org/cartoon-posters/1421672a15.webp",
  },
  {
    id: 109,
    title: "Sách Thuê - Machine Learning",
    author: "Tác giả E",
    rentPrice: 40000,
    image:
      "https://i.pinimg.com/236x/d7/33/b2/d733b2322e36f0b0a29f5ae77e5e33b4.jpg",
  },
  {
    id: 110,
    title: "Sách Thuê - Deep Work",
    author: "Cal Newport",
    rentPrice: 30000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
  {
    id: 111,
    title: "Sách Thuê - Deep Work",
    author: "Cal Newport",
    rentPrice: 30000,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
  },
];

const AllRentBooks = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const favorites =
      JSON.parse(localStorage.getItem("favoriteRentBooks")) || [];
    setFavoriteIds(favorites.map((b) => b.id));
  }, []);

  const handleAddToFavorites = (book) => {
    const favorites =
      JSON.parse(localStorage.getItem("favoriteRentBooks")) || [];
    const exists = favorites.some((b) => b.id === book.id);

    if (exists) {
      alert("Sách đã có trong danh sách yêu thích.");
      return;
    }

    const updatedFavorites = [...favorites, book];
    localStorage.setItem("favoriteRentBooks", JSON.stringify(updatedFavorites));
    setFavoriteIds([...favoriteIds, book.id]);
    alert("Đã thêm vào yêu thích!");
  };

  const sortedBooks = [...rentBooks];
  if (sortBy === "name")
    sortedBooks.sort((a, b) => a.title.localeCompare(b.title));
  else if (sortBy === "price")
    sortedBooks.sort((a, b) => a.rentPrice - b.rentPrice);

  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    if (existingCart.find((item) => item.id === book.id)) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const rentItem = {
      ...book,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    localStorage.setItem(
      "rentCart",
      JSON.stringify([...existingCart, rentItem])
    );
    alert("Đã thêm sách vào giỏ thuê!");
  };

  return (
    <div className="container mt-4">
      <h4 className="d-flex align-items-center mb-4">
        <span>Tất cả sách thuê</span>

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
                className={`filter-option ${
                  sortBy === "price" ? "active" : ""
                }`}
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
                className={`heart-icon ${
                  favoriteIds.includes(book.id) ? "active" : ""
                }`}
                onClick={() => handleAddToFavorites(book)}
                title="Thêm vào yêu thích"
              />
              <div className="image-container">
                <img src={book.image} alt={book.title} className="book-image" />
              </div>
              <h5 className="book-title">{book.title}</h5>
              <p className="book-price">
                Thuê: {book.rentPrice.toLocaleString()}đ
              </p>
              <div className="button-group">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleAddToRentCart(book)}
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
      </div>
    </div>
  );
};

export default AllRentBooks;
