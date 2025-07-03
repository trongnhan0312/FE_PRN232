import { memo } from "react";
import Header from "../header";
import Footer from "../footer";

const masterLayout = ({ children }) => (
  <div>
    <Header />
    {children}
    <Footer />
  </div>
);

export default memo(masterLayout);
