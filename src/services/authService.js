import axiosInstance from "../config/axiosConfig";
import { setToken } from "../utils/auth";
import { API_ENDPOINT } from "../config/apiConfig";

/**
 * Gửi yêu cầu đăng nhập và xử lý phản hồi.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, message: string, role?: string }>}
 */
export const loginService = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT.AUTH.LOGIN, {
      email,
      password,
    });

    const result = response.data?.resultObj;

    if (response.data?.isSuccessed && result?.accessToken) {
      const { accessToken, accessTokenExpiredTime, role, email, fullName } =
        result;

      // ✅ Lưu token vào cookies
      setToken(accessToken);

      console.log("🟢 Login success:", {
        fullName,
        email,
        role,
        accessTokenExpiredTime,
      });

      const expireTime = new Date(accessTokenExpiredTime).getTime();
      const now = Date.now();
      const timeoutDuration = expireTime - now;

      if (timeoutDuration > 0) {
        setTimeout(() => {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        }, timeoutDuration);
      }

      return {
        success: true,
        role,
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    console.error("🔴 Login error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi đăng nhập",
    };
  }
};

/**
 * Gửi yêu cầu đăng nhập và xử lý phản hồi.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ success: boolean, message: string, role?: string }>}
 */
export const loginEmployeeService = async (email, password) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINT.AUTH.DOCTOR_LOGIN, {
      email,
      password,
    });

    const result = response.data?.resultObj;

    if (response.data?.isSuccessed && result?.accessToken) {
      const { accessToken, accessTokenExpiredTime, role, email, fullName } =
        result;

      // ✅ Lưu token vào cookies
      setToken(accessToken);

      console.log("🟢 Login success:", {
        fullName,
        email,
        role,
        accessTokenExpiredTime,
      });

      const expireTime = new Date(accessTokenExpiredTime).getTime();
      const now = Date.now();
      const timeoutDuration = expireTime - now;

      if (timeoutDuration > 0) {
        setTimeout(() => {
          alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          window.location.href = "/login";
        }, timeoutDuration);
      }

      return {
        success: true,
        role,
        message: "Đăng nhập thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đăng nhập thất bại",
    };
  } catch (error) {
    console.error("🔴 Login error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi đăng nhập",
    };
  }
};

/**
 * Gửi yêu cầu quên mật khẩu đến API
 * @param {string} email
 * @returns {Promise<{statusCode: number, message: string, isSuccessed: boolean, resultObj: any}>}
 */
export const forgotPasswordService = async (email) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.AUTH.FORGOT_PASSWORD,
      { email }
    );

    return response.data;
  } catch (error) {
    console.error("🔴 Forgot password error:", error);

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      statusCode: 500,
      message: "Có lỗi xảy ra, vui lòng thử lại.",
      isSuccessed: false,
      resultObj: null,
    };
  }
};
/**
 * Gửi yêu cầu đăng ký bác sĩ
 * @param {{ email: string, password: string, fullName: string, phoneNumber: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const registerDoctorService = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.AUTH.REGISTER_DOCTOR,
      data
    );

    if (response.data?.isSuccessed) {
      return {
        success: true,
        message: response.data?.message || "Đăng ký thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đăng ký thất bại",
    };
  } catch (error) {
    console.error("🔴 Register doctor error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi đăng ký",
    };
  }
};

/**
 * Gửi yêu cầu đăng ký người dùng
 * @param {{ email: string, password: string, fullName: string, phoneNumber: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const registerUserService = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.AUTH.REGISTER_USER,
      data
    );

    if (response.data?.isSuccessed) {
      return {
        success: true,
        message: response.data?.message || "Đăng ký thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đăng ký thất bại",
    };
  } catch (error) {
    console.error("🔴 Register user error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi đăng ký",
    };
  }
};
/**
 * Gửi yêu cầu xác nhận đăng ký
 * @param {{ email: string, code: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const confirmRegisterService = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.AUTH.CONFIRM_REGISTER,
      data
    );

    if (response.data?.isSuccessed) {
      return {
        success: true,
        message: response.data?.message || "Xác nhận đăng ký thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Xác nhận đăng ký thất bại",
    };
  } catch (error) {
    console.error("🔴 Confirm register error:", error);
    return {
      success: false,
      message: "Đã xảy ra lỗi khi xác nhận đăng ký",
    };
  }
};
/**
 * Gửi yêu cầu reset mật khẩu
 * @param {{ email: string, code: string, password: string, confirmPassword: string }} data
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const resetPasswordService = async (data) => {
  try {
    const response = await axiosInstance.post(
      API_ENDPOINT.AUTH.RESET_PASSWORD,
      data
    );

    if (response.data?.isSuccessed) {
      return {
        success: true,
        message: response.data?.message || "Đặt lại mật khẩu thành công",
      };
    }

    return {
      success: false,
      message: response.data?.message || "Đặt lại mật khẩu thất bại",
    };
  } catch (error) {
    console.error("🔴 Reset password error:", error);

    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data?.message || "Có lỗi xảy ra",
      };
    }

    return {
      success: false,
      message: "Có lỗi xảy ra, vui lòng thử lại.",
    };
  }
};
