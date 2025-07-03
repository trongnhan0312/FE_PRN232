export const API_BASE_URL = "https://localhost:7286/api";

export const API_ENDPOINT = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    OTP_VERIFICATION: `${API_BASE_URL}/auth/verify-otp`,
  },

  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/update`,
  },

  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  },

  DOCTOR: {
    DASHBOARD: `${API_BASE_URL}/doctor/dashboard`,
  },

  // Thêm các nhóm API khác ở đây nếu cần
};
