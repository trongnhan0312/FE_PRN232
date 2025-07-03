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
