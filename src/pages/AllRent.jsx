import React from "react";
import { Link } from "react-router-dom";
import "../components/style/rentbook.css"; // Dùng CSS riêng cho sách thuê

const rentBooks = [
  {
    id: 101,
    title: "Sách Thuê - Lập trình React",
    author: "Tác giả X",
    rentPrice: 30000,
    image:
      "https://th.bing.com/th/id/OIP.YFcOB54Boqrk5K3pPwzI-QHaD4?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
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

const AllRent = () => {
  const handleAddToRentCart = (book) => {
    const existingCart = JSON.parse(localStorage.getItem("rentCart")) || [];

    const alreadyExists = existingCart.find((item) => item.id === book.id);
    if (alreadyExists) {
      alert("Sách đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const rentItem = {
      ...book,
      rentDate: today.toISOString().split("T")[0],
      returnDate: threeDaysLater.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
    };

    const newCart = [...existingCart, rentItem];
    localStorage.setItem("rentCart", JSON.stringify(newCart));
    alert("Đã thêm sách vào giỏ thuê!");
  };

  return (
    <div className="row">
      {rentBooks.map((book) => (
        <div key={book.id} className="col-6 col-md-3 mb-4">
          <div className="rent-book-card">
            <Link to={`/rent/${book.id}`} state={{ book }}>
              <div className="image-container">
                <img
                  src={book.image}
                  alt={book.title}
                  className="rent-book-image"
                />
              </div>
              <h5 className="rent-book-title">{book.title}</h5>
            </Link>
            <p className="rent-book-price">
              Thuê: {book.rentPrice.toLocaleString()}đ
            </p>
            <div className="rent-button-group">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleAddToRentCart(book)}
              >
                Giỏ thuê
              </button>
              <Link to="/rent-cart">
                <button className="btn btn-success btn-sm">Thuê ngay</button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllRent;
