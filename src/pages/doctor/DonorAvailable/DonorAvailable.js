import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import { getDonorAvailability } from "../../../services/doctorService";
import { ROUTER } from "../../../utils/router";

const DonorAvailable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputName, setInputName] = useState("");

  const navigate = useNavigate();

  const fetchData = async (name) => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const res = await getDonorAvailability({
        userName: name,
        pageNumber: 1,
        pageSize: 20,
      });
      if (res.isSuccessed && res.resultObj?.items?.length > 0) {
        setData(res.resultObj.items);
      } else {
        setError("Không có dữ liệu");
      }
    } catch (err) {
      setError("Lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchData(inputName.trim());
  };

  useEffect(() => {
    fetchData(""); // load all khi khởi động
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa cập nhật";
    return new Date(dateStr).toLocaleDateString();
  };

  const handleClick = (id) => {
    navigate(ROUTER.DOCTOR.DONOR_AVAILABLE_DETAIL.replace(":id", id));
  };

  return (
    <div className="donor-available">
      <h1>Thông tin người hiến máu</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Nhập userName..."
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {loading && <p className="loading">Đang tải...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {data.map((item) => (
          <div
            className="card"
            key={item.id}
            onClick={() => handleClick(item.id)}
          >
            <div className="avatar-container">
              {item.user.avatarUrl ? (
                <img
                  src={item.user.avatarUrl}
                  alt={item.user.fullName}
                  className="avatar"
                />
              ) : (
                <div className="no-avatar">Chưa có</div>
              )}
            </div>

            <div className="info">
              <h2>{item.user.fullName}</h2>

              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{item.user.email}</span>
              </div>

              <div className="info-item">
                <span className="label">Điện thoại:</span>
                <span className="value">
                  {item.user.phoneNumber || "Chưa cập nhật"}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Ngày sinh:</span>
                <span className="value">
                  {formatDate(item.user.dateOfBirth)}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Giới tính:</span>
                <span className="value">
                  {item.user.gender || "Chưa cập nhật"}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Nhóm máu:</span>
                <span className="value blood-group">
                  {item.user.bloodGroup?.name || "Chưa cập nhật"}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Tình trạng:</span>
                <span
                  className={`value ${
                    item.user.status ? "active" : "inactive"
                  }`}
                >
                  {item.user.status ? "Đang hoạt động" : "Ngưng hoạt động"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorAvailable;
