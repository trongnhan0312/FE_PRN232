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
    PROFILE: `${API_BASE_URL}/users/`, // GET /users/{id}
    UPDATE_PROFILE: `${API_BASE_URL}/users/update-user-profile`, // PUT /users/update-user-profile
    ALL: `${API_BASE_URL}/users/all`, // GET /users/all
  },

  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  },

  DOCTOR: {
    DASHBOARD: `${API_BASE_URL}/doctor/dashboard`,
  },

  BLOGPOST: {
    CREATE: `${API_BASE_URL}/blogpost/create`,
    ALL: `${API_BASE_URL}/blogpost/all`,
    UPDATE: `${API_BASE_URL}/blogpost/update/{id}`,
    DELETE: `${API_BASE_URL}/blogpost/delete/{id}`,
    DETAIL: `${API_BASE_URL}/blogpost/{id}`,
  },
  BLOOD_GROUP: {
    ALL: `${API_BASE_URL}/bloodgroup/all`,
    ALL_NOPAGING: `${API_BASE_URL}/bloodgroup/all/nopaging`,
    DETAIL: `${API_BASE_URL}/bloodgroup/{id}`,
    CREATE: `${API_BASE_URL}/bloodgroup/create`,
    UPDATE: `${API_BASE_URL}/bloodgroup/update/{id}`,
    DELETE: `${API_BASE_URL}/bloodgroup/delete/{id}`,
  },
  BLOOD_COMPATIBILITY: {
    ALL: `${API_BASE_URL}/bloodcompatibility/all`,
    DETAIL: `${API_BASE_URL}/bloodcompatibility/{id}`,
    CREATE: `${API_BASE_URL}/bloodcompatibility/create`,
    UPDATE: `${API_BASE_URL}/bloodcompatibility/update/{id}`,
    DELETE: `${API_BASE_URL}/bloodcompatibility/delete/{id}`,
  },
  BLOOD_UNIT: {
    ALL: `${API_BASE_URL}/bloodunit/all`,
    ALL_NOPAGING: `${API_BASE_URL}/bloodunit/all/nopaging`,
    CREATE: `${API_BASE_URL}/bloodunit/create`,
    UPDATE: `${API_BASE_URL}/bloodunit/update/{id}`,
    DELETE: `${API_BASE_URL}/bloodunit/delete/{id}`,
    DETAIL: `${API_BASE_URL}/bloodunit/{id}`,
  },
  BLOOD_REQUEST: {
    ALL: `${API_BASE_URL}/bloodrequest/all`,
    ALL_NOPAGING: `${API_BASE_URL}/bloodrequest/all/nopaging`,
    DETAIL: `${API_BASE_URL}/bloodrequest/{id}`,
    CREATE: `${API_BASE_URL}/bloodrequest/create`,
    UPDATE: `${API_BASE_URL}/bloodrequest/update/{id}`,
    DELETE: `${API_BASE_URL}/bloodrequest/delete/{id}`,
  },
  DONATION: {
    ALL: `${API_BASE_URL}/donation/all`,
    ALL_NOPAGING: `${API_BASE_URL}/donation/all/nopaging`,
    DETAIL: `${API_BASE_URL}/donation/{id}`,
    CREATE: `${API_BASE_URL}/donation/create`,
    UPDATE: `${API_BASE_URL}/donation/update/{id}`,
    DELETE: `${API_BASE_URL}/donation/delete/{id}`,
  },
  DONOR_AVAILABILITY: {
    ALL: `${API_BASE_URL}/donoravailability/all`,
    ALL_NOPAGING: `${API_BASE_URL}/donoravailability/all/nopaging`,
    DETAIL: `${API_BASE_URL}/donoravailability/{id}`,
    CREATE: `${API_BASE_URL}/donoravailability/create`,
    UPDATE: `${API_BASE_URL}/donoravailability/update/{id}`,
    DELETE: `${API_BASE_URL}/donoravailability/delete/{id}`,
  },
  EMPLOYEE: {
    CREATE: `${API_BASE_URL}/employee/create`,
    UPDATE: `${API_BASE_URL}/employee/update-doctor-profile`,
    UPDATE_STATUS: `${API_BASE_URL}/employee/update-status`,
    DELETE: `${API_BASE_URL}/employee/delete`,
    GET_DOCTORS_PAGINATION: `${API_BASE_URL}/employee/get-doctors-pagination`,
    GET_ALL_DOCTORS: `${API_BASE_URL}/employee/get-all-doctors`,
    GET_ALL_EMPLOYEE: `${API_BASE_URL}/employee/get-all`,
    DETAIL: `${API_BASE_URL}/employee/{id}`,
  },
};
