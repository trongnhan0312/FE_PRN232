// import React, { useEffect, useState } from 'react';
// import doctorService from '../../services/doctorService';

// const DoctorReport = () => {
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchReport = async () => {
//             try {
//                 const res = await doctorService.getReport();
//                 setReport(res.data);
//             } catch (err) {
//                 setReport(null);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchReport();
//     }, []);

//     if (loading) return <div>Đang tải báo cáo...</div>;
//     if (!report) return <div>Không có dữ liệu báo cáo.</div>;

//     return (
//         <div className="doctor-report">
//             <h2>Báo cáo thống kê</h2>
//             {/* Ví dụ: tổng số yêu cầu, số lượng máu đã cấp phát, v.v. */}
//             <ul>
//                 <li><b>Tổng số yêu cầu máu:</b> {report.totalRequests}</li>
//                 <li><b>Số lượng máu đã cấp phát:</b> {report.totalUnitsIssued}</li>
//                 <li><b>Số lượng máu còn lại:</b> {report.totalUnitsAvailable}</li>
//                 {/* Thêm các trường thống kê khác nếu cần */}
//             </ul>
//         </div>
//     );
// };

// export default DoctorReport;
