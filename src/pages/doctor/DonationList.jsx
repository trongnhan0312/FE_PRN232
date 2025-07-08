import React, { useEffect, useState } from 'react';
import { getAllDonations } from '../../services/doctorService';
import './DonationList.scss';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await getAllDonations();
                setDonations(res.resultObj?.items || []);
            } catch (err) {
                setDonations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) return <div className="donation-loading">Đang tải danh sách hiến máu...</div>;

    return (
        <div className="donation-list-container">
            <h2 className="donation-title">Danh sách hiến máu</h2>
            <div className="donation-table-wrapper">
                <table className="donation-table">
                    <thead>
                        <tr>
                            <th>Mã hiến máu</th>
                            <th>Người hiến</th>
                            <th>Yêu cầu máu</th>
                            <th>Ngày hiến</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>
                                    Không có dữ liệu hiến máu.
                                </td>
                            </tr>
                        ) : (
                            donations.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.donorName || item.user?.fullName || ''}</td>
                                    <td>{item.bloodRequestId}</td>
                                    <td>{item.donationDate?.substring(0, 10) || ''}</td>
                                    <td>{item.amount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DonationList;
