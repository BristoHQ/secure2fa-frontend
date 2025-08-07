import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import { getUserInfoFromToken, cleanupLocalStorage } from "../utils/tokenUtils";
import { usePinStatus } from "../hooks/usePinStatus";
// import { resetPinReminderSettings } from "../hooks/usePinStatus";
import { SkeletonPage } from "../components/Skeleton";
import "../styles/components/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [originalUserInfo, setOriginalUserInfo] = useState(null); // Store original data for comparison
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    avatar: null,
    avatarFile: null, // Store the actual file for upload
    displayName: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    autoLogout: "30",
  });

  // Get PIN status
  const { hasPinSetup, loading: pinStatusLoading } = usePinStatus();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setApiError("");

        // Try to get current user first
        let currentUser = null;
        let userInfo = null;

        try {
          currentUser = await userAPI.getCurrentUser();
          console.log("Profile - Current user data:", currentUser);
        } catch (error) {
          console.error("Error fetching current user:", error);
        }

        try {
          userInfo = await userAPI.getUserInfo();
          console.log("Profile - User info data:", userInfo);
        } catch (error) {
          console.error("Error fetching user info:", error);
        }

        // If we got at least some data, use it
        if (currentUser || userInfo) {
          const userData = {
            username: currentUser?.username || "",
            email: currentUser?.email || "",
            fullName:
              currentUser?.fullName ||
              userInfo?.fullName ||
              userInfo?.displayName ||
              currentUser?.displayName ||
              "",
            phoneNumber: userInfo?.phoneNumber || userInfo?.recoveryPhone || "",
            avatar:
              currentUser?.userAvatar ||
              userInfo?.userAvatar ||
              userInfo?.avatar ||
              null,
            avatarFile: null, // For file uploads
            displayName:
              currentUser?.fullName ||
              userInfo?.fullName ||
              userInfo?.displayName ||
              currentUser?.displayName ||
              "",
          };

          console.log("Profile - Processed user data:", userData);
          setUserInfo(userData);
          setOriginalUserInfo({ ...userData }); // Store original data for comparison
        } else {
          throw new Error("Could not fetch user data from either endpoint");
        }
      } catch (error) {
        setApiError("Failed to load user data");
        console.error("Error fetching user data:", error);

        // Check if it's an authentication error
        if (error.message && error.message.includes("Authentication failed")) {
          // Clear all auth data and redirect to login
          cleanupLocalStorage();
          navigate("/login");
          return;
        }

        // Use JWT token data as fallback
        const tokenUserInfo = getUserInfoFromToken();
        const fallbackData = {
          username:
            tokenUserInfo?.username || tokenUserInfo?.preferred_username || "",
          email: tokenUserInfo?.email || "",
          fullName:
            tokenUserInfo?.fullName ||
            tokenUserInfo?.name ||
            tokenUserInfo?.username ||
            tokenUserInfo?.preferred_username ||
            "",
          phoneNumber: "",
          avatar: null,
          avatarFile: null,
          displayName:
            tokenUserInfo?.fullName ||
            tokenUserInfo?.name ||
            tokenUserInfo?.username ||
            tokenUserInfo?.preferred_username ||
            "",
        };

        setUserInfo(fallbackData);
        setOriginalUserInfo({ ...fallbackData }); // Store original data for comparison
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    try {
      setApiError("");
      setSuccessMessage("");
      setLoading(true);

      const updates = [];

      if (!originalUserInfo) {
        setApiError("No original user data to compare changes");
        return;
      }

      if (
        userInfo.username &&
        userInfo.username !== originalUserInfo.username
      ) {
        try {
          const response = await userAPI.updateUsername(userInfo.username);
          if (response.token) {
            // Update the auth token with the new one
            localStorage.setItem("authToken", response.token);
          }
          updates.push("username");
        } catch (error) {
          console.error("Error updating username:", error);
          setApiError(
            "Failed to update username. " +
              (error.message || "Please try again.")
          );
          return;
        }
      }

      if (userInfo.email && userInfo.email !== originalUserInfo.email) {
        try {
          const response = await userAPI.updateEmail(userInfo.email);
          if (response.token) {
            // Update the auth token with the new one
            localStorage.setItem("authToken", response.token);
          }
          updates.push("email");
        } catch (error) {
          console.error("Error updating email:", error);
          setApiError(
            "Failed to update email. " + (error.message || "Please try again.")
          );
          return;
        }
      }

      if (
        userInfo.fullName &&
        userInfo.fullName !== originalUserInfo.fullName
      ) {
        try {
          await userAPI.updateFullName(userInfo.fullName);
          updates.push("full name");
        } catch (error) {
          console.error("Error updating full name:", error);
          setApiError(
            "Failed to update full name. " +
              (error.message || "Please try again.")
          );
          return;
        }
      }

      if (
        userInfo.phoneNumber &&
        userInfo.phoneNumber !== originalUserInfo.phoneNumber
      ) {
        try {
          await userAPI.updateRecoveryPhone(userInfo.phoneNumber);
          updates.push("phone number");
        } catch (error) {
          console.error("Error updating phone number:", error);
          setApiError(
            "Failed to update phone number. " +
              (error.message || "Please try again.")
          );
          return;
        }
      }

      if (userInfo.avatarFile) {
        try {
          await userAPI.updateAvatar(userInfo.avatarFile);
          updates.push("avatar");
        } catch (error) {
          console.error("Error updating avatar:", error);
          setApiError(
            "Failed to update avatar. " + (error.message || "Please try again.")
          );
          return;
        }
      }

      if (updates.length > 0) {
        setSuccessMessage(`Successfully updated: ${updates.join(", ")}`);
        setApiError("");
        setTimeout(() => setSuccessMessage(""), 3000);

        const updatedUserInfo = { ...userInfo };
        if (userInfo.avatarFile) {
          updatedUserInfo.avatarFile = null;
        }
        setOriginalUserInfo(updatedUserInfo);
        setUserInfo(updatedUserInfo);
      } else {
        setApiError("No changes detected to save.");
      }

      setIsEditing(false);
    } catch (error) {
      setApiError("Failed to save profile. Please try again.");
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      // Validate passwords
      if (!passwordData.currentPassword) {
        setApiError("Current password is required");
        return;
      }

      if (!passwordData.newPassword) {
        setApiError("New password is required");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setApiError("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setApiError("New password must be at least 8 characters long");
        return;
      }

      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      // Call the API to update password
      await userAPI.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setSuccessMessage("Password updated successfully");
      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating password:", error);
      if (
        error.message &&
        error.message.includes("Current password is incorrect")
      ) {
        setApiError("Current password is incorrect");
      } else {
        setApiError(
          "Failed to update password. " + (error.message || "Please try again.")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySettingChange = (setting, value) => {
    setSecuritySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserInfo((prev) => ({
          ...prev,
          avatar: e.target.result, // For preview
          avatarFile: file, // Store the actual file for upload
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <>
          <h1>Loading...</h1>
        </>
      ) : (
        <div className="profile-content-wrapper">
          <div className="profile-header">
            <h1>Profile Settings</h1>
            <p>Manage your account settings and security preferences</p>
          </div>

          {apiError && (
            <div className="api-error">
              <i className="fas fa-exclamation-triangle"></i>
              {apiError}
            </div>
          )}

          {successMessage && (
            <div className="api-success">
              <i className="fas fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          <div className="profile-tabs">
            <button
              className={`tab-button ${
                activeTab === "account" ? "active" : ""
              }`}
              onClick={() => setActiveTab("account")}
            >
              <i className="fas fa-user"></i>
              Account
            </button>
            <button
              className={`tab-button ${
                activeTab === "preferences" ? "active" : ""
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              <i className="fas fa-cog"></i>
              Preferences
            </button>
          </div>

          <div className="profile-content">
            {activeTab === "account" && (
              <div className="account-tab">
                <div className="profile-card">
                  <div className="card-header">
                    <h2>Account Information</h2>
                    <button
                      className="edit-button"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <i
                        className={`fas ${isEditing ? "fa-times" : "fa-edit"}`}
                      ></i>
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  <div className="avatar-section">
                    <div className="avatar-container">
                      <img
                        src={userInfo.avatar || "/src/assets/my-av.webp"}
                        alt="Profile Avatar"
                        className="profile-avatar"
                      />
                      {isEditing && (
                        <div className="avatar-overlay">
                          <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="avatar-input"
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="avatar-upload-label"
                          >
                            <i className="fas fa-camera"></i>
                            Change
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-groups">
                    <div className="form-group">
                      <label>Username</label>
                      <input
                        type="text"
                        value={userInfo.username}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={userInfo.fullName}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={userInfo.phoneNumber}
                        onChange={(e) =>
                          setUserInfo((prev) => ({
                            ...prev,
                            phoneNumber: e.target.value,
                          }))
                        }
                        disabled={!isEditing}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>PIN Status</label>
                      <input
                        type="text"
                        value={
                          pinStatusLoading
                            ? "Loading..."
                            : hasPinSetup
                            ? "✅ PIN Setup Complete"
                            : "❌ PIN Not Setup"
                        }
                        disabled={true}
                        className="form-input pin-status-input"
                        style={{
                          color: hasPinSetup ? "#4caf50" : "#f44336",
                          fontWeight: "500",
                        }}
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="action-buttons">
                      <button
                        onClick={handleSaveProfile}
                        className="save-button"
                      >
                        <i className="fas fa-check"></i>
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-card">
                  <div className="card-header">
                    <h2>Password</h2>
                    <button
                      className="change-password-button"
                      onClick={() => setShowChangePassword(!showChangePassword)}
                    >
                      <i className="fas fa-key"></i>
                      Change Password
                    </button>
                  </div>

                  <div className="password-options">
                    <Link
                      to="/forgot-password"
                      className="forgot-password-link"
                    >
                      <i className="fas fa-question-circle"></i>
                      Forgot your password?
                    </Link>
                  </div>

                  {showChangePassword && (
                    <div className="password-change-form">
                      <div className="form-group">
                        <label>Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="form-input"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div className="form-group">
                        <label>New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="form-input"
                          placeholder="Enter new password"
                        />
                        {passwordData.newPassword &&
                          passwordData.newPassword.length < 8 && (
                            <div className="password-hint">
                              <i className="fas fa-info-circle"></i>
                              Password must be at least 8 characters long
                            </div>
                          )}
                      </div>

                      <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="form-input"
                          placeholder="Confirm new password"
                        />
                        {passwordData.confirmPassword &&
                          passwordData.newPassword !==
                            passwordData.confirmPassword && (
                            <div className="password-error">
                              <i className="fas fa-exclamation-triangle"></i>
                              Passwords do not match
                            </div>
                          )}
                      </div>

                      <div className="action-buttons">
                        <button
                          onClick={handlePasswordChange}
                          className="save-button"
                          disabled={
                            loading ||
                            !passwordData.currentPassword ||
                            !passwordData.newPassword ||
                            !passwordData.confirmPassword ||
                            passwordData.newPassword !==
                              passwordData.confirmPassword ||
                            passwordData.newPassword.length < 8
                          }
                        >
                          <i
                            className={`fas ${
                              loading ? "fa-spinner fa-spin" : "fa-check"
                            }`}
                          ></i>
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                        <button
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                            setApiError("");
                          }}
                          className="cancel-button"
                          disabled={loading}
                        >
                          <i className="fas fa-times"></i>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="preferences-tab">
                <div className="profile-card">
                  <div className="card-header">
                    <h2>Notifications</h2>
                  </div>

                  <div className="security-option">
                    <div className="option-info">
                      <h3>Email Notifications</h3>
                      <p>Receive security alerts and updates via email</p>
                    </div>
                    <div className="option-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={securitySettings.emailNotifications}
                          onChange={(e) =>
                            handleSecuritySettingChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>

                  <div className="security-option">
                    <div className="option-info">
                      <h3>SMS Notifications</h3>
                      <p>Receive security alerts via text message</p>
                    </div>
                    <div className="option-toggle">
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={securitySettings.smsNotifications}
                          onChange={(e) =>
                            handleSecuritySettingChange(
                              "smsNotifications",
                              e.target.checked
                            )
                          }
                          // Disable toggle
                          disabled
                        />
                        <span
                          className="toggle-slider"
                          style={{ cursor: "not-allowed" }}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="profile-card">
                  <div className="card-header">
                    <h2>Account Actions</h2>
                  </div>

                  <div className="danger-zone">
                    <div className="danger-option">
                      <div className="option-info">
                        <h3>Download Data</h3>
                        <p>Download a copy of your account data</p>
                      </div>
                      <button className="export-button" disabled>
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                    </div>

                    <div className="danger-option">
                      <div className="option-info">
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all data</p>
                      </div>
                      <button className="delete-button">
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="profile-footer">
        <Link to="/dashboard" className="back-link">
          <i className="fas fa-arrow-left"></i>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Profile;
