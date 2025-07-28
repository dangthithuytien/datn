// src/components/Layout.jsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import { MyAlertProvider } from "../../components/MyAlertContext";
const Layout = ({ children }) => {
  return (
    <MyAlertProvider>
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Header />
      <Banner />
      <main className="flex-fill">{children}</main>
      <Footer />
    </div>
  </MyAlertProvider>
  
  );
};

export default Layout;
