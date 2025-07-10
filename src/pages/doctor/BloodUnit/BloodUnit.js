import React, { useEffect, useState } from "react";
import {
  getBloodUnits,
  createBloodUnit,
  updateBloodUnit,
  deleteBloodUnit,
  getBloodGroups,
} from "../../../services/doctorService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./style.scss";

const BloodUnit = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [components] = useState([
    "WholeBlood",
    "RedBloodCell",
    "Plasma",
    "Platelets",
  ]);
  const [form, setForm] = useState({
    id: null,
    bloodGroupId: "",
    bloodComponent: "",
    quantity: "",
    expiryDate: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getBloodUnits({ pageNumber, pageSize: 5 });
      if (res?.isSuccessed) {
        setData(res.resultObj.items);
        setPage(res.resultObj.currentPage);
        setTotalPages(res.resultObj.totalPages);
      }
    } catch (err) {
      console.error("Error fetching data", err);
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const fetchBloodGroups = async () => {
    try {
      const items = await getBloodGroups({ pageNumber: 1, pageSize: 20 });
      setBloodGroups(items || []);
    } catch (err) {
      console.error("Error fetching blood groups", err);
      toast.error("Không thể tải nhóm máu");
    }
  };

  useEffect(() => {
    fetchData();
    fetchBloodGroups();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.bloodGroupId ||
      !form.bloodComponent ||
      !form.quantity ||
      !form.expiryDate
    ) {
      toast.warning("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      if (form.id) {
        await updateBloodUnit(form.id, form);
        toast.success("Cập nhật thành công!");
      } else {
        await createBloodUnit(form);
        toast.success("Thêm mới thành công!");
      }
      setForm({
        id: null,
        bloodGroupId: "",
        bloodComponent: "",
        quantity: "",
        expiryDate: "",
      });
      fetchData(page);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra!");
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      bloodGroupId: item.bloodGroup.id,
      bloodComponent: item.bloodComponent,
      quantity: item.quantity,
      expiryDate: item.expiryDate.substring(0, 10),
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn xoá không?")) return;
    try {
      await deleteBloodUnit(id);
      toast.success("Xoá thành công!");
      fetchData(page);
    } catch (err) {
      console.error(err);
      toast.error("Xoá thất bại!");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchData(newPage);
  };

  return (
    <div className="blood-unit">
      <h1>🩸 Quản lý đơn vị máu</h1>

      <div className="form">
        {/* nhóm máu */}
        <select
          name="bloodGroupId"
          value={form.bloodGroupId}
          onChange={handleChange}
        >
          <option value="">Chọn nhóm máu</option>
          {bloodGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {/* thành phần */}
        <select
          name="bloodComponent"
          value={form.bloodComponent}
          onChange={handleChange}
        >
          <option value="">Chọn thành phần</option>
          {components.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Số lượng"
          value={form.quantity}
          onChange={handleChange}
        />
        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>
          {form.id ? "Cập nhật" : "Thêm mới"}
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nhóm máu</th>
                <th>Thành phần</th>
                <th>Số lượng</th>
                <th>HSD</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.bloodGroup.name}</td>
                  <td>{item.bloodComponent}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {new Date(item.expiryDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)}>✏️</button>
                    <button onClick={() => handleDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          ⬅️ Trang trước
        </button>
        <span>
          Trang <strong>{page}</strong> / <strong>{totalPages}</strong>
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Trang tiếp ➡️
        </button>
      </div>
    </div>
  );
};

export default BloodUnit;
