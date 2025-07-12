
import React, { useEffect, useState } from "react";
import { getBloodCompatibility } from "../../services/doctorService";
import "./BloodCompatibilityLookup.scss";

const BloodCompatibilityLookup = () => {
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
            setData([]);
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
        <div className="blood-compatibility-lookup-container">
            <h2>Tra cứu tương thích máu</h2>
            {loading ? (
                <div className="bcl-loading">Đang tải dữ liệu tương thích máu...</div>
            ) : (
                <div className="bcl-table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Nhóm máu cho</th>
                                <th>Nhóm máu nhận</th>
                                <th>Thành phần máu</th>
                                <th>Tương thích</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.donorBloodGroupModelView?.name}</td>
                                    <td>{item.recipientBloodGroupModelView?.name}</td>
                                    <td>{item.bloodComponent}</td>
                                    <td>
                                        {item.isCompatible ? (
                                            <span className="bcl-yes">✅ Có</span>
                                        ) : (
                                            <span className="bcl-no">❌ Không</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="bcl-pagination">
                <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
                    ⬅️ Trang trước
                </button>
                <span>
                    Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
                </span>
                <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}>
                    Trang tiếp ➡️
                </button>
            </div>
        </div>
    );
};

export default BloodCompatibilityLookup;
