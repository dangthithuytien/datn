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


export const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/user-profile", element: <UserProfile /> },
  { path: "/forgot-password", element: <ForgetPass /> },

  // Chi tiết sách (bán và thuê)
  { path: "/book/:id", element: <DetailsBook /> },
  { path: "/rent/:id", element: <DetailsBook /> },

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
  { path: "/rent-books", element: <RentBooksPage /> },
  { path: "/rent-cart", element: <RentCart /> },

  // Trang giới thiệu
  { path: "/about", element: <About /> },
  { path: "/news", element: <News /> },
  { path: "/contact", element: <Contact /> },
];
