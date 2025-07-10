import React, { useEffect, useState } from "react";
import { getBloodGroupsNoPaging } from "../../services/doctorService";
import "./BloodGroupLookup.scss";

const BloodGroupLookup = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getBloodGroupsNoPaging();
                setGroups(res.resultObj || []);
            } catch {
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div>Đang tải dữ liệu nhóm máu...</div>;
    return (
        <div className="blood-group-lookup-container">
            <h2>Tra cứu nhóm máu</h2>
            <table>
                <thead>
                    <tr>
                        <th>Mã nhóm</th>
                        <th>Tên nhóm máu</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((g) => (
                        <tr key={g.id}>
                            <td>{g.id}</td>
                            <td>{g.name}</td>
                            <td>{g.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BloodGroupLookup;
