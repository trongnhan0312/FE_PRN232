import React, { useState, useRef, useEffect } from "react";
import "./ResetPassword.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../../utils/router";

const ResetPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOtpSuccess, setIsOtpSuccess] = useState(false);
  const [isPasswordSuccess, setIsPasswordSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  // New password states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Lấy email từ localStorage
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  
  const inputRefs = useRef([]);

  useEffect(() => {
    // Lấy email từ localStorage
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      // Nếu không có email, chuyển về trang forgot password
      navigate(ROUTER.FORGOT_PASSWORD);
    }
  }, [navigate]);

  useEffect(() => {
    // Start countdown timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < digits.length && i < 6; i++) {
          newOtp[i] = digits[i];
        }
        setOtp(newOtp);
        
        // Focus last filled input or next empty
        const lastIndex = Math.min(digits.length, 5);
        inputRefs.current[lastIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await verifyOtpService(email, otpString);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulate validation - thay thế bằng logic thực tế
      if (otpString === "123456") {
        setIsOtpSuccess(true);
      } else {
        setError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    checkPasswordStrength(value);
    
    // Clear errors
    if (passwordErrors.newPassword) {
      setPasswordErrors(prev => ({ ...prev, newPassword: "" }));
    }
    if (passwordErrors.confirmPassword && confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    // Clear confirm password error
    if (passwordErrors.confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validatePasswords = () => {
    const errors = {};

    if (!newPassword) {
      errors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) return;

    setIsLoading(true);
    setError("");

    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await resetPasswordService(email, newPassword);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setIsPasswordSuccess(true);
      // Clear email from localStorage
      localStorage.removeItem("resetEmail");
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setCanResend(false);
    setResendTimer(60);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    
    try {
      // TODO: Thay thế bằng API call thực tế
      // const response = await forgotPasswordService(email);
      
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP resent successfully to:", email);
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError("Không thể gửi lại OTP. Vui lòng thử lại.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  const handleBackToForgot = () => {
    // Xóa email khỏi localStorage và quay lại trang forgot password
    localStorage.removeItem("resetEmail");
    navigate(ROUTER.FORGOT_PASSWORD);
  };

  const handleBackToLogin = () => {
    navigate(ROUTER.LOGIN);
  };

  // Final success state
  if (isPasswordSuccess) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h2>Đặt lại mật khẩu thành công!</h2>
          <p className="success-description">
            Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có thể đăng nhập với mật khẩu mới.
          </p>
          <button
            type="button"
            className="continue-button"
            onClick={handleBackToLogin}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  // New password form state
  if (isOtpSuccess) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-form">
          <h2>Tạo mật khẩu mới</h2>
          <p className="description">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
          <div className="email-display">
            <svg className="email-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline
                points="22,6 12,13 2,6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            {email}
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className={`input-group password-group ${passwordErrors.newPassword ? 'error' : ''}`}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={handleNewPasswordChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showNewPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              {passwordErrors.newPassword && <div className="input-error">{passwordErrors.newPassword}</div>}
            </div>

            {newPassword && (
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

            <div className={`input-group password-group ${passwordErrors.confirmPassword ? 'error' : ''}`}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
              {passwordErrors.confirmPassword && <div className="input-error">{passwordErrors.confirmPassword}</div>}
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !newPassword || !confirmPassword}
            >
              {isLoading ? '' : 'Đặt lại mật khẩu'}
            </button>
          </form>

          <button type="button" className="back-button" onClick={handleBackToForgot}>
            <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // OTP verification form (original)
  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Nhập mã xác thực</h2>
        <p className="description">
          Chúng tôi đã gửi mã xác thực 6 số đến email
        </p>
        <div className="email-display">
          <svg className="email-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline
              points="22,6 12,13 2,6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          {email}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`otp-input ${error ? "error" : ""} ${
                  digit ? "filled" : ""
                }`}
                disabled={isLoading}
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || otp.join("").length !== 6}
          >
            {isLoading ? "" : "Xác thực"}
          </button>
        </form>

        <div className="resend-section">
          <p className="resend-text">Không nhận được mã?</p>
          <button
            type="button"
            className={`resend-button ${canResend ? "active" : ""}`}
            onClick={handleResendOtp}
            disabled={!canResend}
          >
            {canResend ? "Gửi lại mã" : `Gửi lại sau ${resendTimer}s`}
          </button>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={handleBackToForgot}
        >
          <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Quay lại
        </button>

        <div className="info-box">
          <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          Mã OTP có hiệu lực trong 10 phút. Kiểm tra thư mục spam nếu không thấy
          email.
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;