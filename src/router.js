import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRoles } from "./utils/auth";
import { ROUTER } from "./utils/router";

import MasterLayout from "./component/common/theme/masterLayout";
import DoctorLayout from "./component/common/theme/DoctorLayout";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpComponent/SignupPage";
import OtpVerificationPage from "./pages/EmailComponentUtil/OtpVerificationPage";
import ForgotPasswordPage from "./pages/auth/ForgetPassword/ForgotPassword";
import ResetPassword from "./pages/auth/ForgetPassword/ResetPassword/ResetPassword";

import HomePage from "./pages/users/homePage";
import DoctorHomePage from "./pages/doctor/DoctorhomePage";
import DoctorBlogPost from "./pages/doctor/BlogPost/";
import BlogDetail from "./pages/doctor/BlogPost/BlogDetail";
import BloodGroup from "./pages/doctor/BloodGroup/BloodGroup";
import BloodCompatibility from "./pages/doctor/BloodCompatibility/BloodCompatibility";
import BloodUnit from "./pages/doctor/BloodUnit/BloodUnit";
import DonorAvailable from "./pages/doctor/DonorAvailable/DonorAvailable";
import DonorAvailableDetail from "./pages/doctor/DonorAvailable/DonorAvailableDetail/DonorAvailableDetail";
import Profile from "./pages/doctor/Profile/Profile";
import BloodRequestList from "./pages/doctor/BloodRequestList";
import BloodRequestDetail from "./pages/doctor/BloodRequestDetail";
import DonationList from "./pages/doctor/DonationList";

const RouterCustom = () => {
    const location = useLocation();
    const key =
        location.pathname + location.search + localStorage.getItem("roles");

    const roles = getUserRoles();
    const isLoggedIn = isAuthenticated();

    const isAdmin = roles.includes("admin");
    const isDoctor = roles.includes("doctor");

    return (
        <Routes key={key}>
            <Route path={ROUTER.LOGIN} element={<LoginPage />} />
            <Route path={ROUTER.REGISTER} element={<SignupPage />} />
            <Route
                path={ROUTER.OTP_VERIFICATION}
                element={<OtpVerificationPage />}
            />
            <Route
                path={ROUTER.FORGOT_PASSWORD}
                element={<ForgotPasswordPage />}
            />
            <Route path={ROUTER.RESET_PASSWORD} element={<ResetPassword />} />

            <Route
                path="/"
                element={
                    isLoggedIn ? (
                        isAdmin ? (
                            <Navigate to={ROUTER.ADMIN} replace />
                        ) : isDoctor ? (
                            <Navigate to={ROUTER.DOCTOR.HOME} replace />
                        ) : (
                            <Navigate to={ROUTER.USER.HOME} replace />
                        )
                    ) : (
                        <Navigate to={ROUTER.LOGIN} replace />
                    )
                }
            />

            <Route
                path={ROUTER.DOCTOR.HOME}
                element={
                    isLoggedIn && isDoctor ? (
                        <DoctorLayout />
                    ) : (
                        <Navigate to={ROUTER.LOGIN} replace />
                    )
                }
            >
                <Route index element={<DoctorHomePage />} />
                <Route path="blog" element={<DoctorBlogPost />} />
                <Route path="blog/:id" element={<BlogDetail />} />
                <Route path="blood-group" element={<BloodGroup />} />
                <Route path="compatibility" element={<BloodCompatibility />} />
                <Route path="blood-unit" element={<BloodUnit />} />
                <Route path="profile" element={<Profile />} />
                <Route path="donor-available" element={<DonorAvailable />} />
                <Route
                    path="donor-available-detail/:id"
                    element={<DonorAvailableDetail />}
                />
                <Route path="blood-requests" element={<BloodRequestList />} />
                <Route
                    path="blood-requests/detail/:id"
                    element={<BloodRequestDetail />}
                />
                <Route path="donations" element={<DonationList />} />
            </Route>

            <Route
                path={ROUTER.USER.HOME}
                element={
                    isLoggedIn ? (
                        <MasterLayout />
                    ) : (
                        <Navigate to={ROUTER.LOGIN} replace />
                    )
                }
            >
                <Route index element={<HomePage />} />
            </Route>

            <Route path="*" element={<Navigate to={ROUTER.LOGIN} replace />} />
        </Routes>
    );
};

export default RouterCustom;
