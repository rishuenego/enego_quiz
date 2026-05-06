import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { LanguageSelect } from "../i18n/LanguageContext";
import GoogleTranslate from "./GoogleTranslate";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    // {
    //   title: "Profile",
    //   paths: ["/profile"],
    //   icon: <i className="ri-user-line"></i>,
    //   onClick: () => navigate("/profile"),
    // },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Users",
      paths: ["/admin/users"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/admin/users"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Live Monitor",
      paths: ["/admin/monitor"],
      icon: <i className="ri-eye-line"></i>,
      onClick: () => navigate("/admin/monitor"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
        // Check if user has permission to access current route
        checkRouteAuthorization(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  // Check route authorization
  const checkRouteAuthorization = (userData) => {
    const currentPath = window.location.pathname;
    const isAdminRoute = currentPath.startsWith('/admin/');
    const isUserAdmin = userData?.isAdmin;

    if (isAdminRoute && !isUserAdmin) {
      message.error("You don't have permission to access this page");
      navigate("/");
      setAuthorized(false);
      return false;
    }
    setAuthorized(true);
    return true;
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  // Check route authorization when user data is available
  useEffect(() => {
    if (user) {
      checkRouteAuthorization(user);
    } else {
      // If no user data yet, allow rendering (will be checked after user loads)
      const currentPath = window.location.pathname;
      const isAdminRoute = currentPath.startsWith('/admin/');
      setAuthorized(!isAdminRoute);
    }
  }, [user]);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/admin/exams/edit") &&
        paths.includes("/admin/exams")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/user/write-exam") &&
        paths.includes("/user/write-exam")
      ) {
        return true;
      }
    }
    return false;
  };

  // Don't render if user is not authorized for this route
  if (!authorized) {
    return null;
  }

  return (
    <div className="enego-layout">
      <div className="enego-shell">
  
        {/* SIDEBAR */}
        <aside className={`enego-sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="sidebar-logo">
            <img src="/logo-obg.webp" alt="ENEGO" />
          </div>
  
          <nav className="sidebar-menu">
            {menu.map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${
                  getIsActiveOrNot(item.paths) ? "active" : ""
                }`}
                onClick={item.onClick}
              >
                {item.icon}
                <span className="sidebar-text">{item.title}</span>
              </div>
            ))}

            {/* COLLAPSE TOGGLE INSIDE SIDEBAR */}
            <div className="sidebar-toggle-item" onClick={() => setCollapsed(!collapsed)}>
              <i className={collapsed ? "ri-arrow-right-s-line" : "ri-arrow-left-s-line"}></i>
              <span className="sidebar-text">Collapse Sidebar</span>
            </div>
          </nav>
        </aside>
  
        {/* MAIN */}
        <main className="enego-main">
  
          {/* HEADER */}
          <header className="enego-header">
            <div className="left flex items-center gap-2">
               <div className="welcome-text">
                 <p className="text-xs text-muted mb-0">Platform Access</p>
                 <h2 className="text-lg" style={{ background: "none", WebkitTextFillColor: "initial", color: "var(--text-main)", fontSize: "18px" }}>
                   {user?.isAdmin ? "Administrative Dashboard" : "Student Assessment Portal"}
                 </h2>
               </div>
            </div>
  
            <div className="right flex items-center gap-4">
              <div className="lang-wrapper">
                <i className="ri-translate-2 mr-2 text-primary"></i>
                <GoogleTranslate />
                <LanguageSelect style={{ border: "none", outline: "none", background: "transparent", fontWeight: 600, color: "var(--text-main)", display: "none" }} />
              </div>

              <div className="user-chip-new" onClick={() => navigate("/user/reports")} style={{ cursor: "pointer" }}>
                <div className="avatar-small">{user?.name?.[0]}</div>
                <div className="user-info-mini">
                  <span className="user-name">{user?.name}</span>
                  <span className={`status-pill ${user?.isAdmin ? "admin" : "user"}`}>
                    {user?.isAdmin ? "Admin" : "Student"}
                  </span>
                </div>
                <i className="ri-arrow-down-s-line text-muted"></i>
              </div>
            </div>
          </header>
  
          {/* CONTENT */}
          <section className="enego-content">
            {children}
          </section>
  
        </main>
      </div>
    </div>
  );
  
  
}

export default ProtectedRoute;
