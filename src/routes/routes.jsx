import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserProfile from "../pages/UserProfile";
import ForgetPass from "../pages/ForgetPass";
import DetailsBook from "../pages/DetailsBook";
import CartBuy from "../pages/CartBuy";
import SaleAll from "../pages/SaleAll";
import Checkout from "../pages/Checkout";
import AllBook from "../pages/AllBook";
import Sale from "../pages/Sale";
import BooksPage from "../pages/BooksPage";
import RentBooksPage from "../pages/RentBooksPage";
import RentCart from "../pages/RentCart";
import About from "../pages/AboutUs";
import News from "../pages/News";
import Contact from "../pages/Contact";
import RentCheckout from "../pages/RentCheckout";
import AllOrders from "../pages/AllOrders";
import OrdersRent from "../pages/OrdersRent";
import OrderRentDetail from "../pages/OrderRentDetail";
import OrderSellDetail from "../pages/OrderSellDetail";
import FavoriteBooks from "../pages/FavoriteBooks";
import AllRentBooks from "../pages/AllRentBooks";
import RentBookDetails from "../pages/RentBookDetails"; 
import ConfirmEmail from "../pages/ConfirmEmailPage";



export const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/user-profile", element: <UserProfile /> },
  { path: "/forgot-password", element: <ForgetPass /> },
{ path: "/confirm-email", element: <ConfirmEmail /> },
  // Chi tiết sách (bán) - BookId
  { path: "/book/:id", element: <DetailsBook /> },

  // Giỏ hàng sách mua
  { path: "/cart", element: <CartBuy /> },

  { path: "/sale-all", element: <SaleAll /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/rent-checkout", element: <RentCheckout /> },
  { path: "/orders-all", element: <AllOrders /> },
  { path: "/orders-rent", element: <OrdersRent /> },
  { path: "/orders-rent/:id", element: <OrderRentDetail /> },
  { path: "/orders-sell/:id", element: <OrderSellDetail /> },

  // Danh mục sách bán
  { path: "/books", element: <AllBook /> },
  { path: "/books-page", element: <BooksPage /> },
  { path: "/favorite", element:<FavoriteBooks /> },

  // Khác
  { path: "/sale", element: <Sale /> },
  { path: "/rent-books", element: <RentBooksPage /> }, // Trang danh sách các RentBookItem
  { path: "/rent-cart", element: <RentCart /> },

  // Trang giới thiệu
  { path: "/about", element: <About /> },
  { path: "/news", element: <News /> },
  { path: "/contact", element: <Contact /> },

  { path: "/rent-books/all", element: <AllRentBooks /> },

  // Cập nhật hoặc thêm route cho trang chi tiết RentBookItem
  // Dòng này cần phải khớp với `Link to="/rent-item-details/${item.id}"` trong RentBooksPage.js
  { path: "/rent-item-details/:id", element: <RentBookDetails /> },

  // Bạn có thể giữ hoặc xóa dòng này tùy thuộc vào việc bạn có cần một trang chi tiết RentBook (sách gốc) không
  // Nếu bạn đã chuyển sang hiển thị chi tiết từng RentBookItem, thì có thể xóa hoặc đổi tên route này
  // để tránh nhầm lẫn hoặc trùng lặp chức năng.
  // Ví dụ: `{ path: "/rent-book-general/:id", element: <RentBookDetails /> }`
  { path: "/rent/:id", element: <RentBookDetails /> }, // Route này có thể gây nhầm lẫn nếu bạn đã chuyển hoàn toàn sang /rent-item-details/:id
];