import React from "react";
import Sale from "./Sale";
import AllBook from "./AllBook";
import RentBooksPage from "./RentBooksPage";
import TopCategorySection from "./TopCategorySection";


const Home = () => {
  return (
    <div>
      <Sale />
      <AllBook />
      <RentBooksPage />
     {/* <TopCategorySection
  categoryId="fa38ebb6-ba18-4156-b1fc-cfece4342378"
  categoryName="Tiểu Thuyết"
/> */}

     
    
    </div>
  );
};

export default Home;
