import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import "./NotFound.css";

const NotFound = () => {
  const [theme] = useTheme();
  const navigate = useNavigate();

  return (
    <div className={`not-found ${theme === "light" ? "light-mode" : ""}`}>
      <div className="not-found__content">
        <span className="not-found__code" aria-hidden="true">404</span>
        <h1 className="not-found__title">Page Not Found</h1>
        <p className="not-found__desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button className="not-found__btn" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
