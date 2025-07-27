import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, getAuthToken } from "../services/api";
import { cleanupLocalStorage } from "../utils/tokenUtils";
import Skeleton from "../components/Skeleton";
import "../styles/components/Login.css";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      try {
        // Check if token is valid and not expired
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          // Token is valid, redirect to dashboard
          navigate("/dashboard");
        }
      } catch {
        // Invalid token, continue with login
        localStorage.removeItem("authToken");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authAPI.login(emailOrUsername, password);

      // Clean up any existing insecure localStorage data
      cleanupLocalStorage();

      // Navigate to dashboard (token is already stored by authAPI.login)
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect URL should point to our token handler
    const redirectUrl = encodeURIComponent(
      `${window.location.origin}/auth/token-handler`
    );
    const googleOAuthUrl = `http://localhost:9000/oauth2/authorization/google?redirect_uri=${redirectUrl}`;
    window.location.href = googleOAuthUrl;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <i className="ri-shield-keyhole-fill"></i>
          </div>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your SecureTOTP account</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          {error && (
            <div className="error-message">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "ri-eye-off-line" : "ri-eye-line"}
                ></i>
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Skeleton width="20px" height="20px" />
                <Skeleton variant="text" width="80px" />
              </>
            ) : (
              <>
                <i className="ri-login-box-line"></i>
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="form-divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <button className="google-login-button" onClick={handleGoogleLogin}>
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
          >
            <path
              fill="#4285f4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34a853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#fbbc05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#ea4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div className="auth-links">
          <Link to="/elp-login" className="emergency-link">
            <i className="ri-key-2-line"></i>
            Emergency Login
          </Link>
        </div>

        <div className="form-footer">
          <p>
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>
        </div>

        <div className="security-info">
          <i className="ri-lock-star-line"></i>
          <span>End-to-End Encrypted • Zero-Knowledge Architecture</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
