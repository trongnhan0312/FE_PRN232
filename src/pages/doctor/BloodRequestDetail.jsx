import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getBloodRequestById,
  getDonorAvailability,
  getBloodCompatibility,
  getBloodUnits,
  updateBloodUnit,
  updateBloodRequest, // ✅ Thêm
  createDonation,
} from "../../services/doctorService";
import "./BloodRequestDetail.scss";

const BloodRequestDetail = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const [donations, setDonations] = useState([]);
  const [loadingDonations, setLoadingDonations] = useState(false);

  const [bloodUnits, setBloodUnits] = useState([]);
  const [loadingUnits, setLoadingUnits] = useState(false);

  const [compatibleSet, setCompatibleSet] = useState(new Set());

  const normalize = (str) => (str || "").toLowerCase().replace(/\s+/g, "");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await getBloodRequestById(id);
        setDetail(res.resultObj);
      } catch (err) {
        console.error(err);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!detail) return;

    if (detail.status === "Pending") {
      fetchCompatibility();

      if (detail.requestSource === "FromDonor") {
        fetchDonors();
      }

      if (detail.requestSource === "FromStock") {
        fetchBloodUnits();
      }
    }
  }, [detail]);

  const fetchCompatibility = async () => {
    try {
      const res = await getBloodCompatibility({ pageSize: 1000 });
      const list = res.resultObj?.items || [];
      const set = new Set();

      list.forEach((item) => {
        if (item.isCompatible) {
          const key = `${normalize(
            item.recipientBloodGroupModelView?.name
          )}|${normalize(item.donorBloodGroupModelView?.name)}|${normalize(
            item.bloodComponent
          )}`;
          set.add(key);
        }
      });

      setCompatibleSet(set);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDonors = async () => {
    setLoadingDonations(true);
    try {
      const res = await getDonorAvailability({ pageSize: 100 });
      setDonations(res.resultObj?.items || []);
    } catch (err) {
      console.error(err);
      setDonations([]);
    } finally {
      setLoadingDonations(false);
    }
  };

  const fetchBloodUnits = async () => {
    setLoadingUnits(true);
    try {
      const res = await getBloodUnits({ pageSize: 100 });
      setBloodUnits(res.resultObj?.items || []);
    } catch (err) {
      console.error(err);
      setBloodUnits([]);
    } finally {
      setLoadingUnits(false);
    }
  };

  const isCompatible = (recipient, donor, component) => {
    const key = `${normalize(recipient)}|${normalize(donor)}|${normalize(
      component
    )}`;
    return compatibleSet.has(key);
  };

  const handleSelectDonor = async (donation) => {
    if (!window.confirm(`Xác nhận chọn người hiến #${donation.id}?`)) return;

    const model = {
      UserId: donation.user?.id,
      BloodRequestId: detail.id,
      Quantity: detail.quantity,
      DonationDate: new Date().toISOString(),
      Notes: `Chọn người hiến #${donation.id}`,
    };

    try {
      const result = await createDonation(model);
      if (!result.isSuccessed) {
        alert(`❌ BE báo lỗi: ${result.message}`);
        return;
      }
      alert("✅ Đã chọn người hiến thành công");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi tạo donation");
    }
  };

  const handleSelectUnit = async (unit) => {
    if (!window.confirm(`Xác nhận chọn đơn vị máu từ kho #${unit.id}?`)) return;

    const quantityRequest = detail.quantity;
    const quantityUnit = unit.quantity;

    if (quantityUnit < quantityRequest) {
      alert("❌ Đơn vị máu không đủ số lượng.");
      return;
    }

    try {
      // Cập nhật lại BloodRequest
      await updateBloodRequest(detail.id, {
        Quantity: 0,
        Status: "Completed",
        Notes: `Hoàn thành yêu cầu bằng đơn vị kho #${unit.id}`,
      });

      // Cập nhật lại BloodUnit
      await updateBloodUnit(unit.id, {
        bloodGroupId: unit.bloodGroup?.id,
        bloodComponent: unit.bloodComponent,
        quantity: quantityUnit - quantityRequest,
        expiryDate: unit.expiryDate,
      });

      alert("✅ Đã chọn đơn vị kho thành công");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi cập nhật kho & yêu cầu");
    }
  };

  if (loading) return <div>Đang tải chi tiết yêu cầu...</div>;
  if (!detail) return <div>Không tìm thấy yêu cầu máu.</div>;

  return (
    <div className="doctor-blood-request-detail">
      <h2>Chi tiết yêu cầu máu #{detail.id}</h2>

      <table className="detail-table">
        <tbody>
          <tr>
            <td>Bệnh nhân:</td>
            <td>{detail.requestedBy?.fullName || "N/A"}</td>
          </tr>
          <tr>
            <td>Nhóm máu:</td>
            <td>{detail.bloodGroup?.name || ""}</td>
          </tr>
          <tr>
            <td>Số lượng:</td>
            <td>{detail.quantity}</td>
          </tr>
          <tr>
            <td>Thành phần:</td>
            <td>{detail.bloodComponent}</td>
          </tr>
          <tr>
            <td>Trạng thái:</td>
            <td>{detail.status}</td>
          </tr>
          <tr>
            <td>Ngày yêu cầu:</td>
            <td>{new Date(detail.requestDate).toLocaleString()}</td>
          </tr>
          <tr>
            <td>Nguồn yêu cầu:</td>
            <td>{detail.requestSource}</td>
          </tr>
          <tr>
            <td>Ghi chú:</td>
            <td>{detail.notes || "-"}</td>
          </tr>
        </tbody>
      </table>

      {detail.status === "Pending" && detail.requestSource === "FromDonor" && (
        <>
          <h3>Danh sách người hiến</h3>
          {loadingDonations ? (
            <div>Đang tải danh sách hiến máu...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Người hiến</th>
                  <th>Nhóm máu</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((item) => {
                  const compatible = isCompatible(
                    detail.bloodGroup?.name,
                    item.user?.bloodGroup?.name,
                    detail.bloodComponent
                  );

                  return (
                    <tr
                      key={item.id}
                      className={compatible ? "compatible" : "incompatible"}
                    >
                      <td>{item.id}</td>
                      <td>{item.user?.fullName || "N/A"}</td>
                      <td>{item.user?.bloodGroup?.name || "N/A"}</td>
                      <td>
                        {item.availabilityDate
                          ? new Date(item.availabilityDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>{item.status || "-"}</td>
                      <td>
                        {compatible ? (
                          <button onClick={() => handleSelectDonor(item)}>
                            Chọn
                          </button>
                        ) : (
                          <span>Không phù hợp</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}

      {detail.status === "Pending" && detail.requestSource === "FromStock" && (
        <>
          <h3>Danh sách kho máu</h3>
          {loadingUnits ? (
            <div>Đang tải kho máu...</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Nhóm máu</th>
                  <th>Thành phần</th>
                  <th>Số Lượng ML</th>
                  <th>Ngày nhập kho</th>
                  <th>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {bloodUnits.map((unit) => {
                  const compatible = isCompatible(
                    detail.bloodGroup?.name,
                    unit.bloodGroup?.name,
                    unit.bloodComponent
                  );

                  return (
                    <tr
                      key={unit.id}
                      className={compatible ? "compatible" : "incompatible"}
                    >
                      <td>{unit.id}</td>
                      <td>{unit.bloodGroup?.name || "N/A"}</td>
                      <td>{unit.bloodComponent || "-"}</td>
                      <td>{unit.quantity || "0"} ML</td>
                      <td>
                        {unit.createdDate
                          ? new Date(unit.createdDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        {compatible ? (
                          <button onClick={() => handleSelectUnit(unit)}>
                            Chọn
                          </button>
                        ) : (
                          <span>Không phù hợp</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default BloodRequestDetail;
