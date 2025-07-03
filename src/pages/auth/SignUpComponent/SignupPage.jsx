import React, { useState, useRef, useEffect } from "react";
import "./SignupPage.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../utils/router";
import {
  registerUserService,
  registerDoctorService,
  confirmRegisterService,
} from "../../../services/authService";
import { toast } from "react-toastify";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef([]);

  const navigate = useNavigate();

  // Initialize refs for OTP inputs
  useEffect(() => {
    otpInputRefs.current = otpInputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (
      password.length < 10 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Vui lòng nhập họ tên";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!acceptTerms) {
      newErrors.terms = "Vui lòng đồng ý với điều khoản";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    const data = {
      email: formData.email,
      password: formData.password,
      fullName: formData.name,
      phoneNumber: formData.phone,
    };
    try {
      let result;
      if (formData.role === "Doctor") {
        result = await registerDoctorService(data);
      } else {
        result = await registerUserService(data);
      }
      if (result.success) {
        // Instead of redirecting to login, show OTP verification
        setShowOtpVerification(true);
      } else {
        toast.success(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Clear error when typing
    if (otpError) setOtpError("");

    // Auto focus to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if pasted content is numeric and has correct length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6);
      const newOtpValues = [...otpValues];

      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtpValues[index] = digit;
        }
      });

      setOtpValues(newOtpValues);

      // Focus on the next empty field or the last field
      const nextEmptyIndex = newOtpValues.findIndex((val) => !val);
      if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
        otpInputRefs.current[nextEmptyIndex].focus();
      } else if (digits.length < 6) {
        otpInputRefs.current[digits.length].focus();
      } else {
        otpInputRefs.current[5].focus();
      }
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("");

    if (otpCode.length !== 6) {
      setOtpError("Vui lòng nhập đủ 6 số");
      return;
    }

    setIsLoading(true);

    try {
      const result = await confirmRegisterService({
        email: formData.email,
        code: otpCode,
      });

      if (result.success) {
        toast.success(result.message || "Xác thực thành công!");
        navigate(ROUTER.LOGIN);
      } else {
        toast.error(result.message || "Mã xác thực không chính xác");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Đã xảy ra lỗi khi xác thực");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      let result;
      const data = {
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        phoneNumber: formData.phone,
      };

      if (formData.role === "Doctor") {
        result = await registerDoctorService(data);
      } else {
        result = await registerUserService(data);
      }

      if (result.success) {
        toast.success("Mã xác thực đã được gửi lại!");
      } else {
        toast.error(result.message || "Không thể gửi lại mã xác thực!");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Đã xảy ra lỗi khi gửi lại mã xác thực");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate(ROUTER.LOGIN);
  };

  if (showOtpVerification) {
    return (
      <div className="signup-container">
        <div className="signup-form">
          <h2>Xác thực tài khoản</h2>
          <p className="description">
            Vui lòng nhập mã xác thực 6 số đã được gửi đến email{" "}
            {formData.email}
          </p>

          <div className="otp-container">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={otpValues[index]}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="otp-input"
                  disabled={isLoading}
                />
              ))}
          </div>

          {otpError && <div className="input-error otp-error">{otpError}</div>}

          <button
            type="button"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            onClick={handleVerifyOtp}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </button>

          <div className="resend-otp">
            Không nhận được mã?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="resend-button"
            >
              Gửi lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Đăng ký</h2>
        <p className="description">
          Tạo tài khoản mới để bắt đầu sử dụng dịch vụ của chúng tôi
        </p>
        <form onSubmit={handleSubmit}>
          <div className={`input-group ${errors.name ? "error" : ""}`}>
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
          </div>
          <div className={`input-group ${errors.email ? "error" : ""}`}>
            <input
              type="email"
              name="email"
              placeholder="Địa chỉ email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          <div className={`input-group ${errors.phone ? "error" : ""}`}>
            <input
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.phone && <div className="input-error">{errors.phone}</div>}
          </div>
          <div
            className={`input-group password-group ${
              errors.password ? "error" : ""
            }`}
          >
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? "👁️‍🗨️" : "👁️"}
            </button>
            {errors.password && (
              <div className="input-error">{errors.password}</div>
            )}
          </div>
          {formData.password && (
            <div className="password-strength">
              <div className="strength-label">Độ mạnh mật khẩu:</div>
              <div className="strength-bar">
                <div className={`strength-fill ${passwordStrength}`}></div>
              </div>
              <div className={`strength-text ${passwordStrength}`}>
                {passwordStrength === "weak" && "Yếu"}
                {passwordStrength === "medium" && "Trung bình"}
                {passwordStrength === "strong" && "Mạnh"}
              </div>
            </div>
          )}
          <div className="input-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="User">Người dùng</option>
              <option value="Doctor">Bác sĩ</option>
            </select>
          </div>
          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              Tôi đồng ý với <a href="#terms">Điều khoản sử dụng</a> và{" "}
              <a href="#privacy">Chính sách bảo mật</a>
            </label>
          </div>
          {errors.terms && (
            <div
              className="input-error"
              style={{ marginTop: "-15px", marginBottom: "15px" }}
            >
              {errors.terms}
            </div>
          )}
          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        <div className="login-link">
          Đã có tài khoản?
          <a href="#login" onClick={handleLoginRedirect}>
            Đăng nhập ngay
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
