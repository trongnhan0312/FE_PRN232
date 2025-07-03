import { memo } from "react";
import HeaderDoctor from "../headerDoctor";
import FooterDoctor from "../footerDoctor";

const DoctorLayout = ({ children }) => (
  <div>
    <HeaderDoctor />
    {children}
    <FooterDoctor />
  </div>
);

export default memo(DoctorLayout);
