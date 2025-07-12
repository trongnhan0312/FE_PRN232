import React, { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "../../utils/auth";
import { getUserProfile, updateUserProfile, getBloodGroupsNoPaging } from "../../services/doctorService";
import { User, Camera, Edit, Save, X, Phone, Calendar, Users, Droplets, CheckCircle, AlertCircle, Loader } from "lucide-react";
import "./UserProfile.scss";

const UserProfile = () => {
    const user = getCurrentUser();
    const userId = user?.id;
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({});
    const [originalForm, setOriginalForm] = useState({});
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [bloodGroups, setBloodGroups] = useState([]);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const fileInputRef = useRef();

    useEffect(() => {
        if (!userId) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const [profileRes, bloodGroupRes] = await Promise.all([
                    getUserProfile(userId),
                    getBloodGroupsNoPaging()
                ]);
                if (profileRes.resultObj) {
                    const profileData = profileRes.resultObj;
                    setProfile(profileData);
                    const formData = {
                        id: profileData?.id,
                        fullName: profileData?.fullName || "",
                        phoneNumber: profileData?.phoneNumber || "",
                        dateOfBirth: profileData?.dateOfBirth ? profileData.dateOfBirth.substring(0, 10) : "",
                        gender: profileData?.gender || "",
                        bloodGroupId: profileData?.bloodGroup?.id || "",
                    };
                    setForm(formData);
                    setOriginalForm(formData);
                    setAvatarPreview(profileData?.avatarUrl || "");
                }
                setBloodGroups(bloodGroupRes.resultObj || []);
            } catch (error) {
                setProfile(null);
                showMessage("Không thể tải dữ liệu hồ sơ", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const validateForm = () => {
        const errors = {};
        if (!form.fullName?.trim()) {
            errors.fullName = "Họ tên là bắt buộc";
        } else if (form.fullName.trim().length < 2) {
            errors.fullName = "Họ tên phải có ít nhất 2 ký tự";
        }
        if (form.phoneNumber && !/^[0-9+\-\s()]*$/.test(form.phoneNumber)) {
            errors.phoneNumber = "Số điện thoại không hợp lệ";
        }
        if (form.dateOfBirth) {
            const birthDate = new Date(form.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 0 || age > 150) {
                errors.dateOfBirth = "Ngày sinh không hợp lệ";
            }
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const showMessage = (msg, type = "success") => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
        }, 5000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showMessage("Ảnh không được vượt quá 5MB", "error");
                return;
            }
            if (!file.type.startsWith('image/')) {
                showMessage("Chỉ chấp nhận file ảnh", "error");
                return;
            }
            setForm(prev => ({ ...prev, avatarFile: file }));
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleEdit = () => {
        setEdit(true);
        setMessage("");
        setFormErrors({});
    };

    const handleCancel = () => {
        setEdit(false);
        setForm(originalForm);
        setAvatarPreview(profile?.avatarUrl || "");
        setMessage("");
        setFormErrors({});
    };

    const hasChanges = () => {
        return JSON.stringify(form) !== JSON.stringify(originalForm) || form.avatarFile;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showMessage("Vui lòng kiểm tra lại thông tin", "error");
            return;
        }
        if (!hasChanges()) {
            showMessage("Không có thay đổi nào để lưu", "info");
            return;
        }
        setSaving(true);
        setMessage("");
        try {
            const res = await updateUserProfile({
                ...form,
                avatarFile: form.avatarFile
            });
            if (res?.isSuccessed) {
                showMessage("Cập nhật thành công!", "success");
                setEdit(false);
                // Reload profile data
                const profileRes = await getUserProfile(form.id);
                if (profileRes.resultObj) {
                    const profileData = profileRes.resultObj;
                    setProfile(profileData);
                    const newFormData = {
                        id: profileData?.id,
                        fullName: profileData?.fullName || "",
                        phoneNumber: profileData?.phoneNumber || "",
                        dateOfBirth: profileData?.dateOfBirth ? profileData.dateOfBirth.substring(0, 10) : "",
                        gender: profileData?.gender || "",
                        bloodGroupId: profileData?.bloodGroup?.id || "",
                    };
                    setForm(newFormData);
                    setOriginalForm(newFormData);
                    setAvatarPreview(profileData?.avatarUrl || "");
                }
            } else {
                showMessage(res?.message || "Cập nhật thất bại", "error");
            }
        } catch (error) {
            showMessage("Có lỗi xảy ra khi cập nhật", "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="user-profile-message">Đang tải hồ sơ...</div>;
    }
    if (!profile) {
        return <div className="user-profile-message">Không tìm thấy hồ sơ.</div>;
    }
    return (
        <div className="user-profile-fancy">
            <div className="upf-card">
                <div className="upf-header">
                    <div className="upf-avatar-block">
                        <div className="upf-avatar-wrapper">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" className="upf-avatar-img" />
                            ) : (
                                <User className="upf-avatar-img" />
                            )}
                            {edit && (
                                <button
                                    type="button"
                                    className="upf-avatar-upload-btn"
                                    onClick={() => fileInputRef.current.click()}
                                    title="Đổi ảnh đại diện"
                                >
                                    <Camera />
                                </button>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="upf-name-block">
                            {edit ? (
                                <input
                                    name="fullName"
                                    value={form.fullName || ""}
                                    onChange={handleChange}
                                    className="upf-fullname-input"
                                    placeholder="Họ tên"
                                    required
                                    autoFocus
                                />
                            ) : (
                                <div className="upf-fullname">{form.fullName || "-"}</div>
                            )}
                            <div className="upf-blood-group">
                                <Droplets size={18} style={{ marginRight: 4 }} />
                                {profile?.bloodGroup?.name || "-"}
                            </div>
                        </div>
                    </div>
                </div>
                <form className="upf-form" encType="multipart/form-data" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                    <div className="upf-info-grid">
                        {/* Họ tên đã chuyển lên avatar block */}
                        <div className="upf-info-item">
                            <span className="upf-label"><Phone size={16} /> Số điện thoại</span>
                            <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} disabled={!edit} className={edit ? "edit-mode" : ""} />
                            {formErrors.phoneNumber && <div className="form-error">{formErrors.phoneNumber}</div>}
                        </div>
                        <div className="upf-info-item">
                            <span className="upf-label"><Calendar size={16} /> Ngày sinh</span>
                            <input name="dateOfBirth" type="date" value={form.dateOfBirth || ""} onChange={handleChange} disabled={!edit} className={edit ? "edit-mode" : ""} />
                            {formErrors.dateOfBirth && <div className="form-error">{formErrors.dateOfBirth}</div>}
                        </div>
                        <div className="upf-info-item">
                            <span className="upf-label"><Users size={16} /> Giới tính</span>
                            <select name="gender" value={form.gender || ""} onChange={handleChange} disabled={!edit} className={edit ? "edit-mode" : ""}>
                                <option value="">Chọn</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                        <div className="upf-info-item">
                            <span className="upf-label"><Droplets size={16} /> Nhóm máu</span>
                            {edit ? (
                                <select name="bloodGroupId" value={form.bloodGroupId || ""} onChange={handleChange} className="edit-mode">
                                    <option value="">Chọn nhóm máu</option>
                                    {bloodGroups.map(bg => (
                                        <option key={bg.id} value={bg.id}>{bg.name}</option>
                                    ))}
                                </select>
                            ) : (
                                <input value={profile.bloodGroup?.name || ""} disabled />
                            )}
                        </div>
                    </div>
                    <div className="upf-btn-group">
                        {edit ? (
                            <>
                                <button type="submit" className="upf-save-btn" disabled={saving}>{saving ? <Loader size={18} className="spin" /> : <Save size={18} />} Lưu</button>
                                <button type="button" className="upf-cancel-btn" onClick={handleCancel}><X size={18} /> Hủy</button>
                            </>
                        ) : (
                            <button type="button" className="upf-edit-btn" onClick={handleEdit}><Edit size={18} /> Chỉnh sửa</button>
                        )}
                    </div>
                </form>
                {message && <div className={`upf-message ${messageType}`}>{messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {message}</div>}
            </div>
        </div>
    );
};

export default UserProfile;