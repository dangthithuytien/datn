import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";
import ForgotPassword from "./pages/ForgetPass";
import Details from "./pages/DetailsBook";
import CartBuy from "./pages/CartBuy";
import SaleAll from "./pages/SaleAll";
import Checkout from "./pages/Checkout";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/book/:id" element={<Details />} />
        <Route path="/cart" element={<CartBuy />} />
        <Route path="/sale-all" element={<SaleAll />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </Layout>
  );
};

export default App;
