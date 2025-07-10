import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBloodRequestById } from "../../services/doctorService";
import "./UserBloodRequestDetail.scss";

const UserBloodRequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getBloodRequestById(id);
                setRequest(res.resultObj || null);
            } catch {
                setRequest(null);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    if (loading) return <div>Đang tải chi tiết yêu cầu...</div>;
    if (!request) return <div>Không tìm thấy yêu cầu máu.</div>;

    return (
        <div className="user-blood-request-detail-container fancy">
            <h2>Chi tiết yêu cầu máu</h2>
            <div className="detail-row"><b>Mã yêu cầu:</b> {request.id}</div>
            <div className="detail-row"><b>Nhóm máu:</b> {request.bloodGroup?.name || ""}</div>
            <div className="detail-row"><b>Thành phần:</b> {request.bloodComponent || ""}</div>
            <div className="detail-row"><b>Số lượng:</b> {request.quantity ?? request.amount}</div>
            <div className="detail-row"><b>Khẩn cấp:</b> {request.isEmergency ? "Có" : "Không"}</div>
            <div className="detail-row"><b>Trạng thái:</b> {request.status}</div>
            <div className="detail-row"><b>Người yêu cầu:</b> {request.requestedBy?.fullName || request.requestedByName || ""}</div>
            <div className="detail-row"><b>Ngày yêu cầu:</b> {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : ""}</div>
            <div className="detail-row"><b>Ngày hoàn thành:</b> {request.fulfilledDate ? new Date(request.fulfilledDate).toLocaleDateString() : "-"}</div>
            <div className="detail-row"><b>Ghi chú:</b> {request.notes || "-"}</div>
            <div className="detail-row"><b>Nguồn yêu cầu:</b> {request.requestSource || "-"}</div>
            <div className="detail-row"><b>Đơn vị máu:</b> {request.bloodUnit?.id ? `#${request.bloodUnit.id}` : "-"}</div>
            <div className="detail-row"><b>Số lượng từ kho:</b> {request.quantityFromStock ?? "-"}</div>
            <button onClick={() => navigate(-1)}>Quay lại</button>
        </div>
    );
};

export default UserBloodRequestDetail;
