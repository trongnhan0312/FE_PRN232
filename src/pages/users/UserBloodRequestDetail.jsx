import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBloodRequestById } from "../../services/doctorService";
import "./UserBloodRequestDetail.scss";

const statusColor = {
    Pending: "#fbc02d",
    Approved: "#388e3c",
    Rejected: "#d32f2f",
    Completed: "#1976d2",
};

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

    if (loading) return <div className="ubr-loading">Đang tải chi tiết yêu cầu...</div>;
    if (!request) return <div className="ubr-error">Không tìm thấy yêu cầu máu.</div>;

    return (
        <div className="user-blood-request-detail-fancy">
            <div className="ubr-card">
                <div className="ubr-header">
                    <div className="ubr-blood-icon">
                        <svg viewBox="0 0 32 32" width="44" height="44"><path fill="#d32f2f" d="M16 3C16 3 5 15.5 5 22.5C5 27.2 9.03 31 14 31C18.97 31 23 27.2 23 22.5C23 15.5 16 3 16 3Z" /><circle cx="16" cy="22" r="6" fill="#fff" opacity=".7" /></svg>
                    </div>
                    <div className="ubr-main-info">
                        <div className="ubr-blood-group">{request.bloodGroup?.name || "-"}</div>
                        <div className="ubr-amount">{request.quantity ?? request.amount} đơn vị</div>
                        <div className={`ubr-status-badge`} style={{ background: statusColor[request.status] || '#888' }}>
                            {request.status}
                        </div>
                        {request.isEmergency && <span className="ubr-emergency">⚡ Khẩn cấp</span>}
                    </div>
                </div>
                <div className="ubr-details-grid">
                    <div>
                        <div className="ubr-detail-label">Mã yêu cầu</div>
                        <div className="ubr-detail-value">#{request.id}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Thành phần</div>
                        <div className="ubr-detail-value">{request.bloodComponent || "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Người yêu cầu</div>
                        <div className="ubr-detail-value">{request.requestedBy?.fullName || request.requestedByName || "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Nguồn yêu cầu</div>
                        <div className="ubr-detail-value">{request.requestSource || "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Ngày yêu cầu</div>
                        <div className="ubr-detail-value">{request.requestDate ? new Date(request.requestDate).toLocaleDateString() : "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Ngày hoàn thành</div>
                        <div className="ubr-detail-value">{request.fulfilledDate ? new Date(request.fulfilledDate).toLocaleDateString() : "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Ghi chú</div>
                        <div className="ubr-detail-value">{request.notes || "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Đơn vị máu</div>
                        <div className="ubr-detail-value">{request.bloodUnit?.id ? `#${request.bloodUnit.id}` : "-"}</div>
                    </div>
                    <div>
                        <div className="ubr-detail-label">Số lượng từ kho</div>
                        <div className="ubr-detail-value">{request.quantityFromStock ?? "-"}</div>
                    </div>
                </div>
                <button className="ubr-back-btn" onClick={() => navigate(-1)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default UserBloodRequestDetail;
