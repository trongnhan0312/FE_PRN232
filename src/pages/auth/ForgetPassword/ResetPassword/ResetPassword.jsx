import React, { useState, useRef, useEffect } from "react";
import "./ResetPassword.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../../utils/router";
import { resetPasswordService } from "../../../../services/authService";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      navigate(ROUTER.FORGOT_PASSWORD);
    }
  }, [navigate]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordErrors.newPassword) {
      setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (passwordErrors.confirmPassword) {
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.join("").length !== 6) {
      setError("Vui lòng nhập đầy đủ OTP");
      return;
    }

    if (!validatePasswords()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await resetPasswordService({
        email,
        code: otp.join(""),
        password: newPassword,
        confirmPassword,
      });

      if (response.success) {
        localStorage.removeItem("resetEmail");
        toast.success("Mật khẩu đã được đặt lại thành công");
        navigate(ROUTER.LOGIN);
      } else {
        toast.error(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForgot = () => {
    localStorage.removeItem("resetEmail");
    navigate(ROUTER.FORGOT_PASSWORD);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>Nhập OTP & Mật khẩu mới</h2>

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
                className={`otp-input ${digit ? "filled" : ""}`}
                disabled={isLoading}
              />
            ))}
          </div>

          <div
            className={`input-group password-group ${
              passwordErrors.newPassword ? "error" : ""
            }`}
          >
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChange={handleNewPasswordChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              👁
            </button>
            {passwordErrors.newPassword && (
              <div className="input-error">{passwordErrors.newPassword}</div>
            )}
          </div>

          <div
            className={`input-group password-group ${
              passwordErrors.confirmPassword ? "error" : ""
            }`}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              👁
            </button>
            {passwordErrors.confirmPassword && (
              <div className="input-error">
                {passwordErrors.confirmPassword}
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <button
          type="button"
          className="back-button"
          onClick={handleBackToForgot}
        >
          ← Quay lại
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
