import { memo } from "react";
import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router-dom";
const masterLayout = () => (
  <div>
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default memo(masterLayout);
