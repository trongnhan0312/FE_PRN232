import React, { useState, useEffect } from "react";
import { createBloodRequest } from "../../services/bloodRequestService";
import { getBloodGroups } from "../../services/doctorService";

const BloodRequestForm = ({ userId, open, onClose }) => {
    const [bloodGroups, setBloodGroups] = useState([]);
    const [form, setForm] = useState({
        BloodGroupId: "",
        BloodComponent: "WholeBlood",
        Quantity: 1,
        IsEmergency: false,
        RequestedById: userId || "",
        Notes: "",
        RequestSource: "FromStock"
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!open) return;
        const fetchBloodGroups = async () => {
            try {
                const groups = await getBloodGroups({ pageNumber: 1, pageSize: 20 });
                setBloodGroups(groups);
            } catch (err) {
                setBloodGroups([]);
            }
        };
        fetchBloodGroups();
    }, [open]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const submitData = { ...form };
            const res = await createBloodRequest(submitData);
            if (res?.isSuccessed) {
                setMessage("Gửi yêu cầu hiến máu thành công!");
                setForm({
                    BloodGroupId: "",
                    BloodComponent: "WholeBlood",
                    Quantity: 1,
                    IsEmergency: false,
                    RequestedById: userId || "",
                    Notes: "",
                    RequestSource: "FromStock"
                });
            } else {
                setMessage(res?.message || "Gửi yêu cầu thất bại.");
            }
        } catch (err) {
            setMessage("Có lỗi xảy ra khi gửi yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(183,28,28,0.15)', border: '1px solid #eee', padding: 32, minWidth: 350, maxWidth: 500, width: '100%', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: '#b71c1c', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
                <h2 style={{ color: "#b71c1c", textAlign: "center", marginBottom: 24 }}>Đăng ký yêu cầu hiến máu</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 500 }}>Nhóm máu:</label>
                        <select name="BloodGroupId" value={form.BloodGroupId} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 4 }}>
                            <option value="">-- Chọn nhóm máu --</option>
                            {bloodGroups.map((bg) => (
                                <option key={bg.id} value={bg.id}>{bg.name}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 500 }}>Thành phần máu:</label>
                        <select name="BloodComponent" value={form.BloodComponent} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 4 }}>
                            <option value="WholeBlood">Toàn phần</option>
                            <option value="RedBloodCells">Hồng cầu</option>
                            <option value="Plasma">Huyết tương</option>
                            <option value="Platelets">Tiểu cầu</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: 18, display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontWeight: 500 }}>Số lượng (đơn vị):</label>
                            <input type="number" name="Quantity" min={1} value={form.Quantity} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 4 }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 28, marginLeft: 20 }}>
                            <input type="checkbox" name="IsEmergency" checked={form.IsEmergency} onChange={handleChange} id="emergency" style={{ marginRight: 6 }} />
                            <label htmlFor="emergency" style={{ color: '#b71c1c', fontWeight: 500 }}>Yêu cầu khẩn cấp</label>
                        </div>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 500 }}>Nguồn máu:</label>
                        <select name="RequestSource" value={form.RequestSource} onChange={handleChange} required style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 4 }}>
                            <option value="FromStock">Từ kho máu</option>
                            <option value="FromDonor">Từ người hiến</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ fontWeight: 500 }}>Ghi chú:</label>
                        <textarea name="Notes" value={form.Notes} onChange={handleChange} rows={2} style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc", marginTop: 4 }} />
                    </div>
                    <button type="submit" disabled={loading} style={{ background: "#b71c1c", color: "#fff", padding: "10px 0", border: 0, borderRadius: 6, width: "100%", fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
                        {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                    </button>
                    {message && <div style={{ marginTop: 18, color: message.includes("thành công") ? "green" : "red", textAlign: "center", fontWeight: 500 }}>{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default BloodRequestForm;
