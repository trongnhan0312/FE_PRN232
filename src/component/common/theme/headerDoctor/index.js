import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../../utils/auth";
import "./style.scss";

const HeaderDoctor = ({ username = "Doctor123" }) => {
  const navigate = useNavigate();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <header className="doctor-header">
      <div className="logo" onClick={() => handleNavigate("/")}>
        🩺 Doctor Panel
      </div>

      <nav className="menu">
        <button onClick={() => handleNavigate("/doctor/blog")}>
          Blog Post
        </button>
        <button onClick={() => handleNavigate("/blood-group")}>
          Blood Group
        </button>
        <button onClick={() => handleNavigate("/compatibility")}>
          Blood Compatibility
        </button>
        <button onClick={() => handleNavigate("/blood-unit")}>
          Blood Unit
        </button>
        <button onClick={() => handleNavigate("/donation")}>Donation</button>
        <button onClick={() => handleNavigate("/donor-available")}>
          Donor Available
        </button>
        <button onClick={() => handleNavigate("/request")}>
          Blood Request
        </button>
      </nav>

      <div
        className="account"
        onClick={() => setShowAccountMenu(!showAccountMenu)}
      >
        👤 {username}
        {showAccountMenu && (
          <div className="account-menu">
            <button onClick={() => handleNavigate("/profile")}>
              Thông tin
            </button>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderDoctor;
