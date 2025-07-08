import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBloodRequestById } from '../../services/doctorService';
import './BloodRequestDetail.scss';

const BloodRequestDetail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getBloodRequestById(id);
                setDetail(res.resultObj);
            } catch (err) {
                setDetail(null);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    if (loading) return <div>Đang tải chi tiết yêu cầu...</div>;
    if (!detail) return <div>Không tìm thấy yêu cầu máu.</div>;

    return (
        <div className="doctor-blood-request-detail">
            <h2>Chi tiết yêu cầu máu #{detail.id}</h2>
            <ul>
                <li><b>Bệnh nhân:</b> {detail.patientName}</li>
                <li><b>Nhóm máu:</b> {detail.bloodGroup?.name || ""}</li>
                <li><b>Số lượng:</b> {detail.amount}</li>
                <li><b>Trạng thái:</b> {detail.status}</li>
                <li><b>Ngày tạo:</b> {detail.createdAt}</li>
                {/* Thêm các trường khác nếu cần */}
            </ul>
            {/* Thêm nút phê duyệt, từ chối, cấp phát máu nếu cần */}
        </div>
    );
};

export default BloodRequestDetail;
