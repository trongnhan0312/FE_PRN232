import React from "react";
import "./DoctorHomePage.scss";

const DoctorHomePage = ({ doctorName = "Dr. John Doe" }) => {
  return (
    <div className="doctor-home">
      <h1>
        Welcome, <span>{doctorName}</span> 👋
      </h1>

      <div className="stats">
        <div className="stat-card">
          <h2>15</h2>
          <p>Patients Today</p>
        </div>
        <div className="stat-card">
          <h2>8</h2>
          <p>Blood Requests</p>
        </div>
        <div className="stat-card">
          <h2>5</h2>
          <p>Donations Today</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorHomePage;
