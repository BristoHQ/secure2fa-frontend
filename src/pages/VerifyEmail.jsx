import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import Skeleton from "../components/Skeleton";
import "../styles/components/VerifyEmail.css";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(59);
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  // Get email from localStorage or redirect to register
  useEffect(() => {
    const email = localStorage.getItem("registrationEmail");
    if (!email) {
      navigate("/register");
      return;
    }
    setUserEmail(email);
  }, [navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
      setError("");
    } else {
      setError("Please enter only numbers");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authAPI.verifyOTP(userEmail, otp);

      // Clear registration email and navigate to setup
      localStorage.removeItem("registrationEmail");
      navigate("/setup-account");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(59);
    setError("");

    let res;
    try {
      res = await authAPI.resendOTP(userEmail);
      console.log("OTP resent successfully:", res);
    } catch (err) {
      console.log("OTP err:", err);
      setError(err.message || "Failed to resend OTP. Please try again.");
      setCanResend(true);
      setResendTimer(0);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <div className="verify-header">
          <div className="verify-icon">
            <i className="ri-mail-check-fill"></i>
          </div>
          <h1 className="verify-title">Verify Your Email</h1>
          <p className="verify-subtitle">
            We've sent a 6-digit verification code to
          </p>
          <p className="user-email">{userEmail}</p>
        </div>

        <form className="verify-form" onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <input
              type="text"
              className="otp-input"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              autoComplete="one-time-code"
              autoFocus
            />
            {error && (
              <div className="error-message">
                <i className="ri-error-warning-line"></i>
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="verify-button"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? (
              <>
                <Skeleton width="20px" height="20px" />
                <Skeleton variant="text" width="80px" />
              </>
            ) : (
              <>
                <i className="ri-check-line"></i>
                Verify OTP
              </>
            )}
          </button>

          <div className="resend-section">
            <button
              type="button"
              className={`resend-button ${!canResend ? "disabled" : ""}`}
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
            </button>
          </div>
        </form>

        <div className="security-info">
          <i className="ri-information-line"></i>
          <span>Check your spam folder if you don't receive the email</span>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
