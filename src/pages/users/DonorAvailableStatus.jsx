import React, { useEffect, useState } from "react";
import { getUserDonorAvailable } from "../../services/doctorService";
import { getCurrentUser } from "../../utils/auth";
import "./DonorAvailableStatus.scss";

const DonorAvailableStatus = () => {
    const user = getCurrentUser();
    const userId = user?.id;
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const fetch = async () => {
            try {
                const res = await getUserDonorAvailable(userId);
                setStatus(res.items?.[0] || null);
            } catch {
                setStatus(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [userId]);

    if (!userId) return <div>Vui lòng đăng nhập để kiểm tra điều kiện hiến máu.</div>;
    if (loading) return <div>Đang kiểm tra điều kiện...</div>;

    return (
        <div className="donor-available-status-container">
            <h2>Trạng thái đủ điều kiện hiến máu</h2>
            {!status ? (
                <div>Bạn chưa đăng ký kiểm tra điều kiện hiến máu.</div>
            ) : (
                <ul>
                    <li><b>Ngày đăng ký:</b> {status.createdAt?.substring(0, 10)}</li>
                    <li><b>Trạng thái:</b> {status.isEligible ? <span className="eligible">Đủ điều kiện</span> : <span className="not-eligible">Không đủ điều kiện</span>}</li>
                    <li><b>Ghi chú:</b> {status.notes || "-"}</li>
                </ul>
            )}
        </div>
    );
};

export default DonorAvailableStatus;
