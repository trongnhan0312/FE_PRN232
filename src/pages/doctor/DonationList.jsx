import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllDonations,
  getBloodCompatibility,
} from "../../services/doctorService";
import "./DonationList.scss";

const DonationList = ({ onSelect }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compatibilityList, setCompatibilityList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [donationsRes, compatibilityRes] = await Promise.all([
          getAllDonations(),
          getBloodCompatibility({ pageSize: 100 }),
        ]);

        setDonations(donationsRes.resultObj?.items || []);
        setCompatibilityList(compatibilityRes.resultObj?.items || []);
      } catch (err) {
        console.error("[ERROR] fetchData:", err);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalize = (str) => (str || "").toLowerCase().trim();

  const isCompatible = (recipient, donor, component) => {
    const r = normalize(recipient);
    const c = normalize(component);
    const d = normalize(donor);

    if (!r || !c || !d) {
      console.warn(
        `[WARN] Missing values: recipient=${r}, donor=${d}, component=${c}`
      );
      return false;
    }

    const result = compatibilityList.some((item) => {
      const donorGroup = normalize(item.donorBloodGroupModelView?.name);
      const recipientGroup = normalize(item.recipientBloodGroupModelView?.name);
      const comp = normalize(item.bloodComponent);

      const recipientMatch = recipientGroup === r;
      const donorMatch = donorGroup === d;
      const componentMatch = comp === c;
      const isCompat = item.isCompatible;

      console.log(
        `[CHECK] recipient: ${r} (${recipientMatch}) | donor: ${d} (${donorMatch}) | component: ${c} (${componentMatch}) | isCompatible: ${isCompat}`
      );

      return recipientMatch && donorMatch && componentMatch && isCompat;
    });

    console.log(
      `=> isCompatible(${recipient}, ${donor}, ${component}) = ${result}`
    );

    return result;
  };

  if (loading) {
    return (
      <div className="donation-loading">Đang tải danh sách hiến máu...</div>
    );
  }

  return (
    <div className="donation-list-container">
      <h2 style={{ color: "red", textAlign: "center" }}>
        Danh sách người hiến máu
      </h2>
      <div className="donation-table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Mã hiến máu</th>
              <th>Người hiến</th>
              <th>Nhóm máu người hiến</th>
              <th>Người nhận</th>
              <th>Yêu cầu máu</th>
              <th>Thành phần</th>
              <th>Ngày hiến</th>
              <th>Số lượng</th>
              <th>Ghi chú</th>
              <th>Chọn</th>
            </tr>
          </thead>
          <tbody>
            {donations.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", color: "#888" }}>
                  Không có người hiến.
                </td>
              </tr>
            ) : (
              donations.map((item) => {
                const donorGroup = item.user?.bloodGroup?.name || "";
                const recipientGroup =
                  item.bloodRequest?.requestedBy?.bloodGroup?.name || "";
                const component = item.bloodRequest?.bloodComponent || "";

                const compatible = isCompatible(
                  recipientGroup,
                  donorGroup,
                  component
                );

                return (
                  <tr
                    key={item.id}
                    className={compatible ? "compatible" : "incompatible"}
                  >
                    <td>{item.id}</td>
                    <td>{item.user?.fullName || "N/A"}</td>
                    <td>{donorGroup || "N/A"}</td>
                    <td>{item.bloodRequest?.requestedBy?.fullName || "N/A"}</td>
                    <td>
                      <Link
                        to={`/doctor/blood-requests/detail/${item.bloodRequest?.id}`}
                        className="blood-request-link"
                      >
                        #{item.bloodRequest?.id} —{" "}
                        {item.bloodRequest?.bloodGroup?.name || "?"} (
                        {item.bloodRequest?.quantity || "?"} đơn vị)
                      </Link>
                    </td>
                    <td>{component || "-"}</td>
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
                          onClick={() => onSelect(item)}
                          className="select-button"
                        >
                          Chọn
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationList;
