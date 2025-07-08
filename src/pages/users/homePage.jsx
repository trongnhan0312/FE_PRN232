import React, { useState } from "react";
import BloodRequestForm from "./BloodRequestForm";
import { getCurrentUser } from "../../utils/auth";
import BlogList from "../doctor/BlogPost/BlogList";

const HomePage = () => {
  const user = getCurrentUser();
  const userId = user?.id || "";
  const [showRequestForm, setShowRequestForm] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ color: '#b71c1c' }}>Hệ thống hỗ trợ hiến máu cơ sở y tế</h1>
      <p>
        Chào mừng bạn đến với hệ thống hỗ trợ hiến máu! Đây là nền tảng giúp kết nối người hiến máu, người cần máu và cơ sở y tế một cách nhanh chóng, minh bạch và hiệu quả.
      </p>
      <h2>Chức năng nổi bật</h2>
      <ul>
        <li>📚 <b>Tài liệu về các loại máu</b>: Tìm hiểu về các nhóm máu, thành phần máu và kiến thức truyền máu an toàn.</li>
        <li>📝 <b>Blog chia sẻ kinh nghiệm</b>: Đọc các bài viết, chia sẻ từ cộng đồng và chuyên gia.</li>
        <li>🩸 <b>Đăng ký hiến máu</b>: Đăng ký nhóm máu, thời điểm sẵn sàng hiến máu.</li>
        <li>🔍 <b>Tra cứu nhóm máu phù hợp</b>: Tìm kiếm thông tin nhóm máu phù hợp cho truyền máu toàn phần hoặc từng thành phần máu.</li>
        <li>📍 <b>Tìm kiếm theo khoảng cách</b>: Kết nối người cần máu và người hiến máu gần bạn.</li>
        <li>🚨 <b>Đăng ký trường hợp cần máu khẩn cấp</b>: Hỗ trợ các ca cấp cứu cần máu gấp.</li>
        <li>📦 <b>Quản lý đơn vị máu</b>: Theo dõi số lượng máu hiện có tại cơ sở y tế.</li>
        <li>⏰ <b>Nhắc nhở phục hồi</b>: Nhắc nhở thời gian phục hồi giữa các lần hiến máu.</li>
        <li>👤 <b>Quản lý hồ sơ & lịch sử hiến máu</b>: Xem lại thông tin cá nhân và lịch sử hiến máu.</li>
        <li>📊 <b>Dashboard & Báo cáo</b>: Thống kê, báo cáo hoạt động hiến máu.</li>
      </ul>
      <h2>Khám phá thêm</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <a href="#blood-info" style={cardStyle}>Tài liệu nhóm máu</a>
        <a href="#blog" style={cardStyle}>Blog chia sẻ</a>
        <button onClick={() => setShowRequestForm(true)} style={{ ...cardStyle, cursor: 'pointer', border: 'none', background: '#b71c1c', color: '#fff' }}>Đăng ký hiến máu</button>
        <a href="#search-blood" style={cardStyle}>Tra cứu nhóm máu</a>
        <a href="#emergency" style={cardStyle}>Đăng ký cần máu khẩn cấp</a>
        <a href="#profile" style={cardStyle}>Hồ sơ cá nhân</a>
        <a href="#dashboard" style={cardStyle}>Dashboard & Báo cáo</a>
      </div>
      {/* Section Blog */}
      <section id="blog">
        <BlogList />
      </section>
      {/* Popup Form Đăng ký yêu cầu hiến máu */}
      <BloodRequestForm userId={userId} open={showRequestForm} onClose={() => setShowRequestForm(false)} />
    </div>
  );
};

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
};

export default HomePage;
