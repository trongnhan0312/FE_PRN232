import React, { useState } from "react";
import "./SignupPage.scss";
import { useNavigate } from "react-router-dom";
import { ROUTER } from "../../../utils/router";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check password strength
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

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Registration successful:", formData);
      // Handle successful registration
    } catch (error) {
      console.error("Registration error:", error);
      // Handle registration error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Handle social login
  };

  const handleLoginRedirect = () => {
    console.log("Redirect to login");
    // Handle redirect to login page
    navigate(ROUTER.LOGIN);
  };

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
              {showPassword ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
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
            {isLoading ? "" : "Đăng ký"}
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
