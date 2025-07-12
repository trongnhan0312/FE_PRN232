import React, { useEffect, useState } from "react";
import { getUserDonorAvailable } from "../../services/doctorService";
import { getCurrentUser } from "../../utils/auth";
import "./DonorAvailableStatus.scss";

const DonorAvailableStatus = () => {
    const user = getCurrentUser();
    const userId = user?.id;
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError("");
        getUserDonorAvailable(userId)
            .then((res) => {
                setStatus(res || null);
            })
            .catch((err) => {
                if (err?.response && err.response.status === 404) {
                    setStatus(null);
                    setError("");
                } else {
                    setStatus(null);
                    setError("Không thể lấy trạng thái điều kiện hiến máu.");
                }
            })
            .finally(() => setLoading(false));
    }, [userId]);

    if (!userId) return <div className="das-message">Vui lòng đăng nhập để kiểm tra điều kiện hiến máu.</div>;
    if (loading) return <div className="das-message">Đang kiểm tra điều kiện...</div>;

    return (
        <div className="donor-available-status-fancy">
            <div className="das-card">
                <div className="das-header">
                    <svg width="40" height="40" viewBox="0 0 32 32"><path fill="#b71c1c" d="M16 3C16 3 5 15.5 5 22.5C5 27.2 9.03 31 14 31C18.97 31 23 27.2 23 22.5C23 15.5 16 3 16 3Z" /><circle cx="16" cy="22" r="6" fill="#fff" opacity=".7" /></svg>
                    <h2>Trạng thái đủ điều kiện hiến máu</h2>
                </div>
                {error && <div className="das-error">{error}</div>}
                {!status ? (
                    <div className="das-empty">Bạn chưa có thông tin kiểm tra điều kiện hiến máu.</div>
                ) : (
                    <div className="das-info-grid">
                        <div className="das-info-item">
                            <span className="das-label">Họ tên</span>
                            <span className="das-value">{status.user?.fullName || "-"}</span>
                        </div>
                        <div className="das-info-item">
                            <span className="das-label">Nhóm máu</span>
                            <span className="das-value">{status.user?.bloodGroup?.name || "-"}</span>
                        </div>
                        <div className="das-info-item">
                            <span className="das-label">Ngày đủ điều kiện</span>
                            <span className="das-value">{formatDate(status.availableFrom)}</span>
                        </div>
                        <div className="das-info-item">
                            <span className="das-label">Đến ngày</span>
                            <span className="das-value">{formatDate(status.availableTo)}</span>
                        </div>
                        <div className="das-info-item">
                            <span className="das-label">Trạng thái</span>
                            <span className={status.isActive ? "das-eligible" : "das-not-eligible"}>
                                {status.isActive ? "Đủ điều kiện" : "Không đủ điều kiện"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN');
}

export default DonorAvailableStatus;
