import React, { useState } from "react";
import "./ForgotPasswordPage.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../utils/router";
// 🪄 import service forgot password
import { forgotPasswordService } from "../../../services/authService";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await forgotPasswordService(email);
      if (response.isSuccessed) {
        // Lưu email vào localStorage để sử dụng ở trang ResetPassword
        localStorage.setItem("resetEmail", email);

        // Chuyển hướng đến trang ResetPassword
        navigate(ROUTER.RESET_PASSWORD);
      } else {
        setError(response.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(ROUTER.LOGIN);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>Quên mật khẩu</h2>
        <p className="description">
          Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã xác minh để đặt lại
          mật khẩu.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={`input-group ${error ? "error" : ""}`}>
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <div className="input-error">{error}</div>}
          </div>

          <button
            type="submit"
            className={`submit-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading || !email}
          >
            {isLoading ? "" : "Gửi mã xác minh"}
          </button>
        </form>

        <button
          type="button"
          className="back-to-login"
          onClick={handleBackToLogin}
        >
          <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Quay lại đăng nhập
        </button>

        <div className="info-box">
          <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
          Không nhận được email? Kiểm tra thư mục spam hoặc thử lại sau vài
          phút.
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
