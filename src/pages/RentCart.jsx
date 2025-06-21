import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTrash } from "react-icons/fa";
import "../components/style/RentCart.css";

const RentCart = () => {
  const [rentItems, setRentItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("rentCart")) || [];
    setRentItems(data);
    setSelectedItems(data.map((item) => item.id)); // mặc định chọn hết
  }, []);

  const removeItem = (index) => {
    const updated = rentItems.filter((_, i) => i !== index);
    setRentItems(updated);
    localStorage.setItem("rentCart", JSON.stringify(updated));

    const updatedSelected = updated.map((item) => item.id);
    setSelectedItems((prev) => prev.filter((id) => updatedSelected.includes(id)));
  };

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === rentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(rentItems.map((item) => item.id));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán.");
      return;
    }
    const selected = rentItems.filter((item) => selectedItems.includes(item.id));
    localStorage.setItem("rentCheckoutItems", JSON.stringify(selected));
    navigate("/rent-checkout");
  };

  return (
    <div className="container mt-4">
      <h3>📘 Giỏ hàng thuê sách</h3>

      {rentItems.length === 0 ? (
        <p>Giỏ hàng thuê đang trống.</p>
      ) : (
        <>
          <table className="table mt-3 align-middle text-center">
            <thead className="table-success">
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
                <th>Tình trạng</th>
                <th>Giá thuê/ngày</th>
                <th>Tiền cọc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rentItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                    />
                  </td>
                  <td>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "60px", height: "80px", objectFit: "cover" }}
                    />
                  </td>
                  <td>{item.title}</td>
                  <td>Mới 80%</td>
                  <td>{item.rentPrice.toLocaleString()}đ</td>
                  <td>{item.deposit.toLocaleString()}đ</td>
                  <td>
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-outline-success btn-sm"
                        title="Xem chi tiết"
                        onClick={() =>
                          navigate(`/rent/${item.id}`, { state: { book: item } })
                        }
                      >
                        <FaSearch style={{ color: "#2e7d32" }} />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Xóa"
                        onClick={() => removeItem(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-success" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RentCart;
