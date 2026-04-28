import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../scrollToTop";


function Layout() {

  return (
    <div>
      <ScrollToTop />
      <Outlet />
      <Footer />
    </div>
  );
}

export default Layout;
