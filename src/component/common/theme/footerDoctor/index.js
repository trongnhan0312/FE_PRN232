import React from "react";
import "./style.scss";

const FooterDoctror = () => {
  return (
    <footer className="doctor-footer">
      <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
    </footer>
  );
};

export default FooterDoctror;
