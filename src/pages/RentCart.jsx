import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  getCartRent,
  removeFromCartRent,
  clearCartRent,
 
} from "../components/Service/CartRentService";

const RentCart = () => {
  const [rentItems, setRentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRentCart();
  }, []);

  const fetchRentCart = async () => {
    const data = await getCartRent();
    console.log("Rent items:", data); // kiểm tra thực tế
    setRentItems(data);
    setSelectedItems(data.map((item) => item.RentBookItemId)); // chọn tất cả mặc định
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === rentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(rentItems.map((item) => item.RentBookItemId));
    }
  };

  const handleRemove = async (id) => {
    await removeFromCartRent(id);
    fetchRentCart();
  };

  const handleClear = async () => {
    if (window.confirm("Xóa toàn bộ giỏ thuê?")) {
      await clearCartRent();
      fetchRentCart();
    }
  };


  const calculateSelectedTotal = () => {
    return rentItems
      .filter((item) => selectedItems.includes(item.RentBookItemId))
      .reduce((total, item) => total + item.BookPrice, 0);
  };
  

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    const selectedProducts = rentItems.filter((item) =>
      selectedItems.includes(item.RentBookItemId)
    );
    localStorage.setItem("rentCartBuy", JSON.stringify(selectedProducts));
    localStorage.setItem(
      "rentCheckoutTotal",
      JSON.stringify(calculateSelectedTotal())
    );
    navigate("/rent-checkout");
  };

  return (
    <div className="container mt-4">
      <h3>🛒 Giỏ Hàng Thuê Sách</h3>

      {rentItems.length === 0 ? (
        <p>Giỏ thuê trống.</p>
      ) : (
        <>
          <table className="table table-bordered text-center align-middle mt-3">
            <thead className="table-light">
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedItems.length === rentItems.length}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>Ảnh</th>
                <th>Tên sách</th>
                <th>Mức độ thiệt hại(%)</th>
                <th>Số lượng thuê</th>
              
                <th>Tiền cọc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rentItems.map((item) => (
<tr key={item.RentBookItemId}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.RentBookItemId)}
                      onChange={() => toggleSelect(item.RentBookItemId)}
                    />
                  </td>
                  <td>
                    <img
                      src={
                        item.imageUrl
                          ? `https://localhost:7003${item.imageUrl}`
                          : "/default-avatar.png"
                      }
                      alt={item.RentBookTitle}
                      width={50}
                      height="auto"
                      style={{ borderRadius: "10%", objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.RentBookTitle}</td>
                  <td>{item.Condition}</td>
                  <td>
                    <div className="d-flex align-items-center justify-content-center gap-2">
                    
                      <span>{item.Quantity}</span>
                     
                    </div>
                  </td>
                 
                  <td>{item.BookPrice}đ</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemove(item.RentBookItemId)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-danger" onClick={handleClear}>
              Xoá toàn bộ giỏ thuê
            </button>
            <h5>
              Tổng tiền thuê đã chọn:{" "}
              <span style={{ color: "green" }}>
                {calculateSelectedTotal().toLocaleString()}đ
              </span>
            </h5>
            <button className="btn btn-success" onClick={handleCheckout}>
              Thanh toán thuê
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RentCart;