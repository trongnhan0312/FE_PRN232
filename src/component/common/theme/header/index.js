import React from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../../utils/auth";
import "./style.scss";

// Shortcut lấy url giống với homepage (dùng /home/...)
const headerShortcuts = [
    {
        title: "Yêu cầu máu của bạn",
        icon: "💉",
        link: "/home/blood-requests",
    },
    {
        title: "Lịch sử hiến máu",
        icon: "🩸",
        link: "/home/donation-history",
    },
    {
        title: "Kiểm tra điều kiện hiến máu",
        icon: "🩺",
        link: "/home/donor-available",
    },
    {
        title: "Hồ sơ cá nhân",
        icon: "👤",
        link: "/home/profile",
    },
    {
        title: "Tra cứu nhóm máu",
        icon: "🧬",
        link: "/home/blood-group-lookup",
    },
    {
        title: "Tra cứu tương thích máu",
        icon: "🔗",
        link: "/home/blood-compatibility-lookup",
    },
];

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearToken();
        navigate("/login");
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <img
                    src="/logo192.png"
                    alt="Blood Bank Logo"
                    className="header-logo"
                    onClick={() => navigate("/home")}
                />
                <span
                    className="header-title"
                    onClick={() => navigate("/home")}
                >
                    Hệ thống hỗ trợ hiến máu
                </span>
            </div>
            <nav className="header-nav-shortcut">
                {headerShortcuts.map((item) => (
                    <button
                        key={item.title}
                        onClick={() => navigate(item.link)}
                        title={item.title}
                    >
                        <span className="shortcut-icon">{item.icon}</span>
                        <span>{item.title}</span>
                    </button>
                ))}
            </nav>
            <div className="header-actions">
                <button className="logout-btn" onClick={handleLogout}>
                    <span className="logout-icon">⎋</span> Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default Header;
