import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllDonations } from "../../services/doctorService";
import "./DonationList.scss";

const DonationList = ({ onSelect }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donationsRes = await getAllDonations();
        setDonations(donationsRes.resultObj?.items || []);
      } catch (err) {
        console.error("[ERROR] fetchData:", err);
        setDonations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  console.log("donations", donations);
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
              donations.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.user?.fullName || "N/A"}</td>
                  <td>{item.user?.bloodGroup?.name || "N/A"}</td>
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
                  <td>{item.bloodRequest?.bloodComponent || "-"}</td>
                  <td>
                    {item.donationDate
                      ? new Date(item.donationDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{item.quantity || "?"} ML</td>
                  <td>{item.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationList;
