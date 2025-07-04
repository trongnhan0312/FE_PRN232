import { memo } from "react";
import HeaderDoctor from "../headerDoctor";
import FooterDoctor from "../footerDoctor";
import { Outlet } from "react-router-dom";

const DoctorLayout = () => (
  <div>
    <HeaderDoctor />
    <main>
      <Outlet />
    </main>
    <FooterDoctor />
  </div>
);

export default memo(DoctorLayout);
