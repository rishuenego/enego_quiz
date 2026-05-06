// import { Form, message } from "antd";
// import React from "react";
// import { useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { loginUser } from "../../../apicalls/users";
// import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

// function Login() {
//   const dispatch = useDispatch();
//   const onFinish = async (values) => {
//     try {
//       dispatch(ShowLoading());
//       const response = await loginUser(values);
//       dispatch(HideLoading());
//       if (response.success) {
//         message.success(response.message);
//         localStorage.setItem("token", response.data);
//         window.location.href = "/";
//       } else {
//         message.error(response.message);
//       }
//     } catch (error) {
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen w-screen bg-primary">
//       <div className="card w-400 p-3 bg-white">
//         <div className="flex flex-col">
//           <div className="flex flex-col">
//             <h1 className="text-2xl">
//               Enego Schemes Quiz LOGIN <i className="ri-login-circle-line"></i>
//             </h1>

//             <p className="text-sm mt-2 text-blue-600 font-medium">
//               * Login with the same credentials you use on the Enego Scheme Portal.
//             </p>
//           </div>
//           <div className="divider"></div>
//           <Form layout="vertical" className="mt-2" onFinish={onFinish}>
//             <Form.Item name="email" label="Email">
//               <input type="text" />
//             </Form.Item>
//             <Form.Item name="password" label="Password">
//               <input type="password" />
//             </Form.Item>

//             <div className="flex flex-col gap-2">
//               <button
//                 type="submit"
//                 className="primary-contained-btn mt-2 w-100"
//               >
//                 Login
//               </button>
//               {/* <Link to="/register" className="underline">
//                 Not a member? Register
//               </Link> */}
//             </div>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;
import { Form, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { LanguageSelect, useT } from "../../../i18n/LanguageContext";

function Login() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useT();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
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

          <div className="login-logo">
            <img
              src="/logo-obg.webp"
              alt="ENEGO Logo"
              className="login-logo-img"
            />
          </div>


          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <LanguageSelect />
          </div>

          <h1>{t("login.welcome")}</h1>
          <p className="subtitle">{t("login.subtitle")}</p>

          <Form layout="vertical" onFinish={onFinish}>

            <Form.Item
              label={t("login.email")}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <div className="input-wrapper">
                <i className="ri-mail-line"></i>
                <input type="email" placeholder="Enter your email" />
              </div>
            </Form.Item>

            <Form.Item
              label={t("login.password")}
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' }
              ]}
            >
              <div className="input-wrapper">
                <i className="ri-lock-2-line"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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

            <div className="forgot" onClick={() => message.info("Please contact your administrator to reset your password.")}>
              {t("login.forgot")}
            </div>

            <button type="submit" className="login-btn">
              {t("login.submit")}
            </button>

          </Form>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
  <div className="right-content">

    <h2>
      Your Business <br />
      Deserves <br />
      <span>Funding, Not Rejection</span>
    </h2>

    <p className="quote">
      “ENEGO has transformed MSME funding with fast approvals,
      transparency, and a fully digital process.”
    </p>

    <div className="profile">
  <div className="trust-badge">✓</div>
  <div>
    <strong>Trusted MSME Platform</strong>
    <span>Serving Businesses Across India</span>
  </div>
</div>


  </div>
</div>


    </div>
  );
}

export default Login;
