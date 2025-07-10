import React, { useEffect, useState } from "react";
import {
  getAllBloodRequests,
  deleteBloodRequest,
} from "../../services/doctorService";
import { Link } from "react-router-dom";
import "./BloodRequestList.scss";

const BloodRequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá?")) return;
    try {
      await deleteBloodRequest(id);
      fetchRequests();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  if (loading)
    return (
      <div className="blood-request-loading">
        Đang tải danh sách yêu cầu máu...
      </div>
    );
  console.log("requests", requests);
  return (
    <div className="blood-request-list-container">
      <h2 className="blood-request-title">Danh sách yêu cầu máu</h2>
      <div className="blood-request-table-wrapper">
        <table className="blood-request-table">
          <thead>
            <tr>
              <th>Mã yêu cầu</th>
              <th>Người yêu cầu</th>
              <th>Nhóm máu</th>
              <th>Số lượng</th>
              <th>Nguồn yêu cầu</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#888" }}>
                  Không có yêu cầu máu nào.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>{req.requestedBy?.fullName || "N/A"}</td>
                  <td>{req.bloodGroup?.name || ""}</td>
                  <td>{req.quantity}</td>
                  <td>{req.requestSource}</td>
                  <td>
                    <span
                      className={`status-badge status-${req.status?.toLowerCase()}`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === "Pending" ? (
                      <>
                        <Link
                          className="detail-link"
                          to={`/doctor/blood-requests/detail/${req.id}`}
                        >
                          Xử lý
                        </Link>
                        <button onClick={() => handleDelete(req.id)}>
                          Xoá
                        </button>
                      </>
                    ) : (
                      <Link
                        className="detail-link"
                        to={`/doctor/blood-requests/detail/${req.id}`}
                      >
                        Chi tiết
                      </Link>
                    )}
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
