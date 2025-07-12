import React, { useEffect, useState } from "react";
import { getUserDonations } from "../../services/doctorService";
import { getCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";
import "./DonationHistory.scss";

const DonationHistory = () => {
    const user = getCurrentUser();
    const userId = user?.id;
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetch = async () => {
            try {
                const res = await getUserDonations(userId);
                setDonations(res.items || []);
            } catch {
                setDonations([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    if (!userId) return <div className="donation-history-message">Vui lòng đăng nhập để xem lịch sử hiến máu.</div>;
    if (loading) return <div className="donation-history-message">Đang tải dữ liệu...</div>;

    return (
        <div className="donation-history-fancy">
            <div className="dh-card">
                <div className="dh-header">
                    <svg width="40" height="40" viewBox="0 0 32 32"><path fill="#d32f2f" d="M16 3C16 3 5 15.5 5 22.5C5 27.2 9.03 31 14 31C18.97 31 23 27.2 23 22.5C23 15.5 16 3 16 3Z" /><circle cx="16" cy="22" r="6" fill="#fff" opacity=".7" /></svg>
                    <h2>Lịch sử hiến máu của bạn</h2>
                </div>
                {donations.length === 0 ? (
                    <div className="dh-message">Bạn chưa có lần hiến máu nào.</div>
                ) : (
                    <div className="dh-list">
                        {donations.map((d) => (
                            <div className="dh-item" key={d.id}>
                                <div className="dh-item-main">
                                    <div className="dh-blood-group">{d.bloodGroup?.name || "-"}</div>
                                    <div className="dh-amount">{d.amount} ml</div>
                                    <div className="dh-date">{d.donationDate?.substring(0, 10)}</div>
                                </div>
                                <div className="dh-item-info">
                                    <div><span className="dh-label">Yêu cầu máu:</span> <span className="dh-value">{d.bloodRequestId || "-"}</span></div>
                                    <div><span className="dh-label">Mã hiến máu:</span> <span className="dh-value">#{d.id}</span></div>
                                    <Link className="dh-detail-link" to={`/home/donation-detail/${d.id}`}>Xem chi tiết</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DonationHistory;
