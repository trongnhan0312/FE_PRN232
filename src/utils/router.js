export const ROUTER = {
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  OTP_VERIFICATION: "/otp-verification",
  ADMIN: "/admin",

  DOCTOR: {
    HOME: "/doctor", // trang chủ bác sĩ
    PROFILE: "/doctor/profile",
    BLOG: "/doctor/blog",
    BLOG_DETAIL: "/doctor/blog/:id", // chi tiết bài viết bác sĩ
    DONATION: "/doctor/donation",
    REQUEST: "/doctor/request",
    BLOOD_GROUP: "/doctor/blood-group",
    COMPATIBILITY: "/doctor/compatibility",
    BLOOD_UNIT: "/doctor/blood-unit",
    DONOR_AVAILABLE: "/doctor/donor-available",
  },

  USER: {
    HOME: "/home", // trang chủ user
    PROFILE: "/home/profile",
    BOOKING: "/home/booking",
    HISTORY: "/home/history",
  },
};
