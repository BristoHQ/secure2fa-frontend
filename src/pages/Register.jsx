import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI, getAuthToken } from "../services/api";
import Skeleton from "../components/Skeleton";
import "../styles/components/Register.css";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
        // Invalid token, continue with registration
        localStorage.removeItem("authToken");
      }
    }
  }, [navigate]);

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength === 3) return "fair";
    if (strength === 4) return "good";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthText = {
    weak: "Weak password",
    fair: "Fair password",
    good: "Good password",
    strong: "Strong password",
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!acceptTerms) {
      setError("Please accept the terms and conditions");
      return;
    }

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.register(fullName, username, email, password);

      // Store email for OTP verification
      localStorage.setItem("registrationEmail", email);

      // Navigate to email verification
      navigate("/verify-email");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    console.log("Google registration initiated");
    // Replace with Google OAuth logic
    // Example: signUpWithGoogle()
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-icon">
            <i className="ri-user-add-fill"></i>
          </div>
          <h1 className="register-title">Create Account</h1>
          <p className="register-subtitle">
            Join SecureTOTP for enhanced 2FA security
          </p>
        </div>

        <form className="register-form" onSubmit={handleRegister}>
          {error && (
            <div className="error-message">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <div className="form-group name-group">
            <input
              type="text"
              className="form-input with-icon"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group username-group">
            <input
              type="text"
              className="form-input with-icon"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group email-group">
            <input
              type="email"
              className="form-input with-icon"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group password-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                className="form-input with-icon"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
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
            {password && (
              <div className="password-strength">
                <div className={`strength-bar strength-${passwordStrength}`}>
                  <div className="strength-fill"></div>
                </div>
                <div className="strength-text">
                  {strengthText[passwordStrength]}
                </div>
              </div>
            )}
          </div>

          <div className="terms-checkbox">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
            />
            <label htmlFor="acceptTerms">
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={isLoading || !acceptTerms}
          >
            {isLoading ? (
              <>
                <Skeleton width="20px" height="20px" />
                <Skeleton variant="text" width="120px" />
              </>
            ) : (
              <>
                <i className="ri-user-add-line"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="form-divider">
          <div className="divider-line"></div>
          <span className="divider-text">or</span>
          <div className="divider-line"></div>
        </div>

        <button className="google-login-button" onClick={handleGoogleRegister}>
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
          Sign up with Google
        </button>

        <div className="form-footer">
          <p>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>

        <div className="security-info">
          <i className="ri-shield-check-line"></i>
          <span>Your data is encrypted and secure • Zero-Knowledge</span>
        </div>
      </div>
    </div>
  );
};

export default Register;
