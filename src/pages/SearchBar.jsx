import React, { useState, useEffect, useRef  } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSaleBooks } from "../components/Service/saleBookService";
import { getAllRentBooks, getAllRentBookItems } from "../components/Service/rentBookService";
import { FaSearch } from "react-icons/fa";
import "../components/style/SearchBar.css";

const SearchBar = () => {
    const wrapperRef = useRef(null);
    const [searchTermSale, setSearchTermSale] = useState("");
    const [searchTermRent, setSearchTermRent] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [rentItems, setRentItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentItems = async () => {
            try {
                const items = await getAllRentBookItems();
                setRentItems(items);
            } catch (error) {
                console.error("Lỗi lấy item sách thuê:", error);
            }
        };
        fetchRentItems();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setSuggestions([]);
            setSearchTermSale("");
            setSearchTermRent("");
          }
        };
      
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                if (searchTermSale.trim()) {
                    const books = await getAllSaleBooks();
                    const filtered = books.filter((b) =>
                        b.Title?.toLowerCase().includes(searchTermSale.toLowerCase())
                    );
                    setSuggestions(filtered.map((b) => ({ ...b, type: "sale" })));
                } else if (searchTermRent.trim()) {
                    const rentBooks = await getAllRentBooks();
                    const filtered = rentBooks
                        .filter((b) =>
                            b.Title?.toLowerCase().includes(searchTermRent.toLowerCase())
                        )
                        .map((book) => {
                            const relatedItems = rentItems.filter(
                                (i) =>
                                    i.RentBookId === book.RentBookId &&
                                    i.IsHidden === true &&
                                    i.status === "Available"// CHỈ lấy item có IsHidden = true
                            );
                            return {
                                ...book,
                                ItemList: relatedItems,
                                type: "rent",
                            };
                        })
                        .filter((b) => b.ItemList.length > 0); // chỉ lấy sách có item

                    setSuggestions(filtered);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Lỗi khi tìm kiếm sách:", error);
            }
        };

        const delay = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delay);
    }, [searchTermSale, searchTermRent, rentItems]);

    const handleSelect = (book) => {
        if (book.type === "sale") {
            navigate(`/sale-book/${book.SaleBookId}`);
        }
        setSearchTermSale("");
        setSearchTermRent("");
        setSuggestions([]);
    };

    return (
        <div className="position-relative w-100" ref={wrapperRef}>
            <div className="d-flex gap-2">
                {/* Tìm sách bán */}
                <div className="input-group w-50">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm sách bán..."
                        value={searchTermSale}
                        onChange={(e) => {
                            setSearchTermSale(e.target.value);
                            setSearchTermRent("");
                        }}
                    />
                    <button className="btn btn-light">
                        <FaSearch />
                    </button>
                </div>

                {/* Tìm sách thuê */}
                <div className="input-group w-50">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm sách thuê..."
                        value={searchTermRent}
                        onChange={(e) => {
                            setSearchTermRent(e.target.value);
                            setSearchTermSale("");
                        }}
                    />
                    <button className="btn btn-light">
                        <FaSearch />
                    </button>
                </div>
            </div>

            {suggestions.length > 0 && (
  <ul className="dropdown-menu show w-100 position-absolute z-3 mt-1">
    {suggestions.map((book) => (
      <li
        key={book.RentBookId || book.SaleBookId}
        className="dropdown-item"
        onClick={() => handleSelect(book)}
      >
        <div className="d-flex align-items-center">
          <img
            src={
              book.ImageUrl
                ? `https://chosachonline-datn.onrender.com${book.ImageUrl}`
                : "/default-avatar.png"
            }
            alt={book.Title}
            width={50}
            height="auto"
            style={{
              borderRadius: "10%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
          <div>
            <strong>{book.Title}</strong>
            
          </div>
        </div>

        {book.type === "rent" && book.ItemList?.length > 0 && (
          <ul className="ms-4 mt-2">
            {book.ItemList.map((item) => (
              <li
              key={item.RentBookItemId}
              className="small text-secondary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/rent-item-details/${item.RentBookItemId}`);
              }}
              style={{
                cursor: "pointer",
                listStyle: "none", // ✅ bỏ dấu chấm
              }}
            >
              ➤ Tình trạng: {item.Condition}% | Trạng thái:{" "}
              {item.status === "Rented" ? "Đã thuê" : "Còn"}
            </li>
            
            ))}
          </ul>
        )}
      </li>
    ))}
  </ul>
)}

        </div>
    );
};

export default SearchBar;
