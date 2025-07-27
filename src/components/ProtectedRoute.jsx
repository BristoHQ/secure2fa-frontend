import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../services/api";
import "../styles/components/ProtectedRoute.css";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = getAuthToken();

      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Decode JWT to check if it's expired
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
          // Token is expired
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch {
        // Invalid token
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="loading-text">
          <div className="loading-spinner">
            <i className="ri-loader-4-line rotating"></i>
          </div>
          <span>Checking authentication</span>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
