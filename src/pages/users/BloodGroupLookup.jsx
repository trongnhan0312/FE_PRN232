import React, { useEffect, useState } from "react";
import { getBloodGroupsNoPaging } from "../../services/doctorService";
import "./BloodGroupLookup.scss";
import { Droplets } from "lucide-react";

const BloodGroupLookup = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getBloodGroupsNoPaging();
                // Reverse the groups order before setting state
                setGroups((res.resultObj || []).slice().reverse());
            } catch {
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="bgl-message">Đang tải dữ liệu nhóm máu...</div>;
    return (
        <div className="blood-group-lookup-fancy">
            <div className="bgl-card">
                <div className="bgl-header">
                    <Droplets size={32} style={{ color: '#d32f2f', marginRight: 8 }} />
                    <h2>Tra cứu nhóm máu</h2>
                </div>
                <div className="bgl-list">
                    {groups.length === 0 ? (
                        <div className="bgl-message">Không có dữ liệu nhóm máu.</div>
                    ) : (
                        groups.map((g) => (
                            <div className="bgl-item" key={g.id}>
                                <div className="bgl-badge">{g.name}</div>
                                <div className="bgl-id">Mã: <span>{g.id}</span></div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BloodGroupLookup;
