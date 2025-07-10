import React, { useEffect, useState } from "react";
import { getUserBloodRequests, deleteUserBloodRequest } from "../../services/doctorService";
import { getCurrentUser, isCurrentUser } from "../../utils/auth";
import { Link } from "react-router-dom";
import "./UserBloodRequestList.scss";

const UserBloodRequestList = () => {
    const user = getCurrentUser();
    const userId = user?.id;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchRequests = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await getUserBloodRequests(userId);
            setRequests(res.items || []);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line
    }, [userId]);

    const handleDelete = async (id, status, reqUserId) => {
        if (status !== "Pending" || !isCurrentUser(reqUserId)) return;
        if (!window.confirm("Bạn chắc chắn muốn xóa yêu cầu này?")) return;
        try {
            await deleteUserBloodRequest(id);
            setMessage("Xóa thành công!");
            fetchRequests();
        } catch {
            setMessage("Xóa thất bại!");
        }
    };

    if (!userId) return <div>Vui lòng đăng nhập để xem yêu cầu máu của bạn.</div>;
    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="user-blood-request-list-container">
            <h2>Yêu cầu máu của bạn</h2>
            {message && <div className="request-message">{message}</div>}
            {requests.length === 0 ? (
                <div>Bạn chưa có yêu cầu máu nào.</div>
            ) : (
                <table className="user-blood-request-table">
                    <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Nhóm máu</th>
                            <th>Thành phần</th>
                            <th>Số lượng</th>
                            <th>Trạng thái</th>
                            <th>Ngày yêu cầu</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.bloodGroup?.name || ""}</td>
                                <td>{r.bloodComponent || ""}</td>
                                <td>{r.quantity ?? r.amount}</td>
                                <td>{r.status}</td>
                                <td>{r.requestDate ? new Date(r.requestDate).toLocaleDateString() : ""}</td>
                                <td>
                                    <Link to={`/home/blood-request/${r.id}`}>Xem</Link>
                                    {r.status === "Pending" && isCurrentUser(r.requestedById) && (
                                        <button className="delete-btn" onClick={() => handleDelete(r.id, r.status, r.requestedById)}>Xóa</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserBloodRequestList;
