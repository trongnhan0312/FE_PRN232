import React, { useEffect, useState } from 'react';
import { getAllBloodRequests } from '../../services/doctorService';
import { Link } from 'react-router-dom';
import './BloodRequestList.scss';

const BloodRequestList = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await getAllBloodRequests();
                setRequests(res.resultObj?.items || []);
            } catch (err) {
                setRequests([]);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    if (loading) return <div className="blood-request-loading">Đang tải danh sách yêu cầu máu...</div>;

    return (
        <div className="blood-request-list-container">
            <h2 className="blood-request-title">Danh sách yêu cầu máu</h2>
            <div className="blood-request-table-wrapper">
                <table className="blood-request-table">
                    <thead>
                        <tr>
                            <th>Mã yêu cầu</th>
                            <th>Bệnh nhân</th>
                            <th>Nhóm máu</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', color: '#888' }}>
                                    Không có yêu cầu máu nào.
                                </td>
                            </tr>
                        ) : (
                            requests.map((req) => (
                                <tr key={req.id}>
                                    <td>{req.id}</td>
                                    <td>{req.patientName}</td>
                                    <td>{req.bloodGroup?.name || ""}</td>
                                    <td>{req.amount}</td>
                                    <td>
                                        <span className={`status-badge status-${req.status?.toLowerCase()}`}>{req.status}</span>
                                    </td>
                                    <td>
                                        <Link className="detail-link" to={`/doctor/blood-requests/detail/${req.id}`}>
                                            Xem chi tiết
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BloodRequestList;
