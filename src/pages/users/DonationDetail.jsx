import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDonationById } from "../../services/doctorService";
import "./DonationDetail.scss";

const DonationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getUserDonationById(id);
                setDonation(res || null);
            } catch {
                setDonation(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <div className="donation-detail-loading">Đang tải chi tiết hiến máu...</div>;
    if (!donation) return <div className="donation-detail-error">Không tìm thấy thông tin hiến máu.</div>;

    return (
        <div className="donation-detail-container">
            <h2>Chi tiết lần hiến máu</h2>
            <div className="donation-detail-card">
                <div><b>Mã hiến máu:</b> {donation.id}</div>
                <div><b>Ngày hiến:</b> {donation.donationDate?.substring(0, 10)}</div>
                <div><b>Số lượng:</b> {donation.quantity} ml</div>
                <div><b>Nhóm máu:</b> {donation.user?.bloodGroup?.name || "-"}</div>
                <div><b>Người nhận:</b> {donation.bloodRequest?.requestedBy?.fullName || "-"}</div>
                <div><b>Ghi chú:</b> {donation.notes || "-"}</div>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
};

export default DonationDetail;
