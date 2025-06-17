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

// Đây là cách truyền tham số để lấy chi tiết  1 cái gi đó như id
// Ví dụ: nếu bạn muốn lấy chi tiết sách theo id, bạn có thể sử dụng useParams trong component DetailsBook
// sau nay có truyền vào api để lấy ra chi tiết
//   { path: "/book/:id", element: <Details /> },
// import { useParams } from "react-router-dom";
// const Details = () => {
//   const { id } = useParams(); // id sẽ là chuỗi từ URL
//   return (
//     <div>
//       <h2>Chi tiết sách</h2>
//       <p>ID sách: {id}</p>
//     </div>
//   );

export const appRoutes = [
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/user-profile", element: <UserProfile /> },
  { path: "/forgot-password", element: <ForgetPass /> },
  { path: "/book/:id", element: <DetailsBook /> },
  { path: "/cart", element: <CartBuy /> },
  { path: "/sale-all", element: <SaleAll /> },
  { path: "/checkout", element: <Checkout /> },
  { path: "/books", element: <AllBook /> },
  { path: "/sale", element: <Sale /> },
];
