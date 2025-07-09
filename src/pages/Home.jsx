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

      <TopCategorySection categoryName="Tiểu thuyết" />
       <TopCategorySection  categoryId="e511b772-3a05-44d9-847e-384dc84dabee" categoryName="Kinh dị" />
    
    </div>
  );
};

export default Home;
