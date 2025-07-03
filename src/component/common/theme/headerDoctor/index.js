import React from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../../utils/auth";
import "./style.scss";

const HeaderDoctror = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken(); // Xóa token trong cookies
    navigate("/login"); // Chuyển hướng về trang login
  };

  return (
    <header className="doctor-header">
      <h1>Doctor</h1>
      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>
    </header>
  );
};

export default HeaderDoctror;
