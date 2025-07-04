import React, { useEffect, useState } from "react";
import { getBloodGroups } from "../../../services/doctorService";
import "./style.scss";

const BloodGroup = () => {
  const [bloodGroups, setBloodGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBloodGroups = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getBloodGroups({ pageNumber, pageSize: 5 });
      if (res?.isSuccessed) {
        setBloodGroups(res.resultObj.items);
        setPage(res.resultObj.currentPage);
        setTotalPages(res.resultObj.totalPages);
      }
    } catch (error) {
      console.error("❌ Error fetching blood groups", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodGroups();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchBloodGroups(newPage);
  };

  return (
    <div className="blood-group">
      <h1>🩸 Danh sách nhóm máu</h1>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <div className="blood-group-list">
          {bloodGroups.map((group) => (
            <div key={group.id} className="blood-group-card">
              <span>{group.name}</span>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          ⬅️ Trang trước
        </button>

        <span>
          Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Trang tiếp ➡️
        </button>
      </div>
    </div>
  );
};

export default BloodGroup;
