"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/authService";
import { ROUTER } from "../../utils/router";
import { toast } from "react-toastify";
import "./LoginPage.scss";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    // Điều hướng đến trang quên mật khẩu hoặc hiển thị modal
    console.log("Forgot password clicked");
    // navigate(ROUTER.FORGOT_PASSWORD)
    navigate(ROUTER.FORGOT_PASSWORD);
  };

  const handleRegister = () => {
    // Điều hướng đến trang đăng ký
    navigate(ROUTER.REGISTER);
    // navigate(ROUTER.REGISTER)
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const response = await loginService(email, password);
      console.log("Login success:", response);

      if (response.success) {
        const role = (response.role || "").toLowerCase();
        localStorage.setItem("roles", JSON.stringify([role]));
        toast.success("Đăng nhập thành công");

        if (role === "admin") {
          navigate(ROUTER.ADMIN);
        } else if (role === "doctor") {
          navigate(ROUTER.DOCTOR);
        } else {
          navigate(ROUTER.HOME);
        }
      } else {
        toast.error(response.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Đăng nhập</h2>

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? (
              // Eye slash icon (hide)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Eye icon (show)
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>

        <button type="submit">Đăng nhập</button>

        <div className="form-links">
          <button
            type="button"
            className="link-button forgot-password"
            onClick={handleForgotPassword}
          >
            Quên mật khẩu?
          </button>
        </div>

        <div className="divider">
          <span>hoặc</span>
        </div>

        <button
          type="button"
          className="register-button"
          onClick={handleRegister}
        >
          Tạo tài khoản mới
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
