import { Form, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await registerUser(values);
      dispatch(HideLoading());

      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="login-root">

      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-card">

          {/* LOGO */}
          <div className="login-logo">
            <img
              src="/logo-obg.webp"
              alt="ENEGO Logo"
              className="login-logo-img"
            />
          </div>

          <h1>Create Your Account</h1>
          <p className="subtitle">
            Join ENEGO to unlock smarter MSME funding opportunities.
          </p>

          <Form layout="vertical" onFinish={onFinish}>

            <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
              <div className="input-wrapper">
                <input type="text" placeholder="Enter your full name" />
              </div>
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <div className="input-wrapper">
                <input type="email" placeholder="Enter your email" />
              </div>
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                />
                <i
                  className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                  style={{ cursor: "pointer", marginLeft: "auto", paddingLeft: 8 }}
                  onClick={() => setShowPassword((v) => !v)}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                ></i>
              </div>
            </Form.Item>

            <button type="submit" className="login-btn">
              Create Account
            </button>

            <p style={{ marginTop: "18px", fontSize: "14px", textAlign: "center" }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#C41E3A", fontWeight: 500 }}>
                Sign In
              </Link>
            </p>

          </Form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="right-content">

          <h2>
            Start Your <br />
            Funding Journey <br />
            <span>With Confidence</span>
          </h2>

          <p className="quote">
            “Thousands of MSMEs trust ENEGO to access faster,
            transparent, and digital-first funding solutions.”
          </p>

          <div className="profile">
            <div className="trust-badge">✓</div>
            <div>
              <strong>Trusted MSME Platform</strong>
              <span>Empowering Businesses Across India</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;
