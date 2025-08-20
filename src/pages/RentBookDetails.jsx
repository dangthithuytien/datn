import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRentBookById,
  getAllRentBookItems,
} from "../components/Service/rentBookService";
import "../components/style/detailsRent.css";
import CommentSection from "./CommentSection";
import { FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { tokenUtils } from "../components/Cookie/cookieUtils";
import FavoriteRentBookService from "../components/Service/FavoriteRentBookService"; //
import { useMyAlert } from "../components/MyAlertContext";
const baseURL = "https://chosachonline-datn.onrender.com";

const RentBookDetails = () => {
  const { id } = useParams(); // 'id' ở đây là RentBookItemId
  const navigate = useNavigate();
  const [rentBookItem, setRentBookItem] = useState(null); // Thông tin RentBookItem cụ thể
  const [parentBook, setParentBook] = useState(null); // Thông tin RentBook cha
  const [isLoading, setIsLoading] = useState(true); // Trạng thái tải
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 }); // Vị trí zoom mặc định ở giữa
  const { showAlert } = useMyAlert();
  
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [accessToken, setAccessToken] = useState(tokenUtils.getAccessToken());

  useEffect(() => {
    const fetchItemDetails = async () => {
      setIsLoading(true); // Bắt đầu tải
      setError(null); // Đặt lại lỗi

      try {
        const allItems = await getAllRentBookItems();
        const foundItem = allItems.find((item) => item.RentBookItemId === id);

        if (foundItem) {
          setRentBookItem(foundItem);
          const bookData = await getRentBookById(foundItem.RentBookId);
          setParentBook(bookData);
        } else {
          setRentBookItem(null);
          setParentBook(null);
          setError("Không tìm thấy bản sao sách này.");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết mục sách thuê:", err);
        setError("Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.");
        setRentBookItem(null);
        setParentBook(null);
      } finally {
        setIsLoading(false); // Kết thúc tải, dù thành công hay thất bại
      }
    };

    fetchItemDetails();
  }, [id]);
  const checkFavoriteStatus = async () => {
    if (!rentBookItem) return;
    
    try {
      // Sử dụng FavoriteRentBookService và kiểm tra bằng RentBookId (như trong FavoriteRentBooks)
      const favorites = await FavoriteRentBookService.getAll();
      const isBookFavorited = favorites.some(f => String(f.RentBookId) === String(rentBookItem.RentBookId));
      setIsFavorite(isBookFavorited);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra trạng thái yêu thích:", error);
    }
  };
  const toggleFavorite = async () => {
    if (!accessToken) {
      showAlert("❌ Vui lòng đăng nhập để yêu thích sách!","error");
      return;
    }
  
    if (!rentBookItem) {
      showAlert("❌ Thông tin sách chưa được tải!","error");
      return;
    }
  
    try {
      if (isFavorite) {
        await FavoriteRentBookService.deleteFavorite(rentBookItem.RentBookId);
        setIsFavorite(false);
        showAlert("💔 Đã bỏ khỏi danh sách yêu thích!");
      } else {
        await FavoriteRentBookService.toggleFavorite(rentBookItem.RentBookId);
   // ✅ SỬA Ở ĐÂY
        setIsFavorite(true);
        showAlert("❤️ Đã thêm vào danh sách yêu thích!");
      }
    } catch (error) {
      console.error("❌ Lỗi xử lý yêu thích:", error);
  
      if (error.message.includes("404") || error.message.includes("not found")) {
        showAlert("❌ API endpoint không tồn tại. Vui lòng kiểm tra backend!","error");
      } else if (error.message.includes("Token hết hạn")) {
        showAlert("❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!","error");
      } else {
        showAlert("❌ Không thể xử lý yêu thích. Vui lòng thử lại!","error");
      }
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = tokenUtils.getAccessToken();
      if (newToken !== accessToken) {
        setAccessToken(newToken);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken]);

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 50, y: 50 });
  };

  // HÀM formatPrice ĐÃ ĐƯỢC CẬP NHẬT để luôn hiển thị X.000 đ
  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "N/A đ"; // Trả về giá trị mặc định nếu price không phải số
    }

    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0, // Đảm bảo không có số thập phân
      maximumFractionDigits: 0, // Đảm bảo không có số thập phân
    });

    // Kết quả sẽ là "25.000 ₫" hoặc "50.000 ₫"
    // Thay thế ký hiệu ₫ bằng "đ"
    return formatter.format(price).replace("₫", "đ");
  };

  const handleAddToRentCart = () => {
    if (!rentBookItem || !parentBook) return;

    const rentCart = JSON.parse(localStorage.getItem("rentCart")) || [];
    const exists = rentCart.find(
      (cartItem) => cartItem.id === rentBookItem.RentBookItemId
    );

    if (exists) {
      alert("Mục sách này đã có trong giỏ thuê.");
      return;
    }

    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 3);

    const cartItem = {
      id: rentBookItem.RentBookItemId,
      title: parentBook.Title,
      rentPrice: parentBook.Price,
      image: `${baseURL}${parentBook.ImageUrl}`,
      rentDate: today.toISOString().split("T")[0],
      returnDate: returnDate.toISOString().split("T")[0],
      quantity: 1,
      deposit: 50000,
      status: rentBookItem.status,
      condition: rentBookItem.Condition,
    };

    localStorage.setItem("rentCart", JSON.stringify([...rentCart, cartItem]));
    alert("✅ Đã thêm vào giỏ thuê!");
  };

  if (isLoading) {
    return (
      <div className="container mt-4 text-center">
        <h3>Đang tải dữ liệu...</h3>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4 text-center">
        <h3 className="text-danger">{error}</h3>
        {/* Giữ nút "Quay lại" trong trạng thái lỗi để người dùng có thể điều hướng */}
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!rentBookItem || !parentBook) {
    return (
      <div className="container mt-4 text-center">
        <h3>Không tìm thấy thông tin cho bản sao sách này.</h3>
        {/* Giữ nút "Quay lại" trong trạng thái không tìm thấy */}
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4 details-container">
      <div className="row">
        <div
          className="col-md-5 details-image-wrapper"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={parentBook.ImageUrl}
            alt={parentBook.Title}
            className="img-fluid details-image"
            style={{
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              transform: mousePosition.x ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.2s ease-out",
            }}
          />
        </div>

        <div className="col-md-7 details-info">
          <h2 className="details-title">{parentBook.Title}</h2>

          {/* SỬ DỤNG formatPrice ĐÃ TỐI ƯU VÀ THÊM "/ngày" TỪ JSX */}
          <p
            className="book-price-lg text-danger fw-bold"
            style={{ fontSize: "28px", marginBottom: "12px" }}
          >
            Giá thuê: {formatPrice(parentBook.Price)}/ngày
          </p>

          <div className="mb-3">
            <p>
              <strong>Nhà xuất bản:</strong>{" "}
              {parentBook.Publisher || "Không có"}
            </p>
            <p>
              <strong>Dịch giả:</strong> {parentBook.Translator || "Không có"}
            </p>
            <p>
              <strong>Số trang:</strong> {parentBook.PageCount || "Không rõ"}
            </p>
            <p>
              <strong>Kích thước:</strong>{" "}
              {parentBook.PackagingSize || "Không rõ"}
            </p>
            <p>
              <strong>Trạng thái:</strong>{" "}
              <strong
                className={
                  rentBookItem.status === "Available"
                    ? "text-success"
                    : "text-danger"
                }
              >
                {rentBookItem.status === "Available" ? "Còn hàng" : "Đã thuê"}
              </strong>
            </p>
            <p>
              <strong>Tình trạng:</strong>{" "}
              <strong>
                {rentBookItem.Condition === 0
                  ? "Chưa thuê"
                  : `${rentBookItem.Condition}%`}
              </strong>
            </p>
          </div>

          <div className="d-flex gap-3 mt-3">
            {rentBookItem.status === "Available" ? (
              <button className="btn btn-primary" onClick={handleAddToRentCart}>
                Thêm vào giỏ thuê
              </button>
            ) : (
              <button className="btn btn-secondary" disabled>
                Đã thuê
              </button>
            )}
            <button
              className="btn btn-success"
              onClick={() => navigate("/rent-cart")}
            >
              Thuê ngay
            </button>
            <button
                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                onClick={toggleFavorite}
                title={isFavorite ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
              >
                {isFavorite ? (
                  <>
                    <FaHeart style={{ color: "red" }} />
                    <span className="d-none d-md-inline">Đã thích</span>
                  </>
                ) : (
                  <>
                    <FaRegHeart />
                    <span className="d-none d-md-inline">Yêu thích</span>
                  </>
                )}
              </button>
          </div>

          {/* Nút "Quay lại" đã được bỏ theo yêu cầu */}
          {/* <div className="mt-4">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Quay lại
            </button>
          </div> */}
        </div>
      </div>

      <div className="row mt-5 details-bottom">
        <div className="col-md-7">
          <h4>Mô tả sách</h4>
          <p>{parentBook.Description || "Không có mô tả."}</p>
        </div>
        <div className="col-md-5">
          <h4>Thông tin chi tiết chung</h4>
          <table className="table table-bordered">
            <tbody>
              {/* Đảm bảo không có khoảng trắng/xuống dòng thừa giữa các <tr> và giữa <th>/<td> */}
              <tr>
                <th>Tiêu đề</th>
                <td>{parentBook.Title}</td>
              </tr>
              <tr>
                <th>Giá thuê</th>
                <td>{formatPrice(parentBook.Price)}/ngày</td>
              </tr>
              <tr>
                <th>Tiền cọc</th>
                <td>{formatPrice(50000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* ==== BÌNH LUẬN ==== */}
    <CommentSection
  bookId={rentBookItem.RentBookItemId}
  storageKeyPrefix="comments-rent"
/>

    </div>
  );
};

export default RentBookDetails;
