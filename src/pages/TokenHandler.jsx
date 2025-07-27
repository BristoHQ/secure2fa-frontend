import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setAuthToken } from "../services/api";
import { cleanupLocalStorage } from "../utils/tokenUtils";
import "../styles/components/TokenHandler.css";

const TokenHandler = () => {
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Processing authentication...");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleOAuthToken = async () => {
      try {
        // Get token from URL parameters
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("No authentication token found in URL");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        // Validate token format (JWT should have 3 parts separated by dots)
        const tokenParts = token.split(".");
        if (tokenParts.length !== 3) {
          setStatus("error");
          setMessage("Invalid token format received");
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        try {
          // Decode and validate token payload
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Date.now() / 1000;

          // Check if token is expired
          if (payload.exp && payload.exp <= currentTime) {
            setStatus("error");
            setMessage("Authentication token has expired");
            setTimeout(() => navigate("/login"), 3000);
            return;
          }

          // Store the token and cleanup old localStorage data
          setAuthToken(token);

          // Clean up any legacy localStorage user data for security
          cleanupLocalStorage();

          setStatus("success");
          setMessage("Authentication successful! Redirecting to dashboard...");

          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } catch (decodeError) {
          console.error("Token decode error:", decodeError);
          setStatus("error");
          setMessage("Invalid token format - unable to decode");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        console.error("OAuth token handling error:", error);
        setStatus("error");
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleOAuthToken();
  }, [searchParams, navigate]);

  const handleManualRedirect = () => {
    if (status === "success") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="token-handler-container">
      <div className="token-handler-card">
        <div className="token-handler-content">
          {status === "processing" && (
            <>
              <div className="processing-icon">
                <div className="loading-spinner">
                  <i className="ri-loader-4-line rotating"></i>
                </div>
              </div>
              <h1>Processing Authentication</h1>
              <div className="loading-text">
                <span>Please wait while we verify your credentials</span>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="success-icon">
                <i className="ri-checkbox-circle-fill"></i>
              </div>
              <h1>Authentication Successful!</h1>
              <p>
                Welcome back! You will be redirected to your dashboard shortly.
              </p>
              <div className="redirect-info">
                <i className="ri-arrow-right-circle-line"></i>
                <span>Redirecting to dashboard...</span>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="error-icon">
                <i className="ri-error-warning-fill"></i>
              </div>
              <h1>Authentication Failed</h1>
              <p>{message}</p>
              <div className="redirect-info">
                <i className="ri-arrow-left-circle-line"></i>
                <span>Redirecting to login page...</span>
              </div>
            </>
          )}
        </div>

        <div className="token-handler-actions">
          {status !== "processing" && (
            <button
              className={`redirect-button ${
                status === "success" ? "success" : "error"
              }`}
              onClick={handleManualRedirect}
            >
              {status === "success" ? (
                <>
                  <i className="ri-dashboard-line"></i>
                  Go to Dashboard
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Back to Login
                </>
              )}
            </button>
          )}
        </div>

        <div className="security-info">
          <i className="ri-shield-check-line"></i>
          <span>Secure OAuth Authentication</span>
        </div>
      </div>
    </div>
  );
};

export default TokenHandler;
