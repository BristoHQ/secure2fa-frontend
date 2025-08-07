import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../services/api";
import "../styles/components/Auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  // States for step 1: Request reset
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // States for step 2: Reset with token
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: [],
    isValid: false,
  });

  // Check if we're in reset mode (have token) or request mode
  const isResetMode = !!token;

  useEffect(() => {
    // Clear any existing auth errors when component mounts
    setError("");
    setMessage("");

    // Debug: Log the token for testing
    if (token) {
      console.log("Password reset token received:", token);
      console.log("Reset mode activated");
    } else {
      console.log("Request mode - no token provided");
    }
  }, [token]);

  // Password strength checker
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength({ score: 0, feedback: [], isValid: false });
      return;
    }

    const feedback = [];
    let score = 0;

    // Length check
    if (newPassword.length >= 8) {
      score += 20;
    } else {
      feedback.push("At least 8 characters");
    }

    // Uppercase check
    if (/[A-Z]/.test(newPassword)) {
      score += 20;
    } else {
      feedback.push("One uppercase letter");
    }

    // Lowercase check
    if (/[a-z]/.test(newPassword)) {
      score += 20;
    } else {
      feedback.push("One lowercase letter");
    }

    // Number check
    if (/\d/.test(newPassword)) {
      score += 20;
    } else {
      feedback.push("One number");
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
      score += 20;
    } else {
      feedback.push("One special character");
    }

    setPasswordStrength({
      score,
      feedback,
      isValid: score >= 80 && newPassword.length >= 8,
    });
  }, [newPassword]);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await authAPI.resetPasswordRequest(email);
      setMessage(
        "Password reset instructions have been sent to your email address. Please check your inbox and spam folder."
      );
      setEmail("");
    } catch (error) {
      console.error("Password reset request error:", error);
      setError(
        error.message || "Failed to send reset email. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!passwordStrength.isValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await authAPI.resetPassword(token, newPassword);
      setMessage(
        "Password has been reset successfully! You can now log in with your new password."
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setError(
        error.message ||
          "Failed to reset password. The link may be expired or invalid."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score >= 80) return "#4CAF50";
    if (passwordStrength.score >= 60) return "#FF9800";
    if (passwordStrength.score >= 40) return "#FF5722";
    return "#F44336";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score >= 80) return "Strong";
    if (passwordStrength.score >= 60) return "Good";
    if (passwordStrength.score >= 40) return "Fair";
    return "Weak";
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-header">
          <img
            src="/src/assets/bristo-logo.webp"
            alt="BristoHQ Logo"
            className="auth-logo"
          />
          <h1>{isResetMode ? "Reset Password" : "Forgot Password"}</h1>
          <p>
            {isResetMode
              ? "Enter your new password below"
              : "Enter your email address and we'll send you instructions to reset your password"}
          </p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        )}

        {message && (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            {message}
          </div>
        )}

        {!isResetMode ? (
          // Step 1: Request reset email
          <form onSubmit={handleRequestReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
                <i className="fas fa-envelope input-icon"></i>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={isLoading || !email}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Reset Instructions
                </>
              )}
            </button>
          </form>
        ) : (
          // Step 2: Reset password with token
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              {newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength.score}%`,
                        backgroundColor: getPasswordStrengthColor(),
                      }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span
                      className="strength-text"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      {getPasswordStrengthText()}
                    </span>
                    {passwordStrength.feedback.length > 0 && (
                      <div className="strength-feedback">
                        <span>
                          Missing: {passwordStrength.feedback.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  <i
                    className={`fas ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </button>
              </div>

              {confirmPassword && newPassword !== confirmPassword && (
                <div className="password-mismatch">
                  <i className="fas fa-times-circle"></i>
                  Passwords do not match
                </div>
              )}
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={
                isLoading ||
                !passwordStrength.isValid ||
                newPassword !== confirmPassword
              }
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-key"></i>
                  Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <Link to="/login" className="auth-link">
            <i className="fas fa-arrow-left"></i>
            Back to Login
          </Link>

          {!isResetMode && (
            <Link to="/register" className="auth-link">
              Don't have an account? Register
              <i className="fas fa-arrow-right"></i>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
