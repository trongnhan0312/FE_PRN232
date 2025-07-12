import React, { useState, useEffect } from "react";
import BloodRequestForm from "./BloodRequestForm";
import { getCurrentUser } from "../../utils/auth";
import BlogList from "../doctor/BlogPost/BlogList";
import { Link } from "react-router-dom";
import { getUserDonations } from "../../services/doctorService";

const HomePage = () => {
  const user = getCurrentUser();
  const userId = user?.id || "";
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoadingDonations(true);
    getUserDonations(userId, { pageNumber: 1, pageSize: 5 })
      .then((res) => {
        setDonations(res?.items || []);
        setLoadingDonations(false);
      })
      .catch(() => setLoadingDonations(false));
  }, [userId]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ color: '#b71c1c' }}>Hệ thống hỗ trợ hiến máu cơ sở y tế</h1>
      <p>
        Chào mừng bạn đến với hệ thống hỗ trợ hiến máu! Đây là nền tảng giúp kết nối người hiến máu, người cần máu và cơ sở y tế một cách nhanh chóng, minh bạch và hiệu quả.
      </p>
      <h2>Chức năng dành cho bạn</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <Link to="/home/blood-requests" style={cardStyle}>Yêu cầu máu của bạn</Link>
        <Link to="/home/donation-history" style={cardStyle}>Lịch sử hiến máu</Link>
        <Link to="/home/donor-available" style={cardStyle}>Kiểm tra điều kiện hiến máu</Link>
        <Link to="/home/profile" style={cardStyle}>Hồ sơ cá nhân</Link>
        <Link to="/home/blood-group-lookup" style={cardStyle}>Tra cứu nhóm máu</Link>
        <Link to="/home/blood-compatibility-lookup" style={cardStyle}>Tra cứu tương thích máu</Link>
        <button onClick={() => setShowRequestForm(true)} style={{ ...cardStyle, cursor: 'pointer', border: 'none', background: '#b71c1c', color: '#fff' }}>Tạo yêu cầu máu mới</button>
      </div>
      {/* Lịch sử hiến máu */}
      <section id="donation-history">
        <h2 style={{ color: '#1976d2' }}>Lịch sử hiến máu gần đây</h2>
        {loadingDonations ? (
          <div>Đang tải...</div>
        ) : donations.length === 0 ? (
          <div>Bạn chưa có lịch sử hiến máu.</div>
        ) : (
          <table style={{ width: '100%', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', marginBottom: 32 }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={thStyle}>Ngày hiến</th>
                <th style={thStyle}>Nhóm máu</th>
                <th style={thStyle}>Số lượng (ml)</th>
                <th style={thStyle}>Người nhận</th>
                <th style={thStyle}>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((item) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{formatDate(item.donationDate)}</td>
                  <td style={tdStyle}>{item.user?.bloodGroup?.name || "-"}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>{item.bloodRequest?.requestedBy?.fullName || "-"}</td>
                  <td style={tdStyle}>{item.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      {/* Section Blog */}
      <section id="blog">
        <h2 style={{ color: '#1976d2' }}>Blog chia sẻ & kiến thức</h2>
        <BlogList />
      </section>
      {/* Popup Form Đăng ký yêu cầu máu */}
      <BloodRequestForm userId={userId} open={showRequestForm} onClose={() => setShowRequestForm(false)} />
    </div>
  );
};

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
}

const cardStyle = {
  display: 'inline-block',
  padding: '16px 24px',
  background: '#f5f5f5',
  borderRadius: 8,
  textDecoration: 'none',
  color: '#b71c1c',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  minWidth: 180,
  textAlign: 'center',
  transition: 'all 0.2s',
};

const thStyle = { padding: 8, fontWeight: 700, color: '#b71c1c', background: '#f5f5f5', borderBottom: '1px solid #eee' };
const tdStyle = { padding: 8, textAlign: 'center', borderBottom: '1px solid #f0f0f0' };

export default HomePage;
