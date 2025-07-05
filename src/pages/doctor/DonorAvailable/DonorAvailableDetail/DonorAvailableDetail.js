import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDonorAvailabilityById } from "../../../../services/doctorService";
import "./style.scss";

const DonorAvailableDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    getDonorAvailabilityById(id)
      .then((res) => {
        if (res.isSuccessed) setData(res.resultObj);
      })
      .catch(console.error);
  }, [id]);

  if (!data) return <p>Đang tải...</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="donor-detail">
      <h1>Chi tiết người hiến máu</h1>
      <div className="card">
        <img
          src={data.user.avatarUrl}
          alt={data.user.fullName}
          className="avatar"
        />
        <div className="info">
          <p>
            <strong>Họ tên:</strong> {data.user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {data.user.email}
          </p>
          <p>
            <strong>Điện thoại:</strong>{" "}
            {data.user.phoneNumber || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Ngày sinh:</strong> {formatDate(data.user.dateOfBirth)}
          </p>
          <p>
            <strong>Giới tính:</strong> {data.user.gender || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Nhóm máu:</strong>{" "}
            {data.user.bloodGroup?.name || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {data.user.address || "Chưa cập nhật"}
          </p>
          <p>
            <strong>Ngày hiến máu gần nhất:</strong>{" "}
            {formatDate(data.user.lastDonationDate)}
          </p>
          <p>
            <strong>Tình trạng tài khoản:</strong>{" "}
            {data.user.status ? (
              <span className="active">Đang hoạt động</span>
            ) : (
              <span className="inactive">Ngưng hoạt động</span>
            )}
          </p>
          <p>
            <strong>Thời gian có thể hiến từ:</strong>{" "}
            {formatDate(data.availableFrom)}
          </p>
          <p>
            <strong>Đến:</strong> {formatDate(data.availableTo)}
          </p>
          <p>
            <strong>Trạng thái đăng ký:</strong>{" "}
            {data.isActive ? (
              <span className="active">Còn hiệu lực</span>
            ) : (
              <span className="inactive">Hết hiệu lực</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonorAvailableDetail;
