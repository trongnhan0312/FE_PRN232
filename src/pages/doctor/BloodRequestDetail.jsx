import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getBloodRequestById,
  updateBloodRequest,
  getAllDonations,
  getBloodCompatibility,
} from "../../services/doctorService";
import "./BloodRequestDetail.scss";

const BloodRequestDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [compatibilityList, setCompatibilityList] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getBloodRequestById(id);
        setDetail(res.resultObj);
      } catch (err) {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (detail?.status === "Pending" && detail?.requestSource === "FromDonor") {
      fetchDonationsAndCompatibility();
    }
  }, [detail]);

  const fetchDonationsAndCompatibility = async () => {
    setLoadingDonations(true);
    try {
      const [donationsRes, compatibilityRes] = await Promise.all([
        getAllDonations(),
        getBloodCompatibility({ pageSize: 100 }),
      ]);

      setDonations(donationsRes.resultObj?.items || []);
      setCompatibilityList(compatibilityRes.resultObj?.items || []);
    } catch (err) {
      console.error(err);
      setDonations([]);
    } finally {
      setLoadingDonations(false);
    }
  };

  const normalize = (str) => (str || "").toLowerCase().trim();

  const isCompatible = (recipient, donor, component) => {
    const result = compatibilityList.some((item) => {
      const recipientMatch =
        normalize(item.recipientBloodGroupModelView?.name) ===
        normalize(recipient);
      const donorMatch =
        normalize(item.donorBloodGroupModelView?.name) === normalize(donor);
      const componentMatch =
        normalize(item.bloodComponent) === normalize(component);
      const compatible = item.isCompatible;

      console.log(
        `[CHECK] recipient: ${recipient} (${recipientMatch}), donor: ${donor} (${donorMatch}), component: ${component} (${componentMatch}), isCompatible: ${compatible}`
      );

      return recipientMatch && donorMatch && componentMatch && compatible;
    });

    console.log(
      `=> isCompatible(${recipient}, ${donor}, ${component}) = ${result}`
    );

    return result;
  };

  const handleSelectDonor = async (donation) => {
    if (!window.confirm(`Xác nhận chọn người hiến #${donation.id}?`)) return;
    try {
      await updateBloodRequest(detail.id, {
        status: "Fulfilled",
        notes: `Chọn người hiến #${donation.id}`,
      });
      alert("✅ Đã chọn người hiến thành công");
      window.location.reload();
    } catch (err) {
      alert("❌ Lỗi khi cập nhật yêu cầu");
    }
  };

  if (loading) return <div>Đang tải chi tiết yêu cầu...</div>;
  if (!detail) return <div>Không tìm thấy yêu cầu máu.</div>;

  return (
    <div className="doctor-blood-request-detail">
      <h2>Chi tiết yêu cầu máu #{detail.id}</h2>
      <ul>
        <li>
          <b>Bệnh nhân:</b> {detail.requestedBy?.fullName || "N/A"}
        </li>
        <li>
          <b>Nhóm máu:</b> {detail.bloodGroup?.name || ""}
        </li>
        <li>
          <b>Số lượng:</b> {detail.quantity}
        </li>
        <li>
          <b>Thành phần:</b> {detail.bloodComponent}
        </li>
        <li>
          <b>Trạng thái:</b> {detail.status}
        </li>
        <li>
          <b>Ngày yêu cầu:</b> {new Date(detail.requestDate).toLocaleString()}
        </li>
        <li>
          <b>Nguồn yêu cầu:</b> {detail.requestSource}
        </li>
        <li>
          <b>Ghi chú:</b> {detail.notes || "-"}
        </li>
      </ul>

      {detail.status === "Pending" && detail.requestSource === "FromDonor" && (
        <>
          {loadingDonations ? (
            <div>Đang tải danh sách hiến máu...</div>
          ) : (
            donations.length > 0 && (
              <div className="donation-table-wrapper">
                <table className="donation-table">
                  <thead>
                    <tr>
                      <th>Mã hiến máu</th>
                      <th>Người hiến</th>
                      <th>Nhóm máu người hiến</th>
                      <th>Yêu cầu máu</th>
                      <th>Thành phần</th>
                      <th>Ngày hiến</th>
                      <th>Số lượng</th>
                      <th>Ghi chú</th>
                      <th>Chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((item) => {
                      const donorGroup = item.user?.bloodGroup?.name;
                      const compatible = isCompatible(
                        detail.bloodGroup?.name,
                        donorGroup,
                        detail.bloodComponent
                      );

                      return (
                        <tr
                          key={item.id}
                          className={compatible ? "compatible" : "incompatible"}
                        >
                          <td>{item.id}</td>
                          <td>{item.user?.fullName || "N/A"}</td>
                          <td>{donorGroup || "N/A"}</td>
                          <td>
                            <Link
                              to={`/doctor/blood-requests/detail/${item.bloodRequest?.id}`}
                            >
                              #{item.bloodRequest?.id} —{" "}
                              {item.bloodRequest?.bloodGroup?.name || "?"} (
                              {item.bloodRequest?.quantity || "?"} đơn vị)
                            </Link>
                          </td>
                          <td>{item.bloodRequest?.bloodComponent}</td>
                          <td>
                            {item.donationDate
                              ? new Date(item.donationDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>{item.quantity || "?"} ML</td>
                          <td>{item.notes || "-"}</td>
                          <td>
                            {compatible && (
                              <button
                                onClick={() => handleSelectDonor(item)}
                                className="select-button"
                              >
                                Chọn
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}
        </>
      )}

      {detail.status === "Pending" && detail.requestSource === "FromStock" && (
        <p style={{ color: "blue" }}>
          Yêu cầu lấy từ kho. Bạn cần chọn đơn vị máu từ kho (phần này có thể
          thêm UI riêng).
        </p>
      )}
    </div>
  );
};

export default BloodRequestDetail;
