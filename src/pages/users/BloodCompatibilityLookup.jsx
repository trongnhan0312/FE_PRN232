import React, { useEffect, useState } from "react";
import { getBloodCompatibility } from "../../services/doctorService";
import "./BloodCompatibilityLookup.scss";

const BloodCompatibilityLookup = () => {
    const [compatibilities, setCompatibilities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getBloodCompatibility({ pageNumber: 1, pageSize: 200 });
                setCompatibilities(res.resultObj?.items || []);
            } catch {
                setCompatibilities([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div>Đang tải dữ liệu tương thích máu...</div>;
    return (
        <div className="blood-compatibility-lookup-container fancy">
            <h2>Tra cứu tương thích máu</h2>
            <table>
                <thead>
                    <tr>
                        <th>Thành phần máu</th>
                        <th>Nhóm máu cho</th>
                        <th>Nhóm máu nhận</th>
                        <th>Tương thích</th>
                    </tr>
                </thead>
                <tbody>
                    {compatibilities.map((c, idx) => (
                        <tr key={idx} className={c.isCompatible ? "compatible" : "not-compatible"}>
                            <td>{c.bloodComponent}</td>
                            <td>{c.donorBloodGroupModelView?.name}</td>
                            <td>{c.recipientBloodGroupModelView?.name}</td>
                            <td>{c.isCompatible ? <span style={{ color: '#388e3c', fontWeight: 600 }}>✔ Có</span> : <span style={{ color: '#d32f2f', fontWeight: 600 }}>✘ Không</span>}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BloodCompatibilityLookup;
