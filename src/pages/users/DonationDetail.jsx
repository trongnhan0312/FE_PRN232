import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINT } from "../../config/apiConfig";
import "./DonationDetail.scss";

const DonationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(API_ENDPOINT.DONATION.DETAIL.replace("{id}", id));
                setDonation(res.data?.resultObj || null);
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
                <div><b>Số lượng:</b> {donation.amount}</div>
                <div><b>Yêu cầu máu liên quan:</b> {donation.bloodRequestId}</div>
                <div><b>Ghi chú:</b> {donation.note || "-"}</div>
            </div>
            <button className="back-btn" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
};

export default DonationDetail;
