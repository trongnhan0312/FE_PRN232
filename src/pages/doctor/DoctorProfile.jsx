import React, { useEffect, useState } from 'react';
import doctorService from '../../services/doctorService';

const DoctorProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await doctorService.getProfile();
                setProfile(res.data);
            } catch (err) {
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div>Đang tải hồ sơ bác sĩ...</div>;
    if (!profile) return <div>Không tìm thấy hồ sơ.</div>;

    return (
        <div className="doctor-profile">
            <h2>Hồ sơ bác sĩ</h2>
            <ul>
                <li><b>Họ tên:</b> {profile.name}</li>
                <li><b>Email:</b> {profile.email}</li>
                <li><b>Chuyên khoa:</b> {profile.specialty}</li>
                <li><b>Số điện thoại:</b> {profile.phone}</li>
                {/* Thêm các trường khác nếu cần */}
            </ul>
        </div>
    );
};

export default DoctorProfile;
