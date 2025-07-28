import { useRoutes } from "react-router-dom";
import Layout from "./components/layout/Layout";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAutoLogout } from "../src/components/Service/useAutoLogout"; 
import { appRoutes } from "./routes/routes";


const App = () => {
  useAutoLogout();
  return (
    <Layout>
      {useRoutes(appRoutes)}
    </Layout>
  );
};

export default App;
