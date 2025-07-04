export const API_BASE_URL = "https://localhost:7286/api";

export const API_ENDPOINT = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/user-login`,
    DOCTOR_LOGIN: `${API_BASE_URL}/auth/employee-login`,
    REGISTER_USER: `${API_BASE_URL}/auth/register-user`,
    REGISTER_DOCTOR: `${API_BASE_URL}/auth/register-doctor`,
    CONFIRM_REGISTER: `${API_BASE_URL}/auth/confirm-register`,
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

  BLOGPOST: {
    CREATE: `${API_BASE_URL}/blogpost/create`,
    ALL: `${API_BASE_URL}/blogpost/all`, // lấy tất cả bài viết
    UPDATE: `${API_BASE_URL}/blogpost/update/{id}`,
    DELETE: `${API_BASE_URL}/blogpost/delete/{id}`,
    DETAIL: `${API_BASE_URL}/blogpost/{id}`,
  },
};
