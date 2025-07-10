import React, { useEffect, useState } from "react";
import { getUserProfile } from "../../services/doctorService";
import { useNavigate } from "react-router-dom";
import "./index.scss";

const shortcuts = [
    {
        title: "Blog Bệnh Viện",
        icon: "📝",
        link: "/users/blogs",
        desc: "Tin tức, chia sẻ, kiến thức y tế.",
    },
    {
        title: "Yêu cầu máu",
        icon: "💉",
        link: "/users/blood-requests",
        desc: "Tạo & quản lý yêu cầu nhận máu.",
    },
    {
        title: "Lịch sử hiến máu",
        icon: "🩸",
        link: "/users/donations",
        desc: "Xem lại các lần hiến máu của bạn.",
    },
    {
        title: "Tình trạng đủ điều kiện",
        icon: "🩺",
        link: "/users/donor-available",
        desc: "Kiểm tra điều kiện hiến máu.",
    },
    {
        title: "Nhóm máu",
        icon: "🧬",
        link: "/users/blood-groups",
        desc: "Tra cứu nhóm máu, thông tin liên quan.",
    },
    {
        title: "Tương thích máu",
        icon: "🔗",
        link: "/users/blood-compatibility",
        desc: "Tra cứu tương thích truyền máu.",
    },
];

const UserHomePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Giả sử userId lưu ở localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setError("Không tìm thấy thông tin người dùng.");
            setLoading(false);
            return;
        }
        getUserProfile(userId)
            .then((data) => {
                setProfile(data.resultObj || data);
                setLoading(false);
            })
            .catch(() => {
                setError("Không thể tải thông tin người dùng.");
                setLoading(false);
            });
    }, []);

    return (
        <div className="user-homepage">
            <div className="dashboard-header">
                <div className="avatar-section">
                    {loading ? (
                        <div className="avatar-skeleton" />
                    ) : profile && profile.avatarUrl ? (
                        <img
                            src={profile.avatarUrl}
                            alt="avatar"
                            className="avatar-img"
                        />
                    ) : (
                        <div className="avatar-placeholder">👤</div>
                    )}
                </div>
                <div className="user-info">
                    {loading ? (
                        <div
                            className="skeleton skeleton-text"
                            style={{ width: 120 }}
                        />
                    ) : (
                        <h2 className="user-name">
                            {profile?.fullName || "Người dùng"}
                        </h2>
                    )}
                    {profile?.bloodGroupName && (
                        <div className="user-blood-group">
                            Nhóm máu: <span>{profile.bloodGroupName}</span>
                        </div>
                    )}
                </div>
                <div className="profile-actions">
                    <button
                        className="btn-edit-profile"
                        onClick={() => navigate("/users/profile")}
                    >
                        Chỉnh sửa hồ sơ
                    </button>
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="dashboard-shortcuts">
                {shortcuts.map((item, idx) => (
                    <div
                        className="shortcut-card"
                        key={item.title}
                        onClick={() => navigate(item.link)}
                        style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                        <div className="shortcut-icon">{item.icon}</div>
                        <div className="shortcut-title">{item.title}</div>
                        <div className="shortcut-desc">{item.desc}</div>
                    </div>
                ))}
            </div>
            <div className="dashboard-footer">
                <span>Hệ thống quản lý hiến máu &copy; 2025</span>
            </div>
        </div>
    );
};

export default UserHomePage;
