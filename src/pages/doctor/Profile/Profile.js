import React, { useEffect, useState } from "react";
import "./style.scss";
import { toast } from "react-toastify";
import {
  getEmployeeProfile,
  updateEmployeeProfile,
} from "../../../services/employeeSerivce";
import { getBloodGroups } from "../../../services/doctorService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bloodGroups, setBloodGroups] = useState([]);

  const fetchProfile = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

    if (!userData.id) {
      toast.error(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }

    setLoading(true);
    try {
      const [profileRes, bloodGroupRes] = await Promise.all([
        getEmployeeProfile(userData.id),
        getBloodGroups({ pageNumber: 1, pageSize: 20 }),
      ]);

      if (profileRes.isSuccessed) {
        const fetchedProfile = profileRes.resultObj;
        // Nếu có bloodGroup thì set sẵn bloodGroupId
        if (fetchedProfile.bloodGroup?.id) {
          fetchedProfile.bloodGroupId = fetchedProfile.bloodGroup.id;
        }
        setProfile(fetchedProfile);
      } else {
        toast.error("❌ Không thể lấy thông tin hồ sơ");
      }

      if (Array.isArray(bloodGroupRes)) {
        setBloodGroups(bloodGroupRes);
      } else {
        toast.error("❌ Không thể lấy danh sách nhóm máu");
      }
    } catch (err) {
      console.error("❌ Lỗi khi lấy dữ liệu:", err);
      toast.error("Lỗi khi lấy dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        avatarFile: file,
        avatarUrl: previewUrl,
      }));
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("Id", profile.id);
      formData.append("FullName", profile.fullName || "");
      formData.append("PhoneNumber", profile.phoneNumber || "");
      formData.append("DateOfBirth", profile.dateOfBirth || "");
      formData.append("Gender", profile.gender || "");
      formData.append("BloodGroupId", profile.bloodGroupId || "");

      if (profile.avatarFile) {
        formData.append("AvatarUrl", profile.avatarFile);
      }

      console.log("📦 Dữ liệu gửi đi:", [...formData.entries()]);

      const res = await updateEmployeeProfile(formData);

      if (res.isSuccessed) {
        toast.success("Cập nhật thành công");
        fetchProfile();
      } else {
        toast.error("❌ Cập nhật thất bại");
      }
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật:", err);
      toast.error("Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile">Đang tải hồ sơ...</div>;
  if (!profile) return <div className="profile">Không có dữ liệu hồ sơ</div>;

  return (
    <div className="profile">
      <h1>👤 Hồ sơ cá nhân</h1>
      <div className="profile-card">
        <div className="avatar">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" />
          ) : (
            <div className="placeholder">No Avatar</div>
          )}

          <button
            type="button"
            className="edit-avatar"
            onClick={() => document.getElementById("avatar-input").click()}
          >
            Chọn ảnh
          </button>

          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="info">
          <label>
            <strong>Họ tên:</strong>
            <input
              name="fullName"
              value={profile.fullName || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            <strong>Email:</strong>
            <input name="email" value={profile.email || ""} disabled />
          </label>

          <label>
            <strong>Số điện thoại:</strong>
            <input
              name="phoneNumber"
              value={profile.phoneNumber || ""}
              onChange={handleChange}
            />
          </label>

          <label>
            <strong>Ngày sinh:</strong>
            <input
              type="date"
              name="dateOfBirth"
              value={
                profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : ""
              }
              onChange={handleChange}
            />
          </label>

          <label>
            <strong>Giới tính:</strong>
            <select
              name="gender"
              value={profile.gender || ""}
              onChange={handleChange}
            >
              <option value="">Chọn</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </label>

          <label>
            <strong>Nhóm máu:</strong>
            <select
              name="bloodGroupId"
              value={profile.bloodGroupId || ""}
              onChange={handleChange}
            >
              <option value="">Chọn nhóm máu</option>
              {bloodGroups.map((bg) => (
                <option key={bg.id} value={bg.id}>
                  {bg.name}
                </option>
              ))}
            </select>
          </label>

          <p>
            <strong>Vai trò:</strong> {profile.role?.name}
          </p>

          <p>
            <strong>Trạng thái:</strong>{" "}
            {profile.status ? (
              <span className="active">✅ Hoạt động</span>
            ) : (
              <span className="inactive">❌ Không hoạt động</span>
            )}
          </p>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ marginTop: "1rem" }}
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
