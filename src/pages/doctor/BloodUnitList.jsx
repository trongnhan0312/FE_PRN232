import React, { useEffect, useState } from 'react';
import bloodUnitService from '../../services/bloodUnitService';

const BloodUnitList = () => {
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUnits = async () => {
            try {
                const res = await bloodUnitService.getAllBloodUnits();
                setUnits(res.data || []);
            } catch (err) {
                setUnits([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUnits();
    }, []);

    if (loading) return <div>Đang tải kho máu...</div>;

    return (
        <div className="doctor-blood-unit-list">
            <h2>Kho máu</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Mã đơn vị máu</th>
                        <th>Nhóm máu</th>
                        <th>Số lượng</th>
                        <th>Ngày nhập</th>
                    </tr>
                </thead>
                <tbody>
                    {units.map((unit) => (
                        <tr key={unit.id}>
                            <td>{unit.id}</td>
                            <td>{unit.bloodGroup}</td>
                            <td>{unit.amount}</td>
                            <td>{unit.importedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BloodUnitList;
