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
        <div className="donation-history-container fancy">
            <h2><span role="img" aria-label="blood">🩸</span> Lịch sử hiến máu của bạn</h2>
            {donations.length === 0 ? (
                <div className="donation-history-message">Bạn chưa có lần hiến máu nào.</div>
            ) : (
                <div className="donation-history-table-wrapper">
                    <table className="donation-history-table">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Ngày hiến</th>
                                <th>Số lượng</th>
                                <th>Yêu cầu máu</th>
                                <th>Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.id}</td>
                                    <td>{d.donationDate?.substring(0, 10)}</td>
                                    <td>{d.amount}</td>
                                    <td>{d.bloodRequestId}</td>
                                    <td><Link className="detail-link" to={`/home/donation-detail/${d.id}`}>Xem</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DonationHistory;
