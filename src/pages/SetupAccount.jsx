import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { pinAPI, userAPI } from "../services/api";
import { getUserInfoFromToken } from "../utils/tokenUtils";
import Skeleton from "../components/Skeleton";
import "../styles/components/SetupAccount.css";

const SetupAccount = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [usernameValidating, setUsernameValidating] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [checkingExistingUser, setCheckingExistingUser] = useState(true);
  const [existingUserData, setExistingUserData] = useState(null);
  const [isPinOnlySetup, setIsPinOnlySetup] = useState(false);

  const navigate = useNavigate();

  // Check if user already has a username setup
  useEffect(() => {
    const checkExistingUserSetup = async () => {
      try {
        let userData = null;

        // First check from token
        const tokenUserInfo = getUserInfoFromToken();

        // Then check from API for more complete data
        try {
          const currentUser = await userAPI.getCurrentUser();
          const userInfo = await userAPI.getUserInfo();

          // Merge data from multiple sources
          userData = {
            username: currentUser?.username || tokenUserInfo?.username || "",
            fullName:
              currentUser?.fullName ||
              userInfo?.fullName ||
              tokenUserInfo?.fullName ||
              "",
            email: currentUser?.email || tokenUserInfo?.email || "",
            avatar: currentUser?.userAvatar || userInfo?.userAvatar || null,
          };
        } catch (error) {
          console.log(
            "Error fetching API user data, using token data:",
            error.message
          );
          userData = {
            username: tokenUserInfo?.username || "",
            fullName: tokenUserInfo?.fullName || tokenUserInfo?.name || "",
            email: tokenUserInfo?.email || "",
            avatar: null,
          };
        }

        // Check if user has all required profile data
        const hasUsername =
          userData?.username && userData.username.trim() !== "";
        const hasFullName =
          userData?.fullName && userData.fullName.trim() !== "";

        if (hasUsername && hasFullName) {
          // User has profile data, check if PIN is also setup
          try {
            const pinExists = await pinAPI.checkPinExists();
            if (pinExists.exists) {
              console.log(
                "User has complete setup (profile + PIN), redirecting to dashboard"
              );
              navigate("/dashboard");
              return;
            } else {
              console.log(
                "User has profile but no PIN, showing PIN-only setup"
              );
              setExistingUserData(userData);
              setIsPinOnlySetup(true);
              setFullName(userData.fullName);
              setUsername(userData.username);
            }
          } catch (pinError) {
            console.log(
              "Error checking PIN status, showing PIN-only setup:",
              pinError.message
            );
            setExistingUserData(userData);
            setIsPinOnlySetup(true);
            setFullName(userData.fullName);
            setUsername(userData.username);
          }
        } else if (hasUsername) {
          console.log(
            "User has username but incomplete profile, redirecting to dashboard"
          );
          navigate("/dashboard");
          return;
        }

        // If no username found, allow full setup to proceed
        setCheckingExistingUser(false);
      } catch (error) {
        console.error("Error checking existing user setup:", error);
        // On error, allow setup to proceed
        setCheckingExistingUser(false);
      }
    };

    checkExistingUserSetup();
  }, [navigate]);

  // Username validation with debounce
  const validateUsername = async (username) => {
    if (username.length < 3) {
      setUsernameStatus("Username must be at least 3 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameStatus(
        "Username can only contain letters, numbers, and underscores"
      );
      return;
    }

    setUsernameValidating(true);

    // Simulate API call to check username availability
    setTimeout(() => {
      const isAvailable = !["admin", "test", "user"].includes(
        username.toLowerCase()
      );
      if (isAvailable) {
        setUsernameStatus("✅ Username is available");
      } else {
        setUsernameStatus("❌ Username is already taken");
      }
      setUsernameValidating(false);
    }, 1000);
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setErrors({ ...errors, username: "" });

    if (value.length >= 3) {
      setTimeout(() => validateUsername(value), 500);
    } else {
      setUsernameStatus("");
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPin(value);
      setErrors({ ...errors, pin: "" });
    } else {
      setErrors({ ...errors, pin: "PIN must be 6 digits only" });
    }
  };

  const handleConfirmPinChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setConfirmPin(value);
      setErrors({ ...errors, confirmPin: "" });
    } else {
      setErrors({ ...errors, confirmPin: "PIN must be 6 digits only" });
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors({ ...errors, avatar: "File size must be less than 5MB" });
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, avatar: "Please select an image file" });
        return;
      }

      setAvatar(file);
      setErrors({ ...errors, avatar: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    if (isPinOnlySetup) {
      // For PIN-only setup, only validate PIN
      if (pin.length !== 6) {
        newErrors.pin = "PIN must be exactly 6 digits";
      }

      if (confirmPin !== pin) {
        newErrors.confirmPin = "PINs do not match";
      }
    } else {
      // For full setup, validate all fields
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }

      if (!username.trim()) {
        newErrors.username = "Username is required";
      } else if (usernameStatus.includes("❌")) {
        newErrors.username = "Please choose a different username";
      }

      if (pin.length !== 6) {
        newErrors.pin = "PIN must be exactly 6 digits";
      }

      if (confirmPin !== pin) {
        newErrors.confirmPin = "PINs do not match";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      if (isPinOnlySetup) {
        // Only create PIN
        await pinAPI.createPin(pin);
      } else {
        // Full setup: update profile and create PIN
        await userAPI.updateUsername(username);
        const profileData = { displayName: fullName };
        await userAPI.updateProfile(profileData, avatar);
        await pinAPI.createPin(pin);
      }

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setApiError(
        error.message || "Failed to setup account. Please try again."
      );
      setIsLoading(false);
    }
  };

  // Show loading while checking existing user setup
  if (checkingExistingUser) {
    return (
      <div className="setup-container">
        <div className="setup-card">
          <div className="setup-header">
            <div className="setup-icon">
              <div className="loading-spinner">
                <i className="ri-loader-4-line rotating"></i>
              </div>
            </div>
            <h1 className="setup-title">Checking Account Setup</h1>
            <div className="loading-text">
              <span>Please wait while we verify your account status</span>
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="setup-container">
      <div className="setup-card">
        <div className="setup-header">
          <div className="setup-icon">
            <i
              className={
                isPinOnlySetup ? "ri-lock-line" : "ri-user-settings-fill"
              }
            ></i>
          </div>
          <h1 className="setup-title">
            {isPinOnlySetup ? "Setup Security PIN" : "Complete Your Setup"}
          </h1>
          <p className="setup-subtitle">
            {isPinOnlySetup
              ? "Create a 6-digit PIN to secure your 2FA tokens"
              : "Just a few more details to secure your account"}
          </p>
        </div>

        <form className="setup-form" onSubmit={handleSubmit}>
          {isPinOnlySetup ? (
            // PIN-only setup - show existing user details as disabled inputs
            <>
              <div className="existing-user-info">
                <h3>Your Account Details</h3>
                <p>
                  The following information is already set up for your account:
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="existingFullName">Full Name</label>
                <input
                  type="text"
                  id="existingFullName"
                  className="form-input disabled"
                  value={fullName}
                  disabled
                  style={{
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="existingUsername">Username</label>
                <input
                  type="text"
                  id="existingUsername"
                  className="form-input disabled"
                  value={username}
                  disabled
                  style={{
                    backgroundColor: "#f5f5f5",
                    color: "#666",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              {existingUserData?.email && (
                <div className="form-group">
                  <label htmlFor="existingEmail">Email</label>
                  <input
                    type="email"
                    id="existingEmail"
                    className="form-input disabled"
                    value={existingUserData.email}
                    disabled
                    style={{
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            // Full setup form
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {errors.fullName && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {errors.fullName}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
                {usernameValidating && (
                  <div className="validation-message">
                    <div className="loading-text">
                      <div className="loading-spinner">
                        <i className="ri-loader-4-line rotating"></i>
                      </div>
                      <span>Checking availability</span>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                {usernameStatus && !usernameValidating && (
                  <div
                    className={`validation-message ${
                      usernameStatus.includes("✅") ? "success" : "error"
                    }`}
                  >
                    {usernameStatus}
                  </div>
                )}
                {errors.username && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {errors.username}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Profile Picture (Optional)</label>
                <div className="avatar-upload">
                  <input
                    type="file"
                    id="avatar"
                    className="avatar-input"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <label htmlFor="avatar" className="avatar-label">
                    <i className="ri-camera-fill"></i>
                    {avatar ? avatar.name : "Choose Profile Picture"}
                  </label>
                </div>
                {errors.avatar && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {errors.avatar}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="pin-section">
            <h3>Security PIN</h3>
            <p>
              {isPinOnlySetup
                ? "Create a 6-digit PIN to protect your 2FA tokens"
                : "Create a 6-digit PIN to protect your 2FA tokens"}
            </p>

            <div className="pin-inputs">
              <div className="form-group">
                <label htmlFor="pin">Create PIN</label>
                <input
                  type="password"
                  id="pin"
                  className="pin-input"
                  placeholder="••••••"
                  value={pin}
                  onChange={handlePinChange}
                  maxLength="6"
                  required
                />
                {errors.pin && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {errors.pin}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPin">Confirm PIN</label>
                <input
                  type="password"
                  id="confirmPin"
                  className="pin-input"
                  placeholder="••••••"
                  value={confirmPin}
                  onChange={handleConfirmPinChange}
                  maxLength="6"
                  required
                />
                {errors.confirmPin && (
                  <div className="error-message">
                    <i className="ri-error-warning-line"></i>
                    {errors.confirmPin}
                  </div>
                )}
              </div>
            </div>
          </div>

          {apiError && (
            <div className="api-error">
              <i className="fas fa-exclamation-triangle"></i>
              {apiError}
            </div>
          )}

          <button
            type="submit"
            className="setup-button"
            disabled={isLoading || pin.length !== 6 || confirmPin.length !== 6}
          >
            {isLoading ? (
              <>
                <Skeleton width="20px" height="20px" />
                <Skeleton
                  variant="text"
                  width={isPinOnlySetup ? "100px" : "120px"}
                />
              </>
            ) : (
              <>
                <i className="ri-check-line"></i>
                {isPinOnlySetup ? "Create PIN" : "Complete Setup"}
              </>
            )}
          </button>
        </form>

        <div className="security-info">
          <i className="ri-shield-keyhole-line"></i>
          <span>Your PIN is encrypted and stored securely using AES-256</span>
        </div>
      </div>
    </div>
  );
};

export default SetupAccount;
