import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../../utils/auth";
import { getEmployeeProfile } from "../../../../services/employeeSerivce";
import "./style.scss";

const HeaderDoctor = () => {
    const navigate = useNavigate();
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (!localUser?.id) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await getEmployeeProfile(localUser.id);
                if (res.isSuccessed && res.resultObj) {
                    setUser(res.resultObj);
                } else {
                    console.error("❌ Không thể lấy thông tin hồ sơ");
                }
            } catch (err) {
                console.error("❌ Lỗi khi lấy profile:", err);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        clearToken();
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const avatarUrl = user?.avatarUrl;
    const username = user?.fullName || user?.email || "Doctor";

    return (
        <header className="doctor-header">
            <div className="logo" onClick={() => handleNavigate("/")}>
                🩺 Doctor Panel
            </div>

            <nav className="menu">
                <button onClick={() => handleNavigate("/doctor/blog")}>
                    Blog Post
                </button>
                <button onClick={() => handleNavigate("/doctor/blood-group")}>
                    Blood Group
                </button>
                <button onClick={() => handleNavigate("/doctor/compatibility")}>
                    Blood Compatibility
                </button>
                <button onClick={() => handleNavigate("/doctor/blood-unit")}>
                    Blood Unit
                </button>
                <button onClick={() => handleNavigate("/doctor/donations")}>
                    Donation
                </button>
                <button
                    onClick={() => handleNavigate("/doctor/donor-available")}
                >
                    Donor Available
                </button>
                <button
                    onClick={() => handleNavigate("/doctor/blood-requests")}
                >
                    Blood Request
                </button>
            </nav>

            <div
                className="account"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
            >
                <div className="avatar">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" />
                    ) : (
                        <div className="placeholder">👤</div>
                    )}
                </div>
                <span className="username">{username}</span>

                {showAccountMenu && (
                    <div className="account-menu">
                        <button
                            onClick={() => handleNavigate("/doctor/profile")}
                        >
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
