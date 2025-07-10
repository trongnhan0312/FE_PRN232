export const ROUTER = {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    OTP_VERIFICATION: "/otp-verification",
    ADMIN: "/admin",

    DOCTOR: {
        HOME: "/doctor",
        PROFILE: "/doctor/profile",
        BLOG: "/doctor/blog",
        BLOG_DETAIL: "/doctor/blog/:id",
        DONATION: "/doctor/donation",
        REQUEST: "/doctor/request",
        BLOOD_GROUP: "/doctor/blood-group",
        COMPATIBILITY: "/doctor/compatibility",
        BLOOD_UNIT: "/doctor/blood-unit",
        DONOR_AVAILABLE: "/doctor/donor-available",
        DONOR_AVAILABLE_DETAIL: "/doctor/donor-available-detail/:id", // sửa: thêm :id
    },

    USER: {
        HOME: "/home",
        PROFILE: "/home/profile",
        BOOKING: "/home/booking",
        HISTORY: "/home/history",
        BLOOD_REQUESTS: "/home/blood-requests",
        BLOOD_REQUEST_DETAIL: "/home/blood-request/:id",
        DONATION_HISTORY: "/home/donation-history",
        DONOR_AVAILABLE: "/home/donor-available",
        BLOOD_GROUP_LOOKUP: "/home/blood-group-lookup",
        BLOOD_COMPATIBILITY_LOOKUP: "/home/blood-compatibility-lookup",
    },
};
