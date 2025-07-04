import React, { useEffect, useState } from "react";
import "./style.scss";
import { getBloodCompatibility } from "../../../services/doctorService";

const BloodCompatibility = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCompatibility = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getBloodCompatibility({ pageNumber, pageSize: 10 });
      if (res?.isSuccessed) {
        setData(res.resultObj.items);
        setPage(res.resultObj.currentPage);
        setTotalPages(res.resultObj.totalPages);
      }
    } catch (err) {
      console.error("Error fetching blood compatibility", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompatibility();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchCompatibility(newPage);
  };

  return (
    <div className="blood-compatibility">
      <h1>🔗 Danh sách tương thích nhóm máu</h1>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Recipient</th>
                <th>Component</th>
                <th>Compatible</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.donorBloodGroupModelView.name}</td>
                  <td>{item.recipientBloodGroupModelView.name}</td>
                  <td>{item.bloodComponent}</td>
                  <td>
                    {item.isCompatible ? (
                      <span className="yes">✅ Có</span>
                    ) : (
                      <span className="no">❌ Không</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default BloodCompatibility;
